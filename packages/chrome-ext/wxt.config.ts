// wxt.config.ts — WXT 框架配置，Chrome 插件构建入口
import { defineConfig } from 'wxt';
import { deflateSync } from 'node:zlib';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

// ── Minimal PNG encoder (pure Node.js, zero extra deps) ─────────────────────

const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = (c & 1) ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();

function crc32(buf: Buffer): number {
  let crc = 0xffffffff;
  for (const b of buf) crc = CRC_TABLE[(crc ^ b) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function pngChunk(type: string, data: Buffer): Buffer {
  const typeB = Buffer.from(type, 'ascii');
  const lenB  = Buffer.alloc(4); lenB.writeUInt32BE(data.length);
  const crcB  = Buffer.alloc(4); crcB.writeUInt32BE(crc32(Buffer.concat([typeB, data])));
  return Buffer.concat([lenB, typeB, data, crcB]);
}

function encodePNG(w: number, h: number, rgba: Uint8ClampedArray): Buffer {
  const sig  = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8; ihdr[9] = 6; // 8-bit RGBA
  const rows: number[] = [];
  for (let y = 0; y < h; y++) {
    rows.push(0); // filter: None
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      rows.push(rgba[i], rgba[i + 1], rgba[i + 2], rgba[i + 3]);
    }
  }
  const idat = deflateSync(Buffer.from(rows));
  return Buffer.concat([sig, pngChunk('IHDR', ihdr), pngChunk('IDAT', idat), pngChunk('IEND', Buffer.alloc(0))]);
}

// ── Icon renderer (SDF + anti-aliasing) ─────────────────────────────────────

type RGB = readonly [number, number, number];

function smoothstep(a: number, b: number, x: number): number {
  const t = Math.min(Math.max((x - a) / (b - a), 0), 1);
  return t * t * (3 - 2 * t);
}

/**
 * Renders a rounded-square icon with three ascending signal bars.
 * Anti-aliased edges via signed-distance-functions.
 *
 * bg  – background fill colour
 * Bars and inner highlight are always white.
 */
function renderIcon(size: number, bg: RGB): Uint8ClampedArray {
  const rgba = new Uint8ClampedArray(size * size * 4);
  const half = size * 0.5;
  const cr   = size * 0.22; // corner radius ≈ 22 %

  // Rounded-rectangle SDF
  function sdfRR(px: number, py: number): number {
    const qx = Math.abs(px - half) - (half - cr);
    const qy = Math.abs(py - half) - (half - cr);
    return Math.sqrt(Math.max(qx, 0) ** 2 + Math.max(qy, 0) ** 2)
      + Math.min(Math.max(qx, qy), 0) - cr;
  }

  // Three vertical signal bars (short → tall, left → right)
  const bw    = size * 0.105;
  const baseY = half + size * 0.165;
  const bars  = [
    { bx: half - size * 0.185, bh: size * 0.185 },
    { bx: half,                bh: size * 0.305 },
    { bx: half + size * 0.185, bh: size * 0.425 },
  ] as const;

  // Vertical capsule SDF
  function sdfCap(px: number, py: number, bx: number, bh: number): number {
    const hw = bw / 2;
    const ty = Math.min(Math.max(py, baseY - bh + hw), baseY - hw);
    return Math.sqrt((px - bx) ** 2 + (py - ty) ** 2) - hw;
  }

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      const px  = x + 0.5;
      const py  = y + 0.5;

      const bgA = 1 - smoothstep(-1, 1, sdfRR(px, py));
      if (bgA < 0.005) continue;

      rgba[idx]     = bg[0];
      rgba[idx + 1] = bg[1];
      rgba[idx + 2] = bg[2];
      rgba[idx + 3] = Math.round(bgA * 255);

      // White bars blended over background
      let dMin = Infinity;
      for (const { bx, bh } of bars) dMin = Math.min(dMin, sdfCap(px, py, bx, bh));
      const fgA = (1 - smoothstep(-1, 1, dMin)) * bgA;
      if (fgA > 0.005) {
        rgba[idx]     = Math.round(rgba[idx]     + (255 - rgba[idx])     * fgA);
        rgba[idx + 1] = Math.round(rgba[idx + 1] + (255 - rgba[idx + 1]) * fgA);
        rgba[idx + 2] = Math.round(rgba[idx + 2] + (255 - rgba[idx + 2]) * fgA);
      }
    }
  }
  return rgba;
}

function writeIcons(variant: 'dev' | 'prod', publicDir: string): void {
  // Indigo #5B5BD6 for release, amber #F59E0B for development
  const bg: RGB = variant === 'prod' ? [91, 91, 214] : [245, 158, 11];
  mkdirSync(publicDir, { recursive: true });
  for (const size of [16, 48, 128] as const) {
    const png = encodePNG(size, size, renderIcon(size, bg));
    writeFileSync(join(publicDir, `icon-${size}-${variant}.png`), png);
  }
}

// ── WXT config ───────────────────────────────────────────────────────────────

export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  dev: {
    server: { hostname: '127.0.0.1' },
  },
  vite: ({ mode }) => ({
    plugins: [
      {
        name: 'gen-icons',
        // configResolved fires early, before WXT reads the public/ folder
        configResolved(config) {
          writeIcons(mode === 'development' ? 'dev' : 'prod', config.publicDir);
        },
      },
    ],
  }),
  manifest: ({ mode }) => {
    const v = mode === 'development' ? 'dev' : 'prod';
    return {
      name:        mode === 'development' ? 'Browser Agent [Dev]' : 'Browser Agent',
      description: '浏览器上下文感知 + 深度报告生成',
      icons: {
        16:  `icon-16-${v}.png`,
        48:  `icon-48-${v}.png`,
        128: `icon-128-${v}.png`,
      },
      action: {
        default_icon: {
          16: `icon-16-${v}.png`,
          48: `icon-48-${v}.png`,
        },
      },
      permissions: ['activeTab', 'sidePanel', 'storage', 'tabs'],
    };
  },
});

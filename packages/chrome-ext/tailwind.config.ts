// tailwind.config.ts — Tailwind CSS 配置
import type { Config } from 'tailwindcss';

export default {
  content: [
    './entrypoints/**/*.{html,tsx,ts}',
    './components/**/*.{tsx,ts}',
    './hooks/**/*.{tsx,ts}',
  ],
  theme: {
    extend: {
      animation: {
        slideDown: 'slideDown 0.3s ease-out',
      },
      keyframes: {
        slideDown: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;

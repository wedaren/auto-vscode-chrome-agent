// ImagePreview.tsx — 图片预览组件：base64/URL 缩略图渲染 + 点击 Lightbox 全屏查看
// 职责：接收 src (dataUrl/URL) 渲染缩略图（max-width 100%、圆角、阴影）；
//       点击图片弹出 Lightbox overlay 全屏显示；点击背景或 ESC 关闭 Lightbox
import React, { useState, useCallback, useEffect } from 'react';

export interface ImagePreviewProps {
  /** 图片来源：data:image/... base64 字符串或普通 URL */
  src: string;
  /** 可选 alt 文本 */
  alt?: string;
}

/**
 * ImagePreview — 图片缩略图 + Lightbox 全屏预览组件
 *
 * - 缩略图：max-width 100%、圆角、阴影，自适应 side panel 宽度
 * - 点击缩略图打开 Lightbox overlay 全屏查看原图
 * - Lightbox 点击背景区域或按 ESC 键关闭
 */
export default function ImagePreview({ src, alt = '图片预览' }: ImagePreviewProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);

  /** 打开 Lightbox */
  const openLightbox = useCallback(() => {
    setLightboxOpen(true);
  }, []);

  /** 关闭 Lightbox */
  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  /** ESC 键关闭 Lightbox */
  useEffect(() => {
    if (!lightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeLightbox();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, closeLightbox]);

  /** 阻止图片本身的点击事件冒泡到 overlay 背景 */
  const stopPropagation = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  return (
    <>
      {/* 缩略图 */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onClick={openLightbox}
        className="image-preview-thumbnail"
        style={{
          maxWidth: '100%',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
          cursor: 'pointer',
          display: 'block',
          marginTop: '4px',
          marginBottom: '4px',
        }}
      />

      {/* Lightbox overlay 全屏预览 */}
      {lightboxOpen && (
        <div
          className="image-lightbox-overlay"
          onClick={closeLightbox}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            cursor: 'zoom-out',
            padding: '16px',
          }}
        >
          {/* 关闭按钮 */}
          <button
            onClick={closeLightbox}
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              background: 'rgba(255, 255, 255, 0.15)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#fff',
              fontSize: '18px',
              lineHeight: 1,
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255, 255, 255, 0.3)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255, 255, 255, 0.15)';
            }}
            title="关闭 (ESC)"
          >
            ✕
          </button>

          {/* 全屏图片 */}
          <img
            src={src}
            alt={alt}
            onClick={stopPropagation}
            style={{
              maxWidth: '95%',
              maxHeight: '95vh',
              objectFit: 'contain',
              borderRadius: '4px',
              cursor: 'default',
              boxShadow: '0 4px 24px rgba(0, 0, 0, 0.3)',
            }}
          />
        </div>
      )}
    </>
  );
}

import React from 'react'

export default function ResponsivePicture({
  image,
  alt,
  sizes = '100vw',
  className,
  style,
  loading = 'lazy',
  decoding = 'async',
  fetchPriority,
}) {
  return (
    <picture style={{ display: 'contents' }}>
      <source type="image/avif" srcSet={image.avifSrcSet} sizes={sizes} />
      <source type="image/webp" srcSet={image.webpSrcSet} sizes={sizes} />
      <img
        src={image.fallback}
        alt={alt}
        width={image.width}
        height={image.height}
        className={className}
        style={style}
        loading={loading}
        decoding={decoding}
        {...(fetchPriority ? { fetchPriority } : {})}
      />
    </picture>
  )
}


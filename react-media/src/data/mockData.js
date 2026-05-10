// 200 image items used in Dashboard and Gallery views
export const mediaItems = Array.from({ length: 200 }, (_, i) => ({
  id: i + 1,
  name: `asset-${String(i + 1).padStart(4, '0')}.png`,
  url: `https://picsum.photos/800/600?random=${i + 1}`,
  thumbnail: `https://picsum.photos/400/300?random=${i + 1}`,
  format: 'PNG',
  type: ['image', 'video', 'document', 'audio', 'image'][i % 5],
  size: Math.floor(Math.random() * 5_242_880) + 102_400,
  intrinsicWidth:  [800, 1200, 1920, 2560, 4096][i % 5],
  intrinsicHeight: [600,  900, 1080, 1440, 2160][i % 5],
  status: ['active', 'archived', 'processing'][i % 3],
  createdAt: new Date(Date.now() - Math.random() * 31_536_000_000).toISOString(),
  uploadedBy: `user${(i % 10) + 1}@company.com`,
  tags: [`tag-${i % 8}`, `project-${i % 5}`],
  description: `Media asset number ${i + 1} — uploaded as part of the Q${(i % 4) + 1} campaign.`,
}))

export const allAssets = Array.from({ length: 10_000 }, (_, i) => ({
  id: i + 1,
  name: `asset-${String(i + 1).padStart(5, '0')}.${['jpg', 'png', 'mp4', 'pdf', 'wav'][i % 5]}`,
  type: ['image', 'video', 'document', 'audio', 'image'][i % 5],
  size: Math.floor(Math.random() * 52_428_800) + 1024,
  status: ['active', 'archived', 'processing', 'failed'][i % 4],
  createdAt: new Date(Date.now() - Math.random() * 63_072_000_000).toISOString(),
  uploadedBy: `user${(i % 20) + 1}@company.com`,
  tags: [`tag-${i % 10}`, `category-${i % 5}`],
}))

export const seedNotifications = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  type: ['upload_complete', 'processing_failed', 'storage_limit', 'new_comment'][i % 4],
  message: [
    'Upload completed successfully',
    'Processing failed — invalid codec',
    'Storage usage is at 82% of your quota',
    'New comment on "hero-banner-Q4.png"',
  ][i % 4],
  timestamp: new Date(Date.now() - i * 3_600_000).toISOString(),
  read: i > 7,
}))

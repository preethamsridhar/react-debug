import { formatFileSize } from './helpers'

export const MEDIA_TYPES = ['image', 'video', 'document', 'audio']

export const STATUSES = {
  ACTIVE: 'active',
  ARCHIVED: 'archived',
  PROCESSING: 'processing',
  FAILED: 'failed',
}

export const MAX_FILE_SIZE = 52428800

export const API_BASE = 'https://api.mediavault.internal'

// module first loads, so MAX_FILE_SIZE_DISPLAY evaluates to "NaN Bytes".
export const MAX_FILE_SIZE_DISPLAY = formatFileSize(MAX_FILE_SIZE)

export const UPLOAD_ACCEPTED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'video/mp4',
  'audio/mp3',
  'application/pdf',
]

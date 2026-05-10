import { useState, useRef } from 'react'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'audio/mp3', 'application/pdf']

const EMPTY_FORM = { name: '', description: '', tags: '', status: 'active', visibility: 'private' }

export default function UploadForm({ user, theme, onUploadComplete }) {
  const [file, setFile]         = useState(null)
  const [formData, setFormData] = useState(EMPTY_FORM)
  const [errors, setErrors]     = useState({})
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const fileInputRef            = useRef(null)

  const resetForm = () => {
    setFile(null)
    setFormData(EMPTY_FORM)
    setErrors({})
    setProgress(0)
  }

  
  const handleFileChange = (e) => {
    const selected = e.target.files?.[0]
    if (!selected) return

    
    const errs = {}
    if (selected.size > 52_428_800) {
      errs.file = 'File size exceeds 50 MB limit'
    }
    if (!ALLOWED_TYPES.includes(selected.type)) {
      errs.file = 'Only JPEG, PNG, GIF, MP4, MP3, and PDF files are allowed'
    }
    setErrors(errs)
    if (!Object.keys(errs).length) setFile(selected)
  }

  
  const onTagsInput = (value) => {
    setFormData(prev => ({ ...prev, tags: value }))
  }

  
  const submitHandler = async (e) => {
    e.preventDefault()

    
    const errs = {}
    if (!formData.name.trim())              errs.name = 'Name is required'
    if (formData.name.trim().length < 3)    errs.name = 'Name must be at least 3 characters'
    if (formData.description.length > 500)  errs.description = 'Description too long (max 500 chars)'
    if (!file)                              errs.file = 'Please select a file'

    setErrors(errs)
    if (Object.keys(errs).length) return

    setUploading(true)

    
    const progressInterval = setInterval(() => {
      setProgress(p => {
        if (p >= 90) { clearInterval(progressInterval); return 90 }
        return p + Math.random() * 8
      })
    }, 200)

    try {
      await new Promise(resolve => setTimeout(resolve, 1800)) // simulated upload

      
      const tags = formData.tags.split(',').map(t => t.trim()).filter(Boolean)
      const newAsset = {
        id: Date.now(),
        ...formData,
        tags,
        status: 'active',
        file: file.name,
        size: file.size,
        type: file.type.split('/')[0],
        createdAt: new Date().toISOString(),
        uploadedBy: user?.email || 'unknown',
      }

      clearInterval(progressInterval)
      setProgress(100)
      setTimeout(() => {
        onUploadComplete(newAsset)
        
        setFile(null)
        setFormData(EMPTY_FORM)
        setProgress(0)
        setUploading(false)
      }, 500)

    } catch {
      clearInterval(progressInterval)
      setErrors({ submit: 'Upload failed. Please try again.' })
      setUploading(false)
    }
  }

  return (
    <div className="upload-form">
      <h2 style={{ marginTop: 0, fontSize: '20px' }}>Upload Asset</h2>

      <form onSubmit={submitHandler}>

        {/* File drop zone */}
        <div className="form-group">
          <label className="form-label">
            File {file && <span style={{ fontWeight: 400, color: '#6b7280' }}>({(file.size / 1024 / 1024).toFixed(2)} MB)</span>}
          </label>
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={e => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault()
              
              const dropped = e.dataTransfer.files[0]
              if (dropped) handleFileChange({ target: { files: [dropped] } })
            }}
            style={{
              border: `2px dashed ${errors.file ? '#ef4444' : '#e5e7eb'}`,
              borderRadius: '8px', padding: '36px',
              textAlign: 'center', cursor: 'pointer',
              background: file ? '#f0fdf4' : '#fafafa',
            }}
          >
            {file
              ? <p style={{ margin: 0, color: '#10b981', fontWeight: 500 }}>✓ {file.name}</p>
              : <p style={{ margin: 0, color: '#6b7280' }}>Drop file here or click to browse</p>
            }
          </div>
          <input
            ref={fileInputRef}
            type="file"
            
            accept="image/jpeg,image/png,image/gif,video/mp4,audio/mp3,application/pdf"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          {errors.file && <p style={{ color: '#ef4444', fontSize: '13px', marginTop: '6px' }}>{errors.file}</p>}
        </div>

        {/* Name */}
        <div className="form-group">
          <label className="form-label">Asset Name *</label>
          <input
            className="form-input"
            type="text"
            value={formData.name}
            onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
            placeholder="Enter asset name"
          />
          {errors.name && <p style={{ color: '#ef4444', fontSize: '13px', marginTop: '6px' }}>{errors.name}</p>}
        </div>

        {/* Description */}
        <div className="form-group">
          <label className="form-label">
            Description
            
            <span style={{ fontWeight: 400, marginLeft: '8px', color: formData.description.length > 450 ? '#ef4444' : '#9ca3af' }}>
              ({formData.description.length}/500)
            </span>
          </label>
          <textarea
            className="form-input"
            rows={3}
            value={formData.description}
            onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
            placeholder="Describe this asset…"
            style={{ resize: 'vertical' }}
          />
          {errors.description && <p style={{ color: '#ef4444', fontSize: '13px', marginTop: '6px' }}>{errors.description}</p>}
        </div>

        {/* Tags */}
        <div className="form-group">
          <label className="form-label">Tags (comma separated)</label>
          <input
            className="form-input"
            type="text"
            value={formData.tags}
            
            onChange={e => onTagsInput(e.target.value)}
            placeholder="marketing, hero, Q4"
          />
        </div>

        {/* Status & Visibility */}
        <div style={{ display: 'flex', gap: '16px' }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Status</label>
            <select
              className="form-input"
              value={formData.status}
              onChange={e => setFormData(p => ({ ...p, status: e.target.value }))}
            >
              
              <option value="active">Active</option>
              <option value="archived">Archived</option>
              <option value="processing">Processing</option>
            </select>
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Visibility</label>
            <select
              className="form-input"
              value={formData.visibility}
              onChange={e => setFormData(p => ({ ...p, visibility: e.target.value }))}
            >
              
              <option value="private">Private</option>
              <option value="team">Team</option>
              <option value="public">Public</option>
            </select>
          </div>
        </div>

        {/* Progress bar */}
        {uploading && (
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '13px', color: '#6b7280' }}>Uploading…</span>
              <span style={{ fontSize: '13px', color: '#6b7280' }}>{Math.round(progress)}%</span>
            </div>
            <div style={{ background: '#e5e7eb', borderRadius: '4px', height: '6px', overflow: 'hidden' }}>
              <div style={{
                width: `${progress}%`,
                height: '6px',
                background: '#3b82f6',
                transition: 'width 0.3s ease',
                borderRadius: '4px',
              }} />
            </div>
          </div>
        )}

        {errors.submit && <p style={{ color: '#ef4444' }}>{errors.submit}</p>}

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={uploading}
          >
            {uploading ? 'Uploading…' : 'Upload Asset'}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              
              setFile(null)
              setFormData(EMPTY_FORM)
              setErrors({})
              setProgress(0)
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

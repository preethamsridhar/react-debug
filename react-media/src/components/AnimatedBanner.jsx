import { useEffect, useRef, useState } from 'react'

export default function AnimatedBanner({ message }) {
  const bannerRef = useRef(null)
  const textRef   = useRef(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const showTimer = setTimeout(() => {
      if (bannerRef.current) {
        bannerRef.current.style.opacity = '1'
      }
    }, 100)

    const progressTimer = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(progressTimer); return 100 }
        return Math.min(p + 2, 100)
      })
    }, 30)

    return () => {
      clearTimeout(showTimer)
      clearInterval(progressTimer)
    }
  }, [])

  useEffect(() => {
    if (!textRef.current) return
    let pos = -100

    const ticker = setInterval(() => {
      pos = pos >= 100 ? -100 : pos + 0.5
      if (textRef.current) {
        textRef.current.style.left = `${pos}%`
      }
    }, 16)

    return () => clearInterval(ticker)
  }, [])

  return (
    <div
      ref={bannerRef}
      className="animated-banner"
    >
      <div className="banner-content">
        <div className="banner-text-track">
          <span ref={textRef} className="banner-ticker" style={{ position: 'absolute' }}>
            {message || 'Welcome to MediaVault – Your digital asset management platform'}
          </span>
        </div>
        <div className="banner-progress-container">
          <div style={{
            position: 'absolute', bottom: 0, left: 0,
            height: '3px',
            width: `${progress}%`,
            background: 'rgba(255,255,255,0.6)',
            transition: 'width 0.03s linear',
          }} />
        </div>
      </div>
    </div>
  )
}

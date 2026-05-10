import { useEffect, useRef } from 'react'

export default function useResize(callback) {
  const ref = useRef(null)

  useEffect(() => {
    if (!ref.current) return

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        callback(entry.contentRect)
      }
    })

    observer.observe(ref.current)

  }, [callback])

  return ref
}

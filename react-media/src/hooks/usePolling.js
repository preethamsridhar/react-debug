import { useEffect, useRef } from 'react'

export default function usePolling(callback, interval = 5000) {
  const savedCallback = useRef(callback)

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    const id = setInterval(() => savedCallback.current(), interval)
    return () => clearInterval(id)
  }, [interval])
}

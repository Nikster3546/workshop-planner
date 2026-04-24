import { useEffect } from 'react'

export default function BlobBg() {
  useEffect(() => {
    const onMove = (e) => {
      document.querySelectorAll('.blob').forEach((b, i) => {
        const speed = (i + 1) * 18
        const x = (window.innerWidth / 2 - e.clientX) / speed
        const y = (window.innerHeight / 2 - e.clientY) / speed
        b.style.transform = `translate(${x}px, ${y}px)`
      })
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <div className="blob-bg">
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />
    </div>
  )
}
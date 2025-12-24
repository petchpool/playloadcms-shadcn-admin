'use client'

import { useEffect, useState } from 'react'

export function useScrollOffsetTop(threshold = 0) {
  const [offsetTop, setOffsetTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setOffsetTop(window.scrollY > threshold)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial check

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [threshold])

  return { offsetTop }
}


'use client'

import React, { Component, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface WebGLErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface WebGLErrorBoundaryState {
  hasError: boolean
}

export class WebGLErrorBoundary extends Component<WebGLErrorBoundaryProps, WebGLErrorBoundaryState> {
  constructor(props: WebGLErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: unknown) {
    console.warn('WebGL render error caught by boundary:', error)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || null
    }
    return this.props.children
  }
}

export function WebGLFallback({
  className,
  message = 'This carousel needs WebGL, which is unavailable in this browser.',
}: {
  className?: string
  message?: string
}) {
  return (
    <div
      className={cn(
        'flex items-center justify-center p-6 text-center text-sm text-neutral-400 bg-neutral-900/60 rounded-xl',
        className
      )}
    >
      <p>{message}</p>
    </div>
  )
}

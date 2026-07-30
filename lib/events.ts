// lib/events.ts
// Custom event bus for Concierge agent → UI action communication

export type AgentEventType =
  | 'scrollToSection'
  | 'highlightEvent'
  | 'highlightScheduleRow'
  | 'filterEventsByTrack'
  | 'openTrackCard'

export interface AgentEvent {
  type: AgentEventType
  payload: Record<string, string | boolean | number>
}

// Emit an agent-driven UI action
export function emitAgentEvent(event: AgentEvent) {
  if (typeof window === 'undefined') return
  window.dispatchEvent(
    new CustomEvent('agent:action', { detail: event })
  )
}

// Subscribe to agent UI actions (call in useEffect)
export function onAgentEvent(
  handler: (event: AgentEvent) => void
): () => void {
  if (typeof window === 'undefined') return () => {}
  const listener = (e: Event) => {
    handler((e as CustomEvent<AgentEvent>).detail)
  }
  window.addEventListener('agent:action', listener)
  return () => window.removeEventListener('agent:action', listener)
}

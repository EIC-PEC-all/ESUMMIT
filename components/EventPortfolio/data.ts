// components/EventPortfolio/data.ts
// Re-exporting from master data repository for backward compatibility

import { MASTER_EVENTS, EventItem } from '@/data/summitData'

export type PortfolioEvent = EventItem
export const PORTFOLIO_EVENTS: PortfolioEvent[] = MASTER_EVENTS

import { ArrowLeftRight, Compass, LayoutDashboard, Users, type LucideIcon } from 'lucide-react'

export interface NavItem {
  label: string
  to: string
  icon: LucideIcon
}

export const navItems: NavItem[] = [
  { label: 'Dashboard', to: '/', icon: LayoutDashboard },
  { label: 'Clients', to: '/clients', icon: Users },
  { label: 'Transaction', to: '/transactions', icon: ArrowLeftRight },
  { label: 'Explore', to: '/explore', icon: Compass },
]

const segmentLabels: Record<string, string> = {
  dashboard: 'Dashboard',
  'business-update': 'Business update',
  'mf-investors': 'Mutual fund investors',
  'fd-investors': 'FD investors',
  'aum-breakdown': 'AUM breakdown',
  'sip-investors': 'SIP investors',
  clients: 'Client Management',
  family: 'Family tree',
  transact: 'Transact',
  'auto-mandate': 'Auto mandate',
  transactions: 'Transactions',
  portfolio: 'Portfolio',
  report: 'Report',
  explore: 'Explore',
}

export interface Crumb {
  label: string
  to?: string
}

export function breadcrumbsFor(pathname: string): Crumb[] {
  const segments = pathname.split('/').filter(Boolean)
  if (segments.length === 0) return [{ label: 'Dashboard', to: '/' }]
  return segments.map((segment, index) => ({
    label: segmentLabels[segment] ?? 'Details',
    to: `/${segments.slice(0, index + 1).join('/')}`,
  }))
}

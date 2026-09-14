import { Construction } from 'lucide-react'
import { StateBlock } from './states'

export function ComingSoon({ title }: { title: string }) {
  return (
    <StateBlock icon={<Construction />} title={title} description="This screen is being built." />
  )
}

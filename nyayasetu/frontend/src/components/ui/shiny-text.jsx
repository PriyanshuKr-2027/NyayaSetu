import { cn } from '@/lib/utils'

export default function ShinyText({ text = '', className = '' }) {
  return <span className={cn('inline-block', className)}>{text}</span>
}

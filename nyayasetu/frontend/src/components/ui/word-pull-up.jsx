import { cn } from '@/lib/utils'

export default function WordPullUp({ words = '', className = '' }) {
  return <span className={cn('inline-block', className)}>{words}</span>
}

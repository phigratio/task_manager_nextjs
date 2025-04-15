import type { LucideIcon } from "lucide-react"
import * as Icons from "lucide-react"

interface TaskStatsProps {
  title: string
  count: number
  icon: string
  color: string
}

export function TaskStats({ title, count, icon, color }: TaskStatsProps) {
  // Dynamically get the icon component
  const IconComponent = Icons[icon as keyof typeof Icons] as LucideIcon

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${color}`}>
          <IconComponent className="h-6 w-6" />
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-medium text-slate-900">{title}</h3>
          <p className="text-3xl font-bold">{count}</p>
        </div>
      </div>
    </div>
  )
}

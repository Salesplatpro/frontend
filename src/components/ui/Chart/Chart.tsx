import React from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { Card } from '@/components/ui/Card'
import { Heading } from '@/components/ui/Typography'

import styles from './Chart.module.scss'

export type ChartType = 'bar' | 'pie' | 'line'

export interface ChartDatum {
  label: string
  value: number
}

export interface ChartProps {
  type: ChartType
  data: ChartDatum[]
  title?: string
  height?: number
  /** Defaults to a small palette built from the app's own color tokens. */
  colors?: string[]
}

const DEFAULT_COLORS = [
  'var(--color-brand-500)',
  'var(--color-success-600)',
  'var(--color-info-600)',
  'var(--color-warning-600)',
  'var(--color-danger-600)',
  'var(--color-accent-600)',
]

const axisTick = { fontSize: 'var(--text-xs)', fill: 'var(--color-text-muted)' }

export const Chart = ({
  type,
  data,
  title,
  height = 240,
  colors = DEFAULT_COLORS,
}: ChartProps) => {
  return (
    <Card className={styles.chartCard}>
      {title && (
        <Heading level={4} className={styles.title}>
          {title}
        </Heading>
      )}
      <ResponsiveContainer width="100%" height={height}>
        {type === 'pie' ? (
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="label"
              innerRadius="55%"
              outerRadius="80%"
              paddingAngle={2}>
              {data.map((entry, index) => (
                <Cell key={entry.label} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        ) : type === 'line' ? (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis
              dataKey="label"
              tick={axisTick}
              stroke="var(--color-border)"
            />
            <YAxis tick={axisTick} stroke="var(--color-border)" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="value"
              stroke={colors[0]}
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          </LineChart>
        ) : (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis
              dataKey="label"
              tick={axisTick}
              stroke="var(--color-border)"
            />
            <YAxis tick={axisTick} stroke="var(--color-border)" />
            <Tooltip />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={entry.label} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        )}
      </ResponsiveContainer>
    </Card>
  )
}

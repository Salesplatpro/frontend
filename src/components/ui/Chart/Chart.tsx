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
  '#4985df',
  '#2441ab',
  '#1e2a4d',
  '#3c6fd4',
  '#1b7b44',
  '#b54708',
]

const axisTick = { fontSize: 11, fill: '#667085' }

type TooltipPayload = {
  name?: string
  value?: number
  payload?: ChartDatum
  color?: string
}

const ChartTooltip = ({
  active,
  payload,
}: {
  active?: boolean
  payload?: TooltipPayload[]
}) => {
  if (!active || !payload?.length) return null
  const item = payload[0]
  const label = item.payload?.label ?? item.name
  return (
    <div className={styles.tooltip}>
      <span className={styles.tooltipLabel}>{label}</span>
      <span className={styles.tooltipValue}>{item.value ?? 0}</span>
    </div>
  )
}

export const Chart = ({
  type,
  data,
  title,
  height = 240,
  colors = DEFAULT_COLORS,
}: ChartProps) => {
  const total = data.reduce((sum, item) => sum + item.value, 0)

  return (
    <Card className={styles.chartCard}>
      {title && (
        <Heading level={4} className={styles.title}>
          {title}
        </Heading>
      )}
      <div className={type === 'pie' ? styles.pieLayout : undefined}>
        <ResponsiveContainer width="100%" height={height}>
          {type === 'pie' ? (
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="label"
                innerRadius="58%"
                outerRadius="82%"
                paddingAngle={3}
                stroke="none">
                {data.map((entry, index) => (
                  <Cell
                    key={entry.label}
                    fill={colors[index % colors.length]}
                  />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltip />} />
            </PieChart>
          ) : type === 'line' ? (
            <LineChart data={data}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--color-border)"
              />
              <XAxis
                dataKey="label"
                tick={axisTick}
                stroke="var(--color-border)"
              />
              <YAxis tick={axisTick} stroke="var(--color-border)" />
              <Tooltip content={<ChartTooltip />} />
              <Line
                type="monotone"
                dataKey="value"
                stroke={colors[0]}
                strokeWidth={3}
                dot={{ r: 4, fill: colors[0] }}
              />
            </LineChart>
          ) : (
            <BarChart data={data}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--color-border)"
              />
              <XAxis
                dataKey="label"
                tick={axisTick}
                stroke="var(--color-border)"
              />
              <YAxis tick={axisTick} stroke="var(--color-border)" />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell
                    key={entry.label}
                    fill={colors[index % colors.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
        <ul className={styles.legend}>
          {data.map((item, index) => {
            const pct = total > 0 ? Math.round((item.value / total) * 100) : 0
            return (
              <li key={item.label} className={styles.legendItem}>
                <span
                  className={styles.swatch}
                  style={{ background: colors[index % colors.length] }}
                />
                <span className={styles.legendLabel}>{item.label}</span>
                <span className={styles.legendValue}>
                  {item.value}
                  {type === 'pie' ? ` · ${pct}%` : ''}
                </span>
              </li>
            )
          })}
        </ul>
      </div>
    </Card>
  )
}

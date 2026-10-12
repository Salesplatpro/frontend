import React from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  TooltipContentProps,
  XAxis,
  YAxis,
} from 'recharts'

import { shortDate } from './shortDate'
import styles from './TrendChart.module.scss'

export interface TrendSeries {
  key: string
  label: string
  color: string
}

type TrendChartProps = {
  data: Array<Record<string, number | string>>
  series: TrendSeries[]
  ariaLabel: string
  height?: number
  formatValue?: (value: number) => string
}

const axisTick = { fontSize: 11, fill: 'var(--color-text-muted)' }

const defaultFormat = (value: number) => value.toLocaleString('en-US')

export const TrendChart = ({
  data,
  series,
  ariaLabel,
  height = 240,
  formatValue = defaultFormat,
}: TrendChartProps) => {
  const renderTooltip = ({ active, payload, label }: TooltipContentProps) => {
    if (!active || !payload?.length) return null
    return (
      <div className={styles.tooltip}>
        <span className={styles.tooltipDate}>{shortDate(String(label))}</span>
        {series.map((item) => {
          const entry = payload.find((p) => String(p.dataKey) === item.key)
          return (
            <span key={item.key} className={styles.tooltipRow}>
              <span
                className={styles.swatch}
                style={{ background: item.color }}
              />
              <span className={styles.tooltipLabel}>{item.label}</span>
              <span className={styles.tooltipValue}>
                {formatValue(Number(entry?.value ?? 0))}
              </span>
            </span>
          )
        })}
      </div>
    )
  }

  return (
    <figure className={styles.figure}>
      {series.length > 1 && (
        <ul className={styles.legend}>
          {series.map((item) => (
            <li key={item.key} className={styles.legendItem}>
              <span
                className={styles.swatch}
                style={{ background: item.color }}
              />
              {item.label}
            </li>
          ))}
        </ul>
      )}
      <div role="img" aria-label={ariaLabel}>
        <ResponsiveContainer width="100%" height={height}>
          <AreaChart
            data={data}
            margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
            <CartesianGrid
              vertical={false}
              stroke="var(--color-border)"
              strokeOpacity={0.7}
            />
            <XAxis
              dataKey="date"
              tick={axisTick}
              tickFormatter={shortDate}
              tickLine={false}
              axisLine={{ stroke: 'var(--color-border)' }}
              minTickGap={32}
            />
            <YAxis
              tick={axisTick}
              tickFormatter={(value: number) => formatValue(value)}
              allowDecimals={false}
              tickLine={false}
              axisLine={false}
              width={48}
            />
            <Tooltip
              content={renderTooltip}
              cursor={{ stroke: 'var(--color-border-strong)' }}
            />
            {series.map((item) => (
              <Area
                key={item.key}
                type="monotone"
                dataKey={item.key}
                stroke={item.color}
                strokeWidth={2}
                fill={item.color}
                fillOpacity={0.1}
                dot={false}
                activeDot={{
                  r: 4,
                  fill: item.color,
                  stroke: 'var(--color-bg-elevated)',
                  strokeWidth: 2,
                }}
                isAnimationActive={false}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <table className={styles.srOnly}>
        <caption>{ariaLabel}</caption>
        <thead>
          <tr>
            <th scope="col">Date</th>
            {series.map((item) => (
              <th key={item.key} scope="col">
                {item.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={String(row.date)}>
              <th scope="row">{String(row.date)}</th>
              {series.map((item) => (
                <td key={item.key}>{formatValue(Number(row[item.key]))}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  )
}

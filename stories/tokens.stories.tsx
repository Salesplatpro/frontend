import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

const meta: Meta = {
  title: 'Design Tokens',
  parameters: {
    layout: 'padded',
  },
}

export default meta

type Story = StoryObj

const Swatch = ({ name, token }: { name: string; token: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
    <div
      style={{
        width: '3rem',
        height: '3rem',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--color-border)',
        background: `var(${token})`,
        flexShrink: 0,
      }}
    />
    <div>
      <div style={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
        {token}
      </div>
      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
        {name}
      </div>
    </div>
  </div>
)

const Section = ({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) => (
  <section style={{ marginBottom: '2.5rem' }}>
    <h2 style={{ fontFamily: 'var(--font-heading)', marginBottom: '1rem' }}>
      {title}
    </h2>
    {children}
  </section>
)

const Grid = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
      gap: '1rem',
    }}>
    {children}
  </div>
)

const colorPrimitives = [
  ['White', '--color-white'],
  ['Brand 50', '--color-brand-50'],
  ['Brand 100', '--color-brand-100'],
  ['Brand 200', '--color-brand-200'],
  ['Brand 300', '--color-brand-300'],
  ['Brand 500', '--color-brand-500'],
  ['Brand 600', '--color-brand-600'],
  ['Brand 700', '--color-brand-700'],
  ['Brand 800', '--color-brand-800'],
  ['Grey 50', '--color-grey-50'],
  ['Grey 200', '--color-grey-200'],
  ['Grey 300', '--color-grey-300'],
  ['Grey 400', '--color-grey-400'],
  ['Grey 500', '--color-grey-500'],
  ['Grey 600', '--color-grey-600'],
  ['Grey 700', '--color-grey-700'],
  ['Grey 900', '--color-grey-900'],
  ['Charcoal', '--color-charcoal'],
  ['Midnight', '--color-midnight'],
  ['Danger 600', '--color-danger-600'],
  ['Accent 600', '--color-accent-600'],
  ['Success 600', '--color-success-600'],
  ['Info 600', '--color-info-600'],
]

const colorSemantic = [
  ['Primary', '--color-primary'],
  ['Primary hover', '--color-primary-hover'],
  ['Primary strong', '--color-primary-strong'],
  ['Primary tint', '--color-primary-tint'],
  ['Text heading', '--color-text-heading'],
  ['Text body', '--color-text-body'],
  ['Text muted', '--color-text-muted'],
  ['Text inverse', '--color-text-inverse'],
  ['Background page', '--color-bg-page'],
  ['Background subtle', '--color-bg-subtle'],
  ['Background dark', '--color-bg-dark'],
  ['Border', '--color-border'],
  ['Border strong', '--color-border-strong'],
  ['Danger', '--color-danger'],
  ['Accent', '--color-accent'],
  ['Success', '--color-success'],
  ['Info', '--color-info'],
  ['Focus ring', '--color-focus-ring'],
]

const typeScale = [
  ['xs', '--text-xs'],
  ['sm', '--text-sm'],
  ['md', '--text-md'],
  ['lg', '--text-lg'],
  ['xl', '--text-xl'],
  ['2xl', '--text-2xl'],
  ['3xl', '--text-3xl'],
  ['4xl', '--text-4xl'],
]

const spacingScale = [
  ['1', '--space-1'],
  ['2', '--space-2'],
  ['3', '--space-3'],
  ['4', '--space-4'],
  ['5', '--space-5'],
  ['6', '--space-6'],
  ['8', '--space-8'],
  ['10', '--space-10'],
  ['12', '--space-12'],
  ['16', '--space-16'],
]

const shadows = [
  ['sm', '--shadow-sm'],
  ['md', '--shadow-md'],
  ['lg', '--shadow-lg'],
  ['glow', '--shadow-glow'],
]

const radii = [
  ['sm', '--radius-sm'],
  ['md', '--radius-md'],
  ['lg', '--radius-lg'],
  ['full', '--radius-full'],
]

export const Colors: Story = {
  render: () => (
    <div>
      <Section title="Primitives">
        <Grid>
          {colorPrimitives.map(([name, token]) => (
            <Swatch key={token} name={name} token={token} />
          ))}
        </Grid>
      </Section>
      <Section title="Semantic">
        <Grid>
          {colorSemantic.map(([name, token]) => (
            <Swatch key={token} name={name} token={token} />
          ))}
        </Grid>
      </Section>
    </div>
  ),
}

export const Typography: Story = {
  render: () => (
    <Section title="Type scale">
      {typeScale.map(([name, token]) => (
        <div
          key={token}
          style={{ fontSize: `var(${token})`, marginBottom: '0.5rem' }}>
          {name} — <code>{token}</code> — The quick brown fox
        </div>
      ))}
    </Section>
  ),
}

export const Spacing: Story = {
  render: () => (
    <Section title="Spacing scale">
      {spacingScale.map(([name, token]) => (
        <div
          key={token}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '0.5rem',
          }}>
          <div
            style={{
              width: `var(${token})`,
              height: '1rem',
              background: 'var(--color-primary)',
            }}
          />
          <code>
            {token} — {name}
          </code>
        </div>
      ))}
    </Section>
  ),
}

export const Shadows: Story = {
  render: () => (
    <Section title="Shadows">
      <Grid>
        {shadows.map(([name, token]) => (
          <div
            key={token}
            style={{
              boxShadow: `var(${token})`,
              borderRadius: 'var(--radius-md)',
              padding: '1.5rem',
              textAlign: 'center',
              background: 'var(--color-white)',
            }}>
            {name} — <code>{token}</code>
          </div>
        ))}
      </Grid>
    </Section>
  ),
}

export const Radii: Story = {
  render: () => (
    <Section title="Radii">
      <Grid>
        {radii.map(([name, token]) => (
          <div
            key={token}
            style={{
              borderRadius: `var(${token})`,
              border: '1px solid var(--color-border-strong)',
              padding: '1.5rem',
              textAlign: 'center',
            }}>
            {name} — <code>{token}</code>
          </div>
        ))}
      </Grid>
    </Section>
  ),
}

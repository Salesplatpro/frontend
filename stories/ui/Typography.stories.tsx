import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { Heading, Text } from '@/components/ui/Typography'

const meta: Meta = {
  title: 'UI/Typography',
}

export default meta

type HeadingStory = StoryObj<typeof Heading>
type TextStory = StoryObj<typeof Text>

export const Headings: HeadingStory = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <Heading level={1}>Heading level 1</Heading>
      <Heading level={2}>Heading level 2</Heading>
      <Heading level={3}>Heading level 3</Heading>
      <Heading level={4}>Heading level 4</Heading>
      <Heading level={5}>Heading level 5</Heading>
      <Heading level={6}>Heading level 6</Heading>
    </div>
  ),
}

export const TextSizes: TextStory = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <Text size="fs-xs">
        fs-xs — The quick brown fox jumps over the lazy dog
      </Text>
      <Text size="fs-sm">
        fs-sm — The quick brown fox jumps over the lazy dog
      </Text>
      <Text size="fs-md">
        fs-md — The quick brown fox jumps over the lazy dog
      </Text>
      <Text size="fs-lg">
        fs-lg — The quick brown fox jumps over the lazy dog
      </Text>
      <Text size="fs-xl">
        fs-xl — The quick brown fox jumps over the lazy dog
      </Text>
      <Text size="fs-2xl">fs-2xl — The quick brown fox</Text>
      <Text size="fs-3xl">fs-3xl — The quick brown fox</Text>
      <Text size="fs-4xl">fs-4xl — The quick brown fox</Text>
      <Text size="fs-5xl">fs-5xl — The quick brown fox</Text>
    </div>
  ),
}

export const TextColors: TextStory = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <Text color="default">default</Text>
      <Text color="primary">primary</Text>
      <Text color="secondary">secondary</Text>
      <Text color="tag">tag</Text>
      <Text color="hero">hero</Text>
      <div style={{ background: 'var(--color-bg-dark)', padding: '0.5rem' }}>
        <Text color="white">white (on dark background)</Text>
      </div>
    </div>
  ),
}

export const TextWeights: TextStory = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <Text weight="normal">normal weight</Text>
      <Text weight="bold">bold weight</Text>
      <Text weight="bolder">bolder weight</Text>
    </div>
  ),
}

export const AsElement: TextStory = {
  name: 'Polymorphic "as" prop',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <Text as="p">Rendered as a paragraph</Text>
      <Text as="span">Rendered as a span</Text>
      <Text as="div">Rendered as a div</Text>
    </div>
  ),
}

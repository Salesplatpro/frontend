import React from 'react'

import { Text } from '@/components/ui/Typography'

type ImageCardProps = {
  imageUrl: string
  imgDesc: string
  title: string
  desc: string
}

export const ImageCard = ({
  imageUrl,
  imgDesc,
  title,
  desc,
}: ImageCardProps) => (
  <div className="flex flex-col gap-4">
    <img src={imageUrl} alt={imgDesc} />
    <div>
      <Text className="mb-1">{title}</Text>
      <Text>{desc}</Text>
    </div>
  </div>
)

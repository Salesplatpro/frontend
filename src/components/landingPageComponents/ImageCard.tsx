import React from 'react'

import { BaseText } from './typography'

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
      <BaseText className="mb-1">{title}</BaseText>
      <BaseText>{desc}</BaseText>
    </div>
  </div>
)

import { JdenticonConfig, toSvg } from 'jdenticon'

export const getDefaultIcon = (iconConfig: {
  id: string
  size: number
  jdenticonConfig?: JdenticonConfig
}): string => {
  const icon = toSvg(iconConfig.id, iconConfig.size, iconConfig.jdenticonConfig)
  return `data:image/svg+xml;utf8,${encodeURIComponent(icon)}`
}

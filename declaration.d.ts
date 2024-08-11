declare module '*.png' {
  const value: string
  export default value
}

declare module '*.jpg' {
  const value: string
  export default value
}

declare module '*.jpeg' {
  const value: string
  export default value
}

declare module '*.gif' {
  const value: string
  export default value
}

declare module '*.svg' {
  // eslint-disable-next-line no-undef
  const value: React.FunctionComponent<React.SVGAttributes<SVGElement>>
  export default value
}

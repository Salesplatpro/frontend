import { FormikContext } from 'formik'
import { useContext } from 'react'

import { ValidationSchemaContext } from './ValidatedForm'

type DescribedField = {
  optional?: boolean
  tests?: Array<{ name?: string; params?: Record<string, unknown> }>
  fields?: Record<string, DescribedField>
  innerType?: DescribedField
}

type DescribableSchema = {
  describe: (options?: { value?: unknown }) => DescribedField
}

/**
 * Describing a schema resolves its `.when()` branches against the current values, so the
 * result depends on both. Formik hands every field in a render pass the same schema and
 * values objects, so keying on their identity collapses this to one describe() per render
 * instead of one per field.
 */
const describedSchemas = new WeakMap<
  object,
  WeakMap<object, DescribedField | null>
>()

const describeSchema = (
  schema: DescribableSchema,
  values: object,
): DescribedField | null => {
  let byValues = describedSchemas.get(schema)
  if (!byValues) {
    byValues = new WeakMap()
    describedSchemas.set(schema, byValues)
  }

  const cached = byValues.get(values)
  if (cached !== undefined) return cached

  let described: DescribedField | null = null
  try {
    described = schema.describe({ value: values })
  } catch {
    // A schema that cannot be described (a lazy schema, or one whose conditions throw on
    // partially-filled values) simply tells us nothing about required-ness.
    described = null
  }
  byValues.set(values, described)
  return described
}

const fieldAtPath = (
  described: DescribedField,
  path: string,
): DescribedField | undefined => {
  const segments = path
    .replace(/\[(\d+)\]/g, '.$1')
    .split('.')
    .filter(Boolean)

  let node: DescribedField | undefined = described
  for (const segment of segments) {
    if (!node) return undefined
    node = /^\d+$/.test(segment) ? node.innerType : node.fields?.[segment]
  }
  return node
}

const resolveSchema = (validationSchema: unknown): DescribableSchema | null => {
  const schema =
    typeof validationSchema === 'function'
      ? (validationSchema as () => unknown)()
      : validationSchema

  return schema && typeof (schema as DescribableSchema).describe === 'function'
    ? (schema as DescribableSchema)
    : null
}

/**
 * Whether a field is required, read off the form's Yup schema so the asterisk cannot drift
 * out of sync with validation. `explicit` wins when a caller states it outright, which is
 * what forms with no schema (or fields the schema does not cover) rely on.
 */
export const useFieldRequired = (
  name?: string,
  explicit?: boolean,
): boolean => {
  const formik = useContext(FormikContext)
  const validationSchema = useContext(ValidationSchemaContext)

  if (explicit !== undefined) return explicit
  if (!formik || !name) return false

  const schema = resolveSchema(validationSchema)
  if (!schema) return false

  const described = describeSchema(schema, formik.values as object)
  if (!described) return false

  const field = fieldAtPath(described, name)
  if (!field) return false
  if (field.optional === false) return true

  // "Pick at least one" is a required field even without .required() — a multi-select or
  // checkbox group is usually written as array().min(1) instead.
  return field.tests?.some(
    (test) => test.name === 'min' && Number(test.params?.min) > 0,
  )
    ? true
    : false
}

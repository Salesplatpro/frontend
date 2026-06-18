import { WorkType } from '@/components/features/jobs/WorkTypeCheckboxes'
import { LocationFormValue } from '@/components/forms/LocationSelect'
import { FormValues } from '@/utils/jobPostTypes'

type PostJobFormValues = Omit<FormValues, 'workMode'> & { workMode: WorkType[] }

export interface ParsedJD {
  formValues: Partial<PostJobFormValues>
  extraFields: Array<{ label: string; value: string }>
}

// Patterns that map to known form fields (checked in order, first match wins)
const FIELD_PATTERNS: Array<{
  keys: RegExp
  field: keyof PostJobFormValues | 'location'
}> = [
  { keys: /^(role|job\s*title|position|title)$/i, field: 'role' },
  {
    keys: /^(job\s*brief|overview|summary|about\s*(the\s*)?role|description)$/i,
    field: 'jobBrief',
  },
  {
    keys: /^(requirements?|qualifications?|what\s*you\s*need|must\s*have)$/i,
    field: 'requirements',
  },
  {
    keys: /^(min(imum)?\s*salary|salary\s*from|base\s*salary\s*min)$/i,
    field: 'minSalary',
  },
  {
    keys: /^(max(imum)?\s*salary|salary\s*(up\s*to|to)|salary\s*range\s*max)$/i,
    field: 'maxSalary',
  },
  { keys: /^salary\s*range$/i, field: 'minSalary' },
  { keys: /^currency$/i, field: 'currency' },
  {
    keys: /^(work\s*(mode|type|arrangement)|employment\s*type|job\s*type)$/i,
    field: 'workMode',
  },
  {
    keys: /^(experience\s*(level)?|seniority(\s*level)?)$/i,
    field: 'experienceLevel',
  },
  {
    keys: /^(skills?|required\s*skills?|technical\s*skills?|key\s*skills?)$/i,
    field: 'skills',
  },
  { keys: /^(goals?|objectives?|key\s*goals?|targets?)$/i, field: 'goals' },
  {
    keys: /^(location|city|based\s*in|office\s*location)$/i,
    field: 'location',
  },
]

const CURRENCY_MAP: Record<string, string> = {
  naira: 'NGN',
  ngn: 'NGN',
  dollar: 'USD',
  usd: 'USD',
  pound: 'GBP',
  gbp: 'GBP',
  euro: 'EUR',
  eur: 'EUR',
}

const EXPERIENCE_MAP: Array<{ pattern: RegExp; value: string }> = [
  { pattern: /\b(entry|junior|0[-–]?[12]?\s*year|fresh)/i, value: '1-3 years' },
  { pattern: /\b(1[-–]3\s*year|one\s*to\s*three)/i, value: '1-3 years' },
  {
    pattern: /\b(mid([\s-]level)?|intermediate|3[-–]5\s*year|4[-–]6\s*year)/i,
    value: '4-6 years',
  },
  {
    pattern: /\b(senior|sr\.?|7[-–]10\s*year|seven\s*to\s*ten)/i,
    value: '7-10 years',
  },
  {
    pattern: /\b(lead|principal|staff|11[-–]15\s*year)/i,
    value: '11-15 years',
  },
  {
    pattern: /\b(director|vp|executive|16\+?\s*year|sixteen)/i,
    value: '16 years and above',
  },
]

const WORK_MODE_MAP: Array<{ pattern: RegExp; value: WorkType }> = [
  {
    pattern: /\b(remote|fully\s*remote|work\s*from\s*home|wfh)\b/i,
    value: 'remote',
  },
  { pattern: /\b(hybrid|partially\s*remote|flex(ible)?)\b/i, value: 'hybrid' },
  {
    pattern: /\b(on[\s-]?site|onsite|in[\s-]?office|in\s*person)\b/i,
    value: 'onSite',
  },
]

function parseCurrency(raw: string): string | undefined {
  const lower = raw.toLowerCase().trim()
  return CURRENCY_MAP[lower]
}

function parseExperienceLevel(raw: string): string | undefined {
  for (const { pattern, value } of EXPERIENCE_MAP) {
    if (pattern.test(raw)) return value
  }
  return undefined
}

function parseWorkMode(raw: string): WorkType[] {
  const modes: WorkType[] = []
  for (const { pattern, value } of WORK_MODE_MAP) {
    if (pattern.test(raw) && !modes.includes(value)) {
      modes.push(value)
    }
  }
  return modes
}

function parseList(raw: string): string[] {
  return raw
    .split(/[,\n;]+/)
    .map((s) => s.trim())
    .filter(Boolean)
}

function parseSalaryRange(raw: string): { min?: string; max?: string } {
  // Handle "50,000 - 80,000" or "50000–80000"
  const rangeMatch = raw.match(/([0-9,]+)\s*[-–]\s*([0-9,]+)/)
  if (rangeMatch) {
    return {
      min: rangeMatch[1].replace(/,/g, ''),
      max: rangeMatch[2].replace(/,/g, ''),
    }
  }
  // Single number
  const singleMatch = raw.match(/([0-9,]+)/)
  if (singleMatch) {
    return { min: singleMatch[1].replace(/,/g, '') }
  }
  return {}
}

function extractLocation(raw: string): Partial<LocationFormValue> | undefined {
  const parts = raw.split(',').map((p) => p.trim())
  if (parts.length === 0) return undefined

  const result: LocationFormValue = {
    country: { name: '', isoCode: '' },
    state: { name: '', isoCode: '' },
    city: { name: '', isoCode: '' },
  }

  if (parts.length === 1) {
    result.country = { name: parts[0], isoCode: '' }
  } else if (parts.length === 2) {
    result.city = { name: parts[0], isoCode: '' }
    result.country = { name: parts[1], isoCode: '' }
  } else {
    result.city = { name: parts[0], isoCode: '' }
    result.state = { name: parts[1], isoCode: '' }
    result.country = { name: parts[2], isoCode: '' }
  }

  return result
}

/**
 * Parses free-form job description text into structured form values.
 * Scans for "Label: Value" patterns and maps known labels to form fields.
 * Unknown labels are returned as extraFields.
 */
export function parseJobDescription(text: string): ParsedJD {
  const formValues: Partial<PostJobFormValues> = {}
  const extraFields: Array<{ label: string; value: string }> = []

  // Split on lines that look like "Key: value" — the key ends at the first colon
  // We capture multi-line values up to the next key or end of string
  const segments = text.split(/\n(?=[A-Za-z][^:\n]{0,60}:)/g)

  for (const segment of segments) {
    const colonIdx = segment.indexOf(':')
    if (colonIdx === -1) continue

    const rawKey = segment.slice(0, colonIdx).trim()
    const rawValue = segment.slice(colonIdx + 1).trim()

    if (!rawKey || !rawValue) continue

    const match = FIELD_PATTERNS.find(({ keys }) => keys.test(rawKey))

    if (!match) {
      extraFields.push({ label: rawKey, value: rawValue })
      continue
    }

    switch (match.field) {
      case 'role':
        formValues.role = rawValue
        break

      case 'jobBrief':
        formValues.jobBrief = rawValue
        break

      case 'requirements':
        formValues.requirements = rawValue
        break

      case 'minSalary': {
        const parsed = parseSalaryRange(rawValue)
        if (parsed.min) formValues.minSalary = parsed.min
        if (parsed.max) formValues.maxSalary = parsed.max
        break
      }

      case 'maxSalary': {
        const num = rawValue.replace(/[^0-9]/g, '')
        if (num) formValues.maxSalary = num
        break
      }

      case 'currency': {
        const mapped = parseCurrency(rawValue)
        if (mapped) formValues.currency = mapped
        else if (
          ['NGN', 'USD', 'GBP', 'EUR'].includes(rawValue.toUpperCase())
        ) {
          formValues.currency = rawValue.toUpperCase()
        }
        break
      }

      case 'workMode': {
        const modes = parseWorkMode(rawValue)
        if (modes.length > 0) formValues.workMode = modes
        break
      }

      case 'experienceLevel': {
        const level = parseExperienceLevel(rawValue)
        if (level) formValues.experienceLevel = level
        break
      }

      case 'skills':
        formValues.skills = parseList(rawValue)
        break

      case 'goals':
        formValues.goals = parseList(rawValue)
        break

      case 'location': {
        const loc = extractLocation(rawValue)
        if (loc) formValues.location = loc as LocationFormValue
        break
      }
    }
  }

  return { formValues, extraFields }
}

export const MBTI_DICHOTOMIES = [
  {
    letters: 'E / I',
    title: 'Extraversion / Introversion',
    meaning: 'Where they draw energy — people and action, or quiet reflection.',
  },
  {
    letters: 'S / N',
    title: 'Sensing / Intuition',
    meaning:
      'How they take in information — concrete facts, or patterns and possibility.',
  },
  {
    letters: 'T / F',
    title: 'Thinking / Feeling',
    meaning: 'How they decide — logic and criteria, or people and values.',
  },
  {
    letters: 'J / P',
    title: 'Judging / Perceiving',
    meaning: 'How they work — planned structure, or flexible adapting.',
  },
] as const

export const MBTI_TYPES: { type: string; summary: string }[] = [
  {
    type: 'INTJ',
    summary: 'Independent strategist. Plans far ahead, high standards.',
  },
  {
    type: 'INTP',
    summary: 'Curious analyst. Questions assumptions, loves models.',
  },
  {
    type: 'ENTJ',
    summary: 'Decisive lead. Organizes people around a clear goal.',
  },
  { type: 'ENTP', summary: 'Inventive debater. Stress-tests ideas out loud.' },
  {
    type: 'INFJ',
    summary: 'Insightful counselor. Reads people, holds a long vision.',
  },
  {
    type: 'INFP',
    summary: 'Values-led idealist. Protects meaning in the work.',
  },
  {
    type: 'ENFJ',
    summary: 'Warm organizer. Coaches others toward a shared outcome.',
  },
  {
    type: 'ENFP',
    summary: 'Energetic connector. Sparks possibilities and people.',
  },
  {
    type: 'ISTJ',
    summary: 'Reliable operator. Follows through on process and detail.',
  },
  {
    type: 'ISFJ',
    summary: 'Steady supporter. Remembers needs, keeps the team whole.',
  },
  { type: 'ESTJ', summary: 'Practical manager. Sets order, drives delivery.' },
  {
    type: 'ESFJ',
    summary: 'Host and coordinator. Keeps morale and logistics tight.',
  },
  {
    type: 'ISTP',
    summary: 'Hands-on troubleshooter. Calm under mechanical pressure.',
  },
  {
    type: 'ISFP',
    summary: 'Quiet craftsperson. Sensitive to quality and feel.',
  },
  {
    type: 'ESTP',
    summary: 'Action-first closer. Moves fast when the stakes are live.',
  },
  {
    type: 'ESFP',
    summary: 'Present performer. Energizes the room, reads the moment.',
  },
]

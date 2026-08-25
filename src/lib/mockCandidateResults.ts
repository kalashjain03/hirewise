export type CandidateResultData = {
  candidate_id: string
  name: string
  email: string
  phone?: string
  role: string
  communication_score: number | null
  clarity_score: number | null
  relevant_experience_score: number | null
  problem_solving_score: number | null
  confidence_score: number | null
  overall_score: number | null
  evidence_quality: string | null
  strengths: string[]
  weaknesses: string[]
  interview_summary: string | null
  interview_status: string
  interview_completed_at: string | null
}

export type LookupResult =
  | { status: 'success'; data: CandidateResultData }
  | { status: 'pending'; message: string }
  | { status: 'not_found'; message: string }
  | { status: 'error'; message: string }

const mockCandidates: CandidateResultData[] = [
  {
    candidate_id: 'mock-candidate-001',
    name: 'Ava Thompson',
    email: 'test@hirewise.com',
    phone: '+1 (555) 123-4567',
    role: 'Senior Frontend Engineer',
    communication_score: 92,
    clarity_score: 88,
    relevant_experience_score: 90,
    problem_solving_score: 94,
    confidence_score: 89,
    overall_score: 91,
    evidence_quality: 'Strong',
    strengths: [
      'Demonstrated clear communication and structured reasoning.',
      'Strong experience with modern frontend architecture and team collaboration.',
      'Provided practical examples that aligned well with the role requirements.',
    ],
    weaknesses: [
      'Could improve speed in handling ambiguous product requirements.',
      'Would benefit from more explicit tradeoff discussions during design decisions.',
    ],
    interview_summary:
      'Ava presented a strong technical profile with thoughtful communication and well-structured problem solving. Her examples showed solid product awareness and confidence in cross-functional work. She is a strong fit for a senior product-minded frontend role.',
    interview_status: 'PASSED',
    interview_completed_at: '2026-08-22T09:00:00.000Z',
  },
  {
    candidate_id: 'mock-candidate-002',
    name: 'Marcus Lee',
    email: 'pending@hirewise.com',
    phone: '+1 (555) 987-6543',
    role: 'Product Analyst',
    communication_score: null,
    clarity_score: null,
    relevant_experience_score: null,
    problem_solving_score: null,
    confidence_score: null,
    overall_score: null,
    evidence_quality: null,
    strengths: [],
    weaknesses: [],
    interview_summary: null,
    interview_status: 'PENDING',
    interview_completed_at: '2026-08-22T10:30:00.000Z',
  },
]

export function validateEmailAddress(email: string): { valid: boolean; message: string } {
  const trimmed = (email || '').trim()

  if (!trimmed) {
    return { valid: false, message: 'Please enter your registered email address.' }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(trimmed)) {
    return { valid: false, message: 'Please enter a valid email address.' }
  }

  return { valid: true, message: '' }
}

export function normalizeEmail(email: string): string {
  return (email || '').trim().toLowerCase()
}

async function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function lookupCandidateResultMock(email: string): Promise<LookupResult> {
  const normalized = normalizeEmail(email)
  const validation = validateEmailAddress(normalized)

  if (!validation.valid) {
    return { status: 'error', message: validation.message }
  }

  await wait(900)

  const match = mockCandidates.find((candidate) => normalizeEmail(candidate.email) === normalized)

  if (!match) {
    return {
      status: 'not_found',
      message: 'We could not find a completed AI interview associated with this email address.',
    }
  }

  const hasEvaluation =
    match.overall_score !== null ||
    match.communication_score !== null ||
    match.clarity_score !== null ||
    match.relevant_experience_score !== null ||
    match.problem_solving_score !== null ||
    match.confidence_score !== null ||
    Boolean(match.interview_summary)

  if (match.interview_status === 'PENDING' || !hasEvaluation) {
    return {
      status: 'pending',
      message: 'Your AI interview has been completed successfully and is currently being evaluated.',
    }
  }

  return { status: 'success', data: match }
}

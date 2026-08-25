import { renderHeader } from '../components/Header'
import { lookupCandidateResultMock, normalizeEmail, validateEmailAddress, type CandidateResultData } from '../lib/mockCandidateResults'

function formatInterviewDate(dateValue: string | null): string {
  if (!dateValue) return 'Date not available'

  const parsed = new Date(dateValue)
  if (Number.isNaN(parsed.getTime())) return 'Date not available'

  return parsed.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function clampScore(value: number | null): number {
  if (value === null || Number.isNaN(Number(value))) return 0
  const numeric = Number(value)
  if (numeric <= 1) return Math.max(0, Math.min(100, numeric * 100))
  if (numeric > 100) return 100
  return Math.max(0, Math.min(100, numeric))
}

function scoreColorByStatus(status: string | null): string {
  const normalized = (status || '').toUpperCase()
  if (normalized.includes('PASSED')) return 'badge badge-success'
  if (normalized.includes('FAILED')) return 'badge badge-danger'
  if (normalized.includes('MANUAL') || normalized.includes('UNDER')) return 'badge badge-warning'
  return 'badge badge-neutral'
}

function createMetricCard(label: string, score: number | null) {
  const card = document.createElement('div')
  card.className = 'metric-card'

  const row = document.createElement('div')
  row.className = 'metric-row'

  const name = document.createElement('span')
  name.className = 'metric-name'
  name.textContent = label

  const value = document.createElement('span')
  value.className = 'metric-value'
  value.textContent = score === null ? '–' : `${score}`

  row.appendChild(name)
  row.appendChild(value)

  const barWrap = document.createElement('div')
  barWrap.className = 'metric-bar-wrap'

  const bar = document.createElement('div')
  bar.className = 'metric-bar'
  bar.style.width = `${clampScore(score)}%`

  barWrap.appendChild(bar)
  card.appendChild(row)
  card.appendChild(barWrap)
  return card
}

function createResultDashboard(candidate: CandidateResultData) {
  const wrapper = document.createElement('div')
  wrapper.className = 'results-shell'

  const hero = document.createElement('section')
  hero.className = 'result-panel hero-panel'

  const greeting = document.createElement('h2')
  greeting.className = 'result-greeting'
  greeting.textContent = `Hi, ${candidate.name || 'Candidate'}!`

  const subtitle = document.createElement('p')
  subtitle.className = 'result-subtitle'
  subtitle.textContent = `Here is your AI interview evaluation for the ${candidate.role || 'position'} position.`

  const completion = document.createElement('div')
  completion.className = 'result-date'
  completion.textContent = `Interview completed on ${formatInterviewDate(candidate.interview_completed_at)}`

  hero.appendChild(greeting)
  hero.appendChild(subtitle)
  hero.appendChild(completion)

  const summaryGrid = document.createElement('section')
  summaryGrid.className = 'result-grid'

  const statusCard = document.createElement('div')
  statusCard.className = 'result-panel status-panel'
  const statusLabel = document.createElement('div')
  statusLabel.className = 'panel-label'
  statusLabel.textContent = 'AI Interview Result'
  const badge = document.createElement('div')
  badge.className = scoreColorByStatus(candidate.interview_status)
  badge.textContent = (candidate.interview_status || 'PENDING').toUpperCase()
  statusCard.appendChild(statusLabel)
  statusCard.appendChild(badge)

  const scoreCard = document.createElement('div')
  scoreCard.className = 'result-panel score-panel'
  const scoreLabel = document.createElement('div')
  scoreLabel.className = 'panel-label'
  scoreLabel.textContent = 'Overall Score'

  const scoreWrap = document.createElement('div')
  scoreWrap.className = 'score-wrap'

  const scoreRing = document.createElement('div')
  scoreRing.className = 'score-ring'
  const scorePercent = clampScore(candidate.overall_score)
  scoreRing.style.background = `conic-gradient(var(--primary) ${scorePercent}%, rgba(37,99,235,0.12) ${scorePercent}% 100%)`

  const ringInner = document.createElement('div')
  ringInner.className = 'score-ring-inner'
  const scoreValue = document.createElement('div')
  scoreValue.className = 'score-value'
  scoreValue.textContent = `${candidate.overall_score ?? '–'}`
  ringInner.appendChild(scoreValue)
  scoreRing.appendChild(ringInner)

  const scoreMeta = document.createElement('div')
  scoreMeta.className = 'score-meta'
  scoreMeta.textContent = 'AI-generated score based on the completed interview evaluation.'

  scoreWrap.appendChild(scoreRing)
  scoreCard.appendChild(scoreLabel)
  scoreCard.appendChild(scoreWrap)
  scoreCard.appendChild(scoreMeta)

  summaryGrid.appendChild(statusCard)
  summaryGrid.appendChild(scoreCard)

  const breakdown = document.createElement('section')
  breakdown.className = 'result-panel'
  const breakdownTitle = document.createElement('h3')
  breakdownTitle.textContent = 'Evaluation Breakdown'

  const metrics = document.createElement('div')
  metrics.className = 'metric-grid'

  metrics.appendChild(createMetricCard('Communication', candidate.communication_score))
  metrics.appendChild(createMetricCard('Clarity', candidate.clarity_score))
  metrics.appendChild(createMetricCard('Relevant Experience', candidate.relevant_experience_score))
  metrics.appendChild(createMetricCard('Problem Solving', candidate.problem_solving_score))
  metrics.appendChild(createMetricCard('Confidence', candidate.confidence_score))

  breakdown.appendChild(breakdownTitle)
  breakdown.appendChild(metrics)

  const detailGrid = document.createElement('div')
  detailGrid.className = 'details-grid'

  if (candidate.strengths && candidate.strengths.length > 0) {
    const strengthsCard = document.createElement('section')
    strengthsCard.className = 'result-panel'
    const strengthsTitle = document.createElement('h3')
    strengthsTitle.textContent = 'Your Strengths'
    const strengthsList = document.createElement('ul')
    strengthsList.className = 'result-list'
    candidate.strengths.forEach((item) => {
      const li = document.createElement('li')
      li.textContent = item
      strengthsList.appendChild(li)
    })
    strengthsCard.appendChild(strengthsTitle)
    strengthsCard.appendChild(strengthsList)
    detailGrid.appendChild(strengthsCard)
  }

  if (candidate.weaknesses && candidate.weaknesses.length > 0) {
    const weaknessCard = document.createElement('section')
    weaknessCard.className = 'result-panel'
    const weaknessTitle = document.createElement('h3')
    weaknessTitle.textContent = 'Areas for Improvement'
    const weaknessList = document.createElement('ul')
    weaknessList.className = 'result-list'
    candidate.weaknesses.forEach((item) => {
      const li = document.createElement('li')
      li.textContent = item
      weaknessList.appendChild(li)
    })
    weaknessCard.appendChild(weaknessTitle)
    weaknessCard.appendChild(weaknessList)
    detailGrid.appendChild(weaknessCard)
  }

  const summaryCard = document.createElement('section')
  summaryCard.className = 'result-panel summary-panel'
  const summaryTitle = document.createElement('h3')
  summaryTitle.textContent = 'Interview Summary'
  const summaryText = document.createElement('p')
  summaryText.className = 'summary-text'
  summaryText.textContent = candidate.interview_summary || 'No interview summary is available yet.'
  summaryCard.appendChild(summaryTitle)
  summaryCard.appendChild(summaryText)

  wrapper.appendChild(hero)
  wrapper.appendChild(summaryGrid)
  wrapper.appendChild(breakdown)
  wrapper.appendChild(detailGrid)
  wrapper.appendChild(summaryCard)

  if (candidate.evidence_quality) {
    const evidenceCard = document.createElement('div')
    evidenceCard.className = 'result-panel evidence-panel'
    const evidenceLabel = document.createElement('div')
    evidenceLabel.className = 'panel-label'
    evidenceLabel.textContent = 'Evaluation Confidence'
    const evidenceValue = document.createElement('div')
    evidenceValue.className = 'evidence-value'
    evidenceValue.textContent = candidate.evidence_quality
    evidenceCard.appendChild(evidenceLabel)
    evidenceCard.appendChild(evidenceValue)
    wrapper.appendChild(evidenceCard)
  }

  return wrapper
}

function renderLookupState() {
  const wrapper = document.createElement('div')
  wrapper.className = 'results-shell'

  const card = document.createElement('section')
  card.className = 'result-panel lookup-panel'

  const title = document.createElement('h1')
  title.className = 'lookup-title'
  title.textContent = 'Check Your Interview Result'

  const subtitle = document.createElement('p')
  subtitle.className = 'lookup-subtitle'
  subtitle.textContent = 'Enter the email address you used during registration to view your AI interview evaluation and result.'

  const form = document.createElement('form')
  form.className = 'lookup-form'

  const input = document.createElement('input')
  input.className = 'result-input'
  input.type = 'email'
  input.placeholder = 'Enter your registered email address'
  input.autocomplete = 'email'
  input.setAttribute('aria-label', 'Registered email address')

  const message = document.createElement('div')
  message.className = 'form-message'
  message.setAttribute('aria-live', 'polite')

  const button = document.createElement('button')
  button.type = 'submit'
  button.className = 'btn btn-primary'
  button.textContent = 'Check My Result'

  form.addEventListener('submit', async (event) => {
    event.preventDefault()
    const email = input.value
    const normalized = normalizeEmail(email)
    const validation = validateEmailAddress(normalized)

    if (!validation.valid) {
      message.textContent = validation.message
      message.classList.add('is-error')
      message.classList.remove('is-success')
      return
    }

    button.disabled = true
    button.textContent = 'Checking...'
    message.textContent = 'Finding your interview result...'
    message.classList.remove('is-error')
    message.classList.add('is-success')

    const result = await lookupCandidateResultMock(normalized)

    button.disabled = false
    button.textContent = 'Check My Result'

    if (result.status === 'success') {
      const parent = wrapper.parentElement || document.body
      const dashboard = createResultDashboard(result.data)
      parent.replaceChild(dashboard, wrapper)
      return
    }

    if (result.status === 'pending') {
      const parent = wrapper.parentElement || document.body
      const pending = renderPendingState()
      parent.replaceChild(pending, wrapper)
      return
    }

    if (result.status === 'not_found') {
      const parent = wrapper.parentElement || document.body
      const notFound = renderNotFoundState()
      parent.replaceChild(notFound, wrapper)
      return
    }

    const parent = wrapper.parentElement || document.body
    const errorState = renderErrorState()
    parent.replaceChild(errorState, wrapper)
  })

  form.appendChild(input)
  form.appendChild(message)
  form.appendChild(button)
  card.appendChild(title)
  card.appendChild(subtitle)
  card.appendChild(form)
  wrapper.appendChild(card)
  return wrapper
}

function renderNotFoundState() {
  const wrapper = document.createElement('div')
  wrapper.className = 'results-shell'

  const card = document.createElement('section')
  card.className = 'result-panel state-panel'

  const heading = document.createElement('h2')
  heading.className = 'state-title'
  heading.textContent = 'No Interview Result Found'

  const text = document.createElement('p')
  text.className = 'state-message'
  text.textContent = 'We could not find a completed AI interview associated with this email address. Please make sure you are using the same email address that was used during registration.'

  const button = document.createElement('button')
  button.type = 'button'
  button.className = 'btn btn-primary'
  button.textContent = 'Try Another Email'
  button.addEventListener('click', () => {
    const parent = wrapper.parentElement || document.body
    parent.replaceChild(renderLookupState(), wrapper)
  })

  card.appendChild(heading)
  card.appendChild(text)
  card.appendChild(button)
  wrapper.appendChild(card)
  return wrapper
}

function renderPendingState() {
  const wrapper = document.createElement('div')
  wrapper.className = 'results-shell'

  const card = document.createElement('section')
  card.className = 'result-panel state-panel'

  const heading = document.createElement('h2')
  heading.className = 'state-title'
  heading.textContent = 'Your Result Is Being Processed'

  const text = document.createElement('p')
  text.className = 'state-message'
  text.textContent = 'Your AI interview has been completed successfully and is currently being evaluated. Please check back later.'

  const button = document.createElement('button')
  button.type = 'button'
  button.className = 'btn btn-primary'
  button.textContent = 'Check Again'
  button.addEventListener('click', () => {
    const parent = wrapper.parentElement || document.body
    parent.replaceChild(renderLookupState(), wrapper)
  })

  card.appendChild(heading)
  card.appendChild(text)
  card.appendChild(button)
  wrapper.appendChild(card)
  return wrapper
}

function renderErrorState() {
  const wrapper = document.createElement('div')
  wrapper.className = 'results-shell'

  const card = document.createElement('section')
  card.className = 'result-panel state-panel'

  const heading = document.createElement('h2')
  heading.className = 'state-title'
  heading.textContent = 'Something Went Wrong'

  const text = document.createElement('p')
  text.className = 'state-message'
  text.textContent = 'We were unable to retrieve your interview result at the moment. Please try again shortly.'

  const button = document.createElement('button')
  button.type = 'button'
  button.className = 'btn btn-primary'
  button.textContent = 'Try Again'
  button.addEventListener('click', () => {
    const parent = wrapper.parentElement || document.body
    parent.replaceChild(renderLookupState(), wrapper)
  })

  card.appendChild(heading)
  card.appendChild(text)
  card.appendChild(button)
  wrapper.appendChild(card)
  return wrapper
}

export function renderResults() {
  const root = document.createElement('div')
  root.className = 'page-results container'

  const params = new URLSearchParams(window.location.search)
  const candidateId = params.get('candidateId')

  if (candidateId) {
    root.setAttribute('data-candidate-id', candidateId)
  }

  root.appendChild(renderHeader(false))
  root.appendChild(renderLookupState())
  return root
}

import { renderHeader } from '../components/Header'

export function renderLanding(navigate: (path: string) => void) {
  const root = document.createElement('div')
  root.className = 'page-landing container'

  root.appendChild(renderHeader(false))

  const main = document.createElement('main')
  main.className = 'hero'

  const badge = document.createElement('div')
  badge.className = 'hero-badge'
  badge.textContent = 'AI-POWERED TECHNICAL INTERVIEWS'

  const h1 = document.createElement('h1')
  h1.className = 'hero-title'
  h1.textContent = 'Technical interviews, powered by AI.'

  const p = document.createElement('p')
  p.className = 'hero-sub'
  p.textContent = 'HireWise AI conducts structured voice interviews and helps teams evaluate candidates with clear, consistent hiring signals.'

  // indicators row
  const indicators = document.createElement('div')
  indicators.className = 'hero-indicators'

  const makeIndicator = (label: string, sub: string) => {
    const it = document.createElement('div')
    it.className = 'hero-ind'
    const strong = document.createElement('div')
    strong.className = 'ind-strong'
    strong.textContent = label
    const small = document.createElement('div')
    small.className = 'ind-small'
    small.textContent = sub
    it.appendChild(strong)
    it.appendChild(small)
    return it
  }

  indicators.appendChild(makeIndicator('~10 min', 'Around 10 minutes'))
  indicators.appendChild(makeIndicator('AI Voice', 'AI voice interview'))
  indicators.appendChild(makeIndicator('Structured', 'Structured evaluation'))

  main.appendChild(badge)
  main.appendChild(h1)
  main.appendChild(p)
  main.appendChild(indicators)

  // Before you begin card beneath hero
  const beforeCard = document.createElement('section')
  beforeCard.className = 'before-card'
  const beforeTitle = document.createElement('h3')
  beforeTitle.textContent = 'Before You Begin'
  const beforeText = document.createElement('div')
  beforeText.className = 'before-text'
  beforeText.innerHTML = `
    <p>Your AI voice interview is about to begin.</p>
    <ul>
      <li>The interview will take approximately 10 minutes.</li>
      <li>Ensure your microphone is enabled.</li>
      <li>Sit in a quiet environment with a stable internet connection.</li>
      <li>Answer each question naturally and honestly.</li>
    </ul>
    <p>When you are ready, click the "Start Interview" button below.</p>
  `
  const startBtn = document.createElement('button')
  startBtn.className = 'btn btn-primary btn-lg start-primary'
  startBtn.textContent = 'START YOUR INTERVIEW'
  // preserve candidateId from landing page query string when navigating to interview
  const params = new URLSearchParams(window.location.search)
  const candidateId = params.get('candidateId')
  startBtn.addEventListener('click', () => {
    if (candidateId) {
      navigate(`/interview?candidateId=${encodeURIComponent(candidateId)}`)
    } else {
      navigate('/interview')
    }
  })

  

  // preparation rows
  const prepList = document.createElement('div')
  prepList.className = 'prep-list'
  const items = [
    ['Microphone Ready', 'Make sure your microphone is enabled.'],
    ['Quiet Environment', 'Find a quiet place where you can focus.'],
    ['Stable Connection', 'Use a reliable internet connection.'],
    ['Be Yourself', 'Answer naturally and honestly.'],
  ]
  for (const it of items) {
    const row = document.createElement('div')
    row.className = 'prep-row'
    const icon = document.createElement('div')
    icon.className = 'prep-icon'
    // inline SVG icon (keeps no external deps)
    const svgNS = 'http://www.w3.org/2000/svg'
    const makeIcon = (type: string) => {
      const svg = document.createElementNS(svgNS, 'svg')
      svg.setAttribute('viewBox', '0 0 24 24')
      svg.setAttribute('aria-hidden', 'true')
      svg.classList.add('icon-svg')
      const path = document.createElementNS(svgNS, 'path')
      path.setAttribute('fill', 'currentColor')
      if (type === 'mic') {
        path.setAttribute('d', 'M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 14 0h-2zM11 19h2v3h-2z')
      } else if (type === 'quiet') {
        path.setAttribute('d', 'M5 9v6h4l5 4V5L9 9H5zm13.5 3a1.5 1.5 0 0 1 0 0l1.5 1.5L20 12l-1.5-1.5L18.5 12z')
      } else if (type === 'wifi') {
        path.setAttribute('d', 'M12 18c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm4.24-2.88a6.984 6.984 0 0 0-8.48 0l1.42 1.42a5.006 5.006 0 0 1 5.64 0l1.42-1.42zM12 6C8.69 6 5.73 7.64 3.71 9.93l1.41 1.41A9.96 9.96 0 0 1 12 8c2.2 0 4.21.72 5.88 1.98l1.41-1.41C18.27 7.64 15.31 6 12 6z')
      } else {
        path.setAttribute('d', 'M21 6h-2v9H7v2h12l2 2V6zM3 6v12l4-4h10V6H3z')
      }
      svg.appendChild(path)
      return svg
    }
    const icons = ['mic', 'quiet', 'wifi', 'chat']
    icon.appendChild(makeIcon(icons[items.indexOf(it)] || 'chat'))
    const col = document.createElement('div')
    col.className = 'prep-col'
    const t = document.createElement('div')
    t.className = 'prep-title'
    t.textContent = it[0]
    const d = document.createElement('div')
    d.className = 'prep-desc'
    d.textContent = it[1]
    col.appendChild(t)
    col.appendChild(d)
    row.appendChild(icon)
    row.appendChild(col)
    prepList.appendChild(row)
  }

  beforeCard.appendChild(beforeTitle)
  beforeCard.appendChild(beforeText)
  beforeCard.appendChild(prepList)
  beforeCard.appendChild(document.createElement('hr'))
  beforeCard.appendChild(startBtn)
  const helper = document.createElement('div')
  helper.className = 'helper-text'
  helper.textContent = 'Your interview takes approximately 10 minutes.'
  beforeCard.appendChild(helper)

  beforeCard.appendChild(helper)

  root.appendChild(main)
  root.appendChild(beforeCard)

  return root
}

import { navigate } from '../router'

function buildNavigationTarget(path: string, candidateId: string | null) {
  if (!candidateId) return path

  const target = new URL(path, window.location.origin)
  target.searchParams.set('candidateId', candidateId)
  return `${target.pathname}${target.search}`
}

export function renderHeader(showBack = false) {
  const header = document.createElement('header')
  header.className = 'hw-header'

  const left = document.createElement('div')
  left.className = 'hw-left'
  const title = document.createElement('div')
  title.className = 'hw-title'
  // Split styling: HireWise (dark) + AI (accent)
  const brand = document.createElement('span')
  brand.className = 'brand-hire'
  brand.textContent = 'HireWise'
  const brandAI = document.createElement('span')
  brandAI.className = 'brand-ai'
  brandAI.textContent = 'AI'
  title.appendChild(brand)
  title.appendChild(document.createTextNode(' '))
  title.appendChild(brandAI)
  left.appendChild(title)

  const right = document.createElement('div')
  right.className = 'hw-right'
  // preserve candidateId from current URL when navigating internally
  const params = new URLSearchParams(window.location.search)
  const candidateId = params.get('candidateId')

  if (showBack) {
    const back = document.createElement('button')
    back.className = 'hw-back'
    back.textContent = '← Back to Home'
    back.addEventListener('click', () => {
      const target = buildNavigationTarget('/', candidateId)
      navigate(target)
    })
    right.appendChild(back)
  } else {
    const interviewLink = document.createElement('a')
    interviewLink.className = 'hw-link'
    const interviewHref = buildNavigationTarget('/interview', candidateId)
    interviewLink.setAttribute('href', interviewHref)
    interviewLink.setAttribute('data-link', '')
    interviewLink.textContent = 'Interview'

    const resultsLink = document.createElement('a')
    resultsLink.className = 'hw-link'
    const resultsHref = buildNavigationTarget('/results', candidateId)
    resultsLink.setAttribute('href', resultsHref)
    resultsLink.setAttribute('data-link', '')
    resultsLink.textContent = 'Results'

    right.appendChild(interviewLink)
    right.appendChild(resultsLink)
  }

  header.appendChild(left)
  header.appendChild(right)

  return header
}

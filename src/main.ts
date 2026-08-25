import './style.css'
import { initRouter, navigate } from './router'
import { renderLanding } from './pages/Landing'
import { renderInterview } from './pages/Interview'
import { renderResults } from './pages/Results'

const app = document.querySelector<HTMLDivElement>('#app')!

const routes: Record<string, () => HTMLElement> = {
  '/': () => renderLanding(navigate),
  '/interview': () => renderInterview(navigate),
  '/results': () => renderResults(),
}

function renderRoute(path: string) {
  app.innerHTML = ''
  // Strip query string when matching routes (pages can read query params themselves)
  const base = path.split('?')[0]
  const content = routes[base] ? routes[base]() : routes['/']()
  app.appendChild(content)
}

initRouter((path) => renderRoute(path))

renderRoute(window.location.pathname + window.location.search)

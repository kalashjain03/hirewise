export function initRouter(onRouteChange: (path: string) => void) {
  // Preserve pathname + search for routing so pages can read query params
  window.addEventListener('popstate', () => onRouteChange(window.location.pathname + window.location.search))

  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    const anchor = target.closest && target.closest('[data-link]') as HTMLAnchorElement | null
    if (anchor) {
      e.preventDefault()
      const href = anchor.getAttribute('href') || '/'
      history.pushState({}, '', href)
      onRouteChange(href)
    }
  })
}

export function navigate(path: string) {
  history.pushState({}, '', path)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

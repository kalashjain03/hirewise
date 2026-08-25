import { renderHeader } from '../components/Header'
import { supabase } from '../lib/supabaseClient'
import Vapi from '@vapi-ai/web'

const INTERVIEW_CANDIDATE_KEY = 'hirewise_interview_candidate_id'

type Candidate = {
  id: string
  name: string
  email: string
  phone: string
  role: string
  screening_status: string | null
  interview_status: string | null
  resume_summary?: string | null
  interview_focus?: string | null
  vapi_call_id?: string | null
}

export function renderInterview(navigate: (path: string) => void) {
  const root = document.createElement('div')
  root.className = 'page-interview container'

  // header will be appended below together with debugBox

  const card = document.createElement('section')
  card.className = 'candidate-card large-card'

  // Read candidateId from query params and keep it stable for the full interview lifecycle.
  const params = new URLSearchParams(window.location.search)
  let candidateId = params.get('candidateId')

  // Fallback to session storage so the ID survives re-renders during the same interview session.
  if (!candidateId) {
    candidateId = sessionStorage.getItem(INTERVIEW_CANDIDATE_KEY)
  }

  // Robust fallback: try to extract candidateId from full href if search missing
  if (!candidateId) {
    const m = window.location.href.match(/[?&]candidateId=([^&]+)/)
    if (m) {
      try {
        candidateId = decodeURIComponent(m[1])
      } catch (e) {
        candidateId = m[1]
      }
    }
  }

  const stableCandidateId = candidateId ? candidateId.trim() : null

  if (stableCandidateId) {
    sessionStorage.setItem(INTERVIEW_CANDIDATE_KEY, stableCandidateId)
  }

  root.appendChild(renderHeader(true))

  // Helper: render a clean invalid link screen without querying Supabase
  const renderInvalidLink = (text?: string) => {
    card.innerHTML = ''
    const wrap = document.createElement('div')
    wrap.className = 'invalid-link'
    const title = document.createElement('h2')
    title.textContent = 'Invalid Interview Link'
    const desc = document.createElement('div')
    desc.className = 'muted'
    desc.textContent = text || 'This interview link is invalid, expired, or no longer available.'
    const back = document.createElement('button')
    back.className = 'btn btn-primary'
    back.textContent = 'Back to Home'
    back.addEventListener('click', () => navigate('/'))
    wrap.appendChild(title)
    wrap.appendChild(desc)
    wrap.appendChild(back)
    card.appendChild(wrap)
    root.appendChild(card)
    return root
  }

  if (!stableCandidateId) {
    return renderInvalidLink('This interview link is missing a candidate identifier.')
  }

  // Keep the original URL candidate identifier as the canonical value for the interview lifecycle.
  // Some valid candidate IDs are not strict UUIDs, and they must still be accepted.
  const validatedCandidateId = stableCandidateId

  // Show skeleton loading state while candidate data loads
  const skeleton = document.createElement('div')
  skeleton.className = 'skeleton-card'
  // skeleton structure mirrors final layout to avoid layout shift
  skeleton.innerHTML = `
    <div class="skeleton-row">
      <div class="skeleton-avatar"></div>
      <div class="skeleton-lines">
        <div class="skeleton-line short"></div>
        <div class="skeleton-line long"></div>
      </div>
    </div>
    <div class="skeleton-grid">
      <div class="skeleton-box"></div>
      <div class="skeleton-box"></div>
    </div>
    <div class="skeleton-blocks">
      <div class="skeleton-block"></div>
      <div class="skeleton-block"></div>
      <div class="skeleton-block"></div>
    </div>
    <div class="skeleton-action">
      <div class="skeleton-btn"></div>
    </div>
  `
  card.appendChild(skeleton)
  root.appendChild(card)

  // Fetch candidate
  ;(async () => {
    try {
      

      // fetch candidate
      const { data, error } = await (supabase as any)
        .from('candidates')
        .select('id,name,email,phone,role,screening_status,interview_status,resume_summary,interview_focus,vapi_call_id')
        .eq('id', validatedCandidateId)
        .single()
      

      // remove skeleton and prepare to render real card
      card.innerHTML = ''

      if (error) {
        console.error('Supabase query error:', error)
        return renderInvalidLink('This interview link is invalid, expired, or no longer available.')
      }

      if (!data) {
        return renderInvalidLink('This interview link is invalid, expired, or no longer available.')
      }

      const candidate = data as Candidate
      const confirmedCandidateId = validatedCandidateId || candidate.id

      // Main card layout: profile, contact, overview, preparations, actions
      const container = document.createElement('div')
      container.className = 'main-card'

      // Profile area
      const profile = document.createElement('div')
      profile.className = 'profile-area'
      const avatar = document.createElement('div')
      avatar.className = 'avatar'
      const initials = (candidate.name || '').split(' ').map(s => s[0]).slice(0,2).join('').toUpperCase()
      avatar.textContent = initials || '—'

      const profileInfo = document.createElement('div')
      profileInfo.className = 'profile-info'
      const nameEl = document.createElement('div')
      nameEl.className = 'candidate-name'
      nameEl.textContent = candidate.name || '—'
      const roleEl = document.createElement('div')
      roleEl.className = 'candidate-role'
      roleEl.textContent = candidate.role || '—'
      profileInfo.appendChild(nameEl)
      profileInfo.appendChild(roleEl)

      const statusElWrap = document.createElement('div')
      statusElWrap.className = 'profile-status'
      const badge1 = document.createElement('div')
      badge1.className = 'badge badge-neutral'
      badge1.textContent = `Screening: ${candidate.screening_status || 'Pending'}`
      const badge2 = document.createElement('div')
      badge2.className = 'badge badge-muted'
      badge2.textContent = `Interview: ${candidate.interview_status || 'Pending'}`
      statusElWrap.appendChild(badge1)
      statusElWrap.appendChild(badge2)

      profile.appendChild(avatar)
      profile.appendChild(profileInfo)
      profile.appendChild(statusElWrap)

      // Contact section
      const contact = document.createElement('div')
      contact.className = 'contact-section'
      const contactTitle = document.createElement('h4')
      contactTitle.textContent = 'Candidate Details'
      const contactGrid = document.createElement('div')
      contactGrid.className = 'contact-grid'
      const emailCol = document.createElement('div')
      emailCol.className = 'contact-item'
      const emailLabel = document.createElement('div')
      emailLabel.className = 'detail-label'
      emailLabel.textContent = 'EMAIL'
      const emailVal = document.createElement('div')
      emailVal.className = 'detail-value'
      emailVal.innerHTML = `<a href=\"mailto:${candidate.email}\">${candidate.email}</a>`
      emailCol.appendChild(emailLabel)
      emailCol.appendChild(emailVal)

      const phoneCol = document.createElement('div')
      phoneCol.className = 'contact-item'
      const phoneLabel = document.createElement('div')
      phoneLabel.className = 'detail-label'
      phoneLabel.textContent = 'PHONE'
      const phoneVal = document.createElement('div')
      phoneVal.className = 'detail-value'
      phoneVal.textContent = candidate.phone || '—'
      phoneCol.appendChild(phoneLabel)
      phoneCol.appendChild(phoneVal)

      contactGrid.appendChild(emailCol)
      contactGrid.appendChild(phoneCol)
      contact.appendChild(contactTitle)
      contact.appendChild(contactGrid)

      // Interview overview
      const overview = document.createElement('div')
      overview.className = 'overview-section'
      const ovTitle = document.createElement('h4')
      ovTitle.textContent = 'Interview Overview'
      const ovText = document.createElement('div')
      ovText.className = 'ov-text'
      ovText.textContent = 'You are about to begin an AI-powered voice interview. The interview will assess your experience and suitability for the role.'
      const ovItems = document.createElement('div')
      ovItems.className = 'ov-items'
      const makeOv = (k: string, v: string) => {
        const it = document.createElement('div')
        it.className = 'ov-item'
        const kk = document.createElement('div')
        kk.className = 'ov-key'
        kk.textContent = k
        const vv = document.createElement('div')
        vv.className = 'ov-val'
        vv.textContent = v
        it.appendChild(kk)
        it.appendChild(vv)
        return it
      }
      ovItems.appendChild(makeOv('Duration', 'Approximately 10 minutes'))
      ovItems.appendChild(makeOv('Format', 'AI Voice Interview'))
      ovItems.appendChild(makeOv('Evaluation', 'Structured Assessment'))
      overview.appendChild(ovTitle)
      overview.appendChild(ovText)
      overview.appendChild(ovItems)

      // Before you begin refined checklist
      const prep = document.createElement('div')
      prep.className = 'prep-section'
      const prepTitle = document.createElement('h4')
      prepTitle.textContent = 'Before You Begin'
      const prepList = document.createElement('div')
      prepList.className = 'prep-list'
      const pitems = [
        ['Microphone enabled', 'Microphone enabled'],
        ['Quiet environment', 'Find a quiet place to focus'],
        ['Stable internet', 'Use a reliable connection'],
        ['Answer naturally', 'Be yourself and answer honestly'],
      ]
      // helper to create simple inline SVG icons (keeps no external deps)
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
      for (let i = 0; i < pitems.length; i++) {
        const it = pitems[i]
        const row = document.createElement('div')
        row.className = 'prep-row'
        const iconWrap = document.createElement('div')
        iconWrap.className = 'prep-icon'
        iconWrap.appendChild(makeIcon(icons[i] || 'chat'))
        const text = document.createElement('div')
        text.className = 'prep-text'
        const t = document.createElement('div')
        t.className = 'prep-title'
        t.textContent = it[0]
        const d = document.createElement('div')
        d.className = 'prep-desc'
        d.textContent = it[1]
        text.appendChild(t)
        text.appendChild(d)
        row.appendChild(iconWrap)
        row.appendChild(text)
        prepList.appendChild(row)
      }
      prep.appendChild(prepTitle)
      prep.appendChild(prepList)

      // Actions (start button + notice will be created and wired to Vapi)
      const actions = document.createElement('div')
      actions.className = 'action-area'

      const startWrap = document.createElement('div')
      startWrap.className = 'card-start'
      // center contents (Start button + notice/status) horizontally
      startWrap.style.display = 'flex'
      startWrap.style.flexDirection = 'column'
      startWrap.style.alignItems = 'center'
      const startBtn = document.createElement('button')
      startBtn.type = 'button'
      startBtn.className = 'btn btn-primary btn-block'
      startBtn.textContent = 'Start Interview'
      const notice = document.createElement('div')
      notice.className = 'notice'
      startWrap.appendChild(startBtn)
      startWrap.appendChild(notice)
      actions.appendChild(startWrap)

      container.appendChild(profile)
      container.appendChild(contact)
      container.appendChild(overview)
      container.appendChild(prep)
      container.appendChild(actions)

      // Append main container into card
      card.appendChild(container)

      // Keep candidate id available on the DOM element for later use
      ;(card as any).__candidate = candidate

      // Vapi integration
      const vapiKey = import.meta.env.VITE_VAPI_PUBLIC_KEY
      const assistantId = import.meta.env.VITE_VAPI_ASSISTANT_ID
      let vapi: any = null
      let vapiActive = false

      const statusEl = document.createElement('div')
      statusEl.className = 'vapi-status'
      // ensure any status text is centered within the actions area
      statusEl.style.width = '100%'
      statusEl.style.textAlign = 'center'
      statusEl.style.margin = '0 0 8px 0'
      startWrap.insertBefore(statusEl, notice)

      // Live interview UI container (controlled by Vapi events)
      const liveWrap = document.createElement('div')
      liveWrap.className = 'live-interview-wrap'
      liveWrap.style.textAlign = 'center'
      liveWrap.style.marginTop = '18px'
      liveWrap.style.display = 'flex'
      liveWrap.style.flexDirection = 'column'
      liveWrap.style.alignItems = 'center'

      // Small centered pill at top
      const pill = document.createElement('div')
      pill.className = 'live-pill'
      pill.textContent = '' // kept empty until call starts; Start button will show pill text
      pill.style.display = 'block'
      pill.style.margin = '0 auto 12px auto'
      pill.style.width = 'fit-content'
      pill.style.padding = '6px 10px'
      pill.style.borderRadius = '999px'
      pill.style.background = 'var(--muted-bg, #f3f4f6)'
      pill.style.color = 'var(--muted, #6b7280)'
      pill.style.fontSize = '13px'
      liveWrap.appendChild(pill)

      // Central status area
      const central = document.createElement('div')
      central.className = 'live-central'
      central.style.display = 'flex'
      central.style.flexDirection = 'column'
      central.style.alignItems = 'center'
      central.style.justifyContent = 'center'
      central.style.gap = '12px'

      // Icon container (circular)
      const iconWrap = document.createElement('div')
      iconWrap.className = 'live-icon-wrap'
      iconWrap.style.width = '96px'
      iconWrap.style.height = '96px'
      iconWrap.style.borderRadius = '50%'
      iconWrap.style.display = 'flex'
      iconWrap.style.alignItems = 'center'
      iconWrap.style.justifyContent = 'center'
      iconWrap.style.background = 'rgba(59,130,246,0.08)'
      iconWrap.style.margin = '0 auto'

      // SVG area for bars / mic (reuse `svgNS` declared earlier)
      const iconSvg = document.createElementNS(svgNS, 'svg')
      iconSvg.setAttribute('viewBox', '0 0 64 64')
      iconSvg.setAttribute('width', '64')
      iconSvg.setAttribute('height', '64')
      iconSvg.classList.add('live-icon-svg')

      // Create 5 vertical bars for level visualization
      const bars: SVGRectElement[] = []
      for (let i = 0; i < 5; i++) {
        const rect = document.createElementNS(svgNS, 'rect')
        const w = 6
        const gap = 4
        const x = 6 + i * (w + gap)
        rect.setAttribute('x', String(x))
        rect.setAttribute('y', String(20))
        rect.setAttribute('width', String(w))
        rect.setAttribute('height', String(24))
        rect.setAttribute('rx', '2')
        rect.setAttribute('fill', 'currentColor')
        rect.setAttribute('opacity', '0.6')
        iconSvg.appendChild(rect)
        bars.push(rect as SVGRectElement)
      }

      // ensure bars use a blue color similar to design
      try { (iconSvg as any).style.color = '#2563eb' } catch (e) {}
      iconWrap.appendChild(iconSvg)

      const mainText = document.createElement('div')
      mainText.className = 'live-main-text'
      mainText.style.fontWeight = '600'
      mainText.style.fontSize = '16px'

      const subText = document.createElement('div')
      subText.className = 'live-sub-text'
      subText.style.color = 'var(--muted, #6b7280)'
      subText.style.fontSize = '13px'

      // subtle animated indicator (three dots)
      const dotWrap = document.createElement('div')
      dotWrap.className = 'live-dots'
      dotWrap.style.display = 'flex'
      dotWrap.style.gap = '6px'
      dotWrap.style.alignItems = 'center'
      dotWrap.style.justifyContent = 'center'

      const dots: HTMLDivElement[] = []
      for (let i = 0; i < 3; i++) {
        const d = document.createElement('div')
        d.style.width = '8px'
        d.style.height = '8px'
        d.style.borderRadius = '50%'
        d.style.background = 'currentColor'
        d.style.opacity = '0.25'
        dotWrap.appendChild(d)
        dots.push(d)
      }

      central.appendChild(iconWrap)
      central.appendChild(mainText)
      central.appendChild(subText)
      central.appendChild(dotWrap)
      liveWrap.appendChild(central)

      // Completed state container (hidden by default)
      const completedWrap = document.createElement('div')
      completedWrap.className = 'live-completed'
      completedWrap.style.display = 'none'
      completedWrap.style.textAlign = 'center'
      const check = document.createElement('div')
      check.textContent = '✓'
      check.style.fontSize = '40px'
      check.style.color = 'var(--success, #10b981)'
      const compTitle = document.createElement('div')
      compTitle.textContent = 'Interview Completed'
      compTitle.style.fontWeight = '700'
      compTitle.style.marginTop = '8px'
      const compSub = document.createElement('div')
      compSub.textContent = 'Thank you for your time!'
      compSub.style.color = 'var(--muted, #6b7280)'
      completedWrap.appendChild(check)
      completedWrap.appendChild(compTitle)
      completedWrap.appendChild(compSub)
      // append the completedWrap later; endBtn will be inserted between central and completedWrap
      liveWrap.appendChild(completedWrap)

      // Insert liveWrap into the UI
      startWrap.appendChild(liveWrap)

      // Inline lightweight styles/animations used by this component only
      const styleTag = document.createElement('style')
      styleTag.textContent = `
        .live-pill.show { background: #111827; color: #fff }
        .live-icon-wrap.speaking { background: rgba(59,130,246,0.12) }
        .live-dots .active { opacity: 1 }
        @keyframes dotPulse { 0% { transform: translateY(0); opacity: .3 } 50% { transform: translateY(-6px); opacity: 1 } 100% { transform: translateY(0); opacity: .3 } }
      `
      document.head.appendChild(styleTag)

      // State
      let assistantSpeaking = false
      let candidateListening = false
      let interviewEnded = false

      function clearLiveAnimations() {
        iconWrap.classList.remove('speaking', 'listening')
        dots.forEach(d => { d.style.opacity = '0.25'; d.style.transform = ''; d.style.animation = '' })
      }

      function setPillText(text: string) {
        pill.textContent = text
        if (text) pill.classList.add('show')
      }

      function enterAssistantSpeaking() {
        if (interviewEnded) return
        assistantSpeaking = true
        candidateListening = false
        completedWrap.style.display = 'none'
        setPillText('Interview in Progress')
        iconWrap.classList.add('speaking')
        mainText.textContent = 'Morgan is speaking...'
        mainText.style.color = '#2563eb'
        subText.textContent = 'Please listen'
        // animate dots
        dots.forEach((d, i) => {
          d.style.opacity = '0.45'
          d.style.animation = `dotPulse 900ms ${i * 120}ms infinite ease-in-out`
        })
        // subtle continuous bar animation while assistant speaks (CSS-independent)
        // we will use 'volume-level' if available to modulate bars
      }

      function enterCandidateListening() {
        if (interviewEnded) return
        assistantSpeaking = false
        candidateListening = true
        completedWrap.style.display = 'none'
        setPillText('Interview in Progress')
        iconWrap.classList.remove('speaking')
        mainText.textContent = 'Your turn to speak'
        mainText.style.color = '#2563eb'
        subText.textContent = 'Listening...'
        // dots subtle idle pulse
        dots.forEach((d, i) => {
          d.style.opacity = '0.25'
          d.style.animation = `dotPulse 1200ms ${i * 180}ms infinite ease-in-out`
        })
      }

      function showCompletionState() {
        interviewEnded = true
        assistantSpeaking = false
        candidateListening = false
        clearLiveAnimations()
        // hide active live area elements
        iconWrap.style.display = 'none'
        mainText.style.display = 'none'
        subText.style.display = 'none'
        dotWrap.style.display = 'none'
        completedWrap.style.display = 'block'
        setPillText('')
      }

      function updateBarsFromLevel(level: number) {
        // level expected 0..1, map to heights
        const min = 6
        const max = 28
        for (let i = 0; i < bars.length; i++) {
          const factor = Math.max(0, Math.min(1, (level * 1.2) - (i * 0.08)))
          const h = Math.round(min + (max - min) * factor)
          const y = 44 - h
          try {
            bars[i].setAttribute('y', String(y))
            bars[i].setAttribute('height', String(h))
            bars[i].setAttribute('opacity', String(0.5 + factor * 0.5))
          } catch (e) {}
        }
      }

      // End Interview button (hidden until call active)
      const endBtn = document.createElement('button')
      endBtn.className = 'btn btn-danger btn-block'
      endBtn.textContent = 'End Interview'
      endBtn.classList.add('hidden')
      endBtn.disabled = true
      // place the End button centered directly below the live central area
      try { liveWrap.insertBefore(endBtn, completedWrap) } catch (e) { startWrap.appendChild(endBtn) }

      let callActive = false

      async function cleanupVapi() {
        try {
          if (vapi) {
            try {
              await vapi.stop()
            } catch (e) {
              // ignore errors during stop
            }
            vapi.removeAllListeners && vapi.removeAllListeners()
            vapi = null
            vapiActive = false
          }
        } catch (e) {
          // noop
        }
      }

      // Ensure we cleanup when navigating away
      const onPop = () => {
        cleanupVapi()
      }
      window.addEventListener('popstate', onPop)
      window.addEventListener('beforeunload', onPop)

      // Start Interview click handler (preserve the original candidateId from the URL)
      startBtn.addEventListener('click', async (event) => {
        event.preventDefault()
        event.stopPropagation()

        // prevent multiple starts
        if (vapiActive) return

        const startCandidateId = confirmedCandidateId || candidate.id || sessionStorage.getItem(INTERVIEW_CANDIDATE_KEY)

        if (!startCandidateId) {
          notice.textContent = 'This interview link is missing a candidate identifier.'
          return
        }

          // Log availability of env vars (do not log the actual key value)
          if (!vapiKey || !assistantId) {
            notice.textContent = 'Voice interview integration not configured.'
            console.error('Vapi not configured: missing key/assistant')
            return
          }

          // instantiate Vapi (handle ESM default vs CommonJS)
          try {
            const VapiCtor = (Vapi && (Vapi as any).default) || Vapi
            vapi = new VapiCtor(vapiKey)
          } catch (err) {
            console.error('Vapi initialization error:', err)
            notice.textContent = 'Failed to initialize interview service.'
            return
          }

        // prevent re-starts
        vapiActive = true
        startBtn.disabled = true
        startBtn.textContent = 'Interview in Progress'
        // show the persistent pill but avoid forbidden texts in statusEl
        setPillText('Interview in Progress')

        // Attach events
        vapi.on('call-start', () => {
          // show persistent pill and expose end button
          setPillText('Interview in Progress')
          callActive = true
          endBtn.classList.remove('hidden')
          endBtn.disabled = false
        })

        vapi.on('call-end', async () => {
          // show completion state in the live UI
          try { showCompletionState() } catch (e) {}
          notice.textContent = ''
          startBtn.textContent = 'Interview Completed'
          startBtn.disabled = true
          vapiActive = false
          callActive = false
          endBtn.disabled = true
          endBtn.classList.add('hidden')
          try {
            await cleanupVapi()
          } catch (e) {
            // ignore
          }
        })

        vapi.on('error', (err: any) => {
          console.error('Vapi error', err)
          // keep pill visible but surface an inline notice
          notice.textContent = 'An error occurred during the interview. Please try again later.'
          startBtn.disabled = false
          startBtn.textContent = 'Start Interview'
          vapiActive = false
          callActive = false
          endBtn.disabled = true
          endBtn.classList.add('hidden')
        })

        // TEMP DIAGNOSTIC: listen for local audio levels and speech events
        try {
          vapi.on('local-volume-level', (lvl: number) => {
            try {
              // animate mic bars when candidate is speaking
              if (candidateListening) updateBarsFromLevel(lvl)
            } catch (e) {}
          })
          vapi.on('volume-level', (lvl: number) => {
            try {
              // animate assistant bars when assistant is speaking
              if (assistantSpeaking) updateBarsFromLevel(lvl)
            } catch (e) {}
          })
          vapi.on('speech-start', () => { try { enterAssistantSpeaking() } catch (e) {} })
          vapi.on('speech-end', () => { try { enterCandidateListening() } catch (e) {} })
          vapi.on('local-audio-level-observer-error', (err:any) => { try { console.error('DIAG: local-audio-level-observer-error', err) } catch(e){} })
        } catch (e) {
          console.error('DIAG: failed to attach vapi listeners', e)
        }

        // TEMP DIAGNOSTIC: check microphone permission via Permissions API (best-effort)
        try {
          if (navigator && (navigator as any).permissions && (navigator as any).permissions.query) {
            try { (navigator as any).permissions.query({ name: 'microphone' }).then((p: any) => console.log('DIAG: mic permission state=', p.state)).catch((e:any)=>console.log('DIAG: mic permission query error', e)) } catch(e){}
          }
        } catch (e) {}

        // End button handler
        endBtn.addEventListener('click', async () => {
          if (!callActive || !vapi) return
          endBtn.disabled = true
          try {
            // Prefer end() to immediately terminate the call
            if (typeof vapi.end === 'function') {
              vapi.end()
            } else if (typeof vapi.stop === 'function') {
              await vapi.stop()
            }
          } catch (e) {
            console.error('Error ending Vapi call:', e)
          }
          callActive = false
          vapiActive = false
          try { showCompletionState() } catch (e) {}
          notice.textContent = ''
          startBtn.textContent = 'Interview Completed'
          startBtn.disabled = true
          endBtn.disabled = true
          endBtn.classList.add('hidden')
          try {
            await cleanupVapi()
          } catch (e) {}
        })

        // Start the call and pass candidate metadata if supported
        try {
          const metadata = {
            candidateId: startCandidateId,
            name: candidate.name,
            email: candidate.email,
            role: candidate.role,
          }

          await vapi.start(assistantId, { metadata })
        } catch (err) {
          console.error('[Interview] Failed to start Vapi:', err)
          notice.textContent = 'Failed to start the interview. Please try again.'
          startBtn.disabled = false
          startBtn.textContent = 'Start Interview'
          vapiActive = false
          try {
            await cleanupVapi()
          } catch (e) {}
        }
      })

      // remove listeners when card is removed from DOM
      const observer = new MutationObserver((mutations) => {
        for (const m of mutations) {
          for (const node of Array.from(m.removedNodes)) {
            if (node === card) {
              cleanupVapi()
              window.removeEventListener('popstate', onPop)
              window.removeEventListener('beforeunload', onPop)
              observer.disconnect()
            }
          }
        }
      })
      observer.observe(card.parentNode || document.body, { childList: true })

    } catch (err) {
      console.error('Unexpected error loading candidate:', err)
      card.innerHTML = ''
      const msg = document.createElement('div')
      msg.className = 'error-message'
      msg.textContent = 'Unable to load candidate information.'
      const details = document.createElement('pre')
      details.style.whiteSpace = 'pre-wrap'
      details.style.fontSize = '12px'
      details.style.color = 'var(--muted)'
      try {
        details.textContent = err ? ((err as any).message || JSON.stringify(err)) : 'Unknown error'
      } catch (e) {
        details.textContent = 'Error serializing exception'
      }
      card.appendChild(msg)
      card.appendChild(details)
    }
  })()

  return root
}

'use client'

import Link from 'next/link'
import Image from 'next/image'
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
} from 'react'
import { Fraunces, DM_Sans } from 'next/font/google'
import { CONFIG } from '@/lib/config'

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  weight: ['400', '500', '600', '700', '900'],
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-dm',
  display: 'swap',
})

const NAVY = '#1A2B6B'
const GOLD = '#C9A84C'
const GOLD_LIGHT = '#E8C97A'
const WHITE = '#FFFFFF'
const DARK_BG = '#0D1520'

const HERO_TITULO = 'Estudia desde casa'
const HERO_HIGHLIGHT = 'certifícate con la SEP'

const fmt = (n: number) =>
  n.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 })

function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function stripEmoji(s: string) {
  return s.replace(/^[^\p{L}\p{N}]+/u, '').trim()
}

/* ─── Global CSS ─────────────────────────────────────────────────────────── */
const cssGlobal = `
  html { scroll-behavior: smooth; }
  *, *::before, *::after { box-sizing: border-box; }

  @keyframes ceevaHeroGradient {
    0%   { background-position: 0% 50%; }
    50%  { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  @keyframes ceevaLineDraw {
    from { transform: scaleX(0); opacity: 0; }
    to   { transform: scaleX(1); opacity: 1; }
  }
  @keyframes ceevaCharIn {
    from { opacity: 0; transform: translate3d(0, 0.45em, 0); }
    to   { opacity: 1; transform: translate3d(0, 0, 0); }
  }
  @keyframes ceevaFloatA {
    0%, 100% { transform: translate3d(0, 0, 0) rotateX(12deg) rotateY(-18deg); }
    50%      { transform: translate3d(14px, -26px, 48px) rotateX(20deg) rotateY(10deg); }
  }
  @keyframes ceevaFloatB {
    0%, 100% { transform: translate3d(0, 0, 0) rotateX(-10deg) rotateY(22deg); }
    50%      { transform: translate3d(-18px, 18px, -36px) rotateX(-18deg) rotateY(-8deg); }
  }
  @keyframes ceevaFloatC {
    0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
    50%      { transform: translate3d(10px, -16px, 28px) scale(1.07); }
  }
  @keyframes ceevaParticle {
    0%   { opacity: 0; transform: translate3d(0, 18px, 0) scale(0.4); }
    14%  { opacity: 1; }
    86%  { opacity: 0.4; }
    100% { opacity: 0; transform: translate3d(var(--dx, 0), -95vh, 0) scale(var(--ds, 1.2)); }
  }
  @keyframes ceevaStamp {
    from { opacity: 0; transform: scale(2.4); }
    70%  { opacity: 1; transform: scale(0.94); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes ceevaRipple {
    to { transform: scale(28); opacity: 0; }
  }
  @keyframes ceevaShimmer {
    0%   { background-position: -300% center; }
    100% { background-position: 300% center; }
  }
  @keyframes ceevaGlow {
    0%, 100% { box-shadow: 0 0 14px rgba(201,168,76,0.28), inset 0 0 12px rgba(201,168,76,0.08); }
    50%      { box-shadow: 0 0 28px rgba(201,168,76,0.55), inset 0 0 18px rgba(201,168,76,0.18); }
  }
  @keyframes ceevaCursor {
    0%, 100% { opacity: 1; }
    50%      { opacity: 0; }
  }
  @keyframes ceevaScrollBounce {
    0%, 100% { transform: translateY(0); }
    50%      { transform: translateY(8px); }
  }
  @keyframes ceevaFeaturePop {
    from { opacity: 0; transform: translate3d(0, 28px, 0) scale(0.96); }
    to   { opacity: 1; transform: translate3d(0, 0, 0) scale(1); }
  }

  .ceeva-reveal {
    opacity: 0;
    transform: translate3d(0, 52px, 0);
    transition: opacity 0.95s cubic-bezier(0.16, 1, 0.3, 1),
                transform 0.95s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .ceeva-reveal.ceeva-reveal-visible {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }

  .ceeva-ripple-wrap { position: relative; overflow: hidden; }
  .ceeva-ripple {
    position: absolute; border-radius: 50%; pointer-events: none;
    width: 10px; height: 10px; margin-left: -5px; margin-top: -5px;
    background: rgba(255,255,255,0.38);
    animation: ceevaRipple 0.7s ease-out forwards;
  }

  .ceeva-card-3d {
    transform-style: preserve-3d;
    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1),
                box-shadow 0.4s ease;
    --rx: 0deg; --ry: 0deg;
    transform: perspective(1200px) rotateX(var(--ry)) rotateY(var(--rx));
  }
  .ceeva-card-3d:hover {
    box-shadow:
      0 36px 72px -18px rgba(201, 168, 76, 0.36),
      0 12px 32px rgba(0,0,0,0.48);
  }

  .ceeva-stamp-num { opacity: 0; transform: scale(2.4); }
  .ceeva-stamp-num.ceeva-stamp-go {
    animation: ceevaStamp 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }
  .ceeva-char {
    display: inline-block;
    opacity: 0;
    animation: ceevaCharIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  .ceeva-btn-primary {
    background-size: 300% auto;
    background-image: linear-gradient(
      115deg,
      ${GOLD} 0%,
      ${GOLD_LIGHT} 35%,
      #F0D88A 50%,
      ${GOLD_LIGHT} 65%,
      ${GOLD} 100%
    );
    animation: ceevaShimmer 4s linear infinite;
    cursor: pointer;
  }
  .ceeva-btn-primary:hover {
    animation-duration: 1.8s;
    transform: scale(1.025);
  }

  .ceeva-badge-glow { animation: ceevaGlow 3s ease-in-out infinite; }

  .ceeva-glass {
    background: rgba(26, 43, 107, 0.22);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border: 1px solid rgba(201, 168, 76, 0.22);
  }
  .ceeva-glass-card {
    background: rgba(13, 21, 32, 0.55);
    backdrop-filter: blur(28px);
    -webkit-backdrop-filter: blur(28px);
    border: 1px solid rgba(201, 168, 76, 0.18);
  }
  .ceeva-scroll-hint {
    animation: ceevaScrollBounce 1.8s ease-in-out infinite;
  }

  @media (prefers-reduced-motion: reduce) {
    .ceeva-reveal {
      opacity: 1;
      transform: none;
      transition: none;
    }
    .ceeva-btn-primary,
    .ceeva-badge-glow,
    .ceeva-scroll-hint {
      animation: none;
    }
    .ceeva-char {
      opacity: 1;
      animation: none;
    }
  }
`

/* ─── Hooks ──────────────────────────────────────────────────────────────── */
function useRipple() {
  return useCallback((e: MouseEvent<HTMLElement>) => {
    const el = e.currentTarget
    const rect = el.getBoundingClientRect()
    const span = document.createElement('span')
    span.className = 'ceeva-ripple'
    span.style.left = `${e.clientX - rect.left}px`
    span.style.top = `${e.clientY - rect.top}px`
    el.appendChild(span)
    window.setTimeout(() => span.remove(), 750)
  }, [])
}

/* ─── Sub-components ─────────────────────────────────────────────────────── */
function HeroTitle({ titulo, highlight }: { titulo: string; highlight: string }) {
  return (
    <h1
      className={`${fraunces.className} text-center font-semibold tracking-tight`}
      style={{ maxWidth: '700px', margin: '0 auto', lineHeight: 1.1, wordBreak: 'keep-all', overflowWrap: 'normal' }}
    >
      {/* Main line — white */}
      <span
        className="block"
        style={{ fontSize: 'clamp(3rem, 6vw, 5.5rem)', color: WHITE, textAlign: 'center' }}
      >
        {titulo.split('').map((ch, i) => (
          <span
            key={i}
            className="ceeva-char"
            style={{ animationDelay: `${i * 0.028}s`, color: WHITE }}
          >
            {ch === ' ' ? '\u00A0' : ch}
          </span>
        ))}
      </span>
      {/* Highlight — gold, own block */}
      <span
        className="block"
        style={{
          fontSize: 'clamp(2.2rem, 4.5vw, 4rem)',
          marginTop: '8px',
          color: GOLD,
          textAlign: 'center',
          textShadow: `0 0 28px ${GOLD}55`,
        }}
      >
        {highlight.split('').map((ch, i) => (
          <span
            key={i}
            className="ceeva-char"
            style={{ animationDelay: `${(titulo.length + i) * 0.028}s`, color: GOLD }}
          >
            {ch === ' ' ? '\u00A0' : ch}
          </span>
        ))}
      </span>
    </h1>
  )
}

function StatCounter({
  target,
  suffix,
  label,
  active,
  delay = 0,
}: {
  target: number
  suffix: string
  label: string
  active: boolean
  delay?: number
}) {
  const [v, setV] = useState(0)
  const raf = useRef<number | null>(null)

  useEffect(() => {
    if (!active) return
    const dur = 1500
    const t0 = performance.now() + delay * 1000
    const tick = (now: number) => {
      const elapsed = now - t0
      if (elapsed < 0) { raf.current = requestAnimationFrame(tick); return }
      const p = Math.min(1, elapsed / dur)
      const eased = 1 - (1 - p) ** 3
      setV(Math.round(eased * target))
      if (p < 1) raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => { if (raf.current) cancelAnimationFrame(raf.current) }
  }, [active, target, delay])

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className={`${fraunces.className} font-semibold tabular-nums leading-none`}
        style={{ fontSize: 'clamp(2.25rem, 5vw, 3.25rem)', color: GOLD }}
      >
        <span
          className={`ceeva-stamp-num${active ? ' ceeva-stamp-go' : ''}`}
          style={{ animationDelay: active ? `${delay}s` : '0s' }}
        >
          {v}
        </span>
        {suffix}
      </div>
      <div className={`${dmSans.className} text-center text-sm font-light leading-snug text-white/55`}>
        {label}
      </div>
    </div>
  )
}

/* Feature card icon set */
const FeatureIcons = {
  sep: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21h18M3 7l9-4 9 4M4 7v14M20 7v14M8 11v4M12 11v4M16 11v4"/>
    </svg>
  ),
  online: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
    </svg>
  ),
  cert: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="12" y2="17"/>
      <circle cx="17" cy="18" r="3"/>
      <path d="m15.4 16.4 1.6 1.6"/>
    </svg>
  ),
  flexible: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
}

/* ─── Main Component ─────────────────────────────────────────────────────── */
export default function LandingPage() {
  const ripple = useRipple()
  const heroRef = useRef<HTMLElement | null>(null)
  const statsRef = useRef<HTMLDivElement | null>(null)
  const stepsRef = useRef<HTMLDivElement | null>(null)
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const [statsActive, setStatsActive] = useState(false)
  const [stepsVisible, setStepsVisible] = useState(false)

  const topBadge =
    CONFIG.landing.hero_badges.find((b) => b.toUpperCase().includes('SEP')) ??
    CONFIG.landing.hero_badges[0]

  const nivelesCards = useMemo(
    () => [
      {
        key: 'secundaria' as const,
        titulo: cap('secundaria'),
        cert: CONFIG.precios.certificacion_secundaria,
        p6n: CONFIG.precios.secundaria_6meses_normal,
        p3n: CONFIG.precios.secundaria_3meses_normal,
        docs: CONFIG.documentosRequeridos.secundaria,
      },
      {
        key: 'preparatoria' as const,
        titulo: cap('preparatoria'),
        cert: CONFIG.precios.certificacion_preparatoria,
        p6n: CONFIG.precios.preparatoria_6meses_normal,
        p3n: CONFIG.precios.preparatoria_3meses_normal,
        docs: CONFIG.documentosRequeridos.preparatoria,
      },
    ] as const,
    [],
  )

  const featuresData = useMemo(
    () => [
      {
        icon: 'sep' as const,
        titulo: stripEmoji(CONFIG.landing.hero_badges[0]),
        desc: CONFIG.nombreCompleto,
      },
      {
        icon: 'online' as const,
        titulo: stripEmoji(CONFIG.landing.hero_badges[1]),
        desc: CONFIG.landing.hero_subtitulo.split('.')[0] ?? CONFIG.landing.hero_subtitulo,
      },
      {
        icon: 'cert' as const,
        titulo: stripEmoji(CONFIG.landing.hero_badges[2]),
        desc: CONFIG.landing.hero_subtitulo.split('.')[1]?.trim() ?? CONFIG.landing.hero_subtitulo,
      },
      {
        icon: 'flexible' as const,
        titulo: `${CONFIG.landing.años_experiencia}+ Años de experiencia`,
        desc: CONFIG.landing.hero_subtitulo.split('.')[2]?.trim() ?? CONFIG.landing.hero_subtitulo,
      },
    ],
    [],
  )

  const pasos = useMemo(
    () =>
      [
        CONFIG.landing.hero_badges[0],
        CONFIG.landing.hero_badges[1],
        CONFIG.landing.hero_badges[2],
        CONFIG.landing.hero_subtitulo,
      ].filter(Boolean),
    [],
  )

  const statLineLabel = stripEmoji(CONFIG.landing.hero_badges[1] ?? '100% en línea')

  /* Particle styles — 44 particles, 3 sizes */
  const particleStyles = useMemo(() => {
    const out: CSSProperties[] = []
    const sizes = [3, 4, 5, 6, 8]
    for (let i = 0; i < 44; i++) {
      const left = (i * 41 + 13) % 100
      const top  = (i * 29 + 5) % 88
      const delay = (i % 11) * 0.28
      const dur  = 8 + (i % 7) * 1.3
      const dx   = `${((i % 9) - 4) * 3}px`
      const ds   = 1 + (i % 3) * 0.15
      const size = sizes[i % sizes.length]
      const alpha = 0.55 + (i % 3) * 0.1
      out.push({
        left: `${left}%`,
        top: `${top}%`,
        width: `${size}px`,
        height: `${size}px`,
        animationDelay: `${delay}s`,
        animationDuration: `${dur}s`,
        ['--dx' as string]: dx,
        ['--ds' as string]: String(ds),
        opacity: alpha,
        boxShadow: `0 0 ${size * 3}px ${size}px ${GOLD}55`,
      } as CSSProperties)
    }
    return out
  }, [])

  /* 3D card handler */
  const cardMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    el.style.setProperty('--rx', `${x * -16}deg`)
    el.style.setProperty('--ry', `${y * 12}deg`)
  }
  const cardLeave = (e: MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.setProperty('--rx', '0deg')
    e.currentTarget.style.setProperty('--ry', '0deg')
  }

  /* Mouse parallax for hero spheres */
  const sphereParallax = {
    transform: `translate3d(${mouse.x * -20}px, ${mouse.y * -16}px, 0) rotateX(${mouse.y * -7}deg) rotateY(${mouse.x * 9}deg)`,
  }

  /* Intersection Observers + mouse listener */
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      setStatsActive(true)
      setStepsVisible(true)
      document.querySelectorAll('[data-ceeva-reveal]').forEach((el) =>
        el.classList.add('ceeva-reveal-visible'),
      )
      return
    }

    const ioReveal = new IntersectionObserver(
      (entries) => entries.forEach((en) => {
        if (en.isIntersecting) en.target.classList.add('ceeva-reveal-visible')
      }),
      { rootMargin: '0px 0px -6% 0px', threshold: 0.1 },
    )
    document.querySelectorAll<HTMLElement>('[data-ceeva-reveal]').forEach((el) =>
      ioReveal.observe(el),
    )

    const ioStats = new IntersectionObserver(
      (entries) => entries.forEach((en) => { if (en.isIntersecting) setStatsActive(true) }),
      { threshold: 0.2 },
    )
    if (statsRef.current) ioStats.observe(statsRef.current)

    const ioSteps = new IntersectionObserver(
      (entries) => entries.forEach((en) => { if (en.isIntersecting) setStepsVisible(true) }),
      { threshold: 0.18 },
    )
    if (stepsRef.current) ioSteps.observe(stepsRef.current)

    return () => {
      ioReveal.disconnect()
      ioStats.disconnect()
      ioSteps.disconnect()
    }
  }, [])

  useEffect(() => {
    const onMove = (e: globalThis.MouseEvent) => {
      if (!heroRef.current) return
      const r = heroRef.current.getBoundingClientRect()
      const nx = ((e.clientX - r.left) / r.width - 0.5) * 2
      const ny = ((e.clientY - r.top) / r.height - 0.5) * 2
      setMouse({ x: Math.max(-1, Math.min(1, nx)), y: Math.max(-1, Math.min(1, ny)) })
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  /* ── Render ──────────────────────────────────────────────────────────── */
  return (
    <div
      className={`${fraunces.variable} ${dmSans.variable} min-h-screen overflow-x-hidden antialiased`}
      style={{
        background: DARK_BG,
        fontFamily: 'var(--font-dm), ui-sans-serif, system-ui, sans-serif',
        color: WHITE,
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: cssGlobal }} />

      {/* ── SKIP LINK (accessibility) ────────────────────────────────── */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[9999] focus:rounded-lg focus:px-4 focus:py-2 focus:text-sm focus:font-medium"
        style={{ background: GOLD, color: NAVY }}
      >
        Ir al contenido principal
      </a>

      {/* ── NAV ─────────────────────────────────────────────────────── */}
      <nav
        role="navigation"
        aria-label="Navegación principal"
        className="fixed inset-x-0 top-0 z-50 flex h-[72px] items-center justify-between border-b px-4 sm:px-8"
        style={{
          borderColor: `${GOLD}33`,
          background: 'rgba(13, 21, 32, 0.82)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        <Link
          href="/"
          className="ceeva-ripple-wrap flex items-center gap-3 no-underline focus-visible:outline-none focus-visible:ring-2"
          onClick={ripple}
          aria-label={`${CONFIG.nombre} — ir al inicio`}
          style={{ ['--tw-ring-color' as string]: GOLD } as CSSProperties}
        >
          <Image
            src={CONFIG.logo}
            alt={`Logo ${CONFIG.nombre}`}
            width={44}
            height={44}
            className="h-11 w-11 rounded-xl object-contain"
            priority
          />
          <div className="min-w-0 leading-tight">
            <div
              className={`${fraunces.className} truncate text-base font-semibold`}
              style={{ color: WHITE }}
            >
              {CONFIG.nombre}
            </div>
            <div
              className={`${dmSans.className} truncate text-[10px] font-medium tracking-widest sm:text-[11px]`}
              style={{ color: GOLD }}
            >
              {CONFIG.dominio}
            </div>
          </div>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/login"
            className="ceeva-ripple-wrap rounded-xl border border-white/20 px-4 py-2.5 text-sm font-medium text-white/90 no-underline transition-all hover:border-white/40 hover:text-white focus-visible:outline-none focus-visible:ring-2"
            onClick={ripple}
            style={{ ['--tw-ring-color' as string]: GOLD } as CSSProperties}
          >
            Iniciar sesión
          </Link>
          <Link
            href="/register"
            className="ceeva-ripple-wrap ceeva-btn-primary rounded-xl px-4 py-2.5 text-sm font-semibold no-underline focus-visible:outline-none focus-visible:ring-2 sm:px-5"
            style={{ color: NAVY, ['--tw-ring-color' as string]: GOLD } as CSSProperties}
            onClick={ripple}
          >
            Crear cuenta
          </Link>
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────────────────────────── */}
      <header
        ref={heroRef}
        id="main-content"
        className="relative flex min-h-screen flex-col justify-center overflow-hidden px-4 pb-24 pt-[108px] sm:px-8"
        style={{
          backgroundColor: DARK_BG,
          backgroundImage: `
            radial-gradient(ellipse 80% 60% at 50% -10%, ${NAVY}88, transparent),
            radial-gradient(ellipse 50% 40% at 85% 80%, ${NAVY}44, transparent),
            linear-gradient(175deg, ${DARK_BG} 0%, #0a1018 100%)
          `,
        }}
      >
        {/* Watermark */}
        <div
          className={`pointer-events-none absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap ${fraunces.className}`}
          style={{
            fontSize: 'clamp(120px, 24vw, 240px)',
            fontWeight: 900,
            background: `linear-gradient(135deg, ${GOLD}06 0%, ${GOLD}10 50%, ${GOLD}04 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            lineHeight: 0.82,
            letterSpacing: '-0.05em',
            userSelect: 'none',
          }}
          aria-hidden
        >
          {CONFIG.nombre}
        </div>

        {/* Grid dot pattern */}
        <div
          className="pointer-events-none absolute inset-0 z-0 opacity-40"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(201,168,76,0.18) 1px, transparent 1px)`,
            backgroundSize: '30px 30px',
            maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)',
          }}
        />

        {/* 3D floating spheres with parallax */}
        <div
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
          style={{ perspective: '1400px', perspectiveOrigin: '50% 42%' }}
          aria-hidden
        >
          <div
            className="relative h-[min(76vh,660px)] w-[min(98vw,1140px)]"
            style={{ transformStyle: 'preserve-3d', ...sphereParallax }}
          >
            <div
              className="absolute rounded-full"
              style={{
                width: 'min(44vw, 400px)',
                height: 'min(44vw, 400px)',
                left: '4%',
                top: '12%',
                opacity: 0.24,
                background: `
                  radial-gradient(circle at 28% 24%, ${GOLD}44, transparent 52%),
                  radial-gradient(circle at 72% 72%, ${NAVY}cc, transparent 58%)
                `,
                border: `1px solid rgba(201,168,76,0.22)`,
                boxShadow: `inset 0 0 80px ${NAVY}55, 0 48px 120px rgba(0,0,0,0.55)`,
                animation: 'ceevaFloatA 15s ease-in-out infinite',
                transform: 'translateZ(44px)',
              }}
            />
            <div
              className="absolute rounded-full"
              style={{
                width: 'min(38vw, 320px)',
                height: 'min(38vw, 320px)',
                right: '3%',
                bottom: '8%',
                opacity: 0.18,
                background: `
                  radial-gradient(circle at 42% 38%, rgba(255,255,255,0.1), transparent 48%),
                  radial-gradient(circle at 58% 60%, ${NAVY}aa, transparent 56%)
                `,
                border: `1px solid rgba(201,168,76,0.16)`,
                animation: 'ceevaFloatB 18s ease-in-out infinite',
                transform: 'translateZ(-34px)',
              }}
            />
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                width: 'min(30vw, 240px)',
                height: 'min(30vw, 240px)',
                opacity: 0.16,
                background: `radial-gradient(circle, ${GOLD}66, transparent 60%)`,
                filter: 'blur(1px)',
                animation: 'ceevaFloatC 13s ease-in-out infinite',
                transform: 'translateZ(88px)',
              }}
            />
          </div>
        </div>

        {/* Particles */}
        {particleStyles.map((st, i) => (
          <span
            key={i}
            aria-hidden
            className="pointer-events-none absolute z-[1] block rounded-full"
            style={{
              ...st,
              background: `radial-gradient(circle, ${GOLD_LIGHT}, ${GOLD})`,
              animationName: 'ceevaParticle',
              animationIterationCount: 'infinite',
              animationTimingFunction: 'ease-in-out',
            }}
          />
        ))}

        {/* Hero content */}
        <div className="relative z-[2] mx-auto flex w-full max-w-[750px] flex-col items-center text-center">

          {/* SEP badge */}
          <div
            data-ceeva-reveal
            className="ceeva-reveal ceeva-badge-glow mb-8 inline-flex items-center gap-2 rounded-full px-5 py-2.5"
            style={{
              border: `1px solid ${GOLD}55`,
              background: `rgba(201,168,76,0.08)`,
            }}
          >
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ background: GOLD, boxShadow: `0 0 8px ${GOLD}` }}
            />
            <span
              className={`${dmSans.className} text-xs font-medium tracking-wide sm:text-sm`}
              style={{ color: GOLD }}
            >
              {stripEmoji(topBadge)}
            </span>
          </div>

          {/* Title */}
          <div data-ceeva-reveal className="ceeva-reveal w-full">
            <HeroTitle titulo={HERO_TITULO} highlight={HERO_HIGHLIGHT} />
          </div>

          {/* Subtitle */}
          <p
            data-ceeva-reveal
            className={`ceeva-reveal ${dmSans.className} mx-auto mt-6 max-w-2xl text-base font-light leading-relaxed sm:text-lg`}
            style={{ color: 'rgba(255,255,255,0.72)' }}
          >
            {CONFIG.landing.hero_subtitulo}
          </p>

          {/* CTA buttons */}
          <div
            data-ceeva-reveal
            className="ceeva-reveal mt-10 flex w-full flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center"
          >
            <Link
              href="/register"
              className="ceeva-ripple-wrap ceeva-btn-primary inline-flex min-h-[52px] items-center justify-center rounded-2xl px-8 py-4 text-base font-semibold no-underline shadow-lg focus-visible:outline-none focus-visible:ring-2"
              style={{
                color: NAVY,
                boxShadow: `0 8px 32px ${GOLD}44`,
                ['--tw-ring-color' as string]: GOLD,
              } as CSSProperties}
              onClick={ripple}
            >
              Crear cuenta gratis
            </Link>
            <a
              href={CONFIG.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Contactar por WhatsApp"
              className="ceeva-ripple-wrap inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded-2xl border-2 px-8 py-4 text-base font-medium text-white no-underline transition-all hover:bg-white/8 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2"
              style={{
                borderColor: `${GOLD}77`,
                ['--tw-ring-color' as string]: GOLD,
              } as CSSProperties}
              onClick={ripple}
            >
              <svg
                aria-hidden
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                style={{ color: '#25D366' }}
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.17 1.538 5.943L0 24l6.232-1.503A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.002-1.366l-.36-.214-3.7.893.935-3.58-.235-.372A9.818 9.818 0 1112 21.818z" />
              </svg>
              WhatsApp
            </a>
          </div>

          {/* Gold line separator */}
          <div data-ceeva-reveal className="ceeva-reveal mx-auto mt-12 w-full max-w-sm">
            <div
              className="h-[2px] w-full origin-left rounded-full"
              style={{
                background: `linear-gradient(90deg, transparent, ${GOLD}, ${GOLD_LIGHT}, ${GOLD}, transparent)`,
                animation: 'ceevaLineDraw 1.4s cubic-bezier(0.65,0,0.35,1) 0.5s both',
              }}
            />
          </div>

          {/* Stats */}
          <div
            ref={statsRef}
            className="mt-14 grid w-full max-w-3xl grid-cols-2 gap-8 sm:grid-cols-4 sm:gap-4"
          >
            <StatCounter target={CONFIG.niveles.length} suffix="" label="Niveles" active={statsActive} delay={0} />
            <StatCounter target={6} suffix="" label="Meses normal" active={statsActive} delay={0.12} />
            <StatCounter target={3} suffix="" label="Meses express" active={statsActive} delay={0.24} />
            <StatCounter target={100} suffix="%" label={statLineLabel} active={statsActive} delay={0.36} />
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className="ceeva-scroll-hint pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2"
          aria-hidden
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke={GOLD}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ opacity: 0.55 }}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </header>

      {/* ── TRUST BADGES STRIP ─────────────────────────────────────── */}
      <section
        aria-label="Credenciales institucionales"
        data-ceeva-reveal
        className="ceeva-reveal border-y"
        style={{
          background: `linear-gradient(90deg, ${NAVY}22, ${NAVY}44, ${NAVY}22)`,
          borderColor: `${GOLD}22`,
        }}
      >
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-0 divide-x divide-white/10">
          {CONFIG.landing.hero_badges.map((badge, i) => (
            <div
              key={i}
              className={`${dmSans.className} flex flex-1 items-center justify-center gap-2.5 px-6 py-5 text-sm font-medium sm:text-base`}
              style={{ color: 'rgba(255,255,255,0.78)', minWidth: 'min(100%, 180px)' }}
            >
              <span style={{ color: GOLD }} aria-hidden>
                {/* Leading indicator dot */}
                <svg width="6" height="6" viewBox="0 0 6 6" fill="currentColor">
                  <circle cx="3" cy="3" r="3" />
                </svg>
              </span>
              {stripEmoji(badge)}
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────── */}
      <section
        aria-labelledby="features-heading"
        data-ceeva-reveal
        className="ceeva-reveal px-4 py-20 sm:px-8 sm:py-28"
        style={{
          background: `linear-gradient(180deg, #0a1018 0%, ${DARK_BG} 60%, #080f1a 100%)`,
        }}
      >
        <div className="mx-auto max-w-5xl">
          <div className="mb-14 text-center">
            <h2
              id="features-heading"
              className={`${fraunces.className} text-[clamp(1.75rem,4.5vw,3rem)] font-semibold leading-tight`}
              style={{ color: WHITE }}
            >
              {CONFIG.landing.respaldo_titulo}
            </h2>
            <p
              className={`${dmSans.className} mt-4 text-base font-light sm:text-lg`}
              style={{ color: 'rgba(255,255,255,0.55)' }}
            >
              {CONFIG.nombreCompleto}
            </p>
          </div>

          <div
            className="grid gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-4"
            style={{ perspective: '1600px' }}
          >
            {featuresData.map((feat, i) => (
              <article
                key={i}
                className="ceeva-card-3d ceeva-glass-card flex flex-col items-start rounded-2xl p-6 transition-all hover:border-[rgba(201,168,76,0.38)] sm:p-7"
                style={{ borderTop: `2px solid ${GOLD}44` }}
                onMouseMove={cardMove}
                onMouseLeave={cardLeave}
              >
                <div
                  className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl"
                  style={{
                    background: `rgba(201,168,76,0.12)`,
                    border: `1px solid ${GOLD}33`,
                    color: GOLD,
                  }}
                >
                  <div className="h-6 w-6">{FeatureIcons[feat.icon]}</div>
                </div>
                <h3
                  className={`${fraunces.className} mb-2 text-lg font-semibold leading-snug sm:text-xl`}
                  style={{ color: WHITE }}
                >
                  {feat.titulo}
                </h3>
                <p
                  className={`${dmSans.className} text-sm font-light leading-relaxed`}
                  style={{ color: 'rgba(255,255,255,0.52)' }}
                >
                  {feat.desc}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ──────────────────────────────────────────────── */}
      <section
        aria-labelledby="pricing-heading"
        data-ceeva-reveal
        className="ceeva-reveal px-4 py-20 sm:px-8 sm:py-28"
        style={{
          background: `
            radial-gradient(ellipse 90% 50% at 50% 0%, ${NAVY}44, transparent),
            linear-gradient(180deg, #080f1a 0%, ${DARK_BG} 100%)
          `,
        }}
      >
        <div className="mx-auto max-w-5xl">
          <div className="mb-14 text-center">
            <h2
              id="pricing-heading"
              className={`${fraunces.className} text-[clamp(1.75rem,4.5vw,3rem)] font-semibold leading-tight`}
              style={{ color: WHITE }}
            >
              {CONFIG.niveles.map((n) => cap(n)).join(' · ')}
            </h2>
            <p
              className={`${dmSans.className} mt-4 text-base font-light`}
              style={{ color: 'rgba(255,255,255,0.5)' }}
            >
              {CONFIG.landing.hero_subtitulo}
            </p>
          </div>

          <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2" style={{ perspective: '1400px' }}>
            {nivelesCards.map((card) => (
              <article
                key={card.key}
                className="ceeva-card-3d ceeva-glass-card flex flex-col rounded-2xl p-6 sm:p-8"
                style={{ borderTop: `3px solid ${GOLD}` }}
                onMouseMove={cardMove}
                onMouseLeave={cardLeave}
              >
                <div className="mb-1 flex items-start justify-between gap-4">
                  <h3
                    className={`${fraunces.className} text-2xl font-semibold sm:text-3xl`}
                    style={{ color: WHITE }}
                  >
                    {card.titulo}
                  </h3>
                  <div
                    className={`${dmSans.className} mt-1 shrink-0 rounded-full px-3 py-1 text-xs font-medium`}
                    style={{ background: `${GOLD}22`, color: GOLD, border: `1px solid ${GOLD}44` }}
                  >
                    Oficial SEP
                  </div>
                </div>

                <ul
                  className={`${dmSans.className} mt-5 space-y-2 text-sm font-light`}
                  style={{ color: 'rgba(255,255,255,0.62)' }}
                  aria-label={`Documentos requeridos para ${card.titulo}`}
                >
                  {card.docs.map((d) => (
                    <li key={d} className="flex items-start gap-2.5">
                      <svg
                        aria-hidden
                        className="mt-0.5 h-4 w-4 shrink-0"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <circle cx="8" cy="8" r="7.25" stroke={GOLD} strokeWidth="1.5" />
                        <path d="M5 8l2 2 4-4" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {d}
                    </li>
                  ))}
                </ul>

                <div
                  className={`${dmSans.className} mt-6 space-y-3 border-t pt-6 text-sm font-light sm:mt-8 sm:pt-7`}
                  style={{ borderColor: 'rgba(255,255,255,0.1)' }}
                >
                  {[
                    { label: 'Inscripción', value: fmt(CONFIG.precios.inscripcion), color: 'rgba(255,255,255,0.8)' },
                    { label: '6 meses / mes', value: fmt(card.p6n), color: 'rgba(255,255,255,0.8)' },
                    { label: '3 meses / mes', value: fmt(card.p3n), color: 'rgba(255,255,255,0.8)' },
                  ].map((row) => (
                    <div key={row.label} className="flex items-baseline justify-between gap-4">
                      <span style={{ color: 'rgba(255,255,255,0.45)' }}>{row.label}</span>
                      <span className="tabular-nums font-medium" style={{ color: row.color }}>
                        {row.value}
                      </span>
                    </div>
                  ))}
                  <div
                    className="flex items-baseline justify-between gap-4 border-t pt-3"
                    style={{ borderColor: 'rgba(255,255,255,0.1)' }}
                  >
                    <span className="font-medium" style={{ color: GOLD }}>
                      Certificación
                    </span>
                    <span
                      className={`${fraunces.className} tabular-nums text-xl font-semibold sm:text-2xl`}
                      style={{ color: GOLD }}
                    >
                      {fmt(card.cert)}
                    </span>
                  </div>
                </div>

                <Link
                  href="/register"
                  className="ceeva-ripple-wrap ceeva-btn-primary mt-6 inline-flex min-h-[52px] w-full items-center justify-center rounded-2xl py-3.5 text-center text-base font-semibold no-underline shadow-lg sm:mt-8"
                  style={{
                    color: NAVY,
                    boxShadow: `0 6px 24px ${GOLD}33`,
                  }}
                  onClick={ripple}
                >
                  Crear cuenta gratis
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── PASOS / CÓMO FUNCIONA ─────────────────────────────────── */}
      <section
        aria-labelledby="steps-heading"
        data-ceeva-reveal
        className="ceeva-reveal relative px-4 py-20 sm:px-8 sm:py-28"
        style={{
          background: `linear-gradient(180deg, ${DARK_BG} 0%, ${NAVY}22 50%, ${DARK_BG} 100%)`,
        }}
      >
        <div className="mx-auto max-w-5xl">
          <h2
            id="steps-heading"
            className={`${fraunces.className} mx-auto mb-16 max-w-2xl text-center text-[clamp(1.75rem,4vw,2.75rem)] font-semibold leading-snug`}
            style={{ color: WHITE }}
          >
            {CONFIG.landing.respaldo_titulo}
          </h2>

          <div ref={stepsRef} className="relative">
            {/* Connector line (desktop) */}
            <div
              className="pointer-events-none absolute left-[10%] right-[10%] top-9 z-0 hidden h-px lg:block"
              style={{
                background: `linear-gradient(90deg, transparent 0%, ${GOLD}55 20%, ${GOLD}77 50%, ${GOLD}55 80%, transparent 100%)`,
              }}
              aria-hidden
            />

            <div className="relative z-[1] grid gap-12 sm:gap-8 lg:grid-cols-4 lg:gap-6">
              {pasos.map((texto, idx) => (
                <div key={idx} className="flex flex-col items-center text-center">
                  <div
                    className={`ceeva-stamp-num${stepsVisible ? ' ceeva-stamp-go' : ''} ${fraunces.className} mb-5 flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-2xl text-3xl font-bold`}
                    style={{
                      color: NAVY,
                      background: `linear-gradient(135deg, ${GOLD_LIGHT}, ${GOLD})`,
                      boxShadow: `0 8px 28px ${GOLD}44`,
                      animationDelay: stepsVisible ? `${idx * 0.14}s` : '0s',
                    }}
                  >
                    {String(idx + 1).padStart(2, '0')}
                  </div>
                  <p
                    className={`${dmSans.className} text-sm font-light leading-relaxed sm:text-[0.9375rem]`}
                    style={{ color: 'rgba(255,255,255,0.72)' }}
                  >
                    {stripEmoji(texto)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ────────────────────────────────────────────── */}
      <section
        aria-labelledby="cta-heading"
        data-ceeva-reveal
        className="ceeva-reveal relative overflow-hidden px-4 py-24 sm:px-8 sm:py-32"
      >
        {/* Background gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 70% 80% at 50% 50%, ${NAVY}cc 0%, ${DARK_BG} 100%)
            `,
          }}
          aria-hidden
        />
        {/* Subtle gold ring */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: 'min(90vw, 720px)',
            height: 'min(90vw, 720px)',
            border: `1px solid ${GOLD}18`,
            boxShadow: `0 0 120px ${GOLD}12`,
          }}
          aria-hidden
        />

        <div className="relative z-[1] mx-auto max-w-2xl text-center">
          <h2
            id="cta-heading"
            className={`${fraunces.className} text-[clamp(2rem,5vw,3.5rem)] font-semibold leading-tight`}
            style={{ color: WHITE }}
          >
            {CONFIG.landing.hero_titulo}
          </h2>
          <p
            className={`${dmSans.className} mx-auto mt-5 max-w-lg text-base font-light leading-relaxed sm:text-lg`}
            style={{ color: 'rgba(255,255,255,0.62)' }}
          >
            {CONFIG.landing.hero_subtitulo}
          </p>
          <div className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/register"
              className="ceeva-ripple-wrap ceeva-btn-primary inline-flex min-h-[52px] items-center justify-center rounded-2xl px-10 py-4 text-base font-semibold no-underline shadow-xl focus-visible:outline-none focus-visible:ring-2"
              style={{
                color: NAVY,
                boxShadow: `0 10px 40px ${GOLD}44`,
                ['--tw-ring-color' as string]: GOLD,
              } as CSSProperties}
              onClick={ripple}
            >
              Crear cuenta gratis
            </Link>
            <a
              href={CONFIG.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Hablar con nosotros por WhatsApp"
              className="ceeva-ripple-wrap inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded-2xl px-10 py-4 text-base font-medium text-white no-underline transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2"
              style={{
                background: '#25D366',
                boxShadow: '0 8px 24px rgba(37,211,102,0.3)',
                ['--tw-ring-color' as string]: '#25D366',
              } as CSSProperties}
              onClick={ripple}
            >
              <svg
                aria-hidden
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.17 1.538 5.943L0 24l6.232-1.503A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.002-1.366l-.36-.214-3.7.893.935-3.58-.235-.372A9.818 9.818 0 1112 21.818z" />
              </svg>
              WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────── */}
      <footer
        data-ceeva-reveal
        className="ceeva-reveal px-4 py-12 sm:px-8"
        style={{
          background: '#080f1a',
          borderTop: `1px solid ${GOLD}22`,
        }}
      >
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-8 text-center sm:flex-row sm:items-start sm:justify-between sm:text-left">
          <div className="flex flex-col items-center gap-3 sm:items-start">
            <Image
              src={CONFIG.logo}
              alt={`Logo ${CONFIG.nombre}`}
              width={48}
              height={48}
              className="rounded-xl object-contain"
            />
            <div
              className={`${fraunces.className} text-xl font-semibold`}
              style={{ color: WHITE }}
            >
              {CONFIG.nombre}
            </div>
            <p
              className={`${dmSans.className} max-w-xs text-sm font-light leading-relaxed`}
              style={{ color: 'rgba(255,255,255,0.42)' }}
            >
              {CONFIG.nombreCompleto}
            </p>
          </div>

          <nav
            aria-label="Navegación del pie de página"
            className={`${dmSans.className} flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm font-medium`}
          >
            <Link
              href="/login"
              className="no-underline transition-colors hover:text-white focus-visible:outline-none focus-visible:rounded"
              style={{ color: 'rgba(255,255,255,0.62)' }}
            >
              Iniciar sesión
            </Link>
            <Link
              href="/register"
              className="no-underline transition-colors hover:text-white focus-visible:outline-none focus-visible:rounded"
              style={{ color: 'rgba(255,255,255,0.62)' }}
            >
              Crear cuenta
            </Link>
            <a
              href={CONFIG.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="no-underline transition-colors hover:text-white focus-visible:outline-none focus-visible:rounded"
              style={{ color: 'rgba(255,255,255,0.62)' }}
            >
              WhatsApp
            </a>
          </nav>
        </div>

        <div
          className={`${dmSans.className} mt-10 border-t pt-8 text-center text-xs font-light`}
          style={{ borderColor: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.28)' }}
        >
          © {new Date().getFullYear()} {CONFIG.nombre} · {CONFIG.nombreCompleto}
        </div>
      </footer>
    </div>
  )
}

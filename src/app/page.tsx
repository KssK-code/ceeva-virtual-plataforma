'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type MouseEvent } from 'react'
import { Fraunces, DM_Sans } from 'next/font/google'
import { CONFIG } from '@/lib/config'

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-dm',
  display: 'swap',
})

const NAVY = '#1A2B6B'
const GOLD = '#C9A84C'
const WHITE = '#FFFFFF'
const DARK_BG = '#0D1520'

const fmt = (n: number) =>
  n.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 })

function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

const cssGlobal = `
  html { scroll-behavior: smooth; }
  @keyframes ceevaFadeInUp {
    from { opacity: 0; transform: translate3d(0, 36px, 0); }
    to { opacity: 1; transform: translate3d(0, 0, 0); }
  }
  @keyframes ceevaHeroGradient {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  @keyframes ceevaLineDraw {
    from { width: 0; }
    to { width: 100%; }
  }
  @keyframes ceevaCharIn {
    from { opacity: 0; transform: translate3d(0, 0.35em, 0); }
    to { opacity: 1; transform: translate3d(0, 0, 0); }
  }
  @keyframes ceevaFloatA {
    0%, 100% { transform: translate3d(0, 0, 0) rotateX(12deg) rotateY(-18deg); }
    50% { transform: translate3d(12px, -20px, 40px) rotateX(18deg) rotateY(8deg); }
  }
  @keyframes ceevaFloatB {
    0%, 100% { transform: translate3d(0, 0, 0) rotateX(-10deg) rotateY(22deg); }
    50% { transform: translate3d(-16px, 14px, -30px) rotateX(-16deg) rotateY(-6deg); }
  }
  @keyframes ceevaFloatC {
    0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
    50% { transform: translate3d(8px, -12px, 24px) scale(1.05); }
  }
  @keyframes ceevaParticle {
    0% { opacity: 0; transform: translate3d(0, 12px, 0) scale(0.6); }
    15% { opacity: 0.85; }
    85% { opacity: 0.55; }
    100% { opacity: 0; transform: translate3d(var(--dx, 0), -80vh, 0) scale(1); }
  }
  @keyframes ceevaStamp {
    from { opacity: 0; transform: scale(2); }
    70% { opacity: 1; transform: scale(0.96); }
    to { opacity: 1; transform: scale(1); }
  }
  @keyframes ceevaRipple {
    to { transform: scale(24); opacity: 0; }
  }
  .ceeva-reveal { opacity: 0; transform: translate3d(0, 40px, 0); transition: opacity 0.85s ease, transform 0.85s ease; }
  .ceeva-reveal.ceeva-reveal-visible { opacity: 1; transform: translate3d(0, 0, 0); }
  .ceeva-ripple-wrap { position: relative; overflow: hidden; }
  .ceeva-ripple {
    position: absolute; border-radius: 50%; pointer-events: none;
    width: 8px; height: 8px; margin-left: -4px; margin-top: -4px;
    background: rgba(255,255,255,0.45); animation: ceevaRipple 0.65s ease-out forwards;
  }
  .ceeva-card-3d {
    transform-style: preserve-3d;
    transition: transform 0.35s ease, box-shadow 0.35s ease;
    --rx: 0deg; --ry: 0deg;
    transform: perspective(1000px) rotateX(var(--ry)) rotateY(var(--rx));
  }
  .ceeva-card-3d:hover { box-shadow: 0 28px 56px -16px rgba(201, 168, 76, 0.28); }
  .ceeva-stamp-num { opacity: 0; transform: scale(2); }
  .ceeva-stamp-num.ceeva-stamp-go {
    animation: ceevaStamp 0.55s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }
  .ceeva-char {
    display: inline-block;
    opacity: 0;
    animation: ceevaCharIn 0.55s ease forwards;
  }
`

function useRipple() {
  return useCallback((e: MouseEvent<HTMLElement>) => {
    const el = e.currentTarget
    const rect = el.getBoundingClientRect()
    const span = document.createElement('span')
    span.className = 'ceeva-ripple'
    span.style.left = `${e.clientX - rect.left}px`
    span.style.top = `${e.clientY - rect.top}px`
    el.appendChild(span)
    window.setTimeout(() => span.remove(), 700)
  }, [])
}

function HeroTitleLetters({
  titulo,
  highlight,
  className,
}: {
  titulo: string
  highlight: string
  className?: string
}) {
  const hi = titulo.toLowerCase().indexOf(highlight.toLowerCase())
  const start = hi >= 0 ? hi : -1
  const end = start >= 0 ? start + highlight.length : -1

  return (
    <h1
      className={`${fraunces.className} text-center font-semibold leading-[1.08] tracking-tight ${className ?? ''}`}
      style={{ fontSize: 'clamp(2.25rem, 6vw, 4.5rem)' }}
    >
      {titulo.split('').map((char, i) => {
        const isHi = start >= 0 && i >= start && i < end
        return (
          <span
            key={`${i}-${char}`}
            className="ceeva-char"
            style={{
              animationDelay: `${i * 0.035}s`,
              color: isHi ? GOLD : WHITE,
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        )
      })}
    </h1>
  )
}

function StatCounter({
  target,
  suffix,
  label,
  active,
  classNameNum,
}: {
  target: number
  suffix: string
  label: string
  active: boolean
  classNameNum?: string
}) {
  const [v, setV] = useState(0)
  const raf = useRef<number | null>(null)

  useEffect(() => {
    if (!active) return
    const dur = 1400
    const t0 = performance.now()
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / dur)
      const eased = 1 - (1 - p) ** 3
      setV(Math.round(eased * target))
      if (p < 1) raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current)
    }
  }, [active, target])

  return (
    <div className="text-center">
      <div className={`${fraunces.className} text-[clamp(2rem,5vw,3rem)] font-semibold sm:text-[3rem] ${classNameNum ?? ''}`} style={{ color: GOLD }}>
        {v}
        {suffix}
      </div>
      <div className={`${dmSans.className} mt-1 text-sm font-light text-white/55`}>{label}</div>
    </div>
  )
}

export default function LandingPage() {
  const ripple = useRipple()
  const heroRef = useRef<HTMLElement | null>(null)
  const statsRef = useRef<HTMLDivElement | null>(null)
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const [statsActive, setStatsActive] = useState(false)
  const [stepsVisible, setStepsVisible] = useState(false)

  const topBadge =
    CONFIG.landing.hero_badges.find((b) => b.toUpperCase().includes('SEP')) ??
    CONFIG.landing.hero_badges[0] ??
    CONFIG.nombre

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

  const nivelesCards = useMemo(
    () =>
      [
        {
          key: 'secundaria' as const,
          titulo: cap('secundaria'),
          cert: CONFIG.precios.certificacion_secundaria,
          p6n: CONFIG.precios.secundaria_6meses_normal,
          p6s: CONFIG.precios.secundaria_6meses_sindicalizado,
          p3n: CONFIG.precios.secundaria_3meses_normal,
          p3s: CONFIG.precios.secundaria_3meses_sindicalizado,
          docs: CONFIG.documentosRequeridos.secundaria,
        },
        {
          key: 'preparatoria' as const,
          titulo: cap('preparatoria'),
          cert: CONFIG.precios.certificacion_preparatoria,
          p6n: CONFIG.precios.preparatoria_6meses_normal,
          p6s: CONFIG.precios.preparatoria_6meses_sindicalizado,
          p3n: CONFIG.precios.preparatoria_3meses_normal,
          p3s: CONFIG.precios.preparatoria_3meses_sindicalizado,
          docs: CONFIG.documentosRequeridos.preparatoria,
        },
      ] as const,
    [],
  )

  const statLineLabel =
    CONFIG.landing.hero_badges[1]?.replace(/^[^a-zA-Z0-9%]*\s*/, '') ?? '100% en línea'

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      setStatsActive(true)
      setStepsVisible(true)
      document.querySelectorAll('.ceeva-reveal').forEach((el) => el.classList.add('ceeva-reveal-visible'))
      return
    }

    const reveals = document.querySelectorAll<HTMLElement>('[data-ceeva-reveal]')
    const ioReveal = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) en.target.classList.add('ceeva-reveal-visible')
        })
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    )
    reveals.forEach((el) => ioReveal.observe(el))

    const ioStats = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) setStatsActive(true)
        })
      },
      { threshold: 0.25 },
    )
    if (statsRef.current) ioStats.observe(statsRef.current)

    const stepsEl = document.getElementById('ceeva-pasos')
    const ioSteps = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) setStepsVisible(true)
        })
      },
      { threshold: 0.2 },
    )
    if (stepsEl) ioSteps.observe(stepsEl)

    return () => {
      ioReveal.disconnect()
      ioStats.disconnect()
      ioSteps.disconnect()
    }
  }, [])

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!heroRef.current) return
      const r = heroRef.current.getBoundingClientRect()
      const nx = ((e.clientX - r.left) / r.width - 0.5) * 2
      const ny = ((e.clientY - r.top) / r.height - 0.5) * 2
      setMouse({ x: Math.max(-1, Math.min(1, nx)), y: Math.max(-1, Math.min(1, ny)) })
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  const particleStyles = useMemo(() => {
    const out: CSSProperties[] = []
    for (let i = 0; i < 28; i++) {
      const left = (i * 37 + 11) % 100
      const top = (i * 23 + 7) % 85
      const delay = (i % 9) * 0.35
      const dur = 7 + (i % 5) * 1.2
      const dx = `${(i % 7) - 3}px`
      out.push({
        left: `${left}%`,
        top: `${top}%`,
        animationDelay: `${delay}s`,
        animationDuration: `${dur}s`,
        ['--dx' as string]: dx,
      } as CSSProperties)
    }
    return out
  }, [])

  const cardMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    el.style.setProperty('--rx', `${x * -14}deg`)
    el.style.setProperty('--ry', `${y * 10}deg`)
  }
  const cardLeave = (e: MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.setProperty('--rx', '0deg')
    e.currentTarget.style.setProperty('--ry', '0deg')
  }

  const sphereParallax = {
    transform: `translate3d(${mouse.x * -18}px, ${mouse.y * -14}px, 0) rotateX(${mouse.y * -6}deg) rotateY(${mouse.x * 8}deg)`,
  }

  return (
    <div
      className={`${fraunces.variable} ${dmSans.variable} min-h-screen overflow-x-hidden bg-white text-[#1A1A2E] antialiased`}
      style={{ fontFamily: 'var(--font-dm), ui-sans-serif, system-ui, sans-serif' }}
    >
      <style dangerouslySetInnerHTML={{ __html: cssGlobal }} />

      <nav
        className="fixed inset-x-0 top-0 z-50 flex h-[72px] items-center justify-between border-b px-4 sm:px-8"
        style={{
          borderColor: GOLD,
          background: 'rgba(13, 21, 32, 0.78)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        }}
      >
        <Link href="/" className="ceeva-ripple-wrap flex items-center gap-3 no-underline" onClick={ripple}>
          <Image
            src={CONFIG.logo}
            alt={CONFIG.nombre}
            width={44}
            height={44}
            className="h-11 w-11 rounded-lg object-contain"
            priority
          />
          <div className="leading-tight">
            <div className="text-base font-medium text-white">{CONFIG.nombre}</div>
            <div className="text-[10px] font-medium tracking-[0.12em]" style={{ color: GOLD }}>
              {CONFIG.dominio}
            </div>
          </div>
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/login"
            className="ceeva-ripple-wrap rounded-xl border border-white/25 px-4 py-2.5 text-sm font-medium text-white no-underline transition-colors hover:bg-white/10"
            onClick={ripple}
          >
            Iniciar sesión
          </Link>
          <Link
            href="/register"
            className="ceeva-ripple-wrap rounded-xl px-4 py-2.5 text-sm font-medium no-underline transition-transform hover:scale-[1.02] sm:px-5"
            style={{ background: GOLD, color: NAVY }}
            onClick={ripple}
          >
            Crear cuenta
          </Link>
        </div>
      </nav>

      <header
        ref={heroRef}
        className="relative flex min-h-screen flex-col justify-center overflow-hidden px-4 pb-20 pt-[104px] sm:px-8"
        style={{
          backgroundColor: DARK_BG,
          backgroundImage: `linear-gradient(125deg, ${DARK_BG} 0%, ${NAVY}45 42%, ${DARK_BG} 78%, #0a1018 100%)`,
          backgroundSize: '240% 240%',
          animation: 'ceevaHeroGradient 22s ease-in-out infinite',
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.55]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(201,168,76,0.12) 1px, transparent 1px)`,
            backgroundSize: '28px 28px',
          }}
        />

        <div
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
          style={{ perspective: '1200px', perspectiveOrigin: '50% 40%' }}
        >
          <div
            className="relative h-[min(72vh,640px)] w-[min(96vw,1100px)]"
            style={{ transformStyle: 'preserve-3d', ...sphereParallax }}
          >
            <div
              className="absolute rounded-full opacity-[0.22]"
              style={{
                width: 'min(42vw, 380px)',
                height: 'min(42vw, 380px)',
                left: '6%',
                top: '14%',
                background: `radial-gradient(circle at 32% 28%, rgba(201,168,76,0.35), transparent 55%), radial-gradient(circle at 70% 70%, ${NAVY}aa, transparent 60%)`,
                border: `1px solid rgba(201,168,76,0.2)`,
                boxShadow: `inset 0 0 60px rgba(26,43,107,0.35), 0 40px 100px rgba(0,0,0,0.45)`,
                animation: 'ceevaFloatA 14s ease-in-out infinite',
                transform: 'translateZ(40px)',
              }}
            />
            <div
              className="absolute rounded-full opacity-[0.2]"
              style={{
                width: 'min(36vw, 300px)',
                height: 'min(36vw, 300px)',
                right: '4%',
                bottom: '10%',
                background: `radial-gradient(circle at 40% 40%, rgba(255,255,255,0.08), transparent 50%), radial-gradient(circle at 60% 55%, ${NAVY}99, transparent 58%)`,
                border: `1px solid rgba(201,168,76,0.15)`,
                animation: 'ceevaFloatB 16s ease-in-out infinite',
                transform: 'translateZ(-30px)',
              }}
            />
            <div
              className="absolute left-1/2 top-1/2 h-[min(28vw,220px)] w-[min(28vw,220px)] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.14]"
              style={{
                background: `radial-gradient(circle, ${GOLD}55, transparent 62%)`,
                filter: 'blur(0.5px)',
                animation: 'ceevaFloatC 12s ease-in-out infinite',
                transform: 'translateZ(80px)',
              }}
            />
          </div>
        </div>

        {particleStyles.map((st, i) => (
          <span
            key={i}
            className="pointer-events-none absolute z-[1] block h-1 w-1 rounded-full"
            style={{
              ...st,
              background: GOLD,
              opacity: 0.75,
              boxShadow: `0 0 10px ${GOLD}`,
              animationName: 'ceevaParticle',
              animationIterationCount: 'infinite',
              animationTimingFunction: 'ease-in-out',
            }}
          />
        ))}

        <div className="relative z-[2] mx-auto flex w-full max-w-4xl flex-col items-center text-center">
          <span
            data-ceeva-reveal
            className="ceeva-reveal mb-8 inline-flex rounded-full px-5 py-2 text-xs font-medium tracking-wide text-white sm:text-sm"
            style={{ border: `1px solid ${GOLD}`, boxShadow: `0 0 0 1px ${GOLD}33 inset` }}
          >
            {topBadge}
          </span>

          <div data-ceeva-reveal className="ceeva-reveal w-full">
            <HeroTitleLetters titulo={CONFIG.landing.hero_titulo} highlight={CONFIG.landing.hero_highlight} />
          </div>

          <p
            data-ceeva-reveal
            className={`ceeva-reveal ${dmSans.className} mx-auto mt-6 max-w-2xl text-base font-light leading-relaxed text-white/88 sm:text-lg`}
          >
            {CONFIG.landing.hero_subtitulo}
          </p>

          <div
            data-ceeva-reveal
            className="ceeva-reveal mt-10 flex w-full max-w-md flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center"
          >
            <Link
              href="/register"
              className="ceeva-ripple-wrap inline-flex items-center justify-center rounded-xl px-8 py-4 text-center text-base font-medium no-underline transition-transform hover:scale-[1.02]"
              style={{ background: GOLD, color: NAVY }}
              onClick={ripple}
            >
              Crear cuenta gratis
            </Link>
            <a
              href={CONFIG.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ceeva-ripple-wrap inline-flex items-center justify-center gap-2 rounded-xl border-2 px-8 py-4 text-base font-medium text-white no-underline transition-transform hover:scale-[1.02]"
              style={{ borderColor: GOLD, color: WHITE }}
              onClick={ripple}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.17 1.538 5.943L0 24l6.232-1.503A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.002-1.366l-.36-.214-3.7.893.935-3.58-.235-.372A9.818 9.818 0 1112 21.818z" />
              </svg>
              WhatsApp
            </a>
          </div>

          <div data-ceeva-reveal className="ceeva-reveal mx-auto mt-12 w-full max-w-lg px-2">
            <div className="h-[3px] w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full"
                style={{
                  background: `linear-gradient(90deg, transparent, ${GOLD}, ${GOLD}, transparent)`,
                  width: 0,
                  animation: 'ceevaLineDraw 1.35s cubic-bezier(0.65, 0, 0.35, 1) 0.4s forwards',
                }}
              />
            </div>
          </div>

          <div
            ref={statsRef}
            className="mt-14 grid w-full max-w-4xl grid-cols-2 gap-8 sm:grid-cols-4 sm:gap-6"
          >
            <StatCounter target={CONFIG.niveles.length} suffix="" label="Niveles" active={statsActive} />
            <StatCounter target={6} suffix="" label="Meses" active={statsActive} />
            <StatCounter target={3} suffix="" label="Meses Express" active={statsActive} />
            <StatCounter target={100} suffix="%" label={statLineLabel} active={statsActive} />
          </div>
        </div>
      </header>

      <section data-ceeva-reveal className="ceeva-reveal px-4 py-20 sm:px-8" style={{ background: WHITE }}>
        <h2
          className={`${fraunces.className} mx-auto mb-14 max-w-3xl text-center text-[clamp(1.75rem,4vw,2.75rem)] font-semibold`}
          style={{ color: NAVY }}
        >
          {CONFIG.niveles.map((n) => cap(n)).join(' · ')}
        </h2>

        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2" style={{ perspective: '1400px' }}>
          {nivelesCards.map((card) => (
            <article
              key={card.key}
              className="ceeva-card-3d flex flex-col rounded-2xl border border-black/5 bg-white p-8 shadow-[0_8px_30px_rgba(26,43,107,0.08)]"
              style={{ borderTop: `3px solid ${GOLD}` }}
              onMouseMove={cardMove}
              onMouseLeave={cardLeave}
            >
              <h3 className={`${fraunces.className} text-3xl font-semibold`} style={{ color: NAVY }}>
                {card.titulo}
              </h3>

              <ul className={`${dmSans.className} mt-6 space-y-2 text-sm font-light text-neutral-700`}>
                {card.docs.map((d) => (
                  <li key={d} className="flex gap-2">
                    <span style={{ color: GOLD }} aria-hidden>
                      ·
                    </span>
                    <span>{d}</span>
                  </li>
                ))}
              </ul>

              <div className={`${dmSans.className} mt-8 space-y-3 border-t border-black/10 pt-6 text-sm font-light`}>
                <div className="flex justify-between gap-4">
                  <span className="text-neutral-600">Inscripción</span>
                  <span className="font-medium tabular-nums" style={{ color: NAVY }}>
                    {fmt(CONFIG.precios.inscripcion)}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-neutral-600">6 meses (normal)</span>
                  <span className="font-medium tabular-nums" style={{ color: NAVY }}>
                    {fmt(card.p6n)} <span className="font-normal text-neutral-500">/ mes</span>
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-neutral-600">6 meses (sindicalizado)</span>
                  <span className="font-medium tabular-nums" style={{ color: NAVY }}>
                    {fmt(card.p6s)} <span className="font-normal text-neutral-500">/ mes</span>
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-neutral-600">3 meses (normal)</span>
                  <span className="font-medium tabular-nums" style={{ color: NAVY }}>
                    {fmt(card.p3n)} <span className="font-normal text-neutral-500">/ mes</span>
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-neutral-600">3 meses (sindicalizado)</span>
                  <span className="font-medium tabular-nums" style={{ color: NAVY }}>
                    {fmt(card.p3s)} <span className="font-normal text-neutral-500">/ mes</span>
                  </span>
                </div>
                <div className="flex justify-between gap-4 border-t border-black/10 pt-3">
                  <span className="text-neutral-600">Certificación</span>
                  <span className="font-medium tabular-nums" style={{ color: GOLD }}>
                    {fmt(card.cert)}
                  </span>
                </div>
              </div>

              <Link
                href="/register"
                className="ceeva-ripple-wrap mt-8 inline-flex w-full items-center justify-center rounded-xl py-3.5 text-center text-sm font-medium no-underline transition-transform hover:scale-[1.02] sm:text-base"
                style={{ background: GOLD, color: NAVY }}
                onClick={ripple}
              >
                Crear cuenta gratis
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section id="ceeva-pasos" data-ceeva-reveal className="ceeva-reveal px-4 py-20 sm:px-8" style={{ background: DARK_BG }}>
        <h2
          className={`${fraunces.className} mx-auto mb-16 max-w-3xl text-center text-[clamp(1.75rem,4vw,2.5rem)] font-semibold leading-snug text-white`}
        >
          {CONFIG.landing.respaldo_titulo}
        </h2>

        <div className="relative mx-auto max-w-6xl">
          <div
            className="pointer-events-none absolute left-[10%] right-[10%] top-[2.25rem] z-0 hidden h-px md:block"
            style={{
              background: `linear-gradient(90deg, transparent, ${GOLD}55, ${GOLD}55, ${GOLD}55, transparent)`,
            }}
            aria-hidden
          />
          <div className="relative z-[1] grid gap-12 md:grid-cols-4 md:gap-6">
            {pasos.map((texto, idx) => (
              <div key={idx} className="flex flex-col items-center text-center">
                <div
                  className={`ceeva-stamp-num ${stepsVisible ? 'ceeva-stamp-go' : ''} ${fraunces.className} mb-4 text-5xl font-semibold sm:text-6xl`}
                  style={{ color: GOLD, animationDelay: stepsVisible ? `${idx * 0.12}s` : '0s' }}
                >
                  {String(idx + 1).padStart(2, '0')}
                </div>
                <p className={`${dmSans.className} text-sm font-light leading-relaxed text-white sm:text-[0.9375rem]`}>
                  {texto}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        data-ceeva-reveal
        className="ceeva-reveal px-4 py-24 sm:px-8"
        style={{
          background: `linear-gradient(180deg, ${NAVY} 0%, ${DARK_BG} 100%)`,
        }}
      >
        <div className="mx-auto max-w-2xl text-center">
          <h2
            className={`${fraunces.className} text-[clamp(2rem,5vw,3.25rem)] font-semibold leading-tight text-white`}
          >
            {CONFIG.landing.hero_titulo}
          </h2>
          <p className={`${dmSans.className} mt-5 text-base font-light text-white/70 sm:text-lg`}>
            {CONFIG.landing.hero_subtitulo}
          </p>
          <div className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/register"
              className="ceeva-ripple-wrap inline-flex items-center justify-center rounded-xl px-10 py-4 text-base font-medium no-underline transition-transform hover:scale-[1.02]"
              style={{ background: GOLD, color: NAVY }}
              onClick={ripple}
            >
              Crear cuenta gratis
            </Link>
            <a
              href={CONFIG.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ceeva-ripple-wrap inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-10 py-4 text-base font-medium text-white no-underline transition-transform hover:scale-[1.02]"
              onClick={ripple}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.17 1.538 5.943L0 24l6.232-1.503A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.002-1.366l-.36-.214-3.7.893.935-3.58-.235-.372A9.818 9.818 0 1112 21.818z" />
              </svg>
              WhatsApp
            </a>
          </div>
        </div>
      </section>

      <footer
        data-ceeva-reveal
        className="ceeva-reveal px-4 py-14 sm:px-8"
        style={{ background: DARK_BG, borderTop: `1px solid ${GOLD}33` }}
      >
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-8 text-center sm:flex-row sm:items-start sm:justify-between sm:text-left">
          <div className="flex flex-col items-center gap-3 sm:items-start">
            <Image src={CONFIG.logo} alt={CONFIG.nombre} width={48} height={48} className="rounded-lg object-contain" />
            <div className={`${fraunces.className} text-xl font-semibold text-white`}>{CONFIG.nombre}</div>
            <p className={`${dmSans.className} max-w-sm text-sm font-light text-white/60`}>{CONFIG.nombreCompleto}</p>
          </div>
          <div className={`${dmSans.className} space-y-2 text-sm font-light text-white/55`}>
            <div>
              <span className="text-white/40">Dominio</span>
              <br />
              <span className="text-white/90">{CONFIG.dominio}</span>
            </div>
            <div>
              <span className="text-white/40">Correo</span>
              <br />
              <a href={`mailto:${CONFIG.email}`} className="text-white/90 underline-offset-2 hover:underline">
                {CONFIG.email}
              </a>
            </div>
            <div>
              <span className="text-white/40">WhatsApp</span>
              <br />
              <a
                href={CONFIG.whatsappUrl}
                className="text-white/90 underline-offset-2 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {CONFIG.whatsapp}
              </a>
            </div>
            {CONFIG.urlBase ? (
              <div>
                <span className="text-white/40">Web</span>
                <br />
                <span className="text-white/90">{CONFIG.urlBase}</span>
              </div>
            ) : null}
          </div>
        </div>
        <p className={`${dmSans.className} mt-12 text-center text-xs font-light text-white/35`}>
          © {new Date().getFullYear()} {CONFIG.nombre}. {CONFIG.nombreCompleto}
        </p>
      </footer>
    </div>
  )
}

import Link from 'next/link'
import Image from 'next/image'
import { Fraunces, DM_Sans } from 'next/font/google'
import { CONFIG } from '@/lib/config'

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
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

function HeroHeading({ titulo, highlight }: { titulo: string; highlight: string }) {
  const safe = highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const re = new RegExp(`(${safe})`, 'i')
  const parts = titulo.split(re)
  return (
    <h1
      className={`${fraunces.className} text-center font-semibold leading-[1.08] tracking-tight text-white`}
      style={{ fontSize: 'clamp(2.25rem, 6vw, 4.5rem)' }}
    >
      {parts.map((part, i) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
          <span key={i} style={{ color: GOLD }}>
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </h1>
  )
}

const cssBlocks = `
  @keyframes ceevaFadeInUp {
    from { opacity: 0; transform: translate3d(0, 28px, 0); }
    to { opacity: 1; transform: translate3d(0, 0, 0); }
  }
  @keyframes ceevaGoldLine {
    0%, 100% { transform: scaleX(0.35); opacity: 0.45; }
    50% { transform: scaleX(1); opacity: 1; }
  }
  .ceeva-hero-animate > * {
    animation: ceevaFadeInUp 0.85s ease forwards;
    opacity: 0;
  }
  .ceeva-hero-animate > *:nth-child(1) { animation-delay: 0.05s; }
  .ceeva-hero-animate > *:nth-child(2) { animation-delay: 0.12s; }
  .ceeva-hero-animate > *:nth-child(3) { animation-delay: 0.19s; }
  .ceeva-hero-animate > *:nth-child(4) { animation-delay: 0.26s; }
  .ceeva-hero-animate > *:nth-child(5) { animation-delay: 0.33s; }
  .ceeva-hero-animate > *:nth-child(6) { animation-delay: 0.4s; }
  .ceeva-hero-animate > *:nth-child(7) { animation-delay: 0.47s; }
  .ceeva-hero-animate > *:nth-child(8) { animation-delay: 0.54s; }
  .ceeva-gold-line {
    height: 2px;
    border-radius: 9999px;
    background: linear-gradient(90deg, transparent, ${GOLD}, transparent);
    transform-origin: center;
    animation: ceevaGoldLine 3.5s ease-in-out infinite;
  }
  .ceeva-card {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  .ceeva-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 40px -12px rgba(201, 168, 76, 0.35);
  }
  .ceeva-btn {
    transition: transform 0.3s ease, filter 0.3s ease;
  }
  .ceeva-btn:hover {
    transform: scale(1.02);
    filter: brightness(1.06);
  }
`

export default function LandingPage() {
  const topBadge =
    CONFIG.landing.hero_badges.find((b) => b.toUpperCase().includes('SEP')) ??
    CONFIG.landing.hero_badges[0] ??
    CONFIG.nombre

  const pasos = [
    CONFIG.landing.hero_badges[0],
    CONFIG.landing.hero_badges[1],
    CONFIG.landing.hero_badges[2],
    CONFIG.landing.hero_subtitulo,
  ].filter(Boolean)

  const nivelesCards: {
    key: (typeof CONFIG.niveles)[number]
    titulo: string
    cert: number
    p6n: number
    p6s: number
    p3n: number
    p3s: number
    docs: readonly string[]
  }[] = [
    {
      key: 'secundaria',
      titulo: cap('secundaria'),
      cert: CONFIG.precios.certificacion_secundaria,
      p6n: CONFIG.precios.secundaria_6meses_normal,
      p6s: CONFIG.precios.secundaria_6meses_sindicalizado,
      p3n: CONFIG.precios.secundaria_3meses_normal,
      p3s: CONFIG.precios.secundaria_3meses_sindicalizado,
      docs: CONFIG.documentosRequeridos.secundaria,
    },
    {
      key: 'preparatoria',
      titulo: cap('preparatoria'),
      cert: CONFIG.precios.certificacion_preparatoria,
      p6n: CONFIG.precios.preparatoria_6meses_normal,
      p6s: CONFIG.precios.preparatoria_6meses_sindicalizado,
      p3n: CONFIG.precios.preparatoria_3meses_normal,
      p3s: CONFIG.precios.preparatoria_3meses_sindicalizado,
      docs: CONFIG.documentosRequeridos.preparatoria,
    },
  ]

  const stats = [
    { num: String(CONFIG.niveles.length), label: 'Niveles' },
    { num: '6', label: 'Meses' },
    { num: '3', label: 'Meses Express' },
    {
      num: '100%',
      label: CONFIG.landing.hero_badges[1]?.replace(/^[^a-zA-Z0-9%]*\s*/, '') ?? '100% en línea',
    },
  ]

  return (
    <div
      className={`${fraunces.variable} ${dmSans.variable} min-h-screen bg-white text-[#1A1A2E] antialiased`}
      style={{ fontFamily: 'var(--font-dm), ui-sans-serif, system-ui, sans-serif' }}
    >
      <style dangerouslySetInnerHTML={{ __html: cssBlocks }} />

      <nav
        className="fixed inset-x-0 top-0 z-50 flex h-[72px] items-center justify-between border-b px-4 sm:px-8"
        style={{
          borderColor: GOLD,
          background: 'rgba(13, 21, 32, 0.72)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
        }}
      >
        <Link href="/" className="ceeva-btn flex items-center gap-3 no-underline">
          <Image
            src={CONFIG.logo}
            alt={CONFIG.nombre}
            width={44}
            height={44}
            className="h-11 w-11 rounded-lg object-contain"
            priority
          />
          <div className="leading-tight">
            <div className="text-base font-bold text-white">{CONFIG.nombre}</div>
            <div className="text-[10px] font-semibold tracking-[0.12em]" style={{ color: GOLD }}>
              {CONFIG.dominio}
            </div>
          </div>
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/login"
            className="ceeva-btn rounded-xl border border-white/25 px-4 py-2.5 text-sm font-semibold text-white no-underline hover:bg-white/10"
          >
            Iniciar sesión
          </Link>
          <Link
            href="/register"
            className="ceeva-btn rounded-xl px-4 py-2.5 text-sm font-bold no-underline sm:px-5"
            style={{ background: GOLD, color: NAVY }}
          >
            Crear cuenta
          </Link>
        </div>
      </nav>

      <header
        className="relative flex min-h-screen flex-col justify-center overflow-hidden px-4 pb-16 pt-[104px] sm:px-8"
        style={{
          backgroundColor: DARK_BG,
          backgroundImage: `radial-gradient(circle at center, rgba(201,168,76,0.07) 0.5px, transparent 0.5px)`,
          backgroundSize: '24px 24px',
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            background: `radial-gradient(ellipse 80% 50% at 50% -20%, ${NAVY}88, transparent)`,
          }}
        />

        <div className="ceeva-hero-animate relative mx-auto flex w-full max-w-4xl flex-col items-center text-center">
          <span
            className="mb-8 inline-flex rounded-full px-5 py-2 text-xs font-semibold tracking-wide text-white sm:text-sm"
            style={{ border: `1px solid ${GOLD}`, boxShadow: `0 0 0 1px ${GOLD}33 inset` }}
          >
            {topBadge}
          </span>

          <HeroHeading titulo={CONFIG.landing.hero_titulo} highlight={CONFIG.landing.hero_highlight} />

          <p
            className={`${dmSans.className} mx-auto mt-6 max-w-2xl text-base font-light leading-relaxed text-white/85 sm:text-lg`}
          >
            {CONFIG.landing.hero_subtitulo}
          </p>

          <div className="mt-10 flex w-full max-w-md flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center">
            <Link
              href="/register"
              className="ceeva-btn inline-flex items-center justify-center rounded-xl px-8 py-4 text-center text-base font-bold no-underline"
              style={{ background: GOLD, color: NAVY }}
            >
              Crear cuenta gratis
            </Link>
            <a
              href={CONFIG.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ceeva-btn inline-flex items-center justify-center gap-2 rounded-xl border-2 px-8 py-4 text-base font-semibold text-white no-underline"
              style={{ borderColor: GOLD, color: WHITE }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.17 1.538 5.943L0 24l6.232-1.503A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.002-1.366l-.36-.214-3.7.893.935-3.58-.235-.372A9.818 9.818 0 1112 21.818z" />
              </svg>
              WhatsApp
            </a>
          </div>

          <div className="ceeva-gold-line mx-auto mt-12 w-full max-w-lg" />

          <div className="mt-14 grid w-full max-w-4xl grid-cols-2 gap-8 sm:grid-cols-4 sm:gap-6">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div
                  className={`${fraunces.className} text-[clamp(2rem,5vw,3rem)] font-semibold sm:text-[3rem]`}
                  style={{ color: GOLD }}
                >
                  {s.num}
                </div>
                <div className={`${dmSans.className} mt-1 text-sm text-white/55`}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </header>

      <section className="px-4 py-20 sm:px-8" style={{ background: WHITE }}>
        <h2
          className={`${fraunces.className} mx-auto mb-14 max-w-3xl text-center text-[clamp(1.75rem,4vw,2.75rem)] font-semibold`}
          style={{ color: NAVY }}
        >
          {CONFIG.niveles.map((n) => cap(n)).join(' · ')}
        </h2>

        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
          {nivelesCards.map((card) => (
            <article
              key={card.key}
              className="ceeva-card flex flex-col rounded-2xl border border-black/5 bg-white p-8 shadow-[0_8px_30px_rgba(26,43,107,0.08)]"
              style={{ borderTop: `3px solid ${GOLD}` }}
            >
              <h3 className={`${fraunces.className} text-3xl font-semibold`} style={{ color: NAVY }}>
                {card.titulo}
              </h3>

              <ul className={`${dmSans.className} mt-6 space-y-2 text-sm text-neutral-700`}>
                {card.docs.map((d) => (
                  <li key={d} className="flex gap-2">
                    <span style={{ color: GOLD }} aria-hidden>
                      ·
                    </span>
                    <span>{d}</span>
                  </li>
                ))}
              </ul>

              <div className={`${dmSans.className} mt-8 space-y-3 border-t border-black/10 pt-6 text-sm`}>
                <div className="flex justify-between gap-4">
                  <span className="text-neutral-600">Inscripción</span>
                  <span className="font-semibold tabular-nums" style={{ color: NAVY }}>
                    {fmt(CONFIG.precios.inscripcion)}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-neutral-600">6 meses (normal)</span>
                  <span className="font-semibold tabular-nums" style={{ color: NAVY }}>
                    {fmt(card.p6n)} <span className="font-normal text-neutral-500">/ mes</span>
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-neutral-600">6 meses (sindicalizado)</span>
                  <span className="font-semibold tabular-nums" style={{ color: NAVY }}>
                    {fmt(card.p6s)} <span className="font-normal text-neutral-500">/ mes</span>
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-neutral-600">3 meses (normal)</span>
                  <span className="font-semibold tabular-nums" style={{ color: NAVY }}>
                    {fmt(card.p3n)} <span className="font-normal text-neutral-500">/ mes</span>
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-neutral-600">3 meses (sindicalizado)</span>
                  <span className="font-semibold tabular-nums" style={{ color: NAVY }}>
                    {fmt(card.p3s)} <span className="font-normal text-neutral-500">/ mes</span>
                  </span>
                </div>
                <div className="flex justify-between gap-4 border-t border-black/10 pt-3">
                  <span className="text-neutral-600">Certificación</span>
                  <span className="font-bold tabular-nums" style={{ color: GOLD }}>
                    {fmt(card.cert)}
                  </span>
                </div>
              </div>

              <Link
                href="/register"
                className="ceeva-btn mt-8 inline-flex w-full items-center justify-center rounded-xl py-3.5 text-center text-sm font-bold no-underline sm:text-base"
                style={{ background: GOLD, color: NAVY }}
              >
                Crear cuenta gratis
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="px-4 py-20 sm:px-8" style={{ background: DARK_BG }}>
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
                  className={`${fraunces.className} mb-4 text-5xl font-bold sm:text-6xl`}
                  style={{ color: GOLD }}
                >
                  {String(idx + 1).padStart(2, '0')}
                </div>
                <p className={`${dmSans.className} text-sm leading-relaxed text-white sm:text-[0.9375rem]`}>
                  {texto}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="px-4 py-24 sm:px-8"
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
              className="ceeva-btn inline-flex items-center justify-center rounded-xl px-10 py-4 text-base font-bold no-underline"
              style={{ background: GOLD, color: NAVY }}
            >
              Crear cuenta gratis
            </Link>
            <a
              href={CONFIG.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ceeva-btn inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-10 py-4 text-base font-bold text-white no-underline"
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

      <footer className="px-4 py-14 sm:px-8" style={{ background: DARK_BG, borderTop: `1px solid ${GOLD}33` }}>
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-8 text-center sm:flex-row sm:items-start sm:justify-between sm:text-left">
          <div className="flex flex-col items-center gap-3 sm:items-start">
            <Image src={CONFIG.logo} alt={CONFIG.nombre} width={48} height={48} className="rounded-lg object-contain" />
            <div className={`${fraunces.className} text-xl font-semibold text-white`}>{CONFIG.nombre}</div>
            <p className={`${dmSans.className} max-w-sm text-sm text-white/60`}>{CONFIG.nombreCompleto}</p>
          </div>
          <div className={`${dmSans.className} space-y-2 text-sm text-white/55`}>
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
        <p className={`${dmSans.className} mt-12 text-center text-xs text-white/35`}>
          © {new Date().getFullYear()} {CONFIG.nombre}. {CONFIG.nombreCompleto}
        </p>
      </footer>
    </div>
  )
}

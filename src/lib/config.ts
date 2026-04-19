// src/lib/config.ts — CEEVA
export const CONFIG = {
  nombre: 'CEEVA',
  nombreCompleto: 'Centro de Estudios en Educación Virtual y Académica',
  logo: '/logo-ceeva.png',
  logoOscuro: '/logo-ceeva-dark.png',

  whatsapp: '3318806419',
  whatsappUrl: 'https://wa.me/523318806419',
  email: 'ceevavirtual@gmail.com',

  dominio: 'ceevavirtual.online',
  urlBase: 'https://ceevavirtual.online',

  colores: {
    primario: '#1B2F6E',
    secundario: '#2E4BA3',
    acento: '#C9A84C',
    acentoClaro: '#E8C97A',
    texto: '#1A1A2E',
    fondo: '#F8F9FF',
  },

  niveles: ['secundaria', 'preparatoria'] as const,

  precios: {
    inscripcion: 399,
    preparatoria: {
      meses6: { porMes: 1000, total: 6000, label: 'Preparatoria 6 meses' },
      meses3: { porMes: 2000, total: 6000, label: 'Preparatoria 3 meses Express' },
      certificacion: 4750,
    },
    secundaria: {
      meses6: { porMes: 1000, total: 6000, label: 'Secundaria 6 meses' },
      meses3: { porMes: 2000, total: 6000, label: 'Secundaria 3 meses Express' },
      certificacion: 4250,
    },
  },

  documentosRequeridos: {
    secundaria: [
      'Certificado de Primaria',
      'CURP',
      'Acta de Nacimiento',
      'Identificación Oficial',
      'Foto de Perfil (fondo blanco)',
    ],
    preparatoria: [
      'Certificado de Secundaria',
      'CURP',
      'Acta de Nacimiento',
      'Identificación Oficial',
      'Foto de Perfil (fondo blanco)',
    ],
  },

  landing: {
    tagline: 'Estudia a tu ritmo, certifícate con la SEP',
    descripcion: 'Somos un centro educativo incorporado a la SEP. Ofrecemos Secundaria y Preparatoria en línea para jóvenes y adultos que desean superarse desde la comodidad de su hogar.',
    heroBadges: [
      { icono: '🏛️', texto: 'Incorporado a la SEP' },
      { icono: '💻', texto: '100% en línea' },
      { icono: '📜', texto: 'Certificación oficial' },
    ],
    convenios: [],
    respaldoBadges: [],

    hero_titulo: 'Estudia desde casa, certifícate con la SEP',
    hero_highlight: 'certifícate',
    hero_subtitulo: 'Sin ir a la escuela. Certificado oficial reconocido por la SEP.',
    hero_badges: [
      '🏛️ Incorporado a la SEP',
      '💻 100% en línea',
      '📜 Certificación oficial',
    ],
    años_experiencia: '5',
    respaldo_titulo: 'Respaldados por instituciones educativas de confianza',
    respaldo_badges: [] as string[],
    certificacion_secundaria: 4250,
    certificacion_preparatoria: 4750,
    cct: '',
  },

  cct: '',

  redes: {
    facebook: '',
    instagram: '',
  },
} as const

export type Nivel = typeof CONFIG.niveles[number]
export type PreciosNivel = typeof CONFIG.precios.preparatoria

export const ESCUELA_CONFIG = CONFIG
export const config = CONFIG
export default CONFIG

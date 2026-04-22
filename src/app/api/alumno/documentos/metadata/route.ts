import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

const TIPOS_VALIDOS = [
  'acta_nacimiento', 'curp', 'certificado_primaria',
  'certificado_secundaria', 'identificacion_oficial', 'foto_perfil_doc',
] as const

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    const body = await req.json() as {
      tipo_documento?: string
      nombre_archivo?: string
      url_archivo?: string
    }
    const { tipo_documento, nombre_archivo, url_archivo } = body

    if (!tipo_documento || !nombre_archivo || !url_archivo) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 })
    }

    if (!TIPOS_VALIDOS.includes(tipo_documento as (typeof TIPOS_VALIDOS)[number])) {
      return NextResponse.json({ error: 'Tipo de documento inválido' }, { status: 400 })
    }

    const admin = createAdminClient()
    const { data: alumno } = await admin
      .from('alumnos')
      .select('id')
      .eq('id', user.id)
      .single()

    if (!alumno) return NextResponse.json({ error: 'Alumno no encontrado' }, { status: 404 })

    const a = alumno as { id: string }

    const { error: upsertError } = await admin
      .from('documentos_alumno')
      .upsert({
        alumno_id: a.id,
        tipo_documento,
        nombre_archivo,
        url_archivo,
        verificado: false,
        fecha_subida: new Date().toISOString(),
      }, { onConflict: 'alumno_id,tipo_documento' })

    if (upsertError) return NextResponse.json({ error: upsertError.message }, { status: 500 })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

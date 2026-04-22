import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { verifyAdmin } from '@/lib/supabase/verify-admin'
import { mapDocumentoAlumnoRow, documentoStoragePath } from '@/lib/admin/documentos-admin'

export async function GET() {
  try {
    // ── Auth ─────────────────────────────────────────────────────────────────
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    const denied = await verifyAdmin(supabase, user.id)
    if (denied) return denied

    // ── Query con service role (bypass RLS) ──────────────────────────────────
    const admin = createAdminClient()

    let { data, error } = await admin
      .from('documentos_alumno')
      .select('*')
      .order('fecha_subida', { ascending: false })

    if (error) {
      const second = await admin
        .from('documentos_alumno')
        .select('*')
        .order('subido_en', { ascending: false })
      data = second.data
      error = second.error
    }

    if (error) {
      console.error('[GET /api/admin/documentos] Error:', error.message, '| code:', error.code)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const rows = (data ?? []) as Record<string, unknown>[]

    // ── Enriquecer con nombre del alumno ─────────────────────────────────────
    const alumnoIds = [...new Set(rows.map((d) => String(d.alumno_id ?? '')).filter(Boolean))]

    const { data: usuarios } = alumnoIds.length > 0
      ? await admin.from('usuarios').select('id, nombre, apellidos').in('id', alumnoIds)
      : { data: [] }

    const usuarioMap = new Map<string, string>(
      (usuarios ?? []).map((u: { id: string; nombre?: string; apellidos?: string }) => [
        u.id,
        [u.nombre, u.apellidos].filter(Boolean).join(' ') || '—',
      ])
    )

    const tryPath = async (p: string) => {
      const { data: signed } = await admin.storage.from('documentos').createSignedUrl(p, 3600)
      return signed?.signedUrl ?? null
    }

    const result = await Promise.all(
      rows.map(async (row) => {
        const doc = mapDocumentoAlumnoRow(row)
        const path = documentoStoragePath(doc.alumno_id, doc.tipo, doc.nombre_archivo)
        let signed = await tryPath(path)
        if (!signed) {
          for (const ext of ['jpg', 'jpeg', 'png', 'webp', 'pdf']) {
            signed = await tryPath(`${doc.alumno_id}/${doc.tipo}.${ext}`)
            if (signed) break
          }
        }
        return {
          id:               doc.id,
          alumno_id:        doc.alumno_id,
          tipo:             doc.tipo,
          nombre_archivo:   doc.nombre_archivo,
          estado:           doc.estado,
          comentario_admin: doc.comentario_admin,
          subido_en:        doc.subido_en,
          signed_url:       signed ?? doc.url,
          alumno_nombre:    usuarioMap.get(doc.alumno_id) ?? '—',
        }
      })
    )

    return NextResponse.json(result)
  } catch (err) {
    console.error('[GET /api/admin/documentos] excepción:', err)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

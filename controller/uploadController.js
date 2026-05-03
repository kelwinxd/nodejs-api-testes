import { v2 as cloudinary } from 'cloudinary'
import pool from '../databasePg.js'

cloudinary.config({
  cloud_name: 'dbwuq1k2j',
  api_key: '834194573852283',
  api_secret: 'TFZXt-I2FEbrSPb18r9KrDLQLhE'
})

// POST /gifts/:id/upload
// multipart/form-data com campo "qrcode" (arquivo) e opcionalmente "codigopix" (texto)
export async function uploadQrCode(req, res) {
  const { id } = req.params
  const { codigopix } = req.body

  try {
    if (!req.file) return res.status(400).json({ error: 'Nenhuma imagem enviada' })

    // Sobe no Cloudinary direto do buffer
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: 'qrcodes', public_id: `gift_${id}`, overwrite: true },
        (error, result) => error ? reject(error) : resolve(result)
      ).end(req.file.buffer)
    })

    // Monta os campos a atualizar
    const fields = ['qrcode = $1']
    const values = [result.secure_url]
    let idx = 2

    if (codigopix !== undefined) {
      fields.push(`codigopix = $${idx++}`)
      values.push(codigopix)
    }

    values.push(id)

    const db = await pool.query(
      `UPDATE cgifts SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
      values
    )

    if (db.rowCount === 0) return res.status(404).json({ error: 'Presente não encontrado' })

    return res.json(db.rows[0])
  } catch (error) {
    console.error('ERRO UPLOAD:', error)
    return res.status(500).json({ error: error.message })
  }
}

// PATCH /gifts/:id/pix  — só atualiza codigopix sem imagem
export async function updatePix(req, res) {
  const { id } = req.params
  const { codigopix } = req.body

  if (!codigopix) return res.status(400).json({ error: 'codigopix é obrigatório' })

  try {
    const result = await pool.query(
      'UPDATE cgifts SET codigopix = $1 WHERE id = $2 RETURNING *',
      [codigopix, id]
    )
    if (result.rowCount === 0) return res.status(404).json({ error: 'Presente não encontrado' })
    return res.json(result.rows[0])
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}
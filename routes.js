import express from "express";
import {get, post, remove, removegiver} from './controller/userController.js'
import pool from "./databasePg.js"

export default function routes(){
const router = express.Router()

router.get("/users", get);
router.post("/users", post);
router.delete("/users/:id", remove)
router.delete("/givers/:id", removegiver)

router.get("/gifts", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM cgifts ORDER BY id ASC")
    res.json(result.rows)
  } catch (error) {
    console.error("ERRO NO /gifts:", error)
    res.status(500).json({ error: error.message })
  }
})

router.post("/gifts", async (req, res) => {
  const { giftname, price } = req.body
  if (!giftname || !giftname.trim()) {
    return res.status(400).json({ message: "Nome do presente é obrigatório" })
  }
  try {
    const result = await pool.query(
      "INSERT INTO cgifts (giftname, price, chosen) VALUES ($1, $2, false) RETURNING *",
      [giftname.trim(), price ?? null]
    )
    res.status(201).json(result.rows[0])
  } catch (error) {
    console.error("ERRO NO POST /gifts:", error)
    res.status(500).json({ error: error.message })
  }
})

router.delete("/gifts/:id", async (req, res) => {
  const { id } = req.params
  try {
    await pool.query("DELETE FROM cgifts WHERE id = $1", [id])
    res.status(204).send()
  } catch (error) {
    console.error("ERRO NO DELETE /gifts:", error)
    res.status(500).json({ error: error.message })
  }
})

 // ✅ PATCH de gifts — estava faltando essa rota
router.patch("/gifts/:id", async (req, res) => {
    const { id } = req.params
    const { giftname, price, chosen } = req.body

    const fields = []
    const values = []
    let idx = 1

    if (giftname !== undefined) { fields.push(`giftname = $${idx++}`); values.push(giftname) }
    if (price     !== undefined) { fields.push(`price = $${idx++}`);    values.push(price)    }
    if (chosen    !== undefined) { fields.push(`chosen = $${idx++}`);   values.push(chosen)   }

    if (fields.length === 0) return res.status(400).json({ error: "Nenhum campo para atualizar" })

    values.push(id)
    try {
      const result = await pool.query(
        `UPDATE cgifts SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
        values
      )
      if (result.rowCount === 0) return res.status(404).json({ error: "Não encontrado" })
      res.json(result.rows[0])
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  })

router.post("/gifts/select", async (req, res) => {
  const { id } = req.body
  const result = await pool.query(
    "UPDATE cgifts SET chosen = true WHERE id = $1 AND chosen = false RETURNING *",
    [id]
  )
  if (result.rowCount === 0) {
    return res.status(400).json({ message: "Já foi escolhido" })
  }
  res.json(result.rows[0])
})



return router;
}
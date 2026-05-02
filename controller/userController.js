import pool from "../databasePg.js"

export async function get(req, res){
    try {
        const result = await pool.query("SELECT * FROM givers ORDER BY id ASC")
        return res.json(result.rows)
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

export async function post(req, res) {
  const { name, gift, tipo } = req.body  
  try {
    const result = await pool.query(
      "INSERT INTO givers (name, gift, tipo) VALUES ($1, $2, $3) RETURNING *",
      [name, gift, tipo ?? 'fisico']
    )
    return res.status(201).json(result.rows[0])
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}


export async function remove(req, res){
    const { id } = req.params
    try {
        const result = await pool.query(
            "DELETE FROM gifts WHERE id = $1 RETURNING *",
            [id]
        )
        if (result.rowCount === 0)
            return res.status(404).json({ error: "Presente não encontrado" })
        return res.status(204).send()
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}
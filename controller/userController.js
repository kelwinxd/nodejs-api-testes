import pool from "../databasePg.js"

export async function get(req, res){
    try {
        const result = await pool.query("SELECT * FROM gifts ORDER BY id ASC")
        return res.json(result.rows)
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

export async function post(req, res){
    const { giftname, price } = req.body
    try {
        const result = await pool.query(
            "INSERT INTO gifts (giftname, price) VALUES ($1, $2) RETURNING *",
            [giftname, price ?? null]
        )
        return res.status(201).json(result.rows[0])
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

export async function patch(req, res){
    const { id } = req.params
    const { giftname, price, chosen } = req.body

    const fields = []
    const values = []
    let idx = 1

    if (giftname !== undefined) { fields.push(`giftname = $${idx++}`); values.push(giftname) }
    if (price     !== undefined) { fields.push(`price = $${idx++}`);    values.push(price)    }
    if (chosen    !== undefined) { fields.push(`chosen = $${idx++}`);   values.push(chosen)   }

    if (fields.length === 0)
        return res.status(400).json({ error: "Nenhum campo para atualizar" })

    values.push(id)

    try {
        const result = await pool.query(
            `UPDATE gifts SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
            values
        )
        if (result.rowCount === 0)
            return res.status(404).json({ error: "Presente não encontrado" })
        return res.json(result.rows[0])
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
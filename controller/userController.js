import pool from "../databasePg.js"

export async function get(req, res){
    try {
        const result = await pool.query("SELECT * FROM givers")
        return res.json(result.rows)
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

export async function post(req, res){
    const {name, gift} = req.body
    try {
        const result = await pool.query(
            "INSERT INTO givers (name, gift) VALUES ($1, $2) RETURNING *",
            [name, gift]
        )
        return res.status(201).json(result.rows[0])
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

export async function remove(req, res){
    const {id} = req.params
    try {
        const result = await pool.query(
            "DELETE FROM givers WHERE id = $1 RETURNING *",
            [id]
        )
        if (result.rowCount === 0) return res.status(404).json({ error: "nao encontrado" })
        return res.status(204).send()
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}
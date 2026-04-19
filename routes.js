import express from "express";
import {get, post, remove} from './controller/userController.js'
import {pool} from "databasePg.js"

export default function routes(){
const router = express.Router()


router.get("/users", get);
router.post("/users", post);
router.delete("/users/:id", remove)

router.get("/gifts", async (req, res) => {
  const result = await pool.query("SELECT * FROM cgifts")
  res.json(result.rows)
})

app.post("/gifts/select", async (req, res) => {
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



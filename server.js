import express from "express";
import routes from "./routes.js"
import cors from "cors"

const app = express()
const PORT = process.env.PORT || 8080


app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
}))
app.use(express.json())
app.use(routes())
console.log("DATABASE_URL:", process.env.DATABASE_URL)
app.listen(PORT)


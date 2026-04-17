import express from "express";
import routes from "./routes.js"
import cors from "cors"

const app = express()
const PORT = process.env.PORT || 3000


app.use(cors())
app.use(express.json())
app.use(routes())

app.listen(PORT)


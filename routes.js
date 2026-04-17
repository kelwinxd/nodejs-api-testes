import express from "express";
import {get, post, remove} from './controller/userController.js'

export default function routes(){
const router = express.Router()


router.get("/users", get);
router.post("/users", post);
router.delete("/users/:id", remove)

return router;
}



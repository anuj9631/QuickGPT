import express from "express"
import { createChat, deleteChat, getChats } from "../controllers/chatControllers";
import { protect } from "../middlewares/auth";

const chatRouter = express.Router();
chatRouter.get('/create',protect, createChat)
chatRouter.get('/get',protect, getChats)
chatRouter.post('/delete',protect, deleteChat)

export default chatRouter
// Text based Ai chat meassge

import Chat from "../models/chat.js"

export const textMessageController = async (req, res) => {
  try {
    const userId = req.user._id
    const {chatId, prompt} = req.body

    const chat = await Chat
  } catch (error) {
    
  }
}
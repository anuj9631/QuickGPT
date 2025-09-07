// Text based Ai chat meassge

import Chat from "../models/chat.js";
import User from "../models/user.js";

export const textMessageController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { chatId, prompt } = req.body;

    const chat = await Chat.findOne({ userId, _id: chatId });
    chat.messages.push({
      role: "user",
      content: prompt,
      timestamp: Date.now(),
      isImage: false
    });

    const { choices } = await openai.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [
        
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const reply = {
      ...choices[0].message,
      timestamp: Date.now(),
      isImage: false,
    };

    res.json({ success: true, reply });
    chat.message.push(reply);
    await chat.save();

    await User.updateOne({ _id: userId }, { $inc: { credits: -1 } });
  } catch (error) {
    res.json({success : false, message: error.message})
  }
}

// image generation 

export const imageMessageController = async (req, res) => {
  try {
    const userId = req.user._id
    // check credits 

    if(req.user.credits <2 ){
      return res.json({success : false, message: "You don't have enough credits to use this features"})
    }
    const { prompt, chatId, isPublished} = req.body
    //Find chat
    const chat = await Chat.findOne({userId, _id: chatId})

    // push user meassge 
    chat.messages.push({
      role: "user",
      content: prompt,
      timestamp: Date.now(),
      isImage: false
    });

    
  } catch (error) {
    
  }
}

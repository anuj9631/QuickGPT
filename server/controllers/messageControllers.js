// Text based Ai chat meassge
import axios from "axios"
import Chat from "../models/chat.js";
import User from "../models/User.js";
import imagekit from "../configs/imageKit.js";
import openai from '../configs/openai.js'

export const textMessageController = async (req, res) => {
  try {
    const userId = req.user._id;

    
    if(req.user.credits <1 ){
      return res.json({success : false, message: "You don't have enough credits to use this features"})
    }


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
    chat.messages.push(reply);
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

    //Encode prompt

    const encodedPrompt = encodeURIComponent(prompt)

    //construct image kit ai url

    const generatedImageUrl =  `${process.env.IMAGEKIT_URL_ENDPOINT}/ik-genimg-prompt-${encodedPrompt}/quickgpt/${Date.now()}.png?tr=w-800,h-800`;

    // Trigger by image kit
   const aiImageResponse = await axios.get(generatedImageUrl, {responseType: "arraybuffer"})

   //convert base64

  //  const base64Image = `data:image/png;base64,${Buffer.from(aiImageResponse.data,"binary".toString('base64'))}`;

   const base64Image = `data:image/png;base64,${Buffer.from(aiImageResponse.data,"binary").toString("base64")}`;


   // upload to image kit 

   const uploadResponse = await imagekit.upload({
    file: base64Image,
    fileName: `${Date.now()}.png`,
    folder: "quickgpt"
   })
    
   
    const reply = { role : 'assistant',
      content : uploadResponse.url,
      timestamp: Date.now(),
      isImage: true,
      isPublished
    };

res.json({success: "true", reply})

chat.messages.push(reply);
await chat.save();
await User.updateOne({ _id: userId }, { $inc: { credits: -2 } });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
}

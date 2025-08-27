import { Children, createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyUserData } from "../assets/assets";


const AppContext = createContext()
export const AppContextProvider =({Children}) =>{

const navigate =useNavigate()
const [user, setUser] = useState(null);
const [chats, setChats] = useState([]);
const [selectedChat, setSelectedChats] = useState(null);
const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

const fetchUser = async () => {
  setUser(dummyUserData)
}

useEffect(()=>{
  fetchUser()
},[])
  const value ={
    navigate, user, setUser, fetchUser, chats, setChats, selectedChat, setSelectedChats, theme
  }
  
  return(
    <AppContext.Provider value={value}>
      {Children}
    </AppContext.Provider>
  )
}

export const useAppContext = ()=> useContext(AppContext)
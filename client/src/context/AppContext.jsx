import { children, createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyChats, dummyUserData } from "../assets/assets";


const AppContext = createContext()
export const AppContextProvider =({children}) =>{

const navigate =useNavigate()
const [user, setUser] = useState(null);
const [chats, setChats] = useState([]);
const [selectedChat, setSelectedChats] = useState(null);
const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

const fetchUser = async () => {
  setUser(dummyUserData)
}

const fetchUserChats = async () => {
  setChats(dummyChats)
  setSelectedChats(dummyChats[0])
}

useEffect(()=>{
  if(theme == 'dark'){
    document.documentElement.classList.add('dark');
  }else{
    document.documentElement.classList.remove('dark');
  }
},[theme])

useEffect(()=>{
  if(user){
    fetchUserChats()
  }
  else{
    setChats([])
    setSelectedChats(null)
  }

},[user])

useEffect(()=>{
  fetchUser()
},[])
  const value ={
    navigate, user, setUser, fetchUser, chats, setChats, selectedChat, setSelectedChats, theme,setTheme
  }
  
  return(
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = ()=> useContext(AppContext)
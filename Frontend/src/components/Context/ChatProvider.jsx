import { createContext, useContext, useEffect, useState } from 'react'
import {useNavigate} from 'react-router-dom'
import axios from 'axios'

const ChatContext = createContext();

const ChatProvider = ({children}) => {
    const [isLoggedin, SetisLoggedin] = useState(false);
    const [user, setUser] = useState();
    const navigate = useNavigate();

    useEffect( () => {
        const checkAuth = async () => {
            try {
                const response = await axios.get("https://talktide-backend.vercel.app/api/user/me", {
                    withCredentials: true
                });
                // console.log(response.data);
                if(response.status === 200) {
                    setUser(response.data);
                    SetisLoggedin(true);
                }
            } catch (error) {
                console.log("Error While checking login status due to: ", error.message);
                SetisLoggedin(false);
                navigate("/");
            }
        }
        checkAuth();
    }, [navigate])
    return <ChatContext.Provider value={{ isLoggedin, SetisLoggedin, user, setUser }}>
        {children}
    </ChatContext.Provider>
}

// custom hook to assess state
export const useChatState = () => {
    return useContext(ChatContext)
}

export default ChatProvider; 
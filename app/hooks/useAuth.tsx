
import { useState } from "react"

export default function useAuth(){
   const [isAuthenticated, setAuthenticated] = useState(false)
   
    return{
        isAuthenticated,
        login:() => setAuthenticated(true),
        logout: () => setAuthenticated(false),
    };
}
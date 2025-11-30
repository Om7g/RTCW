import { createContext, useState } from "react";

export const AuthContext = createContext({
    token: "",
    setToken: () => { },
})


export function AuthProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem("token") || null);
    const authContextValue = {
        token, setToken
    }
    return (

        <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>
    )
}


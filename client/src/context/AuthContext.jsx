import { createContext, useContext, useEffect, useState } from "react";
import { getToken, setUser as LocalUser } from "../utils/auth.js";
import { apiAuthHandle } from "../config/apiAuthHandle.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => { //app.jsx pass horahi hy children main
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadUser();
    }, [])

    const loadUser = async () => {
        const token = getToken();
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const { data } = await apiAuthHandle.get(`/profile`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUser(data.user);
            LocalUser(data.user);
        }
        catch (error) {
            console.log("error in fetching user ", error.message);

        }
        finally {
        }
        setLoading(false);
    }

    return (
        <AuthContext.Provider value={{ user, setUser, loading }}  >
            {children}
        </AuthContext.Provider>
    )
}


export  const useAuthContext = () => useContext(AuthContext);


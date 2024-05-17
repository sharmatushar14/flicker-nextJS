'use client';

import { SessionProvider } from "next-auth/react";

// interface AuthProviderProps {
//     children: React.ReactNode
// }

//If using this, then we have to use AuthProivder(
//    { children } : AuthProviderProps
// )

export default function AuthProvider({
    children} :{
        children: React.ReactNode
    }
){
    return(
        <SessionProvider>
            {children}
        </SessionProvider>
    )
}
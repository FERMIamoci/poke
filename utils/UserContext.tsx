"use client";
import { createContext } from 'react';

export const UserContext = createContext({
    user: {
        id: "",
        name: "",
    },
    deck: null,
});

export const UserProvider = ({ children, value }: { children: React.ReactNode, value: any }) => {
    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};


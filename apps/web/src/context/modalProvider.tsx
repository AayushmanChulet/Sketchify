"use client"
import { useMemo, useState, type PropsWithChildren } from "react";
import modalContext from '../context/modalContext'
import { ToggleLeft } from "lucide-react";

export default function ModalProvider({ children } : PropsWithChildren) {
    const [mode , setMode] = useState<boolean>(false);
    const contextValue = useMemo(() => ({
        isActive : mode , 
        toggleState: (modeType : boolean) => {
            setMode(modeType)
        }
    }), [mode])

    return <modalContext.Provider value={contextValue}>
            {children}
    </modalContext.Provider>
}
"use client"

import { ReactNode, useEffect } from "react"
import Lenis from "lenis"

export default function ScrollProvider({children} : {children : ReactNode}){
    useEffect(() => {
        const lenis = new Lenis({
            duration : 2
        });
        function raf(time : number) {
        lenis.raf(time);
        requestAnimationFrame(raf);
        }

requestAnimationFrame(raf);
    })
    return <>
        {children}
    </>
}
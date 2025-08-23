"use client"
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useContext } from "react";
import modalContext from "@/context/modalContext";

export default function NavBar() {
    const router = useRouter()
    const path = usePathname();
    const {isActive , toggleState} = useContext(modalContext);

    console.log(path)
  return (
    path == "/" || path == "/signin" || path == "signup" ? <nav className="w-3/5 fixed top-5 left-1/2 -translate-x-1/2  z-50  bg-neutral-400/40 dark:bg-neutral-800/40 backdrop-blur-md shadow-md flex items-center justify-between px-8 py-4 rounded-2xl  gap-14">
      <span className="font-gelpen text-2xl font-bold">Sketcify</span>
      <span className="flex gap-6 items-center text-sm font-medium">
        <span className="cursor-pointer hover:text-neutral-700 dark:hover:text-neutral-300 transition">
          How it works
        </span>
        <span className="cursor-pointer hover:text-neutral-700 dark:hover:text-neutral-300 transition">
          Testimonial
        </span>
        <span className="cursor-pointer hover:text-neutral-700 dark:hover:text-neutral-300 transition">
          Features
        </span>
      </span>
      <span>
        <Button className="rounded-xl" onClick={() => router.push("/signin")}>Login</Button>
      </span>
    </nav> : <nav className="w-3/5 fixed top-5 left-1/2 -translate-x-1/2  z-50  bg-neutral-400/40 dark:bg-neutral-800/40 backdrop-blur-md shadow-md flex items-center justify-between px-8 py-4 rounded-2xl  gap-14">
      <span className="font-gelpen text-2xl font-bold">Sketcify</span>
      <span className="flex gap-6 items-center text-sm font-medium">
        <Input placeholder="search" className="w-96"/>
      </span>
      <span className="flex gap-3">
        <Button className="rounded-xl" onClick={() => toggleState(true)}>Create Canvas</Button>
        <Button className="rounded-xl" onClick={() => {
          localStorage.removeItem("authorization");
          router.push("/");
        }}>Logout</Button>
      </span>
    </nav> 
  );
}

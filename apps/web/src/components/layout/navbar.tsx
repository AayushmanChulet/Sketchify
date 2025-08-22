"use client"
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

export default function NavBar() {
    const router = useRouter()
  return (
    <nav className="w-3/5 fixed top-5 left-1/2 -translate-x-1/2  z-50  bg-neutral-400/40 dark:bg-neutral-800/40 backdrop-blur-md shadow-md flex items-center justify-between px-8 py-4 rounded-2xl  gap-14">
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
    </nav>
  );
}

"use client"
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useContext, useEffect, useState } from "react";
import modalContext from "@/context/modalContext";
import UseDebounce from "@/hooks/useDebounce";
import { HTTP_BACKEND_URL } from "@repo/config/config";
import axios from "axios";
import Link from "next/link";

interface FindRooms{
  status : string,
  rooms : Room[],
  message : string
}

interface Room {
  id : number,
  slug : string,
  createdAt : string
}

export default function NavBar() {
    const router = useRouter()
    const path = usePathname();
    const {toggleState} = useContext(modalContext);
    const [slug , setSlug] = useState("");
    const debouncedValue = UseDebounce(slug, 500);
    const [rooms , setRooms] = useState<Room[] | null>(null)

    const fetchSlug = async () => {
    if (debouncedValue) {
      try {
        console.log(localStorage.getItem("authorization"));
        const response = await axios.get<FindRooms>(
          `${HTTP_BACKEND_URL}/api/v1/app/get-room/${slug}`,
          {
            headers: {
              "authorization" : localStorage.getItem("authorization"),
            },
            withCredentials: true,
          }
        );
        setRooms(response.data.rooms);
        console.log("rooms fetched:", response.data.rooms)
      } catch (error) {
        console.error("Error fetching rooms:", error);
        setRooms([])
      }
    } else {
      setRooms([]);
    }
  };

  useEffect(() => {
    fetchSlug();
  }, [debouncedValue]);
    console.log(path)
  return (
    path == "/" || path == "/signin" || path == "signup" ? <nav className="w-[95%] sm:w-[90%] md:w-3/5 fixed top-5 left-1/2 -translate-x-1/2 z-50
        bg-neutral-400/40 dark:bg-neutral-800/40 backdrop-blur-md shadow-md
        flex items-center justify-between px-4 md:px-8 py-3 rounded-2xl gap-4 md:gap-14">
      <Link className="font-gelpen text-lg sm:text-xl md:text-2xl font-bold" href={"/"}>Sketchify</Link>
      <span className="hidden md:flex gap-6 items-center text-sm font-medium">
        <Link className="cursor-pointer hover:text-neutral-700 dark:hover:text-neutral-300 transition" href="#Home">
          Home
        </Link>
        <Link className="cursor-pointer hover:text-neutral-700 dark:hover:text-neutral-300 transition" href="#Features">
          Features
        </Link>
        <Link className="cursor-pointer hover:text-neutral-700 dark:hover:text-neutral-300 transition" href="#Testimonial">
          Testimonial
        </Link>
      </span>
      <span>
        <Button className="rounded-xl text-xs sm:text-sm md:text-base px-3 md:px-4 py-1.5 md:py-2" onClick={() => router.push("/signin")}>Login</Button>
      </span>
    </nav> : <nav className="w-[95%] sm:w-[90%] md:w-3/5 fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-neutral-400/40 dark:bg-neutral-800/40 backdrop-blur-md shadow-md flex items-center justify-between px-4 md:px-8 py-3 rounded-2xl gap-4 md:gap-14">
      <Link className="font-gelpen text-lg sm:text-xl md:text-2xl font-bold" href={"/"}>Sketchify</Link>
      <div className="relative flex-1 max-w-[120px] sm:max-w-xs md:max-w-md">
        <Input
          placeholder="Search"
          className="w-full text-xs sm:text-sm md:text-base"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
        />
        {rooms != null && rooms.length > 0 && slug.length > 1 && (
          <ul className="absolute left-0 top-full mt-2 w-full
              bg-gray-300 text-black rounded-b-2xl shadow-lg
              max-h-64 overflow-y-auto text-xs md:text-sm">
            {rooms.map((room) => (
              <li
                key={room.id}
                className="px-3 py-2 hover:bg-gray-200 cursor-pointer flex justify-between"
                onClick={() => {
                  router.push(`/canvas/${room.id}`);
                  setSlug("");
                }}
              >
                <span>{room.slug}</span>
                <span className="text-[10px] md:text-xs text-gray-600">
                  {new Date(room.createdAt).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <span className="flex gap-1 sm:gap-2 md:gap-3">
        <Button className="rounded-xl text-xs sm:text-sm md:text-base px-2 sm:px-3 md:px-4" onClick={() => toggleState(true)}>Create Canvas</Button>
        <Button className="rounded-xl text-xs sm:text-sm md:text-base px-2 sm:px-3 md:px-4" onClick={() => {
          localStorage.removeItem("authorization");
          router.push("/");
        }}>Logout</Button>
      </span>
    </nav> 
  );
}

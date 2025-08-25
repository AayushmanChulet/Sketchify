"use client"
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useContext, useEffect, useState } from "react";
import modalContext from "@/context/modalContext";
import UseDebounce from "@/hooks/useDebounce";
import { HTTP_BACKEND_URL } from "@repo/config/config";
import axios from "axios";

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
    const {isActive , toggleState} = useContext(modalContext);
    const [slug , setSlug] = useState("");
    const debouncedValue = UseDebounce(slug, 500);
    const authToken = localStorage.getItem("authorization");
    const [rooms , setRooms] = useState<Room[] | null>(null)

    const fetchSlug = async () => {
    if (debouncedValue) {
      try {
        const response = await axios.get<FindRooms>(
          `${HTTP_BACKEND_URL}/api/v1/app/get-room/${slug}`,
          {
            headers: {
              Cookie: `authorization=${authToken}`,
            },
            withCredentials: true,
          }
        );
        setRooms(response.data.rooms);
        console.log("User IDs fetched:", response.data.rooms)
      } catch (error) {
        console.error("Error fetching user IDs:", error);
      }
    } else {
      setRooms([]);
    }
  };

  useEffect(() => {
    fetchSlug();
  }, [slug]);
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
        <div>
              {(rooms != null && rooms.length > 0) && (
                <ul className="absolute text-black rounded shadow-lg mt-2 w-64 bg-gray-300 text-sm text-md max-h-64 overflow-x-hidden overflow-scroll scroll-smooth scroll rounded-b-2xl ">
                  {rooms.map((room, index) => (
                    <li
                      key={index}
                      className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                      onClick={() => {
                        router.push(`/canvas/${room.id}`);
                        setSlug('');
                      }}
                    > 
                    <div>{room.slug}</div>
                      <div>{new Date(room.createdAt).toLocaleDateString()}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
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

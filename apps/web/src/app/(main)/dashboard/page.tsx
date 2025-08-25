"use client"

import AllCanvas from "@/components/pages/dashboard/allCanvas";
import RecentCanvas from "@/components/pages/dashboard/recentCanvas";
import { FRONTEND_URL, HTTP_BACKEND_URL } from "@repo/config/config";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import modalContext from "@/context/modalContext";
import { redirect } from "next/dist/server/api-utils";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import AllCanvasSkeleton from "@/components/pages/dashboard/tableSkeleton";

interface CanvasResponse {
    rooms :  {
        id : number,
        slug : string,
        createdAt : string
    }[]
}

interface NewCanvas {
    status: string,
    roomCode:number,
    message:string
}


export default function Dashboard(){
    const {isActive, toggleState} = useContext(modalContext);
    const [canvasName, setCanvasName] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [token, setToken] = useState<string | null>(null);
    const [canvas , setCanvas] = useState<CanvasResponse | null>(null); 
    const [recentCanvas , setRecentCanvas] = useState<CanvasResponse | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const router = useRouter()

    useEffect(() => {
        const fetchedTokem = localStorage.getItem("authorization");
        setToken(fetchedTokem);
        getCanvas();
        setIsLoading(false);
    }, [token])

    useEffect(() => {
    const handleEscape = (e : any) => {
      if (e.key === 'Escape') {
        toggleState(false);
      }
    };

    if (isActive) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isActive]);

  const handleCreateCanvas = async () => {
    if (!canvasName.trim()) {
      return;
    }

    setIsCreating(true);
    
    try {
       if(canvasName == "") return;
        const newCanvas = await axios.post<NewCanvas>(`${HTTP_BACKEND_URL}/api/v1/app/create-room`, {
            slug : canvasName,
        },{
            headers :  {
                "authorization" : localStorage.getItem("authorization"),
            }
        })
        const roomId = newCanvas.data.roomCode;
        router.push(`${FRONTEND_URL}/canvas/${roomId}`)
      setCanvasName('');
      toggleState(false);
      
    } catch (error) {
      console.log('Error creating canvas:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleModalClick = (e : any) => {
    if (e.target === e.currentTarget) {
      toggleState(false);
    }
  };

  const handleInputKeyPress = (e : any) => {
    if (e.key === 'Enter') {
      handleCreateCanvas();
    }
  };



    const getCanvas = async () => {
        const canvas = await axios.get<CanvasResponse>(`${HTTP_BACKEND_URL}/api/v1/app/getRooms`, {
        headers : {
            authorization : token
        }
    })
    const data = canvas.data;
    const recent = canvas.data.rooms.slice(0, 3);

    setCanvas(data);
    setRecentCanvas({rooms : recent});
    }

    return <main className="h-full mt-40 flex flex-col items-center w-3/5 justify-center gap-14">
        <div className="flex flex-col justify-center items-start gap-3 w-full h-full">
            <div className="text-3xl">
                Recent Canvas: 
            </div>
            <div className="flex gap-2">
              
                {recentCanvas == null ? <>
                <div className="w-96 h-48 bg-neutral-800 text-neutral-200 rounded-2xl flex flex-col justify-between items-start p-7"> 
                  <Skeleton className="h-6 w-64 rounded-md" />
                  <Skeleton className="h-5 w-32 rounded-md" />
                </div> 
                <div className="w-96 h-48 bg-neutral-800 text-neutral-200 rounded-2xl flex flex-col justify-between items-start p-7"> 
                  <Skeleton className="h-6 w-64 rounded-md" />
                  <Skeleton className="h-5 w-32 rounded-md" />
                </div> 
                <div className="w-96 h-48 bg-neutral-800 text-neutral-200 rounded-2xl flex flex-col justify-between items-start p-7"> 
                  <Skeleton className="h-6 w-64 rounded-md" />
                  <Skeleton className="h-5 w-32 rounded-md" />
                </div> 
                </>: recentCanvas.rooms.map((canvas, index) => {
                    return <RecentCanvas createdAt={new Date(canvas.createdAt)} slug={canvas.slug}/>
                })} 
            </div>
        </div>
        <div className=" mt-40 flex flex-col items-start justify-start gap-14 w-full overflow-y-visible">

            <div className="text-3xl">
                All Canvas:
            </div>
            <div className="w-full overflow-x-auto">
                {   canvas == null ? <AllCanvasSkeleton /> : 
                <AllCanvas data={canvas.rooms}/>
            }
            </div>
        </div>

        {isActive && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={handleModalClick}
        >
          <div 
            className="bg-white rounded-lg shadow-2xl w-full max-w-md transform transition-all duration-200 scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800">
                Create New Canvas
              </h3>
              <button
                onClick={() => toggleState(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1"
                disabled={isCreating}
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <label 
                  htmlFor="canvasName" 
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Canvas Name
                </label>
                <input
                  type="text"
                  id="canvasName"
                  value={canvasName}
                  onChange={(e) => setCanvasName(e.target.value)}
                  onKeyPress={handleInputKeyPress}
                  placeholder="Enter canvas name..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors duration-200"
                  disabled={isCreating}
                  autoFocus
                />
              </div>
              
              <p className="text-sm text-gray-500 mb-6">
                Give your canvas a descriptive name that helps you identify it later.
              </p>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg">
              <button
                onClick={() => toggleState(false)}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                disabled={isCreating}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCanvas}
                disabled={isCreating || !canvasName.trim()}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-2"
              >
                {isCreating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating...
                  </>
                ) : (
                  'Create Canvas'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
}
import { cn } from "@/lib/utils";
import { IconBolt, IconPalette, IconUsers } from "@tabler/icons-react";

export default function Hero(){
    return<div className="relative flex h-[50rem] w-full items-center justify-center bg-white dark:bg-black">
      <div
        className={cn(
          "absolute inset-0",
          "[background-size:40px_40px]",
          "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
          "dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]",
        )}
      />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_5%,black)] dark:bg-black"></div>
      <div className="flex flex-col w-full h-full items-center justify-center gap-2">
        
        <p className="relative z-20 bg-gradient-to-b from-neutral-200 to-neutral-500 bg-clip-text py-8 text-4xl font-bold text-transparent sm:text-7xl text-center">
        Unleash Your Creativity <br/>Together
        </p>
        <p className=" w-3/6 relative z-20 bg-gradient-to-b from-neutral-200 to-neutral-500 bg-clip-text py-8 text-xl font-bold text-transparent sm:text-xl text-center">
            Transform ideas into reality with the most intuitive collaborative whiteboard. Design, sketch, and brainstorm together in real-time from anywhere.
        </p>

        <div className="flex text-xl justify-evenly items-center w-1/2  hover:transform transition-all mt-14">
          <div className="flex flex-col justify-center items-center gap-4  hover:scale-115 hover:text-neutral-500 ">
            <div className="text-white bg-gray-900 rounded-2xl p-5 ">
              <IconUsers stroke={2} size={30}/>
            </div>
            <div className="text-white">Real-time Collaboration</div>
          </div>
          <div className="flex flex-col justify-center items-center gap-4  hover:scale-115 hover:text-neutral-500">
            <div className="text-white bg-gray-900 rounded-2xl p-5 ">
              <IconBolt stroke={2} size={30}/>
            </div>
            <div className="text-white">Lightning Fast</div>
          </div>
          <div className="flex flex-col justify-center items-center gap-4  hover:scale-115 hover:text-neutral-500">
            <div className="text-white bg-gray-900 rounded-2xl p-5 ">
              <IconPalette stroke={2} size={30}/>
            </div>
            <div className="text-white">Infinite Canvas</div>
          </div>
        </div>
      </div>
    </div>
}
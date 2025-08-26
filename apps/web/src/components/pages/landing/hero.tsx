import { cn } from "@/lib/utils";
import {
  IconArrowRight,
  IconBolt,
  IconPalette,
  IconUsers,
} from "@tabler/icons-react";
import * as motion from "motion/react-client"

import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text";

export default function Hero() {

  return (
    <div className="relative flex h-[50rem] w-full items-center justify-center bg-white dark:bg-black" id="Home">
      <div
        className={cn(
          "absolute inset-0",
          "[background-size:40px_40px]",
          "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
          "dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]"
        )}
      />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_5%,black)] dark:bg-black"></div>
      <div className="flex flex-col w-full h-full items-center justify-center gap-2 z-30">
        <div className="flex flex-col w-full h-full z-30">
          <div className="z-10 flex min-h-64 items-center justify-center mt-8">
            <div
              className={cn(
                "group rounded-full border border-black/5 bg-neutral-100 text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800"
              )}
            >
              <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400 ">
                <span>✨ Collaborative whiteboard</span>
                <IconArrowRight className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
              </AnimatedShinyText>
            </div>
          </div>
          <p className="relative z-20 bg-gradient-to-b from-neutral-200 to-neutral-500 bg-clip-text py-8 text-4xl font-bold text-transparent sm:text-7xl text-center">
            Unleash Your Creativity <br />
            Together
          </p>
        </div>
        <p className=" w-3/6 relative z-20 bg-gradient-to-b from-neutral-200 to-neutral-500 bg-clip-text py-8 text-xl font-bold text-transparent sm:text-xl text-center">
          Transform ideas into reality with the most intuitive collaborative
          whiteboard. Design, sketch, and brainstorm together in real-time from
          anywhere.
        </p>

        <div className="flex text-xl justify-evenly items-center w-1/2  hover:transform transition-all mt-14">
          <div className="flex flex-col justify-center items-center gap-4  hover:scale-110 hover:text-neutral-500 ">
            <div className="text-white bg-gray-900 rounded-2xl p-5 ">
              <IconUsers stroke={2} size={30} />
            </div>
            <div className="text-white">Real-time Collaboration</div>
          </div>
          <div className="flex flex-col justify-center items-center gap-4  hover:scale-110 hover:text-neutral-500">
            <div className="text-white bg-gray-900 rounded-2xl p-5 ">
              <IconBolt stroke={2} size={30} />
            </div>
            <div className="text-white">Lightning Fast</div>
          </div>
          <div className="flex flex-col justify-center items-center gap-4  hover:scale-110 hover:text-neutral-500">
            <div className="text-white bg-gray-900 rounded-2xl p-5 ">
              <IconPalette stroke={2} size={30} />
            </div>
            <div className="text-white">Infinite Canvas</div>
          </div>
        </div>
      </div>
    </div>
  );
}

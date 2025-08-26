"use client";

import { cn } from "@/lib/utils";
import { IconBrandFacebook, IconBrandInstagram, IconBrandX } from "@tabler/icons-react";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  const isCanvas = pathname.startsWith("/canvas");

  return (
    (!isCanvas && <footer className={cn(" w-full text-gray-400 px-10 md:px-28 py-10 flex flex-row justify-between items-start md:items-center gap-8 mt-16")}>
      <div className="flex flex-col gap-4 h-full justify-center">
        <h2 className="text-3xl font-semibold">Sketchify</h2>
        <div className="flex gap-6 text-sm text-gray-400">
          <a href="#" className="hover:underline">Privacy Policy</a>
          <a href="#" className="hover:underline">Terms & Conditions</a>
        </div>
      </div>
      <div className="flex flex-col gap-4 text-right">
        <div className="flex items-center justify-end gap-3">
          <span className="text-base font-medium">Socials:</span>
          <div className="flex gap-2 text-gray-400">
            <a href="#" aria-label="Instagram"><IconBrandInstagram size={20} /></a>
            <a href="#" aria-label="Facebook"><IconBrandFacebook size={20} /></a>
            <a href="#" aria-label="X (Twitter)"><IconBrandX size={20} /></a>
          </div>
        </div>
        <div className="text-sm text-gray-400">
          <p>Contact us: <a href="mailto:help@eventure.com" className="underline">help@sketchify.com</a></p>
        </div>
        <div className="text-xs text-gray-400">
          &copy; {new Date().getFullYear()} Sketchify. All rights reserved.
        </div>
      </div>
    </footer>)
  );
}

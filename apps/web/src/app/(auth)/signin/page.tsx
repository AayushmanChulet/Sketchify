"use client"
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import LabelledInput from "@/components/ui/labelledInput";
import { HTTP_BACKEND_URL } from "@repo/config/config";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface SigninRequest {
  status : string,
  token : string
}

export default function SigninPage() {
	const  [email, setEmail] = useState("");
	const  [password, setPassword] = useState("");

  const router = useRouter()

  const handleSignin = async ( ) => {
      try{const req = await axios.post<SigninRequest>(`${HTTP_BACKEND_URL}/api/v1/auth/signin`, {
          identifier : email,
          password,
        });

        if(req.status != 200){
          throw new Error("Something went wrong")
        }

        localStorage.setItem("authorization", `Bearer ${req.data.token}`);
        router.push("/dashboard")

        }catch(err){
          console.error(err)
        }
  }


  return (<div className="w-2/4 bg-[#fef0c8] text-black py-16 px-16 flex flex-col gap-8 items-center justify-center rounded-3xl font-ArchitectsDaughter">
    <div className="flex flex-col gap-2">
        <div className="text-center text-2xl font-sans">Hi there!</div>
          <div className="text-[14px]">Enter your email to sign in to your account</div>
    </div>
          
        <div className="w-full flex flex-col items-center justify-center gap-4" >
          <div className="w-full flex flex-col items-center justify-center gap-2">
            <LabelledInput label="Email address" inputPlaceholder="johndoe@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)}/>
            <LabelledInput label="Password" inputType="password" inputPlaceholder="****" value={password} onChange={(e) => setPassword(e.target.value)}/>
            <Button onClick={handleSignin}>Submit</Button>
          </div>
          <div>
----- or -----
          </div>
          <div className="text-blue-500 text-center">
            <div><Link href="/signup"> Don't have an account? Sign Up</Link></div>
            <div><Link href="/"> Back to Home</Link></div>
            
        </div>
        </div>
      </div>
  );
}

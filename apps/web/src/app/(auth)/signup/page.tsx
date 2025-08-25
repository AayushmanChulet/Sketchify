"use client";

import { Button } from "@/components/ui/button";
import LabelledInput from "@/components/ui/labelledInput";
import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import { HTTP_BACKEND_URL } from "@repo/config/config";
import { useRouter } from "next/navigation";


interface SignupRequest {
  status : string,
  token : string
}

export default function Signup() {
    const  [firstname, setFirstName] = useState("");
    const  [lastname, setLastname] = useState("");
    const  [email, setEmail] = useState("");
    const  [password, setPassword] = useState("");

    const router = useRouter()

    const handleSignup = async ( ) => {
        try{const req = await axios.post<SignupRequest>(`${HTTP_BACKEND_URL}/api/v1/auth/signup`, {
          email,
          password,
          firstName : firstname,
          lastName : lastname
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
  return (
    <div className="w-2/4 bg-[#222229] text-[#cfd4db] py-16 px-16 flex flex-col gap-8 items-center justify-center rounded-3xl font-ArchitectsDaughter">
    <div className="flex flex-col gap-2">
        <div className="text-center text-3xl font-sans">Hi there!</div>
          <div className="text-[16px]">Enter your email to sign in to your account</div>
    </div>
          
        <div className="w-full flex flex-col items-center justify-center gap-4 text-lg" >
          <div className="w-full flex flex-col items-center justify-center gap-2">
            <LabelledInput label="First name" inputPlaceholder="John" value={firstname} onChange={(e) => setFirstName(e.target.value)}/>
            <LabelledInput label="Last name" inputPlaceholder="Doe" value={lastname} onChange={(e) => setLastname(e.target.value)}/>
            <LabelledInput label="Email address" inputPlaceholder="johndoe@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)}/>
            <LabelledInput label="Password" inputType="password" inputPlaceholder="****" value={password} onChange={(e) => setPassword(e.target.value)}/>
            <Button onClick={handleSignup} >Submit</Button>
          </div>
          <div>
----- or -----
          </div>
          <div className="text-blue-500 text-center">
            <div><Link href="/signin"> Already a user? Signin</Link></div>
            <div><Link href="/"> Back to Home</Link></div>
            
        </div>
        </div>
      </div>
  );
}

"use client"
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import LabelledInput from "@/components/ui/labelledInput";
import { HTTP_BACKEND_URL } from "@repo/config/config";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signinSchema } from "@repo/common/types"
import { ZodError } from 'zod'
import { ZodIssue } from "zod";

interface SigninRequest {
  status : string,
  token : string
}

export default function SigninPage() {
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
  const [errors, setErrors] = useState<{ identifier?: string; password?: string }>({});


  const router = useRouter()

  const handleSignin = async ( ) => {
    const result = signinSchema.safeParse({ identifier: email, password });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      console.log(result.error);
      (result.error as ZodError).issues.forEach((issue) => {
    if (issue.path[0]) fieldErrors[issue.path[0].toString()] = issue.message;
  });
      setErrors(fieldErrors);
      return; 
    }

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


  return (<div className="w-full max-w-md
        bg-[#222229] 
        text-[#cfd4db] 
        py-8 px-6            
        sm:py-12 sm:px-12    
        md:py-16 md:px-16 
        flex flex-col gap-6
        items-center justify-center 
        rounded-2xl sm:rounded-3xl  /* 🔹 Smaller radius on mobile */
        font-ArchitectsDaughter
        mx-auto my-8          /* 🔹 Center with margins */
">
    <div className="flex flex-col gap-2">
        <div className="text-center text-3xl font-sans">Hi there!</div>
          <div className="text-[16px]">Enter your email to sign in to your account</div>
    </div>
          
        <div className="w-full flex flex-col items-center justify-center gap-4 text-lg" >
          <div className="w-full flex flex-col items-center justify-center gap-2">
            <LabelledInput label="Email address" inputPlaceholder="johndoe@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)}/>
              {errors.identifier && <p className="text-red-500 text-sm">{errors.identifier}</p>}
            <LabelledInput label="Password" inputType="password" inputPlaceholder="****" value={password} onChange={(e) => setPassword(e.target.value)}/>
               {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
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

import express ,  {type Request,type Response} from "express";
import z from "zod";
import jwt from "jsonwebtoken";
import { signinSchema, createUser } from "@repo/common/types"


type Signin = z.infer<typeof signinSchema>;

export const signinController = async ( req : Request, res : Response) => {
    const { success } = signinSchema.safeParse(req.body);

    if(!success){
        res.json(402).json({
            status : "failed",
            message: "Invalid request"
        })
    }

    const {identifier , password} : Signin = req.body();
    
    //database logic

    res.status(200).json({
        status: "success",
        token : ""
    })
}

type Signup = z.infer<typeof createUser>;

export const signupController = async ( req : Request, res : Response) => {
    const { success } = signinSchema.safeParse(req.body);

    if(!success){
        res.json(402).json({
            status : "failed",
            message: "Invalid request"
        })
    }

    const {email , password, firstName , lastName} : Signup = req.body();
    
    //database logic

    res.status(200).json({
        status: "success",
        token : ""
    })
}
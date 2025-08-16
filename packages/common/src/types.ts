import z from "zod";

export const signinSchema = z.object({
    identifier : z.string(),
    password : z.string(),
})

export const createUser = z.object({
    email : z.string(),
    password : z.string(),
    firstName : z.string(),
    lastName : z.string(),
})

export const room = z.object({
    name : z.string(),
})
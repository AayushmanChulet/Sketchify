import z from "zod";

export const signinSchema = z.object({
    identifier : z.email("Invalid email address"),
    password : z.string().min(6, "Password must be at least 6 characters"),
})

export const createUser = z.object({
    email : z.email("Invalid email address"),
    password : z.string().min(6, "Password must be at least 6 characters"),
    firstName : z.string().min(1, "Provide your first name"),
    lastName : z.string().min(1, "Provide your first name"),
})

export const room = z.object({
    slug : z.string()
})
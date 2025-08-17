import { type Request, type Response } from "express";
import z from "zod";
import jwt from "jsonwebtoken";
import { signinSchema, createUser } from "@repo/common/types";
import { client } from "@repo/database/client";
import { JWT_SECRET, SALT_ROUND } from "@repo/backend/config";
import bcrypt from "bcrypt";

type Signin = z.infer<typeof signinSchema>;

export const signinController = async (req: Request, res: Response) => {
  const { success, data} = signinSchema.safeParse(req.body);

  if (!success) {
    return res.status(402).json({
      status: "failed",
      message: "Invalid request",
    });
  }

  const { identifier, password }: Signin = data;

  //database logic

  const user = await client.user.findFirst({
    where: {
      email: identifier,
    },
  });

  if (!user) {
    return res.status(404).json({
      status: "failed",
      message: "user not found",
    });
  }

  const validPassword = await bcrypt.compare(password, user.password)

    if (!validPassword) {
    return res.status(404).json({
      status: "failed",
      message: "invalid password",
    });
  }

  const token = jwt.sign(
    { exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, data: user.id },
    JWT_SECRET
  );

  res.status(200).json({
    status: "success",
    token: token,
  });
};

type Signup = z.infer<typeof createUser>;

export const signupController = async (req: Request, res: Response) => {

  const { success, data } = createUser.safeParse(req.body);

  if (!success) {
    return res.status(402).json({
      status: "failed",
      message: "Invalid request",
    });
  }

  const { email, password, firstName, lastName }: Signup = data;

  //database logic

  const user = await client.user.findFirst({
    where: {
      email,
    },
  });

  if (user) {
    return res.status(404).json({
      status: "failed",
      message: "email already in use",
    });
  }

  const encryptedPassword = await bcrypt.hash(password, SALT_ROUND);

  const newUser = await client.user.create({
    data : {
        email,
        firstName,
        lastName,
        password : encryptedPassword,
        avatar : "https://plus.unsplash.com/premium_photo-1688891564708-9b2247085923?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cmFuZG9tJTIwcGVvcGxlfGVufDB8fDB8fHww"
    }
  })

  const token = jwt.sign(
    { exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, data: newUser.id },
    JWT_SECRET
  );

  res.status(200).json({
    status: "success",
    token: token,
  });
};

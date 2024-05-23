import { Request, Response } from "express";
import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET as string;

interface Req extends Request {
  user?: User | null;
}

const generateToken = (id: string) => {
  return jwt.sign({ id }, jwtSecret);
};

const verifyUserExist = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email: email } });

  return user;
};

export const register = async (req: Request, res: Response) => {
  const data = req.body;

  const user = await verifyUserExist(data.email);

  if (user) {
    res.status(400).json({ errors: ["Email já cadastrado."] });
    return;
  }

  const salt = await bcrypt.genSalt();
  const passwordHash = await bcrypt.hash(data.password, salt);

  const newUser = await prisma.user.create({
    data: {
      ...data,
      password: passwordHash,
      status: "Ativo",
    },
  });

  if (!newUser) {
    res
      .status(500)
      .json({ errors: ["Houve um erro, tente novamente mais tarde."] });
    return;
  }

  res.status(201).json({
    data: newUser,
  });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await verifyUserExist(email);

  if (!user) {
    res.status(400).json({ errors: ["Email não cadastrado!"] });
    return;
  }

  if (user.status !== "Ativo"){
    res.status(400).json({ errors: ["Usuário desativado!"] });
    return;
  }

  if (!(await bcrypt.compare(password, user.password))) {
    res.status(400).json({ errors: ["Credenciais inválidas!"] });
    return;
  }

  res.status(201).json({ token: generateToken(user.id), user});
};

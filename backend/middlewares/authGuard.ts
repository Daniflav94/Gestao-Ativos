import jwt, { JwtPayload } from "jsonwebtoken";
import { PrismaClient, User } from "@prisma/client";
import { Request, Response, NextFunction } from "express";

const prisma = new PrismaClient();
const jwtSecret = process.env.JWT_SECRET as string;

interface Req extends Request {
    user?: User | null;
  }

export const authGuard = async (
  req: Req,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;
  const token = (authorization ?? "").split(" ")[1];

  if (!token) {
    return res.status(403).json({ errors: ["Acesso negado."] });
  }

  try {
    const cleanToken = token.replace(/"/g, "");
    const verified = jwt.verify(cleanToken, jwtSecret);

    const user = await prisma.user.findUnique({
      where: { id: (verified as JwtPayload).id },
    });

    req.user = user;

    next();
  } catch (error) {
    res.status(403).json({ errors: ["Token inválido."] });
  }
};

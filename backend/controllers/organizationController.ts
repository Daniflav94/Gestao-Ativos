import { Request, Response } from "express";
import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

export const create = async (req: Request, res: Response) => {
    const data = req.body;
  
    const newOrganization = await prisma.organization.create({
      data: {
        ...data,
      },
    });
  
    if (!newOrganization) {
      res
        .status(500)
        .json({ errors: ["Houve um erro, tente novamente mais tarde."] });
      return;
    }
  
    res.status(201).json({
      data: newOrganization,
    });
  };
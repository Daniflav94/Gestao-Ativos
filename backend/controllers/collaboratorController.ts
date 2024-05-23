import { Collaborator, PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

const verifyCollaboratorExist = async (email: string) => {
  const user = await prisma.collaborator.findUnique({
    where: { email: email },
  });

  return user;
};

export const registerCollaborator = async (req: Request, res: Response) => {
  const data = req.body;

  const collaborator = await verifyCollaboratorExist(data.email);

  if (collaborator) {
    res.status(400).json({ errors: ["Colaborador já cadastrado."] });
    return;
  }

  const newCollaborator = await prisma.collaborator.create({
    data: {
      ...data,
      status: "Ativo",
    },
  });

  if (!newCollaborator) {
    res
      .status(500)
      .json({ errors: ["Houve um erro, tente novamente mais tarde."] });
    return;
  }

  res.status(201).json({
    data: newCollaborator,
  });
};

export const updateCollaborator = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;

  const collaborator = await prisma.collaborator.findUnique({ where: { id } });
  if (!collaborator) {
    res.status(500).json({ errors: ["Colaborador não encontrado."] });
    return;
  }

  const update = await prisma.collaborator.update({
    where: { id },
    data: { ...data, updatedAt: new Date() },
  });

  res.status(201).json({
    data: update,
  });
};

export const listActiveCollaborators = async (req: Request, res: Response) => {
  const collaborators = await prisma.collaborator.findMany({
    where: { status: "Ativo" },
    orderBy: { createdAt: "desc" },
  });

  res.status(201).json({
    data: collaborators,
  });
};

export const listAllCollaborators = async (req: Request, res: Response) => {
  const page = req.query.page || 1;
  const take = 8;

  const skip = (Number(page) - 1) * take;

  const collaborators = await prisma.collaborator.findMany({
    orderBy: { createdAt: "desc" },
    skip,
    take,
  });

  const total = await prisma.collaborator.count();

  res.status(201).json({
    data: collaborators,
    total,
  });
};

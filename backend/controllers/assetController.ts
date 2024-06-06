import { Asset, Collaborator, PrismaClient, User } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

interface Req extends Request {
  user?: User | null;
}

const verifyAssetExist = async (idClient: string, user: User) => {
  const asset = await prisma.asset.findFirst({
    where: { idClient, organizationId: user.organizationId },
  });

  return asset;
};

export const registerAsset = async (req: Req, res: Response) => {
  const data = req.body;
  const invoice = req.file?.filename;
  const idUser = req.user?.id;

  const user = await prisma.user.findUnique({
    where: { id: idUser },
  });

  if (!user) {
    res.status(400).json({ errors: ["Erro ao encontrar usuário."] });
    return;
  }

  const asset = await verifyAssetExist(data.idClient, user);

  if (asset) {
    res.status(400).json({ errors: ["Ativo já cadastrado."] });
    return;
  }

  const newAsset = await prisma.asset.create({
    data: {
      ...data,
      canAllocated: data.canAllocated === "true" ? true : false,
      purchaseDate: new Date(data.purchaseDate),
      closingGuarantee: new Date(data.closingGuarantee),
      invoice,
      status: "Disponível",
      organizationId: user?.organizationId as string,
    },
  });

  if (!newAsset) {
    res
      .status(500)
      .json({ errors: ["Houve um erro, tente novamente mais tarde."] });
    return;
  }

  res.status(201).json({
    data: newAsset,
  });
};

export const updateAsset = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;

  const asset = await prisma.asset.findUnique({ where: { id } });

  if (!asset) {
    res.status(500).json({ errors: ["Ativo não encontrado."] });
    return;
  }

  const update = await prisma.asset.update({
    where: { id },
    data: {
      ...data,
      purchaseDate: new Date(data.purchaseDate),
      closingGuarantee: new Date(data.closingGuarantee),
      updatedAt: new Date(),
    },
  });

  if (!update) {
    res
      .status(500)
      .json({ errors: ["Houve um erro, tente novamente mais tarde."] });
    return;
  }

  res.status(201).json({
    data: update,
  });
};

export const updateFileAsset = async (req: Request, res: Response) => {
  const { id } = req.params;
  const invoice = req.file?.filename;

  const asset = await prisma.asset.findUnique({ where: { id } });

  if (!asset) {
    res.status(500).json({ errors: ["Ativo não encontrado."] });
    return;
  }

  const update = await prisma.asset.update({
    where: { id },
    data: {
      invoice,
      updatedAt: new Date(),
    },
  });

  if (!update) {
    res
      .status(500)
      .json({ errors: ["Houve um erro, tente novamente mais tarde."] });
    return;
  }

  res.status(201).json("Nota fiscal editada com sucesso.");
};

export const listAllAssets = async (req: Req, res: Response) => {
  const idUser = req.user?.id;

  const page = req.query.page || 1;
  const take = Number(req.query.take) || null;

  const user = await prisma.user.findUnique({
    where: { id: idUser },
  });

  if (!user) {
    res.status(400).json({ errors: ["Erro ao encontrar usuário."] });
    return;
  }

  let assets: Asset[] = [];

  if (take) {
    const skip = (Number(page) - 1) * take;

    assets = await prisma.asset.findMany({
      where: { organizationId: user?.organizationId },
      orderBy: { createdAt: "desc" },
      skip,
      take,
    });
  } else {
    assets = await prisma.asset.findMany({
      where: { organizationId: user?.organizationId },
      orderBy: { createdAt: "desc" },
    });
  }

  const total = await prisma.asset.count({
    where: { organizationId: user?.organizationId },
  });

  res.status(201).json({
    data: assets,
    total,
  });
};

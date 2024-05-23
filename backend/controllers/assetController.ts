import { Asset, Collaborator, PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

const verifyAssetExist = async (idClient: string) => {
  const asset = await prisma.asset.findUnique({
    where: { idClient },
  });

  return asset;
};

export const registerAsset = async (req: Request, res: Response) => {
  const data = req.body;
  const invoice = req.file?.filename;

  const asset = await verifyAssetExist(data.idClient);

  if (asset) {
    res.status(400).json({ errors: ["Ativo já cadastrado."] });
    return;
  }

  const newAsset = await prisma.asset.create({
    data: {
      ...data,
      purchaseDate: new Date(data.purchaseDate),
      closingGuarantee: new Date(data.closingGuarantee),
      invoice,
      status: "Reserva",
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
  const invoice = req.file?.filename;

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
      invoice,
      updatedAt: new Date(),
    },
  });

  res.status(201).json({
    data: update,
  });
};

export const listAllAssets = async (req: Request, res: Response) => {
  const page = req.query.page || 1;
  const take = Number(req.query.take) || null;

  let assets: Asset[] = [];

  if (take) {
    const skip = (Number(page) - 1) * take;

    assets = await prisma.asset.findMany({
      orderBy: { createdAt: "asc" },
      skip,
      take,
    });
  } else {
    assets = await prisma.asset.findMany({
      orderBy: { createdAt: "asc" },
    });
  }

  const total = await prisma.asset.count();

  res.status(201).json({
    data: assets,
    total,
  });
};

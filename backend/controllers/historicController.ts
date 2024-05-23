import {
  Asset,
  AssetsHistoric,
  Collaborator,
  PrismaClient,
  User,
} from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

interface Req extends Request {
  user?: User | null;
}

interface IFilter {
  description?: string;
  idClient?: string;
  supplier?: string;
  closingGuarantee?: Date;
  purchaseDate?: Date;
  status?: string;
  name?: string;
  email?: string;
  dateRegisterInitial?: Date;
  dateRegisterFinal?: Date;
}

export const registerHistoric = async (req: Req, res: Response) => {
  const data = req.body;
  const idUser = req.user?.id;

  const asset = await prisma.asset.findUnique({
    where: { id: data.assetId },
  });

  const collaborator = await prisma.collaborator.findUnique({
    where: { id: data.collaboratorId },
  });

  if (!asset) {
    res.status(400).json({ errors: ["Ativo não encontrado."] });
    return;
  }

  if (data.status === "Alocado" && !asset.canAllocated) {
    res.status(400).json({ errors: ["Ativo não pode ser alocado."] });
    return;
  }

  if (asset.status === "Desabilitado") {
    res.status(400).json({ errors: ["Esse ativo foi desabilitado."] });
    return;
  }

  if (!collaborator || collaborator.status === "Inativo") {
    res.status(400).json({ errors: ["Colaborador consta como inativo."] });
    return;
  }

  const newData = await prisma.assetsHistoric.create({
    data: {
      ...data,
      createdBy: idUser,
    },
  });

  if (!newData) {
    res
      .status(500)
      .json({ errors: ["Houve um erro, tente novamente mais tarde."] });
    return;
  }

  res.status(201).json({
    data: newData,
  });
};

export const updateAssetHistoric = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;

  const assetHistoric = await prisma.assetsHistoric.findUnique({
    where: { id },
  });

  const collaborator = await prisma.collaborator.findUnique({
    where: { id: data.collaboratorId },
  });

  if (!assetHistoric) {
    res.status(500).json({ errors: ["Registro não encontrado."] });
    return;
  }

  if (data.status) {
    res.status(400).json({ errors: ["Erro! Status não pode ser editado."] });
    return;
  }

  if (!collaborator || collaborator.status === "Inativo") {
    res.status(400).json({ errors: ["Colaborador consta como inativo."] });
    return;
  }

  const update = await prisma.assetsHistoric.update({
    where: { id },
    data: {
      ...data,
      updatedAt: new Date(),
    },
  });

  res.status(201).json({
    data: update,
  });
};

export const listAllHistoric = async (req: Request, res: Response) => {
  const page = req.query.page || 1;
  const take = Number(req.query.take) || null;

  let assetsHistoric: AssetsHistoric[] = [];

  if (take) {
    const skip = (Number(page) - 1) * take;

    assetsHistoric = await prisma.assetsHistoric.findMany({
      orderBy: { createdAt: "desc" },
      include: { asset: true, collaborator: true, user: true },
      skip,
      take,
    });
  } else {
    assetsHistoric = await prisma.assetsHistoric.findMany({
      orderBy: { createdAt: "desc" },
      include: { asset: true, collaborator: true, user: true },
    });
  }

  const total = await prisma.assetsHistoric.count();

  res.status(201).json({
    data: assetsHistoric,
    total,
  });
};

export const filterHistoric = async (req: Request, res: Response) => {
  const filter: IFilter = req.body;

  const historic = await prisma.assetsHistoric.findMany({
    orderBy: { createdAt: "desc" },
    include: { asset: true, collaborator: true, user: true },
  });

  let arrayHistoricFilter = [];

  const keys = Object.keys(filter) as Array<keyof typeof filter>;

  if (historic) {
    for (let item of historic) {
      let isFiltered: boolean[] = [];

      keys.forEach(async (key) => {
        if (
          key === "description" ||
          key === "idClient" ||
          key === "closingGuarantee" ||
          key === "purchaseDate" ||
          key === "supplier" ||
          key === "status"
        ) {
          isFiltered.push(item.asset[key] === filter[key])
        } else if(key === "name" || key === "email"){
          isFiltered.push(item.collaborator[key] === filter[key] || item.user[key] === filter[key])
        } else if(key === "dateRegisterFinal" || key === "dateRegisterInitial"){
          //converter para timestamp
        }

        if (!isFiltered.includes(false)) {
          arrayHistoricFilter.push(item);
        }
      });
    }
  }
};

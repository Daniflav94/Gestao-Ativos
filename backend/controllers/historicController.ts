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
  status?: string;
  name?: string;
  email?: string;
  dateRegisterInitial?: Date;
  dateRegisterFinal?: Date;
}

export const registerHistoric = async (req: Req, res: Response) => {
  const data = req.body;
  const idUser = req.user?.id;

  const user = await prisma.user.findUnique({
    where: { id: idUser },
  });

  if (!user) {
    res.status(400).json({ errors: ["Erro ao encontrar usuário."] });
    return;
  }

  const asset = await prisma.asset.findUnique({
    where: { id: data.assetId },
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

  if(data.status === "Alocado" && !data.collaboratorId){
    res.status(400).json({ errors: ["Selecione um colaborador."] });
    return;
  }

  if (data.collaboratorId) {
    const collaborator = await prisma.collaborator.findUnique({
      where: { id: data.collaboratorId },
    });

    if (!collaborator || collaborator.status === "Inativo") {
      res.status(400).json({ errors: ["Colaborador consta como inativo."] });
      return;
    }
  }

  const newData = await prisma.assetsHistoric.create({
    data: {
      dateRegister: new Date(data.dateRegister),
      previousStatus: asset.status,
      status: data.status,
      createdBy: idUser as string,
      assetId: data.assetId,
      collaboratorId: data.collaboratorId,
      organizationId: user?.organizationId as string,
      observation: data.observation
    },
  });

  const updateStatusAsset = await prisma.asset.update({
    where: { id: asset.id },
    data: { status: data.status, updatedAt: new Date() },
  });

  if (!newData || !updateStatusAsset) {
    res
      .status(500)
      .json({ errors: ["Houve um erro, tente novamente mais tarde."] });
    return;
  }

  res.status(201).json({
    data: newData,
  });
};

export const updateAssetHistoric = async (req: Req, res: Response) => {
  const { id } = req.params;
  const data = req.body;
  const idUser = req.user?.id;

  const assetHistoric = await prisma.assetsHistoric.findUnique({
    where: { id },
  });

  if (!assetHistoric) {
    res.status(500).json({ errors: ["Registro não encontrado."] });
    return;
  }

  const asset = await prisma.asset.findUnique({
    where: { id: data.assetId },
  });

  if (!asset) {
    res.status(500).json({ errors: ["Ativo não encontrado."] });
    return;
  }

  if (data.collaboratorId) {
    const collaborator = await prisma.collaborator.findUnique({
      where: { id: data.collaboratorId },
    });

    if (!collaborator || collaborator.status === "Inativo") {
      res.status(400).json({ errors: ["Colaborador consta como inativo."] });
      return;
    }
  }

  if (data.status === "Alocado" && !data.collaboratorId) {
    res.status(400).json({
      errors: [
        "Erro! Para status alocado o colaborador precisa ser informado.",
      ],
    });
    return;
  }

  if (data.status !== assetHistoric.status) {
    res.status(400).json({ errors: ["Erro! Status não pode ser editado."] });
    return;
  }

  if (asset && asset.id !== assetHistoric.assetId) {
    if (asset.status === assetHistoric.status) {
      res.status(400).json({
        errors: [
          `Erro! Status do ativo selecionado já está como ${asset.status}.`,
        ],
      });
      return;
    } else {
     const updateAsset = await prisma.asset.update({
        where: { id: data.assetId },
        data: { status: data.status, updatedAt: new Date() },
      });
      console.log("edição ativo novo:", updateAsset)
      const updateAssetPrevious = await prisma.asset.update({
        where: { id: assetHistoric.assetId },
        data: { status: assetHistoric.previousStatus, updatedAt: new Date() },
      });
      console.log("edição ativo anterior:", updateAssetPrevious)
    }
  }

  const update = await prisma.assetsHistoric.update({
    where: { id },
    data: {
      dateRegister: new Date(data.dateRegister),
      previousStatus: asset.id !== assetHistoric.assetId ? asset.status : assetHistoric.previousStatus,
      status: data.status,
      createdBy: idUser as string,
      assetId: data.assetId,
      collaboratorId: data.collaboratorId,
      observation: data.observation,
      updatedAt: new Date(),
    },
  });

  res.status(201).json({
    data: update,
  });
};

export const listAllHistoric = async (req: Req, res: Response) => {
  const page = req.query.page || 1;
  const take = Number(req.query.take) || null;
  const idUser = req.user?.id;

  const user = await prisma.user.findUnique({
    where: { id: idUser },
  });

  if (!user) {
    res.status(400).json({ errors: ["Erro ao encontrar usuário."] });
    return;
  }

  let assetsHistoric: AssetsHistoric[] = [];

  if (take) {
    const skip = (Number(page) - 1) * take;

    assetsHistoric = await prisma.assetsHistoric.findMany({
      where: { organizationId: user?.organizationId },
      orderBy: { createdAt: "desc" },
      include: { asset: true, collaborator: true, user: true },
      skip,
      take,
    });
  } else {
    assetsHistoric = await prisma.assetsHistoric.findMany({
      where: { organizationId: user?.organizationId },
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

export const filterHistoric = async (req: Req, res: Response) => {
  const filter: IFilter = req.body;
  const idUser = req.user?.id;

  const user = await prisma.user.findUnique({
    where: { id: idUser },
  });
  
  if (!user) {
    res.status(400).json({ errors: ["Erro ao encontrar usuário."] });
    return;
  }

  const historic = await prisma.assetsHistoric.findMany({
    where: { organizationId: user?.organizationId },
    orderBy: { createdAt: "desc" },
    include: { asset: true, collaborator: true, user: true },
  });

  let arrayHistoricFilter: AssetsHistoric[] = [];

  const keys = Object.keys(filter) as Array<keyof typeof filter>;

  if (historic) {
    for (let item of historic) {
      let isFiltered: boolean[] = [];

      keys.forEach(async (key) => {
        if (
          key === "description" ||
          key === "idClient" ||
          key === "supplier" ||
          key === "status"
        ) {
          isFiltered.push(
            item.asset[key]
              .toLowerCase()
              .includes((filter[key] as string).toLowerCase())
          );
        } else if (key === "name" || (key === "email" && item.collaborator)) {
          isFiltered.push(
            (item.collaborator as Collaborator)[key]
              .toLowerCase()
              .includes((filter[key] as string).toLowerCase()) ||
              item.user[key]
                .toLowerCase()
                .includes((filter[key] as string).toLowerCase())
          );
        } else if (
          key === "dateRegisterFinal" ||
          key === "dateRegisterInitial"
        ) {
          const dateItemTmz = item.dateRegister.getTime();
          const dateInitialTmz = new Date(
            filter["dateRegisterInitial"] as Date
          ).getTime();
          const dateFinalTmz = new Date(
            filter["dateRegisterFinal"] as Date
          ).getTime();

          if (dateInitialTmz && dateFinalTmz) {
            isFiltered.push(
              dateItemTmz >= dateInitialTmz && dateItemTmz <= dateFinalTmz
            );
          } else if (dateInitialTmz && !dateFinalTmz) {
            isFiltered.push(dateItemTmz >= dateInitialTmz);
          } else if (!dateInitialTmz && dateFinalTmz) {
            isFiltered.push(dateItemTmz <= dateFinalTmz);
          }
        }
      });

      if (!isFiltered.includes(false)) {
        arrayHistoricFilter.push(item);
      }
    }
  }

  res.status(201).json({
    data: arrayHistoricFilter,
    total: arrayHistoricFilter.length,
  });
};

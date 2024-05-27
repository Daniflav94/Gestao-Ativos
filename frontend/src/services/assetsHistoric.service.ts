import { IAssetsHistoric } from "../interfaces/IAssetsHistoric.interface";
import { api } from "../utils/config";

const token = localStorage.getItem("token");

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

export const createAssetHistoric = async (data: IAssetsHistoric) => {
  try {
    const res = await fetch(`${api}/historic`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(data),
    });

    return res.json();
  } catch (error) {
    console.log(error);
  }
};


export const listAllHistoricAssets = async () => {
  try {
    const res = await fetch(`${api}/historic`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });

    return res.json();
  } catch (error) {
    console.log(error);
  }
};

export const listLastHistoric = async () => {
  try {
    const res = await fetch(`${api}/historic?page=1`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });

    return res.json();
  } catch (error) {
    console.log(error);
  }
};

export const editRegisterHistoric = async (id: string, asset: IAssetsHistoric) => {
  try {
    const res = await fetch(`${api}/historic/${id}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(asset),
    });

    return res.json();
  } catch (error) {
    console.log(error);
  }
};

export const filterHistoric = async (filter: Partial<IFilter>) => {
  try {
    const res = await fetch(`${api}/historic/filter`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(filter),
    });

    return res.json();
  } catch (error) {
    console.log(error);
  }
};

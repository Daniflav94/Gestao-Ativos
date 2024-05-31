import { IAssets } from "../interfaces/IAssets.interface";
import { api } from "../utils/config";

const token = localStorage.getItem("token");

export const createAsset = async (data: FormData) => {
  try {
    const res = await fetch(`${api}/assets`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
      },
      body: data,
    });

    return res.json();
  } catch (error) {
    console.log(error);
  }
};

export const listAll = async () => {
  try {
    const res = await fetch(`${api}/assets`, {
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

export const listAllWithPagination = async (page: number) => {
  try {
    const res = await fetch(`${api}/assets?page=${page}`, {
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

export const editAsset = async (id: string, asset: IAssets) => {
  try {
    const res = await fetch(`${api}/assets/${id}`, {
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

export const editFile = async (id: string, file: FormData) => {
  try {
    const res = await fetch(`${api}/assets/file/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: "Bearer " + token,
      },
      body: file,
    });

    return res.json();
  } catch (error) {
    console.log(error);
  }
};

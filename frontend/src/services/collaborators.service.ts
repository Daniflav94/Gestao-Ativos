import { ICollaborators } from "../interfaces/ICollaborators.interface";
import { api } from "../utils/config";

const token = localStorage.getItem("token");

export const createCollaborator = async (data: ICollaborators) => {
  try {
    const res = await fetch(`${api}/collaborators`, {
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

export const editCollaborator = async (id: string, asset: ICollaborators) => {
  try {
    const res = await fetch(`${api}/collaborators/${id}`, {
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

export const listActiveCollaborators = async () => {
  try {
    const res = await fetch(`${api}/collaborators/`, {
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

export const listCollaboratorsWithPagination = async (page: number) => {
  try {
    const res = await fetch(`${api}/collaborators/list-all?page=${page}&take=8`, {
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

export const listAllCollaborator = async () => {
  try {
    const res = await fetch(`${api}/collaborators/list-all`, {
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



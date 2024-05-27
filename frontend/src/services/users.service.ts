import { IUsers } from "../interfaces/IUser.interface";
import { api } from "../utils/config";

const token = localStorage.getItem("token");

export const createUser = async (data: IUsers) => {
  try {
    const res = await fetch(`${api}/auth/register`, {
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





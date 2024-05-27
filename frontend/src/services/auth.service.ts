import { api } from "../utils/config";

interface ILogin {
    email: string;
    password: string;
}

export const login = async (data: ILogin) => {
    try {
      const res = await fetch(`${api}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const response =  await res.json()

      localStorage.setItem("user", JSON.stringify(response.user));
      localStorage.setItem("token", JSON.stringify(response.token));
      
      return response;
    } catch (error) {
      console.log(error);
    }
  };
  
  export const logout = () => {
    localStorage.clear();
  };
  
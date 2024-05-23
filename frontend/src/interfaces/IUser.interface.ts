import { TypeUser } from "../enums/typeUser.enum";

export interface IUsers {
    id: string;
    name: string;
    password: string;
    email: string;
    phone: string;
    status: string;
    type: TypeUser;
}
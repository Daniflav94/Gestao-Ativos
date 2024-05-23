import { IAssets } from "./IAssets.interface";
import { ICollaborators } from "./ICollaborators.interface";
import { IUsers } from "./IUser.interface";

export interface IAssetsHistoric {
    id?: string;
    asset: IAssets;
    collaborator?: ICollaborators;
    createdBy: IUsers;
    dateRegister: Date;
    observation?: string;
    status: string;
    createdAt: string;
}
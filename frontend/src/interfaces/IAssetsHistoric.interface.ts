import { IAssets } from "./IAssets.interface";
import { ICollaborators } from "./ICollaborators.interface";
import { IUsers } from "./IUser.interface";

export interface IAssetsHistoric {
    id?: string;
    assetId: string;
    asset?: IAssets;
    collaboratorId?: string;
    collaborator?: ICollaborators;
    createdBy?: string;
    user?: IUsers;
    dateRegister: Date;
    observation?: string;
    status: string;
    createdAt?: string;
}
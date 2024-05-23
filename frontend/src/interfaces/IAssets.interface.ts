import { StatusAssets } from "../enums/statusAssets.enum";

export interface IAssets {
    id?: string;
    idClient: string;
    description: string;
    purchaseDate: Date;
    closingGuarantee: Date;
    supplier: string;
    invoice?: string;
    observation?: string;
    canAllocated: boolean;
    status?: StatusAssets;
}
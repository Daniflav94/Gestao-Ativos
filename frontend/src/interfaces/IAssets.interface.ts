import { StatusAssets } from "../enums/statusAssets.enum";

export interface IAssets {
    id?: string;
    idClient: string;
    description: string;
    purchaseDate: Date | string;
    closingGuarantee: Date | string;
    supplier: string;
    invoice?: string;
    observation?: string;
    canAllocated: boolean;
    status?: StatusAssets;
}
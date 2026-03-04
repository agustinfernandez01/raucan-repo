import { apiFetch } from "./api";
import type { IDeposito } from "../types/deposito";

export async function getDepositos(): Promise<IDeposito[]> {
    const response = await apiFetch<IDeposito[]>("/depositos/get") as IDeposito[];
    return response;
}
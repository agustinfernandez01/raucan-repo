import { apiFetch } from "./api";
import type { Deposito } from "../types/deposito";

export async function getDepositos(): Promise<Deposito[]> {
    const response = await apiFetch<Deposito[]>("/depositos/get") as Deposito[];
    return response;
}
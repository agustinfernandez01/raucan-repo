import { apiFetch } from "./api";
import type { IResponseStockDeposito, ICreateStockDeposito, IStockDepositoPatch, IStockDepositoUpdate } from "../types/stock_deposito";

export const getStockDeposito = async (): Promise<IResponseStockDeposito[]> => {
    const response = await apiFetch("/stock_deposito/get");
    return response as IResponseStockDeposito[];
}

export const getStockDepositoById = async (id: number): Promise<IResponseStockDeposito> => {
    const response = await apiFetch(`/stock_deposito/get/${id}`);
    return response as IResponseStockDeposito;
}

export const createStockDeposito = async (stockDeposito: ICreateStockDeposito): Promise<IResponseStockDeposito> => {
    const response = await apiFetch("/stock_deposito/create", {
        method: "POST",
        body: JSON.stringify(stockDeposito),
    });
    return response as IResponseStockDeposito;
}

export const updateStockDeposito = async (id: number, stockDeposito: IStockDepositoUpdate): Promise<IResponseStockDeposito> => {
    const response = await apiFetch(`/stock_deposito/update/${id}`, {
        method: "PUT",
        body: JSON.stringify(stockDeposito),
    });
    return response as IResponseStockDeposito;
}

export const patchStockDeposito = async (id: number, stockDeposito: Partial<IStockDepositoPatch>): Promise<IResponseStockDeposito> => {
    const response = await apiFetch(`/stock_deposito/patch/${id}`, {
        method: "PATCH",
        body: JSON.stringify(stockDeposito),
    });
    return response as IResponseStockDeposito;
}

export const deleteStockDeposito = async (id: number): Promise<IResponseStockDeposito> => {
    const response = await apiFetch(`/stock_deposito/delete/${id}`, {
        method: "DELETE",
    });
    return response as IResponseStockDeposito;
}
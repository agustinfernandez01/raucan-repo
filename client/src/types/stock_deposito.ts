import type { IProductoSimple } from "./producto";
import type { IDepositoSimple } from "./deposito";

export interface IResponseStockDeposito {
    id: number;
    nombre: string;
    descripcion: string;
    producto: IProductoSimple; // id y nombre
    deposito: IDepositoSimple; // id y nombre
    cantidad_producto: number;

}

export interface ICreateStockDeposito {
    nombre: string;
    descripcion: string;
    id_producto: number;
    id_deposito: number;
    cantidad_producto: number;
}


export interface IStockDepositoPatch {
    id_producto: number | null;
    id_deposito: number | null;
    cantidad_producto: number | null;
    nombre: string | null;
    descripcion: string | null;
}

export interface IStockDepositoUpdate {
    id_producto: number;
    id_deposito: number;
    cantidad_producto: number;
    nombre: string;
    descripcion: string;
}
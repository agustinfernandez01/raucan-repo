export interface IDeposito {
    id: number;
    nombre: string;
    descripcion: string;
    direccion: string;
    ubicacion: string;
    estado: boolean;
    actualizado_en : Date | null
}

export interface IDepositoSimple {
    id: number;
    nombre: string;
}

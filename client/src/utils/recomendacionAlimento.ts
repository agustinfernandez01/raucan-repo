/**
 * Tablas de recomendación de alimentación (adultos > 12 meses).
 * Fuente: tablas oficiales de consumo sugerido y aproximado.
 */

export interface RangoRecomendacion {
  minGramos: number;
  maxGramos: number;
  /** Ej: "90 a 150 g" */
  texto: string;
}

/** Perros adultos: peso (kg) → gramos/día */
const TABLA_PERROS: { pesoMin: number; pesoMax: number; gramosMin: number; gramosMax: number }[] = [
  { pesoMin: 1, pesoMax: 5, gramosMin: 90, gramosMax: 150 },
  { pesoMin: 6, pesoMax: 10, gramosMin: 180, gramosMax: 300 },
  { pesoMin: 11, pesoMax: 15, gramosMin: 330, gramosMax: 450 },
  { pesoMin: 16, pesoMax: 25, gramosMin: 480, gramosMax: 750 },
  { pesoMin: 26, pesoMax: 35, gramosMin: 780, gramosMax: 1050 },
  { pesoMin: 36, pesoMax: 50, gramosMin: 1080, gramosMax: 1500 },
];

/** Gatos adultos: peso (kg) → gramos/día */
const TABLA_GATOS: { pesoMin: number; pesoMax: number; gramosMin: number; gramosMax: number }[] = [
  { pesoMin: 3, pesoMax: 4, gramosMin: 90, gramosMax: 120 },
  { pesoMin: 4, pesoMax: 5, gramosMin: 120, gramosMax: 150 },
  { pesoMin: 5, pesoMax: 6, gramosMin: 150, gramosMax: 180 },
  { pesoMin: 6, pesoMax: 7, gramosMin: 180, gramosMax: 210 },
];

function buscarRango(
  pesoKg: number,
  tabla: { pesoMin: number; pesoMax: number; gramosMin: number; gramosMax: number }[]
): RangoRecomendacion | null {
  const rango = tabla.find((r) => pesoKg >= r.pesoMin && pesoKg <= r.pesoMax);
  if (!rango) return null;
  return {
    minGramos: rango.gramosMin,
    maxGramos: rango.gramosMax,
    texto: `${rango.gramosMin} a ${rango.gramosMax} g`,
  };
}

/**
 * Devuelve la recomendación de gramos/día según especie y peso.
 * Para perros: tabla 1–50 kg. Para gatos: tabla 3–7 kg.
 * "Otro" o peso fuera de rango → null.
 */
export function getRecomendacionAlimento(
  especie: string | undefined,
  pesoKg: number | null | undefined
): RangoRecomendacion | null {
  if (pesoKg == null || pesoKg <= 0) return null;
  const especieNorm = especie?.toLowerCase();
  if (especieNorm === 'perro') return buscarRango(pesoKg, TABLA_PERROS);
  if (especieNorm === 'gato') return buscarRango(pesoKg, TABLA_GATOS);
  return null;
}

/** Texto aclaratorio para la calculadora (adultos > 12 meses, dietas especiales). */
export const DISCLAIMER_RECOMENDACION =
  'Para perros y gatos adultos mayores a 12 meses. Para cachorros o dietas de subida/bajada de peso, consultar por privado.';

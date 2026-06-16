import { vectorField } from "../types";
import { createNoise3D } from "simplex-noise";

const noise3D = createNoise3D();

export function generateVectorField(
    width: number,
    height: number,
    cellSize: number,
    time: number,
    scale: number
): vectorField {
    if (!width || !height) return [] as vectorField;

    const rows = Math.ceil(height / cellSize);
    const cols = Math.ceil(width / cellSize);
    const field: vectorField = [];

    for (let row = 0; row < rows; row++) {
        const r: vectorField[number] = [];
        for (let col = 0; col < cols; col++) {
            const angle = noise3D(col * scale, row * scale, time) * Math.PI * 2;
            r.push([Math.cos(angle), Math.sin(angle)]);
        }
        field.push(r);
    }

    return field;
}
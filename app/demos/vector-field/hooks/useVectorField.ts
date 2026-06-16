import { vectorField } from "../types";
import { createNoise3D } from "simplex-noise";

const noise3D = createNoise3D();

export function generateVectorField(
    width: number,
    height: number,
    cellSize: number,
    time: number,
    scale: number,
    mouse: { x: number; y: number } | null,
    radius: number
): vectorField {
    if (!width || !height) return [] as vectorField;

    const rows = Math.ceil(height / cellSize);
    const cols = Math.ceil(width / cellSize);
    const field: vectorField = [];

    for (let row = 0; row < rows; row++) {
        const r: vectorField[number] = [];
        for (let col = 0; col < cols; col++) {
            const angle = noise3D(col * scale, row * scale, time) * Math.PI * 2;
            let vx = Math.cos(angle);
            let vy = Math.sin(angle);

            if (mouse) {
                const cx = col * cellSize + cellSize / 2;
                const cy = row * cellSize + cellSize / 2;
                const dx = cx - mouse.x;
                const dy = cy - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < radius && dist > 0.001) {
                    const strength = 1 - dist / radius; // 1 = right at cursor, 0 = at edge
                    const pushX = (dx / dist) * strength;
                    const pushY = (dy / dist) * strength;

                    vx += pushX * 3; // weight repulsion more heavily than noise
                    vy += pushY * 3;

                    // re-normalize so speed stays consistent
                    const len = Math.sqrt(vx * vx + vy * vy);
                    if (len > 0) {
                        vx /= len;
                        vy /= len;
                    }
                }
            }

            r.push([vx, vy]);
        }
        field.push(r);
    }

    return field;
}
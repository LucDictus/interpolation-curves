"use client";

import {useMemo} from "react";
import { VectorField } from "../types";

export function useVectorField(width: number, height: number, cellSize:number): VectorField {
    return useMemo(
        () => {
            if (!width || !height) return [] as VectorField;

            const rows = Math.ceil(height / cellSize);
            const cols = Math.ceil(width / cellSize);

            const field: VectorField = [];

            for (let row = 0; row < rows; row++) {
                const r =[];
                for (let col = 0; col < cols; col++) {
                    r.push([1, 0]) // [vx, vy]
                }
                field.push(r)
            }

            return field;
        }, [width, height, cellSize]
    );
}

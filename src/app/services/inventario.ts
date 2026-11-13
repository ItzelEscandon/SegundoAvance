import { effect, Injectable, signal } from '@angular/core';

export type TipoMovimiento = 'Entrada' | 'Salida' | 'Ajuste';

export interface MovimientoInsumo {
  id: number;
  tipo: TipoMovimiento;
  cantidad: number;
  fecha: string;
  observacion: string;
}

export interface Insumo {
  id: number;
  nombre: string;
  categoria: string;
  cantidad: number;
  unidad: string;
  minimo: number;
  movimientos: MovimientoInsumo[];
}

const INVENTARIO_INICIAL: Insumo[] = [
  { id: 1, nombre: 'Semillas de maíz', categoria: 'Semillas', cantidad: 12, unidad: 'kg', minimo: 5, movimientos: [] },
  { id: 2, nombre: 'Fertilizante orgánico', categoria: 'Fertilizantes', cantidad: 3, unidad: 'sacos', minimo: 4, movimientos: [] },
  { id: 3, nombre: 'Guantes de trabajo', categoria: 'Herramientas', cantidad: 8, unidad: 'pares', minimo: 2, movimientos: [] },
];

@Injectable({ providedIn: 'root' })
export class InventarioService {
  private readonly clave = 'farmconnection-inventario';
  readonly insumos = signal<Insumo[]>(this.cargar());

  constructor() {
    effect(() => localStorage.setItem(this.clave, JSON.stringify(this.insumos())));
  }

  private cargar(): Insumo[] {
    const guardado = localStorage.getItem(this.clave);
    if (guardado) {
      try {
        return JSON.parse(guardado) as Insumo[];
      } catch {
        localStorage.removeItem(this.clave);
      }
    }
    return INVENTARIO_INICIAL;
  }
}

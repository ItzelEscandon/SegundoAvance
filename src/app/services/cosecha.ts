import { effect, Injectable, signal } from '@angular/core';

export interface Cosecha {
  id: number;
  cultivoId: number;
  cultivo: string;
  fecha: string;
  cantidad: number;
  unidad: string;
  calidad: string;
  observaciones: string;
  imagen: string;
}

@Injectable({ providedIn: 'root' })
export class CosechaService {
  private readonly clave = 'farmconnection-cosechas';
  readonly cosechas = signal<Cosecha[]>(this.cargar());

  constructor() {
    effect(() => localStorage.setItem(this.clave, JSON.stringify(this.cosechas())));
  }

  private cargar(): Cosecha[] {
    const guardadas = localStorage.getItem(this.clave);
    if (guardadas) {
      try {
        return JSON.parse(guardadas) as Cosecha[];
      } catch {
        localStorage.removeItem(this.clave);
      }
    }
    return [];
  }
}

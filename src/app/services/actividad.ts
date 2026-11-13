import { effect, Injectable, signal } from '@angular/core';

export interface Actividad {
  id: number;
  fecha: string;
  nombre: string;
  cultivo: string;
  estado: string;
  icono: string;
}

function fechaRelativa(dias: number): string {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() + dias);
  const año = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');
  return `${año}-${mes}-${dia}`;
}

const ACTIVIDADES_INICIALES: Actividad[] = [
  {
    id: 1,
    fecha: fechaRelativa(-1),
    nombre: 'Regar el cultivo',
    cultivo: 'Maíz · Parcela norte',
    estado: 'Pendiente',
    icono: 'water_drop',
  },
  {
    id: 2,
    fecha: fechaRelativa(1),
    nombre: 'Revisar crecimiento',
    cultivo: 'Calabaza · Parcela este',
    estado: 'Pendiente',
    icono: 'eco',
  },
  {
    id: 3,
    fecha: fechaRelativa(3),
    nombre: 'Preparar el terreno',
    cultivo: 'Frijol · Parcela sur',
    estado: 'En proceso',
    icono: 'agriculture',
  },
  {
    id: 4,
    fecha: fechaRelativa(-4),
    nombre: 'Registrar nueva siembra',
    cultivo: 'Jitomate · Parcela oriente',
    estado: 'Completada',
    icono: 'event_available',
  },
];

@Injectable({ providedIn: 'root' })
export class ActividadService {
  private readonly clave = 'farmconnection-actividades';
  readonly actividades = signal<Actividad[]>(this.cargarActividades());

  constructor() {
    effect(() => {
      localStorage.setItem(this.clave, JSON.stringify(this.actividades()));
    });
  }

  private cargarActividades(): Actividad[] {
    const guardadas = localStorage.getItem(this.clave);

    if (guardadas) {
      try {
        return JSON.parse(guardadas) as Actividad[];
      } catch {
        localStorage.removeItem(this.clave);
      }
    }

    return ACTIVIDADES_INICIALES;
  }
}

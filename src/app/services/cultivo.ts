import { effect, Injectable, signal } from '@angular/core';
import { Cultivo } from '../interfaces/cultivo.interface';

@Injectable({
  providedIn: 'root',
})
export class CultivoService {
  private readonly clave = 'farmconnection-cultivos';

  cultivos = signal<Cultivo[]>(this.cargarCultivos());

  constructor() {
    // Cada vez que cambia la lista, guardamos una copia en el navegador.
    effect(() => {
      localStorage.setItem(this.clave, JSON.stringify(this.cultivos()));
    });
  }

  private cargarCultivos(): Cultivo[] {
    const guardados = localStorage.getItem(this.clave);

    if (guardados) {
      try {
        return JSON.parse(guardados) as Cultivo[];
      } catch {
        localStorage.removeItem(this.clave);
      }
    }

    return [
      {
        id: 1,
        nombre: 'Maíz',
        tipo: 'Grano',
        variedad: 'Criollo',
        fechaSiembra: '2026-06-01',
        ubicacion: 'Parcela norte',
        estado: 'En crecimiento',
        imagen: 'https://images.unsplash.com/photo-1629808477627-3ba9b1359c4f?auto=format&fit=crop&w=600&q=80',
      },
      {
        id: 2,
        nombre: 'Frijol',
        tipo: 'Leguminosa',
        variedad: 'Negro',
        fechaSiembra: '2026-05-15',
        ubicacion: 'Parcela sur',
        estado: 'Preparación del terreno',
        imagen: 'https://findlaysorganics.com/cdn/shop/products/BlackBeansField.jpg?v=1667231286&width=1946',
      },
      {
        id: 3,
        nombre: 'Calabaza',
        tipo: 'Hortaliza',
        variedad: 'De castilla',
        fechaSiembra: '2026-06-10',
        ubicacion: 'Parcela este',
        estado: 'En crecimiento',
        imagen: 'https://images.unsplash.com/photo-1635340690790-a3020cb9e7e6?auto=format&fit=crop&w=600&q=80',
      },
    ];
  }
}
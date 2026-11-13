import { Component, computed, inject, signal } from '@angular/core';
import { Cultivo } from '../../interfaces/cultivo.interface';
import { CultivoCard } from '../../components/cultivo-card/cultivo-card';
import { ControlesCultivos } from '../../components/controles-cultivos/controles-cultivos';
import { FormularioCultivo } from '../../components/formulario-cultivo/formulario-cultivo';
import { CultivoService } from '../../services/cultivo';

@Component({
  selector: 'app-cultivos',
  imports: [CultivoCard, ControlesCultivos, FormularioCultivo],
  templateUrl: './cultivos.html',
  styleUrl: './cultivos.css',
})
export class Cultivos {
  private cultivoService = inject(CultivoService);
  cultivos = this.cultivoService.cultivos;

  busqueda = signal('');
  cultivoEnEdicion = signal<Cultivo | null>(null);

  cultivosFiltrados = computed(() => {
    const texto = this.busqueda().trim().toLowerCase();

    return this.cultivos().filter(cultivo =>
      cultivo.nombre.toLowerCase().includes(texto)
    );
  });

  alBuscar(texto: string): void {
    this.busqueda.set(texto);
  }

  ordenarPorNombre(): void {
    this.cultivos.update(lista =>
      [...lista].sort((a, b) => a.nombre.localeCompare(b.nombre))
    );
  }

  ordenarPorFecha(): void {
    this.cultivos.update(lista =>
      [...lista].sort(
        (a, b) =>
          new Date(a.fechaSiembra).getTime() -
          new Date(b.fechaSiembra).getTime()
      )
    );
  }

  invertirLista(): void {
    this.cultivos.update(lista => [...lista].reverse());
  }

  guardarCultivo(cultivo: Cultivo, formulario: HTMLDetailsElement): void {
    this.cultivos.update(lista => {
      const existe = lista.some(actual => actual.id === cultivo.id);
      return existe
        ? lista.map(actual => actual.id === cultivo.id ? cultivo : actual)
        : [cultivo, ...lista];
    });
    this.cultivoEnEdicion.set(null);
    formulario.open = false;
  }

  prepararEdicion(cultivo: Cultivo, formulario: HTMLDetailsElement): void {
    this.cultivoEnEdicion.set(cultivo);
    formulario.open = true;
    formulario.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  cancelarEdicion(formulario: HTMLDetailsElement): void {
    this.cultivoEnEdicion.set(null);
    formulario.open = false;
  }

  eliminarCultivo(id: number): void {
    const cultivo = this.cultivos().find(actual => actual.id === id);
    if (!cultivo || !confirm(`¿Eliminar el cultivo "${cultivo.nombre}"?`)) return;

    this.cultivos.update(lista => lista.filter(actual => actual.id !== id));
    if (this.cultivoEnEdicion()?.id === id) this.cultivoEnEdicion.set(null);
  }
}

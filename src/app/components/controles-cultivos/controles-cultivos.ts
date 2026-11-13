import { Component, output } from '@angular/core';

@Component({
  selector: 'app-controles-cultivos',
  imports: [],
  templateUrl: './controles-cultivos.html',
  styleUrl: './controles-cultivos.css',
})
export class ControlesCultivos {
  ordenarNombre = output<void>();
  ordenarFecha = output<void>();
  invertirLista = output<void>();
  buscar = output<string>();

  // Cada botón avisa qué queremos hacer con la lista.
  alOrdenarNombre(): void {
    this.ordenarNombre.emit();
  }

  alOrdenarFecha(): void {
    this.ordenarFecha.emit();
  }

  alInvertirLista(): void {
    this.invertirLista.emit();
  }

  alBuscar(event: Event): void {
    const texto = (event.target as HTMLInputElement).value;
    this.buscar.emit(texto);
  }
}

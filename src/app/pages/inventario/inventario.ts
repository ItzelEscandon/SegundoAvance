import { Component, computed, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { InventarioService, Insumo, TipoMovimiento } from '../../services/inventario';

@Component({
  selector: 'app-inventario',
  imports: [ReactiveFormsModule],
  templateUrl: './inventario.html',
  styleUrl: './inventario.css',
})
export class Inventario {
  private readonly servicio = inject(InventarioService);
  private readonly fb = new FormBuilder();
  insumos = this.servicio.insumos;
  bajos = computed(() => this.insumos().filter(insumo => insumo.cantidad <= insumo.minimo));
  bajosNombres = computed(() => this.bajos().map(item => item.nombre).join(', '));
  mensaje = '';

  formularioInsumo = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    categoria: ['Semillas', Validators.required],
    cantidad: [0, [Validators.required, Validators.min(0)]],
    unidad: ['kg', Validators.required],
    minimo: [1, [Validators.required, Validators.min(0)]],
  });

  formularioMovimiento = this.fb.nonNullable.group({
    insumoId: [0, [Validators.required, Validators.min(1)]],
    tipo: ['Entrada' as TipoMovimiento, Validators.required],
    cantidad: [1, [Validators.required, Validators.min(0.01)]],
    observacion: [''],
  });

  agregarInsumo(): void {
    if (this.formularioInsumo.invalid) {
      this.formularioInsumo.markAllAsTouched();
      return;
    }
    const datos = this.formularioInsumo.getRawValue();
    const nuevo: Insumo = { id: Date.now(), ...datos, movimientos: [] };
    this.insumos.update(lista => [nuevo, ...lista]);
    this.formularioInsumo.reset({ nombre: '', categoria: 'Semillas', cantidad: 0, unidad: 'kg', minimo: 1 });
    this.mensaje = `Se agregó ${nuevo.nombre} al inventario.`;
  }

  registrarMovimiento(): void {
    if (this.formularioMovimiento.invalid) {
      this.formularioMovimiento.markAllAsTouched();
      return;
    }
    const datos = this.formularioMovimiento.getRawValue();
    const actual = this.insumos().find(item => item.id === datos.insumoId);
    if (!actual) return;

    const cantidadNueva = datos.tipo === 'Entrada'
      ? actual.cantidad + datos.cantidad
      : datos.tipo === 'Salida'
        ? actual.cantidad - datos.cantidad
        : datos.cantidad;

    if (cantidadNueva < 0) {
      this.mensaje = `No hay existencias suficientes de ${actual.nombre}.`;
      return;
    }

    const movimiento = {
      id: Date.now(),
      tipo: datos.tipo,
      cantidad: datos.cantidad,
      fecha: new Date().toISOString().slice(0, 10),
      observacion: datos.observacion.trim(),
    };
    this.insumos.update(lista => lista.map(item => item.id === actual.id
      ? { ...item, cantidad: cantidadNueva, movimientos: [movimiento, ...item.movimientos] }
      : item));
    this.formularioMovimiento.reset({ insumoId: 0, tipo: 'Entrada', cantidad: 1, observacion: '' });
    this.mensaje = `${datos.tipo} registrada para ${actual.nombre}.`;
  }

  eliminarInsumo(id: number): void {
    const item = this.insumos().find(insumo => insumo.id === id);
    if (!item || !confirm(`¿Eliminar ${item.nombre} y su historial de movimientos?`)) return;
    this.insumos.update(lista => lista.filter(insumo => insumo.id !== id));
  }
}

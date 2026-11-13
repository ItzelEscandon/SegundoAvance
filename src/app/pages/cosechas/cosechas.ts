import { Component, computed, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CultivoService } from '../../services/cultivo';
import { CosechaService, Cosecha } from '../../services/cosecha';

@Component({
  selector: 'app-cosechas',
  imports: [ReactiveFormsModule, DecimalPipe],
  templateUrl: './cosechas.html',
  styleUrl: './cosechas.css',
})
export class Cosechas {
  private readonly cultivosService = inject(CultivoService);
  private readonly cosechasService = inject(CosechaService);
  private readonly fb = new FormBuilder();
  cultivos = this.cultivosService.cultivos;
  cosechas = this.cosechasService.cosechas;
  totalKilos = computed(() => this.cosechas().reduce((total, item) => total + (item.unidad === 'kg' ? item.cantidad : 0), 0));
  mensaje = '';

  formulario = this.fb.nonNullable.group({
    cultivoId: [0, [Validators.required, Validators.min(1)]],
    fecha: ['', Validators.required],
    cantidad: [0, [Validators.required, Validators.min(0.01)]],
    unidad: ['kg', Validators.required],
    calidad: ['Buena', Validators.required],
    observaciones: [''],
    imagen: [''],
  });

  guardar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    const datos = this.formulario.getRawValue();
    const cultivo = this.cultivos().find(item => item.id === datos.cultivoId);
    if (!cultivo) {
      this.mensaje = 'Primero registra un cultivo para asociar la cosecha.';
      return;
    }
    const nueva: Cosecha = {
      id: Date.now(),
      cultivoId: cultivo.id,
      cultivo: `${cultivo.nombre} · ${cultivo.ubicacion}`,
      fecha: datos.fecha,
      cantidad: datos.cantidad,
      unidad: datos.unidad,
      calidad: datos.calidad,
      observaciones: datos.observaciones.trim(),
      imagen: datos.imagen.trim(),
    };
    this.cosechas.update(lista => [nueva, ...lista]);
    this.formulario.reset({ cultivoId: 0, fecha: '', cantidad: 0, unidad: 'kg', calidad: 'Buena', observaciones: '', imagen: '' });
    this.mensaje = 'Cosecha registrada.';
  }

  eliminar(id: number): void {
    const cosecha = this.cosechas().find(item => item.id === id);
    if (!cosecha || !confirm(`¿Eliminar el registro de cosecha de ${cosecha.cultivo}?`)) return;
    this.cosechas.update(lista => lista.filter(item => item.id !== id));
  }
}

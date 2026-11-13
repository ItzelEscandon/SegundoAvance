import { Component, computed, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { CultivoService } from '../../services/cultivo';
import { Actividad, ActividadService } from '../../services/actividad';

@Component({
  selector: 'app-actividades',
  imports: [ReactiveFormsModule, MatIconModule],
  templateUrl: './actividades.html',
  styleUrl: './actividades.css',
})
export class Actividades {
  private formularioBuilder = new FormBuilder();
  private actividadService = inject(ActividadService);
  private cultivoService = inject(CultivoService);
  actividades = this.actividadService.actividades;
  cultivos = this.cultivoService.cultivos;
  readonly fechaHoy = new Date().toLocaleDateString('sv-SE');

  opcionesCultivo = computed(() => {
    const opciones = this.cultivos().map(cultivo => `${cultivo.nombre} · ${cultivo.ubicacion}`);
    const anteriores = this.actividades().map(actividad => actividad.cultivo);
    return [...new Set([...opciones, ...anteriores])];
  });

  formulario = this.formularioBuilder.nonNullable.group({
    nombre: ['', Validators.required],
    cultivo: ['', Validators.required],
    fecha: ['', Validators.required],
    estado: ['Pendiente', Validators.required],
    icono: ['eco', Validators.required],
  });

  guardarActividad(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const nuevaActividad: Actividad = {
      id: Date.now(),
      ...this.formulario.getRawValue(),
    };

    this.actividades.update(lista => [nuevaActividad, ...lista]);

    this.formulario.reset({
      nombre: '',
      cultivo: '',
      fecha: '',
      estado: 'Pendiente',
      icono: 'eco',
    });
  }

  eliminarActividad(id: number): void {
    this.actividades.update(lista =>
      lista.filter(actividad => actividad.id !== id)
    );
  }

  cambiarEstado(id: number, estado: string): void {
    if (!['Pendiente', 'En proceso', 'Completada'].includes(estado)) return;
    this.actividades.update(lista => lista.map(actividad =>
      actividad.id === id ? { ...actividad, estado } : actividad
    ));
  }
}

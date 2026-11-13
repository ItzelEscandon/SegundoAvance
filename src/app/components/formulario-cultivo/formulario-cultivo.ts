import { Component, effect, input, output } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Cultivo } from '../../interfaces/cultivo.interface';

@Component({
  selector: 'app-formulario-cultivo',
  imports: [ReactiveFormsModule],
  templateUrl: './formulario-cultivo.html',
  styleUrl: './formulario-cultivo.css',
})
export class FormularioCultivo {
  cultivoGuardado = output<Cultivo>();
  cancelarEdicion = output<void>();
  cultivoEditar = input<Cultivo | null>(null);

  formulario;

  constructor(private formBuilder: FormBuilder) {
    // Estos campos son necesarios para registrar un cultivo.
    this.formulario = this.formBuilder.nonNullable.group({
      nombre: ['', Validators.required],
      tipo: ['', Validators.required],
      variedad: ['', Validators.required],
      fechaSiembra: ['', Validators.required],
      ubicacion: ['', Validators.required],
      estado: ['En crecimiento', Validators.required],
    });

    effect(() => {
      const cultivo = this.cultivoEditar();
      if (cultivo) {
        this.formulario.patchValue({
          nombre: cultivo.nombre,
          tipo: cultivo.tipo,
          variedad: cultivo.variedad,
          fechaSiembra: cultivo.fechaSiembra,
          ubicacion: cultivo.ubicacion,
          estado: cultivo.estado,
        });
      } else {
        this.limpiarFormulario();
      }
    });
  }

  guardar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const datos = this.formulario.getRawValue();

    const cultivoActual = this.cultivoEditar();
    const nuevoCultivo: Cultivo = {
      id: cultivoActual?.id ?? Date.now(),
      ...datos,
      imagen: cultivoActual?.imagen ??
        'https://images.unsplash.com/photo-1629808477627-3ba9b1359c4f?auto=format&fit=crop&w=600&q=80',
    };

    this.cultivoGuardado.emit(nuevoCultivo);
    this.limpiarFormulario();
  }

  cancelar(): void {
    this.limpiarFormulario();
    this.cancelarEdicion.emit();
  }

  private limpiarFormulario(): void {
    this.formulario.reset({
      nombre: '',
      tipo: '',
      variedad: '',
      fechaSiembra: '',
      ubicacion: '',
      estado: 'En crecimiento',
    });
  }
}

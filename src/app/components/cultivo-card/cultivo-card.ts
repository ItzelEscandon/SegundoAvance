import { Component, input, output } from '@angular/core';
import { Cultivo } from '../../interfaces/cultivo.interface';

@Component({
  selector: 'app-cultivo-card',
  imports: [],
  templateUrl: './cultivo-card.html',
  styleUrl: './cultivo-card.css',
})
export class CultivoCard {
  cultivo = input.required<Cultivo>();
  editar = output<Cultivo>();
  eliminar = output<number>();
}

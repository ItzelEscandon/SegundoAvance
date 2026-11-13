import { Component, computed, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { ActividadService } from '../../services/actividad';
import { CultivoService } from '../../services/cultivo';
import { InventarioService } from '../../services/inventario';
import { CosechaService } from '../../services/cosecha';

function formatoFecha(fecha: Date): string {
  const año = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');
  return `${año}-${mes}-${dia}`;
}

function fechaConDesplazamiento(dias: number): string {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() + dias);
  return formatoFecha(fecha);
}

@Component({
  selector: 'app-dashboard',
  imports: [MatIconModule, RouterLink, DecimalPipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  private cultivoService = inject(CultivoService);
  private actividadService = inject(ActividadService);
  private inventarioService = inject(InventarioService);
  private cosechaService = inject(CosechaService);
  cultivos = this.cultivoService.cultivos;
  actividades = this.actividadService.actividades;
  insumos = this.inventarioService.insumos;
  cosechas = this.cosechaService.cosechas;
  readonly hoy = formatoFecha(new Date());
  readonly limiteProximaSemana = fechaConDesplazamiento(7);

  totalCultivos = computed(() => this.cultivos().length);

  enCrecimiento = computed(
    () => this.cultivos().filter(cultivo => cultivo.estado === 'En crecimiento').length
  );

  enPreparacion = computed(
    () => this.cultivos().filter(cultivo => cultivo.estado === 'En preparación' || cultivo.estado === 'Preparación del terreno').length
  );

  actividadesPendientes = computed(() =>
    this.actividades().filter(actividad => actividad.estado !== 'Completada')
  );

  actividadesAtrasadas = computed(() =>
    this.actividadesPendientes().filter(actividad => actividad.fecha < this.hoy)
  );

  actividadesProximas = computed(() =>
    this.actividadesPendientes().filter(actividad =>
      actividad.fecha >= this.hoy && actividad.fecha <= this.limiteProximaSemana
    )
  );

  insumosBajos = computed(() =>
    this.insumos().filter(insumo => insumo.cantidad <= insumo.minimo)
  );

  cosechasRecientes = computed(() =>
    [...this.cosechas()].sort((a, b) => b.fecha.localeCompare(a.fecha)).slice(0, 4)
  );

  recientes = computed(() =>
    [...this.cultivos()]
      .sort(
        (a, b) =>
          new Date(b.fechaSiembra).getTime() -
          new Date(a.fechaSiembra).getTime()
      )
      .slice(0, 3)
  );
}

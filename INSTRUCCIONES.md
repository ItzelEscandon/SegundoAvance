# FarmConnection - avance del proyecto

## Abrir y ejecutar en Visual Studio Code

1. Extrae la carpeta `farm-connection-avance.zip` en una ubicación de tu equipo.
2. Abre Visual Studio Code y selecciona **Archivo > Abrir carpeta**. Elige la carpeta `farm-connection` que extrajiste.
3. Abre la terminal integrada y ejecuta:

   ```bash
   npm install
   npm start
   ```

4. Abre `http://localhost:4200/` en el navegador.

Para detener la aplicación, vuelve a la terminal y presiona `Ctrl+C`.

## Qué incluye este avance

- Gestión de cultivos: búsqueda, ordenamiento, alta, edición y eliminación.
- Actividades asociadas a cultivos, con estados editables y avisos por atraso.
- Inventario de insumos, entradas, salidas, ajustes y aviso de existencia mínima.
- Registro de cosechas por cultivo, cantidad, unidad, calidad y URL opcional para evidencia fotográfica.
- Dashboard con conteos, actividades vencidas y próximas, insumos bajos y cosechas recientes.
- Navegación adaptable para las nuevas secciones.

## Alcance técnico actual

Este avance guarda los datos en el almacenamiento local del navegador. Es un prototipo funcional para presentar el flujo y la interfaz; todavía no incluye servidor, MongoDB, inicio de sesión ni permisos por rol. La URL de evidencia debe apuntar a una imagen accesible desde el navegador.

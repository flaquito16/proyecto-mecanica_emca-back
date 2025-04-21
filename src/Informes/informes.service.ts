// src/pdf/pdf.service.ts
import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as path from 'path';
import { WorkOrder } from 'src/work-order/entities/work-order.entity';

@Injectable()
export class informesService {
  async generateWorkOrderPdf(workOrder: WorkOrder): Promise<Buffer> {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    const html = this.getHtmlTemplate(workOrder);
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfUint8Array = await page.pdf({
      format: 'A4',
      printBackground: true,
    });

    await browser.close();

    // 🔧 Conversión explícita a Buffer para evitar errores de tipo
    const pdfBuffer = Buffer.from(pdfUint8Array);
    return pdfBuffer;
  }

  private getHtmlTemplate(workOrder: WorkOrder): string {
    return `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            td, th { border: 1px solid #ddd; padding: 8px; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <h1>Orden de Trabajo ${workOrder.numeroOrden}</h1>
          <p><strong>Encargado:</strong> ${workOrder.encargado}</p>
          <p><strong>Responsable:</strong> ${workOrder.responsable}</p>
          <p><strong>Prioridad:</strong> ${workOrder.prioridad}</p>
          <p><strong>Tipo de mantenimiento:</strong> ${workOrder.tipoMantenimiento}</p>
          <p><strong>Fecha de solicitud:</strong> ${workOrder.fechaSolicitud}</p>
          <p><strong>Fecha de inicio:</strong> ${workOrder.fechaInicio ?? '---'}</p>
          <p><strong>Fecha de cierre:</strong> ${workOrder.fechaCierre ?? '---'}</p>
          <p><strong>Descripción:</strong> ${workOrder.descripcion}</p>
          <p><strong>Precio interno:</strong> $${workOrder.precioInterno ?? 0}</p>
          <p><strong>Precio externo:</strong> $${workOrder.precioExterno ?? 0}</p>
          <p><strong>Precio total:</strong> $${workOrder.precioTotal ?? 0}</p>

          <h2>Camión</h2>
          <p><strong>Placa:</strong> ${workOrder.truck?.codigo_maquina ?? 'N/A'}</p>
          <p><strong>Marca:</strong> ${workOrder.truck?.marca ?? 'N/A'}</p>

          <h2>Operador</h2>
          <p><strong>Nombre:</strong> ${workOrder.operator?.nombreO ?? 'N/A'}</p>

          <h2>Productos Usados</h2>
          <table>
            <tr>
              <th>Nombre</th>
              <th>Cantidad</th>
              <th>Precio</th>
            </tr>
            ${workOrder.productos?.map(producto => `
              <tr>
                <td>${producto.nombre}</td>
                <td>${producto.cantidad}</td>
                <td>$${producto.precio}</td>
              </tr>`).join('')}
          </table>
        </body>
      </html>
    `;
  }
}

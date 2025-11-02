import { ProcessState } from '../types';

export class CanvasRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
  }

  clear(): void {
    this.ctx.fillStyle = '#f9fafb';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawProcesses(processes: ProcessState[], highlightId?: number): void {
    const radius = 35;
    const padding = 60;
    const cols = Math.ceil(Math.sqrt(processes.length));
    const rows = Math.ceil(processes.length / cols);

    const cellWidth = (this.canvas.width - 2 * padding) / cols;
    const cellHeight = (this.canvas.height - 120) / rows;

    processes.forEach((process, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      const x = padding + col * cellWidth + cellWidth / 2;
      const y = 40 + row * cellHeight + cellHeight / 2;

      let fillColor = '#e5e7eb';
      if (process.status === 'finished') {
        fillColor = '#22c55e';
      } else if (process.status === 'executing' || process.id === highlightId) {
        fillColor = '#facc15';
      } else if (process.status === 'unsafe') {
        fillColor = '#ef4444';
      }

      this.ctx.beginPath();
      this.ctx.arc(x, y, radius, 0, Math.PI * 2);
      this.ctx.fillStyle = fillColor;
      this.ctx.fill();
      this.ctx.strokeStyle = '#1f2937';
      this.ctx.lineWidth = 2;
      this.ctx.stroke();

      this.ctx.fillStyle = '#000';
      this.ctx.font = 'bold 18px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(`P${process.id}`, x, y);
    });
  }

  drawLegend(): void {
    const y = this.canvas.height - 40;
    const items = [
      { color: '#22c55e', label: 'Finished' },
      { color: '#facc15', label: 'Executing' },
      { color: '#ef4444', label: 'Unsafe' },
      { color: '#e5e7eb', label: 'Waiting' },
    ];

    let x = 20;
    this.ctx.font = '12px Arial';
    this.ctx.textBaseline = 'middle';

    items.forEach((item) => {
      this.ctx.fillStyle = item.color;
      this.ctx.fillRect(x, y - 8, 16, 16);
      this.ctx.strokeStyle = '#1f2937';
      this.ctx.lineWidth = 1;
      this.ctx.strokeRect(x, y - 8, 16, 16);

      this.ctx.fillStyle = '#1f2937';
      this.ctx.textAlign = 'left';
      this.ctx.fillText(item.label, x + 20, y);

      x += 120;
    });
  }

  drawText(text: string, x: number, y: number, size: number = 14, bold: boolean = false): void {
    this.ctx.fillStyle = '#1f2937';
    this.ctx.font = `${bold ? 'bold' : ''} ${size}px Arial`;
    this.ctx.textAlign = 'left';
    this.ctx.textBaseline = 'top';
    this.ctx.fillText(text, x, y);
  }
}

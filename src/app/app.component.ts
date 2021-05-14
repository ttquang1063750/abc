import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {Utils} from './Utils';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  @ViewChild('canvas', {static: true}) private canvasRef: ElementRef<HTMLCanvasElement>;
  alphabet = 'A';
  pos = {x: 0, y: 0};
  color: string;
  font: string;
  start = false;
  debounce = Utils.createDebounce(350);

  @HostListener('touchstart', ['$event'])
  @HostListener('mousedown', ['$event'])
  touchstart(event: TouchEvent | MouseEvent) {
    if(event instanceof TouchEvent) {
      this.setPosition(event.touches[0]);
    }else {
      this.setPosition(event)
    }
  }

  @HostListener('touchmove', ['$event'])
  @HostListener('mousemove', ['$event'])
  touchmove(event: TouchEvent | MouseEvent) {
    if(event instanceof TouchEvent) {
      this.draw(event.touches[0]);
    }else {
      this.draw(event)
    }
  }

  @HostListener('touchend')
  @HostListener('mouseup')
  touchend() {
    this.leave();
  }

  constructor() {
    document.addEventListener('keypress', (event: KeyboardEvent) => {
      this.alphabet = event.key.toUpperCase();
      this.drawAlphabet();
    });
  }

  ngOnInit(): void {
    Utils.fetchFont(() => {
      this.changeColorAndFont();
      this.resize();
    });
  }

  changeColorAndFont(): void {
    this.color = Utils.getRandomColor();
    this.font = Utils.getRandomFont();
    Utils.setCssVariable('color', this.color);
    Utils.setCssVariable('color-contrast', Utils.getContrast(this.color));
    Utils.setCssVariable('font', this.font);
  }

  resize() {
    this.debounce(() => {
      this.ctx.canvas.width = window.innerWidth;
      this.ctx.canvas.height = window.innerHeight;
      this.clear();
      this.drawAlphabet();
    });
  }

  clear(): void {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }

  drawAlphabet() {
    this.clear();
    this.changeColorAndFont();
    this.ctx.save();
    const fontSize = Math.floor(this.ctx.canvas.height * 2 / 3);
    this.ctx.font = `${fontSize}px ${this.font}`;
    this.ctx.textAlign = 'center';
    this.ctx.fillStyle = this.color;
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(this.alphabet, this.ctx.canvas.width / 2, this.ctx.canvas.height / 2);
    this.ctx.restore();
    this.textToSpeech();
  }

  textToSpeech(): void {
    const msg = new SpeechSynthesisUtterance(this.alphabet);
    speechSynthesis.cancel();
    speechSynthesis.speak(msg);
  }

  setPosition(e: {clientX: number, clientY: number}) {
    this.pos.x = e.clientX;
    this.pos.y = e.clientY;
    this.start = true;
  }

  draw(e: {clientX: number, clientY: number}) {
    if(!this.start) return;
    this.ctx.beginPath();

    this.ctx.lineWidth = 5;
    this.ctx.lineCap = 'round';
    this.ctx.strokeStyle = this.color;

    this.ctx.moveTo(this.pos.x, this.pos.y);
    this.setPosition(e);
    this.ctx.lineTo(this.pos.x, this.pos.y);

    this.ctx.stroke();
  }

  leave(): void {
    this.start = false;
  }

  get ctx(): CanvasRenderingContext2D {
    return this.canvasRef.nativeElement.getContext('2d')!;
  }
}

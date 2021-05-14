import { Directive, ElementRef, EventEmitter, OnInit, Output, OnDestroy } from '@angular/core';
import { ResizeSensor } from 'css-element-queries';
import { ResizedEvent } from './resized-event';

@Directive({
  selector: '[resized],[resizedWidth],[resizedHeight]',
})
export class ResizedDirective implements OnInit, OnDestroy {
  @Output()
  readonly resized = new EventEmitter<ResizedEvent>();

  @Output()
  readonly resizedWidth = new EventEmitter<ResizedEvent>();

  @Output()
  readonly resizedHeight = new EventEmitter<ResizedEvent>();

  private oldWidth: number;
  private oldHeight: number;

  private resizeSensor: ResizeSensor;

  constructor(private readonly element: ElementRef) {}

  ngOnInit(): void {
    // only initialize resize watching if sensor is availablei
    if (ResizeSensor) {
      this.resizeSensor = new ResizeSensor(this.element.nativeElement, () => this.onResized());
    }
  }

  ngOnDestroy(): void {
    if (this.resizeSensor) {
      this.resizeSensor.detach();
    }
  }

  private onResized(): void {
    const newWidth = this.element.nativeElement.clientWidth as number;
    const newHeight = this.element.nativeElement.clientHeight as number;

    if (newWidth === this.oldWidth && newHeight === this.oldHeight) {
      return;
    }

    const event = new ResizedEvent(
      this.element,
      newWidth,
      newHeight,
      this.oldWidth,
      this.oldHeight
    );

    this.oldWidth = this.element.nativeElement.clientWidth as number;
    this.oldHeight = this.element.nativeElement.clientHeight as number;

    if (event.newWidth !== event.oldWidth && event.newHeight === event.oldHeight) {
      this.resizedWidth.emit(event);
    }

    if (event.newWidth === event.oldWidth && event.newHeight !== event.oldHeight) {
      this.resizedHeight.emit(event);
    }

    this.resized.emit(event);
  }
}

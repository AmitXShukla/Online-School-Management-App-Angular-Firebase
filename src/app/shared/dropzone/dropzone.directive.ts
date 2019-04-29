import { Directive, HostListener, Output, EventEmitter } from '@angular/core';

@Directive({
    selector: '[appDropZone]'
})

export class DropZoneDirective {
    @Output() dropped = new EventEmitter<FileList>();
    @Output() hovered = new EventEmitter<boolean>();

    constructor() { }

    @HostListener('drop', ['event'])
    onDrop($event) {
        $event.preventDefault();
        this.dropped.emit($event.dataTransfer.files);
        this.hovered.emit(false);
    }

    @HostListener('dragOver', ['event'])
    ondragover($event) {
        $event.preventDefault();
        this.hovered.emit(true);
    }
    @HostListener('dragleave', ['$event'])
    onDragLeave($event) {
        $event.preventDefault();
        this.hovered.emit(false);
    }
}
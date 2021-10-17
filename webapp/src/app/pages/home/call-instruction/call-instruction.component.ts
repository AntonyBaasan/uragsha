import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-call-instruction',
  templateUrl: './call-instruction.component.html',
  styleUrls: ['./call-instruction.component.scss']
})
export class CallInstructionComponent {

  @Output() letsGo = new EventEmitter();

  constructor() { }

  go() {
    this.letsGo.emit();
  }

}

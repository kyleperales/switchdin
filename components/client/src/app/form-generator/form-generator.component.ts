import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Control } from '../devices-service';
import { CustomControl, NumberControl, SlideControl } from './custom-controls/custom-control';
import { CommonModule } from '@angular/common';
import { NumberInputComponent } from './number-input/number-input.component';

@Component({
  selector: 'app-form-generator',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NumberInputComponent],
  templateUrl: './form-generator.component.html',
  styleUrl: './form-generator.component.scss'
})
export class FormGeneratorComponent implements OnInit {

  @Input() config: Control[] = [];

  constructor() { }

  form: FormGroup = new FormGroup({});
  formControls: { [key: string]: CustomControl } = {};

  ngOnInit() {
    const group: { [key: string]: CustomControl } = {};
    if (this.config) {
      this.config.forEach(control => {
        group[control.key] = this.determineControl(control);
      });
      this.formControls = group;
      this.form = new FormGroup(group);
      console.log(group);
      console.log(this.form);
    }

    this.form.valueChanges.subscribe(value => {
      console.log(value);
    });
  }

  private determineControl(control: Control): CustomControl {
    if (control.type === 'boolean') {
      return new SlideControl(control.value);
    }
    
    return new NumberControl(control.value as number);
  }
}

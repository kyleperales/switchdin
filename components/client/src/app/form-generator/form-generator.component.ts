import { CommonModule } from '@angular/common'
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core'
import { FormGroup, ReactiveFormsModule } from '@angular/forms'
import { MatSlideToggleModule } from '@angular/material/slide-toggle'
import { Subscription } from 'rxjs'
import { IControl } from '../devices-service'
import { CustomControl, NumberControl, SlideControl } from './custom-controls/custom-control'
import { NumberInputComponent } from './number-input/number-input.component'

export interface IFormGeneratorOutput {
  [key: string]: number | boolean | null
}

@Component({
  selector: 'app-form-generator',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NumberInputComponent, MatSlideToggleModule],
  templateUrl: './form-generator.component.html',
  styleUrl: './form-generator.component.scss'
})
export class FormGeneratorComponent implements OnInit, OnDestroy, OnChanges {

  @Input() config: IControl[] = []
  @Output() onChanges = new EventEmitter<IFormGeneratorOutput>()

  private subscriptions = new Subscription()

  constructor() { }

  form: FormGroup = new FormGroup({})
  formControls: { [key: string]: CustomControl } = {}
  
  // This is a workaround to prevent the form from emitting changes when reset
  // not sure why emitEvent is not working
  private fromReset = false

  ngOnInit() {
    this.setupForm()
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['config']) {
      this.setupForm()
    }
  }

  private setupForm() {    
    const group: { [key: string]: CustomControl } = {}
    if (this.config) {
      this.config.forEach(control => {
        group[control.key] = this.determineControl(control)
      })
      this.formControls = group
      this.form = new FormGroup(group)
      console.log(group)
      console.log(this.form)
    }

    this.subscriptions.add(
      this.form.valueChanges.subscribe(value => {
        if (!this.fromReset) {
          this.onChanges.emit(value)
        }
        this.fromReset = false
      })
    )
  }

  private determineControl(control: IControl): CustomControl {
    if (control.type === 'boolean') {
      return new SlideControl(!!control.value)
        .setLabel(control.name)
    }
    
    return new NumberControl(null)
      .setLabel(control.name)
      .setInitialValue(control.value as number)
  }

  resetForm() {
    this.fromReset = true
    this.form.reset({ emitEvent: false })
  }
}

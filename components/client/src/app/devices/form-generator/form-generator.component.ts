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

  controlsForm: FormGroup = new FormGroup({})
  customControls: { [key: string]: CustomControl } = {}
  private propertiesGroup: string
  
  // This is a workaround to prevent the form from emitting changes on form reset
  // not sure why `emitEvent: false` is not working
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
        // This will use only the second part of the key
        // to avoid form group errors when the key is in the format `group.key`
        const keys = control.key.split('.')
        this.propertiesGroup = keys[0]
        group[keys[1]] = this.determineControl(control)
      })
      this.customControls = group
      this.controlsForm = new FormGroup(group)
    }

    this.subscriptions.add(
      this.controlsForm.valueChanges.subscribe(value => {
        if (!this.fromReset) {
          this.onChanges.emit(this.getChangedValues())
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
    this.controlsForm.reset({ emitEvent: false })
  }

  private getChangedValues(): IFormGeneratorOutput {
    const changes: IFormGeneratorOutput = {}
    Object.keys(this.controlsForm.controls).forEach(key => {
      const control = this.controlsForm.controls[key]
      if (control.dirty) {
        changes[`${this.propertiesGroup}.${key}`] = control.value
      }
    })
    return changes
  }
}

import { Component, forwardRef, Input } from '@angular/core'
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatInputModule } from '@angular/material/input'

@Component({
  selector: 'app-number-input',
  standalone: true,
  imports: [MatInputModule, FormsModule, MatButtonModule],
  templateUrl: './number-input.component.html',
  styleUrl: './number-input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NumberInputComponent),
      multi: true,
    },
  ],
})
export class NumberInputComponent implements ControlValueAccessor {

  private _value: number = 0
  get value() {
    return this._value
  }

  set value(value: number) {
    this._value = value
  }

  writeValue(value: number): void {
    this._value = value
  }
  
  @Input() label: string = ''
  private _initialValue: number | null = null
  @Input() set initialValue(value: number | null) {
    this._initialValue = value
  }
  get initialValue(): number | string {
    return this._initialValue === null
      ? 'NA'
      : this._initialValue
  }

  onChange = (_: any) => {}

  registerOnChange(fn: any): void {
    this.onChange = fn
  }

  registerOnTouched(fn: any): void {}

  setDisabledState(isDisabled: boolean): void {}

  onUpdate() {
    this.onChange(this.value)
  }
}

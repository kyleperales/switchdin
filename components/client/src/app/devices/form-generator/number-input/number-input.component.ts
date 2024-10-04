import { Component, forwardRef, Input } from '@angular/core'
import {
  AbstractControl,
  ControlValueAccessor,
  FormControl,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatInputModule } from '@angular/material/input'
import { TranslatePipe } from '../../../shared/translate'

@Component({
  selector: 'app-number-input',
  standalone: true,
  imports: [MatInputModule, FormsModule, MatButtonModule, ReactiveFormsModule, TranslatePipe],
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

  formControl = new FormControl('', [Validators.min(0), this.numberOnlyValidator()])

  get isUpdateDisabled() {
    return this.formControl.value === this.initialValue.toLocaleString() || this.formControl.invalid
  }

  writeValue(value: number): void {
    this.formControl.setValue(value?.toString())
  }
  
  @Input() label: string = ''
  private _initialValue: number | null = null
  @Input() set initialValue(value: number | null) {
    this._initialValue = value
  }
  get initialValue(): number | string {
    return this._initialValue === null
      ? ''
      : this._initialValue
  }

  onChange = (_: any) => {}

  registerOnChange(fn: any): void {
    this.onChange = fn
  }

  registerOnTouched(fn: any): void {}

  setDisabledState(isDisabled: boolean): void {}

  onUpdate() {
    this.onChange(this.formControl.value)
  }
  
  numberOnlyValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const isValid = /^[0-9]*\.?[0-9]+$/.test(control.value)
      return isValid ? null : { numberOnly: true }
    }
  }
}

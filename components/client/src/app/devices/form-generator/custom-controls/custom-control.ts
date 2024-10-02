import { FormControl } from '@angular/forms'

export enum ControlType {
  BOOLEAN = 'boolean',
  NUMBER = 'number'
}

export interface ICustomControl {
  type: ControlType
  label: string
  initialValue: number | null
}

export class CustomControl extends FormControl implements ICustomControl {
  type = ControlType.BOOLEAN
  label: string = ''
  initialValue: number | null = null

  constructor(formState?: any, validatorOrOpts?: any) {
    super(formState, validatorOrOpts)
  }

  setLabel(value: string) {
    this.label = value
    return this
  }

  getLabel(): string {
    return this.label
  }

  setInitialValue(value: number | null) {
    this.initialValue = value
    return this
  }

  getInitialValue(): number | null {
    return this.initialValue
  }
}

export class SlideControl extends CustomControl {
  constructor(formState?: any, validatorOrOpts?: any) {
    super(formState, validatorOrOpts)
  }
}

export class NumberControl extends CustomControl {
  override type = ControlType.NUMBER

  constructor(formState: number | null, validatorOrOpts?: any) {
    super(null, validatorOrOpts)
    this.initialValue = formState
  }
}
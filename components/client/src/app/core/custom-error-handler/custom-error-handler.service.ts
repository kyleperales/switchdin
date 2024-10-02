import { ErrorHandler, Injectable, NgZone } from '@angular/core'
import { MatSnackBar } from '@angular/material/snack-bar'

@Injectable()
export class CustomErrorHandlerService implements ErrorHandler {

  constructor(private snackBar: MatSnackBar, private zone: NgZone) { }
  
  handleError(error: any): void {
    this.zone.run(() => {
      this.snackBar.open('Something went wrong.', 'Close', {
        duration: 5000,
        panelClass: 'error-snackbar'
      })
    })

    console.warn('Error from custom error handler: ', error)
  }
}

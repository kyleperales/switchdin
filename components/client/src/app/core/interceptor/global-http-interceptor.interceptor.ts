import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { catchError, Observable, throwError } from 'rxjs'

@Injectable()
export class GlobalHttpErrorHandler implements HttpInterceptor {
  constructor() { }

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      catchError(err => {
        console.log('Error from global http interceptor.', err)
        return throwError(() => {
          return err
        })
      })
    )
  }
}

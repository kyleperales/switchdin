import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http'
import { ApplicationConfig, ErrorHandler } from '@angular/core'
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'
import { provideRouter } from '@angular/router'
import { provideCharts, withDefaultRegisterables } from 'ng2-charts'
import { routes } from './app.routes'
import { CustomErrorHandlerService } from './core/custom-error-handler/custom-error-handler.service'
import { GlobalHttpErrorHandler } from './core/interceptor/global-http-interceptor.interceptor'

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideAnimationsAsync('noop'),
    provideCharts(withDefaultRegisterables()),
    {
      provide: ErrorHandler,
      useClass: CustomErrorHandlerService
    }, {
      provide: HTTP_INTERCEPTORS,
      useClass: GlobalHttpErrorHandler,
      multi: true
    }
  ]
}

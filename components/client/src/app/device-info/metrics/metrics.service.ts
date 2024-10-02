import { Injectable } from '@angular/core'
import { env } from '../../../environment'
import { webSocket } from 'rxjs/webSocket'

enum WebSocketType {
  subscribe = 'subscribe',
  unsubscribe = 'unsubscribe'
}

@Injectable({
 providedIn: 'root',
})
export class MetricsService {
  private webSocketSubject = webSocket(env.webSocketUrl)
  webSocket$ = this.webSocketSubject.asObservable()

  constructor() { }

  subscribe(deviceId: string) {
    this.webSocketSubject.next({ type: WebSocketType.subscribe, deviceId })
  }

  unsubscribe(deviceId: string) {
    this.webSocketSubject.next({ type: WebSocketType.unsubscribe, deviceId })
    this.webSocketSubject.complete()
  }
}
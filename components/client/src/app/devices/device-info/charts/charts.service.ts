import { Injectable } from '@angular/core'
import { webSocket } from 'rxjs/webSocket'
import { env } from '../../../../environment'

enum WebSocketType {
  subscribe = 'subscribe',
  unsubscribe = 'unsubscribe'
}

export interface IWebSocketMetric {
  metric: string
  value: number
}

export interface IWebSocketData {
  devideId: string
  measurements: IWebSocketMetric[]
}

@Injectable({
 providedIn: 'root',
})
export class ChartsService {
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
import { Injectable } from '@angular/core'
import { BehaviorSubject, delay, filter } from 'rxjs'
import { Actions, IStatus, StatusState } from './status.model'

@Injectable({
  providedIn: 'root'
})
export class StatusService {

  constructor() {
    this.onInit()
  }

  private statusSubject = new BehaviorSubject<IStatus[]>([])
  public status$ = this.statusSubject.asObservable()

  get status() {
    return this.statusSubject.value
  }
  set status(status: IStatus[]) {
    this.statusSubject.next(status)
  }

  onInit() {
    this.status$
      .pipe(
        filter(e => e.length > 0),
        filter(e => e.every(status => status.state !== StatusState.Pending)),
        delay(2000)
      )
      .subscribe(e => {
        this.clearStatus()
      })
  }

  setStatus(status: IStatus[]) {
    this.status = status
  }
  
  getStatus(): IStatus[] {
    return this.status
  }

  updateStatus(id: Actions, state: StatusState) {    
    this.status = this.status.map(status => {
      if (status.id === id) {
        return {
          ...status,
          state
        }
      }
      return status
    })
  }

  clearStatus() {
    this.status = []
  }
}

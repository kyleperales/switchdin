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
  private statusMap: Map<Actions, IStatus>

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
    this.statusSubject.next(status)
    this.statusMap = status.reduce((acc, status) => {
      acc.set(status.id, status)
      return acc
    }, new Map())
  }

  updateStatus(id: Actions, state: StatusState) {
    if (!this.statusMap?.size) {
      return
    }

    const selectedStatus = this.statusMap.get(id)
    if (selectedStatus) {
      selectedStatus.state = state
      this.statusMap.set(id, selectedStatus)
      const updatedStatuses = Array.from(this.statusMap.values())
      this.statusSubject.next(updatedStatuses)
    } else {
      console.error('Status not found')
    }
  }

  clearStatus() {
    this.statusSubject.next([])
    this.statusMap.clear()
  }

  destroy() {
    this.statusSubject.complete()
  }
}

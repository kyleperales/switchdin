import { Component, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { RouterOutlet } from '@angular/router'
import { Subscription } from 'rxjs'
import { StatusComponent, StatusService } from './core/status'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, StatusComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'switchdin-ui'
  
  constructor(
    private statusService: StatusService,
    private dialog: MatDialog
  ) { }

  statusOpen = false

  subscriptions = new Subscription()

  ngOnInit(): void {
    this.subscriptions.add(
      this.statusService.status$
        .subscribe(status => {
          if (status && status.length && this.statusOpen === false) {
            this.dialog.open(StatusComponent, { disableClose: true })
            this.statusOpen = true
          }
          if (!status.length && this.statusOpen === true) {
            this.dialog.closeAll()
            this.statusOpen = false
          }
      })
    )
  }
}

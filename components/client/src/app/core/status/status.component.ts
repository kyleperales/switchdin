import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { StatusState } from './status.model'
import { StatusService } from './status.service'
import { TranslatePipe } from '../../shared/translate'

@Component({
  selector: 'app-status',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, CommonModule, TranslatePipe],
  templateUrl: './status.component.html',
  styleUrl: './status.component.scss'
})
export class StatusComponent {

  constructor(
    private statusService: StatusService
  ) { }

  status$ = this.statusService.status$
  states = StatusState
}

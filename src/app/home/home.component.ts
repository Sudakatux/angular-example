import { Component } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { ConductorService } from '../services/conductor.service';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatInputModule, MatFormFieldModule, FormsModule, MatButtonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  userId = 'someUser';

  constructor(private conductor: ConductorService, private router: Router) {}

  startPacket() {
    this.conductor.startAPacket(this.userId).then((executionId) => {
      this.router.navigate([`/packet`, executionId]);
    });
  }
}

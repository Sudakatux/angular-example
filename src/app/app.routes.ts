import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PacketComponent } from './packet/packet.component';

export const routes: Routes = [
    { path: '', component: HomeComponent  },
    { path: 'packet/:executionId', component: PacketComponent  }
];

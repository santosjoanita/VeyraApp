import { Component } from '@angular/core';
import {RouterLink} from '@angular/router';
import { Location } from '@angular/common';

import { Sidebar } from '../../../core/components/sidebar/sidebar'; 
import { Header } from '../../../core/components/header/header';

@Component({
  selector: 'app-not-permitted',
  standalone: true,
  imports: [RouterLink, Sidebar, Header],
  templateUrl: './not-permitted.html',
  styleUrls: ['./not-permitted.css', '../../../../assets/themes/variables.css']
})
export class NotPermitted {
  constructor(private location: Location) {}

  goBack(): void {
    this.location.back();
  }
}

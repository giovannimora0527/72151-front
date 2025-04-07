import { Component, OnInit } from '@angular/core';
import { PrestamosService } from './service/prestamos.service';

@Component({
  selector: 'app-prestamos',
  templateUrl: './prestamos.component.html',
  styleUrls: ['./prestamos.component.scss'] 
})
export class PrestamosComponent implements OnInit {

  prestamos: any[] = [];

  constructor(private prestamosService: PrestamosService) {}

  ngOnInit(): void {
    this.prestamos = this.prestamosService.getPrestamos();
  }
}
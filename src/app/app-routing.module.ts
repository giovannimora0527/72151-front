import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { UsuarioComponent } from './demo/pages/usuario/usuario.component';
<<<<<<< HEAD
=======
import { AutorComponent } from './demo/pages/autor/autor.component';
import { LibrosComponent } from './demo/pages/libros/libros.components';
import { PrestamosComponent } from './demo/pages/prestamos/prestamos.component';
>>>>>>> 267e173 (Frontend corte 2)

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full'
  },  
  {
    path: 'inicio',
    component: AdminComponent,
    data: { title: 'Inicio' },
    children: [      
<<<<<<< HEAD
      { path: 'usuarios', component: UsuarioComponent, data: { title: 'Usuarios' }}     
=======
      { path: 'usuarios', component: UsuarioComponent, data: { title: 'Usuarios' }},
      { path: 'autores', component: AutorComponent, data: { title: 'Autores' }},
      { path: 'libros', component: LibrosComponent, data: { title: 'Libros' }},
      { path: 'prestamos', component: PrestamosComponent, data: { title: 'Prestamos' }}
>>>>>>> 267e173 (Frontend corte 2)
    ]
  },
  { path: '**', redirectTo: 'inicio' }
];

@NgModule({
<<<<<<< HEAD
  imports: [RouterModule.forRoot(routes)],
=======
  imports: [RouterModule.forRoot(routes as Routes)],
>>>>>>> 267e173 (Frontend corte 2)
  exports: [RouterModule]
})
export class AppRoutingModule {}

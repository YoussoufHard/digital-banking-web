import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true, // ✅ Composant standalone
  imports: [
    CommonModule,
    RouterLink, // ✅ Nécessaire pour routerLink
    RouterLinkActive, // ✅ Pour routerLinkActive
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  // Injection des dépendances avec inject() (nouvelle syntaxe Angular)
  // private router = inject(Router); // Si besoin de navigation programmatique

  // Gestion de l'état du menu mobile
  isMenuCollapsed = true;

  // Méthode pour basculer le menu mobile
  toggleMenu() {
    this.isMenuCollapsed = !this.isMenuCollapsed;
  }
}

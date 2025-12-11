import { NgClass, NgIf } from '@angular/common';
import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/service/AuthService';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [NgIf, NgClass, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {
  sidebarOpen = true;
  isMenuOpen = false;
  nombreUsuario: string = '';
  isMenuCanchasOpen: boolean = false;

  @ViewChild('menuContainer') menuContainer!: ElementRef;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    const user = this.authService.getUser();
    console.log(user);
    if (!user || !user.data || !user.data.numDoc) {
      console.error('Usuario no encontrado o código de usuario no disponible');
      return;
    }
    this.nombreUsuario = user.data.nombres;
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  toggleCanchasMenu() {
    this.isMenuCanchasOpen = !this.isMenuCanchasOpen;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    if (this.menuContainer && !this.menuContainer.nativeElement.contains(event.target)) {
      this.isMenuOpen = false;
    }
  }

  isMobile = window.innerWidth < 768;

  @HostListener('window:resize')
  onResize() {
    this.isMobile = window.innerWidth < 768;

    // En escritorio: sidebar siempre visible
    if (!this.isMobile) {
      this.sidebarOpen = true;
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

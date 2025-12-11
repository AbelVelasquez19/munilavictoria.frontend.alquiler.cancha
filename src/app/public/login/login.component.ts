import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { NgIf } from '@angular/common';
import { MessageComponent } from '../../shared/message/message.component';
import { AuthService } from '../../core/service/AuthService';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule,LoadingComponent,NgIf, MessageComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  @ViewChild('msg') msg!: MessageComponent;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      numDocumento: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onLogin() {
    this.isLoading = true;
    if (this.loginForm.invalid) {
    this.isLoading = false;

    if (!this.loginForm.get('numDocumento')?.value) {
      this.msg.show('El campo "Usuario" es requerido.', "warning");
      return;
    }

    if (!this.loginForm.get('password')?.value) {
      this.msg.show('El campo "Contraseña" es requerido.', "warning");
      return;
    }
  }
  // Eliminar token viejo
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');

    const payload = this.loginForm.value;

    this.authService.login(payload).subscribe({
      next: (response) => {
        console.log(response);
        this.isLoading = false;
        this.authService.setSession(response.data.token, { data: response.data });
        // Redirigir al dashboard
        this.router.navigate(['/dashboard/inicio']);
      },
      error: (err) => {
        this.isLoading = false;
        if (err.error && err.error.message) {
          this.msg.show(err.error.message, "error");
        } else {
           this.msg.show('Error inesperado en el login', "error");
        }
      }
    });
  }
}

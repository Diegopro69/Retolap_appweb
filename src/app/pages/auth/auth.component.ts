import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../core/auth/auth.service';
import { UserRole } from '../../core/auth/auth.models';
import { LucideIconComponent } from '../../shared/lucide-icon/lucide-icon.component';

type AccessMode = 'login' | 'register';

interface RoleOption {
  value: UserRole;
  label: string;
  description: string;
  icon: string;
}

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [FormsModule, LucideIconComponent],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
})
export class AuthComponent implements OnInit, OnDestroy {
  readonly roleOptions: RoleOption[] = [
    {
      value: 'estudiante',
      label: 'Estudiante',
      description: 'Buscar retos, postularte y crecer tu portafolio.',
      icon: 'GraduationCap',
    },
    {
      value: 'empresa',
      label: 'Empresa',
      description: 'Publicar retos reales y encontrar talento.',
      icon: 'Building2',
    },
  ];

  mode: AccessMode = 'login';
  errorMessage = '';
  private readonly emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  private queryParamSub?: Subscription;

  loginForm = {
    email: '',
    password: '',
  };

  registerForm = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'estudiante' as UserRole,
  };

  constructor(
    private readonly auth: AuthService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.queryParamSub = this.route.queryParamMap.subscribe((params) => {
      const modeParam = params.get('mode');
      if (modeParam === 'login' || modeParam === 'register') {
        this.mode = modeParam;
      }

      const roleParam = params.get('role');
      if (roleParam === 'estudiante' || roleParam === 'empresa') {
        this.registerForm.role = roleParam;
      }
    });
  }

  ngOnDestroy(): void {
    this.queryParamSub?.unsubscribe();
  }

  setMode(mode: AccessMode): void {
    this.mode = mode;
    this.errorMessage = '';
    this.updateModeQuery();
  }

  selectRole(role: UserRole): void {
    this.registerForm.role = role;
    this.updateModeQuery();
  }

  submitLogin(): void {
    this.errorMessage = '';

    if (!this.isValidEmail(this.loginForm.email)) {
      this.errorMessage = 'Ingresa un correo valido.';
      return;
    }

    const result = this.auth.login(this.loginForm.email, this.loginForm.password);

    if (!result.ok || !result.session) {
      this.errorMessage = result.message;
      return;
    }

    this.navigateByRole(result.session.role);
  }

  submitRegister(): void {
    this.errorMessage = '';

    const cleanName = this.registerForm.name.trim();
    const cleanEmail = this.registerForm.email.trim().toLowerCase();
    const cleanPassword = this.registerForm.password.trim();
    const cleanConfirm = this.registerForm.confirmPassword.trim();

    if (!cleanName || !cleanEmail || !cleanPassword || !cleanConfirm) {
      this.errorMessage = 'Completa todos los campos para registrarte.';
      return;
    }

    if (cleanName.length < 2) {
      this.errorMessage = 'Ingresa un nombre valido.';
      return;
    }

    if (!this.isValidEmail(cleanEmail)) {
      this.errorMessage = 'Ingresa un correo valido.';
      return;
    }

    if (cleanPassword.length < 6) {
      this.errorMessage = 'La contrasena debe tener al menos 6 caracteres.';
      return;
    }

    if (cleanPassword !== cleanConfirm) {
      this.errorMessage = 'Las contrasenas no coinciden.';
      return;
    }

    const result = this.auth.register({
      name: cleanName,
      email: cleanEmail,
      password: cleanPassword,
      role: this.registerForm.role,
    });

    if (!result.ok || !result.session) {
      this.errorMessage = result.message;
      return;
    }

    this.navigateByRole(result.session.role);
  }

  goHome(): void {
    void this.router.navigateByUrl('/');
  }

  private navigateByRole(role: UserRole): void {
    void this.router.navigateByUrl(this.auth.redirectForRole(role));
  }

  private updateModeQuery(): void {
    const queryParams: Record<string, string> = {
      mode: this.mode,
    };

    if (this.mode === 'register') {
      queryParams['role'] = this.registerForm.role;
    }

    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      replaceUrl: true,
    });
  }

  private isValidEmail(email: string): boolean {
    return this.emailPattern.test(email.trim().toLowerCase());
  }
}

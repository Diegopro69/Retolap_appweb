import { Routes } from '@angular/router';
import { CompanyDashboardComponent } from './pages/company-dashboard/company-dashboard.component';
import { LandingComponent } from './pages/landing/landing.component';
import { StudentDashboardComponent } from './pages/student-dashboard/student-dashboard.component';
import { AuthComponent } from './pages/auth/auth.component';
import { guestGuard } from './core/auth/guards/guest.guard';
import { roleGuard } from './core/auth/guards/role.guard';

export const routes: Routes = [
	{ path: '', component: LandingComponent },
	{ path: 'acceso', component: AuthComponent, canActivate: [guestGuard] },
	{ path: 'estudiante', component: StudentDashboardComponent, canActivate: [roleGuard('estudiante')] },
	{ path: 'empresa', component: CompanyDashboardComponent, canActivate: [roleGuard('empresa')] },
	{ path: '**', redirectTo: '' },
];

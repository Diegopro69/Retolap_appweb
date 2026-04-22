import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LucideIconComponent } from '../../shared/lucide-icon/lucide-icon.component';
import { UserRole } from '../../core/auth/auth.models';

type AccessMode = 'login' | 'register';
type LandingSectionId = 'como-funciona' | 'explorar-retos' | 'para-empresas';

interface FeaturedChallenge {
  id: number;
  title: string;
  company: string;
  industry: string;
  reward: string;
  level: string;
  deadline: string;
  color: string;
  icon: string;
}

interface StepItem {
  number: string;
  icon: string;
  title: string;
  description: string;
}

interface StatItem {
  value: string;
  label: string;
}

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [LucideIconComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css',
})
export class LandingComponent {
  readonly heroImage =
    'https://images.unsplash.com/photo-1762951566442-af07db89ab1c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMHRlY2hub2xvZ3klMjBnZW9tZXRyaWMlMjBncmFkaWVudCUyMGJsdWV8ZW58MXx8fHwxNzcyMDY0NjE2fDA&ixlib=rb-4.1.0&q=80&w=1080';

  readonly featuredChallenges: FeaturedChallenge[] = [
    {
      id: 1,
      title: 'Estrategia de Growth Hacking para SaaS B2B',
      company: 'TechFlow',
      industry: 'Tecnologia',
      reward: '$1,200',
      level: 'Intermedio',
      deadline: '12 dias',
      color: '#00C9A7',
      icon: 'TrendingUp',
    },
    {
      id: 2,
      title: 'Rediseno de experiencia de usuario en app movil',
      company: 'FinNova',
      industry: 'Fintech',
      reward: '$800',
      level: 'Basico',
      deadline: '7 dias',
      color: '#6366F1',
      icon: 'Sparkles',
    },
    {
      id: 3,
      title: 'Modelo de expansion para mercados LATAM',
      company: 'LogiCorp',
      industry: 'Logistica',
      reward: '$2,000',
      level: 'Avanzado',
      deadline: '20 dias',
      color: '#F59E0B',
      icon: 'Globe',
    },
    {
      id: 4,
      title: 'Pipeline de datos para analisis de clientes',
      company: 'DataSense',
      industry: 'Data & AI',
      reward: '$1,500',
      level: 'Intermedio',
      deadline: '15 dias',
      color: '#EC4899',
      icon: 'Code2',
    },
  ];

  readonly steps: StepItem[] = [
    {
      number: '01',
      icon: 'Target',
      title: 'Explora retos reales',
      description:
        'Navega por decenas de desafios publicados por empresas lideres en tecnologia, fintech, marketing y mas.',
    },
    {
      number: '02',
      icon: 'Lightbulb',
      title: 'Postulate y resuelve',
      description:
        'Envia tu propuesta, trabaja en equipo o de forma individual, y desarrolla soluciones con impacto real.',
    },
    {
      number: '03',
      icon: 'Trophy',
      title: 'Gana y crece',
      description:
        'Recibe recompensas economicas, reconocimiento y oportunidades laborales directas con las empresas.',
    },
  ];

  readonly companies = ['TechFlow', 'FinNova', 'DataSense', 'LogiCorp', 'GreenAI', 'CloudX'];

  readonly stats: StatItem[] = [
    { value: '2,400+', label: 'Estudiantes activos' },
    { value: '180+', label: 'Empresas registradas' },
    { value: '950+', label: 'Retos completados' },
    { value: '$320K', label: 'Recompensas pagadas' },
  ];

  readonly menuItems = ['Como funciona', 'Explorar retos', 'Para empresas'];
  private readonly menuSections: Record<string, LandingSectionId> = {
    'Como funciona': 'como-funciona',
    'Explorar retos': 'explorar-retos',
    'Para empresas': 'para-empresas',
  };

  mobileMenuOpen = false;

  constructor(private readonly router: Router) {}

  openAccess(mode: AccessMode, role?: UserRole): void {
    this.mobileMenuOpen = false;

    const queryParams: Record<string, string> = {
      mode,
    };

    if (role) {
      queryParams['role'] = role;
    }

    void this.router.navigate(['/acceso'], { queryParams });
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  navigateMenu(item: string): void {
    this.mobileMenuOpen = false;

    const targetSection = this.menuSections[item];

    if (!targetSection) {
      return;
    }

    this.scrollToSection(targetSection);
  }

  private scrollToSection(sectionId: LandingSectionId): void {
    if (typeof document === 'undefined') {
      return;
    }

    const section = document.getElementById(sectionId);
    section?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

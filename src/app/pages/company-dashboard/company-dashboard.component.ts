import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LucideIconComponent } from '../../shared/lucide-icon/lucide-icon.component';
import { AuthService } from '../../core/auth/auth.service';

type CompanyNavPath = 'dashboard' | 'retos' | 'postulaciones' | 'analiticas' | 'config';

interface CompanyNavItem {
  icon: string;
  label: string;
  path: CompanyNavPath;
}

interface CompanyNotificationItem {
  id: number;
  title: string;
  description: string;
  time: string;
  read: boolean;
  targetNav: CompanyNavPath;
}

interface PublishedChallenge {
  id: number;
  title: string;
  industry: string;
  reward: string;
  status: 'Abierto' | 'En revision' | 'Cerrado';
  applicants: number;
  deadline: string;
  published: string;
  icon: string;
  color: string;
  views: number;
  winner?: string;
}

interface TopApplicant {
  name: string;
  university: string;
  challenge: string;
  score: number;
  avatar: string;
  color: string;
}

interface MetricItem {
  label: string;
  value: string;
  change: string;
  up: boolean | null;
  color: string;
  bg: string;
  icon: string;
}

interface StatusVisual {
  color: string;
  bg: string;
  dot: string;
}

interface ChallengeForm {
  title: string;
  description: string;
  industry: string;
  level: string;
  reward: string;
  deadline: string;
}

interface BasicField {
  label: string;
  value: string;
}

@Component({
  selector: 'app-company-dashboard',
  standalone: true,
  imports: [LucideIconComponent],
  templateUrl: './company-dashboard.component.html',
  styleUrl: './company-dashboard.component.css',
})
export class CompanyDashboardComponent {
  private readonly mobileBreakpoint = 768;

  readonly companyNavItems: CompanyNavItem[] = [
    { icon: 'Home', label: 'Dashboard', path: 'dashboard' },
    { icon: 'Target', label: 'Mis retos', path: 'retos' },
    { icon: 'Users', label: 'Postulaciones', path: 'postulaciones' },
    { icon: 'BarChart3', label: 'Analiticas', path: 'analiticas' },
    { icon: 'Settings', label: 'Configuracion', path: 'config' },
  ];

  readonly publishedChallenges: PublishedChallenge[] = [
    {
      id: 1,
      title: 'Estrategia de Growth Hacking para SaaS B2B',
      industry: 'Tecnologia',
      reward: '$1,200',
      status: 'Abierto',
      applicants: 34,
      deadline: '12 dias restantes',
      published: '15 feb 2026',
      icon: 'TrendingUp',
      color: '#00C9A7',
      views: 289,
    },
    {
      id: 2,
      title: 'Rediseno UX de app de pagos moviles',
      industry: 'Fintech',
      reward: '$800',
      status: 'En revision',
      applicants: 21,
      deadline: 'Cerrado',
      published: '8 feb 2026',
      icon: 'Sparkles',
      color: '#6366F1',
      views: 174,
    },
    {
      id: 3,
      title: 'Modelo de expansion para mercados LATAM',
      industry: 'Logistica',
      reward: '$2,000',
      status: 'Abierto',
      applicants: 12,
      deadline: '20 dias restantes',
      published: '20 feb 2026',
      icon: 'Globe',
      color: '#F59E0B',
      views: 96,
    },
    {
      id: 4,
      title: 'Pipeline de datos para analisis de clientes',
      industry: 'Data & AI',
      reward: '$1,500',
      status: 'Cerrado',
      applicants: 18,
      deadline: 'Finalizado',
      published: '1 feb 2026',
      icon: 'Code2',
      color: '#EC4899',
      views: 312,
      winner: 'Laura Gomez',
    },
    {
      id: 5,
      title: 'Plan de marketing de contenidos B2C',
      industry: 'Marketing',
      reward: '$600',
      status: 'Cerrado',
      applicants: 45,
      deadline: 'Finalizado',
      published: '25 ene 2026',
      icon: 'Briefcase',
      color: '#22C55E',
      views: 421,
      winner: 'Carlos Ruiz',
    },
  ];

  readonly topApplicants: TopApplicant[] = [
    {
      name: 'Laura Gomez',
      university: 'Tec de Monterrey',
      challenge: 'Pipeline de datos',
      score: 9.4,
      avatar: 'LG',
      color: '#00C9A7',
    },
    {
      name: 'Carlos Ruiz',
      university: 'UNAM',
      challenge: 'Plan marketing',
      score: 8.9,
      avatar: 'CR',
      color: '#6366F1',
    },
    {
      name: 'Sofia Torres',
      university: 'ITAM',
      challenge: 'Growth Hacking',
      score: 8.7,
      avatar: 'ST',
      color: '#F59E0B',
    },
    {
      name: 'Andres Lopez',
      university: 'UP',
      challenge: 'Rediseno UX',
      score: 8.2,
      avatar: 'AL',
      color: '#EC4899',
    },
  ];

  readonly metrics: MetricItem[] = [
    {
      label: 'Retos activos',
      value: '2',
      change: '+1 este mes',
      up: true,
      color: '#00C9A7',
      bg: '#F0FDF9',
      icon: 'Target',
    },
    {
      label: 'Postulaciones recibidas',
      value: '130',
      change: '+34 esta semana',
      up: true,
      color: '#6366F1',
      bg: '#EEF2FF',
      icon: 'Users',
    },
    {
      label: 'Retos finalizados',
      value: '2',
      change: '2 ganadores elegidos',
      up: null,
      color: '#F59E0B',
      bg: '#FFFBEB',
      icon: 'CheckCircle2',
    },
    {
      label: 'Inversion total',
      value: '$6,100',
      change: 'En recompensas pagadas',
      up: null,
      color: '#EC4899',
      bg: '#FDF2F8',
      icon: 'DollarSign',
    },
  ];

  readonly statusConfig: Record<PublishedChallenge['status'], StatusVisual> = {
    Abierto: { color: '#16A34A', bg: '#F0FDF4', dot: '#22C55E' },
    'En revision': { color: '#D97706', bg: '#FFFBEB', dot: '#F59E0B' },
    Cerrado: { color: '#475569', bg: '#F1F5F9', dot: '#94A3B8' },
  };

  readonly industries = [
    'Tecnologia',
    'Fintech',
    'Logistica',
    'Data & AI',
    'Marketing',
    'Cloud',
    'Sostenibilidad',
  ];

  readonly levels = ['Basico', 'Intermedio', 'Avanzado'];

  readonly activityFeed = [
    {
      text: '34 nuevas postulaciones al reto de Growth Hacking',
      time: 'Hace 2h',
      dot: '#00C9A7',
    },
    {
      text: "Reto 'Pipeline de datos' finalizado",
      time: 'Hace 1 dia',
      dot: '#6366F1',
    },
    {
      text: 'Nuevo reto publicado: Expansion LATAM',
      time: 'Hace 3 dias',
      dot: '#F59E0B',
    },
  ];

  notifications: CompanyNotificationItem[] = [
    {
      id: 1,
      title: 'Nuevo pico de postulaciones',
      description: 'Tu reto de Growth Hacking recibio 12 postulaciones nuevas.',
      time: 'Hace 35 min',
      read: false,
      targetNav: 'postulaciones',
    },
    {
      id: 2,
      title: 'Recordatorio de cierre',
      description: 'El reto Expansion LATAM cierra en 2 dias.',
      time: 'Hace 2h',
      read: false,
      targetNav: 'retos',
    },
    {
      id: 3,
      title: 'Recomendacion de analitica',
      description: 'Actualiza tu perfil de empresa para mejorar conversion.',
      time: 'Ayer',
      read: true,
      targetNav: 'config',
    },
  ];

  activeNav: CompanyNavPath = 'dashboard';
  showCreateModal = false;
  sidebarOpen = false;
  desktopSidebarCollapsed = false;
  isMobileView = false;
  modalError = '';
  notificationsOpen = false;
  profileMenuOpen = false;

  modalStep = 1;
  challengeForm: ChallengeForm = this.getEmptyChallengeForm();

  constructor(
    private readonly router: Router,
    private readonly auth: AuthService,
  ) {
    this.updateViewportState();
  }

  get showDesktopSidebar(): boolean {
    return !this.isMobileView && !this.desktopSidebarCollapsed;
  }

  get showMobileSidebar(): boolean {
    return this.isMobileView && this.sidebarOpen;
  }

  get currentCompanyName(): string {
    return this.auth.session()?.name ?? 'Mi empresa';
  }

  get currentCompanyEmail(): string {
    return this.auth.session()?.email ?? 'contacto@retolab.app';
  }

  get currentCompanyInitials(): string {
    return this.buildInitials(this.currentCompanyName);
  }

  get unreadNotificationsCount(): number {
    return this.notifications.filter((notification) => !notification.read).length;
  }

  get hasUnreadNotifications(): boolean {
    return this.unreadNotificationsCount > 0;
  }

  get allNotificationsRead(): boolean {
    return this.unreadNotificationsCount === 0;
  }

  get sortedNotifications(): CompanyNotificationItem[] {
    return [...this.notifications].sort((a, b) => Number(a.read) - Number(b.read));
  }

  get companyProfilePercent(): number {
    const values = this.configFields.map((field) => field.value.trim());
    const completed = values.filter((value) => value.length > 0).length;
    return Math.round((completed / values.length) * 100);
  }

  get configFields(): BasicField[] {
    return [
      { label: 'Nombre de la empresa', value: this.currentCompanyName },
      { label: 'Industria principal', value: 'Tecnologia / SaaS' },
      { label: 'Sitio web', value: 'www.retocompany.com' },
      { label: 'Plan activo', value: 'Enterprise - Renovacion feb 2027' },
      { label: 'Correo de contacto', value: this.currentCompanyEmail },
    ];
  }

  goHome(): void {
    void this.router.navigateByUrl('/');
  }

  logout(): void {
    this.auth.logout();
    this.sidebarOpen = false;
    this.closeFloatingPanels();

    void this.router.navigate(['/acceso'], {
      queryParams: { mode: 'login' },
    });
  }

  setActiveNav(path: CompanyNavPath): void {
    this.activeNav = path;
    this.sidebarOpen = false;
    this.closeFloatingPanels();
  }

  toggleSidebar(): void {
    if (this.isMobileView) {
      this.sidebarOpen = !this.sidebarOpen;
    } else {
      this.desktopSidebarCollapsed = !this.desktopSidebarCollapsed;
    }

    this.closeFloatingPanels();
  }

  openSidebar(): void {
    if (this.isMobileView) {
      this.sidebarOpen = true;
    } else {
      this.desktopSidebarCollapsed = false;
    }

    this.closeFloatingPanels();
  }

  closeSidebar(): void {
    this.sidebarOpen = false;
  }

  onWindowResize(): void {
    this.updateViewportState();
  }

  toggleNotificationsPanel(): void {
    this.notificationsOpen = !this.notificationsOpen;
    this.sidebarOpen = false;

    if (this.notificationsOpen) {
      this.profileMenuOpen = false;
    }
  }

  toggleProfileMenu(): void {
    this.profileMenuOpen = !this.profileMenuOpen;
    this.sidebarOpen = false;

    if (this.profileMenuOpen) {
      this.notificationsOpen = false;
    }
  }

  closeFloatingPanels(): void {
    this.notificationsOpen = false;
    this.profileMenuOpen = false;
  }

  markAllNotificationsAsRead(): void {
    if (this.allNotificationsRead) {
      return;
    }

    this.notifications = this.notifications.map((notification) => ({
      ...notification,
      read: true,
    }));
  }

  openNotification(notificationId: number): void {
    const notification = this.notifications.find((item) => item.id === notificationId);

    if (!notification) {
      return;
    }

    this.notifications = this.notifications.map((item) => {
      if (item.id === notificationId) {
        return {
          ...item,
          read: true,
        };
      }

      return item;
    });

    this.setActiveNav(notification.targetNav);
  }

  onWindowKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Escape') {
      return;
    }

    if (this.showCreateModal) {
      this.closeCreateModal();
      return;
    }

    if (this.notificationsOpen || this.profileMenuOpen) {
      this.closeFloatingPanels();
      return;
    }

    if (this.sidebarOpen) {
      this.closeSidebar();
    }
  }

  openCreateModal(): void {
    this.showCreateModal = true;
    this.modalStep = 1;
    this.modalError = '';
    this.closeFloatingPanels();
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
    this.modalStep = 1;
    this.modalError = '';
    this.challengeForm = this.getEmptyChallengeForm();
  }

  nextModalStep(): void {
    this.modalError = '';

    if (this.modalStep === 1) {
      if (!this.challengeForm.title.trim() || !this.challengeForm.description.trim() || !this.challengeForm.industry) {
        this.modalError = 'Completa titulo, descripcion e industria para continuar.';
        return;
      }

      this.modalStep = 2;
      return;
    }

    const rewardValue = Number(this.challengeForm.reward);
    if (!this.challengeForm.reward || !Number.isFinite(rewardValue) || rewardValue <= 0) {
      this.modalError = 'Ingresa una recompensa valida mayor a 0.';
      return;
    }

    if (!this.challengeForm.deadline) {
      this.modalError = 'Selecciona una fecha limite.';
      return;
    }

    this.closeCreateModal();
  }

  prevModalStep(): void {
    this.modalStep = 1;
    this.modalError = '';
  }

  updateFormField(field: keyof ChallengeForm, event: Event): void {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    this.challengeForm = {
      ...this.challengeForm,
      [field]: target.value,
    };
  }

  getNavTitle(): string {
    if (this.activeNav === 'dashboard') {
      return 'Dashboard empresa';
    }

    if (this.activeNav === 'retos') {
      return 'Mis retos';
    }

    if (this.activeNav === 'postulaciones') {
      return 'Postulaciones';
    }

    if (this.activeNav === 'analiticas') {
      return 'Analiticas';
    }

    return 'Configuracion';
  }

  private getEmptyChallengeForm(): ChallengeForm {
    return {
      title: '',
      description: '',
      industry: '',
      level: 'Intermedio',
      reward: '',
      deadline: '',
    };
  }

  private buildInitials(name: string): string {
    const parts = name
      .trim()
      .split(/\s+/)
      .filter((part) => part.length > 0);

    if (parts.length === 0) {
      return 'EM';
    }

    const first = parts[0].charAt(0);
    const second = parts.length > 1 ? parts[1].charAt(0) : '';

    return `${first}${second}`.toUpperCase();
  }

  private updateViewportState(): void {
    if (typeof window === 'undefined') {
      return;
    }

    this.isMobileView = window.innerWidth < this.mobileBreakpoint;

    if (!this.isMobileView) {
      this.sidebarOpen = false;
    }
  }
}

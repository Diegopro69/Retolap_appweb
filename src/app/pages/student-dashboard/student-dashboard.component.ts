import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LucideIconComponent } from '../../shared/lucide-icon/lucide-icon.component';
import { AuthService } from '../../core/auth/auth.service';

type StudentNavPath = 'inicio' | 'retos' | 'postulaciones' | 'perfil';

type EditableProfileField = 'university' | 'major' | 'semester' | 'city' | 'bio';

interface ChallengeItem {
  id: number;
  title: string;
  company: string;
  companyInitial: string;
  industry: string;
  reward: string;
  level: string;
  deadline: string;
  applicants: number;
  color: string;
  icon: string;
  status: string;
  description: string;
  tags: string[];
}

interface ApplicationItem {
  id: number;
  title: string;
  company: string;
  reward: string;
  status: string;
  statusColor: string;
  statusBg: string;
  submittedAt: string;
  submittedDate: string;
  summary: string;
  focus: string[];
  nextStep: string;
  companyFeedback: string;
}

interface NavItem {
  icon: string;
  label: string;
  path: StudentNavPath;
}

interface QuickStat {
  label: string;
  value: string;
  icon: string;
  color: string;
}

interface ProfileField {
  label: string;
  value: string;
}

interface NotificationItem {
  id: number;
  title: string;
  description: string;
  time: string;
  read: boolean;
  targetNav: StudentNavPath;
}

interface StudentProfile {
  university: string;
  major: string;
  semester: string;
  city: string;
  bio: string;
  skills: string[];
}

type SortOption = 'Mayor recompensa' | 'Mas reciente' | 'Cierre proximo';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [LucideIconComponent],
  templateUrl: './student-dashboard.component.html',
  styleUrl: './student-dashboard.component.css',
})
export class StudentDashboardComponent {
  private readonly mobileBreakpoint = 768;

  readonly challenges: ChallengeItem[] = [
    {
      id: 1,
      title: 'Estrategia de Growth Hacking para SaaS B2B',
      company: 'TechFlow',
      companyInitial: 'T',
      industry: 'Tecnologia',
      reward: '$1,200',
      level: 'Intermedio',
      deadline: '12 dias',
      applicants: 34,
      color: '#00C9A7',
      icon: 'TrendingUp',
      status: 'open',
      description:
        'Disena una estrategia de crecimiento sostenible para una plataforma SaaS con foco en el mercado B2B de LATAM.',
      tags: ['Marketing', 'SaaS', 'Estrategia'],
    },
    {
      id: 2,
      title: 'Rediseno UX de app de pagos moviles',
      company: 'FinNova',
      companyInitial: 'F',
      industry: 'Fintech',
      reward: '$800',
      level: 'Basico',
      deadline: '7 dias',
      applicants: 21,
      color: '#6366F1',
      icon: 'Sparkles',
      status: 'open',
      description:
        'Redisena la experiencia de usuario de nuestra app de pagos para mejorar la tasa de retencion en un 25%.',
      tags: ['UX/UI', 'Mobile', 'Fintech'],
    },
    {
      id: 3,
      title: 'Modelo de expansion para mercados LATAM',
      company: 'LogiCorp',
      companyInitial: 'L',
      industry: 'Logistica',
      reward: '$2,000',
      level: 'Avanzado',
      deadline: '20 dias',
      applicants: 12,
      color: '#F59E0B',
      icon: 'Globe',
      status: 'open',
      description:
        'Propon un modelo de expansion logistica escalable para 5 paises de America Latina con analisis financiero.',
      tags: ['Logistica', 'Finanzas', 'Expansion'],
    },
    {
      id: 4,
      title: 'Pipeline de datos para analisis de clientes',
      company: 'DataSense',
      companyInitial: 'D',
      industry: 'Data & AI',
      reward: '$1,500',
      level: 'Intermedio',
      deadline: '15 dias',
      applicants: 18,
      color: '#EC4899',
      icon: 'Code2',
      status: 'open',
      description:
        'Disena un pipeline de datos eficiente para unificar fuentes de datos de clientes y generar insights accionables.',
      tags: ['Data', 'Analytics', 'Python'],
    },
    {
      id: 5,
      title: 'Plan de marketing de contenidos B2C',
      company: 'GreenAI',
      companyInitial: 'G',
      industry: 'Sostenibilidad',
      reward: '$600',
      level: 'Basico',
      deadline: '10 dias',
      applicants: 45,
      color: '#22C55E',
      icon: 'Briefcase',
      status: 'open',
      description:
        'Crea un plan de contenidos para posicionar nuestra marca de IA verde frente a consumidores millennials.',
      tags: ['Marketing', 'Contenido', 'B2C'],
    },
    {
      id: 6,
      title: 'Arquitectura de microservicios escalable',
      company: 'CloudX',
      companyInitial: 'C',
      industry: 'Cloud',
      reward: '$3,000',
      level: 'Avanzado',
      deadline: '25 dias',
      applicants: 8,
      color: '#0EA5E9',
      icon: 'BarChart2',
      status: 'open',
      description:
        'Disena la arquitectura de microservicios para una plataforma SaaS que necesita escalar a 1M+ usuarios.',
      tags: ['Backend', 'Cloud', 'DevOps'],
    },
  ];

  readonly myApplications: ApplicationItem[] = [
    {
      id: 1,
      title: 'Analisis de competencia para marketplace',
      company: 'MarketPro',
      reward: '$900',
      status: 'En revision',
      statusColor: '#F59E0B',
      statusBg: '#FFFBEB',
      submittedAt: 'Hace 3 dias',
      submittedDate: '12 marzo 2026',
      summary:
        'Propuse un analisis competitivo con matriz de posicionamiento y oportunidades de diferenciacion para el onboarding del marketplace.',
      focus: ['Benchmark', 'UX', 'Go-to-market'],
      nextStep: 'Entrevista corta con el equipo de producto',
      companyFeedback: 'Buena estructura y enfoque. Quieren profundizar en acquisition channels.',
    },
    {
      id: 2,
      title: 'Optimizacion de funnel de conversion',
      company: 'ConvertoAI',
      reward: '$1,100',
      status: 'Seleccionado',
      statusColor: '#00C9A7',
      statusBg: '#F0FDF9',
      submittedAt: 'Hace 1 semana',
      submittedDate: '7 marzo 2026',
      summary:
        'Entregue un rediseño del funnel con hipotesis A/B, eventos de analitica y dashboard de seguimiento para conversion por etapa.',
      focus: ['Data analytics', 'Experimentacion', 'Conversion rate'],
      nextStep: 'Inicio de colaboracion en fase piloto',
      companyFeedback: 'Tu propuesta fue seleccionada por su claridad, impacto y viabilidad tecnica.',
    },
  ];

  readonly navItems: NavItem[] = [
    { icon: 'Home', label: 'Inicio', path: 'inicio' },
    { icon: 'Target', label: 'Retos disponibles', path: 'retos' },
    { icon: 'FileText', label: 'Mis postulaciones', path: 'postulaciones' },
    { icon: 'User', label: 'Perfil', path: 'perfil' },
  ];

  readonly industries = ['Todas', 'Tecnologia', 'Fintech', 'Logistica', 'Data & AI', 'Marketing', 'Cloud'];

  readonly levels = ['Todos', 'Basico', 'Intermedio', 'Avanzado'];

  readonly sortOptions: SortOption[] = ['Mayor recompensa', 'Mas reciente', 'Cierre proximo'];

  readonly quickStats: QuickStat[] = [
    { label: 'Postulaciones', value: '2', icon: 'FileText', color: '#6366F1' },
    { label: 'Retos guardados', value: '1', icon: 'Bookmark', color: '#F59E0B' },
    { label: 'Ganancias', value: '$0', icon: 'DollarSign', color: '#00C9A7' },
    { label: 'Insignias', value: '3', icon: 'Award', color: '#EC4899' },
  ];

  notifications: NotificationItem[] = [
    {
      id: 1,
      title: 'Actualizacion en tu postulacion',
      description: 'MarketPro movio tu estatus a En revision.',
      time: 'Hace 1h',
      read: false,
      targetNav: 'postulaciones',
    },
    {
      id: 2,
      title: 'Nuevo reto recomendado',
      description: 'Se publico un reto de UX en Fintech que coincide con tu perfil.',
      time: 'Hace 4h',
      read: false,
      targetNav: 'retos',
    },
    {
      id: 3,
      title: 'Perfil casi completo',
      description: 'Completa tu bio para mejorar visibilidad ante empresas.',
      time: 'Ayer',
      read: true,
      targetNav: 'perfil',
    },
  ];

  profile: StudentProfile = {
    university: 'Universidad Nacional Autonoma de Mexico',
    major: 'Diseno UX',
    semester: '8vo semestre',
    city: 'Ciudad de Mexico',
    bio:
      'Me enfoco en resolver problemas reales con investigacion de usuarios, analitica y prototipado rapido. Busco retos de producto digital con impacto.',
    skills: ['UX Research', 'Figma', 'Prototipado', 'Data Storytelling'],
  };

  profileDraft: StudentProfile = this.cloneProfile(this.profile);

  activeNav: StudentNavPath = 'retos';
  selectedIndustry = 'Todas';
  selectedLevel = 'Todos';
  selectedSort: SortOption = 'Mayor recompensa';
  searchQuery = '';
  savedIds: number[] = [2];
  sidebarOpen = false;
  desktopSidebarCollapsed = false;
  isMobileView = false;
  notificationsOpen = false;
  profileMenuOpen = false;
  showApplicationDetails = false;
  selectedApplication: ApplicationItem | null = null;
  isEditingProfile = false;
  profileFeedback = '';

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

  get currentUserName(): string {
    return this.auth.session()?.name ?? 'Estudiante';
  }

  get currentUserEmail(): string {
    return this.auth.session()?.email ?? 'estudiante@retolab.app';
  }

  get currentUserInitials(): string {
    return this.buildInitials(this.currentUserName);
  }

  get profileSubtitle(): string {
    return `${this.profile.major} - ${this.profile.university} - ${this.profile.city}`;
  }

  get profileCompletionPercent(): number {
    const values = [
      this.profile.university,
      this.profile.major,
      this.profile.semester,
      this.profile.city,
      this.profile.bio,
    ];

    const completed = values.filter((value) => value.trim().length > 0).length;
    return Math.round((completed / values.length) * 100);
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

  get sortedNotifications(): NotificationItem[] {
    return [...this.notifications].sort((a, b) => Number(a.read) - Number(b.read));
  }

  get profileFields(): ProfileField[] {
    return [
      { label: 'Correo electronico', value: this.currentUserEmail },
      { label: 'Universidad', value: this.profile.university },
      { label: 'Carrera', value: this.profile.major },
      { label: 'Semestre', value: this.profile.semester },
      { label: 'Ciudad', value: this.profile.city },
    ];
  }

  get filteredChallenges(): ChallengeItem[] {
    const filtered = this.challenges.filter((challenge) => {
      const matchIndustry =
        this.selectedIndustry === 'Todas' || challenge.industry === this.selectedIndustry;
      const matchLevel = this.selectedLevel === 'Todos' || challenge.level === this.selectedLevel;
      const query = this.searchQuery.trim().toLowerCase();
      const matchSearch =
        query.length === 0 ||
        challenge.title.toLowerCase().includes(query) ||
        challenge.company.toLowerCase().includes(query);

      return matchIndustry && matchLevel && matchSearch;
    });

    return this.sortChallenges(filtered);
  }

  updateSearch(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchQuery = target.value;
  }

  updateSort(event: Event): void {
    const target = event.target as HTMLSelectElement;

    if (this.isSortOption(target.value)) {
      this.selectedSort = target.value;
    }
  }

  setIndustry(industry: string): void {
    this.selectedIndustry = industry;
  }

  setLevel(level: string): void {
    this.selectedLevel = level;
  }

  toggleSave(id: number): void {
    if (this.savedIds.includes(id)) {
      this.savedIds = this.savedIds.filter((itemId) => itemId !== id);
      return;
    }

    this.savedIds = [...this.savedIds, id];
  }

  setActiveNav(path: StudentNavPath): void {
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

  onWindowKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Escape') {
      return;
    }

    if (this.showApplicationDetails) {
      this.closeApplicationDetails();
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

    this.closeFloatingPanels();
    this.setActiveNav(notification.targetNav);
  }

  openApplicationDetails(applicationId: number): void {
    const application = this.myApplications.find((item) => item.id === applicationId);

    if (!application) {
      return;
    }

    this.selectedApplication = application;
    this.showApplicationDetails = true;
    this.closeSidebar();
    this.closeFloatingPanels();
  }

  closeApplicationDetails(): void {
    this.showApplicationDetails = false;
    this.selectedApplication = null;
  }

  startProfileEdit(): void {
    this.isEditingProfile = true;
    this.profileFeedback = '';
    this.profileDraft = this.cloneProfile(this.profile);
  }

  cancelProfileEdit(): void {
    this.isEditingProfile = false;
    this.profileFeedback = '';
    this.profileDraft = this.cloneProfile(this.profile);
  }

  saveProfileEdit(): void {
    const sanitized = this.sanitizeProfile(this.profileDraft);

    if (!sanitized.university || !sanitized.major) {
      this.profileFeedback = 'Completa al menos universidad y carrera para guardar.';
      return;
    }

    this.profile = sanitized;
    this.profileDraft = this.cloneProfile(sanitized);
    this.isEditingProfile = false;
    this.profileFeedback = 'Perfil actualizado correctamente.';
  }

  updateProfileDraftField(field: EditableProfileField, event: Event): void {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement;

    this.profileDraft = {
      ...this.profileDraft,
      [field]: target.value,
    };
  }

  goHome(): void {
    void this.router.navigateByUrl('/');
  }

  logout(): void {
    this.auth.logout();
    this.sidebarOpen = false;
    this.closeFloatingPanels();
    this.closeApplicationDetails();

    void this.router.navigate(['/acceso'], {
      queryParams: { mode: 'login' },
    });
  }

  private sortChallenges(challenges: ChallengeItem[]): ChallengeItem[] {
    const sorted = [...challenges];

    if (this.selectedSort === 'Mayor recompensa') {
      sorted.sort((a, b) => this.rewardToNumber(b.reward) - this.rewardToNumber(a.reward));
      return sorted;
    }

    if (this.selectedSort === 'Cierre proximo') {
      sorted.sort((a, b) => this.deadlineToDays(a.deadline) - this.deadlineToDays(b.deadline));
      return sorted;
    }

    sorted.sort((a, b) => b.id - a.id);
    return sorted;
  }

  private rewardToNumber(reward: string): number {
    return Number(reward.replace(/[^\d.]/g, '')) || 0;
  }

  private deadlineToDays(deadline: string): number {
    const match = deadline.match(/\d+/);
    return match ? Number(match[0]) : Number.MAX_SAFE_INTEGER;
  }

  private buildInitials(name: string): string {
    const parts = name
      .trim()
      .split(/\s+/)
      .filter((part) => part.length > 0);

    if (parts.length === 0) {
      return 'U';
    }

    const first = parts[0].charAt(0);
    const second = parts.length > 1 ? parts[1].charAt(0) : '';

    return `${first}${second}`.toUpperCase();
  }

  private isSortOption(value: string): value is SortOption {
    return this.sortOptions.includes(value as SortOption);
  }

  private sanitizeProfile(profile: StudentProfile): StudentProfile {
    return {
      university: profile.university.trim(),
      major: profile.major.trim(),
      semester: profile.semester.trim(),
      city: profile.city.trim(),
      bio: profile.bio.trim(),
      skills: profile.skills.map((skill) => skill.trim()).filter((skill) => skill.length > 0),
    };
  }

  private cloneProfile(profile: StudentProfile): StudentProfile {
    return {
      university: profile.university,
      major: profile.major,
      semester: profile.semester,
      city: profile.city,
      bio: profile.bio,
      skills: [...profile.skills],
    };
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

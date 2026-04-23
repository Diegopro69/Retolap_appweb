import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LucideIconComponent } from '../../shared/lucide-icon/lucide-icon.component';
import { AuthService } from '../../core/auth/auth.service';

type StudentNavPath = 'inicio' | 'retos' | 'postulaciones' | 'perfil';

type EditableProfileField = 'university' | 'major' | 'semester' | 'city' | 'bio' | 'accountNumber';

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
  applicantEmail?: string;
  challengeId?: number;
  title: string;
  company: string;
  reward: string;
  status: string;
  statusColor: string;
  statusBg: string;
  submittedAt: string;
  submittedDate: string;
  submissionText: string;
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
  accountNumber: string;
}

interface StoredCompanyChallenge {
  id: number;
  title: string;
  industry: string;
  reward: string;
  level: string;
  deadline?: string;
  deadlineDate?: string;
  applicants: number;
  color: string;
  icon: string;
  status?: string;
  description: string;
  companyName?: string;
}

interface CompanyApplicationRecord {
  id: number;
  challengeId: number;
  challengeTitle: string;
  studentName: string;
  studentEmail: string;
  university: string;
  reward: string;
  summary: string;
  focus: string[];
  submittedDate: string;
  submittedAt: string;
  status: string;
  score: number;
  color: string;
  avatar: string;
  payoutAccountNumber?: string;
  submissionText: string;
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
  private readonly applicationsStorageKeyPrefix = 'retolab.student.applications.';
  private readonly savedStorageKeyPrefix = 'retolab.student.saved.';
  private readonly notificationsStorageKeyPrefix = 'retolab.student.notifications.';
  private readonly legacyApplicationsStorageKey = 'retolab.student.applications';
  private readonly legacySavedStorageKey = 'retolab.student.saved';
  private readonly legacyNotificationsStorageKey = 'retolab.student.notifications';
  private readonly companyChallengesStorageKey = 'retolab.company.challenges';
  private readonly companyApplicationsStorageKey = 'retolab.company.applications';
  private readonly companyNotificationsStorageKey = 'retolab.company.notifications';
  private readonly profileStorageKeyPrefix = 'retolab.student.profile.';

  private readonly defaultChallenges: ChallengeItem[] = [
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

  challenges: ChallengeItem[] = [];

  private readonly defaultApplications: ApplicationItem[] = [
    {
      id: 1,
      applicantEmail: 'demo@retolab.app',
      title: 'Analisis de competencia para marketplace',
      company: 'MarketPro',
      reward: '$900',
      status: 'En revision',
      statusColor: '#F59E0B',
      statusBg: '#FFFBEB',
      submittedAt: 'Hace 3 dias',
      submittedDate: '12 marzo 2026',
      submissionText:
        'Quiero compartir una propuesta con enfoque claro en usuarios, datos y resultados medibles.',
      summary:
        'Propuse un analisis competitivo con matriz de posicionamiento y oportunidades de diferenciacion para el onboarding del marketplace.',
      focus: ['Benchmark', 'UX', 'Go-to-market'],
      nextStep: 'Entrevista corta con el equipo de producto',
      companyFeedback: 'Buena estructura y enfoque. Quieren profundizar en acquisition channels.',
    },
    {
      id: 2,
      applicantEmail: 'demo@retolab.app',
      title: 'Optimizacion de funnel de conversion',
      company: 'ConvertoAI',
      reward: '$1,100',
      status: 'Seleccionado',
      statusColor: '#00C9A7',
      statusBg: '#F0FDF9',
      submittedAt: 'Hace 1 semana',
      submittedDate: '7 marzo 2026',
      submissionText:
        'Tengo experiencia en analisis de conversion y puedo entregar una propuesta accionable con rapidez.',
      summary:
        'Entregue un rediseño del funnel con hipotesis A/B, eventos de analitica y dashboard de seguimiento para conversion por etapa.',
      focus: ['Data analytics', 'Experimentacion', 'Conversion rate'],
      nextStep: 'Inicio de colaboracion en fase piloto',
      companyFeedback: 'Tu propuesta fue seleccionada por su claridad, impacto y viabilidad tecnica.',
    },
  ];

  myApplications: ApplicationItem[] = [];

  readonly navItems: NavItem[] = [
    { icon: 'Home', label: 'Inicio', path: 'inicio' },
    { icon: 'Target', label: 'Retos disponibles', path: 'retos' },
    { icon: 'FileText', label: 'Mis postulaciones', path: 'postulaciones' },
    { icon: 'User', label: 'Perfil', path: 'perfil' },
  ];

  readonly industries = ['Todas', 'Tecnologia', 'Fintech', 'Logistica', 'Data & AI', 'Marketing', 'Cloud'];

  readonly levels = ['Todos', 'Basico', 'Intermedio', 'Avanzado'];

  readonly sortOptions: SortOption[] = ['Mayor recompensa', 'Mas reciente', 'Cierre proximo'];

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

  private readonly defaultNotifications: NotificationItem[] = this.notifications.map((notification) => ({
    ...notification,
  }));

  profile: StudentProfile = {
    university: 'Universidad Nacional Autonoma de Mexico',
    major: 'Diseno UX',
    semester: '8vo semestre',
    city: 'Ciudad de Mexico',
    bio:
      'Me enfoco en resolver problemas reales con investigacion de usuarios, analitica y prototipado rapido. Busco retos de producto digital con impacto.',
    skills: ['UX Research', 'Figma', 'Prototipado', 'Data Storytelling'],
    accountNumber: '',
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
  showApplicationComposeModal = false;
  applicationComposeChallengeId: number | null = null;
  applicationComposeText = '';
  applicationComposeError = '';
  isEditingProfile = false;
  profileFeedback = '';
  dashboardMessage = '';

  constructor(
    private readonly router: Router,
    private readonly auth: AuthService,
  ) {
    this.updateViewportState();
    this.hydrateLocalState();
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
      {
        label: 'Cuenta de deposito',
        value: this.profile.accountNumber ? this.maskAccountNumber(this.profile.accountNumber) : 'Sin registrar',
      },
    ];
  }

  get quickStats(): QuickStat[] {
    const totalEarnings = this.myApplications
      .filter((application) => application.status === 'Seleccionado')
      .reduce((sum, application) => sum + this.rewardToNumber(application.reward), 0);

    return [
      { label: 'Postulaciones', value: String(this.myApplications.length), icon: 'FileText', color: '#6366F1' },
      { label: 'Retos guardados', value: String(this.savedIds.length), icon: 'Bookmark', color: '#F59E0B' },
      { label: 'Ganancias', value: `$${new Intl.NumberFormat('en-US').format(totalEarnings)}`, icon: 'DollarSign', color: '#00C9A7' },
      { label: 'Insignias', value: '3', icon: 'Award', color: '#EC4899' },
    ];
  }

  get rewardsWonCount(): number {
    return this.myApplications.filter((application) => application.status === 'Seleccionado').length;
  }

  get rewardsPendingCount(): number {
    return this.myApplications.filter((application) => application.status === 'En revision').length;
  }

  get rewardsAmountBank(): string {
    const total = this.myApplications
      .filter((application) => application.status === 'Seleccionado')
      .reduce((sum, application) => sum + this.rewardToNumber(application.reward), 0);

    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(total);
  }

  get averageWonReward(): string {
    if (this.rewardsWonCount === 0) {
      return '$0';
    }

    const total = this.myApplications
      .filter((application) => application.status === 'Seleccionado')
      .reduce((sum, application) => sum + this.rewardToNumber(application.reward), 0);

    return `$${new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(total / this.rewardsWonCount)}`;
  }

  get filteredChallenges(): ChallengeItem[] {
    const filtered = this.challenges.filter((challenge) => {
      const matchStatus = challenge.status !== 'closed';
      const matchIndustry =
        this.selectedIndustry === 'Todas' || challenge.industry === this.selectedIndustry;
      const matchLevel = this.selectedLevel === 'Todos' || challenge.level === this.selectedLevel;
      const query = this.searchQuery.trim().toLowerCase();
      const matchSearch =
        query.length === 0 ||
        challenge.title.toLowerCase().includes(query) ||
        challenge.company.toLowerCase().includes(query);

      return matchStatus && matchIndustry && matchLevel && matchSearch;
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

  hasAppliedToChallenge(challengeId: number): boolean {
    return this.myApplications.some((application) => application.challengeId === challengeId);
  }

  openApplicationComposeModal(challengeId: number): void {
    const challenge = this.challenges.find((item) => item.id === challengeId);

    if (!challenge) {
      this.dashboardMessage = 'No se encontro el reto seleccionado.';
      return;
    }

    if (this.hasAppliedToChallenge(challengeId)) {
      this.dashboardMessage = 'Ya te postulaste a este reto.';
      return;
    }

    if (challenge.status === 'closed') {
      this.dashboardMessage = 'Este reto ya cerro y no acepta nuevas postulaciones.';
      return;
    }

    this.showApplicationComposeModal = true;
    this.applicationComposeChallengeId = challengeId;
    this.applicationComposeText = '';
    this.applicationComposeError = '';
    this.closeFloatingPanels();
  }

  closeApplicationComposeModal(): void {
    this.showApplicationComposeModal = false;
    this.applicationComposeChallengeId = null;
    this.applicationComposeText = '';
    this.applicationComposeError = '';
  }

  submitApplicationCompose(): void {
    if (this.applicationComposeChallengeId === null) {
      this.applicationComposeError = 'Selecciona un reto para continuar.';
      return;
    }

    const message = this.applicationComposeText.trim();

    if (message.length < 12) {
      this.applicationComposeError = 'Escribe al menos 12 caracteres para tu mensaje.';
      return;
    }

    if (message.length > 500) {
      this.applicationComposeError = 'Tu mensaje no puede superar 500 caracteres.';
      return;
    }

    this.sendApplicationToChallenge(this.applicationComposeChallengeId, message);
    this.closeApplicationComposeModal();
  }

  private sendApplicationToChallenge(challengeId: number, submissionText: string): void {
    const challenge = this.challenges.find((item) => item.id === challengeId);

    if (!challenge) {
      this.dashboardMessage = 'No se encontro el reto seleccionado.';
      return;
    }

    if (this.hasAppliedToChallenge(challengeId)) {
      this.dashboardMessage = 'Ya te postulaste a este reto.';
      return;
    }

    if (challenge.status === 'closed') {
      this.dashboardMessage = 'Este reto ya cerro y no acepta nuevas postulaciones.';
      return;
    }

    const newApplication: ApplicationItem = {
      id: this.myApplications.reduce((max, app) => Math.max(max, app.id), 0) + 1,
      applicantEmail: this.getNormalizedCurrentUserEmail(),
      challengeId: challenge.id,
      title: challenge.title,
      company: challenge.company,
      reward: challenge.reward,
      status: 'En revision',
      statusColor: '#F59E0B',
      statusBg: '#FFFBEB',
      submittedAt: 'Hace unos segundos',
      submittedDate: this.formatHumanDate(new Date()),
      submissionText: submissionText,
      summary: `Postulacion enviada para resolver el reto ${challenge.title}.`,
      focus: challenge.tags.slice(0, 3),
      nextStep: 'Esperando revision inicial de la empresa',
      companyFeedback: 'Postulacion recibida. Te contactaremos pronto con novedades.',
    };

    this.myApplications = [newApplication, ...this.myApplications];
    this.saveApplications();
    this.registerCompanyApplication(newApplication, challenge);
    this.bumpChallengeApplicants(challenge.id);
    this.dashboardMessage = `Te postulaste correctamente a "${challenge.title}".`;
  }

  toggleSave(id: number): void {
    if (this.savedIds.includes(id)) {
      this.savedIds = this.savedIds.filter((itemId) => itemId !== id);
      this.saveSavedChallenges();
      this.dashboardMessage = 'Reto removido de guardados.';
      return;
    }

    this.savedIds = [...this.savedIds, id];
    this.saveSavedChallenges();
    this.dashboardMessage = 'Reto guardado correctamente.';
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

    this.saveNotifications();
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

    this.saveNotifications();

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

  canCancelApplication(application: ApplicationItem): boolean {
    return application.status !== 'Seleccionado';
  }

  cancelApplication(applicationId: number): void {
    const application = this.myApplications.find((item) => item.id === applicationId);

    if (!application) {
      this.dashboardMessage = 'No se encontro la postulacion seleccionada.';
      return;
    }

    if (!this.canCancelApplication(application)) {
      this.dashboardMessage = 'No puedes cancelar una postulacion ya seleccionada como ganadora.';
      return;
    }

    if (typeof window !== 'undefined') {
      const confirmed = window.confirm(`Quieres cancelar tu postulacion a "${application.title}"?`);

      if (!confirmed) {
        return;
      }
    }

    const originalCount = this.myApplications.length;
    this.myApplications = this.myApplications.filter((item) => item.id !== applicationId);

    if (this.myApplications.length === originalCount) {
      this.dashboardMessage = 'No se pudo cancelar la postulacion.';
      return;
    }

    this.saveApplications();
    this.removeCompanyApplication(application);

    if (typeof application.challengeId === 'number') {
      this.decreaseChallengeApplicants(application.challengeId);
    }

    if (this.selectedApplication?.id === applicationId) {
      this.closeApplicationDetails();
    }

    this.dashboardMessage = 'Postulacion cancelada correctamente.';
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
    this.saveProfile();
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
    this.dashboardMessage = '';

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
    const accountNumber = profile.accountNumber.replace(/\s+/g, '').trim();

    return {
      university: profile.university.trim(),
      major: profile.major.trim(),
      semester: profile.semester.trim(),
      city: profile.city.trim(),
      bio: profile.bio.trim(),
      skills: profile.skills.map((skill) => skill.trim()).filter((skill) => skill.length > 0),
      accountNumber,
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
      accountNumber: profile.accountNumber,
    };
  }

  private formatHumanDate(date: Date): string {
    return new Intl.DateTimeFormat('es-MX', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  }

  private hydrateLocalState(): void {
    this.hydrateChallenges();
    this.hydrateProfile();

    const storedApplications = this.readJson<unknown>(this.getApplicationsStorageKey(), null);

    if (Array.isArray(storedApplications)) {
      const parsed = storedApplications
        .filter((item): item is ApplicationItem => this.isApplicationItem(item));

      if (parsed.length > 0) {
        this.myApplications = parsed;
      } else {
        this.myApplications = [];
      }
    } else {
      const legacyApplications = this.readJson<unknown>(this.legacyApplicationsStorageKey, null);

      if (Array.isArray(legacyApplications)) {
        this.myApplications = legacyApplications
          .filter((item): item is ApplicationItem => this.isApplicationItem(item))
          .filter((item) => this.belongsToCurrentUser(item));
      } else {
        this.myApplications = [];
      }
    }

    this.syncCompanyApplicationsForCurrentStudent();
    this.saveApplications();

    const storedSaved = this.readJson<unknown>(this.getSavedStorageKey(), null);

    if (Array.isArray(storedSaved)) {
      this.savedIds = storedSaved
        .filter((item): item is number => typeof item === 'number' && Number.isFinite(item))
        .map((item) => Math.round(item));

      if (this.savedIds.length === 0) {
        this.savedIds = [2];
      }
    } else {
      const legacySaved = this.readJson<unknown>(this.legacySavedStorageKey, null);

      if (Array.isArray(legacySaved)) {
        this.savedIds = legacySaved
          .filter((item): item is number => typeof item === 'number' && Number.isFinite(item))
          .map((item) => Math.round(item));

        if (this.savedIds.length === 0) {
          this.savedIds = [2];
        }
      }
    }

    const storedNotifications = this.readJson<unknown>(this.getNotificationsStorageKey(), null);

    if (Array.isArray(storedNotifications)) {
      const parsedNotifications = storedNotifications
        .map((item) => this.toStudentNotification(item))
        .filter((item): item is NotificationItem => item !== null);

      if (parsedNotifications.length > 0) {
        this.notifications = parsedNotifications;
      }
    } else {
      const legacyNotifications = this.readJson<unknown>(this.legacyNotificationsStorageKey, null);

      if (Array.isArray(legacyNotifications)) {
        const parsedNotifications = legacyNotifications
          .map((item) => this.toStudentNotification(item))
          .filter((item): item is NotificationItem => item !== null);

        if (parsedNotifications.length > 0) {
          this.notifications = parsedNotifications;
        }
      }
    }

    this.saveNotifications();
  }

  private hydrateChallenges(): void {
    const storedChallenges = this.readJson<unknown>(this.companyChallengesStorageKey, null);

    if (Array.isArray(storedChallenges)) {
      const parsed = storedChallenges
        .map((item) => this.toChallengeItem(item))
        .filter((item): item is ChallengeItem => item !== null);

      if (parsed.length > 0) {
        this.challenges = parsed;
        return;
      }
    }

    this.challenges = this.defaultChallenges.map((challenge) => ({ ...challenge, tags: [...challenge.tags] }));
  }

  private hydrateProfile(): void {
    const storedProfile = this.readJson<unknown>(this.getProfileStorageKey(), null);
    const parsedProfile = this.toStudentProfile(storedProfile);
    const registeredAccount = this.auth.currentUserAccountNumber();

    if (parsedProfile) {
      this.profile = parsedProfile;
      if (!this.profile.accountNumber && registeredAccount) {
        this.profile = {
          ...this.profile,
          accountNumber: registeredAccount,
        };
      }
    } else if (registeredAccount) {
      this.profile = {
        ...this.profile,
        accountNumber: registeredAccount,
      };
    }

    this.profileDraft = this.cloneProfile(this.profile);
  }

  private toChallengeItem(value: unknown): ChallengeItem | null {
    if (!value || typeof value !== 'object') {
      return null;
    }

    const record = value as Partial<StoredCompanyChallenge>;

    if (
      typeof record.id !== 'number' ||
      !Number.isFinite(record.id) ||
      typeof record.title !== 'string' ||
      !record.title.trim() ||
      typeof record.industry !== 'string' ||
      !record.industry.trim() ||
      typeof record.reward !== 'string' ||
      typeof record.level !== 'string' ||
      typeof record.applicants !== 'number' ||
      !Number.isFinite(record.applicants) ||
      typeof record.color !== 'string' ||
      typeof record.icon !== 'string' ||
      typeof record.description !== 'string'
    ) {
      return null;
    }

    const companyName =
      typeof record.companyName === 'string' && record.companyName.trim()
        ? record.companyName.trim()
        : this.getCompanyByIndustry(record.industry);

    const deadlineLabel = this.toStudentDeadlineLabel(record.deadline, record.deadlineDate);
    const normalizedDescription = record.description.trim() || 'Descripcion del reto no disponible.';

    return {
      id: record.id,
      title: record.title.trim(),
      company: companyName,
      companyInitial: this.buildInitials(companyName),
      industry: record.industry.trim(),
      reward: record.reward,
      level: record.level.trim() || 'Intermedio',
      deadline: deadlineLabel,
      applicants: Math.max(0, Math.round(record.applicants)),
      color: record.color,
      icon: record.icon,
      status: record.status === 'Cerrado' ? 'closed' : 'open',
      description: normalizedDescription,
      tags: this.buildTags(record.industry, record.level, normalizedDescription),
    };
  }

  private toStudentDeadlineLabel(deadline?: string, deadlineDate?: string): string {
    if (typeof deadlineDate === 'string' && deadlineDate.trim()) {
      const parsedDate = new Date(deadlineDate);

      if (!Number.isNaN(parsedDate.getTime())) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const end = new Date(parsedDate);
        end.setHours(0, 0, 0, 0);

        const diffDays = Math.ceil((end.getTime() - today.getTime()) / 86400000);

        if (diffDays <= 0) {
          return 'Hoy';
        }

        return `${diffDays} dias`;
      }
    }

    if (typeof deadline === 'string' && deadline.trim()) {
      const normalized = deadline.toLowerCase();

      if (normalized.includes('finalizado') || normalized.includes('cerrado')) {
        return 'Hoy';
      }

      const match = normalized.match(/\d+/);

      if (match) {
        return `${Number(match[0])} dias`;
      }
    }

    return 'Sin fecha';
  }

  private buildTags(industry: string, level: string, description: string): string[] {
    const tags = [industry.trim(), level.trim()];

    if (description.toLowerCase().includes('data')) {
      tags.push('Data');
    } else if (description.toLowerCase().includes('marketing')) {
      tags.push('Marketing');
    } else {
      tags.push('Reto real');
    }

    return tags.filter((tag) => tag.length > 0).slice(0, 3);
  }

  private getCompanyByIndustry(industry: string): string {
    const normalized = industry.toLowerCase();

    if (normalized.includes('tecnologia')) {
      return 'TechFlow';
    }

    if (normalized.includes('fintech')) {
      return 'FinNova';
    }

    if (normalized.includes('logistica')) {
      return 'LogiCorp';
    }

    if (normalized.includes('data') || normalized.includes('ai')) {
      return 'DataSense';
    }

    if (normalized.includes('marketing')) {
      return 'MarketPro';
    }

    if (normalized.includes('cloud')) {
      return 'CloudX';
    }

    return 'RetoLab Company';
  }

  private registerCompanyApplication(application: ApplicationItem, challenge: ChallengeItem): void {
    const stored = this.readJson<unknown>(this.companyApplicationsStorageKey, []);
    const records = Array.isArray(stored)
      ? stored.filter((item): item is Record<string, unknown> => !!item && typeof item === 'object')
      : [];

    const nextId = records.reduce((max, item) => {
      const idValue = item['id'];
      return typeof idValue === 'number' && Number.isFinite(idValue) ? Math.max(max, idValue) : max;
    }, 0) + 1;

    const companyRecord: CompanyApplicationRecord = {
      id: nextId,
      challengeId: challenge.id,
      challengeTitle: challenge.title,
      studentName: this.currentUserName,
      studentEmail: this.currentUserEmail,
      university: this.profile.university || 'Sin universidad',
      reward: application.reward,
      summary: application.summary,
      focus: application.focus,
      submittedDate: application.submittedDate,
      submittedAt: application.submittedAt,
      status: 'En revision',
      score: this.estimateApplicationScore(challenge),
      color: challenge.color,
      avatar: this.currentUserInitials,
      payoutAccountNumber: this.profile.accountNumber,
      submissionText: application.submissionText,
    };

    this.writeJson(this.companyApplicationsStorageKey, [companyRecord, ...records]);
    this.pushCompanyNotification(challenge);
    this.pushStudentNotification(challenge);
  }

  private pushCompanyNotification(challenge: ChallengeItem): void {
    const stored = this.readJson<unknown>(this.companyNotificationsStorageKey, []);
    const records = Array.isArray(stored)
      ? stored.filter((item): item is Record<string, unknown> => !!item && typeof item === 'object')
      : [];

    const nextId = records.reduce((max, item) => {
      const idValue = item['id'];
      return typeof idValue === 'number' && Number.isFinite(idValue) ? Math.max(max, idValue) : max;
    }, 0) + 1;

    const notification = {
      id: nextId,
      title: 'Nueva postulacion recibida',
      description: `${this.currentUserName} se postulo al reto ${challenge.title}.`,
      time: 'Hace unos segundos',
      read: false,
      targetNav: 'postulaciones',
    };

    this.writeJson(this.companyNotificationsStorageKey, [notification, ...records]);
  }

  private pushStudentNotification(challenge: ChallengeItem): void {
    const nextId = this.notifications.reduce((max, item) => Math.max(max, item.id), 0) + 1;

    this.notifications = [
      {
        id: nextId,
        title: 'Postulacion enviada',
        description: `Tu postulacion para ${challenge.title} fue registrada con exito.`,
        time: 'Ahora',
        read: false,
        targetNav: 'postulaciones',
      },
      ...this.notifications,
    ];

    this.saveNotifications();
  }

  private removeCompanyApplication(application: ApplicationItem): void {
    const stored = this.readJson<unknown>(this.companyApplicationsStorageKey, null);

    if (!Array.isArray(stored)) {
      return;
    }

    const userEmail = this.getNormalizedCurrentUserEmail();
    const targetTitle = application.title.trim().toLowerCase();
    const targetChallengeId = typeof application.challengeId === 'number' ? application.challengeId : null;

    let removed = false;

    const updated = stored.filter((value) => {
      if (!value || typeof value !== 'object') {
        return true;
      }

      const record = value as Partial<CompanyApplicationRecord>;
      const recordEmail = typeof record.studentEmail === 'string' ? record.studentEmail.trim().toLowerCase() : '';
      const recordTitle = typeof record.challengeTitle === 'string' ? record.challengeTitle.trim().toLowerCase() : '';
      const recordChallengeId =
        typeof record.challengeId === 'number' && Number.isFinite(record.challengeId) ? record.challengeId : null;

      const sameEmail = recordEmail === userEmail;
      const sameChallenge =
        (targetChallengeId !== null && recordChallengeId === targetChallengeId) ||
        (targetTitle.length > 0 && recordTitle === targetTitle);

      if (sameEmail && sameChallenge) {
        removed = true;
        return false;
      }

      return true;
    });

    if (!removed) {
      return;
    }

    this.writeJson(this.companyApplicationsStorageKey, updated);
  }

  private decreaseChallengeApplicants(challengeId: number): void {
    const stored = this.readJson<unknown>(this.companyChallengesStorageKey, null);

    if (!Array.isArray(stored)) {
      return;
    }

    let changed = false;

    const updated = stored.map((value) => {
      if (!value || typeof value !== 'object') {
        return value;
      }

      const record = value as Record<string, unknown>;
      const idValue = record['id'];

      if (typeof idValue !== 'number' || idValue !== challengeId) {
        return value;
      }

      const applicantsValue = record['applicants'];
      const currentApplicants =
        typeof applicantsValue === 'number' && Number.isFinite(applicantsValue)
          ? Math.max(0, Math.round(applicantsValue))
          : 0;

      changed = true;

      return {
        ...record,
        applicants: Math.max(0, currentApplicants - 1),
      };
    });

    if (!changed) {
      return;
    }

    this.writeJson(this.companyChallengesStorageKey, updated);
    this.hydrateChallenges();
  }

  private syncCompanyApplicationsForCurrentStudent(): void {
    const email = this.getNormalizedCurrentUserEmail();

    if (!email) {
      return;
    }

    const stored = this.readJson<unknown>(this.companyApplicationsStorageKey, null);

    if (!Array.isArray(stored)) {
      return;
    }

    const challengeMap = new Map(this.challenges.map((challenge) => [challenge.id, challenge]));
    let changed = false;

    for (const value of stored) {
      if (!value || typeof value !== 'object') {
        continue;
      }

      const record = value as Partial<CompanyApplicationRecord>;

      if (
        typeof record.challengeId !== 'number' ||
        !Number.isFinite(record.challengeId) ||
        typeof record.challengeTitle !== 'string' ||
        typeof record.studentEmail !== 'string' ||
        typeof record.studentName !== 'string' ||
        typeof record.reward !== 'string' ||
        typeof record.status !== 'string' ||
        typeof record.submittedAt !== 'string' ||
        typeof record.submittedDate !== 'string' ||
        typeof record.summary !== 'string' ||
        !Array.isArray(record.focus)
      ) {
        continue;
      }

      if (record.studentEmail.trim().toLowerCase() !== email) {
        continue;
      }

      const challengeTitle = record.challengeTitle;

      const statusVisual = this.getStatusVisual(record.status);
      const challenge = challengeMap.get(record.challengeId);
      const applicationIndex = this.myApplications.findIndex((application) => {
        if (typeof application.challengeId === 'number' && application.challengeId === record.challengeId) {
          return true;
        }

        return application.title.trim().toLowerCase() === challengeTitle.trim().toLowerCase();
      });

      const mergedApplication: ApplicationItem = {
        id:
          applicationIndex >= 0
            ? this.myApplications[applicationIndex].id
            : this.myApplications.reduce((max, app) => Math.max(max, app.id), 0) + 1,
        applicantEmail: email,
        challengeId: record.challengeId,
        title: challengeTitle,
        company: challenge?.company || this.getCompanyByIndustry(challenge?.industry || ''),
        reward: record.reward,
        status: record.status,
        statusColor: statusVisual.color,
        statusBg: statusVisual.bg,
        submittedAt: record.submittedAt,
        submittedDate: record.submittedDate,
        summary: record.summary,
        submissionText:
          typeof record.submissionText === 'string' ? record.submissionText : 'Sin mensaje adicional registrado.',
        focus: record.focus.filter((item): item is string => typeof item === 'string'),
        nextStep:
          record.status === 'Seleccionado'
            ? 'Coordina con la empresa la entrega y validacion final del reto.'
            : record.status === 'Rechazado'
              ? 'Puedes seguir postulando a otros retos disponibles.'
              : 'Esperando revision inicial de la empresa',
        companyFeedback:
          record.status === 'Seleccionado'
            ? `Fuiste seleccionado. Recompensa asignada: ${record.reward}.`
            : record.status === 'Rechazado'
              ? 'La empresa cerro el proceso con otro perfil para este reto.'
              : 'Postulacion recibida. Te contactaremos pronto con novedades.',
      };

      if (applicationIndex >= 0) {
        const previous = this.myApplications[applicationIndex];

        if (
          previous.status !== mergedApplication.status ||
          previous.reward !== mergedApplication.reward ||
          previous.companyFeedback !== mergedApplication.companyFeedback ||
          previous.nextStep !== mergedApplication.nextStep
        ) {
          this.myApplications[applicationIndex] = mergedApplication;
          changed = true;
        }
      } else {
        this.myApplications = [mergedApplication, ...this.myApplications];
        changed = true;
      }
    }

    if (!changed) {
      return;
    }

    this.myApplications = [...this.myApplications].sort((a, b) => b.id - a.id);
  }

  private toStudentNotification(value: unknown): NotificationItem | null {
    if (!value || typeof value !== 'object') {
      return null;
    }

    const record = value as Partial<NotificationItem>;

    if (
      typeof record.id !== 'number' ||
      !Number.isFinite(record.id) ||
      typeof record.title !== 'string' ||
      typeof record.description !== 'string' ||
      typeof record.time !== 'string' ||
      typeof record.read !== 'boolean' ||
      (record.targetNav !== 'inicio' &&
        record.targetNav !== 'retos' &&
        record.targetNav !== 'postulaciones' &&
        record.targetNav !== 'perfil')
    ) {
      return null;
    }

    return {
      id: Math.round(record.id),
      title: record.title,
      description: record.description,
      time: record.time,
      read: record.read,
      targetNav: record.targetNav,
    };
  }

  private saveNotifications(): void {
    this.writeJson(this.getNotificationsStorageKey(), this.notifications);
  }

  private getStatusVisual(status: string): { color: string; bg: string } {
    if (status === 'Seleccionado') {
      return { color: '#00C9A7', bg: '#F0FDF9' };
    }

    if (status === 'Rechazado') {
      return { color: '#EF4444', bg: '#FEF2F2' };
    }

    return { color: '#F59E0B', bg: '#FFFBEB' };
  }

  private estimateApplicationScore(challenge: ChallengeItem): number {
    const rewardFactor = Math.min(this.rewardToNumber(challenge.reward) / 1000, 4);
    const levelFactor = challenge.level === 'Avanzado' ? 2 : challenge.level === 'Intermedio' ? 1 : 0;
    const base = 6 + rewardFactor * 0.5 + levelFactor * 0.4;
    return Math.min(9.9, Number(base.toFixed(1)));
  }

  private bumpChallengeApplicants(challengeId: number): void {
    const stored = this.readJson<unknown>(this.companyChallengesStorageKey, null);

    if (!Array.isArray(stored)) {
      return;
    }

    let changed = false;

    const updated = stored.map((item) => {
      if (!item || typeof item !== 'object') {
        return item;
      }

      const record = item as Record<string, unknown>;
      const idValue = record['id'];

      if (typeof idValue !== 'number' || idValue !== challengeId) {
        return item;
      }

      const applicantsValue = record['applicants'];
      const currentApplicants =
        typeof applicantsValue === 'number' && Number.isFinite(applicantsValue)
          ? Math.max(0, Math.round(applicantsValue))
          : 0;

      changed = true;

      return {
        ...record,
        applicants: currentApplicants + 1,
      };
    });

    if (!changed) {
      return;
    }

    this.writeJson(this.companyChallengesStorageKey, updated);
    this.hydrateChallenges();
  }

  private toStudentProfile(value: unknown): StudentProfile | null {
    if (!value || typeof value !== 'object') {
      return null;
    }

    const profile = value as Partial<StudentProfile>;

    if (
      typeof profile.university !== 'string' ||
      typeof profile.major !== 'string' ||
      typeof profile.semester !== 'string' ||
      typeof profile.city !== 'string' ||
      typeof profile.bio !== 'string' ||
      typeof profile.accountNumber !== 'string' ||
      !Array.isArray(profile.skills) ||
      !profile.skills.every((skill) => typeof skill === 'string')
    ) {
      return null;
    }

    return this.sanitizeProfile({
      university: profile.university,
      major: profile.major,
      semester: profile.semester,
      city: profile.city,
      bio: profile.bio,
      skills: profile.skills,
      accountNumber: profile.accountNumber,
    });
  }

  private maskAccountNumber(accountNumber: string): string {
    const clean = accountNumber.replace(/\s+/g, '').trim();

    if (clean.length <= 4) {
      return clean;
    }

    return `****${clean.slice(-4)}`;
  }

  private saveProfile(): void {
    this.writeJson(this.getProfileStorageKey(), this.profile);
  }

  private getProfileStorageKey(): string {
    const email = this.auth.session()?.email?.trim().toLowerCase() || 'anon';
    return `${this.profileStorageKeyPrefix}${email}`;
  }

  private isApplicationItem(value: unknown): value is ApplicationItem {
    if (!value || typeof value !== 'object') {
      return false;
    }

    const record = value as Partial<ApplicationItem>;

    return (
      typeof record.id === 'number' &&
      Number.isFinite(record.id) &&
      (typeof record.applicantEmail === 'undefined' || typeof record.applicantEmail === 'string') &&
      typeof record.title === 'string' &&
      typeof record.company === 'string' &&
      typeof record.reward === 'string' &&
      typeof record.status === 'string' &&
      typeof record.statusColor === 'string' &&
      typeof record.statusBg === 'string' &&
      typeof record.submittedAt === 'string' &&
      typeof record.submittedDate === 'string' &&
      typeof record.summary === 'string' &&
      Array.isArray(record.focus) &&
      record.focus.every((item) => typeof item === 'string') &&
      typeof record.nextStep === 'string' &&
      typeof record.companyFeedback === 'string'
    );
  }

  private saveApplications(): void {
    this.writeJson(this.getApplicationsStorageKey(), this.myApplications);
  }

  private saveSavedChallenges(): void {
    this.writeJson(this.getSavedStorageKey(), this.savedIds);
  }

  private belongsToCurrentUser(application: ApplicationItem): boolean {
    const email = this.getNormalizedCurrentUserEmail();

    if (!email) {
      return false;
    }

    return application.applicantEmail?.trim().toLowerCase() === email;
  }

  private getNormalizedCurrentUserEmail(): string {
    return this.currentUserEmail.trim().toLowerCase();
  }

  private getApplicationsStorageKey(): string {
    return `${this.applicationsStorageKeyPrefix}${this.getNormalizedCurrentUserEmail()}`;
  }

  private getSavedStorageKey(): string {
    return `${this.savedStorageKeyPrefix}${this.getNormalizedCurrentUserEmail()}`;
  }

  private getNotificationsStorageKey(): string {
    return `${this.notificationsStorageKeyPrefix}${this.getNormalizedCurrentUserEmail()}`;
  }

  private readJson<T>(key: string, fallback: T): T {
    const storage = this.getStorage();

    if (!storage) {
      return fallback;
    }

    try {
      const raw = storage.getItem(key);
      if (!raw) {
        return fallback;
      }

      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  }

  private writeJson(key: string, value: unknown): void {
    const storage = this.getStorage();

    if (!storage) {
      return;
    }

    try {
      storage.setItem(key, JSON.stringify(value));
    } catch {
      // Ignore storage write errors.
    }
  }

  private getStorage(): Storage | null {
    if (typeof window === 'undefined') {
      return null;
    }

    return window.localStorage;
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

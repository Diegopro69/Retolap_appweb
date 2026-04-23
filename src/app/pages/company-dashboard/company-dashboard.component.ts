import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LucideIconComponent } from '../../shared/lucide-icon/lucide-icon.component';
import { AuthService } from '../../core/auth/auth.service';

type CompanyNavPath = 'dashboard' | 'retos' | 'postulaciones' | 'analiticas' | 'config';
type ChallengeStatus = 'Abierto' | 'En revision' | 'Cerrado';
type ChallengeTab = 'Todos' | 'Abiertos' | 'En revision' | 'Cerrados';
type ConfigFieldKey = 'companyName' | 'industry' | 'website' | 'plan' | 'contactEmail' | 'payoutAccountNumber';

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
  companyName?: string;
  reward: string;
  status: ChallengeStatus;
  applicants: number;
  deadline: string;
  deadlineDate: string;
  published: string;
  icon: string;
  color: string;
  views: number;
  description: string;
  level: string;
  winner?: string;
}

interface TopApplicant {
  name: string;
  studentEmail?: string;
  university: string;
  challenge: string;
  score: number;
  avatar: string;
  color: string;
  applicationId?: number;
  challengeId?: number;
  summary?: string;
  focus?: string[];
  submittedDate?: string;
  status?: string;
  payoutAccountNumber?: string;
  submissionText?: string;
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
  rewardAssigned?: boolean;
  payoutAccountNumber?: string;
  submissionText: string;
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
  key: ConfigFieldKey;
  label: string;
  value: string;
}

interface CompanySettings {
  companyName: string;
  industry: string;
  website: string;
  plan: string;
  contactEmail: string;
  payoutAccountNumber: string;
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
  private readonly challengesStorageKey = 'retolab.company.challenges';
  private readonly settingsStorageKey = 'retolab.company.settings';
  private readonly applicationsStorageKey = 'retolab.company.applications';
  private readonly notificationsStorageKey = 'retolab.company.notifications';
  private readonly studentApplicationsStorageKeyPrefix = 'retolab.student.applications.';
  private readonly studentNotificationsStorageKeyPrefix = 'retolab.student.notifications.';

  readonly challengeTabs: ChallengeTab[] = ['Todos', 'Abiertos', 'En revision', 'Cerrados'];

  readonly companyNavItems: CompanyNavItem[] = [
    { icon: 'Home', label: 'Dashboard', path: 'dashboard' },
    { icon: 'Target', label: 'Mis retos', path: 'retos' },
    { icon: 'Users', label: 'Postulaciones', path: 'postulaciones' },
    { icon: 'BarChart3', label: 'Analiticas', path: 'analiticas' },
    { icon: 'Settings', label: 'Configuracion', path: 'config' },
  ];

  private readonly defaultPublishedChallenges: PublishedChallenge[] = [
    {
      id: 1,
      title: 'Estrategia de Growth Hacking para SaaS B2B',
      industry: 'Tecnologia',
      companyName: 'TechFlow',
      reward: '$1,200',
      status: 'Abierto',
      applicants: 34,
      deadline: '12 dias restantes',
      deadlineDate: '2026-05-10',
      published: '15 feb 2026',
      icon: 'TrendingUp',
      color: '#00C9A7',
      views: 289,
      description:
        'Diseña una estrategia de crecimiento sostenible para una plataforma SaaS B2B en LATAM.',
      level: 'Intermedio',
    },
    {
      id: 2,
      title: 'Rediseno UX de app de pagos moviles',
      industry: 'Fintech',
      companyName: 'FinNova',
      reward: '$800',
      status: 'En revision',
      applicants: 21,
      deadline: 'Cerrado',
      deadlineDate: '2026-02-20',
      published: '8 feb 2026',
      icon: 'Sparkles',
      color: '#6366F1',
      views: 174,
      description:
        'Rediseña la experiencia de usuario de una app de pagos para mejorar activación y retención.',
      level: 'Basico',
    },
    {
      id: 3,
      title: 'Modelo de expansion para mercados LATAM',
      industry: 'Logistica',
      companyName: 'LogiCorp',
      reward: '$2,000',
      status: 'Abierto',
      applicants: 12,
      deadline: '20 dias restantes',
      deadlineDate: '2026-05-18',
      published: '20 feb 2026',
      icon: 'Globe',
      color: '#F59E0B',
      views: 96,
      description:
        'Construye un modelo de expansión logística para 5 países con enfoque operativo y financiero.',
      level: 'Avanzado',
    },
    {
      id: 4,
      title: 'Pipeline de datos para analisis de clientes',
      industry: 'Data & AI',
      companyName: 'DataSense',
      reward: '$1,500',
      status: 'Cerrado',
      applicants: 18,
      deadline: 'Finalizado',
      deadlineDate: '2026-02-01',
      published: '1 feb 2026',
      icon: 'Code2',
      color: '#EC4899',
      views: 312,
      description:
        'Diseña un pipeline para integrar fuentes de datos y habilitar segmentación avanzada de clientes.',
      level: 'Intermedio',
      winner: 'Laura Gomez',
    },
    {
      id: 5,
      title: 'Plan de marketing de contenidos B2C',
      industry: 'Marketing',
      companyName: 'GreenAI',
      reward: '$600',
      status: 'Cerrado',
      applicants: 45,
      deadline: 'Finalizado',
      deadlineDate: '2026-01-25',
      published: '25 ene 2026',
      icon: 'Briefcase',
      color: '#22C55E',
      views: 421,
      description:
        'Define calendario editorial y distribución para posicionar marca de consumo en audiencias jóvenes.',
      level: 'Basico',
      winner: 'Carlos Ruiz',
    },
  ];

  publishedChallenges: PublishedChallenge[] = [];
  receivedApplications: CompanyApplicationRecord[] = [];

  private readonly fallbackTopApplicants: TopApplicant[] = [
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

  private readonly defaultNotifications: CompanyNotificationItem[] = this.notifications.map((notification) => ({
    ...notification,
  }));

  companySettings: CompanySettings = {
    companyName: 'Mi empresa',
    industry: 'Tecnologia / SaaS',
    website: 'www.retocompany.com',
    plan: 'Enterprise - Renovacion feb 2027',
    contactEmail: 'contacto@retolab.app',
    payoutAccountNumber: '',
  };

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
  selectedChallengeTab: ChallengeTab = 'Todos';
  editingChallengeId: number | null = null;
  actionMessage = '';

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

  get currentCompanyName(): string {
    return this.companySettings.companyName;
  }

  get currentCompanyEmail(): string {
    return this.companySettings.contactEmail;
  }

  get currentCompanyPayoutAccount(): string {
    return this.companySettings.payoutAccountNumber;
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

  get topApplicants(): TopApplicant[] {
    if (this.receivedApplications.length === 0) {
      return this.fallbackTopApplicants;
    }

    return [...this.receivedApplications]
      .filter((application) => application.status === 'En revision')
      .sort((a, b) => b.score - a.score)
      .map((application) => ({
        name: application.studentName,
        studentEmail: application.studentEmail,
        university: application.university,
        challenge: application.challengeTitle,
        score: application.score,
        avatar: application.avatar,
        color: application.color,
        applicationId: application.id,
        challengeId: application.challengeId,
        summary: application.summary,
        focus: [...application.focus],
        submittedDate: application.submittedDate,
        status: application.status,
        payoutAccountNumber: application.payoutAccountNumber,
        submissionText: application.submissionText,
      }));
  }

  get pendingApplicationsCount(): number {
    if (this.receivedApplications.length === 0) {
      return this.topApplicants.length;
    }

    return this.receivedApplications.filter((application) => application.status === 'En revision').length;
  }

  get assignedRewardsTotal(): number {
    if (this.receivedApplications.length > 0) {
      return this.receivedApplications
        .filter((application) => application.status === 'Seleccionado')
        .reduce((total, application) => total + this.rewardToNumber(application.reward), 0);
    }

    return this.publishedChallenges
      .filter((challenge) => typeof challenge.winner === 'string' && challenge.winner.trim().length > 0)
      .reduce((total, challenge) => total + this.rewardToNumber(challenge.reward), 0);
  }

  get assignedRewardsCount(): number {
    if (this.receivedApplications.length > 0) {
      return this.receivedApplications.filter((application) => application.status === 'Seleccionado').length;
    }

    return this.publishedChallenges.filter(
      (challenge) => typeof challenge.winner === 'string' && challenge.winner.trim().length > 0,
    ).length;
  }

  get assignedRewardsAmountBank(): string {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(this.assignedRewardsTotal);
  }

  get averageAssignedReward(): string {
    if (this.assignedRewardsCount === 0) {
      return this.formatReward(0);
    }

    return this.formatReward(this.assignedRewardsTotal / this.assignedRewardsCount);
  }

  get analyticsCards(): Array<{ label: string; value: string; desc: string; color: string }> {
    const totalApplications = this.receivedApplications.length;
    const selectedApplications = this.receivedApplications.filter(
      (application) => application.status === 'Seleccionado',
    ).length;
    const rejectedApplications = this.receivedApplications.filter(
      (application) => application.status === 'Rechazado',
    ).length;

    const conversionRate = totalApplications > 0 ? (selectedApplications / totalApplications) * 100 : 0;
    const costPerTalent = totalApplications > 0 ? this.assignedRewardsTotal / totalApplications : 0;

    const openChallenges = this.publishedChallenges.filter((challenge) => challenge.status !== 'Cerrado');
    const sourceChallenges = openChallenges.length > 0 ? openChallenges : this.publishedChallenges;
    const averageDaysToDeadline = this.calculateAverageDaysToDeadline(sourceChallenges);

    return [
      {
        label: 'Tasa de conversion',
        value: `${conversionRate.toFixed(0)}%`,
        desc: `${selectedApplications} seleccionados de ${totalApplications} postulaciones`,
        color: '#00C9A7',
      },
      {
        label: 'Costo por talento',
        value: this.formatReward(costPerTalent),
        desc: `${selectedApplications} ganadores y ${rejectedApplications} rechazados`,
        color: '#6366F1',
      },
      {
        label: 'Tiempo promedio',
        value: `${averageDaysToDeadline} dias`,
        desc: 'Promedio hasta la fecha limite de retos visibles',
        color: '#F59E0B',
      },
    ];
  }

  get metrics(): MetricItem[] {
    const activeChallenges = this.publishedChallenges.filter((challenge) => challenge.status !== 'Cerrado').length;
    const totalApplicants = this.publishedChallenges.reduce((acc, challenge) => acc + challenge.applicants, 0);
    const closedChallenges = this.publishedChallenges.filter((challenge) => challenge.status === 'Cerrado').length;
    const totalInvestment = this.publishedChallenges.reduce(
      (acc, challenge) => acc + this.rewardToNumber(challenge.reward),
      0,
    );

    return [
      {
        label: 'Retos activos',
        value: String(activeChallenges),
        change: `${activeChallenges} en curso`,
        up: true,
        color: '#00C9A7',
        bg: '#F0FDF9',
        icon: 'Target',
      },
      {
        label: 'Postulaciones recibidas',
        value: String(totalApplicants),
        change: 'Actualizado en tiempo real',
        up: true,
        color: '#6366F1',
        bg: '#EEF2FF',
        icon: 'Users',
      },
      {
        label: 'Retos finalizados',
        value: String(closedChallenges),
        change: `${closedChallenges} cerrados`,
        up: null,
        color: '#F59E0B',
        bg: '#FFFBEB',
        icon: 'CheckCircle2',
      },
      {
        label: 'Inversion total',
        value: this.formatReward(totalInvestment),
        change: 'En recompensas publicadas',
        up: null,
        color: '#EC4899',
        bg: '#FDF2F8',
        icon: 'DollarSign',
      },
    ];
  }

  get configFields(): BasicField[] {
    return [
      { key: 'companyName', label: 'Nombre de la empresa', value: this.currentCompanyName },
      { key: 'industry', label: 'Industria principal', value: this.companySettings.industry },
      { key: 'website', label: 'Sitio web', value: this.companySettings.website },
      { key: 'plan', label: 'Plan activo', value: this.companySettings.plan },
      { key: 'contactEmail', label: 'Correo de contacto', value: this.currentCompanyEmail },
      {
        key: 'payoutAccountNumber',
        label: 'Cuenta para depositar pagos',
        value: this.currentCompanyPayoutAccount ? this.maskAccountNumber(this.currentCompanyPayoutAccount) : 'Sin registrar',
      },
    ];
  }

  get displayedPublishedChallenges(): PublishedChallenge[] {
    if (this.selectedChallengeTab === 'Todos') {
      return this.publishedChallenges;
    }

    if (this.selectedChallengeTab === 'Abiertos') {
      return this.publishedChallenges.filter((challenge) => challenge.status === 'Abierto');
    }

    if (this.selectedChallengeTab === 'En revision') {
      return this.publishedChallenges.filter((challenge) => challenge.status === 'En revision');
    }

    return this.publishedChallenges.filter((challenge) => challenge.status === 'Cerrado');
  }

  get isEditingChallenge(): boolean {
    return this.editingChallengeId !== null;
  }

  goHome(): void {
    void this.router.navigateByUrl('/');
  }

  logout(): void {
    this.auth.logout();
    this.sidebarOpen = false;
    this.closeFloatingPanels();
    this.clearActionMessage();

    void this.router.navigate(['/acceso'], {
      queryParams: { mode: 'login' },
    });
  }

  setActiveNav(path: CompanyNavPath): void {
    this.activeNav = path;
    this.sidebarOpen = false;
    this.closeFloatingPanels();
  }

  setChallengeTab(tab: ChallengeTab): void {
    this.selectedChallengeTab = tab;
  }

  toggleQuickFilter(): void {
    const currentIndex = this.challengeTabs.indexOf(this.selectedChallengeTab);
    const nextIndex = (currentIndex + 1) % this.challengeTabs.length;
    this.selectedChallengeTab = this.challengeTabs[nextIndex];
    this.actionMessage = `Filtro activo: ${this.selectedChallengeTab}.`;
  }

  exportChallenges(): void {
    if (typeof window === 'undefined') {
      return;
    }

    const payload = {
      generatedAt: new Date().toISOString(),
      total: this.displayedPublishedChallenges.length,
      challenges: this.displayedPublishedChallenges,
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `retolab-retos-${Date.now()}.json`;
    link.click();
    window.URL.revokeObjectURL(url);

    this.actionMessage = 'Exportacion completada en formato JSON.';
  }

  clearActionMessage(): void {
    this.actionMessage = '';
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
    this.openCreateModalFor();
  }

  openCreateModalFor(challengeId?: number): void {
    this.showCreateModal = true;
    this.modalStep = 1;
    this.modalError = '';
    this.editingChallengeId = null;
    this.challengeForm = this.getEmptyChallengeForm();

    if (typeof challengeId === 'number') {
      const challenge = this.publishedChallenges.find((item) => item.id === challengeId);

      if (challenge) {
        this.editingChallengeId = challenge.id;
        this.challengeForm = {
          title: challenge.title,
          description: challenge.description,
          industry: challenge.industry,
          level: challenge.level,
          reward: String(this.rewardToNumber(challenge.reward)),
          deadline: challenge.deadlineDate,
        };
      }
    }

    this.closeFloatingPanels();
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
    this.modalStep = 1;
    this.modalError = '';
    this.editingChallengeId = null;
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

    if (this.editingChallengeId !== null) {
      this.updateChallengeFromForm(this.editingChallengeId);
      this.actionMessage = 'Reto actualizado correctamente.';
    } else {
      this.createChallengeFromForm();
      this.actionMessage = 'Reto publicado correctamente.';
    }

    this.saveChallenges();
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

  editChallenge(challengeId: number): void {
    this.openCreateModalFor(challengeId);
  }

  deleteChallenge(challengeId: number): void {
    if (typeof window !== 'undefined') {
      const confirmed = window.confirm('Esta accion eliminara el reto. Deseas continuar?');

      if (!confirmed) {
        return;
      }
    }

    const originalCount = this.publishedChallenges.length;
    this.publishedChallenges = this.publishedChallenges.filter((challenge) => challenge.id !== challengeId);

    if (this.publishedChallenges.length === originalCount) {
      this.actionMessage = 'No se encontro el reto para eliminar.';
      return;
    }

    const previousApplications = this.receivedApplications.length;
    this.receivedApplications = this.receivedApplications.filter(
      (application) => application.challengeId !== challengeId,
    );

    this.saveChallenges();
    if (previousApplications !== this.receivedApplications.length) {
      this.saveApplications();
    }

    this.actionMessage = 'Reto eliminado correctamente.';
  }

  selectWinner(applicant: TopApplicant): void {
    const challenge = this.findChallengeForApplicant(applicant);

    if (!challenge) {
      this.actionMessage = 'No se encontro un reto compatible para asignar ganador.';
      return;
    }

    this.publishedChallenges = this.publishedChallenges.map((item) => {
      if (item.id !== challenge.id) {
        return item;
      }

      return {
        ...item,
        status: 'Cerrado',
        winner: applicant.name,
        deadline: 'Finalizado',
      };
    });

    if (typeof applicant.applicationId === 'number') {
      this.receivedApplications = this.receivedApplications.map((application) => {
        if (application.challengeId !== challenge.id) {
          return application;
        }

        if (application.id === applicant.applicationId) {
          return {
            ...application,
            status: 'Seleccionado',
            score: Math.max(application.score, applicant.score),
            reward: challenge.reward,
          };
        }

        return {
          ...application,
          status: 'Rechazado',
        };
      });

      this.saveApplications();

      this.syncStudentApplicationsAfterCompanyDecision(
        challenge.id,
        applicant.name,
        applicant.studentEmail,
        'Seleccionado',
        challenge.reward,
      );
      this.pushStudentOutcomeNotification(
        applicant.name,
        applicant.studentEmail,
        `Fuiste seleccionado para el reto ${challenge.title}. Ahora puedes revisar tu recompensa asignada.`,
      );
    }

    this.saveChallenges();
    this.setActiveNav('retos');
    this.actionMessage = `Ganador asignado: ${applicant.name} en ${challenge.title}.`;
  }

  assignReward(applicant: TopApplicant): void {
    const challenge = this.findChallengeForApplicant(applicant);

    if (!challenge) {
      this.actionMessage = 'No se encontro el reto para asignar recompensa.';
      return;
    }

    if (typeof window === 'undefined') {
      return;
    }

    const currentReward = this.rewardToNumber(challenge.reward);
    const entered = window.prompt(
      `Monto de recompensa para ${applicant.name} (USD)`,
      String(Math.max(1, currentReward)),
    );

    if (entered === null) {
      return;
    }

    const rewardValue = Number(entered.replace(/[^\d.]/g, ''));

    if (!Number.isFinite(rewardValue) || rewardValue <= 0) {
      this.actionMessage = 'Ingresa un monto valido mayor a 0 para la recompensa.';
      return;
    }

    const formattedReward = this.formatReward(rewardValue);

    this.publishedChallenges = this.publishedChallenges.map((item) => {
      if (item.id !== challenge.id) {
        return item;
      }

      return {
        ...item,
        reward: formattedReward,
      };
    });

    if (typeof applicant.applicationId === 'number') {
      this.receivedApplications = this.receivedApplications.map((application) => {
        if (application.challengeId !== challenge.id) {
          return application;
        }

        if (application.id === applicant.applicationId) {
          return {
            ...application,
            status: 'Seleccionado',
            reward: formattedReward,
            rewardAssigned: true,
          };
        }

        return application;
      });

      this.saveApplications();
      this.syncStudentApplicationsAfterCompanyDecision(
        challenge.id,
        applicant.name,
        applicant.studentEmail,
        'Seleccionado',
        formattedReward,
      );
      this.pushStudentOutcomeNotification(
        applicant.name,
        applicant.studentEmail,
        `Se te asigno la recompensa ${formattedReward} para el reto ${challenge.title}.`,
      );
    }

    this.saveChallenges();
    this.actionMessage = `Recompensa asignada a ${applicant.name}: ${formattedReward}.`;
  }

  rejectProposal(applicant: TopApplicant): void {
    if (applicant.status === 'Seleccionado') {
      this.actionMessage = 'No puedes rechazar una propuesta ya seleccionada como ganadora.';
      return;
    }

    if (applicant.status === 'Rechazado') {
      this.actionMessage = 'Esta propuesta ya fue rechazada.';
      return;
    }

    if (typeof window !== 'undefined') {
      const confirmed = window.confirm(`Deseas rechazar la propuesta de ${applicant.name}?`);

      if (!confirmed) {
        return;
      }
    }

    if (typeof applicant.applicationId !== 'number') {
      this.actionMessage = 'No se pudo identificar la postulacion para rechazarla.';
      return;
    }

    const targetApplication = this.receivedApplications.find((application) => application.id === applicant.applicationId);

    if (!targetApplication) {
      this.actionMessage = 'No se encontro la postulacion para rechazar.';
      return;
    }

    this.receivedApplications = this.receivedApplications.map((application) => {
      if (application.id !== applicant.applicationId) {
        return application;
      }

      return {
        ...application,
        status: 'Rechazado',
      };
    });

    this.saveApplications();

    this.syncStudentApplicationsAfterCompanyDecision(
      targetApplication.challengeId,
      applicant.name,
      applicant.studentEmail,
      'Rechazado',
      targetApplication.reward,
    );

    this.pushStudentOutcomeNotification(
      applicant.name,
      applicant.studentEmail,
      `Tu propuesta para ${targetApplication.challengeTitle} fue rechazada. Puedes seguir postulando a otros retos.`,
    );

    this.actionMessage = `Propuesta rechazada: ${applicant.name}.`;
  }

  viewProposal(applicant: TopApplicant): void {
    const summary = applicant.summary ?? 'Postulacion local sin resumen detallado.';
    const focus = applicant.focus && applicant.focus.length > 0 ? applicant.focus.join(', ') : 'Sin enfoque registrado';
    const sentDate = applicant.submittedDate ?? 'Sin fecha';
    const status = applicant.status ?? 'En revision';
    const payoutAccount = applicant.payoutAccountNumber?.trim() || 'Sin cuenta registrada';
    const submissionText = applicant.submissionText?.trim() || 'Sin mensaje adicional registrado.';

    const details =
      `Postulante: ${applicant.name}\n` +
      `Universidad: ${applicant.university}\n` +
      `Reto: ${applicant.challenge}\n` +
      `Score: ${applicant.score}\n` +
      `Estado: ${status}\n` +
      `Enviado: ${sentDate}\n` +
      `Cuenta para deposito: ${payoutAccount}\n` +
      `Enfoque: ${focus}\n\n` +
      `Mensaje del postulante: ${submissionText}\n\n` +
      `Resumen: ${summary}`;

    if (typeof window !== 'undefined') {
      window.alert(details);
    }

    this.actionMessage = `Propuesta abierta para ${applicant.name}.`;
  }

  upgradePlan(): void {
    if (this.companySettings.plan.includes('Plus')) {
      this.actionMessage = 'Tu empresa ya esta en el plan Enterprise Plus.';
      return;
    }

    this.companySettings = {
      ...this.companySettings,
      plan: 'Enterprise Plus - Renovacion abr 2027',
    };

    this.saveSettings();
    this.actionMessage = 'Plan actualizado a Enterprise Plus (local).';
  }

  editConfigField(fieldKey: ConfigFieldKey): void {
    if (typeof window === 'undefined') {
      return;
    }

    const labelMap: Record<ConfigFieldKey, string> = {
      companyName: 'Nombre de la empresa',
      industry: 'Industria principal',
      website: 'Sitio web',
      plan: 'Plan activo',
      contactEmail: 'Correo de contacto',
      payoutAccountNumber: 'Cuenta para depositar pagos',
    };

    const currentValue = this.companySettings[fieldKey];
    const nextValue = window.prompt(`Actualizar ${labelMap[fieldKey]}`, currentValue);

    if (nextValue === null) {
      return;
    }

    const cleanValue = nextValue.trim();

    if (!cleanValue) {
      this.actionMessage = 'El valor no puede quedar vacio.';
      return;
    }

    if (fieldKey === 'contactEmail' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanValue)) {
      this.actionMessage = 'Ingresa un correo de contacto valido.';
      return;
    }

    if (fieldKey === 'companyName') {
      this.companySettings = { ...this.companySettings, companyName: cleanValue };
    } else if (fieldKey === 'industry') {
      this.companySettings = { ...this.companySettings, industry: cleanValue };
    } else if (fieldKey === 'website') {
      this.companySettings = { ...this.companySettings, website: cleanValue };
    } else if (fieldKey === 'plan') {
      this.companySettings = { ...this.companySettings, plan: cleanValue };
    } else if (fieldKey === 'payoutAccountNumber') {
      const cleanAccount = cleanValue.replace(/\s+/g, '');

      if (!/^\d{10,20}$/.test(cleanAccount)) {
        this.actionMessage = 'Ingresa una cuenta de pago valida (10 a 20 digitos).';
        return;
      }

      this.companySettings = { ...this.companySettings, payoutAccountNumber: cleanAccount };
    } else {
      this.companySettings = { ...this.companySettings, contactEmail: cleanValue };
    }

    this.saveSettings();
    this.actionMessage = `${labelMap[fieldKey]} actualizado.`;
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

  private createChallengeFromForm(): void {
    const nextId = this.publishedChallenges.reduce((max, challenge) => Math.max(max, challenge.id), 0) + 1;
    const visual = this.getIndustryVisual(this.challengeForm.industry);
    const rewardValue = Number(this.challengeForm.reward);

    const challenge: PublishedChallenge = {
      id: nextId,
      title: this.challengeForm.title.trim(),
      industry: this.challengeForm.industry,
      companyName: this.currentCompanyName,
      reward: this.formatReward(rewardValue),
      status: 'Abierto',
      applicants: 0,
      deadline: this.formatDeadlineLabel(this.challengeForm.deadline),
      deadlineDate: this.challengeForm.deadline,
      published: this.formatHumanDate(new Date()),
      icon: visual.icon,
      color: visual.color,
      views: 0,
      description: this.challengeForm.description.trim(),
      level: this.challengeForm.level,
    };

    this.publishedChallenges = [challenge, ...this.publishedChallenges];
    this.selectedChallengeTab = 'Todos';
  }

  private updateChallengeFromForm(challengeId: number): void {
    const visual = this.getIndustryVisual(this.challengeForm.industry);
    const rewardValue = Number(this.challengeForm.reward);
    const deadlineLabel = this.formatDeadlineLabel(this.challengeForm.deadline);

    this.publishedChallenges = this.publishedChallenges.map((challenge) => {
      if (challenge.id !== challengeId) {
        return challenge;
      }

      const nextStatus: ChallengeStatus =
        challenge.winner || deadlineLabel === 'Finalizado'
          ? 'Cerrado'
          : challenge.status === 'Cerrado'
            ? 'En revision'
            : challenge.status;

      return {
        ...challenge,
        title: this.challengeForm.title.trim(),
        description: this.challengeForm.description.trim(),
        industry: this.challengeForm.industry,
        companyName: challenge.companyName || this.currentCompanyName,
        level: this.challengeForm.level,
        reward: this.formatReward(rewardValue),
        deadline: deadlineLabel,
        deadlineDate: this.challengeForm.deadline,
        icon: visual.icon,
        color: visual.color,
        status: nextStatus,
        winner: nextStatus === 'Cerrado' ? challenge.winner : undefined,
      };
    });
  }

  private findChallengeForApplicant(applicant: TopApplicant): PublishedChallenge | null {
    if (typeof applicant.challengeId === 'number') {
      const byId = this.publishedChallenges.find(
        (challenge) => challenge.id === applicant.challengeId && challenge.status !== 'Cerrado',
      );

      if (byId) {
        return byId;
      }
    }

    const target = applicant.challenge.trim().toLowerCase();

    const directMatch = this.publishedChallenges.find(
      (challenge) => challenge.title.toLowerCase().includes(target) && challenge.status !== 'Cerrado',
    );

    if (directMatch) {
      return directMatch;
    }

    return this.publishedChallenges.find((challenge) => challenge.status !== 'Cerrado') ?? null;
  }

  private getIndustryVisual(industry: string): { color: string; icon: string } {
    const normalized = industry.toLowerCase();

    if (normalized.includes('fintech')) {
      return { color: '#6366F1', icon: 'Sparkles' };
    }

    if (normalized.includes('logistica')) {
      return { color: '#F59E0B', icon: 'Globe' };
    }

    if (normalized.includes('data') || normalized.includes('ai')) {
      return { color: '#EC4899', icon: 'Code2' };
    }

    if (normalized.includes('marketing')) {
      return { color: '#22C55E', icon: 'Briefcase' };
    }

    if (normalized.includes('cloud')) {
      return { color: '#0EA5E9', icon: 'BarChart3' };
    }

    return { color: '#00C9A7', icon: 'Target' };
  }

  private getCompanyNameByIndustry(industry: string): string {
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
      return 'GreenAI';
    }

    if (normalized.includes('cloud')) {
      return 'CloudX';
    }

    return this.currentCompanyName;
  }

  private formatReward(value: number): string {
    const safeValue = Number.isFinite(value) ? Math.max(0, value) : 0;
    return `$${new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(safeValue)}`;
  }

  private formatDeadlineLabel(deadlineDate: string): string {
    const parsedDate = new Date(deadlineDate);

    if (Number.isNaN(parsedDate.getTime())) {
      return 'Sin fecha';
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endDate = new Date(parsedDate);
    endDate.setHours(0, 0, 0, 0);

    const diffMs = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffMs / 86400000);

    if (diffDays <= 0) {
      return 'Finalizado';
    }

    return `${diffDays} dias restantes`;
  }

  private formatHumanDate(date: Date): string {
    return new Intl.DateTimeFormat('es-MX', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
      .format(date)
      .replace('.', '');
  }

  private toIsoDate(date: Date): string {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private rewardToNumber(reward: string): number {
    const clean = reward.replace(/[^\d.]/g, '');
    const numeric = Number(clean);
    return Number.isFinite(numeric) ? numeric : 0;
  }

  private maskAccountNumber(accountNumber: string): string {
    const clean = accountNumber.replace(/\s+/g, '').trim();

    if (clean.length <= 4) {
      return clean;
    }

    return `****${clean.slice(-4)}`;
  }

  private calculateAverageDaysToDeadline(challenges: PublishedChallenge[]): number {
    if (challenges.length === 0) {
      return 0;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const totalDays = challenges.reduce((sum, challenge) => {
      const parsedDate = new Date(challenge.deadlineDate);

      if (Number.isNaN(parsedDate.getTime())) {
        return sum;
      }

      const deadline = new Date(parsedDate);
      deadline.setHours(0, 0, 0, 0);

      const diffDays = Math.ceil((deadline.getTime() - today.getTime()) / 86400000);
      return sum + Math.max(0, diffDays);
    }, 0);

    return Math.max(0, Math.round(totalDays / challenges.length));
  }

  private getSessionCompanyName(): string {
    return this.auth.session()?.name?.trim() || 'Mi empresa';
  }

  private getSessionCompanyEmail(): string {
    return this.auth.session()?.email?.trim() || 'contacto@retolab.app';
  }

  private getDefaultSettings(): CompanySettings {
    return {
      companyName: this.getSessionCompanyName(),
      industry: 'Tecnologia / SaaS',
      website: 'www.retocompany.com',
      plan: 'Enterprise - Renovacion feb 2027',
      contactEmail: this.getSessionCompanyEmail(),
      payoutAccountNumber: this.auth.currentUserAccountNumber(),
    };
  }

  private hydrateLocalState(): void {
    const fallbackSettings = this.getDefaultSettings();
    const storedSettings = this.readJson<Partial<CompanySettings>>(this.settingsStorageKey, {});

    this.companySettings = {
      companyName: typeof storedSettings.companyName === 'string' && storedSettings.companyName.trim()
        ? storedSettings.companyName.trim()
        : fallbackSettings.companyName,
      industry: typeof storedSettings.industry === 'string' && storedSettings.industry.trim()
        ? storedSettings.industry.trim()
        : fallbackSettings.industry,
      website: typeof storedSettings.website === 'string' && storedSettings.website.trim()
        ? storedSettings.website.trim()
        : fallbackSettings.website,
      plan: typeof storedSettings.plan === 'string' && storedSettings.plan.trim()
        ? storedSettings.plan.trim()
        : fallbackSettings.plan,
      contactEmail: typeof storedSettings.contactEmail === 'string' && storedSettings.contactEmail.trim()
        ? storedSettings.contactEmail.trim()
        : fallbackSettings.contactEmail,
      payoutAccountNumber:
        typeof storedSettings.payoutAccountNumber === 'string' && storedSettings.payoutAccountNumber.trim()
          ? storedSettings.payoutAccountNumber.trim().replace(/\s+/g, '')
          : fallbackSettings.payoutAccountNumber,
    };

    const storedChallenges = this.readJson<unknown>(this.challengesStorageKey, null);

    if (Array.isArray(storedChallenges)) {
      const parsed = storedChallenges
        .map((item) => this.toPublishedChallenge(item))
        .filter((item): item is PublishedChallenge => item !== null);

      if (parsed.length > 0) {
        this.publishedChallenges = parsed;
      } else {
        this.publishedChallenges = this.defaultPublishedChallenges.map((challenge) => ({ ...challenge }));
      }
    } else {
      this.publishedChallenges = this.defaultPublishedChallenges.map((challenge) => ({ ...challenge }));
    }

    const storedApplications = this.readJson<unknown>(this.applicationsStorageKey, null);
    const knownChallengeIds = new Set(this.publishedChallenges.map((challenge) => challenge.id));

    if (Array.isArray(storedApplications)) {
      this.receivedApplications = storedApplications
        .map((item) => this.toCompanyApplicationRecord(item))
        .filter((item): item is CompanyApplicationRecord => item !== null)
        .filter((item) => knownChallengeIds.has(item.challengeId));
    } else {
      this.receivedApplications = [];
    }

    const storedNotifications = this.readJson<unknown>(this.notificationsStorageKey, null);

    if (Array.isArray(storedNotifications)) {
      const parsedNotifications = storedNotifications
        .map((item) => this.toCompanyNotification(item))
        .filter((item): item is CompanyNotificationItem => item !== null);

      this.notifications = parsedNotifications.length > 0
        ? parsedNotifications
        : this.defaultNotifications.map((notification) => ({ ...notification }));
    } else {
      this.notifications = this.defaultNotifications.map((notification) => ({ ...notification }));
    }
  }

  private toCompanyNotification(value: unknown): CompanyNotificationItem | null {
    if (!value || typeof value !== 'object') {
      return null;
    }

    const record = value as Partial<CompanyNotificationItem>;

    if (
      typeof record.id !== 'number' ||
      !Number.isFinite(record.id) ||
      typeof record.title !== 'string' ||
      typeof record.description !== 'string' ||
      typeof record.time !== 'string' ||
      typeof record.read !== 'boolean' ||
      (record.targetNav !== 'dashboard' &&
        record.targetNav !== 'retos' &&
        record.targetNav !== 'postulaciones' &&
        record.targetNav !== 'analiticas' &&
        record.targetNav !== 'config')
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

  private toPublishedChallenge(value: unknown): PublishedChallenge | null {
    if (!value || typeof value !== 'object') {
      return null;
    }

    const record = value as Partial<PublishedChallenge>;

    if (
      typeof record.id !== 'number' ||
      !Number.isFinite(record.id) ||
      typeof record.title !== 'string' ||
      !record.title.trim() ||
      typeof record.industry !== 'string' ||
      !record.industry.trim() ||
      typeof record.reward !== 'string' ||
      typeof record.applicants !== 'number' ||
      !Number.isFinite(record.applicants) ||
      typeof record.deadline !== 'string' ||
      typeof record.published !== 'string' ||
      typeof record.icon !== 'string' ||
      typeof record.color !== 'string' ||
      typeof record.views !== 'number' ||
      !Number.isFinite(record.views)
    ) {
      return null;
    }

    const status: ChallengeStatus = this.isChallengeStatus(record.status) ? record.status : 'Abierto';
    const deadlineDate =
      typeof record.deadlineDate === 'string' && record.deadlineDate.trim()
        ? record.deadlineDate
        : this.toIsoDate(new Date());
    const description =
      typeof record.description === 'string' && record.description.trim()
        ? record.description
        : 'Descripcion no disponible.';
    const level = typeof record.level === 'string' && record.level.trim() ? record.level : 'Intermedio';
    const winner = typeof record.winner === 'string' && record.winner.trim() ? record.winner : undefined;
    const companyName =
      typeof record.companyName === 'string' && record.companyName.trim()
        ? record.companyName.trim()
        : this.getCompanyNameByIndustry(record.industry);

    return {
      id: record.id,
      title: record.title.trim(),
      industry: record.industry.trim(),
      companyName,
      reward: record.reward,
      status,
      applicants: Math.max(0, Math.round(record.applicants)),
      deadline: record.deadline,
      deadlineDate,
      published: record.published,
      icon: record.icon,
      color: record.color,
      views: Math.max(0, Math.round(record.views)),
      description,
      level,
      winner,
    };
  }

  private toCompanyApplicationRecord(value: unknown): CompanyApplicationRecord | null {
    if (!value || typeof value !== 'object') {
      return null;
    }

    const record = value as Partial<CompanyApplicationRecord>;

    if (
      typeof record.id !== 'number' ||
      !Number.isFinite(record.id) ||
      typeof record.challengeId !== 'number' ||
      !Number.isFinite(record.challengeId) ||
      typeof record.challengeTitle !== 'string' ||
      !record.challengeTitle.trim() ||
      typeof record.studentName !== 'string' ||
      !record.studentName.trim() ||
      typeof record.studentEmail !== 'string' ||
      !record.studentEmail.trim() ||
      typeof record.university !== 'string' ||
      typeof record.reward !== 'string' ||
      typeof record.summary !== 'string' ||
      !Array.isArray(record.focus) ||
      !record.focus.every((item) => typeof item === 'string') ||
      typeof record.submittedDate !== 'string' ||
      typeof record.submittedAt !== 'string' ||
      typeof record.status !== 'string' ||
      typeof record.score !== 'number' ||
      !Number.isFinite(record.score) ||
      typeof record.color !== 'string' ||
      typeof record.avatar !== 'string'
    ) {
      return null;
    }

    return {
      id: Math.round(record.id),
      challengeId: Math.round(record.challengeId),
      challengeTitle: record.challengeTitle.trim(),
      studentName: record.studentName.trim(),
      studentEmail: record.studentEmail.trim().toLowerCase(),
      university: record.university.trim(),
      reward: record.reward,
      summary: record.summary.trim(),
      focus: record.focus.filter((item) => item.trim().length > 0),
      submittedDate: record.submittedDate,
      submittedAt: record.submittedAt,
      status: record.status,
      score: Number(record.score.toFixed(1)),
      color: record.color,
      avatar: record.avatar || this.buildInitials(record.studentName),
      rewardAssigned: typeof record.rewardAssigned === 'boolean' ? record.rewardAssigned : false,
      payoutAccountNumber:
        typeof record.payoutAccountNumber === 'string' ? record.payoutAccountNumber.replace(/\s+/g, '').trim() : '',
      submissionText:
        typeof record.submissionText === 'string' ? record.submissionText.trim() : 'Sin mensaje adicional registrado.',
    };
  }

  private syncStudentApplicationsAfterCompanyDecision(
    challengeId: number,
    studentName: string,
    studentEmail: string | undefined,
    status: string,
    reward: string,
  ): void {
    const normalizedEmail = this.normalizeEmail(studentEmail);

    if (!normalizedEmail) {
      return;
    }

    const storageKey = this.getStudentApplicationsStorageKey(normalizedEmail);
    const stored = this.readJson<unknown>(storageKey, []);

    const records = Array.isArray(stored)
      ? stored.filter((item): item is Record<string, unknown> => !!item && typeof item === 'object')
      : [];

    const challenge = this.publishedChallenges.find((item) => item.id === challengeId);
    const sourceApplication = this.receivedApplications.find(
      (application) =>
        application.challengeId === challengeId &&
        application.studentEmail.trim().toLowerCase() === normalizedEmail,
    );
    const challengeTitle = sourceApplication?.challengeTitle ?? challenge?.title ?? 'Reto asignado';
    const companyName = challenge?.companyName || this.currentCompanyName;

    let changed = false;

    const updated = records.map((record) => {
      const recordId = record['challengeId'];
      const recordTitle = typeof record['title'] === 'string' ? record['title'].trim().toLowerCase() : '';

      const sameChallenge =
        (typeof recordId === 'number' && recordId === challengeId) ||
        (challengeTitle.trim().length > 0 && recordTitle === challengeTitle.trim().toLowerCase());

      if (!sameChallenge) {
        return record;
      }

      changed = true;

      return {
        ...record,
        challengeId,
        title: challengeTitle,
        company: companyName,
        reward,
        status,
        statusColor: status === 'Seleccionado' ? '#00C9A7' : status === 'Rechazado' ? '#EF4444' : '#F59E0B',
        statusBg: status === 'Seleccionado' ? '#F0FDF9' : status === 'Rechazado' ? '#FEF2F2' : '#FFFBEB',
        companyFeedback:
          status === 'Seleccionado'
            ? `Fuiste seleccionado. Recompensa asignada: ${reward}.`
            : 'La empresa cerro el proceso con otro perfil para este reto.',
        nextStep:
          status === 'Seleccionado'
            ? 'Coordina con la empresa la entrega y validacion final del reto.'
            : 'Puedes seguir postulando a otros retos disponibles.',
        applicantEmail: normalizedEmail,
      };
    });

    if (!changed && sourceApplication) {
      const nextId = updated.reduce((max, item) => {
        const idValue = item['id'];
        return typeof idValue === 'number' && Number.isFinite(idValue) ? Math.max(max, idValue) : max;
      }, 0) + 1;

      updated.unshift({
        id: nextId,
        challengeId,
        title: challengeTitle,
        company: companyName,
        reward,
        status,
        statusColor: status === 'Seleccionado' ? '#00C9A7' : status === 'Rechazado' ? '#EF4444' : '#F59E0B',
        statusBg: status === 'Seleccionado' ? '#F0FDF9' : status === 'Rechazado' ? '#FEF2F2' : '#FFFBEB',
        submittedAt: sourceApplication.submittedAt,
        submittedDate: sourceApplication.submittedDate,
        summary: sourceApplication.summary,
        focus: [...sourceApplication.focus],
        nextStep:
          status === 'Seleccionado'
            ? 'Coordina con la empresa la entrega y validacion final del reto.'
            : 'Puedes seguir postulando a otros retos disponibles.',
        companyFeedback:
          status === 'Seleccionado'
            ? `Fuiste seleccionado. Recompensa asignada: ${reward}.`
            : 'La empresa cerro el proceso con otro perfil para este reto.',
        applicantEmail: normalizedEmail,
      });

      changed = true;
    }

    if (!changed) {
      return;
    }

    this.writeJson(storageKey, updated);
  }

  private pushStudentOutcomeNotification(studentName: string, studentEmail: string | undefined, description: string): void {
    const normalizedEmail = this.normalizeEmail(studentEmail);

    if (!normalizedEmail) {
      return;
    }

    const storageKey = this.getStudentNotificationsStorageKey(normalizedEmail);
    const stored = this.readJson<unknown>(storageKey, []);
    const records = Array.isArray(stored)
      ? stored.filter((item): item is Record<string, unknown> => !!item && typeof item === 'object')
      : [];

    const nextId = records.reduce((max, item) => {
      const idValue = item['id'];
      return typeof idValue === 'number' && Number.isFinite(idValue) ? Math.max(max, idValue) : max;
    }, 0) + 1;

    const notification = {
      id: nextId,
      title: `Actualizacion de postulacion para ${studentName}`,
      description,
      time: 'Ahora',
      read: false,
      targetNav: 'postulaciones',
    };

    this.writeJson(storageKey, [notification, ...records]);
  }

  private getStudentApplicationsStorageKey(email: string): string {
    return `${this.studentApplicationsStorageKeyPrefix}${email}`;
  }

  private getStudentNotificationsStorageKey(email: string): string {
    return `${this.studentNotificationsStorageKeyPrefix}${email}`;
  }

  private normalizeEmail(value: string | undefined): string {
    if (!value) {
      return '';
    }

    return value.trim().toLowerCase();
  }

  private saveChallenges(): void {
    this.writeJson(this.challengesStorageKey, this.publishedChallenges);
  }

  private saveApplications(): void {
    this.writeJson(this.applicationsStorageKey, this.receivedApplications);
  }

  private saveNotifications(): void {
    this.writeJson(this.notificationsStorageKey, this.notifications);
  }

  private saveSettings(): void {
    this.writeJson(this.settingsStorageKey, this.companySettings);
  }

  private isChallengeStatus(value: unknown): value is ChallengeStatus {
    return value === 'Abierto' || value === 'En revision' || value === 'Cerrado';
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
      // Ignore local storage write errors.
    }
  }

  private getStorage(): Storage | null {
    if (typeof window === 'undefined') {
      return null;
    }

    return window.localStorage;
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

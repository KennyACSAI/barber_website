import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  Scissors, 
  Trash2, 
  X, 
  Search,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  LogOut,
  Shield,
  UserPlus,
  Users,
  Eye,
  EyeOff
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useAuth } from "@/context/AuthContext";
import { useAdminAuth } from "@/context/AdminAuthContext";
import logo from "@/assets/logo.jpg";

interface AppointmentWithUser {
  id: string;
  oderId: string;
  date: string;
  time: string;
  barber: string;
  service: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
}

const Admin = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { getAllAppointments, deleteAppointmentAdmin } = useAuth();
  const { 
    adminUser, 
    isAdminAuthenticated,
    isLoading: isAuthLoading,
    isSuperAdmin, 
    adminLogout,
    createWorkerAdmin,
    deleteWorkerAdmin,
    getWorkerAdmins
  } = useAdminAuth();
  
  const [appointments, setAppointments] = useState<AppointmentWithUser[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<AppointmentWithUser[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [barberFilter, setBarberFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<string>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [deleteModal, setDeleteModal] = useState<{ show: boolean; appointment: AppointmentWithUser | null }>({
    show: false,
    appointment: null
  });
  const [detailModal, setDetailModal] = useState<{ show: boolean; appointment: AppointmentWithUser | null }>({
    show: false,
    appointment: null
  });
  
  // Admin management state (only for super admin)
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showCreateAdmin, setShowCreateAdmin] = useState(false);
  const [newAdminForm, setNewAdminForm] = useState({
    username: '',
    password: '',
    name: ''
  });
  const [showNewAdminPassword, setShowNewAdminPassword] = useState(false);
  const [adminError, setAdminError] = useState('');
  const [adminSuccess, setAdminSuccess] = useState('');
  const [deleteAdminModal, setDeleteAdminModal] = useState<{ show: boolean; adminId: string | null; adminName: string }>({
    show: false,
    adminId: null,
    adminName: ''
  });
  const [workerAdminsList, setWorkerAdminsList] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Redirect if not authenticated (only after loading is complete)
  useEffect(() => {
    if (!isAuthLoading && !isAdminAuthenticated) {
      navigate('/admin-login', { replace: true });
    }
  }, [isAuthLoading, isAdminAuthenticated, navigate]);

  // Load appointments
  const loadAppointments = () => {
    const allAppointments = getAllAppointments();
    setAppointments(allAppointments);
    setFilteredAppointments(allAppointments);
  };

  // Load worker admins
  const loadWorkerAdmins = () => {
    const admins = getWorkerAdmins();
    setWorkerAdminsList(admins);
  };

  useEffect(() => {
    if (!isAuthLoading && isAdminAuthenticated) {
      loadAppointments();
      if (isSuperAdmin) {
        loadWorkerAdmins();
      }
    }
  }, [isAuthLoading, isAdminAuthenticated, isSuperAdmin]);

  // Filter and sort appointments
  useEffect(() => {
    let filtered = [...appointments];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(apt => 
        apt.user.firstName.toLowerCase().includes(term) ||
        apt.user.lastName.toLowerCase().includes(term) ||
        apt.user.email.toLowerCase().includes(term) ||
        apt.user.phone.includes(term) ||
        apt.barber.toLowerCase().includes(term) ||
        apt.service.toLowerCase().includes(term)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(apt => apt.status === statusFilter);
    }

    // Barber filter
    if (barberFilter !== "all") {
      filtered = filtered.filter(apt => apt.barber === barberFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      
      if (sortField === "date") {
        const dateA = new Date(`${a.date}T${a.time}`);
        const dateB = new Date(`${b.date}T${b.time}`);
        comparison = dateA.getTime() - dateB.getTime();
      } else if (sortField === "name") {
        comparison = `${a.user.firstName} ${a.user.lastName}`.localeCompare(`${b.user.firstName} ${b.user.lastName}`);
      } else if (sortField === "barber") {
        comparison = a.barber.localeCompare(b.barber);
      } else if (sortField === "status") {
        comparison = a.status.localeCompare(b.status);
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });

    setFilteredAppointments(filtered);
  }, [appointments, searchTerm, statusFilter, barberFilter, sortField, sortDirection]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const handleDelete = () => {
    if (deleteModal.appointment) {
      deleteAppointmentAdmin(deleteModal.appointment.id, deleteModal.appointment.oderId);
      loadAppointments();
      setDeleteModal({ show: false, appointment: null });
    }
  };

  const handleLogout = () => {
    adminLogout();
    window.scrollTo({ top: 0, behavior: 'instant' });
    navigate('/admin-login');
  };

  const handleCreateWorkerAdmin = () => {
    setAdminError('');
    setAdminSuccess('');

    if (!newAdminForm.username || !newAdminForm.password || !newAdminForm.name) {
      setAdminError(t('admin.adminManagement.allFieldsRequired'));
      return;
    }

    const result = createWorkerAdmin(newAdminForm.username, newAdminForm.password, newAdminForm.name);
    
    if (result.success) {
      setAdminSuccess(t('admin.adminManagement.createSuccess'));
      setNewAdminForm({ username: '', password: '', name: '' });
      setShowCreateAdmin(false);
      loadWorkerAdmins();
    } else {
      setAdminError(result.message);
    }
  };

  const handleDeleteWorkerAdmin = () => {
    if (deleteAdminModal.adminId) {
      const success = deleteWorkerAdmin(deleteAdminModal.adminId);
      if (success) {
        loadWorkerAdmins();
      }
      setDeleteAdminModal({ show: false, adminId: null, adminName: '' });
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('it-IT', { 
      weekday: 'short',
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const formatPhone = (phone: string) => {
    if (!phone) return '-';
    if (phone.length <= 2) return `+${phone}`;
    if (phone.length <= 5) return `+${phone.slice(0, 2)} ${phone.slice(2)}`;
    if (phone.length <= 8) return `+${phone.slice(0, 2)} ${phone.slice(2, 5)} ${phone.slice(5)}`;
    return `+${phone.slice(0, 2)} ${phone.slice(2, 5)} ${phone.slice(5, 8)} ${phone.slice(8)}`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'upcoming':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
            <Clock className="w-3 h-3" />
            {t('admin.status.upcoming')}
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            <CheckCircle className="w-3 h-3" />
            {t('admin.status.completed')}
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
            <XCircle className="w-3 h-3" />
            {t('admin.status.cancelled')}
          </span>
        );
      default:
        return null;
    }
  };

  // Show loading spinner while checking auth
  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-foreground border-t-transparent rounded-full" />
      </div>
    );
  }

  // Don't render if not authenticated (redirect will happen via useEffect)
  if (!isAdminAuthenticated || !adminUser) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-foreground border-t-transparent rounded-full" />
      </div>
    );
  }

  const uniqueBarbers = [...new Set(appointments.map(apt => apt.barber))];

  const stats = {
    total: appointments.length,
    upcoming: appointments.filter(a => a.status === 'upcoming').length,
    completed: appointments.filter(a => a.status === 'completed').length,
    cancelled: appointments.filter(a => a.status === 'cancelled').length
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Animation styles */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-once {
          animation: spin 0.5s ease-in-out;
        }
      `}</style>
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-3 md:px-4 py-2 md:py-3">
          <div className="flex items-center justify-between gap-2">
            {/* Left: Logo + Title */}
            <div className="flex items-center gap-2 min-w-0">
              <img 
                src={logo} 
                alt="Logo" 
                className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover border border-border flex-shrink-0"
              />
              <div className="min-w-0">
                <h1 className="text-sm md:text-lg font-medium leading-tight">{t('admin.title')}</h1>
                <p className="text-[10px] md:text-xs text-muted-foreground flex items-center gap-1">
                  {isSuperAdmin && <Shield className="w-2.5 h-2.5 md:w-3 md:h-3 flex-shrink-0" />}
                  <span className="truncate max-w-[80px] md:max-w-none">{adminUser?.name}</span>
                </p>
              </div>
            </div>
            
            {/* Right: Action buttons */}
            <div className="flex items-center gap-0.5 md:gap-2 flex-shrink-0">
              {isSuperAdmin && (
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setShowAdminPanel(!showAdminPanel)}
                  className={`h-7 w-7 md:h-9 md:w-9 ${showAdminPanel ? 'bg-foreground/10' : ''}`}
                  title={t('admin.adminManagement.title')}
                >
                  <Users className="w-3.5 h-3.5 md:w-4 md:h-4" />
                </Button>
              )}
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => {
                  setIsRefreshing(true);
                  loadAppointments();
                  if (isSuperAdmin) {
                    loadWorkerAdmins();
                  }
                  setTimeout(() => setIsRefreshing(false), 500);
                }}
                className="h-7 w-7 md:h-9 md:w-9"
                title={t('admin.refresh')}
              >
                <RefreshCw className={`w-3.5 h-3.5 md:w-4 md:h-4 ${isRefreshing ? 'animate-spin-once' : ''}`} />
              </Button>
              <div className="hidden sm:block">
                <LanguageSwitcher />
              </div>
              <ThemeToggle />
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleLogout}
                className="h-7 w-7 md:h-9 md:w-9 text-destructive hover:text-destructive"
                title={t('admin.logout')}
              >
                <LogOut className="w-3.5 h-3.5 md:w-4 md:h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6" style={{ animation: 'fadeIn 0.4s ease-out' }}>
        {/* Admin Management Panel (Super Admin Only) */}
        {isSuperAdmin && showAdminPanel && (
          <div className="mb-6 p-4 md:p-6 rounded-lg border border-border bg-card" style={{ animation: 'slideDown 0.3s ease-out' }}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                <h2 className="text-lg font-medium">{t('admin.adminManagement.title')}</h2>
              </div>
              <Button
                onClick={() => setShowCreateAdmin(true)}
                className="!bg-black !text-white dark:!bg-white dark:!text-black hover:opacity-90 text-minimal w-full sm:w-auto"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                {t('admin.adminManagement.createNew')}
              </Button>
            </div>

            {/* Success/Error Messages */}
            {adminSuccess && (
              <div className="mb-4 p-3 border border-green-500/50 bg-green-500/10 text-green-600 dark:text-green-400 text-sm rounded-lg" style={{ animation: 'fadeIn 0.3s ease-out' }}>
                {adminSuccess}
              </div>
            )}

            {/* Worker Admins List */}
            {workerAdminsList.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground border border-dashed border-border rounded-lg">
                {t('admin.adminManagement.noWorkerAdmins')}
              </div>
            ) : (
              <div className="space-y-3">
                {workerAdminsList.map((admin, index) => (
                  <div 
                    key={admin.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-border bg-background hover:bg-muted/30 transition-colors"
                    style={{ animation: `fadeIn 0.3s ease-out ${index * 0.05}s both` }}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-foreground/10 flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium truncate">{admin.name}</p>
                        <p className="text-sm text-muted-foreground truncate">@{admin.username}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 text-destructive hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
                      onClick={() => setDeleteAdminModal({ 
                        show: true, 
                        adminId: admin.id, 
                        adminName: admin.name 
                      })}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
          <div className="p-4 rounded-lg border border-border bg-card hover:bg-muted/30 transition-colors" style={{ animation: 'fadeIn 0.4s ease-out 0s both' }}>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">{t('admin.stats.total')}</p>
            <p className="text-2xl font-light mt-1">{stats.total}</p>
          </div>
          <div className="p-4 rounded-lg border border-border bg-card hover:bg-muted/30 transition-colors" style={{ animation: 'fadeIn 0.4s ease-out 0.05s both' }}>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">{t('admin.stats.upcoming')}</p>
            <p className="text-2xl font-light mt-1 text-blue-600 dark:text-blue-400">{stats.upcoming}</p>
          </div>
          <div className="p-4 rounded-lg border border-border bg-card hover:bg-muted/30 transition-colors" style={{ animation: 'fadeIn 0.4s ease-out 0.1s both' }}>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">{t('admin.stats.completed')}</p>
            <p className="text-2xl font-light mt-1 text-green-600 dark:text-green-400">{stats.completed}</p>
          </div>
          <div className="p-4 rounded-lg border border-border bg-card hover:bg-muted/30 transition-colors" style={{ animation: 'fadeIn 0.4s ease-out 0.15s both' }}>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">{t('admin.stats.cancelled')}</p>
            <p className="text-2xl font-light mt-1 text-red-600 dark:text-red-400">{stats.cancelled}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6" style={{ animation: 'fadeIn 0.4s ease-out 0.2s both' }}>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder={t('admin.search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10 bg-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 px-3 rounded-md border border-input bg-background text-sm"
          >
            <option value="all">{t('admin.filter.allStatus')}</option>
            <option value="upcoming">{t('admin.status.upcoming')}</option>
            <option value="completed">{t('admin.status.completed')}</option>
            <option value="cancelled">{t('admin.status.cancelled')}</option>
          </select>
          <select
            value={barberFilter}
            onChange={(e) => setBarberFilter(e.target.value)}
            className="h-10 px-3 rounded-md border border-input bg-background text-sm"
          >
            <option value="all">{t('admin.filter.allBarbers')}</option>
            {uniqueBarbers.map(barber => (
              <option key={barber} value={barber}>{barber}</option>
            ))}
          </select>
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block rounded-lg border border-border overflow-hidden" style={{ animation: 'fadeIn 0.4s ease-out 0.25s both' }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/70 transition-colors"
                    onClick={() => handleSort("date")}
                  >
                    <div className="flex items-center gap-1">
                      {t('admin.table.date')}
                      {sortField === "date" && (sortDirection === "asc" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {t('admin.table.time')}
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/70 transition-colors"
                    onClick={() => handleSort("name")}
                  >
                    <div className="flex items-center gap-1">
                      {t('admin.table.client')}
                      {sortField === "name" && (sortDirection === "asc" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {t('admin.table.phone')}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {t('admin.table.service')}
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/70 transition-colors"
                    onClick={() => handleSort("barber")}
                  >
                    <div className="flex items-center gap-1">
                      {t('admin.table.barber')}
                      {sortField === "barber" && (sortDirection === "asc" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/70 transition-colors"
                    onClick={() => handleSort("status")}
                  >
                    <div className="flex items-center gap-1">
                      {t('admin.table.status')}
                      {sortField === "status" && (sortDirection === "asc" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                    </div>
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {t('admin.table.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredAppointments.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center text-muted-foreground">
                      {t('admin.noAppointments')}
                    </td>
                  </tr>
                ) : (
                  filteredAppointments.map((apt) => (
                    <tr 
                      key={apt.id} 
                      className="hover:bg-muted/30 transition-colors cursor-pointer"
                      onClick={() => setDetailModal({ show: true, appointment: apt })}
                    >
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        {formatDate(apt.date)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                        {apt.time}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium">{apt.user.firstName} {apt.user.lastName}</div>
                        <div className="text-xs text-muted-foreground">{apt.user.email}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        <a 
                          href={`tel:+${apt.user.phone}`}
                          className="hover:text-foreground transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {formatPhone(apt.user.phone)}
                        </a>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        {apt.service}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        {apt.barber}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {getStatusBadge(apt.status)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteModal({ show: true, appointment: apt });
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden space-y-4">
          {filteredAppointments.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground border border-dashed border-border rounded-lg">
              {t('admin.noAppointments')}
            </div>
          ) : (
            filteredAppointments.map((apt, index) => (
              <div 
                key={apt.id} 
                className="p-4 rounded-lg border border-border bg-card hover:bg-muted/30 transition-colors cursor-pointer"
                style={{ animation: `fadeIn 0.4s ease-out ${Math.min(index * 0.05, 0.3)}s both` }}
                onClick={() => setDetailModal({ show: true, appointment: apt })}
              >
                {/* Header with date and status */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      {formatDate(apt.date)}
                    </div>
                    <div className="flex items-center gap-2 text-lg font-medium mt-1">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      {apt.time}
                    </div>
                  </div>
                  {getStatusBadge(apt.status)}
                </div>

                {/* Client Info */}
                <div className="space-y-2 mb-3 py-3 border-y border-border">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{apt.user.firstName} {apt.user.lastName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <a href={`mailto:${apt.user.email}`} onClick={(e) => e.stopPropagation()}>
                      {apt.user.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <a 
                      href={`tel:+${apt.user.phone}`} 
                      className="text-foreground font-medium"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {formatPhone(apt.user.phone)}
                    </a>
                  </div>
                </div>

                {/* Service Info */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Scissors className="w-4 h-4 text-muted-foreground" />
                    <span>{apt.service}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {apt.barber}
                  </div>
                </div>

                {/* Delete Button */}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-destructive border-destructive/30 hover:bg-destructive/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteModal({ show: true, appointment: apt });
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  {t('admin.delete')}
                </Button>
              </div>
            ))
          )}
        </div>

        {/* Results count */}
        <div className="mt-4 text-sm text-muted-foreground text-center">
          {t('admin.showing')} {filteredAppointments.length} {t('admin.of')} {appointments.length} {t('admin.appointments')}
        </div>
      </main>

      {/* Create Worker Admin Modal */}
      {showCreateAdmin && (
        <div 
          className="fixed inset-0 flex items-center justify-center p-4"
          style={{ zIndex: 9999 }}
        >
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            style={{ zIndex: 1 }}
            onClick={() => {
              setShowCreateAdmin(false);
              setAdminError('');
              setNewAdminForm({ username: '', password: '', name: '' });
            }}
          />
          <div 
            className="bg-background border border-border rounded-lg p-6 w-full max-w-md animate-fade-in-up"
            style={{ zIndex: 2, position: 'relative' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => {
                setShowCreateAdmin(false);
                setAdminError('');
                setNewAdminForm({ username: '', password: '', name: '' });
              }}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-foreground/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserPlus className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-medium">{t('admin.adminManagement.createTitle')}</h3>
              <p className="text-sm text-muted-foreground mt-1">{t('admin.adminManagement.createDescription')}</p>
            </div>

            {adminError && (
              <div className="mb-4 p-3 border border-destructive/50 bg-destructive/10 text-destructive text-sm rounded-lg">
                {adminError}
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">{t('admin.adminManagement.name')}</label>
                <Input
                  type="text"
                  value={newAdminForm.name}
                  onChange={(e) => setNewAdminForm({ ...newAdminForm, name: e.target.value })}
                  placeholder={t('admin.adminManagement.namePlaceholder')}
                  className="h-11 bg-transparent"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">{t('admin.adminManagement.username')}</label>
                <Input
                  type="text"
                  value={newAdminForm.username}
                  onChange={(e) => setNewAdminForm({ ...newAdminForm, username: e.target.value.toLowerCase().replace(/\s/g, '') })}
                  placeholder={t('admin.adminManagement.usernamePlaceholder')}
                  className="h-11 bg-transparent"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">{t('admin.adminManagement.password')}</label>
                <div className="relative">
                  <Input
                    type={showNewAdminPassword ? "text" : "password"}
                    value={newAdminForm.password}
                    onChange={(e) => setNewAdminForm({ ...newAdminForm, password: e.target.value })}
                    placeholder="••••••••"
                    className="h-11 bg-transparent pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewAdminPassword(!showNewAdminPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showNewAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">{t('admin.adminManagement.passwordHint')}</p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setShowCreateAdmin(false);
                  setAdminError('');
                  setNewAdminForm({ username: '', password: '', name: '' });
                }}
              >
                {t('admin.adminManagement.cancel')}
              </Button>
              <Button
                type="button"
                className="flex-1 !bg-black !text-white dark:!bg-white dark:!text-black hover:opacity-90"
                onClick={handleCreateWorkerAdmin}
              >
                {t('admin.adminManagement.create')}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Worker Admin Confirmation Modal */}
      {deleteAdminModal.show && (
        <div 
          className="fixed inset-0 flex items-center justify-center p-4"
          style={{ zIndex: 9999 }}
        >
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            style={{ zIndex: 1 }}
            onClick={() => setDeleteAdminModal({ show: false, adminId: null, adminName: '' })}
          />
          <div 
            className="bg-background border border-border rounded-lg p-6 w-full max-w-md animate-fade-in-up"
            style={{ zIndex: 2, position: 'relative' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setDeleteAdminModal({ show: false, adminId: null, adminName: '' })}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-destructive" />
              </div>
              <h3 className="text-xl font-medium">{t('admin.adminManagement.deleteTitle')}</h3>
              <p className="text-sm text-muted-foreground mt-2">
                {t('admin.adminManagement.deleteMessage')} <strong>{deleteAdminModal.adminName}</strong>?
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setDeleteAdminModal({ show: false, adminId: null, adminName: '' })}
              >
                {t('admin.adminManagement.cancel')}
              </Button>
              <Button
                type="button"
                variant="destructive"
                className="flex-1"
                onClick={handleDeleteWorkerAdmin}
              >
                {t('admin.adminManagement.delete')}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Appointment Confirmation Modal */}
      {deleteModal.show && deleteModal.appointment && (
        <div 
          className="fixed inset-0 flex items-center justify-center p-4"
          style={{ zIndex: 9999 }}
        >
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            style={{ zIndex: 1 }}
            onClick={() => setDeleteModal({ show: false, appointment: null })}
          />
          <div 
            className="bg-background border border-border rounded-lg p-6 w-full max-w-md animate-fade-in-up"
            style={{ zIndex: 2, position: 'relative' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setDeleteModal({ show: false, appointment: null })}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-destructive" />
              </div>
              <h3 className="text-xl font-medium">{t('admin.deleteModal.title')}</h3>
              <p className="text-sm text-muted-foreground mt-2">{t('admin.deleteModal.message')}</p>
            </div>

            <div className="p-4 rounded-lg bg-muted/30 mb-6 text-sm">
              <p><strong>{deleteModal.appointment.user.firstName} {deleteModal.appointment.user.lastName}</strong></p>
              <p className="text-muted-foreground">{formatDate(deleteModal.appointment.date)} • {deleteModal.appointment.time}</p>
              <p className="text-muted-foreground">{deleteModal.appointment.service} with {deleteModal.appointment.barber}</p>
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setDeleteModal({ show: false, appointment: null })}
              >
                {t('admin.deleteModal.cancel')}
              </Button>
              <Button
                type="button"
                variant="destructive"
                className="flex-1"
                onClick={handleDelete}
              >
                {t('admin.deleteModal.confirm')}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Appointment Detail Modal */}
      {detailModal.show && detailModal.appointment && (
        <div 
          className="fixed inset-0 flex items-center justify-center p-4"
          style={{ zIndex: 9999 }}
        >
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            style={{ zIndex: 1 }}
            onClick={() => setDetailModal({ show: false, appointment: null })}
          />
          <div 
            className="bg-background border border-border rounded-lg p-6 w-full max-w-md animate-fade-in-up max-h-[90vh] overflow-y-auto"
            style={{ zIndex: 2, position: 'relative' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setDetailModal({ show: false, appointment: null })}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-medium mb-6">{t('admin.detail.title')}</h3>

            <div className="space-y-4">
              {/* Status */}
              <div className="flex justify-center">
                {getStatusBadge(detailModal.appointment.status)}
              </div>

              {/* Date & Time */}
              <div className="p-4 rounded-lg bg-muted/30 text-center">
                <div className="flex items-center justify-center gap-2 text-lg font-medium">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                  {formatDate(detailModal.appointment.date)}
                </div>
                <div className="flex items-center justify-center gap-2 text-2xl font-light mt-1">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                  {detailModal.appointment.time}
                </div>
              </div>

              {/* Client Info */}
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-3">{t('admin.detail.clientInfo')}</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{detailModal.appointment.user.firstName} {detailModal.appointment.user.lastName}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <a href={`mailto:${detailModal.appointment.user.email}`} className="text-sm hover:underline">
                      {detailModal.appointment.user.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <a href={`tel:+${detailModal.appointment.user.phone}`} className="font-medium hover:underline">
                      {formatPhone(detailModal.appointment.user.phone)}
                    </a>
                  </div>
                </div>
              </div>

              {/* Service Info */}
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-3">{t('admin.detail.serviceInfo')}</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <Scissors className="w-4 h-4 text-muted-foreground" />
                    <span>{detailModal.appointment.service}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span>{detailModal.appointment.barber}</span>
                  </div>
                </div>
              </div>
            </div>

            <Button
              type="button"
              className="w-full mt-6"
              variant="outline"
              onClick={() => setDetailModal({ show: false, appointment: null })}
            >
              {t('admin.detail.close')}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
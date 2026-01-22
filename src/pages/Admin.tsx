import { useState, useEffect } from "react";
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
  RefreshCw
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useAuth } from "@/context/AuthContext";
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
  const { getAllAppointments, deleteAppointmentAdmin } = useAuth();
  
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

  // Load appointments
  const loadAppointments = () => {
    const allAppointments = getAllAppointments();
    setAppointments(allAppointments);
    setFilteredAppointments(allAppointments);
  };

  useEffect(() => {
    loadAppointments();
  }, []);

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

  const uniqueBarbers = [...new Set(appointments.map(apt => apt.barber))];

  const stats = {
    total: appointments.length,
    upcoming: appointments.filter(a => a.status === 'upcoming').length,
    completed: appointments.filter(a => a.status === 'completed').length,
    cancelled: appointments.filter(a => a.status === 'cancelled').length
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src={logo} 
                alt="Logo" 
                className="w-10 h-10 rounded-full object-cover border border-border"
              />
              <div>
                <h1 className="text-lg font-medium">{t('admin.title')}</h1>
                <p className="text-xs text-muted-foreground">{t('admin.subtitle')}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={loadAppointments}
                className="h-9 w-9"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 rounded-lg border border-border bg-card">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">{t('admin.stats.total')}</p>
            <p className="text-2xl font-light mt-1">{stats.total}</p>
          </div>
          <div className="p-4 rounded-lg border border-border bg-card">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">{t('admin.stats.upcoming')}</p>
            <p className="text-2xl font-light mt-1 text-blue-600 dark:text-blue-400">{stats.upcoming}</p>
          </div>
          <div className="p-4 rounded-lg border border-border bg-card">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">{t('admin.stats.completed')}</p>
            <p className="text-2xl font-light mt-1 text-green-600 dark:text-green-400">{stats.completed}</p>
          </div>
          <div className="p-4 rounded-lg border border-border bg-card">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">{t('admin.stats.cancelled')}</p>
            <p className="text-2xl font-light mt-1 text-red-600 dark:text-red-400">{stats.cancelled}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
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
        <div className="hidden lg:block rounded-lg border border-border overflow-hidden">
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
            filteredAppointments.map((apt) => (
              <div 
                key={apt.id} 
                className="p-4 rounded-lg border border-border bg-card"
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

      {/* Delete Confirmation Modal */}
      {deleteModal.show && deleteModal.appointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setDeleteModal({ show: false, appointment: null })}
          />
          <div className="relative bg-background border border-border rounded-lg p-6 w-full max-w-md animate-fade-in-up">
            <button
              onClick={() => setDeleteModal({ show: false, appointment: null })}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-destructive" />
              </div>
              <h3 className="text-xl font-medium mb-2">{t('admin.deleteModal.title')}</h3>
              <p className="text-muted-foreground text-sm">
                {t('admin.deleteModal.message')}
              </p>
            </div>

            {/* Appointment Details */}
            <div className="bg-muted/30 rounded-lg p-4 mb-6 text-sm space-y-2">
              <p><span className="text-muted-foreground">{t('admin.table.client')}:</span> {deleteModal.appointment.user.firstName} {deleteModal.appointment.user.lastName}</p>
              <p><span className="text-muted-foreground">{t('admin.table.date')}:</span> {formatDate(deleteModal.appointment.date)}</p>
              <p><span className="text-muted-foreground">{t('admin.table.time')}:</span> {deleteModal.appointment.time}</p>
              <p><span className="text-muted-foreground">{t('admin.table.service')}:</span> {deleteModal.appointment.service}</p>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setDeleteModal({ show: false, appointment: null })}
              >
                {t('admin.deleteModal.cancel')}
              </Button>
              <Button
                className="flex-1 !bg-destructive !text-white hover:!bg-destructive/90"
                onClick={handleDelete}
              >
                {t('admin.deleteModal.confirm')}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {detailModal.show && detailModal.appointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setDetailModal({ show: false, appointment: null })}
          />
          <div className="relative bg-background border border-border rounded-lg p-6 w-full max-w-lg animate-fade-in-up max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setDetailModal({ show: false, appointment: null })}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <h3 className="text-xl font-medium mb-1">{t('admin.detail.title')}</h3>
              <p className="text-sm text-muted-foreground">ID: {detailModal.appointment.id}</p>
            </div>

            {/* Status */}
            <div className="mb-6">
              {getStatusBadge(detailModal.appointment.status)}
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 rounded-lg bg-muted/30">
                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                  <Calendar className="w-4 h-4" />
                  {t('admin.table.date')}
                </div>
                <p className="font-medium">{formatDate(detailModal.appointment.date)}</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/30">
                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                  <Clock className="w-4 h-4" />
                  {t('admin.table.time')}
                </div>
                <p className="font-medium text-xl">{detailModal.appointment.time}</p>
              </div>
            </div>

            {/* Client Info */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">
                {t('admin.detail.clientInfo')}
              </h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    <User className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">{detailModal.appointment.user.firstName} {detailModal.appointment.user.lastName}</p>
                    <p className="text-sm text-muted-foreground">Client</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 pl-1">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                  <a 
                    href={`mailto:${detailModal.appointment.user.email}`}
                    className="hover:underline"
                  >
                    {detailModal.appointment.user.email}
                  </a>
                </div>
                <div className="flex items-center gap-3 pl-1">
                  <Phone className="w-5 h-5 text-muted-foreground" />
                  <a 
                    href={`tel:+${detailModal.appointment.user.phone}`}
                    className="font-medium hover:underline"
                  >
                    {formatPhone(detailModal.appointment.user.phone)}
                  </a>
                </div>
              </div>
            </div>

            {/* Service Info */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">
                {t('admin.detail.serviceInfo')}
              </h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 pl-1">
                  <Scissors className="w-5 h-5 text-muted-foreground" />
                  <span>{detailModal.appointment.service}</span>
                </div>
                <div className="flex items-center gap-3 pl-1">
                  <User className="w-5 h-5 text-muted-foreground" />
                  <span>{detailModal.appointment.barber}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-border">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setDetailModal({ show: false, appointment: null })}
              >
                {t('admin.detail.close')}
              </Button>
              <Button
                variant="outline"
                className="flex-1 text-destructive border-destructive/30 hover:bg-destructive/10"
                onClick={() => {
                  setDetailModal({ show: false, appointment: null });
                  setDeleteModal({ show: true, appointment: detailModal.appointment });
                }}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {t('admin.delete')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;

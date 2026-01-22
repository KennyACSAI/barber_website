import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Clock, User, Settings, LogOut, Trash2, X, Scissors, Phone } from "lucide-react";
import Navigation from "@/components/Navigation";
import { useAuth } from "@/context/AuthContext";

const Profile = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, isAuthenticated, appointments, logout, updateUser, deleteAccount, cancelAppointment } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'appointments' | 'settings'>('appointments');
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || ''
  });

  // Redirect if not authenticated
  if (!isAuthenticated || !user) {
    navigate("/login");
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSaveProfile = () => {
    updateUser(editForm);
    setIsEditing(false);
  };

  const handleDeleteAccount = () => {
    deleteAccount();
    navigate('/');
  };

  const formatPhone = (phone: string) => {
    if (!phone) return '-';
    if (phone.length <= 2) return `+${phone}`;
    if (phone.length <= 5) return `+${phone.slice(0, 2)} ${phone.slice(2)}`;
    if (phone.length <= 8) return `+${phone.slice(0, 2)} ${phone.slice(2, 5)} ${phone.slice(5)}`;
    return `+${phone.slice(0, 2)} ${phone.slice(2, 5)} ${phone.slice(5, 8)} ${phone.slice(8)}`;
  };

  const handlePhoneChange = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    // Limit to 15 digits
    const limited = digits.slice(0, 15);
    setEditForm({ ...editForm, phone: limited });
  };

  const upcomingAppointments = appointments.filter(apt => apt.status === 'upcoming');
  const pastAppointments = appointments.filter(apt => apt.status !== 'upcoming');

  const formatAppointmentDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('it-IT', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div id="page-content" className="lang-transition">
        <section className="min-h-screen pt-24 pb-12 px-6">
          <div className="max-w-4xl mx-auto">
            
            {/* Header */}
            <div className="text-center mb-12">
              <div className="w-20 h-20 bg-foreground/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <User className="w-10 h-10 text-foreground" />
              </div>
              <h1 className="text-4xl md:text-5xl font-light text-architectural mb-2">
                {user.firstName} {user.lastName}
              </h1>
              <p className="text-muted-foreground">{user.email}</p>
              {user.phone && (
                <p className="text-muted-foreground mt-1 flex items-center justify-center gap-2">
                  <Phone className="w-4 h-4" />
                  {formatPhone(user.phone)}
                </p>
              )}
            </div>

            {/* Tabs */}
            <div className="flex justify-center mb-12">
              <div className="flex border border-border rounded-lg overflow-hidden">
                <button
                  onClick={() => setActiveTab('appointments')}
                  className={`px-6 py-3 text-minimal transition-colors duration-300 ${
                    activeTab === 'appointments'
                      ? 'bg-foreground text-background'
                      : 'bg-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Calendar className="w-4 h-4 inline-block mr-2" />
                  {t('profile.tabs.appointments')}
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`px-6 py-3 text-minimal transition-colors duration-300 ${
                    activeTab === 'settings'
                      ? 'bg-foreground text-background'
                      : 'bg-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Settings className="w-4 h-4 inline-block mr-2" />
                  {t('profile.tabs.settings')}
                </button>
              </div>
            </div>

            {/* Appointments Tab */}
            {activeTab === 'appointments' && (
              <div className="space-y-8">
                {/* Book New Button */}
                <div className="text-center">
                  <Button
                    onClick={() => navigate('/booking')}
                    className="!bg-black !text-white dark:!bg-white dark:!text-black hover:opacity-90 text-minimal"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    {t('profile.newAppointment')}
                  </Button>
                </div>

                {/* Upcoming Appointments */}
                <div>
                  <h3 className="text-minimal text-muted-foreground mb-6">{t('profile.upcoming')}</h3>
                  {upcomingAppointments.length > 0 ? (
                    <div className="space-y-4">
                      {upcomingAppointments.map((apt) => (
                        <div key={apt.id} className="p-6 border border-border rounded-lg">
                          <div className="flex justify-between items-start">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                <span className="font-medium">{formatAppointmentDate(apt.date)}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-muted-foreground" />
                                <span>{apt.time}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Scissors className="w-4 h-4 text-muted-foreground" />
                                <span>{apt.service}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-muted-foreground" />
                                <span>{apt.barber}</span>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => cancelAppointment(apt.id)}
                              className="text-destructive hover:text-destructive/80"
                            >
                              {t('profile.cancel')}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 border border-dashed border-border rounded-lg">
                      <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">{t('profile.noUpcoming')}</p>
                    </div>
                  )}
                </div>

                {/* Past Appointments */}
                {pastAppointments.length > 0 && (
                  <div>
                    <h3 className="text-minimal text-muted-foreground mb-6">{t('profile.past')}</h3>
                    <div className="space-y-4">
                      {pastAppointments.map((apt) => (
                        <div key={apt.id} className="p-6 border border-border rounded-lg opacity-60">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                <span>{formatAppointmentDate(apt.date)} - {apt.time}</span>
                              </div>
                              <span className={`text-minimal px-2 py-1 rounded ${
                                apt.status === 'cancelled' 
                                  ? 'bg-destructive/10 text-destructive' 
                                  : 'bg-muted text-muted-foreground'
                              }`}>
                                {apt.status === 'cancelled' ? t('profile.cancelled') : t('profile.completed')}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">{apt.service} • {apt.barber}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-8 max-w-md mx-auto">
                {/* Edit Profile */}
                <div className="p-6 border border-border rounded-lg">
                  <h3 className="text-minimal text-muted-foreground mb-6">{t('profile.editProfile')}</h3>
                  
                  {isEditing ? (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-minimal text-muted-foreground">{t('auth.firstName')}</label>
                        <Input
                          value={editForm.firstName}
                          onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                          className="h-12 bg-transparent border-border focus:border-foreground transition-colors duration-300"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-minimal text-muted-foreground">{t('auth.lastName')}</label>
                        <Input
                          value={editForm.lastName}
                          onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                          className="h-12 bg-transparent border-border focus:border-foreground transition-colors duration-300"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-minimal text-muted-foreground">{t('auth.phone')}</label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            value={formatPhone(editForm.phone)}
                            onChange={(e) => handlePhoneChange(e.target.value)}
                            className="h-12 bg-transparent border-border focus:border-foreground transition-colors duration-300 pl-12"
                            placeholder="+39 329 206 9578"
                          />
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <Button
                          onClick={handleSaveProfile}
                          className="!bg-black !text-white dark:!bg-white dark:!text-black hover:opacity-90 text-minimal flex-1"
                        >
                          {t('profile.save')}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setIsEditing(false)}
                          className="text-minimal flex-1"
                        >
                          {t('profile.cancelEdit')}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground">{t('auth.firstName')}</p>
                        <p className="text-lg">{user.firstName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{t('auth.lastName')}</p>
                        <p className="text-lg">{user.lastName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{t('auth.email')}</p>
                        <p className="text-lg">{user.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{t('auth.phone')}</p>
                        <p className="text-lg flex items-center gap-2">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          {user.phone ? formatPhone(user.phone) : '-'}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setEditForm({ firstName: user.firstName, lastName: user.lastName, phone: user.phone || '' });
                          setIsEditing(true);
                        }}
                        className="w-full text-minimal"
                      >
                        {t('profile.edit')}
                      </Button>
                    </div>
                  )}
                </div>

                {/* Logout */}
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="w-full text-minimal"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  {t('profile.logout')}
                </Button>

                {/* Delete Account */}
                <div className="pt-8 border-t border-border">
                  <h3 className="text-minimal text-destructive mb-4">{t('profile.dangerZone')}</h3>
                  <Button
                    variant="outline"
                    onClick={() => setShowDeleteModal(true)}
                    className="w-full text-destructive border-destructive/50 hover:bg-destructive/10 text-minimal"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    {t('profile.deleteAccount')}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowDeleteModal(false)}
          />
          <div className="relative bg-background border border-border p-8 w-full max-w-md mx-6 animate-fade-in-up">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors duration-300"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-destructive" />
              </div>
              <h3 className="text-2xl font-light text-architectural mb-2">{t('profile.deleteModal.title')}</h3>
              <p className="text-muted-foreground">{t('profile.deleteModal.message')}</p>
            </div>

            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 text-minimal"
              >
                {t('profile.deleteModal.cancel')}
              </Button>
              <Button
                onClick={handleDeleteAccount}
                className="flex-1 !bg-destructive !text-white hover:!bg-destructive/90 text-minimal"
              >
                {t('profile.deleteModal.confirm')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;

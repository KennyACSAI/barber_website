import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Check, User, Scissors, Calendar, Clock } from "lucide-react";
import Navigation from "@/components/Navigation";
import { useAuth } from "@/context/AuthContext";
import ownerPhoto from "@/assets/owner_photo.jpg";
import barberPhoto from "@/assets/barber_photo.jpg";

interface BookedSlot {
  date: string;
  time: string;
  barber: string;
  service: string;
}

const Booking = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated, addAppointment } = useAuth();
  const [step, setStep] = useState(1);
  const [selectedBarber, setSelectedBarber] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [bookedSlots, setBookedSlots] = useState<BookedSlot[]>([]);

  // Load all booked appointments from localStorage
  useEffect(() => {
    const loadBookedSlots = () => {
      const slots: BookedSlot[] = [];
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Get appointments from all users
      users.forEach((user: any) => {
        const userAppointments = JSON.parse(localStorage.getItem(`appointments_${user.id}`) || '[]');
        userAppointments.forEach((apt: any) => {
          if (apt.status === 'upcoming') {
            slots.push({
              date: apt.date,
              time: apt.time,
              barber: apt.barber,
              service: apt.service
            });
          }
        });
      });
      
      setBookedSlots(slots);
    };
    
    loadBookedSlots();
  }, []);

  // Redirect if not authenticated
  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  const barbers = [
    {
      id: "luca",
      name: "Luca Franco",
      role: t('barbers.roles.owner'),
      image: ownerPhoto
    },
    {
      id: "alessio",
      name: "Alessio De Angelis",
      role: t('barbers.roles.barber'),
      image: barberPhoto
    }
  ];

  const services = [
    { id: "classic", name: t('services.items.classic.title'), duration: "45 min", price: "€25", durationMinutes: 45 },
    { id: "beard", name: t('services.items.beard.title'), duration: "30 min", price: "€15", durationMinutes: 30 },
    { id: "shave", name: t('services.items.shave.title'), duration: "40 min", price: "€20", durationMinutes: 40 },
    { id: "package", name: t('services.items.package.title'), duration: "90 min", price: "€50", durationMinutes: 90 }
  ];

  // Service name to duration mapping (for booked appointments - handles both IT and EN)
  const serviceDurations: { [key: string]: number } = {
    // English names
    "CLASSIC CUT": 45,
    "BEARD TRIM": 30,
    "HOT TOWEL SHAVE": 40,
    "FULL PACKAGE": 90,
    // Italian names
    "TAGLIO CLASSICO": 45,
    "RIFINITURA BARBA": 30,
    "RASATURA CON ASCIUGAMANO CALDO": 40,
    "PACCHETTO COMPLETO": 90
  };

  // Get duration for a service name (from booked appointments)
  const getServiceDuration = (serviceName: string): number => {
    return serviceDurations[serviceName.toUpperCase()] || 30;
  };

  // Convert time string "HH:MM" to minutes from midnight
  const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  // Check if two time ranges overlap
  const doTimesOverlap = (start1: number, end1: number, start2: number, end2: number): boolean => {
    return start1 < end2 && end1 > start2;
  };

  const allTimeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "14:00", "14:30", "15:00", "15:30", "16:00",
    "16:30", "17:00", "17:30", "18:00", "18:30", "19:00"
  ];

  // Format date to YYYY-MM-DD string (moved up so other functions can use it)
  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const formatDisplayDate = (date: Date) => {
    const days = ['DOM', 'LUN', 'MAR', 'MER', 'GIO', 'VEN', 'SAB'];
    const months = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];
    return {
      day: days[date.getDay()],
      date: date.getDate(),
      month: months[date.getMonth()]
    };
  };

  // Check if a time slot is available for the selected service
  // Considers: overlap with existing bookings AND if service fits before closing time
  const isSlotBooked = (date: string, time: string): boolean => {
    if (!selectedBarber || !selectedService) return false;
    
    const barberName = barbers.find(b => b.id === selectedBarber)?.name || '';
    const userServiceDuration = services.find(s => s.id === selectedService)?.durationMinutes || 30;
    
    const slotStart = timeToMinutes(time);
    const slotEnd = slotStart + userServiceDuration;
    
    // Shop closes at 19:30 (1170 minutes from midnight)
    const closingTime = 19 * 60 + 30; // 19:30
    
    // Check if selected service would extend past closing time
    if (slotEnd > closingTime) {
      return true; // Block this slot - service won't fit
    }
    
    // Check against all booked slots for this barber on this date
    return bookedSlots.some(slot => {
      if (slot.date !== date || slot.barber !== barberName) return false;
      
      const bookedStart = timeToMinutes(slot.time);
      const bookedDuration = getServiceDuration(slot.service);
      const bookedEnd = bookedStart + bookedDuration;
      
      // Check if the requested slot would overlap with this booking
      return doTimesOverlap(slotStart, slotEnd, bookedStart, bookedEnd);
    });
  };

  // Get reason why slot is unavailable (for UI feedback)
  const getSlotBlockReason = (date: string, time: string): string | null => {
    if (!selectedBarber || !selectedService) return null;
    
    const barberName = barbers.find(b => b.id === selectedBarber)?.name || '';
    const userServiceDuration = services.find(s => s.id === selectedService)?.durationMinutes || 30;
    
    const slotStart = timeToMinutes(time);
    const slotEnd = slotStart + userServiceDuration;
    
    // Shop closes at 19:30
    const closingTime = 19 * 60 + 30;
    
    if (slotEnd > closingTime) {
      return 'closing'; // Service would extend past closing
    }
    
    // Check for overlap
    const hasOverlap = bookedSlots.some(slot => {
      if (slot.date !== date || slot.barber !== barberName) return false;
      const bookedStart = timeToMinutes(slot.time);
      const bookedDuration = getServiceDuration(slot.service);
      const bookedEnd = bookedStart + bookedDuration;
      return doTimesOverlap(slotStart, slotEnd, bookedStart, bookedEnd);
    });
    
    if (hasOverlap) return 'taken';
    return null;
  };

  // Get available time slots for a specific date
  const getAvailableTimeSlots = (dateStr: string): string[] => {
    const today = new Date();
    const todayStr = formatDate(today);
    
    // If it's today, filter out past times + 1 hour buffer
    if (dateStr === todayStr) {
      const currentHour = today.getHours();
      const currentMinute = today.getMinutes();
      const bufferTime = currentHour + 1 + (currentMinute >= 30 ? 0.5 : 0);
      
      return allTimeSlots.filter(time => {
        const [hours, minutes] = time.split(':').map(Number);
        const slotTime = hours + (minutes / 60);
        return slotTime >= bufferTime;
      });
    }
    
    return allTimeSlots;
  };

  // Generate available dates including today
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    
    // Start from today (i=0) instead of tomorrow
    for (let i = 0; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      // Skip Sundays (0) and Mondays (1)
      if (date.getDay() !== 0 && date.getDay() !== 1) {
        const dateStr = formatDate(date);
        // Only include today if there are available time slots
        if (i === 0) {
          if (getAvailableTimeSlots(dateStr).length > 0) {
            dates.push(date);
          }
        } else {
          dates.push(date);
        }
      }
    }
    return dates;
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
      scrollToTop();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      scrollToTop();
    }
  };

  const handleBooking = async () => {
    if (!selectedBarber || !selectedService || !selectedDate || !selectedTime) return;

    setIsBooking(true);
    
    // Simulate API call
    setTimeout(() => {
      addAppointment({
        barber: barbers.find(b => b.id === selectedBarber)?.name || '',
        service: services.find(s => s.id === selectedService)?.name || '',
        date: selectedDate,
        time: selectedTime
      });
      
      setIsBooking(false);
      setStep(5); // Success step
    }, 1500);
  };

  const canProceed = () => {
    switch (step) {
      case 1: return !!selectedBarber;
      case 2: return !!selectedService;
      case 3: return !!selectedDate;
      case 4: return !!selectedTime;
      default: return false;
    }
  };

  const steps = [
    { num: 1, icon: User, label: t('booking.steps.barber') },
    { num: 2, icon: Scissors, label: t('booking.steps.service') },
    { num: 3, icon: Calendar, label: t('booking.steps.date') },
    { num: 4, icon: Clock, label: t('booking.steps.time') }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div id="page-content" className="lang-transition">
        <section className="min-h-screen pt-24 pb-12 px-6">
          <div className="max-w-4xl mx-auto">
            
            {step < 5 ? (
              <>
                {/* Header */}
                <div className="text-center mb-12">
                  <h1 className="text-minimal text-muted-foreground mb-4">{t('booking.label')}</h1>
                  <h2 className="text-4xl md:text-5xl font-light text-architectural">
                    {t('booking.title')}
                  </h2>
                </div>

                {/* Progress Steps */}
                <div className="flex justify-center mb-12">
                  <div className="flex items-center space-x-4 md:space-x-8">
                    {steps.map((s, index) => (
                      <div key={s.num} className="flex items-center">
                        <div 
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${
                            step >= s.num 
                              ? 'bg-foreground text-background' 
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {step > s.num ? (
                            <Check className="w-5 h-5" />
                          ) : (
                            <s.icon className="w-5 h-5" />
                          )}
                        </div>
                        {index < steps.length - 1 && (
                          <div className={`hidden md:block w-16 h-px mx-4 transition-colors duration-300 ${
                            step > s.num ? 'bg-foreground' : 'bg-muted'
                          }`} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Step Content */}
                <div>
                  
                  {/* Step 1: Select Barber */}
                  {step === 1 && (
                    <div className="space-y-6">
                      <h3 className="text-center text-xl font-light text-muted-foreground mb-8">
                        {t('booking.selectBarber')}
                      </h3>
                      <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                        {barbers.map((barber) => (
                          <button
                            key={barber.id}
                            onClick={() => setSelectedBarber(barber.id)}
                            className={`p-6 border rounded-lg transition-all duration-300 text-left ${
                              selectedBarber === barber.id
                                ? 'border-foreground bg-foreground/5'
                                : 'border-border hover:border-foreground/50'
                            }`}
                          >
                            <div className="flex items-center gap-4">
                              <img 
                                src={barber.image} 
                                alt={barber.name}
                                className="w-16 h-16 rounded-full object-cover"
                              />
                              <div>
                                <h4 className="text-lg font-medium">{barber.name}</h4>
                                <p className="text-sm text-muted-foreground">{barber.role}</p>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Step 2: Select Service */}
                  {step === 2 && (
                    <div className="space-y-6">
                      <h3 className="text-center text-xl font-light text-muted-foreground mb-8">
                        {t('booking.selectService')}
                      </h3>
                      <div className="grid gap-4 max-w-2xl mx-auto">
                        {services.map((service) => (
                          <button
                            key={service.id}
                            onClick={() => setSelectedService(service.id)}
                            className={`p-6 border rounded-lg transition-all duration-300 text-left ${
                              selectedService === service.id
                                ? 'border-foreground bg-foreground/5'
                                : 'border-border hover:border-foreground/50'
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <h4 className="text-lg font-medium">{service.name}</h4>
                                <p className="text-sm text-muted-foreground">{service.duration}</p>
                              </div>
                              <span className="text-xl font-light">{service.price}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Step 3: Select Date */}
                  {step === 3 && (
                    <div className="space-y-6">
                      <h3 className="text-center text-xl font-light text-muted-foreground mb-8">
                        {t('booking.selectDate')}
                      </h3>
                      <div className="grid grid-cols-4 md:grid-cols-6 gap-3 max-w-2xl mx-auto">
                        {getAvailableDates().map((date) => {
                          const display = formatDisplayDate(date);
                          const dateStr = formatDate(date);
                          const isToday = dateStr === formatDate(new Date());
                          return (
                            <button
                              key={dateStr}
                              onClick={() => {
                                setSelectedDate(dateStr);
                                setSelectedTime(null); // Reset time when date changes
                              }}
                              className={`p-4 border rounded-lg transition-all duration-300 text-center relative ${
                                selectedDate === dateStr
                                  ? 'border-foreground bg-foreground/5'
                                  : 'border-border hover:border-foreground/50'
                              }`}
                            >
                              {isToday && (
                                <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[10px] bg-foreground text-background px-2 py-0.5 rounded-full">
                                  {t('booking.today')}
                                </span>
                              )}
                              <p className="text-xs text-muted-foreground">{display.day}</p>
                              <p className="text-2xl font-light">{display.date}</p>
                              <p className="text-xs text-muted-foreground">{display.month}</p>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Step 4: Select Time */}
                  {step === 4 && selectedDate && (
                    <div className="space-y-6">
                      <h3 className="text-center text-xl font-light text-muted-foreground mb-8">
                        {t('booking.selectTime')}
                      </h3>
                      <div className="grid grid-cols-3 md:grid-cols-6 gap-3 max-w-2xl mx-auto">
                        {getAvailableTimeSlots(selectedDate).map((time) => {
                          const blockReason = getSlotBlockReason(selectedDate, time);
                          const isBlocked = blockReason !== null;
                          return (
                            <button
                              key={time}
                              onClick={() => !isBlocked && setSelectedTime(time)}
                              disabled={isBlocked}
                              className={`p-4 border rounded-lg transition-all duration-300 relative ${
                                isBlocked
                                  ? 'border-border bg-muted/50 cursor-not-allowed'
                                  : selectedTime === time
                                    ? 'border-foreground bg-foreground/5'
                                    : 'border-border hover:border-foreground/50'
                              }`}
                            >
                              <span className={`text-lg font-light ${isBlocked ? 'text-muted-foreground line-through' : ''}`}>
                                {time}
                              </span>
                              {blockReason === 'taken' && (
                                <span className="block text-xs text-muted-foreground mt-1">
                                  {t('booking.taken')}
                                </span>
                              )}
                              {blockReason === 'closing' && (
                                <span className="block text-xs text-muted-foreground mt-1">
                                  {t('booking.tooLate')}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                      {getAvailableTimeSlots(selectedDate).length === 0 && (
                        <p className="text-center text-muted-foreground">
                          {t('booking.noSlots')}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center mt-8 max-w-2xl mx-auto">
                  <Button
                    variant="ghost"
                    onClick={handleBack}
                    disabled={step === 1}
                    className="text-minimal"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    {t('booking.back')}
                  </Button>

                  {step < 4 ? (
                    <Button
                      onClick={handleNext}
                      disabled={!canProceed()}
                      className="!bg-black !text-white dark:!bg-white dark:!text-black hover:opacity-90 text-minimal"
                    >
                      {t('booking.next')}
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleBooking}
                      disabled={!canProceed() || isBooking}
                      className="!bg-black !text-white dark:!bg-white dark:!text-black hover:opacity-90 text-minimal"
                    >
                      {isBooking ? t('auth.loading') : t('booking.confirm')}
                    </Button>
                  )}
                </div>

                {/* Summary */}
                {(selectedBarber || selectedService || selectedDate || selectedTime) && (
                  <div className="mt-6 p-6 border border-border rounded-lg max-w-2xl mx-auto">
                    <h4 className="text-minimal text-muted-foreground mb-4">{t('booking.summary')}</h4>
                    <div className="space-y-2 text-sm">
                      {selectedBarber && (
                        <p><span className="text-muted-foreground">{t('booking.steps.barber')}:</span> {barbers.find(b => b.id === selectedBarber)?.name}</p>
                      )}
                      {selectedService && (
                        <p><span className="text-muted-foreground">{t('booking.steps.service')}:</span> {services.find(s => s.id === selectedService)?.name}</p>
                      )}
                      {selectedDate && (
                        <p><span className="text-muted-foreground">{t('booking.steps.date')}:</span> {selectedDate}</p>
                      )}
                      {selectedTime && (
                        <p><span className="text-muted-foreground">{t('booking.steps.time')}:</span> {selectedTime}</p>
                      )}
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* Success Step */
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-foreground text-background rounded-full flex items-center justify-center mx-auto mb-8">
                  <Check className="w-10 h-10" />
                </div>
                <h2 className="text-4xl md:text-5xl font-light text-architectural mb-4">
                  {t('booking.success.title')}
                </h2>
                <p className="text-xl text-muted-foreground mb-12">
                  {t('booking.success.message')}
                </p>
                <div className="space-x-4">
                  <Button
                    onClick={() => navigate('/profile')}
                    className="!bg-black !text-white dark:!bg-white dark:!text-black hover:opacity-90 text-minimal"
                  >
                    {t('booking.success.viewAppointments')}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate('/')}
                    className="text-minimal"
                  >
                    {t('booking.success.backHome')}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Booking;
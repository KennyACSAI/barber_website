import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Check, User, Scissors, Calendar, Clock } from "lucide-react";
import Navigation from "@/components/Navigation";
import { useAuth } from "@/context/AuthContext";
import ownerPhoto from "@/assets/owner_photo.jpg";
import barberPhoto from "@/assets/barber_photo.jpg";

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
    { id: "classic", name: t('services.items.classic.title'), duration: "45 min", price: "€25" },
    { id: "beard", name: t('services.items.beard.title'), duration: "30 min", price: "€15" },
    { id: "shave", name: t('services.items.shave.title'), duration: "40 min", price: "€20" },
    { id: "package", name: t('services.items.package.title'), duration: "90 min", price: "€50" }
  ];

  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "14:00", "14:30", "15:00", "15:30", "16:00",
    "16:30", "17:00", "17:30", "18:00", "18:30", "19:00"
  ];

  // Generate next 14 days
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      // Skip Sundays (0) and Mondays (1)
      if (date.getDay() !== 0 && date.getDay() !== 1) {
        dates.push(date);
      }
    }
    return dates;
  };

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

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
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
                <div className="min-h-[400px]">
                  
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
                          return (
                            <button
                              key={dateStr}
                              onClick={() => setSelectedDate(dateStr)}
                              className={`p-4 border rounded-lg transition-all duration-300 text-center ${
                                selectedDate === dateStr
                                  ? 'border-foreground bg-foreground/5'
                                  : 'border-border hover:border-foreground/50'
                              }`}
                            >
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
                  {step === 4 && (
                    <div className="space-y-6">
                      <h3 className="text-center text-xl font-light text-muted-foreground mb-8">
                        {t('booking.selectTime')}
                      </h3>
                      <div className="grid grid-cols-3 md:grid-cols-6 gap-3 max-w-2xl mx-auto">
                        {timeSlots.map((time) => (
                          <button
                            key={time}
                            onClick={() => setSelectedTime(time)}
                            className={`p-4 border rounded-lg transition-all duration-300 ${
                              selectedTime === time
                                ? 'border-foreground bg-foreground/5'
                                : 'border-border hover:border-foreground/50'
                            }`}
                          >
                            <span className="text-lg font-light">{time}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center mt-12 max-w-2xl mx-auto">
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
                  <div className="mt-12 p-6 border border-border rounded-lg max-w-2xl mx-auto">
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

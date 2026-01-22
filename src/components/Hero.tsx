import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import mainPhoto from "@/assets/main_photo.jpg";
import logo from "@/assets/logo.jpg";
import { useAuth } from "@/context/AuthContext";

const Hero = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleAppointment = () => {
    // If logged in, go to booking. Otherwise go to login.
    navigate(isAuthenticated ? "/booking" : "/login");
  };

  return (
    <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Blur */}
      <div className="absolute inset-0">
        <img 
          src={mainPhoto} 
          alt="San Lorenzo Barber" 
          className="w-full h-full object-cover blur-[6px] scale-105"
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/60" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        {/* Logo */}
        <div className="mb-8 reveal">
          <img 
            src={logo} 
            alt="San Lorenzo Barber Logo" 
            className="w-32 h-32 md:w-40 md:h-40 mx-auto rounded-full object-cover border-4 border-white/20"
          />
        </div>
        
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-light text-white text-architectural mb-6 reveal">
          {t('hero.title1')}
          <br />
          {t('hero.title2')}
        </h1>
        <p className="text-lg md:text-xl text-white/80 font-light tracking-wide max-w-2xl mx-auto reveal-delayed mb-10">
          {t('hero.subtitle')}
        </p>
        
        {/* Big Appointment Button */}
        <div className="reveal-delayed">
          <Button 
            size="lg"
            className="bg-white text-black hover:bg-white/90 text-lg px-12 py-8 h-auto font-medium tracking-wide"
            onClick={handleAppointment}
          >
            {t('hero.cta')}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;

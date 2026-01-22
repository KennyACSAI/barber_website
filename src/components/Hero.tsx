import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import mainPhoto from "@/assets/main_photo.jpg";

const Hero = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleAppointment = () => {
    navigate("/login");
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
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-light text-white text-architectural mb-8 reveal">
          {t('hero.title1')}
          <br />
          {t('hero.title2')}
        </h1>
        <p className="text-xl md:text-2xl text-white/80 font-light tracking-wide max-w-2xl mx-auto reveal-delayed mb-12">
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

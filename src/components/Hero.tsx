import { Button } from "@/components/ui/button";
import mainPhoto from "@/assets/main_photo.jpg";

const Hero = () => {
  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src={mainPhoto} 
          alt="San Lorenzo Barber" 
          className="w-full h-full object-cover"
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/60" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-light text-white text-architectural mb-8 reveal">
          SAN LORENZO
          <br />
          BARBER
        </h1>
        <p className="text-xl md:text-2xl text-white/80 font-light tracking-wide max-w-2xl mx-auto reveal-delayed mb-12">
          Premium grooming experience in the heart of Roma
        </p>
        
        {/* Big Appointment Button */}
        <div className="reveal-delayed">
          <Button 
            size="lg"
            className="bg-white text-black hover:bg-white/90 text-lg px-12 py-8 h-auto font-medium tracking-wide"
            onClick={scrollToContact}
          >
            MAKE APPOINTMENT
          </Button>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 reveal-delayed">
        <div className="w-px h-16 bg-white/40" />
        <div className="text-minimal text-white/60 mt-4 rotate-90 origin-center">
          SCROLL
        </div>
      </div>
    </section>
  );
};

export default Hero;

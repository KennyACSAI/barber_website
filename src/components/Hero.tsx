import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Solid Background */}
      <div className="absolute inset-0 bg-foreground" />
      
      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-light text-background text-architectural mb-8 reveal">
          SAN LORENZO
          <br />
          BARBER
        </h1>
        <p className="text-xl md:text-2xl text-background/80 font-light tracking-wide max-w-2xl mx-auto reveal-delayed mb-12">
          Premium grooming experience in the heart of Roma
        </p>
        
        {/* Big Appointment Button */}
        <div className="reveal-delayed">
          <Button 
            size="lg"
            className="bg-background text-foreground hover:bg-background/90 text-lg px-12 py-8 h-auto font-medium tracking-wide"
            asChild
          >
            <a href="https://www.fresha.com/lvp/ferro-barber-shop-via-tiburtina-roma-VEQ701" target="_blank" rel="noopener noreferrer">
              MAKE APPOINTMENT
            </a>
          </Button>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 reveal-delayed">
        <div className="w-px h-16 bg-background/40" />
        <div className="text-minimal text-background/60 mt-4 rotate-90 origin-center">
          SCROLL
        </div>
      </div>
    </section>
  );
};

export default Hero;

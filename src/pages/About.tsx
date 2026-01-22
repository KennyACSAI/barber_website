import Navigation from "@/components/Navigation";

const About = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <section className="pt-32 pb-32 bg-background">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-20 items-center">
              <div>
                <h1 className="text-minimal text-muted-foreground mb-4">ABOUT</h1>
                <h2 className="text-4xl md:text-6xl font-light text-architectural mb-12">
                  Our Philosophy
                </h2>
                
                <div className="space-y-8">
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    We believe grooming is an art form that deserves time, attention, 
                    and expertise. Our barbershop combines traditional techniques with 
                    modern style for an exceptional experience.
                  </p>
                  
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Established in 2015, our team of master barbers has served over 
                    10,000 clients. Every visit begins with understanding your vision 
                    and ends with you looking your absolute best.
                  </p>
                </div>
              </div>
              
              <div className="space-y-12">
                <div>
                  <h3 className="text-minimal text-muted-foreground mb-6">APPROACH</h3>
                  <div className="space-y-6">
                    <div className="border-l-2 border-foreground pl-6">
                      <h4 className="text-lg font-medium mb-2">Consultation</h4>
                      <p className="text-muted-foreground">Understanding your style, face shape, and lifestyle</p>
                    </div>
                    <div className="border-l-2 border-foreground pl-6">
                      <h4 className="text-lg font-medium mb-2">Precision</h4>
                      <p className="text-muted-foreground">Meticulous attention to every detail and finish</p>
                    </div>
                    <div className="border-l-2 border-foreground pl-6">
                      <h4 className="text-lg font-medium mb-2">Experience</h4>
                      <p className="text-muted-foreground">Relaxing atmosphere with premium products and service</p>
                    </div>
                  </div>
                </div>
                
                <div className="pt-8 border-t border-border">
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-minimal text-muted-foreground mb-2">ESTABLISHED</h3>
                      <p className="text-xl">2015</p>
                    </div>
                    <div>
                      <h3 className="text-minimal text-muted-foreground mb-2">CLIENTS</h3>
                      <p className="text-xl">10,000+</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;

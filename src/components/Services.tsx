const Services = () => {
  const services = [
    {
      number: "01",
      title: "CLASSIC CUT",
      description: "Traditional barbering techniques with modern precision for the perfect haircut"
    },
    {
      number: "02", 
      title: "BEARD TRIM",
      description: "Expert shaping and styling to keep your beard looking sharp and well-groomed"
    },
    {
      number: "03",
      title: "HOT TOWEL SHAVE",
      description: "Luxurious straight razor shave with hot towels for the smoothest finish"
    },
    {
      number: "04",
      title: "GROOMING PACKAGE",
      description: "Complete styling experience including haircut, beard work, and facial treatment"
    }
  ];

  return (
    <section id="services" className="py-32 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20">
            <h2 className="text-minimal text-muted-foreground mb-4">SERVICES</h2>
            <h3 className="text-4xl md:text-6xl font-light text-architectural">
              What We Offer
            </h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-x-20 gap-y-16">
            {services.map((service, index) => (
              <div key={index} className="group">
                <div className="flex items-start space-x-6">
                  <span className="text-minimal text-muted-foreground font-medium">
                    {service.number}
                  </span>
                  <div>
                    <h4 className="text-2xl font-light mb-4 text-architectural group-hover:text-muted-foreground transition-colors duration-500">
                      {service.title}
                    </h4>
                    <p className="text-muted-foreground leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;

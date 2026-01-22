import { useTranslation } from "react-i18next";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const Services = () => {
  const { t } = useTranslation();
  
  // Scroll animation hooks
  const headerAnimation = useScrollAnimation({ threshold: 0.2 });
  const servicesAnimation = useScrollAnimation({ threshold: 0.1, rootMargin: "0px 0px -100px 0px" });

  const services = [
    {
      number: "01",
      titleKey: "services.items.classic.title",
      descKey: "services.items.classic.description"
    },
    {
      number: "02", 
      titleKey: "services.items.beard.title",
      descKey: "services.items.beard.description"
    },
    {
      number: "03",
      titleKey: "services.items.shave.title",
      descKey: "services.items.shave.description"
    },
    {
      number: "04",
      titleKey: "services.items.package.title",
      descKey: "services.items.package.description"
    }
  ];

  return (
    <section id="services" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div ref={headerAnimation.ref} className="mb-12 section-header">
            <h2 
              className={`text-minimal text-muted-foreground mb-4 scroll-animate scroll-fade-up ${
                headerAnimation.isVisible ? 'is-visible' : ''
              }`}
            >
              {t('services.label')}
            </h2>
            <h3 
              className={`text-4xl md:text-6xl font-light text-architectural scroll-animate scroll-blur-up ${
                headerAnimation.isVisible ? 'is-visible' : ''
              }`}
              style={{ transitionDelay: '100ms' }}
            >
              {t('services.title')}
            </h3>
          </div>
          
          {/* Services Grid */}
          <div 
            ref={servicesAnimation.ref}
            className="grid md:grid-cols-2 gap-x-20 gap-y-16"
          >
            {services.map((service, index) => (
              <div 
                key={index} 
                className={`group scroll-animate scroll-fade-up ${
                  servicesAnimation.isVisible ? 'is-visible' : ''
                }`}
                style={{ transitionDelay: `${(index + 1) * 100}ms` }}
              >
                <div className="flex items-start space-x-6">
                  <span 
                    className={`text-minimal text-muted-foreground font-medium scroll-animate scroll-scale-in ${
                      servicesAnimation.isVisible ? 'is-visible' : ''
                    }`}
                    style={{ transitionDelay: `${(index + 1) * 100 + 50}ms` }}
                  >
                    {service.number}
                  </span>
                  <div>
                    <h4 className="text-2xl font-light mb-4 text-architectural group-hover:text-muted-foreground transition-colors duration-500">
                      {t(service.titleKey)}
                    </h4>
                    <p className="text-muted-foreground leading-relaxed">
                      {t(service.descKey)}
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

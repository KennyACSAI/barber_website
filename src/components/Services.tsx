import { useTranslation } from "react-i18next";

const Services = () => {
  const { t } = useTranslation();

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
    <section id="services" className="py-32 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20">
            <h2 className="text-minimal text-muted-foreground mb-4">{t('services.label')}</h2>
            <h3 className="text-4xl md:text-6xl font-light text-architectural">
              {t('services.title')}
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

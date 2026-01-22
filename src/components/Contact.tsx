import { useTranslation } from "react-i18next";
import { Phone, MapPin, Instagram, Clock, Calendar, Navigation } from "lucide-react";

const Contact = () => {
  const { t } = useTranslation();

  return (
    <section id="contact" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-20">
            <div>
              <h2 className="text-minimal text-muted-foreground mb-4">{t('contact.label')}</h2>
              <h3 className="text-4xl md:text-6xl font-light text-architectural mb-12">
                {t('contact.title1')}
                <br />
                {t('contact.title2')}
              </h3>
              
              <div className="space-y-8">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Phone className="w-4 h-4 text-foreground" />
                    <h4 className="text-minimal text-muted-foreground">{t('contact.phone')}</h4>
                  </div>
                  <a href="tel:+393292069578" className="text-xl hover:text-muted-foreground transition-colors duration-300 block">
                    +39 329 206 9578
                  </a>
                  <a href="tel:+390689235068" className="text-xl hover:text-muted-foreground transition-colors duration-300 block mt-2">
                    +39 06 8923 5068
                  </a>
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-foreground" />
                    <h4 className="text-minimal text-muted-foreground">{t('contact.shop')}</h4>
                  </div>
                  <address className="text-xl not-italic">
                    Via Tiburtina, 137/139
                    <br />
                    00185 Roma RM, Italy
                  </address>
                  <div className="flex items-center gap-4 mt-3">
                    <a 
                      href="https://maps.app.goo.gl/FErUESSapsPns1RZ9?g_st=ic" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
                    >
                      <Navigation className="w-4 h-4" />
                      {t('contact.googleMaps')}
                    </a>
                    <a 
                      href="https://maps.apple.com/?address=Via%20Tiburtina%20137/139,%2000185%20Roma%20RM,%20Italy" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
                    >
                      <Navigation className="w-4 h-4" />
                      {t('contact.appleMaps')}
                    </a>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-foreground" />
                    <h4 className="text-minimal text-muted-foreground">{t('contact.bookOnline')}</h4>
                  </div>
                  <p className="text-lg text-muted-foreground">
                    {t('contact.bookingText')}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {t('contact.freshaText')}{" "}
                    <a 
                      href="https://www.fresha.com/lvp/ferro-barber-shop-via-tiburtina-roma-VEQ701" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="underline hover:text-foreground transition-colors duration-300"
                    >
                      Fresha
                    </a>
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-8">
              <div>
                <h4 className="text-minimal text-muted-foreground mb-6">{t('contact.followUs')}</h4>
                <div className="space-y-4">
                  <a 
                    href="https://www.instagram.com/sanlorenzobarber/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-3 text-xl hover:text-muted-foreground transition-colors duration-300"
                  >
                    <Instagram className="w-5 h-5" />
                    @sanlorenzobarber
                  </a>
                </div>
              </div>
              
              <div className="pt-12 border-t border-border">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-4 h-4 text-foreground" />
                  <h4 className="text-minimal text-muted-foreground">{t('contact.hours')}</h4>
                </div>
                <div className="space-y-2 text-muted-foreground">
                  <p>{t('contact.days.monday')}: {t('contact.closed')}</p>
                  <p>{t('contact.days.tuesday')}: 09:00 - 19:30</p>
                  <p>{t('contact.days.wednesday')}: 09:00 - 19:30</p>
                  <p>{t('contact.days.thursday')}: 09:30 - 19:30</p>
                  <p>{t('contact.days.friday')}: 09:00 - 19:30</p>
                  <p>{t('contact.days.saturday')}: 09:30 - 19:30</p>
                  <p>{t('contact.days.sunday')}: {t('contact.closed')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

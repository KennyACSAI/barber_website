import { useTranslation } from "react-i18next";
import { Instagram } from "lucide-react";
import ownerPhoto from "@/assets/owner_photo.jpg";
import barberPhoto from "@/assets/barber_photo.jpg";

const Barbers = () => {
  const { t } = useTranslation();

  const barbers = [
    {
      name: "Luca Franco",
      roleKey: "barbers.roles.owner",
      image: ownerPhoto,
      instagram: "https://www.instagram.com/lucafranco.barber/",
      handle: "@lucafranco.barber"
    },
    {
      name: "Alessio De Angelis",
      roleKey: "barbers.roles.barber",
      image: barberPhoto,
      instagram: "https://www.instagram.com/aleeebarber/",
      handle: "@aleeebarber"
    }
  ];

  return (
    <section id="barbers" className="py-16 md:py-24 bg-muted/20">
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-minimal text-muted-foreground mb-4">{t('barbers.label')}</h2>
            <h3 className="text-4xl md:text-6xl font-light text-architectural">
              {t('barbers.title')}
            </h3>
          </div>
          
          <div className="flex flex-col md:flex-row justify-center items-center gap-16 md:gap-24">
            {barbers.map((barber, index) => (
              <div key={index} className="group text-center">
                {/* Rounded Photo */}
                <div className="relative w-48 h-48 md:w-56 md:h-56 mx-auto mb-6 overflow-hidden rounded-full">
                  <img 
                    src={barber.image} 
                    alt={barber.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                
                {/* Name & Role */}
                <h4 className="text-2xl font-light text-architectural mb-1">
                  {barber.name}
                </h4>
                <p className="text-minimal text-muted-foreground mb-4">
                  {t(barber.roleKey)}
                </p>
                
                {/* Instagram Link */}
                <a 
                  href={barber.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-300"
                >
                  <Instagram className="w-4 h-4" />
                  <span className="text-sm">{barber.handle}</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Barbers;

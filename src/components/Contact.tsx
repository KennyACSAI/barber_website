import { Phone, MapPin, Instagram, Clock, Calendar } from "lucide-react";

const Contact = () => {
  return (
    <section id="contact" className="py-32 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-20">
            <div>
              <h2 className="text-minimal text-muted-foreground mb-4">VISIT US</h2>
              <h3 className="text-4xl md:text-6xl font-light text-architectural mb-12">
                Book Your
                <br />
                Appointment
              </h3>
              
              <div className="space-y-8">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Phone className="w-4 h-4 text-foreground" />
                    <h4 className="text-minimal text-muted-foreground">PHONE</h4>
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
                    <h4 className="text-minimal text-muted-foreground">SHOP</h4>
                  </div>
                  <address className="text-xl not-italic">
                    Via Tiburtina, 137/139
                    <br />
                    00185 Roma RM, Italy
                  </address>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-foreground" />
                    <h4 className="text-minimal text-muted-foreground">BOOK ONLINE</h4>
                  </div>
                  <p className="text-lg text-muted-foreground">
                    Call us or visit the shop to book your appointment.
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Also available on{" "}
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
                <div className="flex items-center gap-2 mb-6">
                  <Instagram className="w-4 h-4 text-foreground" />
                  <h4 className="text-minimal text-muted-foreground">FOLLOW US</h4>
                </div>
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
                  <h4 className="text-minimal text-muted-foreground">HOURS</h4>
                </div>
                <div className="space-y-2 text-muted-foreground">
                  <p>Monday: Closed</p>
                  <p>Tuesday: 09:00 - 19:30</p>
                  <p>Wednesday: 09:00 - 19:30</p>
                  <p>Thursday: 09:30 - 19:30</p>
                  <p>Friday: 09:00 - 19:30</p>
                  <p>Saturday: 09:30 - 19:30</p>
                  <p>Sunday: Closed</p>
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

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
                  <h4 className="text-minimal text-muted-foreground mb-2">PHONE</h4>
                  <a href="tel:+393292069578" className="text-xl hover:text-muted-foreground transition-colors duration-300 block">
                    +39 329 206 9578
                  </a>
                  <a href="tel:+390689235068" className="text-xl hover:text-muted-foreground transition-colors duration-300 block mt-2">
                    +39 06 8923 5068
                  </a>
                </div>
                
                <div>
                  <h4 className="text-minimal text-muted-foreground mb-2">SHOP</h4>
                  <address className="text-xl not-italic">
                    Via Tiburtina, 137/139
                    <br />
                    00185 Roma RM, Italy
                  </address>
                </div>

                <div>
                  <h4 className="text-minimal text-muted-foreground mb-2">BOOK ONLINE</h4>
                  <a href="https://www.fresha.com/lvp/ferro-barber-shop-via-tiburtina-roma-VEQ701" target="_blank" rel="noopener noreferrer" className="text-xl hover:text-muted-foreground transition-colors duration-300">
                    Book on Fresha
                  </a>
                </div>
              </div>
            </div>
            
            <div className="space-y-8">
              <div>
                <h4 className="text-minimal text-muted-foreground mb-6">FOLLOW US</h4>
                <div className="space-y-4">
                  <a href="https://www.instagram.com/sanlorenzobarber/" target="_blank" rel="noopener noreferrer" className="block text-xl hover:text-muted-foreground transition-colors duration-300">
                    Instagram
                  </a>
                </div>
              </div>
              
              <div className="pt-12 border-t border-border">
                <h4 className="text-minimal text-muted-foreground mb-4">HOURS</h4>
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

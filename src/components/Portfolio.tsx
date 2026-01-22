const Portfolio = () => {
  const projects = [
    {
      title: "CLASSIC FADE",
      location: "SIGNATURE STYLE",
      description: "Clean and sharp fade with precision blending for a timeless look"
    },
    {
      title: "BEARD SCULPTING",
      location: "GROOMING EXPERTISE",
      description: "Expert beard shaping and trimming for the distinguished gentleman"
    },
    {
      title: "MODERN UNDERCUT",
      location: "TRENDING STYLE",
      description: "Contemporary styling combining classic techniques with modern trends"
    }
  ];

  return (
    <section id="work" className="py-32 bg-muted">
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20">
            <h2 className="text-minimal text-muted-foreground mb-4">OUR WORK</h2>
            <h3 className="text-4xl md:text-6xl font-light text-architectural">
              Style Gallery
            </h3>
          </div>
          
          <div className="space-y-32">
            {projects.map((project, index) => (
              <div key={index} className="group">
                <div className="relative overflow-hidden">
                  <div 
                    className={`w-full h-[70vh] transition-transform duration-700 group-hover:scale-105 ${
                      index % 2 === 0 ? 'bg-foreground' : 'bg-muted-foreground/20'
                    }`}
                  />
                  <div className="absolute inset-0 bg-background/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                
                <div className="mt-8 grid md:grid-cols-3 gap-8">
                  <div>
                    <h4 className="text-2xl font-light text-architectural mb-2">
                      {project.title}
                    </h4>
                    <p className="text-minimal text-muted-foreground">
                      {project.location}
                    </p>
                  </div>
                  
                  <div className="md:col-span-2">
                    <p className="text-muted-foreground leading-relaxed">
                      {project.description}
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

export default Portfolio;

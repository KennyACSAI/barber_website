import { useState } from "react";
import Navigation from "@/components/Navigation";

const Work = () => {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const projects = [
    {
      title: "CLASSIC FADE",
      location: "SIGNATURE STYLE",
      category: "HAIRCUTS",
      description: "Clean and sharp fade with precision blending. Perfect for the gentleman who appreciates timeless elegance.",
      duration: "45 MIN",
      price: "$35"
    },
    {
      title: "BEARD SCULPTING",
      location: "GROOMING EXPERTISE",
      category: "BEARDS",
      description: "Expert beard shaping and trimming for the distinguished gentleman. Includes hot towel treatment.",
      duration: "30 MIN",
      price: "$25"
    },
    {
      title: "MODERN UNDERCUT",
      location: "TRENDING STYLE",
      category: "HAIRCUTS",
      description: "Contemporary styling combining classic techniques with modern trends. Bold and sophisticated.",
      duration: "50 MIN",
      price: "$40"
    },
    {
      title: "HOT TOWEL SHAVE",
      location: "LUXURY TREATMENT",
      category: "SHAVES",
      description: "Traditional straight razor shave with hot towels and premium products. The ultimate relaxation.",
      duration: "40 MIN",
      price: "$30"
    },
    {
      title: "TEXTURED CROP",
      location: "MODERN CLASSIC",
      category: "HAIRCUTS",
      description: "Versatile cut with natural texture and movement. Easy to style and maintain.",
      duration: "45 MIN",
      price: "$35"
    },
    {
      title: "FULL GROOMING PACKAGE",
      location: "PREMIUM EXPERIENCE",
      category: "PACKAGES",
      description: "Complete styling experience including haircut, beard work, and facial treatment. Walk out looking your best.",
      duration: "90 MIN",
      price: "$75"
    }
  ];

  const categories = ["ALL", "HAIRCUTS", "BEARDS", "SHAVES", "PACKAGES"];

  const filteredProjects = activeCategory === "ALL" 
    ? projects 
    : projects.filter(project => project.category === activeCategory);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12">
              <h1 className="text-6xl md:text-8xl font-light text-architectural mb-8">
                OUR GALLERY
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl">
                A showcase of our craftsmanship. Each style tells a unique story 
                through precision cuts and attention to detail.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Categories */}
      <section className="pb-16">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap gap-8 justify-center md:justify-start">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`text-minimal transition-colors duration-300 relative group ${
                    activeCategory === category 
                      ? "text-foreground" 
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {category}
                  <span className={`absolute bottom-0 left-0 w-full h-px bg-foreground transition-transform duration-300 origin-left ${
                    activeCategory === category 
                      ? "scale-x-100" 
                      : "scale-x-0 group-hover:scale-x-100"
                  }`}></span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="pb-32">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16 lg:gap-20">
              {filteredProjects.map((project, index) => (
                <div key={index} className="group cursor-pointer">
                  <div className="relative overflow-hidden mb-8">
                    <div 
                      className={`w-full h-[60vh] transition-transform duration-700 group-hover:scale-105 ${
                        index % 2 === 0 ? 'bg-foreground' : 'bg-muted-foreground/30'
                      }`}
                    />
                    <div className="absolute inset-0 bg-background/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Project Category Badge */}
                    <div className="absolute top-6 left-6 bg-background/90 backdrop-blur-sm px-4 py-2">
                      <span className="text-minimal text-foreground">
                        {project.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-2xl lg:text-3xl font-light text-architectural mb-2 group-hover:text-muted-foreground transition-colors duration-500">
                        {project.title}
                      </h3>
                      <p className="text-minimal text-muted-foreground">
                        {project.location}
                      </p>
                    </div>
                    
                    <p className="text-muted-foreground leading-relaxed">
                      {project.description}
                    </p>
                    
                    <div className="flex gap-8 pt-4 border-t border-border">
                      <div>
                        <p className="text-minimal text-muted-foreground mb-1">DURATION</p>
                        <p className="text-foreground">{project.duration}</p>
                      </div>
                      <div>
                        <p className="text-minimal text-muted-foreground mb-1">PRICE</p>
                        <p className="text-foreground">{project.price}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-32 bg-muted">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-6xl font-light text-architectural mb-8">
              Ready for
              <br />
              Your New Look?
            </h2>
            <p className="text-xl text-muted-foreground mb-12">
              Book an appointment and let our master barbers take care of you
            </p>
            <a 
              href="/contact" 
              className="inline-block text-minimal text-foreground hover:text-muted-foreground transition-colors duration-300 relative group"
            >
              BOOK NOW
              <span className="absolute bottom-0 left-0 w-full h-px bg-foreground group-hover:bg-muted-foreground transition-colors duration-300"></span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Work;

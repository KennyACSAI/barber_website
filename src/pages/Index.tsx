import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Contact from "@/components/Contact";
import Barbers from "@/components/Barbers";

const Index = () => {
  const location = useLocation();

  useEffect(() => {
    // Handle hash scroll when navigating from another page
    if (location.hash) {
      const sectionId = location.hash.replace('#', '');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [location]);

  return (
    <div className="min-h-screen">
      <Navigation />
      <div id="page-content" className="lang-transition">
        <Hero />
        <Services />
        <Contact />
        <Barbers />
      </div>
    </div>
  );
};

export default Index;
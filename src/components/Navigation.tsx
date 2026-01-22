import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (sectionId: string) => {
    setIsMenuOpen(false);
    
    // If not on home page, navigate to home with hash
    if (location.pathname !== "/") {
      navigate(`/#${sectionId}`);
      return;
    }
    
    // If on home page, scroll to section
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    setIsMenuOpen(false);
    
    // If not on home page, navigate to home
    if (location.pathname !== "/") {
      navigate("/");
      return;
    }
    
    // If on home page, scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <button 
          onClick={scrollToTop}
          className="text-minimal text-foreground hover:text-muted-foreground transition-colors duration-300 cursor-pointer"
        >
          SHARP CUTS
        </button>
        
        <div className="hidden md:flex items-center space-x-12">
          <button 
            onClick={() => scrollToSection('services')} 
            className="text-minimal text-muted-foreground hover:text-foreground transition-colors duration-300"
          >
            {t('nav.services')}
          </button>
          <button 
            onClick={() => scrollToSection('contact')} 
            className="text-minimal text-muted-foreground hover:text-foreground transition-colors duration-300"
          >
            {t('nav.contact')}
          </button>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? '✕' : '☰'}
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-b border-border">
          <div className="container mx-auto px-6 py-6 space-y-4">
            <button 
              onClick={() => scrollToSection('services')} 
              className="block text-minimal text-muted-foreground hover:text-foreground transition-colors duration-300"
            >
              {t('nav.services')}
            </button>
            <button 
              onClick={() => scrollToSection('contact')} 
              className="block text-minimal text-muted-foreground hover:text-foreground transition-colors duration-300"
            >
              {t('nav.contact')}
            </button>
            
            {/* Mobile Language & Theme Toggle */}
            <div className="pt-4 border-t border-border flex items-center justify-between">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
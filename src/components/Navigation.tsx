import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useAuth } from "@/context/AuthContext";
import { User } from "lucide-react";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

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
        
<div className="hidden md:flex flex-1 items-center justify-end space-x-12 pr-12">



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
          {isAuthenticated ? (
            <button
              onClick={() => navigate('/profile')}
              className="w-9 h-9 rounded-full bg-foreground/10 flex items-center justify-center hover:bg-foreground/20 transition-colors duration-300"
            >
              <User className="w-4 h-4 text-foreground" />
            </button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/login')}
              className="text-minimal"
            >
              {t('nav.login')}
            </Button>
          )}
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
            
            {/* Profile/Login for Mobile */}
            {isAuthenticated ? (
              <button 
                onClick={() => { navigate('/profile'); setIsMenuOpen(false); }}
                className="block text-minimal text-muted-foreground hover:text-foreground transition-colors duration-300"
              >
                {t('nav.profile')}
              </button>
            ) : (
              <button 
                onClick={() => { navigate('/login'); setIsMenuOpen(false); }}
                className="block text-minimal text-muted-foreground hover:text-foreground transition-colors duration-300"
              >
                {t('nav.login')}
              </button>
            )}
            
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

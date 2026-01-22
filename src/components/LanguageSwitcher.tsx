import { useTranslation } from 'react-i18next';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    if (i18n.language === lng) return;
    
    // Add fade-out class to content
    const content = document.getElementById('page-content');
    if (content) {
      content.classList.add('lang-fade-out');
      
      // Change language after fade out
      setTimeout(() => {
        i18n.changeLanguage(lng);
        localStorage.setItem('language', lng);
        
        // Remove fade-out and add fade-in
        content.classList.remove('lang-fade-out');
        content.classList.add('lang-fade-in');
        
        // Clean up fade-in class
        setTimeout(() => {
          content.classList.remove('lang-fade-in');
        }, 300);
      }, 200);
    } else {
      i18n.changeLanguage(lng);
      localStorage.setItem('language', lng);
    }
  };

  return (
    <div className="flex items-center gap-1 text-minimal">
      <button
        onClick={() => changeLanguage('it')}
        className={`px-1 transition-colors duration-300 ${
          i18n.language === 'it' 
            ? 'text-foreground' 
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        IT
      </button>
      <span className="text-muted-foreground">|</span>
      <button
        onClick={() => changeLanguage('en')}
        className={`px-1 transition-colors duration-300 ${
          i18n.language === 'en' 
            ? 'text-foreground' 
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        EN
      </button>
    </div>
  );
}
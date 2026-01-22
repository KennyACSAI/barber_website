import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : theme === "dark" ? "light" : 
      window.matchMedia("(prefers-color-scheme: dark)").matches ? "light" : "dark";
    
    // Add fade-out class to content
    const content = document.getElementById('page-content');
    if (content) {
      content.classList.add('lang-fade-out');
      
      // Change theme after fade out
      setTimeout(() => {
        setTheme(newTheme);
        
        // Remove fade-out and add fade-in
        content.classList.remove('lang-fade-out');
        content.classList.add('lang-fade-in');
        
        // Clean up fade-in class
        setTimeout(() => {
          content.classList.remove('lang-fade-in');
        }, 300);
      }, 200);
    } else {
      setTheme(newTheme);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="w-9 h-9"
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
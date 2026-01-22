import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Shield } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useAdminAuth } from "@/context/AdminAuthContext";
import logo from "@/assets/logo.jpg";

const AdminLogin = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { adminLogin, isAdminAuthenticated, isLoading } = useAdminAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle redirect when already authenticated - MUST use useEffect, not during render
  useEffect(() => {
    if (!isLoading && isAdminAuthenticated) {
      navigate('/admin', { replace: true });
    }
  }, [isLoading, isAdminAuthenticated, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    // Small delay for UX
    setTimeout(() => {
      const success = adminLogin(formData.username, formData.password);
      
      if (success) {
        window.scrollTo({ top: 0, behavior: 'instant' });
        navigate("/admin", { replace: true });
      } else {
        setError(t('adminLogin.error'));
      }
      
      setIsSubmitting(false);
    }, 500);
  };

  const handleBackToHome = () => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    navigate('/');
  };

  // Show loading spinner while checking auth state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-foreground border-t-transparent rounded-full" />
      </div>
    );
  }

  // If already authenticated, show loading while useEffect handles redirect
  if (isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-foreground border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <button 
            onClick={handleBackToHome}
            className="text-minimal text-foreground hover:text-muted-foreground transition-colors duration-300 cursor-pointer"
          >
            SHARP CUTS
          </button>
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Login Form */}
      <div className="min-h-screen flex items-center justify-center pt-20 pb-12 px-6">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <img 
                src={logo} 
                alt="San Lorenzo Barber Logo" 
                className="w-24 h-24 rounded-full object-cover border-2 border-border"
              />
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-foreground rounded-full flex items-center justify-center">
                <Shield className="w-4 h-4 text-background" />
              </div>
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-minimal text-muted-foreground mb-4">{t('adminLogin.label')}</h1>
            <h2 className="text-4xl md:text-5xl font-light text-architectural">
              {t('adminLogin.title')}
            </h2>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 border border-destructive/50 bg-destructive/10 text-destructive text-sm rounded-lg">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-minimal text-muted-foreground">
                {t('adminLogin.username')}
              </label>
              <Input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                autoComplete="username"
                className="h-12 bg-transparent border-border focus:border-foreground transition-colors duration-300"
                placeholder={t('adminLogin.usernamePlaceholder')}
              />
            </div>

            <div className="space-y-2">
              <label className="text-minimal text-muted-foreground">
                {t('adminLogin.password')}
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                  className="h-12 bg-transparent border-border focus:border-foreground transition-colors duration-300 pr-12"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 !bg-black !text-white dark:!bg-white dark:!text-black hover:opacity-90 text-minimal tracking-wider"
            >
              {isSubmitting ? t('adminLogin.loading') : t('adminLogin.submit')}
            </Button>
          </form>

          {/* Back to Home */}
          <div className="text-center mt-8">
            <button 
              type="button"
              onClick={handleBackToHome}
              className="text-minimal text-muted-foreground hover:text-foreground transition-colors duration-300"
            >
              ← {t('adminLogin.backToHome')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

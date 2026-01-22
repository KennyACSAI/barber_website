import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import Navigation from "@/components/Navigation";
import logo from "@/assets/logo.jpg";
import { useAuth } from "@/context/AuthContext";

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    const success = await login(formData.email, formData.password);
    
    if (success) {
      navigate("/booking");
    } else {
      setError(t('auth.loginError'));
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div id="page-content" className="lang-transition">
        <section className="min-h-screen flex items-center justify-center pt-20 pb-12 px-6">
          <div className="w-full max-w-md">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <img 
                src={logo} 
                alt="San Lorenzo Barber Logo" 
                className="w-24 h-24 rounded-full object-cover border-2 border-border"
              />
            </div>

            {/* Header */}
            <div className="text-center mb-10">
              <h1 className="text-minimal text-muted-foreground mb-4">{t('auth.login.label')}</h1>
              <h2 className="text-4xl md:text-5xl font-light text-architectural">
                {t('auth.login.title')}
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
                  {t('auth.email')}
                </label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="h-12 bg-transparent border-border focus:border-foreground transition-colors duration-300"
                  placeholder="email@example.com"
                />
              </div>

              <div className="space-y-2">
                <label className="text-minimal text-muted-foreground">
                  {t('auth.password')}
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
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

              <div className="flex justify-end">
                <Link 
                  to="/forgot-password" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
                >
                  {t('auth.forgotPassword')}
                </Link>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 !bg-black !text-white dark:!bg-white dark:!text-black hover:opacity-90 text-minimal tracking-wider"
              >
                {isLoading ? t('auth.loading') : t('auth.login.submit')}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-10">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-background px-4 text-sm text-muted-foreground">
                  {t('auth.or')}
                </span>
              </div>
            </div>

            {/* Sign Up Link */}
            <div className="text-center">
              <p className="text-muted-foreground">
                {t('auth.noAccount')}{" "}
                <Link 
                  to="/signup" 
                  className="text-foreground hover:text-muted-foreground transition-colors duration-300 underline"
                >
                  {t('auth.signUpLink')}
                </Link>
              </p>
            </div>

            {/* Back to Home */}
            <div className="text-center mt-8">
              <Link 
                to="/" 
                className="text-minimal text-muted-foreground hover:text-foreground transition-colors duration-300"
              >
                ← {t('auth.backToHome')}
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Login;

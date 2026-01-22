import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, X, Phone } from "lucide-react";
import Navigation from "@/components/Navigation";
import logo from "@/assets/logo.jpg";
import { useAuth } from "@/context/AuthContext";

const Signup = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Format phone number as user types
    if (name === 'phone') {
      // Remove all non-digits
      const digits = value.replace(/\D/g, '');
      // Limit to 15 digits (international standard)
      const limited = digits.slice(0, 15);
      setFormData({
        ...formData,
        [name]: limited
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
    setError('');
  };

  const formatPhoneDisplay = (phone: string) => {
    // Format for display: +39 XXX XXX XXXX
    if (phone.length === 0) return '';
    if (phone.length <= 2) return `+${phone}`;
    if (phone.length <= 5) return `+${phone.slice(0, 2)} ${phone.slice(2)}`;
    if (phone.length <= 8) return `+${phone.slice(0, 2)} ${phone.slice(2, 5)} ${phone.slice(5)}`;
    return `+${phone.slice(0, 2)} ${phone.slice(2, 5)} ${phone.slice(5, 8)} ${phone.slice(8)}`;
  };

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !verificationCode[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Validate phone number (minimum 10 digits)
    if (formData.phone.length < 10) {
      setError(t('auth.phoneError'));
      setIsLoading(false);
      return;
    }
    
    // For demo, skip straight to verification modal
    // In real app, would send verification email here
    setTimeout(() => {
      setIsLoading(false);
      setShowVerification(true);
    }, 1000);
  };

  const handleVerification = async () => {
    const code = verificationCode.join("");
    if (code.length !== 6) return;

    setIsVerifying(true);
    
    // Accept any 6-digit code for demo
    const success = await signup(
      formData.firstName, 
      formData.lastName, 
      formData.email,
      formData.phone,
      formData.password
    );
    
    if (success) {
      setShowVerification(false);
      navigate("/booking");
    } else {
      setError(t('auth.signupError'));
    }
    
    setIsVerifying(false);
  };

  const handleResendCode = () => {
    // Simulate resend
    console.log("Resending code to:", formData.email);
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
              <h1 className="text-minimal text-muted-foreground mb-4">{t('auth.signup.label')}</h1>
              <h2 className="text-4xl md:text-5xl font-light text-architectural">
                {t('auth.signup.title')}
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
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-minimal text-muted-foreground">
                    {t('auth.firstName')}
                  </label>
                  <Input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="h-12 bg-transparent border-border focus:border-foreground transition-colors duration-300"
                    placeholder="Mario"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-minimal text-muted-foreground">
                    {t('auth.lastName')}
                  </label>
                  <Input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="h-12 bg-transparent border-border focus:border-foreground transition-colors duration-300"
                    placeholder="Rossi"
                  />
                </div>
              </div>

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
                  {t('auth.phone')}
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="tel"
                    name="phone"
                    value={formatPhoneDisplay(formData.phone)}
                    onChange={handleChange}
                    required
                    className="h-12 bg-transparent border-border focus:border-foreground transition-colors duration-300 pl-12"
                    placeholder="+39 329 206 9578"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {t('auth.phoneHint')}
                </p>
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
                    minLength={8}
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
                <p className="text-xs text-muted-foreground mt-1">
                  {t('auth.passwordHint')}
                </p>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 !bg-black !text-white dark:!bg-white dark:!text-black hover:opacity-90 text-minimal tracking-wider"
              >
                {isLoading ? t('auth.loading') : t('auth.signup.submit')}
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

            {/* Login Link */}
            <div className="text-center">
              <p className="text-muted-foreground">
                {t('auth.hasAccount')}{" "}
                <Link 
                  to="/login" 
                  className="text-foreground hover:text-muted-foreground transition-colors duration-300 underline"
                >
                  {t('auth.loginLink')}
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

      {/* Verification Modal */}
      {showVerification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowVerification(false)}
          />
          
          {/* Modal */}
          <div className="relative bg-background border border-border p-8 md:p-12 w-full max-w-md mx-6 animate-fade-in-up">
            {/* Close Button */}
            <button
              onClick={() => setShowVerification(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors duration-300"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="text-center mb-8">
              <h3 className="text-minimal text-muted-foreground mb-4">{t('auth.verification.label')}</h3>
              <h4 className="text-2xl md:text-3xl font-light text-architectural mb-4">
                {t('auth.verification.title')}
              </h4>
              <p className="text-muted-foreground">
                {t('auth.verification.description')}{" "}
                <span className="text-foreground">{formData.email}</span>
              </p>
            </div>

            {/* Code Input */}
            <div className="flex justify-center gap-2 md:gap-3 mb-8">
              {verificationCode.map((digit, index) => (
                <Input
                  key={index}
                  id={`code-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  onKeyDown={(e) => handleCodeKeyDown(index, e)}
                  className="w-10 h-12 md:w-12 md:h-14 text-center text-xl bg-transparent border-border focus:border-foreground transition-colors duration-300"
                />
              ))}
            </div>

            {/* Verify Button */}
            <Button
              onClick={handleVerification}
              disabled={isVerifying || verificationCode.join("").length !== 6}
              className="w-full h-12 !bg-black !text-white dark:!bg-white dark:!text-black hover:opacity-90 text-minimal tracking-wider mb-6"
            >
              {isVerifying ? t('auth.loading') : t('auth.verification.submit')}
            </Button>

            {/* Resend Code */}
            <div className="text-center">
              <p className="text-muted-foreground text-sm">
                {t('auth.verification.noCode')}{" "}
                <button 
                  onClick={handleResendCode}
                  className="text-foreground hover:text-muted-foreground transition-colors duration-300 underline"
                >
                  {t('auth.verification.resend')}
                </button>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Signup;

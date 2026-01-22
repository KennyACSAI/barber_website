import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  const [verificationCode, setVerificationCode] = useState("");
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
  
  // Single hidden input ref for OTP - works better on mobile
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);

  // Navigate with scroll to top
  const handleNavigateWithScroll = (path: string) => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    navigate(path);
  };

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

  // Focus the input when modal opens - triggers keyboard on mobile
  useEffect(() => {
    if (showVerification && hiddenInputRef.current) {
      // Small delay to ensure modal is fully rendered
      const timer = setTimeout(() => {
        if (hiddenInputRef.current) {
          hiddenInputRef.current.focus();
          // Additional click for some mobile browsers that need it
          hiddenInputRef.current.click();
        }
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [showVerification]);

  // Handle OTP input change
  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setVerificationCode(value);
  };

  // Handle clicking on the code display boxes - focus the hidden input
  const handleCodeBoxClick = () => {
    hiddenInputRef.current?.focus();
  };

  // Close modal
  const closeModal = () => {
    setShowVerification(false);
    setVerificationCode("");
  };

  // Handle backdrop click - only close if clicking the backdrop itself
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only close if clicking directly on the backdrop, not on modal content
    if (e.target === e.currentTarget) {
      closeModal();
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
    if (verificationCode.length !== 6) return;

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
      // Scroll to top before navigating - important for mobile
      window.scrollTo({ top: 0, behavior: 'instant' });
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

  // Convert string to array for display
  const codeDigits = verificationCode.padEnd(6, ' ').split('');

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

            {/* Login Link - Changed to button with scroll to top */}
            <div className="text-center">
              <p className="text-muted-foreground">
                {t('auth.hasAccount')}{" "}
                <button 
                  type="button"
                  onClick={() => handleNavigateWithScroll('/login')}
                  className="text-foreground hover:text-muted-foreground transition-colors duration-300 underline"
                >
                  {t('auth.loginLink')}
                </button>
              </p>
            </div>

            {/* Back to Home - Changed to button with scroll to top */}
            <div className="text-center mt-8">
              <button 
                type="button"
                onClick={() => handleNavigateWithScroll('/')}
                className="text-minimal text-muted-foreground hover:text-foreground transition-colors duration-300"
              >
                ← {t('auth.backToHome')}
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Verification Modal - Mobile optimized with single hidden input */}
      {showVerification && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={handleBackdropClick}
          style={{ touchAction: 'manipulation' }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          
          {/* Modal */}
          <div 
            ref={modalContentRef}
            className="relative bg-background border border-border p-6 md:p-12 w-full max-w-md animate-fade-in-up z-10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={closeModal}
              className="absolute top-3 right-3 p-2 text-muted-foreground hover:text-foreground transition-colors duration-300"
              style={{ touchAction: 'manipulation' }}
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="text-center mb-6 md:mb-8">
              <h3 className="text-minimal text-muted-foreground mb-3 md:mb-4">{t('auth.verification.label')}</h3>
              <h4 className="text-xl md:text-3xl font-light text-architectural mb-3 md:mb-4">
                {t('auth.verification.title')}
              </h4>
              <p className="text-muted-foreground text-sm md:text-base">
                {t('auth.verification.description')}{" "}
                <span className="text-foreground break-all">{formData.email}</span>
              </p>
            </div>

            {/* Hidden input that captures all OTP digits - positioned over boxes for mobile keyboard trigger */}
            <div className="relative mb-6 md:mb-8">
              {/* Visual code boxes */}
              <div 
                className="flex justify-center gap-2 md:gap-3 cursor-text"
                onClick={handleCodeBoxClick}
                style={{ touchAction: 'manipulation' }}
              >
                {codeDigits.map((digit, index) => (
                  <div
                    key={index}
                    className={`
                      w-11 h-14 md:w-12 md:h-14 
                      flex items-center justify-center 
                      text-xl font-medium 
                      border rounded-md 
                      transition-all duration-200
                      ${index === verificationCode.length 
                        ? 'border-foreground ring-2 ring-foreground/20' 
                        : 'border-border'
                      }
                      ${digit.trim() ? 'bg-foreground/5' : 'bg-transparent'}
                    `}
                  >
                    {digit.trim() || ''}
                  </div>
                ))}
              </div>
              
              {/* Actual input - positioned over the boxes, transparent but focusable */}
              <input
                ref={hiddenInputRef}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                autoComplete="one-time-code"
                autoFocus
                value={verificationCode}
                onChange={handleOtpChange}
                maxLength={6}
                className="absolute inset-0 w-full h-full opacity-0 cursor-text"
                style={{ 
                  touchAction: 'manipulation',
                  fontSize: '16px', // Prevents iOS zoom on focus
                  caretColor: 'transparent'
                }}
                aria-label="Verification code"
              />
            </div>

            {/* Verify Button */}
            <Button
              type="button"
              onClick={handleVerification}
              disabled={isVerifying || verificationCode.length !== 6}
              className="w-full h-12 !bg-black !text-white dark:!bg-white dark:!text-black hover:opacity-90 text-minimal tracking-wider mb-4 md:mb-6"
              style={{ touchAction: 'manipulation' }}
            >
              {isVerifying ? t('auth.loading') : t('auth.verification.submit')}
            </Button>

            {/* Resend Code */}
            <div className="text-center">
              <p className="text-muted-foreground text-sm">
                {t('auth.verification.noCode')}{" "}
                <button 
                  type="button"
                  onClick={handleResendCode}
                  className="text-foreground hover:text-muted-foreground transition-colors duration-300 underline"
                  style={{ touchAction: 'manipulation' }}
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
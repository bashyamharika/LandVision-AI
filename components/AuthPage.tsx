
import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, CheckCircle, Loader2 } from 'lucide-react';

interface AuthPageProps {
  onLogin: (user: { name: string; email: string }) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  
  // Social Loading States
  const [googleLoading, setGoogleLoading] = useState(false);
  const [twitterLoading, setTwitterLoading] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call - Faster for better UX
    setTimeout(() => {
      setLoading(false);
      // If logging in, use name if available or derive from email for demo purposes
      const finalName = name || (isLogin ? email.split('@')[0] : 'User');
      onLogin({ name: finalName, email }); 
    }, 600);
  };

  const handleSocialLogin = (provider: 'google' | 'twitter') => {
    if (provider === 'google') setGoogleLoading(true);
    if (provider === 'twitter') setTwitterLoading(true);

    // Simulate OAuth delay
    setTimeout(() => {
        const mockUser = provider === 'google' 
            ? { name: "Google User", email: "user@gmail.com" }
            : { name: "Twitter User", email: "user@twitter.com" };
        
        onLogin(mockUser);
        if (provider === 'google') setGoogleLoading(false);
        if (provider === 'twitter') setTwitterLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      
      {/* Left Side: Brand & Hero */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-emerald-900 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" 
          alt="Green Landscape" 
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/90 to-emerald-800/80 mix-blend-multiply" />
        
        <div className="relative z-10 p-16 flex flex-col justify-between h-full text-white">
           <div>
              {/* Logo Section */}
              <div className="flex items-center space-x-4 mb-10">
                <div className="bg-emerald-600/20 backdrop-blur-md p-3.5 w-fit rounded-2xl border border-emerald-500/30 shadow-lg">
                   <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24" 
                    className="h-10 w-10 text-white"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" fill="currentColor" />
                    <circle cx="12" cy="10" r="3" fill="#059669" />
                  </svg>
                </div>
                <span className="text-5xl font-extrabold tracking-tight text-white drop-shadow-md">
                    LandVision
                </span>
              </div>

              <h1 className="text-6xl font-extrabold tracking-tight mb-8 leading-tight">
                Buy land with <br/> <span className="text-emerald-400">absolute clarity.</span>
              </h1>
              <p className="text-2xl text-emerald-100 max-w-lg leading-relaxed font-light">
                Join thousands of buyers and sellers on India's first AI-powered, zero-brokerage land marketplace.
              </p>
           </div>
           
           <div className="space-y-6">
              <div className="flex items-center space-x-4 text-emerald-100">
                 <div className="bg-emerald-500/20 p-2 rounded-full"><CheckCircle className="w-6 h-6 text-emerald-400" /></div>
                 <span className="text-xl font-medium">AI Construction Visualization</span>
              </div>
              <div className="flex items-center space-x-4 text-emerald-100">
                 <div className="bg-emerald-500/20 p-2 rounded-full"><CheckCircle className="w-6 h-6 text-emerald-400" /></div>
                 <span className="text-xl font-medium">Instant Cost Estimation</span>
              </div>
              <div className="flex items-center space-x-4 text-emerald-100">
                 <div className="bg-emerald-500/20 p-2 rounded-full"><CheckCircle className="w-6 h-6 text-emerald-400" /></div>
                 <span className="text-xl font-medium">Direct Owner Connections</span>
              </div>
           </div>
        </div>
      </div>

      {/* Right Side: Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 relative">
         <div className="w-full max-w-lg space-y-10">
            <div className="text-center lg:text-left">
               <div className="lg:hidden flex flex-col items-center mb-8">
                 <div className="bg-emerald-600 p-4 rounded-full shadow-lg mb-3">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 24 24" 
                      className="h-10 w-10 text-white"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" fill="currentColor" />
                      <circle cx="12" cy="10" r="3" fill="#059669" />
                    </svg>
                 </div>
                 <span className="text-3xl font-extrabold text-gray-900 tracking-tight">LandVision</span>
               </div>
               
               <h2 className="text-4xl font-bold text-gray-900 tracking-tight">
                  {isLogin ? 'Welcome back' : 'Create an account'}
               </h2>
               <p className="mt-3 text-gray-500 text-xl">
                  {isLogin ? 'Enter your details to access your account.' : 'Start your journey to finding the perfect plot.'}
               </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-10 space-y-7">
               <div className="space-y-6">
                  {!isLogin && (
                    <div className="relative">
                       <label className="text-base font-semibold text-gray-700 mb-2 block">Full Name</label>
                       <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                             <User className="h-6 w-6 text-gray-400" />
                          </div>
                          <input 
                             type="text" 
                             required={!isLogin}
                             className="block w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl text-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition" 
                             placeholder="John Doe"
                             value={name}
                             onChange={(e) => setName(e.target.value)}
                          />
                       </div>
                    </div>
                  )}

                  <div className="relative">
                     <label className="text-base font-semibold text-gray-700 mb-2 block">Email Address</label>
                     <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                           <Mail className="h-6 w-6 text-gray-400" />
                        </div>
                        <input 
                           type="email" 
                           required 
                           className="block w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl text-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition" 
                           placeholder="you@example.com"
                           value={email}
                           onChange={(e) => setEmail(e.target.value)}
                        />
                     </div>
                  </div>

                  <div className="relative">
                     <div className="flex items-center justify-between mb-2">
                        <label className="text-base font-semibold text-gray-700">Password</label>
                        {isLogin && (
                           <a href="#" className="text-base font-medium text-emerald-600 hover:text-emerald-500 underline decoration-2 underline-offset-2">
                              Forgot password?
                           </a>
                        )}
                     </div>
                     <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                           <Lock className="h-6 w-6 text-gray-400" />
                        </div>
                        <input 
                           type="password" 
                           required 
                           className="block w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl text-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition" 
                           placeholder="••••••••"
                           value={password}
                           onChange={(e) => setPassword(e.target.value)}
                        />
                     </div>
                  </div>
               </div>

               <button 
                  type="submit" 
                  disabled={loading || googleLoading || twitterLoading}
                  className="w-full flex justify-center py-5 px-6 border border-transparent rounded-xl shadow-lg text-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all hover:-translate-y-1 disabled:opacity-70 disabled:hover:translate-y-0 mt-4"
               >
                  {loading ? (
                     <span className="flex items-center animate-pulse">
                         <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Processing...
                     </span>
                  ) : (
                     <span className="flex items-center">
                        {isLogin ? 'Sign In to Account' : 'Create Free Account'} 
                        <ArrowRight className="ml-3 w-6 h-6" />
                     </span>
                  )}
               </button>

               <div className="relative mt-6">
                  <div className="absolute inset-0 flex items-center">
                     <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-base">
                     <span className="px-6 bg-gray-50 text-gray-500 font-medium">
                        or continue with
                     </span>
                  </div>
               </div>

               <div className="mt-6 grid grid-cols-2 gap-5">
                  <button 
                    type="button" 
                    onClick={() => handleSocialLogin('google')}
                    disabled={googleLoading || twitterLoading || loading}
                    className="w-full flex items-center justify-center px-4 py-4 border border-gray-200 rounded-xl shadow-sm bg-white text-base font-semibold text-gray-700 hover:bg-gray-100 transition h-14"
                  >
                     {googleLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
                     ) : (
                        <>
                            <svg className="h-6 w-6 mr-3" aria-hidden="true" viewBox="0 0 24 24">
                                <path d="M12.0003 20.45c-4.666 0-8.45-3.784-8.45-8.45 0-4.666 3.784-8.45 8.45-8.45 4.666 0 8.45 3.784 8.45 8.45 0 4.666-3.784 8.45-8.45 8.45z" fill="#fff" />
                                <path d="M20.25 12c0-.58-.05-1.15-.15-1.7H12v3.23h4.63c-.2 1.08-.8 1.99-1.71 2.6v2.16h2.77c1.62-1.49 2.56-3.69 2.56-6.29z" fill="#4285F4" />
                                <path d="M12 20.45c2.32 0 4.27-.77 5.69-2.09l-2.77-2.16c-.77.52-1.76.82-2.92.82-2.25 0-4.16-1.52-4.84-3.56H4.25v2.24C5.66 18.5 8.62 20.45 12 20.45z" fill="#34A853" />
                                <path d="M7.16 13.46c-.17-.51-.27-1.06-.27-1.61s.1-1.1.27-1.61V7.99H4.25c-.58 1.16-.91 2.47-.91 3.86 0 1.39.33 2.69.91 3.86l2.91-2.25z" fill="#FBBC05" />
                                <path d="M12 6.8c1.26 0 2.39.43 3.28 1.29l2.46-2.46C16.27 4.2 14.28 3.35 12 3.35 8.62 3.35 5.66 5.3 4.25 8.15l2.91 2.25c.68-2.04 2.59-3.56 4.84-3.56z" fill="#EA4335" />
                            </svg>
                            Google
                        </>
                     )}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => handleSocialLogin('twitter')}
                    disabled={googleLoading || twitterLoading || loading}
                    className="w-full flex items-center justify-center px-4 py-4 border border-gray-200 rounded-xl shadow-sm bg-white text-base font-semibold text-gray-700 hover:bg-gray-100 transition h-14"
                  >
                      {twitterLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
                     ) : (
                        <>
                            <span className="text-gray-900 font-bold text-xl mr-3">X</span> Twitter
                        </>
                     )}
                  </button>
               </div>

               <p className="mt-8 text-center text-lg text-gray-600">
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                  <button 
                     type="button"
                     onClick={() => setIsLogin(!isLogin)} 
                     className="font-bold text-emerald-600 hover:text-emerald-500 transition underline decoration-2 underline-offset-4"
                  >
                     {isLogin ? 'Sign up' : 'Log in'}
                  </button>
               </p>
            </form>
         </div>
         
         <div className="absolute bottom-6 text-center w-full text-sm text-gray-400">
            © 2025 LandVision Inc. All rights reserved.
         </div>
      </div>
    </div>
  );
};

export default AuthPage;

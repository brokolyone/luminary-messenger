
import React, { useState } from 'react';
import { AppSettings, UserProfile } from '../types';
import { translations } from '../translations';

interface LoginScreenProps {
  onLogin: (user: UserProfile) => void;
  settings: AppSettings;
}

// Mock Database
const MOCK_USERS: Record<string, {password: string, profile: UserProfile}> = {
  'alex@example.com': {
    password: 'password',
    profile: {
      id: 'user_alex',
      name: 'Alex Johnson',
      username: 'alexj',
      bio: 'Building the future.',
      avatar: 'https://picsum.photos/id/65/100/100',
      phone: '+1 234 567 89 00',
      email: 'alex@example.com'
    }
  },
  'durov@telegram.org': {
    password: '123',
    profile: {
      id: 'user_durov',
      name: 'Pavel Durov',
      username: 'durov',
      bio: 'Privacy first.',
      avatar: 'https://picsum.photos/id/64/100/100',
      phone: '+1 555 0199',
      email: 'durov@telegram.org'
    }
  },
  'korolsmerty2015@gmail.com': {
    password: 'password',
    profile: {
      id: 'user_korol',
      name: 'Korol Smerty',
      username: 'korol_smerty',
      bio: 'King of the chat.',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=korol',
      phone: '',
      email: 'korolsmerty2015@gmail.com'
    }
  },
  'example@email.com': {
    password: 'password',
    profile: {
      id: 'user_example',
      name: 'Example User',
      username: 'example_user',
      bio: 'Just a demo user.',
      avatar: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=example',
      phone: '',
      email: 'example@email.com'
    }
  }
};

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, settings }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [verificationStep, setVerificationStep] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Safe access to translations
  const currentLang = settings?.language || 'en';
  const t = translations[currentLang] || translations['en'];

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 600));

    const normalizedEmail = email.toLowerCase().trim();

    if (isLoginMode) {
      // Login Flow
      const userRecord = MOCK_USERS[normalizedEmail];
      if (!userRecord) {
        setError(t.accountNotFound);
        setIsLoading(false);
        return;
      }
      if (userRecord.password !== password) {
        setError(t.wrongPassword);
        setIsLoading(false);
        return;
      }
      onLogin(userRecord.profile);
    } else {
      // Registration Flow Step 1: Validate Email availability
      if (MOCK_USERS[normalizedEmail]) {
        setError(t.userExists);
        setIsLoading(false);
        return;
      }
      // Move to Verification Step
      setIsLoading(false);
      setVerificationStep(true);
    }
  };

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 800));

    if (otp !== '123456') {
        setError(t.wrongCode);
        setIsLoading(false);
        return;
    }

    // Success - Create User
    const normalizedEmail = email.toLowerCase().trim();
    const newUser: UserProfile = {
        id: `user_${Math.random().toString(36).slice(2, 9)}`,
        name: name || 'New User',
        username: `user_${Math.floor(Math.random() * 10000)}`,
        bio: 'Hi there! I am using Luminary.',
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${name}`,
        phone: '',
        email: normalizedEmail
    };
    onLogin(newUser);
    setIsLoading(false);
  };

  if (verificationStep) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0f172a] px-4 transition-colors duration-300">
          <div className="max-w-md w-full bg-white dark:bg-[#1e293b] p-8 rounded-3xl shadow-xl space-y-6 transition-all duration-300">
            <div className="text-center space-y-2">
                <div className="bg-green-100 dark:bg-green-900/20 w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                </div>
                <h2 className="text-2xl font-bold dark:text-white">{t.verifyTitle}</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                    {t.verifySubtitle} <br/><span className="font-semibold text-gray-800 dark:text-gray-200">{email}</span>
                </p>
            </div>

            <form onSubmit={handleVerification} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t.verifyCode}</label>
                    <input 
                        type="text" 
                        required 
                        maxLength={6}
                        value={otp} 
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g,''))}
                        className={`w-full px-4 py-3 text-center text-2xl tracking-[0.5em] font-mono rounded-xl bg-gray-100 dark:bg-[#0f172a] border-none focus:ring-2 dark:text-white transition-all ${error ? 'ring-2 ring-red-500' : 'focus:ring-blue-500'}`}
                        placeholder="••••••"
                    />
                </div>

                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 text-red-500 text-sm p-3 rounded-xl text-center font-medium">
                    {error}
                    </div>
                )}

                <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg shadow-green-500/30 transition-all transform active:scale-[0.98] flex items-center justify-center"
                >
                    {isLoading ? <span className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full"></span> : t.confirm}
                </button>
            </form>

            <div className="text-center space-y-3">
                <button type="button" className="text-sm text-blue-500 hover:underline font-medium">{t.resend}</button>
                <div>
                    <button onClick={() => {setVerificationStep(false); setError('');}} className="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                        &larr; {t.back}
                    </button>
                </div>
                {/* Demo Hint */}
                <div className="text-[10px] text-gray-300 pt-2">Demo Code: 123456</div>
            </div>
          </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0f172a] px-4 transition-colors duration-300">
      <div className="max-w-md w-full bg-white dark:bg-[#1e293b] p-8 rounded-3xl shadow-xl space-y-8 transition-all duration-300">
        <div className="text-center">
          <div className="bg-blue-500 w-16 h-16 rounded-2xl mx-auto flex items-center justify-center shadow-lg mb-4">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
          </div>
          <h2 className="text-3xl font-bold dark:text-white">
            {isLoginMode ? t.loginTitle : t.registerTitle}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            {isLoginMode ? t.loginSubtitle : t.registerSubtitle}
          </p>
        </div>
        
        <form onSubmit={handleAuth} className="space-y-6">
          {!isLoginMode && (
             <div className="transition-all duration-300">
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t.name}</label>
               <input 
                 type="text" required={!isLoginMode} value={name} onChange={(e) => setName(e.target.value)}
                 className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-[#0f172a] border-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all"
                 placeholder="John Doe"
               />
             </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t.email}</label>
            <input 
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-[#0f172a] border-none focus:ring-2 dark:text-white transition-all ${error && (error === t.accountNotFound || error === t.userExists) ? 'ring-2 ring-red-500' : 'focus:ring-blue-500'}`}
              placeholder="alex@example.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t.password}</label>
            <input 
              type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-[#0f172a] border-none focus:ring-2 dark:text-white transition-all ${error && error === t.wrongPassword ? 'ring-2 ring-red-500' : 'focus:ring-blue-500'}`}
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-500 text-sm p-3 rounded-xl text-center font-medium transition-all">
              {error}
            </div>
          )}

          <button 
            type="submit"
            disabled={isLoading}
            className={`w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all transform active:scale-[0.98] flex items-center justify-center ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              isLoginMode ? t.signIn : t.signUp
            )}
          </button>
        </form>

        <div className="text-center">
          <button 
            type="button"
            onClick={() => { setIsLoginMode(!isLoginMode); setError(''); }}
            className="text-blue-500 font-semibold hover:text-blue-600 transition-colors text-sm"
          >
            {isLoginMode ? t.needAccount : t.haveAccount} <span className="underline">{isLoginMode ? t.signUp : t.signIn}</span>
          </button>
        </div>

        {/* Helper text for demo purposes */}
        <div className="text-xs text-center text-gray-400 mt-4 border-t dark:border-gray-700 pt-4">
          Demo: Try <b>example@email.com</b> / <b>password</b>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;

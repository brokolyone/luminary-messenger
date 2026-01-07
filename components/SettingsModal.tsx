
import React, { useState } from 'react';
import { AppSettings, UserProfile } from '../types';
import { translations } from '../translations';

interface SettingsModalProps {
  user: UserProfile;
  onUpdateUser: (u: UserProfile) => void;
  settings: AppSettings;
  onUpdateSettings: (s: AppSettings) => void;
  onClose: () => void;
  onLogout: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ user, onUpdateUser, settings, onUpdateSettings, onClose, onLogout }) => {
  const [tempUser, setTempUser] = useState(user);
  const [error, setError] = useState('');
  const t = translations[settings.language];

  const handleSaveUser = () => {
    // Simulate username check
    const takenUsernames = ['admin', 'pavel', 'durov', 'root'];
    if (takenUsernames.includes(tempUser.username.toLowerCase()) && tempUser.username !== user.username) {
      setError(t.usernameTaken);
      return;
    }
    setError('');
    onUpdateUser(tempUser);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#1e293b] w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        <div className="p-6 border-b dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-[#0f172a]/20">
          <h2 className="text-xl font-bold dark:text-white">{t.settings}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full dark:text-gray-300">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l18 18"></path></svg>
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto space-y-8 flex-1">
          {/* Profile Section */}
          <section className="space-y-4">
            <div className="flex items-center gap-6">
               <img src={user.avatar} alt={user.name} className="w-24 h-24 rounded-full object-cover border-4 border-blue-500/20" />
               <button className="text-blue-500 font-semibold text-sm hover:underline">{t.editProfile}</button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase px-1">{t.name}</label>
                <input 
                  type="text" value={tempUser.name} onChange={(e) => setTempUser({...tempUser, name: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-[#0f172a] dark:text-white border-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase px-1">{t.username}</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-400">@</span>
                  <input 
                    type="text" value={tempUser.username} onChange={(e) => setTempUser({...tempUser, username: e.target.value})}
                    className={`w-full pl-8 pr-4 py-2.5 rounded-xl bg-gray-100 dark:bg-[#0f172a] dark:text-white border-none focus:ring-2 ${error ? 'focus:ring-red-500 ring-2 ring-red-500' : 'focus:ring-blue-500'}`}
                  />
                </div>
                {error && <p className="text-[10px] text-red-500 px-1 mt-1">{error}</p>}
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase px-1">{t.bio}</label>
              <textarea 
                value={tempUser.bio} onChange={(e) => setTempUser({...tempUser, bio: e.target.value})}
                className="w-full px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-[#0f172a] dark:text-white border-none focus:ring-2 focus:ring-blue-500 resize-none h-20"
              />
            </div>
            <button 
              onClick={handleSaveUser}
              className="px-6 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all"
            >
              {t.save}
            </button>
          </section>

          {/* Appearance */}
          <section className="space-y-4">
            <h4 className="text-xs font-bold text-blue-500 uppercase tracking-wider">{t.appearance}</h4>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#0f172a] rounded-xl">
              <span className="dark:text-gray-300">{t.darkMode}</span>
              <button 
                onClick={() => onUpdateSettings({...settings, theme: settings.theme === 'dark' ? 'light' : 'dark'})}
                className={`w-12 h-6 rounded-full relative transition-colors ${settings.theme === 'dark' ? 'bg-blue-600' : 'bg-gray-300'}`}
              >
                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.theme === 'dark' ? 'translate-x-6' : ''}`}></div>
              </button>
            </div>

            <div className="p-3 bg-gray-50 dark:bg-[#0f172a] rounded-xl space-y-2">
              <div className="flex justify-between">
                <span className="dark:text-gray-300">{t.fontSize}</span>
                <span className="text-blue-500 font-bold">{settings.fontSize}px</span>
              </div>
              <input 
                type="range" min="12" max="22" value={settings.fontSize}
                onChange={(e) => onUpdateSettings({...settings, fontSize: parseInt(e.target.value)})}
                className="w-full accent-blue-600"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#0f172a] rounded-xl">
              <span className="dark:text-gray-300">{t.language}</span>
              <select 
                value={settings.language}
                onChange={(e) => onUpdateSettings({...settings, language: e.target.value as any})}
                className="bg-transparent dark:text-white focus:outline-none font-medium cursor-pointer"
              >
                <option value="ru">Русский</option>
                <option value="en">English</option>
              </select>
            </div>
          </section>

          <button 
            onClick={onLogout}
            className="w-full py-3 text-red-500 font-bold hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors text-center border-2 border-transparent hover:border-red-500/20"
          >
            {t.logout}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;

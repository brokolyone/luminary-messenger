
import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import SettingsModal from './components/SettingsModal';
import LoginScreen from './components/LoginScreen';
import { Chat, ChatType, AppSettings, UserProfile } from './types';
import { translations } from './translations';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [settings, setSettings] = useState<AppSettings>({
    theme: 'light',
    fontSize: 14,
    chatWallpaper: 'https://picsum.photos/1200/800?grayscale',
    notifications: true,
    animations: true,
    language: 'ru'
  });

  // Initial user state is empty/placeholder until login
  const [currentUser, setCurrentUser] = useState<UserProfile>({
    id: '',
    name: '',
    username: '',
    bio: '',
    avatar: '',
    phone: '',
    email: ''
  });

  const [chats, setChats] = useState<Chat[]>([
    {
      id: '1',
      name: 'Pavel Durov',
      avatar: 'https://picsum.photos/id/64/100/100',
      type: ChatType.PRIVATE,
      unreadCount: 2,
      isOnline: true,
      username: 'durov',
      lastMessage: { id: 'm1', senderId: '1', text: 'Privacy is not for sale.', timestamp: Date.now() - 3600000, status: 'read' }
    },
    {
      id: '2',
      name: 'Designers Hub',
      avatar: 'https://picsum.photos/id/103/100/100',
      type: ChatType.GROUP,
      unreadCount: 45,
      isPinned: true,
      lastMessage: { id: 'm2', senderId: 'user', text: 'Check out the new UI kit!', timestamp: Date.now() - 100000, status: 'delivered' }
    }
  ]);

  const t = translations[settings.language];

  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.theme]);

  const filteredChats = useMemo(() => {
    if (!searchQuery) return chats;
    return chats.filter(chat => 
      chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.username?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [chats, searchQuery]);

  const handleSendMessage = (text: string) => {
    if (!activeChatId) return;
    const newMessage = {
        id: Math.random().toString(36),
        senderId: 'user',
        text,
        timestamp: Date.now(),
        status: 'sent' as const
    };
    setChats(prev => prev.map(c => c.id === activeChatId ? { ...c, lastMessage: newMessage, unreadCount: 0 } : c));
  };

  const handleLogin = (user: UserProfile) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveChatId(null);
    setIsSettingsOpen(false);
    // Optional: clear currentUser or keep it cached
    setCurrentUser({
      id: '',
      name: '',
      username: '',
      bio: '',
      avatar: '',
      phone: '',
      email: ''
    });
  };

  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} settings={settings} />;
  }

  return (
    <div className={`h-screen flex overflow-hidden ${settings.theme === 'dark' ? 'dark' : ''}`}>
      <Sidebar 
        chats={filteredChats} 
        activeChatId={activeChatId} 
        onChatSelect={setActiveChatId}
        onOpenSettings={() => setIsSettingsOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        settings={settings}
      />
      
      {activeChatId ? (
        <ChatWindow 
          chat={chats.find(c => c.id === activeChatId) || {
            id: 'temp', name: 'User', avatar: '', type: ChatType.PRIVATE, unreadCount: 0
          }} 
          onSendMessage={handleSendMessage}
          settings={settings}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-[#0f172a] text-gray-400">
          <div className="text-center">
            <div className="bg-blue-500/10 p-4 rounded-full inline-block mb-4">
               <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
            </div>
            <p className="text-lg font-medium dark:text-gray-300">{t.selectChat}</p>
          </div>
        </div>
      )}

      {isSettingsOpen && (
        <SettingsModal 
          user={currentUser}
          onUpdateUser={setCurrentUser}
          settings={settings}
          onUpdateSettings={setSettings}
          onClose={() => setIsSettingsOpen(false)}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
};

export default App;

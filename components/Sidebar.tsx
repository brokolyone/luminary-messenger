
import React from 'react';
import { Chat, AppSettings } from '../types';
import { translations } from '../translations';

interface SidebarProps {
  chats: Chat[];
  activeChatId: string | null;
  onChatSelect: (id: string) => void;
  onOpenSettings: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  settings: AppSettings;
}

const Sidebar: React.FC<SidebarProps> = ({ chats, activeChatId, onChatSelect, onOpenSettings, searchQuery, setSearchQuery, settings }) => {
  const t = translations[settings.language];
  
  return (
    <div className="w-80 md:w-96 flex flex-col border-r dark:border-gray-800 bg-white dark:bg-[#1e293b] shrink-0">
      <div className="p-4 flex items-center gap-3">
        <button 
          onClick={onOpenSettings}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
        >
          <svg className="w-6 h-6 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        </button>
        <div className="relative flex-1">
          <input 
            type="text" 
            placeholder={t.search} 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-[#0f172a] dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
          />
          <svg className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {chats.length > 0 ? chats.map(chat => (
          <div 
            key={chat.id}
            onClick={() => onChatSelect(chat.id)}
            className={`flex items-center gap-3 p-3 mx-2 my-1 rounded-xl cursor-pointer transition-all ${
              activeChatId === chat.id 
                ? 'bg-blue-500 text-white shadow-lg' 
                : 'hover:bg-gray-100 dark:hover:bg-gray-700/50 dark:text-gray-300'
            }`}
          >
            <div className="relative">
              <img src={chat.avatar} alt={chat.name} className="w-12 h-12 rounded-full object-cover" />
              {chat.isOnline && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-[#1e293b] rounded-full"></div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline">
                <h3 className={`font-semibold truncate ${activeChatId === chat.id ? 'text-white' : 'text-gray-900 dark:text-gray-100'}`}>
                  {chat.name}
                </h3>
                <span className={`text-xs ${activeChatId === chat.id ? 'text-blue-100' : 'text-gray-500'}`}>
                   {chat.lastMessage ? new Date(chat.lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                </span>
              </div>
              <p className={`text-sm truncate ${activeChatId === chat.id ? 'text-blue-50' : 'text-gray-500'}`}>
                {chat.lastMessage?.text || 'No messages yet'}
              </p>
            </div>
            {chat.unreadCount > 0 && activeChatId !== chat.id && (
              <div className="bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                {chat.unreadCount}
              </div>
            )}
          </div>
        )) : (
          <div className="p-8 text-center text-gray-400 text-sm">
            <p>{t.globalSearch}...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;

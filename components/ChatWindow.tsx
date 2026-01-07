
import React, { useState, useRef, useEffect } from 'react';
import { Chat, AppSettings, Message } from '../types';
import { translations } from '../translations';

interface ChatWindowProps {
  chat: Chat;
  onSendMessage: (text: string) => void;
  settings: AppSettings;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ chat, onSendMessage, settings }) => {
  const [inputText, setInputText] = useState('');
  const t = translations[settings.language];
  const [mockMessages, setMockMessages] = useState<Message[]>([
    { id: '1', senderId: chat.id, text: 'Hey there!', timestamp: Date.now() - 3600000, status: 'read' },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mockMessages]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    const userMsg: Message = {
        id: Math.random().toString(),
        senderId: 'user',
        text: inputText,
        timestamp: Date.now(),
        status: 'sent'
    };
    setMockMessages([...mockMessages, userMsg]);
    onSendMessage(inputText);
    setInputText('');
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-cover bg-center relative" style={{ backgroundImage: `url(${settings.chatWallpaper})` }}>
      <div className="absolute inset-0 bg-white/90 dark:bg-[#0f172a]/95 pointer-events-none"></div>
      
      {/* Header */}
      <div className="z-10 bg-white/80 dark:bg-[#1e293b]/80 backdrop-blur-md px-6 py-3 border-b dark:border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={chat.avatar} alt={chat.name} className="w-10 h-10 rounded-full object-cover" />
          <div>
            <h2 className="font-bold dark:text-white leading-tight">{chat.name}</h2>
            <p className="text-xs text-green-500 font-medium">{chat.isOnline ? t.online : t.offline}</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="z-0 flex-1 overflow-y-auto p-4 space-y-3">
        {mockMessages.map((msg) => {
          const isOwn = msg.senderId === 'user';
          return (
            <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] px-4 py-2 rounded-2xl shadow-sm ${
                isOwn ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white dark:bg-[#1e293b] dark:text-gray-100 rounded-bl-none'
              }`}
              style={{ fontSize: `${settings.fontSize}px` }}>
                <p>{msg.text}</p>
                <div className={`text-[10px] mt-1 flex justify-end gap-1 ${isOwn ? 'text-blue-100' : 'text-gray-400'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="z-10 p-4 bg-white/80 dark:bg-[#1e293b]/80 backdrop-blur-md border-t dark:border-gray-800">
        <div className="max-w-4xl mx-auto flex items-end gap-2">
          <div className="flex-1 bg-gray-100 dark:bg-[#0f172a] rounded-2xl p-1 flex items-center">
            <textarea 
              rows={1}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder={t.writeMessage}
              className="flex-1 bg-transparent border-none focus:ring-0 text-gray-900 dark:text-white py-2 px-3 resize-none max-h-32 text-sm"
            />
          </div>
          <button 
            onClick={handleSend}
            className={`p-3 rounded-full transition-all ${inputText.trim() ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-[#0f172a] text-gray-400'}`}
          >
            <svg className="w-5 h-5 transform rotate-90" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;

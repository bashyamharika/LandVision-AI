
import React, { useState, useRef, useEffect } from 'react';
import { Listing } from '../types';
import { chatWithListingAgent } from '../services/geminiService';
import { MessageCircle, Send, X, Bot } from 'lucide-react';

const ListingChat: React.FC<{ listing: Listing }> = ({ listing }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([
      {role: 'model', text: `Hi! I'm your AI assistant. Ask me anything about "${listing.title}".`}
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, {role: 'user', text: userMsg}]);
    setLoading(true);

    // Convert messages to history format for Gemini
    const history = messages.map(m => ({
        role: m.role,
        parts: [{text: m.text}]
    }));

    try {
        // Start streaming
        const stream = chatWithListingAgent(listing, history, userMsg);
        let fullResponse = "";
        let isFirstChunk = true;

        for await (const chunk of stream) {
            fullResponse += chunk;
            
            if (isFirstChunk) {
                // On first chunk, add the model message bubble
                setMessages(prev => [...prev, {role: 'model', text: fullResponse}]);
                isFirstChunk = false;
            } else {
                // On subsequent chunks, update the last message
                setMessages(prev => {
                    const newArr = [...prev];
                    const lastIdx = newArr.length - 1;
                    if (newArr[lastIdx].role === 'model') {
                        newArr[lastIdx] = { ...newArr[lastIdx], text: fullResponse };
                    }
                    return newArr;
                });
            }
        }
        
        // Safety check if stream yielded nothing (e.g. error handled inside generator)
        if (isFirstChunk && fullResponse === "") {
             setMessages(prev => [...prev, {role: 'model', text: "I'm having trouble connecting right now."}]);
        }

    } catch (e) {
        console.error("Stream Error", e);
        setMessages(prev => [...prev, {role: 'model', text: "Connection error."}]);
    } finally {
        setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-emerald-600 text-white p-4 rounded-full shadow-lg hover:bg-emerald-700 transition z-40 flex items-center"
      >
        <MessageCircle className="w-7 h-7 mr-2" />
        <span className="font-medium text-lg">Ask AI about this land</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 md:w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 flex flex-col max-h-[600px]">
      <div className="p-4 bg-emerald-600 text-white rounded-t-xl flex justify-between items-center">
        <div className="flex items-center">
            <Bot className="w-6 h-6 mr-2" />
            <span className="font-medium text-lg">AI Land Assistant</span>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-white hover:bg-emerald-700 rounded-full p-1">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1 p-5 overflow-y-auto bg-gray-50 h-96 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3.5 rounded-xl text-base whitespace-pre-wrap ${msg.role === 'user' ? 'bg-emerald-600 text-white rounded-br-none' : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'}`}>
              {msg.text}
            </div>
          </div>
        ))}
        
        {/* Only show "Typing..." if we are loading AND the last message is from User (meaning we haven't started streaming model response yet) */}
        {loading && messages.length > 0 && messages[messages.length-1].role === 'user' && (
            <div className="flex justify-start">
                <div className="bg-gray-200 p-3 rounded-lg text-sm animate-pulse flex items-center">
                    <span className="w-2 h-2 bg-gray-400 rounded-full mr-1 animate-bounce"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full mr-1 animate-bounce" style={{animationDelay: '0.2s'}}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></span>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t bg-white rounded-b-xl flex gap-2">
        <input 
          type="text" 
          className="flex-1 border border-gray-300 rounded-full px-5 py-3 text-base focus:outline-none focus:border-emerald-500 disabled:bg-gray-100 disabled:text-gray-400"
          placeholder="Type your question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          disabled={loading}
        />
        <button 
            onClick={handleSend}
            disabled={loading}
            className="bg-emerald-600 text-white p-3 rounded-full hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ListingChat;

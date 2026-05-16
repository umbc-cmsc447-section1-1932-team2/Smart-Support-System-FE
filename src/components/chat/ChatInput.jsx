import React from 'react';
import { Send } from 'lucide-react';

const ChatInput = ({ newMessage, setNewMessage, onSend }) => {
  return (
    <div className="p-4 border-t border-slate-100 bg-white">
      <form 
        onSubmit={(e) => onSend(e, newMessage)} 
        className="rounded-2xl border border-slate-100 bg-slate-50 p-2 shadow-sm focus-within:bg-white focus-within:border-blue-200 focus-within:ring-4 focus-within:ring-blue-50 transition-all duration-300"
      >
        <textarea 
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Reply to customer..."
          className="w-full bg-transparent border-none focus:ring-0 text-sm p-3 h-24 resize-none placeholder:text-slate-400 outline-none"
        />
        
        <div className="flex justify-end p-2">
           <button 
             type="submit"
             className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white text-xs font-bold shadow-md bg-blue-600 hover:bg-blue-700 transition-all active:scale-95"
           >
             Send Message
             <Send size={14} />
           </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;
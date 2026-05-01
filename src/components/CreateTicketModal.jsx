import React, { useState } from 'react';
import { X, Paperclip } from 'lucide-react';
import { apiFetch } from '../utils/api'; 

const CreateTicketModal = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('TECHNICAL');
  const [priority, setPriority] = useState('MEDIUM');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const response = await apiFetch('/ticket/', 'POST', {
      title,
      category,
      priority,
      description,
    });

    if (response.ok) {
      setTitle('');
      setCategory('TECHNICAL');
      setPriority('MEDIUM');
      setDescription('');
      onClose(); // This triggers the useEffect in TicketDashboard!
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 animate-in fade-in duration-200">
      {/* Changed max-w-md to max-w-2xl to make the modal wider */}
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="text-lg font-bold text-gray-900">Create New Ticket</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Ticket Title</label>
            <input 
              type="text" 
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="E.g., Cannot connect to database" 
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all" 
            />
          </div>

          {/* New 2-Column Grid for Category and Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all"
              >
                <option value="TECHNICAL">Technical Issue</option>
                <option value="BILLING">Billing & Accounts</option>
                <option value="FEATURE">Feature Request</option>
                <option value="GENERAL">General Inquiry</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
            {/* Increased rows from 4 to 6 for the larger modal */}
            <textarea 
              required
              rows="6"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide details about the issue..." 
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all resize-none" 
            ></textarea>
          </div>

          {/* Actions */}
          <div className="pt-4 flex items-center justify-between border-t border-gray-100">
            {/* Optional visual-only attachment button for the new features */}
            <button type="button" className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors">
              <Paperclip size={16} />
              <span>Attach File</span>
            </button>

            <div className="flex gap-3">
              <button 
                type="button" 
                onClick={onClose}
                className="px-5 py-2.5 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 hover:shadow-md transition-all disabled:opacity-70"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
};

export default CreateTicketModal;
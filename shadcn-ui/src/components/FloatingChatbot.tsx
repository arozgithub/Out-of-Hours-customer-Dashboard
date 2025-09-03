import { useState } from 'react';
import { Button } from '@/components/ui/button';
import ChatbotJobLogger from '@/components/ChatbotJobLogger';
import { Customer, Job } from '@/types/job';
import { MessageCircle, Bot, Sparkles } from 'lucide-react';

interface FloatingChatbotProps {
  customers: Customer[];
  onJobCreate: (job: Omit<Job, 'id'>) => void;
}

export default function FloatingChatbot({ customers, onJobCreate }: FloatingChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  if (isOpen) {
    return (
      <ChatbotJobLogger
        customers={customers}
        onJobCreate={onJobCreate}
        onClose={() => setIsOpen(false)}
      />
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-[9999] pointer-events-auto">
      {/* Tooltip */}
      {isHovered && (
        <div className="absolute bottom-16 right-0 bg-gray-900 text-white text-sm py-2 px-3 rounded-lg shadow-lg whitespace-nowrap animate-in slide-in-from-bottom-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-yellow-400" />
            <span>Create job with AI Assistant</span>
          </div>
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      )}

      {/* Floating Button */}
      <Button
        onClick={() => {
          console.log('Chatbot button clicked!');
          setIsOpen(true);
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 group relative"
        style={{ pointerEvents: 'auto' }}
      >
        <div className="relative">
          <MessageCircle className="h-6 w-6 group-hover:scale-110 transition-transform" />
          <Bot className="h-3 w-3 absolute -top-1 -right-1 text-yellow-400" />
        </div>
      </Button>

      {/* Pulse Animation */}
      <div className="absolute inset-0 rounded-full bg-blue-600 animate-ping opacity-20 pointer-events-none"></div>
    </div>
  );
}

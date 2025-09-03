import { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Job, Customer } from '@/types/job';
import { mockJobTrades, generateJobNumber } from '@/lib/jobUtils';
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  CheckCircle, 
  AlertTriangle,
  Minimize2,
  Maximize2,
  X,
  Sparkles
} from 'lucide-react';

interface ChatbotJobLoggerProps {
  customers: Customer[];
  onJobCreate: (job: Omit<Job, 'id'>) => void;
  onClose?: () => void;
}

interface Message {
  id: string;
  type: 'bot' | 'user';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
  options?: string[];
  suggestions?: string[];
}

interface JobData {
  customer?: string;
  site?: string;
  reporterName?: string;
  reporterPhone?: string;
  reporterEmail?: string;
  description?: string;
  jobNature?: string;
  priority?: Job['priority'];
  primaryTrade?: string;
  contactName?: string;
  contactPhone?: string;
  isEmergency?: boolean;
  jobOwner?: string;
}

const CONVERSATION_FLOW = [
  'customer',
  'site', 
  'reporterName',
  'reporterPhone',
  'description',
  'jobNature',
  'priority',
  'primaryTrade',
  'contactName',
  'contactPhone',
  'emergency',
  'jobOwner',
  'confirmation'
];

export default function ChatbotJobLogger({ customers, onJobCreate, onClose }: ChatbotJobLoggerProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [jobData, setJobData] = useState<JobData>({});
  const [isTyping, setIsTyping] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const maxRetries = 3;

  // Enhanced auto-scroll to bottom when new messages arrive
  const scrollToBottom = useCallback(() => {
    try {
      // Method 1: Scroll the scroll area
      if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
      }
      
      // Method 2: Scroll to the bottom element
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ 
          behavior: 'smooth',
          block: 'end',
          inline: 'nearest'
        });
      }
    } catch (error) {
      console.log('Auto-scroll error:', error);
    }
  }, []); // Empty dependency array since it only uses refs

  // Auto-scroll when messages change
  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToBottom();
    }, 100); // Small delay to ensure DOM is updated
    
    return () => clearTimeout(timer);
  }, [messages, scrollToBottom]);

  // Auto-scroll when typing state changes
  useEffect(() => {
    if (isTyping) {
      const timer = setTimeout(() => {
        scrollToBottom();
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isTyping, scrollToBottom]);

  // Reset conversation function
  const resetConversation = () => {
    console.log('🔄 Resetting entire conversation');
    setCurrentStep(0);
    setJobData({});
    setRetryCount(0);
    setMessages([]);
    setIsTyping(false);
    setIsCompleted(false);
    
    // Clear any existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    
    // Start fresh
    addBotMessage(
      "Hi! I'm here to help you create a new job. Let's start with the basics. Which customer is this job for? 🏢",
      customers?.map(c => c.name).slice(0, 5) || [],
      ["Reset conversation"]
    );
  };

  // Initialize chatbot with error handling
  useEffect(() => {
    const initializeChat = () => {
      try {
        // Clear any existing state
        setCurrentStep(0);
        setJobData({});
        setRetryCount(0);
        setIsCompleted(false);
        
        addBotMessage(
          "Hi! 👋 I'm your Job Logging Assistant. I'll help you create a new job by asking a few questions. Let's get started!",
          ["Start Job Creation", "Quick Setup"],
          ["Quick", "Professional", "Guided Setup"]
        );
        setTimeout(() => {
          try {
            askNextQuestion();
          } catch (error) {
            console.error('Error in initial question:', error);
            handleError('Failed to start conversation. Let me try again.');
          }
        }, 1000);
      } catch (error) {
        console.error('Error initializing chat:', error);
        addBotMessage(
          "Sorry, I encountered an error while starting up. Let me try to help you create a job manually.",
          ["Start Over", "Skip to Job Creation"],
          ["Technical difficulties"]
        );
      }
    };
    
    initializeChat();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const addBotMessage = (content: string, options: string[] = [], suggestions: string[] = []) => {
    try {
      const message: Message = {
        id: `bot-${Date.now()}`,
        type: 'bot',
        content,
        timestamp: new Date(),
        options,
        suggestions
      };
      setMessages(prev => [...prev, message]);
      
      // Force scroll after a short delay to ensure DOM update
      setTimeout(() => {
        scrollToBottom();
      }, 50);
    } catch (error) {
      console.error('Error adding bot message:', error);
    }
  };

  const addUserMessage = (content: string) => {
    try {
      const message: Message = {
        id: `user-${Date.now()}`,
        type: 'user',
        content,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, message]);
      
      // Force scroll after a short delay to ensure DOM update
      setTimeout(() => {
        scrollToBottom();
      }, 50);
    } catch (error) {
      console.error('Error adding user message:', error);
    }
  };

  const handleError = (errorMessage: string) => {
    console.error('Chatbot error:', errorMessage);
    setIsTyping(false);
    
    if (retryCount < maxRetries) {
      setRetryCount(prev => prev + 1);
      addBotMessage(
        `${errorMessage} (Attempt ${retryCount + 1}/${maxRetries})`,
        ["Try Again", "Skip This Step", "🔄 Reset Chat"],
        ["Technical issue"]
      );
    } else {
      addBotMessage(
        "I'm having trouble with the conversation flow. Let me help you create a job with the information we have so far.",
        ["Create Job with Current Data", "🔄 Reset Chat", "Close"],
        ["Fallback mode"]
      );
    }
  };

  const validateStep = (step: string, input: string): boolean => {
    try {
      switch (step) {
        case 'customer':
          return input.trim().length > 0;
        case 'site':
          return input.trim().length > 0;
        case 'reporterName':
          return input.trim().length > 2;
        case 'reporterPhone':
          return input.trim().length > 5;
        case 'description':
          return input.trim().length > 10;
        case 'jobNature':
          return ['Reactive', 'Planned', 'Preventive', 'Emergency'].includes(input) || input.trim().length > 0;
        case 'priority':
          return ['Low', 'Medium', 'High', 'Critical'].includes(input) || input.trim().length > 0;
        case 'primaryTrade':
          return input.trim().length > 0;
        case 'contactName':
          return input.trim().length > 2;
        case 'contactPhone':
          return input.trim().length > 5;
        case 'emergency':
          return input.toLowerCase().includes('yes') || input.toLowerCase().includes('no');
        case 'jobOwner':
          return input.trim().length > 2;
        case 'confirmation':
          return input.toLowerCase().includes('yes') || input.toLowerCase().includes('no');
        default:
          return true;
      }
    } catch (error) {
      console.error('Error validating step:', error);
      return false;
    }
  };

  const getStepFallback = (step: string): string => {
    switch (step) {
      case 'customer':
        return customers.length > 0 ? customers[0].name : 'Unknown Customer';
      case 'site':
        return 'Main Site';
      case 'reporterName':
        return 'Anonymous Reporter';
      case 'reporterPhone':
        return '000-000-0000';
      case 'description':
        return 'General maintenance issue';
      case 'jobNature':
        return 'Reactive';
      case 'priority':
        return 'Medium';
      case 'primaryTrade':
        return 'General';
      case 'contactName':
        return jobData.reporterName || 'Site Contact';
      case 'contactPhone':
        return jobData.reporterPhone || '000-000-0000';
      case 'emergency':
        return 'No';
      case 'jobOwner':
        return 'Facilities Manager';
      default:
        return 'Default Value';
    }
  };

  const simulateTyping = (callback: () => void, delay = 1500) => {
    setIsTyping(true);
    
    // Scroll to show typing indicator
    setTimeout(() => {
      scrollToBottom();
    }, 100);
    
    setTimeout(() => {
      setIsTyping(false);
      callback();
      
      // Scroll after message is added
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }, delay);
  };

  const askNextQuestion = () => {
    try {
      // Safety check for step bounds
      if (currentStep >= CONVERSATION_FLOW.length) {
        console.log('Reached end of conversation flow, completing job');
        completeJobCreation();
        return;
      }

      const step = CONVERSATION_FLOW[currentStep];
      console.log('askNextQuestion called for step:', step, 'currentStep:', currentStep);
      
      // Reset retry count on successful progression
      setRetryCount(0);
      
      switch (step) {
        case 'customer':
          simulateTyping(() => {
            try {
              const customerNames = customers?.map(c => c.name) || [];
              if (customerNames.length === 0) {
                addBotMessage(
                  "I notice there are no customers in the system. Please type the customer name manually. 🏢",
                  [],
                  ["Acme Corp", "Tech Solutions Ltd", "Global Industries"]
                );
              } else {
                addBotMessage(
                  "Which customer is this job for? 🏢",
                  customerNames.slice(0, 5), // Limit to first 5 customers
                  ["Select from list", "Type customer name"]
                );
              }
            } catch (error) {
              handleError('Failed to load customer list');
            }
          });
          break;

        case 'site':
          simulateTyping(() => {
            try {
              const selectedCustomer = customers?.find(c => c.name === jobData.customer);
              const sites = selectedCustomer?.sites || [];
              addBotMessage(
                `Great! Now, which site at ${jobData.customer || 'the customer'}? 📍`,
                sites.length > 0 ? sites.slice(0, 5) : [],
                sites.length > 0 ? sites.slice(0, 3) : ["Main Building", "North Wing", "South Building"]
              );
            } catch (error) {
              handleError('Failed to load site information');
            }
          });
          break;

        case 'reporterName':
          simulateTyping(() => {
            addBotMessage(
              "Who is reporting this issue? Please provide the reporter's name. 👤",
              [],
              ["John Smith", "Site Manager", "Facilities Team"]
            );
          });
          break;

        case 'reporterPhone':
          simulateTyping(() => {
            addBotMessage(
              `Thanks ${jobData.reporterName || 'there'}! What's the best contact number? 📞`,
              [],
              ["+44 20 7946 0958", "+44 7700 900123"]
            );
          });
          break;

        case 'description':
          simulateTyping(() => {
            addBotMessage(
              "Now, please describe the issue or work required. Be as detailed as possible! 📝",
              [],
              [
                "Heating system not working",
                "Electrical fault in office",
                "Water leak in bathroom",
                "Air conditioning too cold"
              ]
            );
          });
          break;

        case 'jobNature':
          simulateTyping(() => {
            addBotMessage(
              "What type of job is this? 🔧",
              ["Reactive", "Planned", "Preventive", "Emergency"],
              ["Most jobs are Reactive"]
            );
          });
          break;

        case 'priority':
          simulateTyping(() => {
            addBotMessage(
              "How urgent is this issue? ⚡",
              ["Low", "Medium", "High", "Critical"],
              ["Medium for most issues", "High if affecting multiple people"]
            );
          });
          break;

        case 'primaryTrade':
          simulateTyping(() => {
            try {
              const trades = mockJobTrades || ['General', 'Electrical', 'Plumbing', 'HVAC'];
              addBotMessage(
                "What type of engineer is needed? 🔨",
                trades.slice(0, 6),
                ["Electrical for power issues", "Plumbing for water", "HVAC for heating/cooling"]
              );
            } catch (error) {
              addBotMessage(
                "What type of engineer is needed? 🔨",
                ['General', 'Electrical', 'Plumbing', 'HVAC'],
                ["General maintenance"]
              );
            }
          });
          break;

        case 'contactName':
          simulateTyping(() => {
            addBotMessage(
              "Who should the engineer contact on-site? (Can be same as reporter) 👋",
              [],
              [jobData.reporterName || "", "Site Manager", "Reception Desk"]
            );
          });
          break;

        case 'contactPhone':
          simulateTyping(() => {
            addBotMessage(
              "What's the best contact number for the on-site contact? 📱",
              [],
              [jobData.reporterPhone || "", "Same as reporter"]
            );
          });
          break;

        case 'emergency':
          simulateTyping(() => {
            addBotMessage(
              "Is this an emergency requiring immediate attention? 🚨",
              ["Yes - Emergency", "No - Standard Job"],
              ["Most jobs are standard unless safety risk"]
            );
          });
          break;

        case 'jobOwner':
          simulateTyping(() => {
            addBotMessage(
              "Finally, who is the job owner/manager responsible? 👨‍💼",
              [],
              ["Facilities Manager", "Site Manager", jobData.reporterName || ""]
            );
          });
          break;

        case 'confirmation':
          simulateTyping(() => {
            try {
              const summary = generateJobSummary();
              addBotMessage(
                `Perfect! Here's a summary of the job I'll create:\n\n${summary}\n\nShall I create this job? ✅`,
                ["Yes, Create Job", "No, Let me review"],
                ["Double-check all details"]
              );
            } catch (error) {
              handleError('Failed to generate job summary');
            }
          }, 2000);
          break;

        default:
          console.log('Unknown step, completing job creation');
          completeJobCreation();
          break;
      }
    } catch (error) {
      console.error('Error in askNextQuestion:', error);
      handleError('Failed to ask next question');
    }
  };

  const generateJobSummary = () => {
    return `🏢 Customer: ${jobData.customer}
📍 Site: ${jobData.site}
👤 Reporter: ${jobData.reporterName} (${jobData.reporterPhone})
📝 Issue: ${jobData.description}
🔧 Type: ${jobData.jobNature} | ${jobData.primaryTrade}
⚡ Priority: ${jobData.priority}
👋 Contact: ${jobData.contactName} (${jobData.contactPhone})
🚨 Emergency: ${jobData.isEmergency ? 'YES' : 'NO'}
👨‍💼 Owner: ${jobData.jobOwner}`;
  };

  const handleUserInput = (input: string) => {
    console.log('Processing user input:', input, 'Current step:', currentStep, 'Step:', CONVERSATION_FLOW[currentStep]);
    
    try {
      if (!input.trim()) {
        addBotMessage(
          "I didn't receive any input. Could you please try again?",
          ["Skip This Step", "Use Default"],
          ["Please provide an answer"]
        );
        return;
      }

      // Handle special commands
      if (input.toLowerCase().includes('start over') || input.toLowerCase().includes('restart') || input.toLowerCase().includes('reset') || input.includes('🔄 Reset Chat')) {
        resetConversation();
        return;
      }

      if (input.toLowerCase().includes('skip') || input.toLowerCase().includes('use default')) {
        const step = CONVERSATION_FLOW[currentStep];
        const fallbackValue = getStepFallback(step);
        addUserMessage(`Using default: ${fallbackValue}`);
        handleStepData(step, fallbackValue);
        progressToNextStep();
        return;
      }

      if (input.toLowerCase().includes('create job with current data')) {
        fillMissingDataWithDefaults();
        completeJobCreation();
        return;
      }

      addUserMessage(input);
      setCurrentInput('');

      const step = CONVERSATION_FLOW[currentStep];
      console.log('Current step in flow:', step, 'Input:', input);

      // Validate input based on current step
      if (!validateStep(step, input)) {
        addBotMessage(
          `That doesn't look quite right for ${step}. Could you please try again?`,
          ["Try Again", "Skip This Step", "Use Default"],
          ["Please check your input"]
        );
        return;
      }

      // Process valid input and store in correct field
      handleStepData(step, input);
      
      // Log the current state for debugging
      console.log('Job data after step:', step, 'Data:', jobData);
      
      progressToNextStep();

    } catch (error) {
      console.error('Error processing user input:', error);
      handleError('Failed to process your input');
    }
  };

  const handleStepData = (step: string, input: string) => {
    try {
      console.log(`🔵 STORING DATA - Step: "${step}" | Value: "${input}" | Current Step Index: ${currentStep}`);
      
      // Create a new object to avoid state mutations
      setJobData(prev => {
        const newData = { ...prev };
        
        switch (step) {
          case 'customer':
            newData.customer = input;
            console.log('✅ SET CUSTOMER:', input);
            break;
          case 'site':
            newData.site = input;
            console.log('✅ SET SITE:', input);
            break;
          case 'reporterName':
            newData.reporterName = input;
            console.log('✅ SET REPORTER NAME:', input);
            break;
          case 'reporterPhone':
            newData.reporterPhone = input;
            console.log('✅ SET REPORTER PHONE:', input);
            break;
          case 'description':
            newData.description = input;
            console.log('✅ SET DESCRIPTION:', input);
            break;
          case 'jobNature':
            newData.jobNature = input;
            console.log('✅ SET JOB NATURE:', input);
            break;
          case 'priority':
            newData.priority = input as Job['priority'];
            console.log('✅ SET PRIORITY:', input);
            break;
          case 'primaryTrade':
            newData.primaryTrade = input;
            console.log('✅ SET PRIMARY TRADE:', input);
            break;
          case 'contactName':
            newData.contactName = input;
            console.log('✅ SET CONTACT NAME:', input);
            break;
          case 'contactPhone':
            newData.contactPhone = input;
            console.log('✅ SET CONTACT PHONE:', input);
            break;
          case 'emergency':
            newData.isEmergency = input.toLowerCase().includes('yes');
            console.log('✅ SET EMERGENCY:', newData.isEmergency);
            break;
          case 'jobOwner':
            newData.jobOwner = input;
            console.log('✅ SET JOB OWNER:', input);
            break;
          case 'confirmation':
            // Don't store confirmation, just process it
            if (input.toLowerCase().includes('yes')) {
              console.log('🎯 JOB CONFIRMED - Final data:', newData);
              completeJobCreation();
              return prev; // Return unchanged for confirmation
            } else {
              simulateTyping(() => {
                addBotMessage(
                  "No problem! What would you like to change? Just tell me which field needs updating. 🔄",
                  ["Change priority", "Update description", "Different customer", "Start over"],
                  ["Let me know what to fix"]
                );
              });
              return prev; // Return unchanged for rejection
            }
          default:
            console.warn('❌ UNKNOWN STEP:', step);
            return prev;
        }
        
        console.log('🟢 FINAL UPDATED DATA:', newData);
        return newData;
      });
    } catch (error) {
      console.error('Error handling step data:', error);
      const fallbackValue = getStepFallback(step);
      addBotMessage(
        `I had trouble saving that. I'll use a default value: ${fallbackValue}`,
        ["Continue", "Try Again"],
        ["Using fallback"]
      );
    }
  };

  const progressToNextStep = () => {
    try {
      console.log('Moving to next step from', currentStep, 'to', currentStep + 1);
      setCurrentStep(prev => prev + 1);
      setTimeout(() => {
        try {
          askNextQuestion();
        } catch (error) {
          handleError('Failed to ask next question');
        }
      }, 1000);
    } catch (error) {
      console.error('Error progressing to next step:', error);
      handleError('Failed to progress to next step');
    }
  };

  const fillMissingDataWithDefaults = () => {
    const defaults = {
      customer: jobData.customer || (customers?.[0]?.name || 'Unknown Customer'),
      site: jobData.site || 'Main Site',
      reporterName: jobData.reporterName || 'Anonymous Reporter',
      reporterPhone: jobData.reporterPhone || '000-000-0000',
      description: jobData.description || 'General maintenance issue',
      jobNature: jobData.jobNature || 'Reactive',
      priority: jobData.priority || 'Medium',
      primaryTrade: jobData.primaryTrade || 'General',
      contactName: jobData.contactName || jobData.reporterName || 'Site Contact',
      contactPhone: jobData.contactPhone || jobData.reporterPhone || '000-000-0000',
      isEmergency: jobData.isEmergency || false,
      jobOwner: jobData.jobOwner || 'Facilities Manager'
    };
    
    setJobData(defaults);
    return defaults;
  };

  const completeJobCreation = () => {
    try {
      simulateTyping(() => {
        try {
          // Ensure we have all required data
          const finalJobData = fillMissingDataWithDefaults();
          const jobNumber = generateJobNumber();
          
          const newJob: Omit<Job, 'id'> = {
            jobNumber,
            customer: finalJobData.customer,
            site: finalJobData.site,
            description: finalJobData.description,
            engineer: 'Unassigned',
            status: 'amber',
            priority: finalJobData.priority as Job['priority'],
            category: (finalJobData.primaryTrade || 'General') as Job['category'],
            jobType: finalJobData.isEmergency ? 'Emergency' : 'Maintenance',
            targetCompletionTime: finalJobData.isEmergency ? 30 : 120,
            dateLogged: new Date(),
            dateAccepted: null,
            dateOnSite: null,
            dateCompleted: null,
            reason: null,
            createdAt: new Date(),
            updatedAt: new Date(),
            contact: {
              name: finalJobData.contactName,
              number: finalJobData.contactPhone,
              email: '',
              relationship: 'On-site Contact'
            },
            reporter: {
              name: finalJobData.reporterName,
              number: finalJobData.reporterPhone,
              email: '',
              relationship: 'Reporter'
            },
            primaryJobTrade: finalJobData.primaryTrade || 'General',
            secondaryJobTrades: [],
            tags: finalJobData.isEmergency ? ['Emergency', 'Chatbot'] : ['Chatbot'],
            customAlerts: {
              acceptSLA: finalJobData.isEmergency ? 5 : 30,
              onsiteSLA: finalJobData.isEmergency ? 15 : 90,
              completedSLA: finalJobData.isEmergency ? 30 : 180
            },
            project: '',
            customerOrderNumber: '',
            referenceNumber: '',
            jobOwner: finalJobData.jobOwner,
            jobRef1: '',
            jobRef2: '',
            requiresApproval: false,
            preferredAppointmentDate: null,
            startDate: new Date(),
            endDate: null,
            lockVisitDateTime: finalJobData.isEmergency || false,
            deployToMobile: true,
            isRecurringJob: false,
            completionTimeFromEngineerOnsite: false
          };

          onJobCreate(newJob);
          setIsCompleted(true);
          
          addBotMessage(
            `🎉 Perfect! Job ${jobNumber} has been created successfully!\n\nThe job is now in the system and will be assigned to an engineer shortly. You can track its progress in the main dashboard.\n\nIs there anything else I can help you with?`,
            ["Create Another Job", "View Dashboard", "Close Chat"],
            ["Great work!", "All done!"]
          );
        } catch (error) {
          console.error('Error creating job:', error);
          addBotMessage(
            "I encountered an error while creating the job. Let me try with the basic information we have.",
            ["Try Again", "Close Chat", "Start Over"],
            ["Technical issue"]
          );
        }
      }, 2000);
    } catch (error) {
      console.error('Error in completeJobCreation:', error);
      addBotMessage(
        "I'm having trouble completing the job creation. Please try using the regular job form.",
        ["Close Chat", "Start Over"],
        ["Fallback to manual entry"]
      );
    }
  };

  const handleOptionClick = (option: string) => {
    console.log('Option clicked:', option, 'Current step:', currentStep, 'Step name:', CONVERSATION_FLOW[currentStep]);
    handleUserInput(option);
    
    // Auto-scroll after option click
    setTimeout(() => {
      scrollToBottom();
    }, 100);
  };

  const handleSuggestionClick = (suggestion: string) => {
    console.log('Suggestion clicked:', suggestion);
    setCurrentInput(suggestion);
    inputRef.current?.focus();
    
    // Auto-scroll to show input area
    setTimeout(() => {
      scrollToBottom();
    }, 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleUserInput(currentInput);
      
      // Auto-scroll after enter
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsMinimized(false)}
          className="h-12 w-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed top-4 left-4 right-4 bottom-4 z-50 flex flex-col max-w-5xl mx-auto">
      <Card className="flex-1 flex flex-col shadow-2xl border-blue-200 h-full">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg py-3 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-base font-medium">AI Job Logger Assistant</CardTitle>
                <p className="text-xs text-blue-100">
                  {isTyping ? "Typing..." : "Online - Guided Job Creation"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(true)}
                className="h-8 w-8 p-0 text-white hover:bg-white/20"
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
              {onClose && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="h-8 w-8 p-0 text-white hover:bg-white/20"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
          <ScrollArea className="flex-1 p-4 overflow-y-auto scroll-smooth" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg p-3 ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    {message.type === 'bot' && (
                      <div className="flex items-center gap-2 mb-2">
                        <Bot className="h-4 w-4 text-blue-600" />
                        <span className="text-xs font-medium text-blue-600">AI Assistant</span>
                      </div>
                    )}
                    <p className="text-sm whitespace-pre-line leading-relaxed">{message.content}</p>
                    
                    {/* Options */}
                    {message.options && message.options.length > 0 && (
                      <div className="mt-3 space-y-1">
                        {message.options.map((option, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={() => handleOptionClick(option)}
                            className="w-full justify-start text-sm h-8 hover:bg-blue-50"
                          >
                            {option}
                          </Button>
                        ))}
                      </div>
                    )}

                    {/* Suggestions */}
                    {message.suggestions && message.suggestions.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {message.suggestions.map((suggestion, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="cursor-pointer hover:bg-blue-100 text-xs py-1 px-2"
                            onClick={() => handleSuggestionClick(suggestion)}
                          >
                            <Sparkles className="h-3 w-3 mr-1" />
                            {suggestion}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg p-3 max-w-[85%]">
                    <div className="flex items-center gap-2">
                      <Bot className="h-4 w-4 text-blue-600" />
                      <span className="text-xs font-medium text-blue-600">AI Assistant is typing</span>
                      <div className="flex space-x-1">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Invisible element to scroll to */}
              <div ref={messagesEndRef} className="h-1" />
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="border-t p-4 bg-gray-50 flex-shrink-0">
            <div className="flex gap-3">
              <Input
                ref={inputRef}
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your answer or use the buttons above..."
                className="flex-1 h-10 text-sm"
              />
              <Button
                onClick={() => {
                  handleUserInput(currentInput);
                  setTimeout(() => {
                    scrollToBottom();
                  }, 100);
                }}
                disabled={!currentInput.trim() || isTyping}
                className="h-10 px-4"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              💡 Click option buttons above or type your answer • Press Enter to send
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

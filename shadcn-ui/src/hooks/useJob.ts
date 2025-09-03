import { useContext } from 'react';
import JobContext from '@/contexts/JobContext';

export const useJob = () => {
  const context = useContext(JobContext);
  if (context === undefined) {
    throw new Error('useJob must be used within a JobProvider');
  }
  return context;
};

import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { JobProvider } from '@/contexts/JobContext';
import { SettingsProvider } from '@/contexts/SettingsContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <SettingsProvider>
    <JobProvider>
      <App />
    </JobProvider>
  </SettingsProvider>
);

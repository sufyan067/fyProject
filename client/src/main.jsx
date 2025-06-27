import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { Provider } from 'react-redux';
import { appStore } from './app/store';
import { Toaster } from './components/ui/sonner';
//import { BrowserRouter } from 'react-router-dom';
import { useLoadUserQuery } from './features/api/authApi';
import { Loader2 } from 'lucide-react';

const Custom = ({ children }) => {
  const { isLoading } = useLoadUserQuery();
  
  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  return children;
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={appStore}>
      <Custom>
        <App />
        <Toaster />
      </Custom>
    </Provider>
  </StrictMode>
);


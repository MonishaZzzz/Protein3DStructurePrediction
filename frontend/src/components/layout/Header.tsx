import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, SunMoon, Moon, BellRing } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

interface HeaderProps {
  setSidebarOpen: (open: boolean) => void;
}

const Header = ({ setSidebarOpen }: HeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  
  // Set page title based on current route
  const getPageTitle = () => {
    const path = location.pathname;
    
    if (path === '/') return 'Dashboard';
    if (path === '/submit') return 'Submit New Job';
    if (path.startsWith('/result')) return 'View Results';
    if (path === '/history') return 'Job History';
    
    return 'ProteinFold AI';
  };
  
  return (
    <header className="relative z-10">
      <div className="glass border-b shadow-sm border-gray-200 dark:border-gray-800">
        <div className="flex justify-between items-center h-16 px-4 sm:px-6 lg:px-8">
          {/* Left side */}
          <div className="flex items-center">
            <button
              type="button"
              className="md:hidden -ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <Menu className="h-6 w-6" />
            </button>
            
            <div className="ml-4 md:ml-0">
              <motion.h1 
                className="text-xl font-semibold"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {getPageTitle()}
              </motion.h1>
            </div>
          </div>
          
          {/* Right side */}
          <div className="flex items-center space-x-4">
            <button
              type="button"
              className="rounded-full p-1.5 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <span className="sr-only">View notifications</span>
              <BellRing className="h-5 w-5" />
            </button>
            
            <button
              type="button"
              className="rounded-full p-1.5 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              onClick={toggleTheme}
            >
              <span className="sr-only">Toggle theme</span>
              {theme === 'dark' ? (
                <SunMoon className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
            
            {/* Profile dropdown could go here */}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
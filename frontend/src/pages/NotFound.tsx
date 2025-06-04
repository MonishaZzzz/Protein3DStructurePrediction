import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home } from 'lucide-react';

const NotFound = () => {
  return (
    <motion.div 
      className="max-w-md mx-auto text-center py-16 px-4 sm:py-24"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1 
        className="text-6xl font-extrabold text-primary-500 mb-4"
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, type: 'spring' }}
      >
        404
      </motion.h1>
      
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Page not found</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Sorry, we couldn't find the page you're looking for.
        </p>
        
        <Link
          to="/"
          className="btn btn-primary inline-flex items-center"
        >
          <Home className="mr-2 h-5 w-5" />
          Back to Home
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default NotFound;
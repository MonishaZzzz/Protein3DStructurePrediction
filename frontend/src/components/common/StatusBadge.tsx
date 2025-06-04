import { motion } from 'framer-motion';

interface StatusBadgeProps {
  status: 'Queued' | 'Processing' | 'Completed' | 'Failed';
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const getBadgeColor = () => {
    switch (status) {
      case 'Queued':
        return 'bg-warning-500/20 text-warning-700 dark:text-warning-400 border-warning-500/30';
      case 'Processing':
        return 'bg-primary-500/20 text-primary-700 dark:text-primary-400 border-primary-500/30';
      case 'Completed':
        return 'bg-success-500/20 text-success-700 dark:text-success-400 border-success-500/30';
      case 'Failed':
        return 'bg-error-500/20 text-error-700 dark:text-error-400 border-error-500/30';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const circle = {
    hidden: {
      pathLength: 0,
      opacity: 0
    },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { type: "spring", duration: 1.5, bounce: 0 },
        opacity: { duration: 0.01 }
      }
    }
  };

  return (
    <motion.span 
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getBadgeColor()}`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {status === 'Processing' && (
        <svg className="animate-spin -ml-1 mr-2 h-3 w-3" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {status === 'Completed' && (
        <svg className="-ml-1 mr-2 h-3 w-3" viewBox="0 0 24 24">
          <motion.path
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            d="M5 13l4 4L19 7"
            variants={circle}
            initial="hidden"
            animate="visible"
          />
        </svg>
      )}
      {status}
    </motion.span>
  );
};

export default StatusBadge;
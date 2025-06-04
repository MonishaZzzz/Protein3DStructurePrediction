import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ProgressCircleProps {
  progress: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
  className?: string;
}

const ProgressCircle = ({ 
  progress, 
  size = 120, 
  strokeWidth = 8,
  className = ''
}: ProgressCircleProps) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  
  // Animation for progress
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(progress);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [progress]);
  
  // Calculate circle values
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (animatedProgress / 100) * circumference;
  
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          className="text-gray-200 dark:text-gray-700"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        
        {/* Progress circle */}
        <motion.circle
          className="text-primary-500"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-2xl font-bold">{Math.round(animatedProgress)}%</span>
      </div>
    </div>
  );
};

export default ProgressCircle;
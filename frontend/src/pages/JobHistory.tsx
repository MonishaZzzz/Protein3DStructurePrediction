import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { useJob } from '../context/JobContext';
import StatusBadge from '../components/common/StatusBadge';
import { Search, RefreshCw, Trash2 } from 'lucide-react';

const JobHistory = () => {
  const { jobs, refreshJobs } = useJob();
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filteredJobs, setFilteredJobs] = useState<any[]>([]);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  
  // Filter jobs when search term or active filter changes
  useEffect(() => {
    let filtered = [...jobs];
    
    // Apply status filter
    if (activeFilter) {
      filtered = filtered.filter(job => job.status === activeFilter);
    }
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(job => 
        job.job_id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Sort by creation date (newest first)
    filtered = filtered.sort((a, b) => {
      const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
      return dateB - dateA;
    });
    
    setFilteredJobs(filtered);
  }, [jobs, searchTerm, activeFilter]);
  
  // Handle refresh button
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshJobs();
    setTimeout(() => setIsRefreshing(false), 600); // UI feedback
  };
  
  // Format date for display
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '—';
    try {
      return format(new Date(dateString), 'MMM d, yyyy h:mm a');
    } catch (e) {
      return '—';
    }
  };
  
  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="glass-card p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <h1 className="text-2xl font-semibold">Job History</h1>
          
          <div className="flex items-center space-x-3">
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-slate-800 rounded-md"
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <button
              onClick={handleRefresh}
              className="btn btn-secondary inline-flex items-center"
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
        
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveFilter(null)}
            className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
              activeFilter === null 
                ? 'bg-primary-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveFilter('Completed')}
            className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
              activeFilter === 'Completed' 
                ? 'bg-success-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Completed
          </button>
          <button
            onClick={() => setActiveFilter('Processing')}
            className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
              activeFilter === 'Processing' 
                ? 'bg-primary-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Processing
          </button>
          <button
            onClick={() => setActiveFilter('Queued')}
            className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
              activeFilter === 'Queued' 
                ? 'bg-warning-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Queued
          </button>
          <button
            onClick={() => setActiveFilter('Failed')}
            className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
              activeFilter === 'Failed' 
                ? 'bg-error-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Failed
          </button>
        </div>
        
        {filteredJobs.length > 0 ? (
          <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-slate-800">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Job ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-800/50 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredJobs.map((job) => (
                  <tr key={job.job_id} className="hover:bg-gray-50 dark:hover:bg-slate-800/80 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">
                      {job.job_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={job.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {formatDate(job.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-3">
                        <button className="text-gray-400 hover:text-error-500 dark:text-gray-500 dark:hover:text-error-400">
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <Link
                          to={`/result/${job.job_id}`}
                          className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                        >
                          View
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="mt-2">No jobs found</p>
            <div className="mt-4">
              <Link to="/submit" className="btn btn-primary">Submit Job</Link>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default JobHistory;
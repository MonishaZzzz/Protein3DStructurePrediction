import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, PlusCircle, Dna, Activity, Clock } from "lucide-react";
import { useJob } from "../context/JobContext";
import StatusBadge from "../components/common/StatusBadge";

const Dashboard = () => {
  const navigate = useNavigate();
  const { jobs, refreshJobs } = useJob();
  const [recentJobs, setRecentJobs] = useState<any[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    processing: 0,
    failed: 0,
  });

  // Load recent jobs and stats
  useEffect(() => {
    refreshJobs();
  }, []);

  // Process jobs for dashboard
  useEffect(() => {
    // Get 5 most recent jobs
    const recent = [...jobs]
      .sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateB - dateA;
      })
      .slice(0, 5);

    setRecentJobs(recent);

    // Calculate stats
    setStats({
      total: jobs.length,
      completed: jobs.filter((job) => job.status === "Completed").length,
      processing: jobs.filter((job) =>
        ["Queued", "Processing"].includes(job.status)
      ).length,
      failed: jobs.filter((job) => job.status === "Failed").length,
    });
  }, [jobs]);

  return (
    <div className="space-y-6">
      {/* Hero section */}
      <motion.div
        className="glass-card relative overflow-hidden p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
          <Dna className="w-full h-full text-primary-500" />
        </div>

        <h1 className="text-3xl font-bold mb-2">
          Protein Structure Prediction
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl">
          The methods implemented to find the structure of the protein from the
          amino acid sequence. Two different residual neural networks (ResNets)
          are used to predict angles between adjacent aminoacids (AAs) and
          distance between every pair of AAs of a protein. For distance
          prediction a 2D Resnet was used while for angles prediction a 1D
          Resnet was used.
        </p>

        <button
          onClick={() => navigate("/submit")}
          className="btn btn-primary inline-flex items-center"
        >
          <PlusCircle className="mr-2 h-5 w-5" />
          New Prediction
        </button>
      </motion.div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          className="glass-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium">Total Jobs</h3>
            <div className="p-2 bg-primary-500/10 rounded-lg">
              <Activity className="h-5 w-5 text-primary-500" />
            </div>
          </div>
          <p className="text-3xl font-bold">{stats.total}</p>
        </motion.div>

        <motion.div
          className="glass-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium">Completed</h3>
            <div className="p-2 bg-success-500/10 rounded-lg">
              <Dna className="h-5 w-5 text-success-500" />
            </div>
          </div>
          <p className="text-3xl font-bold">{stats.completed}</p>
        </motion.div>

        <motion.div
          className="glass-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium">Processing</h3>
            <div className="p-2 bg-warning-500/10 rounded-lg">
              <Clock className="h-5 w-5 text-warning-500" />
            </div>
          </div>
          <p className="text-3xl font-bold">{stats.processing}</p>
        </motion.div>

        <motion.div
          className="glass-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium">Failed</h3>
            <div className="p-2 bg-error-500/10 rounded-lg">
              <svg
                className="h-5 w-5 text-error-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold">{stats.failed}</p>
        </motion.div>
      </div>

      {/* Recent jobs */}
      <motion.div
        className="glass-card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Recent Jobs</h2>
          <Link
            to="/history"
            className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 inline-flex items-center text-sm font-medium"
          >
            View all
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        {recentJobs.length > 0 ? (
          <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-slate-800">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Job ID
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-800/50 divide-y divide-gray-200 dark:divide-gray-700">
                {recentJobs.map((job) => (
                  <tr
                    key={job.job_id}
                    className="hover:bg-gray-50 dark:hover:bg-slate-800/80 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">
                      {job.job_id.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={job.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/result/${job.job_id}`}
                        className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Dna className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600 mb-3" />
            <p>No jobs found. Start by submitting a protein sequence.</p>
            <button
              onClick={() => navigate("/submit")}
              className="mt-4 btn btn-primary inline-flex items-center"
            >
              <PlusCircle className="mr-2 h-5 w-5" />
              New Prediction
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard;

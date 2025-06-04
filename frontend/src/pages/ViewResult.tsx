import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Download, ArrowLeft, Share2, Info } from "lucide-react";
import { useJob } from "../context/JobContext";
import ProteinViewer from "../components/common/ProteinViewer";
import StatusBadge from "../components/common/StatusBadge";
import ProgressCircle from "../components/common/ProgressCircle";

const ViewResult = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const { fetchJobStatus, fetchJobResult, jobStatus, jobResult } = useJob();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Calculate a fake progress percentage for visualization
  const [progressPercentage, setProgressPercentage] = useState(0);

  useEffect(() => {
    if (!jobId) return;

    // Initial fetch
    const timer = setInterval(() => {
      fetchJobStatus(jobId);
      setLoading(false);
    }, 10000);

    // If job is in progress, simulate progress percentage
    if (jobStatus === "Processing" || jobStatus === "Queued") {
      const simulateProgress = () => {
        setProgressPercentage((prev) => {
          // Cap at 95% until actually complete
          const target = jobStatus === "Queued" ? 30 : 95;
          const increment = jobStatus === "Queued" ? 1 : 2;

          if (prev < target) {
            return Math.min(prev + increment, target);
          }
          return prev;
        });
      };

      const timer = setInterval(simulateProgress, 10000);
    } else if (jobStatus === "Completed") {
      //
      // setTimeout(() => {}, 10000);
      // //

      setProgressPercentage(100);

      // Fetch result if job is completed
      if (!jobResult) {
        fetchJobResult(jobId);
      }
    }
    return () => clearInterval(timer);
  }, [jobId, jobStatus]);

  // Download result as PDB file
  const handleDownload = () => {
    if (!jobResult) return;

    const blob = new Blob([jobResult], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `protein_${jobId}.pdb`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Share result
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Protein Structure Prediction Result",
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header with navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/history"
          className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          Back to History
        </Link>

        {jobStatus === "Completed" && (
          <div className="flex space-x-3">
            <button
              onClick={handleShare}
              className="btn btn-secondary inline-flex items-center"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </button>

            <button
              onClick={handleDownload}
              className="btn btn-primary inline-flex items-center"
              disabled={!jobResult}
            >
              <Download className="h-4 w-4 mr-2" />
              Download PDB
            </button>
          </div>
        )}
      </div>

      {/* Job details */}
      <motion.div
        className="glass-card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">Job Details</h1>
            <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              ID: <span className="font-mono">{jobId}</span>
            </div>
            <StatusBadge status={(jobStatus as any) || "Processing"} />
          </div>

          {(jobStatus === "Processing" || jobStatus === "Queued") && (
            <div className="mt-4 md:mt-0">
              <ProgressCircle progress={progressPercentage} />
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <svg
              className="animate-spin h-8 w-8 text-primary-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        ) : error ? (
          <div className="bg-error-500/10 border border-error-500/30 text-error-700 dark:text-error-400 p-4 rounded-lg">
            {error}
          </div>
        ) : (
          <>
            {jobStatus === "Completed" && jobResult ? (
              <div className="space-y-6">
                <ProteinViewer pdbData={jobResult} />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="glass border border-gray-200 dark:border-gray-700 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Prediction Method
                    </h3>
                    <p className="font-medium">
                      Protein Folding using CASP_7 Dataset
                    </p>
                  </div>

                  <div className="glass border border-gray-200 dark:border-gray-700 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Model Algorithm
                    </h3>
                    <p className="font-medium">Pretrained ResNets</p>
                  </div>

                  {/* <div className="glass border border-gray-200 dark:border-gray-700 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Sequence Length
                    </h3>
                    <p className="font-medium">
                      {jobResult.length > 0
                        ? Math.floor(jobResult.length / 80)
                        : "—"}{" "}
                      aa
                    </p>
                  </div> */}

                  <div className="glass border border-gray-200 dark:border-gray-700 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      File Format
                    </h3>
                    <p className="font-medium">PDB</p>
                  </div>
                </div>
              </div>
            ) : jobStatus === "Failed" ? (
              <div className="bg-error-500/10 border border-error-500/30 text-error-700 dark:text-error-400 p-6 rounded-lg text-center">
                <svg
                  className="mx-auto h-12 w-12 text-error-500 mb-4"
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
                <h3 className="text-lg font-medium mb-2">Prediction Failed</h3>
                <p>
                  There was an error processing your protein sequence. Please
                  try again with a different sequence.
                </p>
                <Link to="/submit" className="btn btn-primary mt-4 inline-flex">
                  Try Again
                </Link>
              </div>
            ) : (
              <div className="bg-primary-500/10 border border-primary-500/30 text-primary-700 dark:text-primary-400 p-6 rounded-lg">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Info className="h-5 w-5 text-primary-500" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium">
                      Your protein structure is being predicted
                    </h3>
                    <div className="mt-2 text-sm">
                      <p>
                        This process typically takes 1-10 minutes depending on
                        the sequence length. You can leave this page and come
                        back later - your results will be saved.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
};

export default ViewResult;

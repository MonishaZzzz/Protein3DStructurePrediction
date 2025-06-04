import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// Job types
export interface Job {
  job_id: string;
  status: "Queued" | "Processing" | "Completed" | "Failed";
  error?: string;
  created_at?: string; // For tracking when a job was submitted
}

interface JobContextType {
  currentJob: string | null;
  setCurrentJob: (jobId: string | null) => void;
  jobStatus: string | null;
  jobResult: string | null;
  jobs: Job[];
  refreshJobs: () => Promise<void>;
  submitJob: (sequence: string) => Promise<string>;
  fetchJobStatus: (jobId: string) => Promise<void>;
  fetchJobResult: (jobId: string) => Promise<void>;
}

const JobContext = createContext<JobContextType | undefined>(undefined);

// API base URL - should match your backend server
const API_BASE_URL = "http://localhost:5000";

export function JobProvider({ children }: { children: ReactNode }) {
  const [currentJob, setCurrentJob] = useState<string | null>(null);
  const [jobStatus, setJobStatus] = useState<string | null>(null);
  const [jobResult, setJobResult] = useState<string | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);

  // Fetch job history on initial load
  useEffect(() => {
    refreshJobs();
  }, []);

  // Periodically refresh job history
  useEffect(() => {
    const interval = setInterval(() => {
      refreshJobs();
    }, 10000); // Every 10 seconds

    return () => clearInterval(interval);
  }, []);

  // Monitor current job status if one is selected
  useEffect(() => {
    if (!currentJob) return;

    const interval = setInterval(() => {
      fetchJobStatus(currentJob);
    }, 3000);

    return () => clearInterval(interval);
  }, [currentJob]);

  // Fetch job history
  const refreshJobs = async (): Promise<void> => {
    try {
      const res = await fetch(`${API_BASE_URL}/history`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to fetch job history: ${errorText}`);
      }

      const data = await res.json();

      // Add timestamps if they don't exist
      const jobsWithTimestamps = data.map((job: Job) => {
        if (!job.created_at) {
          return { ...job, created_at: new Date().toISOString() };
        }
        return job;
      });

      setJobs(jobsWithTimestamps);
    } catch (error) {
      console.error("Error fetching job history:", error);
    }
  };

  // Submit a new job
  const submitJob = async (sequence: string): Promise<string> => {
    try {
      const res = await fetch(`${API_BASE_URL}/submit`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sequence }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to submit job: ${errorText}`);
      }

      const data = await res.json();
      setCurrentJob(data.job_id);
      setJobStatus("Queued");

      // Add to jobs list immediately
      setJobs((prev) => [
        {
          job_id: data.job_id,
          status: "Queued",
          created_at: new Date().toISOString(),
        },
        ...prev,
      ]);

      return data.job_id;
    } catch (error) {
      console.error("Error submitting job:", error);
      throw error;
    }
  };

  // Fetch job status
  const fetchJobStatus = async (jobId: string): Promise<void> => {
    try {
      const res = await fetch(`${API_BASE_URL}/status/${jobId}`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to fetch job status: ${errorText}`);
      }

      const data = await res.json();
      setJobStatus(data.status);

      // Update in jobs list
      setJobs((prev) =>
        prev.map((job) =>
          job.job_id === jobId ? { ...job, status: data.status } : job
        )
      );

      // If job is completed, fetch the result
      if (data.status === "Completed") {
        fetchJobResult(jobId);
      }
    } catch (error) {
      console.error("Error fetching job status:", error);
    }
  };

  // Fetch job result
  const fetchJobResult = async (jobId: string): Promise<void> => {
    try {
      const res = await fetch(`${API_BASE_URL}/result/${jobId}`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to fetch job result: ${errorText}`);
      }

      const data = await res.json();
      setJobResult(data.pdb);
    } catch (error) {
      console.error("Error fetching job result:", error);
    }
  };

  return (
    <JobContext.Provider
      value={{
        currentJob,
        setCurrentJob,
        jobStatus,
        jobResult,
        jobs,
        refreshJobs,
        submitJob,
        fetchJobStatus,
        fetchJobResult,
      }}
    >
      {children}
    </JobContext.Provider>
  );
}

export const useJob = (): JobContextType => {
  const context = useContext(JobContext);
  if (context === undefined) {
    throw new Error("useJob must be used within a JobProvider");
  }
  return context;
};

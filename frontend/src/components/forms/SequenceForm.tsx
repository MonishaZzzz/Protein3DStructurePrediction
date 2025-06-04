import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useJob } from "../../context/JobContext";
import { Dna } from "lucide-react";

const examples = {
  short: ">Short peptide\nGGGPGGGPGGGPGGGP",
  medium:
    ">Medium protein\nMVLSEGEWQLVLHVWAKVEADVAGHGQDILIRLFKSHPETLEKFDRFKHLKTEAEMKASEDLKKHGVTVLTALGAILKKKGHHEAELKPLAQSHATKHKIPIKYLEFISEAIIHVLHSRHPAGNFGADAQGAMNKALELFRKDIAAKYKELGYQG",
  long: ">Long protein\nMKTIIALSYIFCLVFADYKDDDDKAPQRKLLQRLQALERQSYRASVRQQYENELQYSHLVGNTNIYFAGTEGACPSFSSGGIYNAKQYLLSLNGFNSMYNYCRLVECAWNEQYGTNYMKQDLYYDTKKNAISYPNGVNPLDVYQPCGQVSSQDLEYLEELPAPSIYAHQLLEYRNFYQDFYAFQNKCHELVHYFNRAWKILGGENCQYRVIAFPGFNILRIKQKGEEYSINAMSQDLNANFSASPDVLKDFEAADTVKQLKESSDELVMECNYKMDLLRTLSHQMGVASNVQAWRSYEYVIAFGHDRNNNIEFAHDCTNHVHTVWLSLDRSCQYMIIQDRSMQQKCDYFYNQDMGIENMYPGVFYAYPHFQRLIYISQDNDP",
};

const SequenceForm = () => {
  const navigate = useNavigate();
  const { submitJob } = useJob();
  const [sequence, setSequence] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formValid, setFormValid] = useState(false);

  // Validate sequence on change
  const handleSequenceChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setSequence(value);

    // Basic validation - require at least 10 characters
    setFormValid(value.trim().length >= 10);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formValid) {
      setError(
        "Please enter a valid protein sequence (minimum 10 characters)."
      );
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const jobId = await submitJob(sequence);
      navigate(`/result/${jobId}`);
    } catch (err) {
      setError("Failed to submit job. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Load example sequence
  const loadExample = (type: keyof typeof examples) => {
    setSequence(examples[type]);
    setFormValid(true);
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="glass-card p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center mb-4">
        <Dna className="h-6 w-6 text-primary-500 mr-2" />
        <h2 className="text-xl font-semibold">Submit Protein Sequence</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="sequence"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Protein Sequence (FASTA format)
          </label>
          <textarea
            id="sequence"
            rows={10}
            className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50 transition-colors"
            placeholder=">Protein name
MVLSPADKTNVKAAWGKVGAHAGEYGAEALERMFLSFPTTKTYFPHFDLSHGSAQVKGHGKKVADALTNAVAHVDDMPNALSALSDLHAHKLRVDPVNFKLLSHCLLVTLAAHLPAEFTPAVHASLDKFLASVSTVLTSKYR"
            value={sequence}
            onChange={handleSequenceChange}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            onClick={() => loadExample("short")}
          >
            Load short example
          </button>
          <button
            type="button"
            className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            onClick={() => loadExample("medium")}
          >
            Load medium example
          </button>
          <button
            type="button"
            className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            onClick={() => loadExample("long")}
          >
            Load long example
          </button>
        </div>

        {error && (
          <div className="bg-error-500/10 border border-error-500/30 text-error-700 dark:text-error-400 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!formValid || isLoading}
            className={`btn btn-primary ${
              isLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                Processing...
              </>
            ) : (
              "Submit for Prediction"
            )}
          </button>
        </div>
      </div>
    </motion.form>
  );
};

export default SequenceForm;

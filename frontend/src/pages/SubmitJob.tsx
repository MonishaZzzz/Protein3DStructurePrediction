import { motion } from 'framer-motion';
import SequenceForm from '../components/forms/SequenceForm';
import { Info } from 'lucide-react';

const SubmitJob = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div
        className="glass-card p-6 border-l-4 border-primary-500"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex">
          <div className="flex-shrink-0">
            <Info className="h-5 w-5 text-primary-500" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200">
              About Protein Structure Prediction
            </h3>
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              <p>
                Our system uses ESMFold, a state-of-the-art deep learning model for predicting protein structures directly from amino acid sequences.
                The prediction process typically takes 1-10 minutes depending on the protein size.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
      
      <SequenceForm />
      
      <motion.div
        className="glass-card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h3 className="text-lg font-medium mb-3">Input Guidelines</h3>
        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
          <li className="flex items-start">
            <span className="text-primary-500 mr-2">•</span>
            <span>Use standard FASTA format with sequence header (optional) and amino acid sequence</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary-500 mr-2">•</span>
            <span>Maximum sequence length: 1,000 amino acids</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary-500 mr-2">•</span>
            <span>For best results, ensure the sequence contains only standard amino acid codes (A, C, D, E, F, G, H, I, K, L, M, N, P, Q, R, S, T, V, W, Y)</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary-500 mr-2">•</span>
            <span>Predictions for larger proteins will take longer to process</span>
          </li>
        </ul>
      </motion.div>
    </div>
  );
};

export default SubmitJob;
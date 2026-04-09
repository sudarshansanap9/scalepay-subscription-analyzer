import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, FileText, CheckCircle, Loader2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';
import { generateDemoTransactions } from '../utils/data';

export const Upload = () => {
  const [fileStatus, setFileStatus] = useState('idle'); // idle, reading, parsing, success
  const { processCSV, loadDemoData, isLoading } = useStore();
  const navigate = useNavigate();

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setFileStatus('reading');
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          setFileStatus('parsing');
          // Map to standard layout safely. We guess common fields for flexibility.
          const mappedData = results.data.map((row) => {
            const date = row.Date || row.date || row.Date_Of_Transaction || new Date().toISOString();
            const description = row.Description || row.description || row.Details || row.Narration || 'Unknown TXN';
            // Extract numeric value from potentially string amount
            let amountStr = row.Amount || row.amount || row.Credit || row.Debit || row.Withdrawal || "0";
            const amount = parseFloat(amountStr.replace(/[^0-9.-]+/g, ""));
            
            return {
              id: crypto.randomUUID(),
              date,
              description,
              amount: isNaN(amount) ? 0 : amount,
              category: 'Unknown' // Ideally mapped by real ML
            };
          }).filter(t => t.amount !== 0);

          setTimeout(() => {
            setFileStatus('success');
            processCSV(mappedData);
            setTimeout(() => navigate('/'), 1000);
          }, 800);
        }
      });
    }
  }, [processCSV, navigate]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'text/csv': ['.csv'] },
    maxFiles: 1
  });

  const handleDemoData = () => {
    const demo = generateDemoTransactions();
    loadDemoData(demo);
    setTimeout(() => navigate('/'), 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto h-full flex flex-col items-center justify-center pt-10 pb-20"
    >
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
          Upload Bank Statement
        </h1>
        <p className="text-textMuted max-w-xl mx-auto text-lg hover:text-text transition-colors">
          Upload your CSV statement to automatically detect subscriptions and find cost-saving opportunities.
        </p>
      </div>

      <div 
        {...getRootProps()} 
        className={`w-full max-w-2xl glass-card p-12 text-center cursor-pointer border-2 transition-all duration-300 ease-in-out ${
          isDragActive ? 'border-primary/50 bg-primary/5 shadow-[0_0_40px_rgba(59,130,246,0.1)]' : 'border-dashed border-white/20 hover:border-white/40 hover:bg-white/5'
        }`}
      >
        <input {...getInputProps()} />
        <AnimatePresence mode="wait">
          {fileStatus === 'idle' && (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center"
            >
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 shadow-inner">
                <UploadCloud size={40} className="text-primary" />
              </div>
              <p className="text-xl font-semibold mb-2">Drag & drop your CSV file here</p>
              <p className="text-textMuted text-sm">or click to browse files</p>
            </motion.div>
          )}

          {(fileStatus === 'reading' || fileStatus === 'parsing') && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center"
            >
              <Loader2 size={48} className="text-primary animate-spin mb-6" />
              <p className="text-xl font-medium animate-pulse">
                {fileStatus === 'reading' ? 'Reading File...' : 'Analyzing Transactions...'}
              </p>
            </motion.div>
          )}

          {fileStatus === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center"
            >
              <CheckCircle size={56} className="text-accent mb-4" />
              <p className="text-xl font-medium text-accent">Analysis Complete!</p>
              <p className="text-sm text-textMuted mt-2">Redirecting to dashboard...</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-12 text-center">
        <p className="text-textMuted mb-4">Don't have a statement handy?</p>
        <button
          onClick={handleDemoData}
          disabled={isLoading}
          className="glass-button px-6 py-3 rounded-xl flex items-center gap-2 mx-auto disabled:opacity-50 group hover:scale-105"
        >
          {isLoading ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <FileText size={20} className="group-hover:text-amber-100" />
          )}
          Load Demo Data
        </button>
      </div>
    </motion.div>
  );
};

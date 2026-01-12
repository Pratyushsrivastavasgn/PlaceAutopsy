import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Upload,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Target,
  TrendingUp,
  Award,
  AlertTriangle,
  Zap,
  ChevronRight,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import Squares from '@/components/Squares';
import { analyzeResumeLocal } from '@/services/atsAnalyzerLocal';
import { parseResume } from '@/services/resumeParser';
import type { ATSAnalysis } from '@/types';

export default function ResumeAnalysis() {
  const [file, setFile] = useState<File | null>(null);
  const [targetRole, setTargetRole] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<ATSAnalysis | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const uploadedFile = acceptedFiles[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setError(null);
      setAnalysis(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const handleAnalyze = async () => {
    if (!file) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      // AI-powered resume analysis
      const resumeText = await parseResume(file);
      const result = analyzeResumeLocal(resumeText, targetRole || undefined);
      setAnalysis(result);
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err instanceof Error ? err.message : 'Failed to analyze resume');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'from-emerald-500/20 to-emerald-600/20 border-emerald-500/30';
    if (score >= 60) return 'from-yellow-500/20 to-yellow-600/20 border-yellow-500/30';
    if (score >= 40) return 'from-orange-500/20 to-orange-600/20 border-orange-500/30';
    return 'from-red-500/20 to-red-600/20 border-red-500/30';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'good':
        return <CheckCircle2 className="w-4 h-4 text-yellow-400" />;
      case 'needs-improvement':
        return <AlertTriangle className="w-4 h-4 text-orange-400" />;
      case 'poor':
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return null;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const resetAnalysis = () => {
    setFile(null);
    setAnalysis(null);
    setError(null);
    setTargetRole('');
  };

  return (
    <div className="relative min-h-screen">
      {/* Animated Background */}
      <div className="squares-wrapper absolute inset-0 z-0">
        <Squares
          speed={0.3}
          squareSize={40}
          direction="diagonal"
          borderColor="rgba(139, 92, 246, 0.15)"
          hoverFillColor="rgba(139, 92, 246, 0.1)"
        />
      </div>

      <div className="relative z-10 p-4 md:p-6 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-bold text-white mb-2">Resume Analysis</h1>
          <p className="text-gray-400">
            Analyze your resume for ATS compatibility and get actionable improvements
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Upload & Options */}
          <div className="lg:col-span-1 space-y-6">
            {/* AI Badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-r from-violet-600/20 to-purple-600/20 backdrop-blur-sm border border-violet-500/30 rounded-xl p-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-violet-600/30 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-violet-400" />
                </div>
                <div>
                  <h3 className="text-white font-medium">AI-Powered Analysis</h3>
                  <p className="text-gray-400 text-sm">Advanced resume scoring & insights</p>
                </div>
              </div>
            </motion.div>

            {/* Upload Zone */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
                  isDragActive
                    ? 'border-violet-500 bg-violet-500/10'
                    : file
                    ? 'border-emerald-500/50 bg-emerald-500/5'
                    : 'border-gray-700 bg-gray-900 hover:border-gray-600 hover:bg-gray-900/90'
                }`}
              >
                <input {...getInputProps()} />
                {file ? (
                  <div className="space-y-2">
                    <FileText className="w-12 h-12 mx-auto text-emerald-400" />
                    <p className="text-white font-medium">{file.name}</p>
                    <p className="text-gray-400 text-sm">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        resetAnalysis();
                      }}
                      className="text-gray-400 hover:text-red-400 text-sm underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Upload className="w-12 h-12 mx-auto text-gray-500" />
                    <div>
                      <p className="text-white font-medium">
                        Drop your resume here
                      </p>
                      <p className="text-gray-400 text-sm mt-1">
                        or click to browse
                      </p>
                    </div>
                    <p className="text-gray-500 text-xs">
                      PDF, DOC, DOCX, or TXT • Max 10MB
                    </p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Target Role */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-900 backdrop-blur-sm border border-gray-800 rounded-xl p-4"
            >
              <label className="block text-white font-medium mb-2">
                Target Role (Optional)
              </label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g., Frontend Developer"
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
              <p className="mt-2 text-xs text-gray-500">
                Helps optimize keyword suggestions for your target position
              </p>
            </motion.div>

            {/* Analyze Button */}
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              onClick={handleAnalyze}
              disabled={!file || isAnalyzing}
              className={`w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all ${
                !file || isAnalyzing
                  ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:from-violet-500 hover:to-purple-500'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  Analyze Resume
                </>
              )}
            </motion.button>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-400 text-sm">{error}</p>
              </motion.div>
            )}
          </div>

          {/* Right Column - Results */}
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence mode="wait">
              {analysis ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Overall Score */}
                  <div
                    className={`bg-gradient-to-br ${getScoreBg(
                      analysis.overallScore
                    )} backdrop-blur-sm border rounded-xl p-6`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-lg text-gray-300 mb-1">
                          ATS Compatibility Score
                        </h2>
                        <p className="text-gray-400 text-sm">
                          Based on AI analysis
                        </p>
                      </div>
                      <div className="text-right">
                        <span
                          className={`text-5xl font-bold ${getScoreColor(
                            analysis.overallScore
                          )}`}
                        >
                          {analysis.overallScore}
                        </span>
                        <span className="text-2xl text-gray-400">/100</span>
                      </div>
                    </div>

                    {/* Score Bar */}
                    <div className="mt-4 h-3 bg-gray-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${analysis.overallScore}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className={`h-full rounded-full ${
                          analysis.overallScore >= 80
                            ? 'bg-emerald-500'
                            : analysis.overallScore >= 60
                            ? 'bg-yellow-500'
                            : analysis.overallScore >= 40
                            ? 'bg-orange-500'
                            : 'bg-red-500'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Section Scores */}
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(analysis.sections).map(([name, section]) => (
                      <motion.div
                        key={name}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-gray-900 backdrop-blur-sm border border-gray-800 rounded-xl p-4"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white font-medium capitalize">
                            {name}
                          </span>
                          {getStatusIcon(section.status)}
                        </div>
                        <div className="flex items-end gap-2">
                          <span
                            className={`text-2xl font-bold ${getScoreColor(
                              section.score
                            )}`}
                          >
                            {section.score}%
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm mt-2">
                          {section.feedback}
                        </p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Improvements */}
                  {analysis.improvements.length > 0 && (
                    <div className="bg-gray-900 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
                      <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-violet-400" />
                        Recommended Improvements
                      </h3>
                      <div className="space-y-3">
                        {analysis.improvements.map((improvement, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-start gap-3 p-3 bg-gray-800/50 rounded-lg"
                          >
                            <ChevronRight className="w-4 h-4 text-violet-400 mt-1 flex-shrink-0" />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-white font-medium text-sm">
                                  {improvement.section}
                                </span>
                                <span
                                  className={`px-2 py-0.5 text-xs rounded-full border ${getPriorityColor(
                                    improvement.priority
                                  )}`}
                                >
                                  {improvement.priority}
                                </span>
                              </div>
                              <p className="text-gray-400 text-sm">
                                {improvement.suggestion}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Missing Keywords */}
                  {analysis.missingKeywords.length > 0 && (
                    <div className="bg-gray-900 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
                      <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                        <Target className="w-5 h-5 text-orange-400" />
                        Missing Keywords
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {analysis.missingKeywords.map((keyword, index) => (
                          <span
                            key={index}
                            className="px-3 py-1.5 bg-orange-500/10 border border-orange-500/30 text-orange-400 rounded-lg text-sm"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Strengths & Weaknesses */}
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Strong Points */}
                    <div className="bg-gray-900 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
                      <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                        <Award className="w-5 h-5 text-emerald-400" />
                        Strengths
                      </h3>
                      <ul className="space-y-2">
                        {analysis.strongPoints.map((point, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-2 text-gray-300 text-sm"
                          >
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Weak Points */}
                    <div className="bg-gray-900 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
                      <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-red-400" />
                        Areas to Improve
                      </h3>
                      <ul className="space-y-2">
                        {analysis.weakPoints.map((point, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-2 text-gray-300 text-sm"
                          >
                            <XCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Industry Fit */}
                  {analysis.industryFit && (
                    <div className="bg-gray-900 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
                      <h3 className="text-lg font-medium text-white mb-4">
                        Industry Fit: {analysis.industryFit.targetRole}
                      </h3>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{
                              width: `${analysis.industryFit.fitScore}%`,
                            }}
                            className={`h-full rounded-full ${
                              analysis.industryFit.fitScore >= 70
                                ? 'bg-emerald-500'
                                : 'bg-yellow-500'
                            }`}
                          />
                        </div>
                        <span
                          className={`font-medium ${getScoreColor(
                            analysis.industryFit.fitScore
                          )}`}
                        >
                          {analysis.industryFit.fitScore}%
                        </span>
                      </div>
                      <ul className="space-y-2">
                        {analysis.industryFit.suggestions.map((suggestion, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-2 text-gray-400 text-sm"
                          >
                            <ChevronRight className="w-4 h-4 text-violet-400 mt-0.5" />
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Analyze Again Button */}
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={resetAnalysis}
                    className="w-full py-3 rounded-xl font-medium bg-gray-800 text-gray-300 hover:bg-gray-700 flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-5 h-5" />
                    Analyze Another Resume
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-center h-96 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl"
                >
                  <div className="text-center">
                    <FileText className="w-16 h-16 mx-auto text-gray-700 mb-4" />
                    <p className="text-gray-500 text-lg">
                      Upload a resume to see the analysis
                    </p>
                    <p className="text-gray-600 text-sm mt-2">
                      Get ATS compatibility score, keyword analysis, and improvement suggestions
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

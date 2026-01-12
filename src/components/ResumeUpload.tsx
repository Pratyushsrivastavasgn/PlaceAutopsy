import React, { useState, useCallback } from 'react';
import { Upload, FileText, X, Loader2 } from 'lucide-react';
import { parseResume, validateResumeFile } from '../services/resumeParser';

interface ResumeUploadProps {
    onFileProcessed: (text: string, file: File) => void;
    isProcessing?: boolean;
}

export const ResumeUpload: React.FC<ResumeUploadProps> = ({ onFileProcessed, isProcessing }) => {
    const [dragActive, setDragActive] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback(
        async (e: React.DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setDragActive(false);
            setError(null);

            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                const file = e.dataTransfer.files[0];
                await handleFile(file);
            }
        },
        []
    );

    const handleChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setError(null);

        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            await handleFile(file);
        }
    }, []);

    const handleFile = async (file: File) => {
        const validation = validateResumeFile(file);

        if (!validation.valid) {
            setError(validation.error || 'Invalid file');
            return;
        }

        setSelectedFile(file);

        try {
            const text = await parseResume(file);
            onFileProcessed(text, file);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to parse resume');
            setSelectedFile(null);
        }
    };

    const removeFile = () => {
        setSelectedFile(null);
        setError(null);
    };

    return (
        <div className="w-full">
            <div
                className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${dragActive
                    ? 'border-primary-500 bg-primary-500/10'
                    : 'border-dark-600 hover:border-primary-500/50'
                    } ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    id="resume-upload"
                    className="hidden"
                    accept=".txt,.pdf,.doc,.docx"
                    onChange={handleChange}
                    disabled={isProcessing}
                />

                {!selectedFile ? (
                    <label htmlFor="resume-upload" className="cursor-pointer">
                        <div className="flex flex-col items-center space-y-4">
                            <div className="p-4 bg-primary-500/20 rounded-full">
                                <Upload className="h-12 w-12 text-primary-500" />
                            </div>
                            <div>
                                <p className="text-lg font-semibold text-white mb-1">
                                    Drop your resume here or click to browse
                                </p>
                                <p className="text-sm text-primary-400 mb-1">
                                    📄 Recommended: TXT files work best!
                                </p>
                                <p className="text-xs text-gray-500">
                                    PDF/DOCX support coming soon. For now, please save as .txt or copy-paste your resume text.
                                </p>
                            </div>
                        </div>
                    </label>
                ) : (
                    <div className="flex items-center justify-between bg-dark-800 p-4 rounded-lg">
                        <div className="flex items-center space-x-3">
                            <FileText className="h-8 w-8 text-primary-500" />
                            <div className="text-left">
                                <p className="text-sm font-medium text-white">{selectedFile.name}</p>
                                <p className="text-xs text-gray-400">
                                    {(selectedFile.size / 1024).toFixed(2)} KB
                                </p>
                            </div>
                        </div>
                        {!isProcessing && (
                            <button
                                onClick={removeFile}
                                className="p-2 hover:bg-dark-700 rounded-lg transition-colors"
                            >
                                <X className="h-5 w-5 text-gray-400 hover:text-red-500" />
                            </button>
                        )}
                    </div>
                )}

                {isProcessing && (
                    <div className="mt-4 flex items-center justify-center space-x-2 text-primary-500">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span className="text-sm font-medium">Processing resume...</span>
                    </div>
                )}
            </div>

            {error && (
                <div className="mt-4 p-4 bg-red-500/10 border border-red-500 rounded-lg">
                    <p className="text-sm text-red-400">{error}</p>
                </div>
            )}
        </div>
    );
};

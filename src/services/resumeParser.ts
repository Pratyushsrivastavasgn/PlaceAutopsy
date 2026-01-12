import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

// Set up the worker for PDF.js using local import
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export const extractTextFromPDF = async (file: File): Promise<string> => {
    try {
        // Convert file to ArrayBuffer
        const arrayBuffer = await file.arrayBuffer();
        
        // Load the PDF document
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        
        let fullText = '';
        
        // Extract text from each page
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const textContent = await page.getTextContent();
            
            // Combine all text items
            const pageText = textContent.items
                .map((item: any) => item.str)
                .join(' ');
            
            fullText += pageText + '\n\n';
        }
        
        return fullText.trim();
    } catch (error) {
        console.error('PDF parsing error:', error);
        throw new Error(
            'Failed to parse PDF. Please ensure the PDF is not encrypted or password-protected. ' +
            'Alternatively, you can copy-paste your resume text or use a TXT file.'
        );
    }
};

export const extractTextFromDOCX = async (file: File): Promise<string> => {
    // DOCX parsing requires mammoth.js or similar
    throw new Error(
        'DOCX parsing requires additional setup. Please convert your resume to a TXT file or copy-paste the text content. ' +
        'You can save your Word document as .txt or copy the text content.'
    );
};

export const parseResume = async (file: File): Promise<string> => {
    const fileType = file.type;

    if (fileType === 'application/pdf') {
        return extractTextFromPDF(file);
    } else if (
        fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        fileType === 'application/msword'
    ) {
        return extractTextFromDOCX(file);
    } else if (fileType === 'text/plain') {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target?.result as string);
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsText(file);
        });
    } else {
        throw new Error('Unsupported file type. Please upload a TXT file.');
    }
};

export const validateResumeFile = (file: File): { valid: boolean; error?: string } => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword',
        'text/plain',
    ];

    if (file.size > maxSize) {
        return { valid: false, error: 'File size must be less than 10MB' };
    }

    if (!allowedTypes.includes(file.type)) {
        return { valid: false, error: 'Only PDF, DOCX, and TXT files are supported' };
    }

    // DOCX still requires additional libraries
    if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        file.type === 'application/msword') {
        console.warn('DOCX parsing is not yet supported. Please use PDF or TXT files.');
    }

    return { valid: true };
};

import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ToolDef, ToolId } from '../constants';
import { ArrowLeft, Upload, FileText, Download, AlertCircle, CheckCircle, RefreshCw, Layers } from 'lucide-react';
import { createPdfFromImages, mergePdfs, splitPdf, addWatermark, lockPdf, simulateProcessing } from '../utils/pdfActions';

interface ToolWorkspaceProps {
  tool: ToolDef;
  onBack: () => void;
}

const ToolWorkspace: React.FC<ToolWorkspaceProps> = ({ tool, onBack }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  // Specific Tool State
  const [watermarkText, setWatermarkText] = useState("CONFIDENTIAL");
  const [password, setPassword] = useState("");
  const [splitRange, setSplitRange] = useState({ start: 1, end: 1 });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;
    const validFiles = Array.from(newFiles).filter(f => {
       if (tool.accepts === 'image/*') return f.type.startsWith('image/');
       if (tool.accepts === '.pdf') return f.type === 'application/pdf';
       return true;
    });

    if (validFiles.length === 0) {
      setError(`Please upload valid ${tool.accepts === 'image/*' ? 'Image' : 'PDF'} files.`);
      return;
    }

    setError(null);
    setFiles(tool.multiple ? [...files, ...validFiles] : [validFiles[0]]);
  };

  const onDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }, [files]); // eslint-disable-line

  const processAction = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    setError(null);
    setResultUrl(null);

    try {
      let pdfBytes: Uint8Array | null = null;
      
      switch (tool.id) {
        case ToolId.PHOTO_TO_PDF:
        case ToolId.IMAGE_TO_PDF:
          pdfBytes = await createPdfFromImages(files);
          break;
        case ToolId.MERGE_PDF:
          pdfBytes = await mergePdfs(files);
          break;
        case ToolId.SPLIT_PDF:
          pdfBytes = await splitPdf(files[0], splitRange.start, splitRange.end);
          break;
        case ToolId.WATERMARK:
          pdfBytes = await addWatermark(files[0], watermarkText);
          break;
        case ToolId.PASSWORD:
          if (!password) throw new Error("Password is required");
          pdfBytes = await lockPdf(files[0], password);
          break;
        // Simulated tools
        case ToolId.COMPRESS_PDF:
        case ToolId.PDF_TO_WORD:
        case ToolId.PDF_TO_IMAGE:
        case ToolId.VIEWER:
        case ToolId.EDITOR:
          await simulateProcessing(2500);
          // For simulation, we just pass back the original file as a blob for download logic, 
          // or a dummy text file for conversion.
          if (tool.id === ToolId.PDF_TO_WORD) {
             const blob = new Blob(["Simulated converted Word document content."], { type: 'application/msword' });
             setResultUrl(URL.createObjectURL(blob));
             setIsProcessing(false);
             return;
          }
          // Just return original for others as "processed"
           const ab = await files[0].arrayBuffer();
           pdfBytes = new Uint8Array(ab);
          break;
        default:
          throw new Error("Tool not implemented yet.");
      }

      if (pdfBytes) {
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        setResultUrl(url);
      }

    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred during processing.");
    } finally {
      setIsProcessing(false);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      className="min-h-screen pb-20 md:pb-10"
    >
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button 
            onClick={onBack}
            className="mr-4 p-2 rounded-full border border-green-500/30 text-green-400 hover:bg-green-500/10 hover:shadow-[0_0_10px_#22c55e] transition-all"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h2 className="text-3xl font-bold text-white cyber-font tracking-wider flex items-center gap-2">
              <tool.icon className="w-8 h-8 text-green-400" />
              {tool.title}
            </h2>
            <p className="text-green-500/60 font-mono text-sm mt-1">SYSTEM://READY_FOR_INPUT</p>
          </div>
        </div>

        {/* Workspace Card */}
        <div className="bg-black/80 border border-green-500/30 rounded-2xl p-6 md:p-8 backdrop-blur-md shadow-[0_0_50px_rgba(34,197,94,0.1)] relative overflow-hidden">
            {/* Corner Deco */}
            <div className="absolute top-0 right-0 p-4">
                 <div className="w-20 h-1 bg-green-500/20"></div>
                 <div className="w-1 h-20 bg-green-500/20 absolute top-4 right-4"></div>
            </div>

            {/* Upload Zone */}
            {!resultUrl && (
              <div 
                className={`border-2 border-dashed rounded-xl p-8 md:p-12 text-center transition-all duration-300 relative
                  ${dragActive ? 'border-green-400 bg-green-900/20 scale-[1.01]' : 'border-green-500/30 hover:border-green-500/60 hover:bg-white/5'}
                `}
                onDragEnter={onDrag} 
                onDragLeave={onDrag} 
                onDragOver={onDrag} 
                onDrop={onDrop}
              >
                <input 
                  ref={fileInputRef}
                  type="file" 
                  multiple={tool.multiple} 
                  accept={tool.accepts}
                  onChange={(e) => handleFiles(e.target.files)}
                  className="hidden" 
                />
                
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center border-2 transition-all duration-500
                    ${dragActive ? 'border-green-400 shadow-[0_0_20px_#22c55e]' : 'border-green-500/20 bg-green-500/5'}
                  `}>
                    <Upload className={`w-10 h-10 ${dragActive ? 'text-white' : 'text-green-500'}`} />
                  </div>
                  
                  <div className="space-y-2">
                     <h3 className="text-xl font-bold text-white cyber-font">
                       {dragActive ? 'DROP FILES NOW' : 'DRAG & DROP FILES'}
                     </h3>
                     <p className="text-gray-400 font-mono text-sm">
                       or <span 
                         onClick={() => fileInputRef.current?.click()}
                         className="text-green-400 cursor-pointer hover:underline underline-offset-4 decoration-green-500 decoration-2"
                       >browse device</span>
                     </p>
                  </div>
                  
                  <p className="text-xs text-gray-500 mt-4 font-mono">
                    Supported: {tool.accepts === 'image/*' ? 'JPG, PNG' : 'PDF'} 
                    {tool.multiple && ' • Multiple files allowed'}
                  </p>
                </div>
              </div>
            )}

            {/* File List & Controls */}
            {files.length > 0 && !resultUrl && (
              <div className="mt-8 space-y-6">
                <div className="flex items-center justify-between text-sm font-mono text-green-500/70 border-b border-green-500/20 pb-2">
                   <span>UPLOAD_QUEUE ({files.length})</span>
                   <button onClick={() => setFiles([])} className="hover:text-red-400 transition-colors">CLEAR_ALL</button>
                </div>

                <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                  {files.map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-white/5 p-3 rounded-lg border border-white/10 group hover:border-green-500/30 transition-colors">
                      <div className="flex items-center space-x-3 overflow-hidden">
                        <FileText className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-gray-300 truncate font-mono">{file.name}</span>
                        <span className="text-xs text-gray-500">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                      </div>
                      <button onClick={() => removeFile(idx)} className="text-gray-600 hover:text-red-400 p-1">
                        <span className="sr-only">Remove</span>
                        ×
                      </button>
                    </div>
                  ))}
                </div>

                {/* Specific Tool Controls */}
                <div className="bg-green-900/10 border border-green-500/20 p-6 rounded-xl space-y-4">
                  <h4 className="text-green-400 font-bold cyber-font text-sm uppercase tracking-wider mb-4 border-b border-green-500/20 pb-2">
                    Configuration // {tool.title}
                  </h4>

                  {tool.id === ToolId.SPLIT_PDF && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-gray-400 font-mono mb-1">START PAGE</label>
                        <input 
                          type="number" 
                          min="1"
                          value={splitRange.start}
                          onChange={(e) => setSplitRange({...splitRange, start: parseInt(e.target.value)})}
                          className="w-full bg-black border border-green-500/30 rounded p-2 text-white focus:border-green-400 outline-none font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-400 font-mono mb-1">END PAGE</label>
                        <input 
                          type="number" 
                          min="1"
                          value={splitRange.end}
                          onChange={(e) => setSplitRange({...splitRange, end: parseInt(e.target.value)})}
                          className="w-full bg-black border border-green-500/30 rounded p-2 text-white focus:border-green-400 outline-none font-mono"
                        />
                      </div>
                    </div>
                  )}

                  {tool.id === ToolId.WATERMARK && (
                    <div>
                      <label className="block text-xs text-gray-400 font-mono mb-1">WATERMARK TEXT</label>
                      <input 
                        type="text" 
                        value={watermarkText}
                        onChange={(e) => setWatermarkText(e.target.value)}
                        className="w-full bg-black border border-green-500/30 rounded p-2 text-white focus:border-green-400 outline-none font-mono"
                        placeholder="CONFIDENTIAL"
                      />
                    </div>
                  )}

                  {tool.id === ToolId.PASSWORD && (
                    <div>
                      <label className="block text-xs text-gray-400 font-mono mb-1">SET PASSWORD</label>
                      <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-black border border-green-500/30 rounded p-2 text-white focus:border-green-400 outline-none font-mono"
                        placeholder="••••••••"
                      />
                    </div>
                  )}

                  {tool.id === ToolId.VIEWER || tool.id === ToolId.EDITOR ? (
                     <div className="text-yellow-400/80 text-xs font-mono flex items-center">
                        <AlertCircle className="w-4 h-4 mr-2" />
                        Preview Mode: Changes in full editor are simulated for demo.
                     </div>
                  ) : null}

                  {/* Primary Action Button */}
                  <button 
                    onClick={processAction}
                    disabled={isProcessing}
                    className={`w-full py-4 rounded-xl font-bold text-black uppercase tracking-widest cyber-font relative overflow-hidden group transition-all
                      ${isProcessing ? 'bg-gray-600 cursor-not-allowed' : 'bg-green-500 hover:bg-green-400 hover:shadow-[0_0_20px_#22c55e]'}
                    `}
                  >
                     <span className="relative z-10 flex items-center justify-center">
                       {isProcessing ? (
                         <>
                           <RefreshCw className="w-5 h-5 animate-spin mr-3" />
                           PROCESSING_DATA...
                         </>
                       ) : (
                         <>
                           <Layers className="w-5 h-5 mr-3" />
                           EXECUTE_PROTOCOL
                         </>
                       )}
                     </span>
                     {/* Button Glitch Effect */}
                     {!isProcessing && (
                       <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                     )}
                  </button>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 bg-red-900/20 border border-red-500/50 rounded-lg flex items-center text-red-400"
              >
                <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                <span className="font-mono text-sm">{error}</span>
              </motion.div>
            )}

            {/* Success / Result View */}
            {resultUrl && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-8 text-center space-y-6"
              >
                 <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-500/10 border-2 border-green-500 shadow-[0_0_30px_rgba(34,197,94,0.4)] mb-4">
                   <CheckCircle className="w-12 h-12 text-green-500" />
                 </div>
                 
                 <div>
                   <h3 className="text-2xl font-bold text-white cyber-font mb-2">OPERATION SUCCESSFUL</h3>
                   <p className="text-gray-400 font-mono">Your file has been processed securely.</p>
                 </div>

                 <div className="grid gap-4 max-w-sm mx-auto">
                    <a 
                      href={resultUrl} 
                      download={`cyberpdf_output.${tool.id === ToolId.PDF_TO_WORD ? 'doc' : (tool.id === ToolId.PDF_TO_IMAGE ? 'zip' : 'pdf')}`}
                      className="flex items-center justify-center w-full py-4 bg-transparent border-2 border-green-500 text-green-500 font-bold rounded-xl hover:bg-green-500 hover:text-black transition-all duration-300 cyber-font tracking-widest group"
                    >
                      <Download className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                      DOWNLOAD FILE
                    </a>
                    
                    <button 
                      onClick={() => {
                        setFiles([]);
                        setResultUrl(null);
                        setError(null);
                      }}
                      className="text-gray-500 text-sm hover:text-white transition-colors font-mono"
                    >
                      PROCESS_ANOTHER_FILE
                    </button>
                 </div>
              </motion.div>
            )}

        </div>
      </div>
    </motion.div>
  );
};

export default ToolWorkspace;
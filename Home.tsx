/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
/* tslint:disable */
import {
  GoogleGenAI,
  GenerateContentResponse,
} from '@google/genai';
import {
  ArrowUp,
  Brush,
  Cpu,
  Eraser,
  Info,
  LoaderCircle,
  Moon,
  Palette,
  Redo2,
  Sun,
  Trash2,
  Undo2,
  X,
} from 'lucide-react';
import {useEffect, useRef, useState} from 'react';

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const backgroundImageRef = useRef<HTMLImageElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorTitle, setErrorTitle] = useState('Failed to generate');

  // New state for API Key management to match the desired flow
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [tempApiKey, setTempApiKey] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Brush settings
  const [brushSize, setBrushSize] = useState(5);
  const [showBrushMenu, setShowBrushMenu] = useState(false);
  const [brushColor, setBrushColor] = useState('#000000');
  const [showColorMenu, setShowColorMenu] = useState(false);
  const [isErasing, setIsErasing] = useState(false);

  // Model settings
  const [selectedModel, setSelectedModel] = useState('gemini-2.5-flash-image');
  const [showModelMenu, setShowModelMenu] = useState(false);

  // Theme settings
  const [isDarkMode, setIsDarkMode] = useState(false);

  // State for canvas history
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Toggle Dark Mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // When switching to canvas mode, initialize it and its history
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL();
    setHistory([dataUrl]);
    setHistoryIndex(0);
  }, []);

  // Load background image when generatedImage changes
  useEffect(() => {
    if (generatedImage && canvasRef.current) {
      const img = new window.Image();
      img.onload = () => {
        backgroundImageRef.current = img;
        drawImageToCanvas();
        setTimeout(saveCanvasState, 50);
      };
      img.src = generatedImage;
    }
  }, [generatedImage]);

  const initializeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const drawImageToCanvas = () => {
    if (!canvasRef.current || !backgroundImageRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(
      backgroundImageRef.current,
      0,
      0,
      canvas.width,
      canvas.height,
    );
  };

  // Canvas history functions
  const saveCanvasState = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const dataUrl = canvas.toDataURL();
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(dataUrl);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const restoreCanvasState = (index: number) => {
    if (!canvasRef.current || !history[index]) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const dataUrl = history[index];
    const img = new window.Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
    img.src = dataUrl;
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      restoreCanvasState(newIndex);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      restoreCanvasState(newIndex);
    }
  };

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    let clientX, clientY;
    if ('touches' in e.nativeEvent) {
      clientX = e.nativeEvent.touches[0].clientX;
      clientY = e.nativeEvent.touches[0].clientY;
    } else {
      clientX = e.nativeEvent.clientX;
      clientY = e.nativeEvent.clientY;
    }

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const {x, y} = getCoordinates(e);
    if ('touches' in e.nativeEvent) {
      e.preventDefault();
    }
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    if ('touches' in e.nativeEvent) {
      e.preventDefault();
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const {x, y} = getCoordinates(e);
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.strokeStyle = isErasing ? '#FFFFFF' : brushColor;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    saveCanvasState();
  };

  const handleClear = () => {
    if (canvasRef.current) {
      initializeCanvas();
      const dataUrl = canvasRef.current.toDataURL();
      setHistory([dataUrl]);
      setHistoryIndex(0);
    }
    setGeneratedImage(null);
    backgroundImageRef.current = null;
    setPrompt('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey) {
      setShowApiKeyModal(true);
      return;
    }
    if (isSubmitting) return;
    setIsSubmitting(true);
    await performGeneration();
    setIsSubmitting(false);
  };

  const handleApiKeySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempApiKey) {
        setErrorMessage("Please enter an API key.");
        setErrorTitle("API Key Required");
        setShowErrorModal(true);
        return;
    }
    setApiKey(tempApiKey);
    setShowApiKeyModal(false);

    setTimeout(() => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        performGeneration(tempApiKey).finally(() => setIsSubmitting(false));
    }, 0);
  };
  
  const performGeneration = async (currentApiKey?: string) => {
    const keyToUse = currentApiKey || apiKey;
    if (!keyToUse) {
        setShowApiKeyModal(true);
        return;
    }

    setIsLoading(true);
    setErrorMessage('');
    setErrorTitle('Failed to generate');

    try {
      const ai = new GoogleGenAI({apiKey: keyToUse});

      if (!canvasRef.current) throw new Error("Canvas is not available.");

      const canvas = canvasRef.current;
      const imageB64 = canvas.toDataURL('image/png').split(',')[1];
      const parts = [
        {inlineData: {data: imageB64, mimeType: 'image/png'}},
        {text: prompt},
      ];

      const response: GenerateContentResponse = await ai.models.generateContent({
        model: selectedModel,
        contents: [{parts}],
        config: {
          imageConfig: {
            aspectRatio: '16:9',
          },
        },
      });

      let newImageData: string | null = null;
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          newImageData = part.inlineData.data;
          break;
        }
      }

      if (newImageData) {
        const imageUrl = `data:image/png;base64,${newImageData}`;
        setGeneratedImage(imageUrl);
      } else {
        setErrorMessage(
          'Failed to generate image from the response. Please try again.',
        );
        setShowErrorModal(true);
      }
    } catch (error: any) {
      console.error('Error submitting:', error);
      let message =
        error.message ||
        'An unexpected error occurred. Check the console for details.';
      
      if (
        error.status === 403 || 
        error.code === 403 || 
        message.includes('403') || 
        message.includes('PERMISSION_DENIED')
      ) {
        setErrorTitle('Permission Denied');
        message = selectedModel.includes('pro') 
          ? 'The Gemini 3 Pro Image model may require a paid API key from a Google Cloud Project with billing enabled. Please switch to "Gemini 2.5 Flash" or provide a valid key.'
          : 'The API key provided does not have permission to access the Gemini API. Please ensure your key is valid and has the necessary permissions.';
      }

      setErrorMessage(message);
      setShowErrorModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const closeErrorModal = () => setShowErrorModal(false);
  const closeInfoModal = () => setShowInfoModal(false);

  const toggleBrushMenu = () => {
    setShowBrushMenu(!showBrushMenu);
    setShowColorMenu(false);
    setShowModelMenu(false);
  };

  const toggleColorMenu = () => {
    setShowColorMenu(!showColorMenu);
    setShowBrushMenu(false);
    setShowModelMenu(false);
  };

  const toggleModelMenu = () => {
    setShowModelMenu(!showModelMenu);
    setShowBrushMenu(false);
    setShowColorMenu(false);
  };

  const toggleEraser = () => {
    setIsErasing(!isErasing);
    if (!isErasing) {
      setShowBrushMenu(false);
      setShowColorMenu(false);
      setShowModelMenu(false);
    }
  };

  const presetColors = ['#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#00FFFF', '#FF00FF', '#808080', '#A52A2A'];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const preventTouchDefault = (e: TouchEvent) => {
      if (isDrawing) e.preventDefault();
    };

    canvas.addEventListener('touchstart', preventTouchDefault, {passive: false});
    canvas.addEventListener('touchmove', preventTouchDefault, {passive: false});

    return () => {
      canvas.removeEventListener('touchstart', preventTouchDefault);
      canvas.removeEventListener('touchmove', preventTouchDefault);
    };
  }, [isDrawing]);

  return (
    <>
      <div className="min-h-screen flex flex-col justify-start items-center p-4 pt-12">
        <main className="container mx-auto max-w-5xl w-full">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-6 gap-4">
            <div className="flex items-end gap-4">
              <button type="button" onClick={() => setShowInfoModal(true)} className="button-log">
                <Info className="w-5 h-5" aria-label="Information" />
              </button>

              <div className="relative">
                <button type="button" onClick={toggleBrushMenu} className="button-log" title="Brush Size">
                  <Brush className="w-5 h-5" aria-label="Brush Settings" />
                </button>
                {showBrushMenu && (
                  <div className="absolute top-12 left-0 z-50 p-3 bg-[var(--bg-color)] border-2 border-[var(--main-color)] shadow-[4px_4px_var(--main-color)] rounded-[5px] flex flex-col gap-2 w-48">
                    <label htmlFor="brush-size" className="text-sm font-bold flex justify-between">
                      <span>Size</span><span>{brushSize}px</span>
                    </label>
                    <input id="brush-size" type="range" min="1" max="50" value={brushSize} onChange={(e) => setBrushSize(Number(e.target.value))} className="w-full" />
                    <div className="flex justify-center mt-2 h-12 items-center bg-white border border-black rounded shadow-sm">
                      <div style={{width: `${brushSize}px`, height: `${brushSize}px`, backgroundColor: brushColor, borderRadius: '50%'}} />
                    </div>
                  </div>
                )}
              </div>

              <div className="relative">
                <button type="button" onClick={toggleColorMenu} className="button-log" title="Brush Color">
                  <Palette className="w-5 h-5" style={{color: isErasing ? 'inherit' : brushColor}} aria-label="Brush Color" />
                </button>
                {showColorMenu && (
                  <div className="absolute top-12 left-0 z-50 p-3 bg-[var(--bg-color)] border-2 border-[var(--main-color)] shadow-[4px_4px_var(--main-color)] rounded-[5px] flex flex-col gap-2 w-48">
                    <label className="text-sm font-bold">Color</label>
                    <div className="grid grid-cols-5 gap-2">
                      {presetColors.map((color) => (
                        <button key={color} onClick={() => { setBrushColor(color); setIsErasing(false); setShowColorMenu(false); }}
                          className={`w-6 h-6 rounded-full border border-black shadow-sm ${brushColor === color && !isErasing ? 'ring-2 ring-offset-1 ring-black' : ''}`}
                          style={{backgroundColor: color}} title={color} />
                      ))}
                    </div>
                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-[var(--main-color)]">
                      <span className="text-xs font-bold">Custom:</span>
                      <input type="color" value={brushColor} onChange={(e) => { setBrushColor(e.target.value); setIsErasing(false); }} className="h-8 flex-1 cursor-pointer bg-transparent" />
                    </div>
                  </div>
                )}
              </div>

              <div className="relative">
                <button type="button" onClick={toggleModelMenu} className="button-log" title="Select Model">
                  <Cpu className="w-5 h-5" aria-label="Select Model" />
                </button>
                {showModelMenu && (
                  <div className="absolute top-12 left-0 z-50 p-2 bg-[var(--bg-color)] border-2 border-[var(--main-color)] shadow-[4px_4px_var(--main-color)] rounded-[5px] flex flex-col gap-2 w-56">
                    <label className="text-sm font-bold px-1">Model</label>
                    <button onClick={() => { setSelectedModel('gemini-2.5-flash-image'); setShowModelMenu(false); }}
                      className={`text-left px-3 py-2 text-sm font-semibold rounded hover:bg-[var(--main-color)] hover:text-[var(--bg-color)] transition-colors ${selectedModel === 'gemini-2.5-flash-image' ? 'bg-[var(--main-color)] text-[var(--bg-color)]' : ''}`}>
                      Gemini 2.5 Flash Image
                    </button>
                    <button onClick={() => { setSelectedModel('gemini-3-pro-image-preview'); setShowModelMenu(false); }}
                      className={`text-left px-3 py-2 text-sm font-semibold rounded hover:bg-[var(--main-color)] hover:text-[var(--bg-color)] transition-colors ${selectedModel === 'gemini-3-pro-image-preview' ? 'bg-[var(--main-color)] text-[var(--bg-color)]' : ''}`}>
                      Gemini 3 Pro Image
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-end gap-4">
              <button type="button" onClick={handleClear} className="button-log">
                <Trash2 className="w-5 h-5" aria-label="Clear Canvas" />
              </button>
              <button type="button" onClick={toggleDarkMode} className="button-log" title={isDarkMode ? 'Light Mode' : 'Dark Mode'}>
                {isDarkMode ? <Sun className="w-5 h-5" aria-label="Switch to Light Mode" /> : <Moon className="w-5 h-5" aria-label="Switch to Dark Mode" />}
              </button>
            </div>
          </div>

          <div className="w-full mb-6">
            <div className="relative w-full">
              <canvas
                ref={canvasRef}
                width={960}
                height={540}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className={`canvas-custom w-full sm:h-[60vh] h-[40vh] min-h-[320px] touch-none ${isErasing ? 'cursor-eraser' : ''}`}
              />
              <div className="absolute top-2 left-2">
                <button onClick={toggleEraser} className={`button-log-small ${isErasing ? 'ring-2 ring-[var(--main-color)]' : ''}`}
                  aria-label={isErasing ? "Switch to Brush" : "Eraser"} title={isErasing ? "Switch to Brush" : "Eraser"}>
                  <Eraser className="w-5 h-5" />
                </button>
              </div>
              <div className="absolute top-2 right-2 flex gap-2">
                <button onClick={handleUndo} disabled={historyIndex <= 0} className="button-log-small" aria-label="Undo">
                  <Undo2 className="w-5 h-5" />
                </button>
                <button onClick={handleRedo} disabled={historyIndex >= history.length - 1} className="button-log-small" aria-label="Redo">
                  <Redo2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="w-full">
            <div className="relative">
              <input type="text" value={prompt} onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe what to generate or how to edit the drawing..." className="prompt-input" required />
              <button type="submit" disabled={isLoading} className="button-confirm absolute right-0 top-0">
                {isLoading ? <LoaderCircle className="w-6 h-6 animate-spin" aria-label="Loading" /> : <ArrowUp className="w-6 h-6" aria-label="Submit" />}
              </button>
            </div>
          </form>
        </main>

        {showInfoModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="modal-content max-w-md w-full">
              <div className="flex justify-between items-start mb-4">
                <h3 className="title text-xl font-bold">Information</h3>
                <button onClick={closeInfoModal} className="button-log-small -translate-y-1 -translate-x-1"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-4 font-medium text-[var(--font-color)] break-words">
                <p>Nano-banana-pro-sketch-board is a web-based app where you can draw or sketch anything and transform it into your desired style. The Gemini API key you provide is used only on your device and will be removed when the page is closed or refreshed. The key will not be exposed anywhere.</p>
                <p>About: This app is powered by the Gemini 2.5 Flash Image / Gemini 3 Pro Preview Image model through the Gemini API and built by{' '}
                  <a href="https://huggingface.co/prithivMLmods" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Prithiv Sakthi</a>.</p>
              </div>
            </div>
          </div>
        )}
        
        {showErrorModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="modal-content max-w-md w-full">
              <div className="flex justify-between items-start mb-4">
                <h3 className="title text-xl font-bold">{errorTitle}</h3>
                <button onClick={closeErrorModal} className="button-log-small -translate-y-1 -translate-x-1"><X className="w-5 h-5" /></button>
              </div>
              <p className="font-medium text-[var(--font-color)] break-words">{errorMessage}</p>
            </div>
          </div>
        )}

        {showApiKeyModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="modal-content max-w-md w-full">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="title text-xl font-bold">Enter Your Gemini API Key</h3>
                    <button onClick={() => setShowApiKeyModal(false)} className="button-log-small -translate-y-1 -translate-x-1"><X className="w-5 h-5" /></button>
                </div>
                <p className="font-medium text-[var(--font-color)] break-words mb-4">Your API key is only stored for this session and will be lost when you reload or exit the page. It is not shared or exposed anywhere.</p>
                <form onSubmit={handleApiKeySubmit} className="flex flex-col gap-4">
                    <input type="password" value={tempApiKey} onChange={(e) => setTempApiKey(e.target.value)}
                        className="custom-input !w-full" placeholder="Enter your Gemini API Key" required />
                    {/* FIXED BUTTON STYLING */}
                    <button 
                      type="submit" 
                      className="flex items-center justify-center w-full h-12 px-4 font-bold text-[var(--bg-color)] bg-[var(--main-color)] border-2 border-[var(--main-color)] rounded-[5px] shadow-[4px_4px_var(--main-color)] transition-transform active:translate-y-px active:translate-x-px active:shadow-none disabled:opacity-50" 
                      disabled={isSubmitting}>
                        {isSubmitting ? <LoaderCircle className="w-6 h-6 animate-spin" /> : "Submit & Run"}
                    </button>
                </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
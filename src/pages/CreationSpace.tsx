import { useState, useRef, useEffect } from 'react';
import { Send, Image as ImageIcon, Zap, MousePointer2, ZoomIn, Download, Settings, Move, CheckSquare, Settings2, Box, Sparkles, AlertCircle, RefreshCw, ChevronRight, Ruler, Cpu, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type Message = { role: 'user' | 'ai'; text: string; id: number };
type DrawingState = 'empty' | 'plate' | 'plate_holes' | 'plate_holes_hex' | 'gear';

export function CreationSpace() {
  const [materialSet, setMaterialSet] = useState(false);
  const [material, setMaterial] = useState({ 
    type: 'Stainless Steel', 
    thickness: '3', 
    width: '1000', 
    height: '2000', 
    unit: 'mm' 
  });
  const [chat, setChat] = useState<Message[]>([
    { role: 'ai', text: 'Material confirmed. Workspace configured for AXE-DRAW. What would you like to build?', id: 0 }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [drawingState, setDrawingState] = useState<DrawingState>('empty');
  const [score, setScore] = useState(100);
  const [suggestions, setSuggestions] = useState<{title: string, desc: string, type: 'structural' | 'efficiency'}[]>([]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  const getMultiplier = (unit: string) => {
    if (unit === 'cm') return 10;
    if (unit === 'm') return 1000;
    return 1;
  };

  const toMm = (val: string | number, unit: string): number => {
    const num = typeof val === 'string' ? parseFloat(val) : val;
    if (isNaN(num)) return 0;
    return num * getMultiplier(unit);
  };

  const formatMm = (val: string | number, unit: string): string => {
    const mm = toMm(val, unit);
    return Number(mm.toFixed(2)).toLocaleString();
  };

  const widthInMm = formatMm(material.width, material.unit);
  const heightInMm = formatMm(material.height, material.unit);
  const thicknessInMm = formatMm(material.thickness, material.unit);
  const multiplier = getMultiplier(material.unit);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat, isTyping]);

  useEffect(() => {
    if (drawingState === 'plate') {
      setSuggestions([{ title: 'Structural', desc: 'A vast empty plate may warp during cutting. Consider adding relief cuts.', type: 'structural' }]);
      setScore(85);
    } else if (drawingState === 'plate_holes') {
       setSuggestions([
         { title: 'Structural', desc: 'Current hole spacing looks good, but corners are sharp. Consider rounding for safety.', type: 'structural' },
       ]);
       setScore(90);
    } else if (drawingState === 'plate_holes_hex') {
       setSuggestions([
         { title: 'Efficiency', desc: 'This hex pattern reduces material weight by 22% while maintaining rigidity.', type: 'efficiency' },
         { title: 'Structural', desc: 'Ensure hex ribs are at least 1.5x material thickness to prevent heat distortion.', type: 'structural' }
       ]);
       setScore(96);
    } else if (drawingState === 'gear') {
       setSuggestions([
         { title: 'Structural', desc: '32 teeth on this pitch circle may cause weak roots. Verify torque requirements.', type: 'structural' },
         { title: 'Efficiency', desc: 'Consider adding a center cutout to reduce rotating mass.', type: 'efficiency' }
       ]);
       setScore(88);
    } else {
       setSuggestions([]);
       setScore(100);
    }
  }, [drawingState]);

  const handleSend = () => {
    if (!inputVal.trim()) return;
    const userMsg = inputVal.trim();
    setChat(prev => [...prev, { role: 'user', text: userMsg, id: Date.now() }]);
    setInputVal('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      let aiResponse = "I've updated the canvas.";
      let nextState = drawingState;

      const lowerMsg = userMsg.toLowerCase();
      if (lowerMsg.includes('plate') || lowerMsg.includes('box') || lowerMsg.includes('rectangle')) {
        nextState = 'plate';
        aiResponse = `Generated a base plate conforming to ${material.width}x${material.height} ${material.unit} stock boundaries.`;
      } else if (lowerMsg.includes('hole') || lowerMsg.includes('mount')) {
        nextState = drawingState === 'empty' ? 'plate_holes' : (drawingState === 'plate' ? 'plate_holes' : drawingState);
        if (drawingState === 'plate_holes_hex') nextState = 'plate_holes_hex';
        aiResponse = "Added 4 precision mounting holes offset from corners.";
      } else if (lowerMsg.includes('hex') || lowerMsg.includes('vent') || lowerMsg.includes('pattern')) {
        nextState = 'plate_holes_hex';
        aiResponse = "Generated a parametric hexagonal vent pattern. Line thickness respects kerf tolerance for " + material.type + ".";
      } else if (lowerMsg.includes('gear') || lowerMsg.includes('cog')) {
         nextState = 'gear';
         aiResponse = "Generated a 32-tooth involute gear profile centered on the sheet.";
      } else if (lowerMsg.includes('round') || lowerMsg.includes('corner')) {
         aiResponse = "Applied 15mm corner rounding to mitigate stress concentrations.";
      } else {
        aiResponse = "AXE-DRAW is ready. Request geometric features like 'plate', 'mounting holes', or 'hex ventilation pattern'.";
      }

      if (nextState !== drawingState) {
         setDrawingState(nextState);
      }
      setChat(prev => [...prev, { role: 'ai', text: aiResponse, id: Date.now() }]);
    }, 1200);
  };

  const renderCanvasContent = () => {
    return (
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px]">
        {/* Sheet Stock Border Line & Surface */}
        <div className="absolute inset-0 border-2 border-[#1A1A1A] bg-blue-50/20 flex items-center justify-center transition-all duration-500 rounded-lg shadow-sm">
          {drawingState === 'empty' && (
            <div className="text-center p-6 select-none pointer-events-none">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 border border-blue-200 text-[#0066FF] mb-3">
                <Ruler className="w-6 h-6" />
              </div>
              <p className="text-xs font-black uppercase tracking-widest text-gray-700">Stock Sheet Active</p>
              <p className="text-[11px] font-mono font-bold text-[#0066FF] mt-1">
                {material.width} × {material.height} {material.unit} <span className="text-gray-400">({widthInMm} × {heightInMm} mm)</span>
              </p>
              <p className="text-[10px] text-gray-400 mt-2 max-w-xs">Enter a prompt in AXE-DRAW to generate cut paths or mounting profiles.</p>
            </div>
          )}

          {/* Hex Pattern */}
          <AnimatePresence>
            {drawingState === 'plate_holes_hex' && (
              <motion.div initial={{opacity: 0, scale: 0.9}} animate={{opacity: 1, scale:1}} className="grid grid-cols-5 gap-3 opacity-90 p-8 border border-blue-200 bg-white shadow-sm rounded">
                {Array.from({length: 25}).map((_,i) => (
                  <svg key={i} className="w-8 h-8 text-[#0066FF]" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1">
                    <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5" />
                  </svg>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Gear Profile */}
          {drawingState === 'gear' && (
            <div className="relative w-[300px] h-[300px] flex items-center justify-center">
              <div className="absolute w-[220px] h-[220px] border-4 border-[#1A1A1A] rounded-full bg-blue-50/70 flex items-center justify-center shadow-inner">
                <div className="w-[44px] h-[44px] border-4 border-[#1A1A1A] rounded-full bg-white"></div>
                {Array.from({length: 16}).map((_, i) => (
                  <div key={i} className="absolute w-[26px] h-[250px] border-y-4 border-[#1A1A1A] bg-blue-100/50" style={{ transform: `rotate(${i * (360/16)}deg)`}}></div>
                ))}
                <div className="absolute w-[230px] h-[230px] rounded-full border border-blue-400 border-dashed pointer-events-none"></div>
              </div>
            </div>
          )}
        </div>
        
        {/* Mounting Hole Corners */}
        <AnimatePresence>
          {(drawingState === 'plate_holes' || drawingState === 'plate_holes_hex') && (
            <>
              <motion.div initial={{scale:0}} animate={{scale:1}} className="absolute top-4 left-4 w-6 h-6 rounded-full border-2 border-[#1A1A1A] bg-white shadow-xs"></motion.div>
              <motion.div initial={{scale:0}} animate={{scale:1}} className="absolute top-4 right-4 w-6 h-6 rounded-full border-2 border-[#1A1A1A] bg-white shadow-xs"></motion.div>
              <motion.div initial={{scale:0}} animate={{scale:1}} className="absolute bottom-4 left-4 w-6 h-6 rounded-full border-2 border-[#1A1A1A] bg-white shadow-xs"></motion.div>
              <motion.div initial={{scale:0}} animate={{scale:1}} className="absolute bottom-4 right-4 w-6 h-6 rounded-full border-2 border-[#1A1A1A] bg-white shadow-xs"></motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Width Dimension Line with Readings (Input + mm) */}
        <div className="absolute -bottom-10 left-0 right-0 flex items-center">
          <div className="border-l-2 border-[#1A1A1A] h-3.5"></div>
          <div className="flex-1 border-t-2 border-[#1A1A1A]"></div>
          <div className="absolute left-1/2 -top-3 transform -translate-x-1/2 bg-[#F7F7F7] px-2.5 py-0.5 text-[10px] font-black text-[#1A1A1A] border border-[#1A1A1A] shadow-sm whitespace-nowrap">
            <span>{material.width} {material.unit.toUpperCase()}</span>
            {material.unit !== 'mm' && (
              <span className="text-[#0066FF] ml-1.5 font-bold">[{widthInMm} MM]</span>
            )}
          </div>
          <div className="border-r-2 border-[#1A1A1A] h-3.5"></div>
        </div>

        {/* Height Dimension Line with Readings (Input + mm) */}
        <div className="absolute -left-10 top-0 bottom-0 flex flex-col items-center">
          <div className="border-t-2 border-[#1A1A1A] w-3.5"></div>
          <div className="flex-1 border-l-2 border-[#1A1A1A]"></div>
          <div className="absolute top-1/2 -left-7 transform -translate-y-1/2 -rotate-90 bg-[#F7F7F7] px-2.5 py-0.5 text-[10px] font-black text-[#1A1A1A] border border-[#1A1A1A] shadow-sm whitespace-nowrap">
            <span>{material.height} {material.unit.toUpperCase()}</span>
            {material.unit !== 'mm' && (
              <span className="text-[#0066FF] ml-1.5 font-bold">[{heightInMm} MM]</span>
            )}
          </div>
          <div className="border-b-2 border-[#1A1A1A] w-3.5"></div>
        </div>
      </div>
    );
  };

  if (!materialSet) {
    return (
      <div className="h-full flex items-center justify-center bg-[#0A0A0A] p-6 animate-in fade-in">
        <div className="bg-[#141414] border border-[#333] w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden flex flex-col">
          <div className="bg-[#1A1A1A] border-b border-[#333] px-8 py-6 flex items-center justify-between">
            <div className="flex items-center">
              <Settings2 className="w-6 h-6 text-[#0066FF] mr-4" />
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight text-white">Material Setup Wizard</h2>
                <p className="text-xs text-gray-400 mt-0.5">AXE-DRAW Manufacturing Constraint Engine</p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-[#222] border border-[#333] px-2.5 py-1 rounded">
              Step 1 of 1
            </span>
          </div>

          <div className="p-8 space-y-6 flex-1">
            <p className="text-gray-400 font-medium text-sm">
              Define your material stock constraints before generating geometry. The AI automatically applies kerf offsets and computes machine-ready conversions in millimeters.
            </p>
            
            <div className="space-y-6">
              {/* Row 1: Material & Units Selector */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">
                    Material Type
                  </label>
                  <select 
                    value={material.type}
                    onChange={e => setMaterial({...material, type: e.target.value})}
                    className="w-full bg-[#0A0A0A] border border-[#333] rounded text-white p-3 text-sm focus:border-[#0066FF] focus:outline-none transition-colors"
                  >
                    <option>Stainless Steel</option>
                    <option>Mild Steel</option>
                    <option>Aluminum 6061</option>
                    <option>Acrylic</option>
                    <option>Birch Plywood</option>
                    <option>Brass C260</option>
                    <option>Titanium Grade 5</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#0066FF] uppercase tracking-widest mb-2 flex items-center justify-between">
                    <span>Dimension Units</span>
                    <span className="text-[9px] text-gray-400 lowercase font-mono">1 {material.unit} = {multiplier} mm</span>
                  </label>
                  <select 
                    value={material.unit}
                    onChange={e => setMaterial({...material, unit: e.target.value})}
                    className="w-full bg-[#0A0A0A] border border-[#0066FF]/60 rounded text-white p-3 text-sm focus:border-[#0066FF] focus:outline-none transition-colors"
                  >
                    <option value="mm">Millimeters (mm)</option>
                    <option value="cm">Centimeters (cm)</option>
                    <option value="m">Meters (m)</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Thickness & Sheet Dimensions */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">
                    Thickness ({material.unit})
                  </label>
                  <div className="relative">
                    <input 
                      type="number" 
                      step="any"
                      value={material.thickness}
                      onChange={e => setMaterial({...material, thickness: e.target.value})}
                      className="w-full bg-[#0A0A0A] border border-[#333] rounded text-white p-3 pr-12 text-sm focus:border-[#0066FF] focus:outline-none font-mono" 
                      placeholder="e.g. 3"
                    />
                    <span className="absolute right-3 top-3 text-xs font-mono text-gray-500 font-bold uppercase">
                      {material.unit}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">
                    Sheet Size (Width × Height in {material.unit})
                  </label>
                  <div className="flex items-center space-x-2">
                    <div className="relative flex-1">
                      <input 
                        type="number" 
                        step="any"
                        value={material.width} 
                        onChange={e => setMaterial({...material, width: e.target.value})}
                        className="w-full bg-[#0A0A0A] border border-[#333] rounded text-white p-3 pr-10 text-sm focus:border-[#0066FF] focus:outline-none font-mono" 
                        placeholder="Width"
                      />
                      <span className="absolute right-2.5 top-3 text-[10px] font-mono text-gray-500 font-bold">W</span>
                    </div>
                    <span className="text-gray-500 font-bold">×</span>
                    <div className="relative flex-1">
                      <input 
                        type="number" 
                        step="any"
                        value={material.height} 
                        onChange={e => setMaterial({...material, height: e.target.value})}
                        className="w-full bg-[#0A0A0A] border border-[#333] rounded text-white p-3 pr-10 text-sm focus:border-[#0066FF] focus:outline-none font-mono" 
                        placeholder="Height"
                      />
                      <span className="absolute right-2.5 top-3 text-[10px] font-mono text-gray-500 font-bold">H</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Real-time Summary Card in Wizard Corner */}
              <div className="bg-[#121212] border border-[#2a2a2a] rounded-lg p-4 shadow-inner">
                <div className="flex items-center justify-between mb-3 border-b border-[#222] pb-2">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="text-[10px] font-black uppercase tracking-wider text-gray-300">
                      Live Dimension Summary & Conversion
                    </span>
                  </div>
                  <span className="text-[9px] font-mono text-[#0066FF] bg-[#0066FF]/10 border border-[#0066FF]/30 px-2 py-0.5 rounded uppercase font-bold">
                    Scale Factor: ×{multiplier}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#0A0A0A] p-3 rounded border border-[#262626]">
                    <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest block mb-1">
                      User Input ({material.unit})
                    </span>
                    <p className="font-mono text-base font-bold text-white tracking-tight">
                      {material.width} × {material.height} <span className="text-gray-400 text-xs">{material.unit}</span>
                    </p>
                    <p className="text-[11px] text-gray-400 mt-1">
                      Thickness: <span className="font-mono text-gray-200 font-semibold">{material.thickness} {material.unit}</span>
                    </p>
                  </div>

                  <div className="bg-[#0066FF]/5 p-3 rounded border border-[#0066FF]/30">
                    <span className="text-[9px] font-bold text-[#0066FF] uppercase tracking-widest block mb-1 flex items-center justify-between">
                      <span>Machine-Ready (mm)</span>
                      <Check className="w-3 h-3 text-[#0066FF]" />
                    </span>
                    <p className="font-mono text-base font-black text-[#0066FF] tracking-tight">
                      {widthInMm} × {heightInMm} <span className="text-blue-300 text-xs">mm</span>
                    </p>
                    <p className="text-[11px] text-gray-400 mt-1">
                      Machine Thickness: <span className="font-mono text-white font-semibold">{thicknessInMm} mm</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Kerf advisory note */}
              <div className="bg-[#1A1A1A] p-3.5 border border-[#333] rounded flex items-start">
                <AlertCircle className="w-4 h-4 text-yellow-500 mr-2.5 mt-0.5 shrink-0" />
                <p className="text-xs text-gray-400 leading-relaxed font-medium">
                  {material.type} ({thicknessInMm}mm) typically exhibits a 0.15mm – 0.20mm kerf on a 2KW fiber laser. AXE-DRAW will automatically compensate during G-code toolpath generation.
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-[#333] bg-[#0A0A0A] p-6 flex justify-between items-center">
            <div className="text-[11px] font-mono text-gray-500">
              Workspace size: <span className="text-gray-300 font-bold">{widthInMm} × {heightInMm} mm</span>
            </div>
            <button 
              onClick={() => setMaterialSet(true)}
              className="bg-[#0066FF] hover:bg-[#0052CC] text-white px-8 py-3 text-xs font-black uppercase tracking-widest rounded transition-colors flex items-center shadow-lg cursor-pointer">
              Initialize Workspace <ChevronRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex overflow-hidden bg-[#E5E5E5] relative animate-in fade-in">
      {/* Left Toolbar (Dark) */}
      <div className="w-14 bg-[#141414] border-r border-[#333] flex flex-col items-center py-4 space-y-4 shrink-0 z-10 shadow-2xl">
        <button className="p-2 bg-[#0066FF] text-white rounded"><MousePointer2 className="w-5 h-5" /></button>
        <button className="p-2 text-gray-400 hover:text-white rounded transition-colors"><Move className="w-5 h-5" /></button>
        <button className="p-2 text-gray-400 hover:text-white rounded transition-colors"><ZoomIn className="w-5 h-5" /></button>
        <button className="p-2 text-gray-400 hover:text-white rounded transition-colors"><Box className="w-5 h-5" /></button>
        <div className="flex-1"></div>
        <button 
          onClick={() => setMaterialSet(false)} 
          title="Re-open Material Setup Wizard" 
          className="p-2 text-gray-400 hover:text-white rounded transition-colors cursor-pointer">
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* Main CAD Canvas */}
      <div className="flex-1 relative overflow-hidden bg-white">
        {/* Grid lines */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none" 
            style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
        </div>
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
            style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '10px 10px' }}>
        </div>

        {/* Top Info Bar */}
        <div className="absolute top-0 left-0 right-0 h-14 bg-white/95 backdrop-blur-xs border-b border-[#E5E5E5] flex justify-between items-center px-6 z-10">
          <div className="flex space-x-6 items-center">
            <button 
              onClick={() => setMaterialSet(false)}
              title="Click to edit material constraints" 
              className="flex items-center text-[10px] font-black tracking-widest uppercase text-gray-800 hover:text-[#0066FF] bg-gray-100 hover:bg-gray-200 px-2.5 py-1.5 rounded transition-all cursor-pointer border border-gray-200">
              <CheckSquare className="w-3.5 h-3.5 text-[#0066FF] mr-2" />
              {material.type} / {material.thickness}{material.unit} ({thicknessInMm}mm)
            </button>
            <span className="text-[10px] font-black tracking-widest uppercase text-gray-400">
              View: Top (2D Orthographic)
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Quick Conversion Header Pill */}
            <div className="flex flex-col items-end bg-gray-50 border border-gray-200 px-3 py-1 rounded shadow-xs">
              <div className="flex justify-between w-full space-x-4">
                <span className="text-[8px] font-bold tracking-widest uppercase text-gray-400">Input ({material.unit})</span>
                <span className="text-[10px] font-mono font-black tracking-widest uppercase text-[#1A1A1A]">{material.width} × {material.height}</span>
              </div>
              <div className="flex justify-between w-full space-x-4 mt-0.5 border-t border-gray-200 pt-0.5">
                <span className="text-[8px] font-bold tracking-widest uppercase text-[#0066FF]">Machine (mm)</span>
                <span className="text-[10px] font-mono font-black tracking-widest uppercase text-[#0066FF]">
                  {widthInMm} × {heightInMm}
                </span>
              </div>
            </div>

            <span className={`text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded-sm border ${score > 90 ? 'border-green-500/30 text-green-700 bg-green-50' : 'border-yellow-500/30 text-yellow-700 bg-yellow-50'}`}>
              Score: {score}/100 
            </span>
            <button className="bg-[#141414] text-white px-4 py-2 rounded text-[10px] font-black uppercase tracking-widest hover:bg-[#0066FF] transition-colors flex items-center shadow-lg cursor-pointer">
              <Download className="w-3 h-3 mr-2" /> Export DXF/G-Code
            </button>
          </div>
        </div>

        {/* Canvas Content (Stock boundaries, drawings, and dimension lines) */}
        {renderCanvasContent()}
        
        {/* Corner Dimension Summary HUD (Displays both user input and machine-ready conversion in mm) */}
        <div className="absolute bottom-6 left-6 z-20 bg-white/95 backdrop-blur-sm border border-gray-300 rounded-lg p-3.5 shadow-xl text-left min-w-[270px]">
          <div className="flex items-center justify-between border-b border-gray-200 pb-2 mb-2.5">
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] font-black uppercase tracking-wider text-gray-800">Dimension Summary</span>
            </div>
            <span className="text-[8px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
              Machine-Ready
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">User Input:</span>
              <span className="font-mono font-bold text-gray-800 text-[11px]">
                {material.width} × {material.height} <span className="text-gray-500">{material.unit}</span>
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Stock Thickness:</span>
              <span className="font-mono font-bold text-gray-800 text-[11px]">
                {material.thickness} {material.unit}
              </span>
            </div>

            <div className="border-t border-dashed border-gray-200 pt-2 flex justify-between items-center bg-blue-50/70 -mx-1 px-2 py-1 rounded border border-blue-100">
              <span className="text-[9px] font-black text-blue-700 uppercase tracking-wider flex items-center">
                <Cpu className="w-3 h-3 mr-1 text-[#0066FF]" /> Machine (mm):
              </span>
              <span className="font-mono font-black text-blue-700 text-[12px]">
                {widthInMm} × {heightInMm} mm
              </span>
            </div>

            <div className="flex justify-between items-center px-0.5 pt-0.5 text-[9px]">
              <span className="text-gray-400 uppercase font-semibold">Machine Thickness:</span>
              <span className="font-mono text-gray-700 font-bold">{thicknessInMm} mm</span>
            </div>

            {/* Quick Unit Selector */}
            <div className="pt-2 border-t border-gray-200 flex items-center justify-between">
              <span className="text-[8px] font-bold text-gray-400 uppercase">Unit Switcher:</span>
              <div className="flex space-x-1">
                {(['mm', 'cm', 'm'] as const).map(u => (
                  <button
                    key={u}
                    onClick={() => setMaterial({...material, unit: u})}
                    className={`px-2 py-0.5 text-[9px] font-mono font-bold rounded transition-colors cursor-pointer ${
                      material.unit === u 
                        ? 'bg-[#0066FF] text-white shadow-xs' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* AI Suggestions Floating Panel */}
        <AnimatePresence>
          {suggestions.length > 0 && (
            <motion.div 
              initial={{opacity: 0, x: 20}} animate={{opacity: 1, x: 0}} exit={{opacity:0, x:20}}
              className="absolute right-6 top-20 w-72 bg-white border border-[#E5E5E5] shadow-2xl rounded-lg overflow-hidden z-20">
              <div className="bg-[#141414] px-4 py-3 flex items-center">
                <Sparkles className="w-4 h-4 text-yellow-400 mr-2" />
                <h4 className="text-[10px] text-white font-black uppercase tracking-widest">AI Improvements</h4>
              </div>
              <div className="p-4 space-y-4">
                {suggestions.map((s, i) => (
                  <div key={i} className="group border border-transparent hover:border-[#0066FF]/20 p-2 -m-2 rounded transition-colors cursor-pointer">
                    <span className={`text-[9px] font-bold uppercase tracking-widest block mb-1 ${s.type==='structural'?'text-[#FF4E00]':'text-[#0066FF]'}`}>{s.title}</span>
                    <p className="text-xs text-gray-700 font-medium leading-relaxed">{s.desc}</p>
                    <div className="mt-2 text-[9px] font-bold text-[#0066FF] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
                      <Zap className="w-3 h-3 mr-1" /> Apply Fix
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right AI Chat Sidebar (AXE-DRAW) */}
      <div className="w-[400px] bg-[#141414] border-l border-[#333] flex flex-col shrink-0 z-20 shadow-[-10px_0_30px_rgba(0,0,0,0.2)]">
        <div className="h-14 border-b border-[#333] flex items-center justify-between px-6 bg-[#0A0A0A]">
          <div className="flex items-center">
            <Zap className="w-4 h-4 text-[#FF4E00] mr-3" />
            <span className="font-black text-xs uppercase tracking-widest text-white">AXE-DRAW</span>
          </div>
          <button 
            onClick={() => setMaterialSet(false)}
            title="Setup Constraints"
            className="text-gray-400 hover:text-white transition-colors cursor-pointer">
            <Settings2 className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#141414]">
          {chat.map((msg) => (
            <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[90%] px-4 py-3 rounded-xl border ${msg.role === 'user' ? 'bg-[#0066FF] text-white border-[#0052CC] rounded-tr-sm' : 'bg-[#1A1A1A] text-gray-200 border-[#333] rounded-tl-sm'}`}>
                <p className="font-medium leading-relaxed text-sm">{msg.text}</p>
              </div>
            </div>
          ))}
          {isTyping && (
             <div className="flex flex-col items-start">
               <div className="max-w-[90%] px-4 py-3 rounded-xl border bg-[#1A1A1A] text-gray-200 border-[#333] rounded-tl-sm flex items-center h-[46px]">
                  <RefreshCw className="w-4 h-4 text-[#0066FF] animate-spin" />
               </div>
             </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="p-4 border-t border-[#333] bg-[#0A0A0A]">
          {/* Attachment / Reference Image zone */}
          <div className="mb-3">
             <button className="w-full flex items-center justify-center py-2 border border-dashed border-[#444] rounded bg-[#111] hover:bg-[#1A1A1A] hover:border-[#0066FF] transition-all group cursor-pointer">
                <ImageIcon className="w-4 h-4 text-gray-500 group-hover:text-[#0066FF] mr-2 transition-colors" />
                <span className="text-[10px] font-bold text-gray-500 group-hover:text-[#0066FF] uppercase tracking-widest transition-colors">Attach Reference Image / Sketch</span>
             </button>
          </div>

          <div className="relative border border-[#444] rounded-lg bg-[#141414] focus-within:border-[#0066FF] focus-within:ring-1 focus-within:ring-[#0066FF] transition-all">
            <input 
              type="text" 
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Describe what to design..."
              className="w-full bg-transparent pl-4 pr-12 py-3.5 text-sm text-white placeholder-gray-500 focus:outline-none"
            />
            <button 
              onClick={handleSend}
              disabled={!inputVal.trim() || isTyping}
              className="absolute right-2 top-2 bottom-2 w-10 flex items-center justify-center bg-[#0066FF] hover:bg-[#0052CC] disabled:bg-[#333] disabled:text-gray-500 text-white rounded transition-colors cursor-pointer">
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[9px] text-gray-600 font-bold text-center mt-4 uppercase tracking-widest">Powered by Gemini CAD Engine v1.5</p>
        </div>
      </div>
    </div>
  );
}

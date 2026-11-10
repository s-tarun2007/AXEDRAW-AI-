import { PenTool, MousePointer2, Image as ImageIcon, CheckSquare, Zap, Layers, Boxes, ShieldAlert, Key, FastForward } from 'lucide-react';

export function UXGuidelines() {
  const points = [
    { icon: MousePointer2, title: "White Professional CAD Canvas", desc: "A clean, mathematically absolute white space with an engineering grid. It feels like industry-standard tools (AutoCAD, Fusion 360), stripped of clutter." },
    { icon: Zap, title: "AI Chat Assistant Panel", desc: "Replaces complex nested UI menus. Users explicitly command modifications, generation, or adjustments using natural language." },
    { icon: ImageIcon, title: "Drag-and-Drop Image Upload", desc: "Users can instantly drop sketches or inspiration photos directly into the chat; the AI's vision engine converts them into parametric vector constraints." },
    { icon: Boxes, title: "Beginner-Friendly Tool Layout", desc: "Minimalist sidebars containing only essential semantic tools (Pan, Select, Box) without overwhelming the user with heavy geometry operations." },
    { icon: ShieldAlert, title: "Real-time AI Suggestions", desc: "A proactive sticky sidebar that analyzes drawn geometry on the fly. It warns about weak points, burn hazards, or material waste." },
    { icon: CheckSquare, title: "Material Setup Wizard", desc: "Forces users to define material type, dimensions, and thickness upfront. This constraint allows the AI to automatically calculate kerf widths and limits." },
    { icon: Layers, title: "Live 2D/3D Design Preview", desc: "Toggle seamlessly between flat vector layouts for laser cutting and 3D extruded representations to verify assemblies." },
    { icon: FastForward, title: "One-Click Export Panel", desc: "Generates optimized, toolpath-ready DXF, DWG, SVG, and STL outputs instantly, bypassing complex export configuration dialogs." },
    { icon: PenTool, title: "Minimal Industrial Dashboard", desc: "A dark-themed outer shell that makes the bright CAD canvas pop, organizing recent files and settings clearly for hardware startups and students." },
    { icon: Key, title: "Responsive & Guided Editing", desc: "Smooth layout transitions, tooltips for shortcuts, and clear AI explanations ensuring non-technical users understand exactly what the AI changed." },
  ];

  return (
    <div className="space-y-12 animate-in fade-in max-w-5xl mx-auto py-12 px-8">
      <div className="border-b border-[#333] pb-8">
        <h2 className="text-[40px] font-black uppercase tracking-tighter text-white leading-[0.85]">UX Design Principles</h2>
        <p className="mt-6 text-sm font-medium text-gray-400 max-w-3xl leading-relaxed">
          10 core principles defining the interface for the next generation of AI-Native CAD platforms. Designed to balance absolute professional precision with consumer-grade accessibility.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         {points.map((pt, i) => (
            <div key={i} className="bg-[#141414] border border-[#333] p-6 hover:border-[#0066FF]/50 transition-colors group relative overflow-hidden">
               <div className="absolute top-0 left-0 w-1 h-full bg-[#333] group-hover:bg-[#0066FF] transition-colors"></div>
               <div className="flex items-start">
                  <div className="w-10 h-10 bg-[#1A1A1A] border border-[#333] flex items-center justify-center shrink-0 mr-4 group-hover:bg-[#0066FF]/10 group-hover:border-[#0066FF]/30 transition-colors">
                     <pt.icon className="w-5 h-5 text-gray-400 group-hover:text-[#0066FF]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-white mb-2">{i+1}. {pt.title}</h3>
                    <p className="text-xs text-gray-400 font-medium leading-relaxed">{pt.desc}</p>
                  </div>
               </div>
            </div>
         ))}
      </div>
    </div>
  );
}

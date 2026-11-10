import { Target, Users, Zap, PenTool } from 'lucide-react';

export function ExecutiveSummary() {
  return (
    <div className="space-y-12 animate-in fade-in">
      <div className="border-b border-[#333] pb-8">
        <h2 className="text-[40px] md:text-[64px] font-black leading-[0.85] uppercase tracking-tighter text-white">
          AI-Native<br/>
          <span className="text-[#0066FF]">CAD/CAM Platform</span>
        </h2>
        <p className="mt-8 text-sm md:text-base text-gray-400 max-w-3xl leading-relaxed font-medium">
          A combination of Fusion 360 + Midjourney + ChatGPT + AutoCAD + AI Copilot for Manufacturing.
          This next-generation web-based CAD/CAM platform eliminates manual drafting. Users interact with an intelligent AI chatbot that translates natural language, images, and material constraints directly into production-ready vector geometry while a proactive AI Copilot validates manufacturability.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-[#141414] p-8 border border-[#333] relative">
          <div className="absolute -top-4 -left-4 w-12 h-12 bg-[#0066FF] flex items-center justify-center text-white shadow-[#000]">
            <Zap className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-black uppercase tracking-tight text-white mb-4">Core Value Proposition</h3>
          <ul className="space-y-3 text-sm text-gray-400 font-medium leading-relaxed">
            <li className="flex items-start"><span className="text-[#0066FF] mr-3 font-bold">01</span> <span><b className="text-white">Proactive Design Copilot:</b> AI engineering consultant offering real-time improvements and optimization.</span></li>
            <li className="flex items-start"><span className="text-[#0066FF] mr-3 font-bold">02</span> <span><b className="text-white">Computer Vision:</b> Uploaded sketches and images are intelligently converted to editable parametric CAD.</span></li>
            <li className="flex items-start"><span className="text-[#0066FF] mr-3 font-bold">03</span> <span><b className="text-white">Precise Editing via NLP:</b> Natural language mutation to edit sizes, counts, and geometry.</span></li>
            <li className="flex items-start"><span className="text-[#0066FF] mr-3 font-bold">04</span> <span><b className="text-white">Manufacturing Intelligence:</b> Live scoring, kerf limits, and cost prediction in real-time.</span></li>
          </ul>
        </div>

        <div className="bg-[#141414] p-8 border border-[#333] relative">
          <div className="absolute -top-4 -left-4 w-12 h-12 bg-[#FF4E00] flex items-center justify-center text-white shadow-[#000]">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-black uppercase tracking-tight text-white mb-4">Target Personas</h3>
          <ul className="space-y-3 text-sm text-gray-400 font-medium leading-relaxed">
            <li className="flex items-start">
              <span className="w-1.5 h-1.5 bg-[#0A0A0A] mt-1.5 mr-3 shrink-0"></span>
              <span><b className="text-white">Laser Cutting Businesses:</b> For rapid quoting, nesting, and file generation.</span>
            </li>
            <li className="flex items-start">
              <span className="w-1.5 h-1.5 bg-[#0A0A0A] mt-1.5 mr-3 shrink-0"></span>
              <span><b className="text-white">Students & Hobbyists:</b> Eliminates the extreme learning curve of traditional CAD.</span>
            </li>
            <li className="flex items-start">
              <span className="w-1.5 h-1.5 bg-[#0A0A0A] mt-1.5 mr-3 shrink-0"></span>
              <span><b className="text-white">Industrial Designers:</b> Rapid ideation + manufacturing-ready prototypes.</span>
            </li>
            <li className="flex items-start">
              <span className="w-1.5 h-1.5 bg-[#0A0A0A] mt-1.5 mr-3 shrink-0"></span>
              <span><b className="text-white">Hardware Startups:</b> Fast iterative layout generation and iteration.</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-[#0A0A0A] p-10 relative overflow-hidden border border-[#333]">
        <Target className="absolute -right-8 -bottom-8 w-48 h-48 text-[#141414]" />
        <h3 className="text-2xl font-black uppercase tracking-tight text-white mb-4 flex items-center relative z-10">
          Bridging the CAD Knowledge Gap
        </h3>
        <p className="text-gray-400 text-base leading-relaxed font-medium relative z-10">
          Current manufacturing workflows require users to learn complex UI trees, constraints, and sketching tools. 
          Our architecture transforms intent seamlessly into manufacturable files. A fabricator no longer needs to draw a <i className="text-white font-bold">"NEMA 17 stepper motor mounting bracket in 2mm steel"</i>—they just casually prompt the AI Copilot. The intelligence layer ensures the result isn't just a picture, but structured, toolpath-ready DWG code.
        </p>
      </div>
    </div>
  );
}

import { Settings2, Bot, Cpu, Download } from 'lucide-react';

export function WorkflowArchitecture() {
  const steps = [
    {
      icon: Settings2,
      title: 'Step 1: Material Setup & Intelligence',
      desc: 'The user enters material constraints (e.g., Stainless steel, 3mm, 1000x2000mm) OR uploads a reference sketch. The AI configures the workspace and kerf tolerances.',
      details: [
        'Initializes the CAD canvas dimensions.',
        'Vision AI processes any uploaded sketches/photos for vector extraction.',
        'Applies material kerf limits and manufacturing constraints (bend allowances, heat zones).',
      ],
      color: 'text-white',
      bg: 'bg-[#141414]',
      border: 'border-[#333]'
    },
    {
      icon: Bot,
      title: 'Step 2: Ideation & Generative Design',
      desc: 'User chats naturally to describe the intent. The AI generates geometry, offering 3 variations, and renders it live on the canvas.',
      details: [
        'Multimodal NLP analysis translates semantic intent into parametric values.',
        'Geometry engine runs boolean layouts.',
        'Continuous Proactive Copilot suggests side-by-side improvements (e.g. "Add support ribs for rigidity").'
      ],
      color: 'text-[#0066FF]',
      bg: 'bg-[#0066FF]/10',
      border: 'border-[#0066FF]/30'
    },
    {
      icon: Cpu,
      title: 'Step 3: Precise Editing & Feedback',
      desc: 'User issues natural language commands for precision tuning: "Increase gear tooth count to 32". AI updates live and provides a Manufacturing Score.',
      details: [
        'Real-time semantic mutation preserves parent constraints.',
        'Manufacturability analysis prevents impossible geometries.',
        'Feedback Engine scores material efficiency and cut time.'
      ],
      color: 'text-[#FF4E00]',
      bg: 'bg-[#FF4E00]/10',
      border: 'border-[#FF4E00]/30'
    },
    {
      icon: Download,
      title: 'Step 4: One-Click Production',
      desc: 'Generates ready-to-cut assets via lightweight cloud microservices, bypassing complex CAM configurations.',
      details: [
        'Direct export to SVG / DXF / STEP.',
        'Toolpath line color mapping (e.g., Red = Cut, Blue = Etch).',
        'Automatic packing and nesting for material optimization.',
      ],
      color: 'text-white',
      bg: 'bg-[#141414]',
      border: 'border-[#333]'
    }
  ];

  return (
    <div className="space-y-12 animate-in fade-in">
      <div className="border-b border-[#333] pb-8">
        <h2 className="text-[40px] font-black uppercase tracking-tighter text-white leading-[0.85]">Human-AI Workflow</h2>
        <p className="mt-6 text-sm font-medium text-gray-400 max-w-3xl leading-relaxed">
          A radically simplified pipeline converting intent to manufactured products in minutes.
        </p>
      </div>

      <div className="relative">
        <div className="absolute left-8 top-8 bottom-8 w-1 bg-[#333] hidden md:block"></div>

        <div className="space-y-8">
          {steps.map((step, idx) => (
            <div key={idx} className="relative flex flex-col md:flex-row gap-6 md:gap-8 items-start group">
              <div className={`w-16 h-16 shrink-0 rounded-full ${step.bg} border-2 ${step.border} flex items-center justify-center relative z-10 shadow-lg group-hover:scale-110 transition-transform`}>
                <step.icon className={`w-6 h-6 ${step.color}`} />
              </div>
              
              <div className={`flex-1 ${idx % 2 !== 0 ? 'md:pt-4' : ''}`}>
                <div className="bg-[#141414] border border-[#333] p-8 hover:border-[#0066FF]/50 transition-colors">
                  <h3 className="text-xl font-black uppercase tracking-tight text-white mb-3">{step.title}</h3>
                  <p className="text-sm font-medium text-gray-400 mb-6 leading-relaxed">{step.desc}</p>
                  
                  <div className="bg-[#0A0A0A] p-4 border border-[#333]">
                    <ul className="space-y-3">
                      {step.details.map((detail, dIdx) => (
                        <li key={dIdx} className="flex items-start text-xs font-medium text-gray-500">
                          <span className="w-1.5 h-1.5 bg-[#0066FF] mt-1.5 mr-3 shrink-0"></span>
                          <span className="leading-relaxed">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

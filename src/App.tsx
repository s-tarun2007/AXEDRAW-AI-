import React, { useState } from 'react';
import { PenTool, Box, Cog, ListTodo } from 'lucide-react';
import { CreationSpace } from './pages/CreationSpace';
import { UXGuidelines } from './pages/UXGuidelines';
import { ExecutiveSummary } from './pages/ExecutiveSummary';
import { WorkflowArchitecture } from './pages/WorkflowArchitecture';

function App() {
  const [activeTab, setActiveTab] = useState('creation');

  return (
    <div className="min-h-screen bg-[#0A0A0A] font-sans text-white flex flex-col h-screen overflow-hidden">
      
      {/* Top Nav / App Bar */}
      <nav className="bg-[#141414] border-b border-[#333] shrink-0 h-16 flex items-center px-6 justify-between relative z-30">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-[#0066FF] flex items-center justify-center text-white">
            <Cog className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter uppercase leading-none text-white">AxeDraw<span className="text-[#FF4E00]">.AI</span></h1>
            <p className="text-[9px] uppercase tracking-[0.2em] text-gray-500 font-bold leading-none mt-1">Copilot CAD Engine</p>
          </div>
        </div>

        <div className="flex space-x-1 bg-[#0A0A0A] p-1 border border-[#333] rounded-lg">
          <TabButton 
            active={activeTab === 'creation'} 
            onClick={() => setActiveTab('creation')}
            icon={Box}
            label="Creation Space"
          />
          <TabButton 
            active={activeTab === 'ux'} 
            onClick={() => setActiveTab('ux')}
            icon={PenTool}
            label="UX Guidelines"
          />
          <TabButton 
            active={activeTab === 'summary'} 
            onClick={() => setActiveTab('summary')}
            icon={PenTool}
            label="Executive Summary"
          />
          <TabButton 
            active={activeTab === 'workflow'} 
            onClick={() => setActiveTab('workflow')}
            icon={ListTodo}
            label="Workflow"
          />
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-hidden">
         {activeTab === 'creation' && <CreationSpace />}
         
         {(activeTab !== 'creation') && (
           <div className="absolute inset-0 overflow-auto custom-scrollbar">
             <div className="max-w-5xl mx-auto py-12 px-6">
                {activeTab === 'ux' && <UXGuidelines />}
                {activeTab === 'summary' && <ExecutiveSummary />}
                {activeTab === 'workflow' && <WorkflowArchitecture />}
             </div>
           </div>
         )}
      </main>

    </div>
  );
}

function TabButton({ active, onClick, icon: Icon, label }: { active: boolean, onClick: () => void, icon: React.ElementType, label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-md transition-all duration-200 ${
        active 
          ? 'bg-[#141414] text-white shadow-sm border border-[#333]' 
          : 'text-gray-500 hover:text-white border border-transparent hover:bg-[#1A1A1A]'
      }`}
    >
      <Icon className={`w-3.5 h-3.5 mr-2 ${active ? 'text-[#0066FF]' : 'opacity-70'}`} />
      {label}
    </button>
  );
}

export default App;

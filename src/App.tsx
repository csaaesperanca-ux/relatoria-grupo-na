import React, { useState } from 'react';
import { MeetingForm } from './components/MeetingForm';
import { ReportsView } from './components/ReportsView';
import { NALogo } from './components/NALogo';
import { PlusCircle, Layers, FileSpreadsheet } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<'partilha' | 'servico' | 'relatorios'>('partilha');
  const [successMessage, setSuccessMessage] = useState(false);

  const mockGroupId = 'grupo-exemplo-01';

  const handleSuccess = () => {
    setSuccessMessage(true);
    setActiveTab('relatorios');
    setTimeout(() => setSuccessMessage(false), 4000);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Topo Institucional */}
      <header className="bg-slate-900 text-white shadow-md">
        <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <NALogo className="w-8 h-8 text-amber-500" />
            <div>
              <h1 className="font-bold text-sm tracking-wide">Relatoria NA</h1>
              <p className="text-[11px] text-slate-400">Atas e Relatórios de Grupo</p>
            </div>
          </div>
          <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full border border-slate-700">
            Grupo Ativo
          </span>
        </div>
      </header>

      {/* Navegação */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 flex gap-2">
          <button
            onClick={() => setActiveTab('partilha')}
            className={`flex items-center gap-2 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'partilha'
                ? 'border-amber-500 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <PlusCircle className="w-4 h-4 text-amber-500" /> Reunião de Partilhas
          </button>
          <button
            onClick={() => setActiveTab('servico')}
            className={`flex items-center gap-2 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'servico'
                ? 'border-amber-500 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Layers className="w-4 h-4 text-slate-600" /> Reunião Administrativa
          </button>
          <button
            onClick={() => setActiveTab('relatorios')}
            className={`flex items-center gap-2 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'relatorios'
                ? 'border-amber-500 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> Relatórios & Tesouraria
          </button>
        </div>
      </div>

      {/* Notificação de Sucesso */}
      {successMessage && (
        <div className="max-w-md mx-auto mt-4 bg-emerald-50 border border-emerald-300 text-emerald-800 p-3 rounded-lg text-sm text-center shadow-sm">
          ✓ Registro salvo com sucesso no banco de dados!
        </div>
      )}

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-6">
        {activeTab === 'partilha' && (
          <MeetingForm groupId={mockGroupId} onSuccess={handleSuccess} />
        )}
        {activeTab === 'servico' && (
          <div className="bg-white p-8 rounded-xl text-center border text-slate-500">
            Módulo de Reunião Administrativa e Autoexame.
          </div>
        )}
        {activeTab === 'relatorios' && (
          <ReportsView />
        )}
      </main>
    </div>
  );
}

export default App;

import React, { useEffect, useState } from 'react';
import type { Meeting } from '../types';
import { db } from '../lib/db';
import { formatMeetingForWhatsApp } from '../utils/reportFormatter';
import { 
  FileSpreadsheet, 
  Share2, 
  Printer, 
  Calendar, 
  Users, 
  DollarSign, 
  Award, 
  TrendingUp,
  Check
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);

  useEffect(() => {
    loadMeetings();
  }, []);

  const loadMeetings = async () => {
    try {
      const list = await db.meetings.orderBy('meeting_date').reverse().toArray();
      setMeetings(list);
    } catch (e) {
      console.error('Erro ao carregar reuniões:', e);
    }
  };

  const handleCopyWhatsApp = (meeting: Meeting, id: number) => {
    const text = formatMeetingForWhatsApp(meeting);
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handlePrint = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    setTimeout(() => {
      window.print();
    }, 200);
  };

  const totalArrecadado = meetings.reduce((acc, m) => acc + Number(m.tradition_7 || 0), 0);
  const totalDespesas = meetings.reduce((acc, m) => acc + Number(m.expenses || 0), 0);
  const saldoCaixa = totalArrecadado - totalDespesas;
  const totalPresentesGeral = meetings.reduce((acc, m) => 
    acc + Number(m.members_count || 0) + Number(m.newcomers_count || 0) + Number(m.visitors_count || 0), 0
  );

  return (
    <div className="space-y-6">
      {/* Cards de Métricas e Livro-Caixa */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Saldo em Caixa (7ª Trad.)</p>
            <h3 className={`text-xl font-bold mt-1 ${saldoCaixa >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              R$ {saldoCaixa.toFixed(2)}
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Entradas: R$ {totalArrecadado.toFixed(2)}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Total de Presenças</p>
            <h3 className="text-xl font-bold text-slate-900 mt-1">{totalPresentesGeral}</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Em {meetings.length} reunião(ões)</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Média por Reunião</p>
            <h3 className="text-xl font-bold text-amber-600 mt-1">
              {meetings.length > 0 ? (totalPresentesGeral / meetings.length).toFixed(1) : '0'}
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Adictos e visitantes</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Tabela de Atas Registradas */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-slate-700" />
            <h2 className="font-semibold text-sm text-slate-900">Histórico de Atas e Reuniões</h2>
          </div>
          <span className="text-xs font-medium bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full">
            {meetings.length} registradas
          </span>
        </div>

        {meetings.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">
            Nenhuma ata salva ainda. Preencha sua primeira reunião na aba "Reunião de Partilhas".
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {meetings.map((m, idx) => {
              const attendees = Number(m.members_count || 0) + Number(m.newcomers_count || 0) + Number(m.visitors_count || 0);
              const saldo = Number(m.tradition_7 || 0) - Number(m.expenses || 0);

              return (
                <div key={m.id || idx} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {m.meeting_date}
                      </span>
                      <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                        {m.format}
                      </span>
                      {m.theme_or_topic && (
                        <span className="text-xs text-slate-500 font-medium truncate max-w-xs">
                          • {m.theme_or_topic}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span>Presenças: <strong>{attendees}</strong></span>
                      <span>Arrecadado: <strong>R$ {Number(m.tradition_7 || 0).toFixed(2)}</strong></span>
                      <span>Saldo: <strong className={saldo >= 0 ? 'text-emerald-600' : 'text-rose-600'}>R$ {saldo.toFixed(2)}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => handleCopyWhatsApp(m, m.id || idx)}
                      className="px-3 py-1.5 text-xs font-medium bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Copiar texto para colar no WhatsApp"
                    >
                      {copiedId === (m.id || idx) ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" /> Copiado!
                        </>
                      ) : (
                        <>
                          <Share2 className="w-3.5 h-3.5" /> WhatsApp
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handlePrint(m)}
                      className="px-3 py-1.5 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Imprimir ou Salvar como PDF"
                    >
                      <Printer className="w-3.5 h-3.5" /> Imprimir / PDF
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Folha Oculta Formatada para Impressão / Salvar PDF */}
      {selectedMeeting && (
        <div id="print-area" className="hidden print:block p-8 bg-white text-black font-sans">
          <div className="border-b-2 border-black pb-4 mb-4 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Narcóticos Anônimos</h1>
              <h2 className="text-lg font-semibold">Ata Oficial de Reunião</h2>
            </div>
            <div className="text-right text-xs">
              <p>Data: <strong>{selectedMeeting.meeting_date}</strong></p>
              <p>Formato: <strong>{selectedMeeting.format.toUpperCase()}</strong></p>
            </div>
          </div>

          <div className="space-y-4 text-sm">
            {selectedMeeting.theme_or_topic && (
              <p><strong>Tema / Leitura:</strong> {selectedMeeting.theme_or_topic}</p>
            )}

            <div className="border p-3 rounded">
              <h3 className="font-bold border-b pb-1 mb-2">Presença na Sala</h3>
              <p>Membros Adictos: {selectedMeeting.members_count}</p>
              <p>Ingressos (1ª vez): {selectedMeeting.newcomers_count}</p>
              <p>Visitas / Familiares: {selectedMeeting.visitors_count}</p>
              <p className="font-bold mt-1">Total: {Number(selectedMeeting.members_count || 0) + Number(selectedMeeting.newcomers_count || 0) + Number(selectedMeeting.visitors_count || 0)}</p>
            </div>

            <div className="border p-3 rounded">
              <h3 className="font-bold border-b pb-1 mb-2">7ª Tradição & Finanças</h3>
              <p>Total Arrecadado: R$ {Number(selectedMeeting.tradition_7 || 0).toFixed(2)}</p>
              <p>Despesas do Dia: R$ {Number(selectedMeeting.expenses || 0).toFixed(2)}</p>
              <p className="font-bold mt-1">Saldo Líquido: R$ {(Number(selectedMeeting.tradition_7 || 0) - Number(selectedMeeting.expenses || 0)).toFixed(2)}</p>
            </div>

            {selectedMeeting.meeting_notes && (
              <div className="border p-3 rounded">
                <h3 className="font-bold border-b pb-1 mb-2">Recados e Avisos</h3>
                <p>{selectedMeeting.meeting_notes}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

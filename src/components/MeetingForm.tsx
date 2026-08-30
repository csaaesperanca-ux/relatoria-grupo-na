import React, { useState } from 'react';
import type { Meeting, KeytagsCount } from '../types';
import { supabase } from '../lib/supabase';
import { db } from '../lib/db';
import { Users, DollarSign, Award, FileText, CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';

interface Props {
  groupId: string;
  onSuccess: () => void;
}

const initialKeytags: KeytagsCount = {
  '30d': 0,
  '60d': 0,
  '90d': 0,
  '6m': 0,
  '9m': 0,
  '1a': 0,
  '18m': 0,
  'multi': 0,
};

export const MeetingForm: React.FC<Props> = ({ groupId, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [emptySections, setEmptySections] = useState<string[]>([]);

  const [formData, setFormData] = useState<Meeting>({
    group_id: groupId,
    meeting_date: new Date().toISOString().split('T')[0],
    meeting_type: 'partilha',
    format: 'presencial',
    theme_or_topic: '',
    members_count: 0,
    newcomers_count: 0,
    visitors_count: 0,
    tradition_7: 0,
    expenses: 0,
    keytags: initialKeytags,
    servants_roles: {
      coordenador: '',
      cafe: '',
      tempo: '',
      recepcao: '',
      sph: '',
    },
    meeting_notes: '',
  });

  const totalAttendees = 
    Number(formData.members_count || 0) + 
    Number(formData.newcomers_count || 0) + 
    Number(formData.visitors_count || 0);

  const checkEmptySections = (): string[] => {
    const empty: string[] = [];
    if (!formData.theme_or_topic && !formData.servants_roles.coordenador) {
      empty.push('Identificação e Servidores');
    }
    if (totalAttendees === 0) {
      empty.push('Contagem de Presentes');
    }
    if (formData.tradition_7 === 0 && formData.expenses === 0) {
      empty.push('7ª Tradição / Finanças');
    }
    const hasKeytags = Object.values(formData.keytags).some(v => v > 0);
    if (!hasKeytags) {
      empty.push('Chaveiros Entregues');
    }
    return empty;
  };

  const handlePreSubmit = () => {
    const empty = checkEmptySections();
    if (empty.length > 0) {
      setEmptySections(empty);
      setShowConfirmModal(true);
    } else {
      handleFinalSave();
    }
  };

  const handleFinalSave = async () => {
    setLoading(true);
    try {
      await db.meetings.add(formData);

      if (supabase) {
        await supabase.from('meetings').insert([formData]);
      }

      onSuccess();
    } catch (err) {
      console.error('Erro ao salvar reunião:', err);
      onSuccess();
    } finally {
      setLoading(false);
      setShowConfirmModal(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
      <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Nova Reunião de Partilhas</h2>
          <p className="text-xs text-slate-400">Etapa {step} de 4</p>
        </div>
        <div className="flex gap-1">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-2 w-6 rounded-full transition-colors ${
                s <= step ? 'bg-amber-500' : 'bg-slate-700'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="p-6 space-y-6">
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-md font-semibold text-slate-800 border-b pb-2 flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-600" /> Identificação e Servidores
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Data da Reunião</label>
                <input
                  type="date"
                  value={formData.meeting_date}
                  onChange={(e) => setFormData({ ...formData, meeting_date: e.target.value })}
                  className="w-full p-2.5 border rounded-lg text-sm bg-slate-50 focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Formato</label>
                <select
                  value={formData.format}
                  onChange={(e) => setFormData({ ...formData, format: e.target.value as any })}
                  className="w-full p-2.5 border rounded-lg text-sm bg-slate-50 focus:ring-2 focus:ring-amber-500 outline-none"
                >
                  <option value="presencial">Presencial</option>
                  <option value="online">Online</option>
                  <option value="hibrido">Híbrido</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Tema / Leitura Sugerida</label>
              <input
                type="text"
                placeholder="Ex: IP nº 29, Só Por Hoje, 3º Passo..."
                value={formData.theme_or_topic}
                onChange={(e) => setFormData({ ...formData, theme_or_topic: e.target.value })}
                className="w-full p-2.5 border rounded-lg text-sm bg-slate-50 focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Coordenador(a)</label>
                <input
                  type="text"
                  placeholder="Primeiro nome / apelido"
                  value={formData.servants_roles.coordenador}
                  onChange={(e) => setFormData({
                    ...formData,
                    servants_roles: { ...formData.servants_roles, coordenador: e.target.value }
                  })}
                  className="w-full p-2 border rounded-lg text-sm bg-slate-50"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Responsável pelo Café</label>
                <input
                  type="text"
                  placeholder="Primeiro nome"
                  value={formData.servants_roles.cafe}
                  onChange={(e) => setFormData({
                    ...formData,
                    servants_roles: { ...formData.servants_roles, cafe: e.target.value }
                  })}
                  className="w-full p-2 border rounded-lg text-sm bg-slate-50"
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-md font-semibold text-slate-800 border-b pb-2 flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-600" /> Participantes na Sala
            </h3>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-slate-50 p-3 rounded-lg border text-center">
                <label className="block text-xs font-medium text-slate-600 mb-1">Membros (Adictos)</label>
                <input
                  type="number"
                  min="0"
                  value={formData.members_count}
                  onChange={(e) => setFormData({ ...formData, members_count: Math.max(0, parseInt(e.target.value) || 0) })}
                  className="w-full text-center text-lg font-bold p-2 border rounded-lg bg-white"
                />
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border text-center">
                <label className="block text-xs font-medium text-slate-600 mb-1">Ingressos (1ª vez)</label>
                <input
                  type="number"
                  min="0"
                  value={formData.newcomers_count}
                  onChange={(e) => setFormData({ ...formData, newcomers_count: Math.max(0, parseInt(e.target.value) || 0) })}
                  className="w-full text-center text-lg font-bold p-2 border rounded-lg bg-white text-emerald-700"
                />
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border text-center">
                <label className="block text-xs font-medium text-slate-600 mb-1">Visitas (Família/Amigos)</label>
                <input
                  type="number"
                  min="0"
                  value={formData.visitors_count}
                  onChange={(e) => setFormData({ ...formData, visitors_count: Math.max(0, parseInt(e.target.value) || 0) })}
                  className="w-full text-center text-lg font-bold p-2 border rounded-lg bg-white text-blue-700"
                />
              </div>
            </div>

            <div className="p-3 bg-slate-900 text-white rounded-lg flex justify-between items-center text-sm font-medium">
              <span>Total de Presentes na Sala:</span>
              <span className="text-amber-400 text-lg font-bold">{totalAttendees}</span>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-md font-semibold text-slate-800 border-b pb-2 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-amber-600" /> 7ª Tradição do Dia
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Total Arrecadado (R$)</label>
                <input
                  type="number"
                  step="0.50"
                  min="0"
                  placeholder="0,00"
                  value={formData.tradition_7 || ''}
                  onChange={(e) => setFormData({ ...formData, tradition_7: parseFloat(e.target.value) || 0 })}
                  className="w-full text-lg font-semibold p-2.5 border rounded-lg bg-slate-50 focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Despesas da Sala (R$)</label>
                <input
                  type="number"
                  step="0.50"
                  min="0"
                  placeholder="0,00 (café, etc.)"
                  value={formData.expenses || ''}
                  onChange={(e) => setFormData({ ...formData, expenses: parseFloat(e.target.value) || 0 })}
                  className="w-full text-lg font-semibold p-2.5 border rounded-lg bg-slate-50 focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
            </div>

            <div className="p-3 bg-slate-100 rounded-lg text-xs text-slate-600">
              * Saldo do dia: <strong>R$ {(Number(formData.tradition_7 || 0) - Number(formData.expenses || 0)).toFixed(2)}</strong> (alimenta o livro-caixa automaticamente).
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h3 className="text-md font-semibold text-slate-800 border-b pb-2 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-600" /> Chaveiros e Recados
            </h3>

            <div className="grid grid-cols-4 gap-2">
              {[
                { label: '30 Dias', key: '30d' },
                { label: '60 Dias', key: '60d' },
                { label: '90 Dias', key: '90d' },
                { label: '6 Meses', key: '6m' },
                { label: '9 Meses', key: '9m' },
                { label: '1 Ano', key: '1a' },
                { label: '18 Meses', key: '18m' },
                { label: 'Múltiplos', key: 'multi' },
              ].map((item) => (
                <div key={item.key} className="bg-slate-50 p-2 rounded border text-center">
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">{item.label}</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.keytags[item.key as keyof KeytagsCount]}
                    onChange={(e) => setFormData({
                      ...formData,
                      keytags: {
                        ...formData.keytags,
                        [item.key]: Math.max(0, parseInt(e.target.value) || 0)
                      }
                    })}
                    className="w-full text-center font-bold p-1 border rounded bg-white"
                  />
                </div>
              ))}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Recados / Anúncios da Reunião</label>
              <textarea
                rows={3}
                placeholder="Avisos sobre eventos, oficinas ou comunicados da irmandade..."
                value={formData.meeting_notes}
                onChange={(e) => setFormData({ ...formData, meeting_notes: e.target.value })}
                className="w-full p-2.5 border rounded-lg text-sm bg-slate-50 outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
        )}

        <div className="flex justify-between items-center pt-4 border-t">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" /> Voltar
            </button>
          ) : <div />}

          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="px-5 py-2 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg flex items-center gap-1 cursor-pointer"
            >
              Avançar <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={loading}
              onClick={handlePreSubmit}
              className="px-6 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg flex items-center gap-2 shadow cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" /> {loading ? 'Salvando...' : 'Finalizar Ata'}
            </button>
          )}
        </div>
      </div>

      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <h4 className="text-base font-semibold text-slate-900">Campos não preenchidos</h4>
            <p className="text-sm text-slate-600">
              As seguintes seções estão em branco:
            </p>
            <ul className="text-sm list-disc list-inside text-amber-700 bg-amber-50 p-3 rounded-lg space-y-1">
              {emptySections.map((sec, idx) => (
                <li key={idx}><strong>{sec}</strong></li>
              ))}
            </ul>
            <p className="text-xs text-slate-500">
              Em NA nenhum campo é obrigatório. Você pode finalizar agora ou voltar para preencher.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
              >
                Voltar e preencher
              </button>
              <button
                type="button"
                onClick={handleFinalSave}
                className="px-4 py-2 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg cursor-pointer"
              >
                Finalizar mesmo assim
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

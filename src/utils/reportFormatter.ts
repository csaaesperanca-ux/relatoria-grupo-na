import type { Meeting } from '../types';

export function formatMeetingForWhatsApp(meeting: Meeting, groupName: string = 'Grupo de NA'): string {
  const totalPresentes = 
    Number(meeting.members_count || 0) + 
    Number(meeting.newcomers_count || 0) + 
    Number(meeting.visitors_count || 0);

  const saldoDia = (Number(meeting.tradition_7 || 0) - Number(meeting.expenses || 0)).toFixed(2);

  const keytagsMap: Record<string, string> = {
    '30d': '30 Dias',
    '60d': '60 Dias',
    '90d': '90 Dias',
    '6m': '6 Meses',
    '9m': '9 Meses',
    '1a': '1 Ano',
    '18m': '18 Meses',
    'multi': 'Múltiplos Anos',
  };

  const chaveirosEntregues = Object.entries(meeting.keytags || {})
    .filter(([_, qty]) => Number(qty) > 0)
    .map(([key, qty]) => `  • ${keytagsMap[key] || key}: ${qty}`)
    .join('\n');

  let text = `📋 *ATA RESUMIDA DE REUNIÃO - NA*\n`;
  text += `🏛️ *Grupo:* ${groupName}\n`;
  text += `📅 *Data:* ${meeting.meeting_date} (${meeting.format.toUpperCase()})\n`;
  if (meeting.theme_or_topic) {
    text += `📖 *Tema/Leitura:* ${meeting.theme_or_topic}\n`;
  }
  text += `\n👥 *PRESENÇA NA SALA:*\n`;
  text += `  • Membros adictos: ${meeting.members_count || 0}\n`;
  text += `  • Ingressos (1ª vez): ${meeting.newcomers_count || 0}\n`;
  text += `  • Visitas: ${meeting.visitors_count || 0}\n`;
  text += `  • *Total Geral:* ${totalPresentes}\n`;

  text += `\n💰 *7ª TRADIÇÃO & FINANÇAS:*\n`;
  text += `  • Arrecadação: R$ ${Number(meeting.tradition_7 || 0).toFixed(2)}\n`;
  text += `  • Despesas: R$ ${Number(meeting.expenses || 0).toFixed(2)}\n`;
  text += `  • *Saldo do Dia:* R$ ${saldoDia}\n`;

  if (chaveirosEntregues) {
    text += `\n🏅 *CHAVEIROS COMEMORADOS:*\n${chaveirosEntregues}\n`;
  }

  const servidores = Object.entries(meeting.servants_roles || {})
    .filter(([_, name]) => Boolean(name))
    .map(([role, name]) => `  • ${role.charAt(0).toUpperCase() + role.slice(1)}: ${name}`)
    .join('\n');

  if (servidores) {
    text += `\n🤝 *SERVIDORES DA REUNIÃO:*\n${servidores}\n`;
  }

  if (meeting.meeting_notes) {
    text += `\n📌 *RECADOS / OBSERVAÇÕES:*\n${meeting.meeting_notes}\n`;
  }

  text += `\n_“A gratidão em ação não tem fronteiras.”_`;
  return text;
}

export type MeetingType = 'partilha' | 'servico';
export type MeetingFormat = 'presencial' | 'online' | 'hibrido';

export interface Group {
  id: string;
  slug: string;
  name: string;
  csa_name: string;
  address?: string;
  email?: string;
}

export interface TrustedServant {
  id?: string;
  group_id: string;
  role: string;
  first_name: string;
  phone?: string;
  term_end?: string;
}

export interface KeytagsCount {
  '30d': number;
  '60d': number;
  '90d': number;
  '6m': number;
  '9m': number;
  '1a': number;
  '18m': number;
  'multi': number;
}

export interface Meeting {
  id?: number;
  group_id: string;
  meeting_date: string;
  meeting_type: MeetingType;
  format: MeetingFormat;
  theme_or_topic?: string;
  members_count: number;
  newcomers_count: number;
  visitors_count: number;
  tradition_7: number;
  expenses: number;
  keytags: KeytagsCount;
  servants_roles: Record<string, string>;
  meeting_notes?: string;
  motions?: Array<{
    number: string;
    description: string;
    decision: 'Aprovada' | 'Aprovada com ressalva' | 'Reprovada' | 'Abstenção';
  }>;
}

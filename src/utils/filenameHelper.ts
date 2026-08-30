export type DocumentType = 
  | 'AtaPartilha' 
  | 'AtaServico' 
  | 'RelatorioGrupo' 
  | 'RelatorioRSG' 
  | 'RelatorioTesouraria';

interface FilenameParams {
  groupName: string;
  docType: DocumentType;
  period: string;
  suffix?: string;
  extension?: 'pdf' | 'docx';
}

export function generateDocFilename({
  groupName,
  docType,
  period,
  suffix,
  extension = 'pdf'
}: FilenameParams): string {
  const groupSlug = groupName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');

  const suffixPart = suffix ? `_${suffix}` : '';
  return `NA_${groupSlug}_${docType}_${period}${suffixPart}.${extension}`;
}

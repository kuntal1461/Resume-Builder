const DEFAULT_TOKENS = {
  candidate: 'Elena Kapoor',
  role: 'LLM Operations Lead',
  workspace: 'Velocity Pod · SF',
};

const sanitizeLine = (value: string): string => {
  return value.replace(/[^\x20-\x7E]/g, ' ').replace(/\s+/g, ' ').trim();
};

const buildExcerpt = (latex: string): string => {
  const documentStart = latex.indexOf('\\begin{document}');
  const documentEnd = latex.indexOf('\\end{document}');
  const body =
    documentStart >= 0
      ? latex.slice(documentStart + '\\begin{document}'.length, documentEnd >= 0 ? documentEnd : undefined)
      : latex;

  return (
    body
      .replace(/%.*/g, ' ')
      .replace(/\\definecolor\{[^}]+}\{[^}]+}\{[^}]+}/g, ' ')
      .replace(/\bHTML\s+[0-9A-Fa-f]{4,}\b/g, ' ')
      .replace(/\\[a-zA-Z]+\*?(?:\[[^\]]*])?(?:\{[^}]*})?/g, ' ')
      .replace(/[{}]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim() || 'No LaTeX content provided.'
  );
};

const escapePdfText = (text: string): string => {
  return text.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
};

const encodePdfBase64 = (pdf: string): string => {
  if (typeof window !== 'undefined' && typeof window.btoa === 'function') {
    return window.btoa(unescape(encodeURIComponent(pdf)));
  }
  return '';
};

type PreviewTokens = {
  candidate?: string;
  role?: string;
  workspace?: string;
};

export const generateLocalPreview = (latexSource: string, tokens?: PreviewTokens) => {
  const hydratedTokens = {
    candidate: tokens?.candidate ?? DEFAULT_TOKENS.candidate,
    role: tokens?.role ?? DEFAULT_TOKENS.role,
    workspace: tokens?.workspace ?? DEFAULT_TOKENS.workspace,
  };

  const rawExcerpt = buildExcerpt(latexSource);
  const excerpt = sanitizeLine(rawExcerpt).slice(0, 240);

  const lines = [
    'Resume preview rendered',
    `Candidate: ${sanitizeLine(hydratedTokens.candidate)}`,
    `Role: ${sanitizeLine(hydratedTokens.role)}`,
    `Workspace: ${sanitizeLine(hydratedTokens.workspace)}`,
    `Excerpt: ${excerpt}${excerpt.length >= 240 ? '…' : ''}`,
  ];

  const textOps = lines
    .map((line, index) => `${index === 0 ? '' : '0 -22 Td\n'}(${escapePdfText(line)}) Tj`)
    .join('\n');

  const content = `BT\n/F1 14 Tf\n100 740 Td\n${textOps}\nET\n`;
  const objects = [
    '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n',
    '2 0 obj\n<< /Type /Pages /Count 1 /Kids [3 0 R] >>\nendobj\n',
    '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n',
    `4 0 obj\n<< /Length ${content.length} >>\nstream\n${content}endstream\nendobj\n`,
    '5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n',
  ];

  let pdf = '%PDF-1.4\n';
  const offsets: number[] = [];
  for (const obj of objects) {
    offsets.push(pdf.length);
    pdf += obj;
  }

  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += '0000000000 65535 f \n';
  for (const offset of offsets) {
    pdf += `${offset.toString().padStart(10, '0')} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return {
    pdfDataUrl: `data:application/pdf;base64,${encodePdfBase64(pdf)}`,
    excerpt,
    tokens: hydratedTokens,
  };
};

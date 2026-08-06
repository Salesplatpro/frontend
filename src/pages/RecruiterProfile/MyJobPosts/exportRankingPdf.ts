import type { SingleJobDetails } from '@/utils/recruiterJobPostsTypes'

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

const VERDICT_LABELS: Record<string, string> = {
  high: 'Strong',
  medium: 'Good',
  low: 'Weak',
}

export type RankingExportMode = 'top' | 'lowest'

export const selectRankedApplicants = (
  applications: SingleJobDetails[],
  mode: RankingExportMode,
  count: number,
): SingleJobDetails[] => {
  const ranked = applications
    .filter((app) => app.rank != null)
    .sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0))

  if (ranked.length === 0 || count <= 0) return []

  if (mode === 'top') {
    return ranked.slice(0, count)
  }

  return ranked.slice(Math.max(ranked.length - count, 0)).reverse()
}

export const exportRankingPdf = ({
  jobName,
  mode,
  count,
  applicants,
}: {
  jobName: string
  mode: RankingExportMode
  count: number
  applicants: SingleJobDetails[]
}) => {
  const title =
    mode === 'top'
      ? `Top ${count} ranked applicants`
      : `Lowest ${count} ranked applicants`

  const rows = applicants
    .map((app, index) => {
      const name = `${app.talent.firstName} ${app.talent.lastName}`.trim()
      const reasoning =
        app.matchVerdictReasoning?.trim() ||
        'No AI ranking rationale is stored for this applicant.'
      const strengths = (app.matchStrengths ?? []).filter(Boolean)
      const verdict = app.matchVerdict
        ? VERDICT_LABELS[app.matchVerdict] ?? app.matchVerdict
        : 'N/A'

      return `
        <article class="card">
          <h2>${index + 1}. ${escapeHtml(name || 'Applicant')}</h2>
          <p><strong>Email:</strong> ${escapeHtml(app.talent.email || '—')}</p>
          <p><strong>Rank:</strong> #${app.rank ?? '—'}</p>
          <p><strong>AI Match:</strong> ${escapeHtml(verdict)}</p>
          <p><strong>Average score:</strong> ${
            app.averageScore != null ? `${app.averageScore}%` : '—'
          }</p>
          <p><strong>Status:</strong> ${escapeHtml(app.status || '—')}</p>
          <h3>AI reasoning for ranking</h3>
          <p>${escapeHtml(reasoning)}</p>
          ${
            strengths.length
              ? `<h3>Evidence of fit</h3><ul>${strengths
                  .map((item) => `<li>${escapeHtml(item)}</li>`)
                  .join('')}</ul>`
              : ''
          }
        </article>
      `
    })
    .join('')

  const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>${escapeHtml(title)} — ${escapeHtml(jobName || 'Job')}</title>
    <style>
      body { font-family: Georgia, "Times New Roman", serif; color: #111; margin: 32px; }
      h1 { font-size: 22px; margin-bottom: 4px; }
      .meta { color: #555; margin-bottom: 24px; }
      .card { border-top: 1px solid #ddd; padding: 16px 0; page-break-inside: avoid; }
      h2 { font-size: 16px; margin: 0 0 8px; }
      h3 { font-size: 13px; margin: 12px 0 4px; }
      p, li { font-size: 12px; line-height: 1.45; margin: 4px 0; }
      ul { margin: 4px 0 0 18px; padding: 0; }
      @media print {
        body { margin: 16px; }
      }
    </style>
  </head>
  <body>
    <h1>${escapeHtml(title)}</h1>
    <p class="meta">${escapeHtml(
      jobName || 'Job',
    )} · Generated ${new Date().toLocaleString()}</p>
    ${rows || '<p>No ranked applicants matched the selected range.</p>'}
    <script>
      window.onload = function () {
        window.focus();
        window.print();
      };
    </script>
  </body>
</html>`

  const printWindow = window.open('', '_blank', 'noopener,noreferrer')
  if (!printWindow) {
    throw new Error(
      'Unable to open print window. Please allow pop-ups and try again.',
    )
  }
  printWindow.document.open()
  printWindow.document.write(html)
  printWindow.document.close()
}

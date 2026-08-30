import type { SingleJobDetails } from '@/utils/recruiterJobPostsTypes'

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

const openPrintHtml = (html: string) => {
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

  openPrintHtml(html)
}

const HERO_LABELS: Record<string, string> = {
  high: 'Strong Fit — Hire / Shortlist',
  medium: 'Potential Fit — Review',
  low: 'Poor Fit — Bounce / Reject',
}

const HERO_COLORS: Record<string, string> = {
  high: '#1b7b44',
  medium: '#c17600',
  low: '#af0303',
}

const listHtml = (items?: string[] | null) => {
  const cleaned = items?.filter(Boolean) ?? []
  if (cleaned.length === 0) return '<p class="muted">None recorded</p>'
  return `<ul>${cleaned
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join('')}</ul>`
}

export const exportBoardReport = ({
  recruiterName,
  jobTitle,
  companyName,
  companyLogoUrl,
  applicants,
  totalApplicants,
  scopeLabel,
}: {
  recruiterName: string
  jobTitle: string
  companyName: string
  companyLogoUrl?: string | null
  applicants: SingleJobDetails[]
  totalApplicants: number
  scopeLabel: string
}) => {
  const reportDate = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const pages = applicants
    .map((app) => {
      const name = `${app.talent.firstName} ${app.talent.lastName}`.trim()
      const analysis = app.matchAnalysis
      const bar = HERO_COLORS[app.matchVerdict ?? ''] ?? '#6b7280'
      const hero = app.matchVerdict
        ? HERO_LABELS[app.matchVerdict] ?? app.matchVerdict
        : 'No recommendation yet'
      const location = [
        app.talent.locationCity,
        app.talent.locationState,
        app.talent.locationCountry,
      ]
        .filter(Boolean)
        .join(', ')

      return `
        <article class="page">
          <div class="bar" style="background:${bar}"></div>
          <h2>${escapeHtml(name || 'Applicant')}</h2>
          <p class="meta">${escapeHtml(app.talent.email || '—')}
            ${location ? ` · ${escapeHtml(location)}` : ''}
            ${
              app.talent.experience
                ? ` · ${escapeHtml(app.talent.experience)}`
                : ''
            }</p>
          <p><strong>Status:</strong> ${escapeHtml(app.status || '—')}
            · <strong>Stage:</strong> ${escapeHtml(app.currentStage || '—')}
            · <strong>Applied:</strong> ${escapeHtml(
              new Date(app.createdAt).toLocaleDateString(),
            )}</p>
          <h3>${escapeHtml(hero)}</h3>
          <p><strong>Overall fit score:</strong> ${
            analysis?.overallFitScore != null
              ? `${analysis.overallFitScore}/100`
              : app.averageScore != null
              ? `${app.averageScore}% avg`
              : '—'
          }</p>
          <h4>Hiring rationale</h4>
          <p>${escapeHtml(
            analysis?.hiringRationale ||
              app.matchVerdictReasoning ||
              'Not generated yet.',
          )}</p>
          <h4>Why fit</h4>
          <p>${escapeHtml(
            analysis?.whyFit || app.matchVerdictReasoning || '—',
          )}</p>
          <h4>Why hire</h4>
          <p>${escapeHtml(analysis?.whyHire || '—')}</p>
          <h4>Scores</h4>
          <p>Prescreen ${app.talent.prescreeningScore ?? '—'}%
            · CV ${app.cvSimilarityScore ?? '—'}%
            · Personalized ${app.personalizedScore ?? '—'}%
            · Personality ${escapeHtml(app.mbtiType || '—')}</p>
          <h4>Evidence</h4>
          ${listHtml(analysis?.keyEvidence ?? app.matchStrengths)}
          <h4>Gaps</h4>
          ${listHtml(analysis?.missingRequirements ?? app.matchWeaknesses)}
          <h4>Risks</h4>
          ${listHtml(app.matchRisks)}
        </article>
      `
    })
    .join('')

  const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Hiring report — ${escapeHtml(jobTitle)}</title>
    <style>
      body { font-family: "Source Serif 4", Georgia, serif; color: #111; margin: 0; }
      .cover, .page { padding: 48px 56px; page-break-after: always; }
      .cover { min-height: 100vh; }
      .logo { height: 48px; margin-bottom: 24px; }
      h1 { font-size: 28px; margin: 0 0 8px; }
      h2 { font-size: 20px; margin: 12px 0 4px; }
      h3 { font-size: 16px; margin: 16px 0 4px; }
      h4 { font-size: 13px; margin: 14px 0 4px; letter-spacing: 0.02em; text-transform: uppercase; }
      p, li { font-size: 12px; line-height: 1.5; }
      .muted { color: #6b7280; font-style: italic; }
      .bar { height: 8px; margin: 0 -56px 16px; }
      .footer { position: running(footer); font-size: 10px; color: #6b7280; }
      @page { margin: 16mm 16mm 20mm; @bottom-center { content: "Confidential · Page " counter(page); font-size: 10px; color: #6b7280; } }
      @media print { .cover, .page { page-break-after: always; } }
    </style>
  </head>
  <body>
    <section class="cover">
      ${
        companyLogoUrl
          ? `<img class="logo" src="${escapeHtml(companyLogoUrl)}" alt="" />`
          : ''
      }
      <p class="meta">Confidential hiring report</p>
      <h1>${escapeHtml(jobTitle || 'Job')}</h1>
      <p>${escapeHtml(companyName || 'Company')}</p>
      <p>Prepared by ${escapeHtml(recruiterName || 'Recruiter')}</p>
      <p>${escapeHtml(reportDate)}</p>
      <p>${escapeHtml(scopeLabel)} · ${
    applicants.length
  } of ${totalApplicants} applicants</p>
    </section>
    ${pages || '<p>No applicants in this report.</p>'}
    <script>
      window.onload = function () {
        window.focus();
        window.print();
      };
    </script>
  </body>
</html>`

  openPrintHtml(html)
}

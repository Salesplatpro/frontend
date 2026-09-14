export interface DashboardStats {
  campaignCount?: number
  completedCampaigns?: number
  completionRatio?: number
  applicationsCount?: number
  shortlistCount?: number
  applicationHeatmap?: Array<{ date: string; count: number }>
}

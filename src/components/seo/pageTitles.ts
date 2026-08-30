const EXACT_TITLES: Record<string, string> = {
  '/': 'Auxhr',
  '/explore': 'Explore',
  '/solution': 'Solution',
  '/features': 'Features',
  '/resources': 'Resources',
  '/customerstories': 'Customer Stories',
  '/pricing': 'Pricing',
  '/about-us': 'About Us',
  '/payment/verify': 'Payment Verification',
  '/login': 'Login',
  '/register': 'Register',
  '/faq': 'FAQ',
  '/testimonials': 'Testimonials',
  '/job': 'Job',
  '/privacy-policy': 'Privacy Policy',
  '/terms-and-conditions': 'Terms and Conditions',
  '/talentDashboard': 'Dashboard',
  '/talentDashboard/talentProfile': 'Profile',
  '/talentDashboard/talentQuiz': 'Pre-Assessment',
  '/talentDashboard/job': 'Jobs',
  '/talentDashboard/support': 'Support',
  '/talentDashboard/Chat': 'Chat',
  '/talentDashboard/Notification': 'Notifications',
  '/talentDashboard/applicationPipeline': 'Application Pipeline',
  '/recruiterDashboard/dashboard': 'Dashboard',
  '/recruiterDashboard/dashboard/allapplications': 'All Applications',
  '/recruiterDashboard/postjob': 'Post Job',
  '/recruiterDashboard/myJobPosts': 'My Job Posts',
  '/recruiterDashboard/scout': 'Scout',
  '/recruiterDashboard/talent-search': 'Talent Search',
  '/recruiterDashboard/talent-search/results': 'Search Results',
  '/recruiterDashboard/scout/create-jd': 'Create Job Description',
  '/recruiterDashboard/shortlist': 'Shortlist',
  '/recruiterDashboard/chat': 'Chat',
  '/recruiterDashboard/profile': 'Profile',
  '/recruiterDashboard/plan': 'Plan',
  '/adminDashboard': 'Talents',
  '/adminDashboard/talents': 'Talents',
  '/adminDashboard/recruiters': 'Recruiters',
  '/adminDashboard/jobs': 'Jobs',
  '/adminDashboard/viewcandidates': 'View Candidates',
  '/adminDashboard/roles': 'Roles',
  '/adminDashboard/feedback': 'Feedback',
}

const PATTERN_TITLES: Array<{ pattern: RegExp; title: string }> = [
  { pattern: /^\/view-cv\//, title: 'Candidate CV' },
  { pattern: /^\/job\/postedjob\//, title: 'Job' },
  { pattern: /^\/talentDashboard\/job\//, title: 'Job' },
  {
    pattern: /^\/talentDashboard\/applicationPipeline\/personalizedTest\//,
    title: 'Personalized Test',
  },
  {
    pattern: /^\/talentDashboard\/applicationPipeline\/personalityTest\//,
    title: 'Personality Test',
  },
  {
    pattern: /^\/talentDashboard\/applicationPipeline\//,
    title: 'Application Progress',
  },
  {
    pattern: /^\/recruiterDashboard\/scout\/history\//,
    title: 'Scout History',
  },
  { pattern: /^\/recruiterDashboard\/scout\/upload-cv\//, title: 'Upload CV' },
  {
    pattern: /^\/recruiterDashboard\/scout\/process-cv\//,
    title: 'Process CV',
  },
  { pattern: /^\/recruiterDashboard\/scout\//, title: 'Scout' },
  { pattern: /^\/recruiterDashboard\/singleJobPost\//, title: 'Job Post' },
  { pattern: /^\/recruiterDashboard\/postjob\//, title: 'Post Job' },
  { pattern: /^\/recruiterDashboard\/editJob\//, title: 'Edit Job' },
  { pattern: /^\/recruiterDashboard\/jobdetail\//, title: 'Job Detail' },
]

const humanizeSegment = (segment: string): string =>
  segment
    .replace(/[-_]+/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .trim()

export const getDocumentTitle = (pathname: string): string => {
  const normalized = pathname.replace(/\/+$/, '') || '/'

  if (EXACT_TITLES[normalized]) {
    return EXACT_TITLES[normalized]
  }

  for (const { pattern, title } of PATTERN_TITLES) {
    if (pattern.test(normalized)) {
      return title
    }
  }

  const segments = normalized.split('/').filter(Boolean)
  const lastSegment = segments[segments.length - 1]

  if (!lastSegment || /^[0-9a-f-]{8,}$/i.test(lastSegment)) {
    const parent = segments[segments.length - 2]
    return parent ? humanizeSegment(parent) : 'Auxhr'
  }

  return humanizeSegment(lastSegment)
}

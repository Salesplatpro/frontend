export interface PricingDatas {
  plan: string
  price: string
  priceSpan: string
  jobListing: string
  featuresTitle: string
  featuresText: string
  featuresData: string[]
}

export const PricingData: PricingDatas[] = [
  {
    plan: 'Basic Plan',
    price: 'Free',
    priceSpan: 'Trail',
    jobListing: 'Basic features free for 7 Days',
    featuresTitle: 'FEATURES',
    featuresText: 'Everything in our free plan plus....',
    featuresData: [
      '1 Job Listing',
      'Create JD with AI',
      'Set Preferred Test',
      'Access 25 Candidates',
      'Job Pipeline',
      'In-app Message',
    ],
  },

  {
    plan: 'Pay per Use Plan',
    price: '$50',
    priceSpan: '#75,0000',
    jobListing: '5 Job Listings',
    featuresTitle: 'FEATURES',
    featuresText: 'Everything in Pay per Use plus....',
    featuresData: [
      'Pay per Job Listing',
      'Create JD with AI',
      'Test Candidates',
      'Access 100 candidates per role',
      'Set Preferred Test or Use AI',
      'Job Pipeline',
      'In-app Message',
    ],
  },

  {
    plan: 'Pro plan',
    price: '$195',
    priceSpan: '#300,0000',
    jobListing: '10 Job Listings',
    featuresTitle: 'FEATURES',
    featuresText: 'Everything in Business plus....',
    featuresData: [
      '5 Job Listings',
      'Create JD with AI',
      'Test Candidates',
      'Access 120 candidates per role',
      'Set Preferred Test or Use AI',
      'Job Pipeline',
      'In-app Message',
    ],
  },

  {
    plan: 'Advance Plan',
    price: '$325',
    priceSpan: '#500,0000',
    jobListing: 'Pay per Job Listing',
    featuresTitle: 'FEATURES',
    featuresText: 'Everything in Business plus....',
    featuresData: [
      '10 Job Listings',
      'Create JD with AI',
      'Test Candidates',
      'Access 140 candidates per role',
      'Set Preferred Test or Use AI',
      'Job Pipeline',
      'In-app Message',
    ],
  },
]

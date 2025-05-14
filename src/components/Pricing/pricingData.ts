export interface PlanDetails {
  price: string
  priceSpan: string
  jobListing: string
  featuresTitle: string
  featuresText: string
  featuresData: string[]
}

export interface PricingDatas {
  plan: string
  monthly: PlanDetails
  annually: PlanDetails
}

export const PricingData: PricingDatas[] = [
  // {
  //   plan: 'Basic Plan',
  //   monthly: {
  //     price: 'Free',
  //     priceSpan: 'Trial',
  //     jobListing: 'Basic features free for 7 Days',
  //     featuresTitle: 'FEATURES',
  //     featuresText: 'Everything in our free plan plus....',
  //     featuresData: [
  //       '1 Job Listing',
  //       'Create JD with AI',
  //       'Set Preferred Test',
  //       'Access 25 Candidates',
  //       'Job Pipeline',
  //       'In-app Message',
  //     ],
  //   },
  //   annually: {
  //     price: 'Free',
  //     priceSpan: 'Trial',
  //     jobListing: 'Basic features free for 7 Days',
  //     featuresTitle: 'FEATURES',
  //     featuresText: 'Everything in our free plan plus....',
  //     featuresData: [
  //       '1 Job Listing',
  //       'Create JD with AI',
  //       'Set Preferred Test',
  //       'Access 25 Candidates',
  //       'Job Pipeline',
  //       'In-app Message',
  //     ],
  //   },
  // },
  {
    plan: 'SME(Basic) Plan',
    monthly: {
      price: '$98',
      priceSpan: '#150,000',
      jobListing: 'SME (Basic) Plan',
      featuresTitle: 'FEATURES',
      featuresText: 'Everything in SME (Basic) plan...',
      featuresData: [
        '2 Job Listings',
        'Create JD with AI',
        'Access 100 candidates per role',
        'Set Preferred Questions or Use AI',
        'Job Pipeline',
        'In-app Message',
      ],
    },
    annually: {
      price: '$75',
      priceSpan: '#120,000',
      jobListing: '5 Job Listings',
      featuresTitle: 'FEATURES',
      featuresText: 'Everything in Pay per Use plus....',
      featuresData: [
        '2 Job Listings',
        'Create JD with AI',
        'Access 100 candidates per role',
        'Set Preferred Questions or Use AI',
        'Job Pipeline',
        'In-app Message',
      ],
    },
  },
  {
    plan: 'Growth plan',
    monthly: {
      price: '$195',
      priceSpan: '#300,0000',
      jobListing: '10 Job Listings',
      featuresTitle: 'FEATURES',
      featuresText: 'Everything in Growth plan....',
      featuresData: [
        'up to 8 job listings',
        'all Basic Plan Features',
        'Distribute to other Job Boards',
        '⁠Dedicated Support',
        'Advanced Reporting',
      ],
    },
    annually: {
      price: '$325',
      priceSpan: '#500,0000',
      jobListing: 'Growth Plan',
      featuresTitle: 'FEATURES',
      featuresText: 'Everything in Growth plan....',
      featuresData: [
        'up to 8 job listings',
        'all Basic Plan Features',
        'Distribute to other Job Boards',
        '⁠Dedicated Support',
        'Advanced Reporting',
      ],
    },
  },
  {
    plan: 'Enterprise plan',
    monthly: {
      price: '$645',
      priceSpan: '#1,000,0000',
      jobListing: 'Enterprise plan',
      featuresTitle: 'FEATURES',
      featuresText: 'Everything in Enterprise plan....',
      featuresData: [
        'All Growth Plan Features',
        'Unlimited Job Listing',
        'Distribute to other Job Boards',
        'Dedicated Support',
        '1 HR Assistant',
        'Advanced Reporting (Coming Soon)',
        '⁠Future Integrations (Coming Soon)',
      ],
    },
    annually: {
      price: '$325',
      priceSpan: '#500,0000',
      jobListing: 'Pay per Job Listing',
      featuresTitle: 'FEATURES',
      featuresText: 'Everything in Enterprise plan....',
      featuresData: [
        'All Growth Plan Features',
        'Unlimited Job Listing',
        'Distribute to other Job Boards',
        'Dedicated Support',
        '1 HR Assistant',
        'Advanced Reporting (Coming Soon)',
        '⁠Future Integrations (Coming Soon)',
      ],
    },
  },
]

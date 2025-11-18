/**
 * Dropshipping Business Launcher Checklist Data
 * Contains all 21 steps with descriptions, MCQs, dependencies, and resources
 */

export interface ChecklistStep {
  stepNumber: number;
  section: string;
  title: string;
  description: string;
  checklistActions: string[];
  dependencies: number[];
  resources: Array<{ title: string; url: string; type: string }>;
  mcq?: {
    question: string;
    options: string[];
    correctAnswer: string; // 'a', 'b', 'c', or 'd'
    feedback: {
      correct: string;
      incorrect: string;
      explanation: string;
    };
  };
}

export const DROPSHIPPING_CHECKLIST: ChecklistStep[] = [
  // Section A: Ideation & Validating the Opportunity
  {
    stepNumber: 1,
    section: 'Ideation & Validating the Opportunity',
    title: "Define Your 'Why' & Business Goals",
    description: 'Articulate your motivation, target income, and available time each week. This foundation guides all future decisions.',
    checklistActions: [
      'Fill in business goals',
      'Set target income',
      'Define available hours per week',
      'Save motivation statement'
    ],
    dependencies: [],
    resources: [
      { title: 'Business Goal Template', url: '/resources/business-goals-template.pdf', type: 'pdf' },
      { title: 'Time Management Guide', url: '/resources/time-management', type: 'article' }
    ]
  },
  {
    stepNumber: 2,
    section: 'Ideation & Validating the Opportunity',
    title: 'Product Niche Selection',
    description: 'Research evergreen and trending niches, align with market demand and personal interest.',
    checklistActions: [
      'Use niche brainstorming tool',
      'Select & save 3 possible product ideas',
      'Research market demand',
      'Check personal interest alignment'
    ],
    dependencies: [1],
    resources: [
      { title: 'Niche Research Tool', url: '/tools/niche-research', type: 'tool' },
      { title: 'Trending Niches Report', url: '/resources/trending-niches', type: 'article' }
    ],
    mcq: {
      question: 'Which is a warning sign that a niche may be saturated?',
      options: [
        'Many suppliers, few customer reviews',
        'Few competitors, high ad spend',
        'Many stores with identical products and low pricing',
        'Niche includes branded/patented products'
      ],
      correctAnswer: 'c',
      feedback: {
        correct: 'Correct! Saturation is indicated by many identical stores with low pricing, showing intense competition.',
        incorrect: 'Not quite. While many stores with identical products and low pricing indicates saturation, other factors like supplier availability can be positive.',
        explanation: 'A saturated niche shows many competitors with similar products and price wars. Look for niches with moderate competition and room for differentiation.'
      }
    }
  },
  {
    stepNumber: 3,
    section: 'Ideation & Validating the Opportunity',
    title: 'Initial Market Validation',
    description: 'Quick validation using Google Trends, competitors, pain point forums, and demand estimators.',
    checklistActions: [
      'Check Google Trends',
      'Scan competitors',
      'Review pain point forums',
      'Use demand estimator tool',
      'Save validation notes'
    ],
    dependencies: [2],
    resources: [
      { title: 'Google Trends', url: 'https://trends.google.com', type: 'external' },
      { title: 'Competitor Analysis Template', url: '/resources/competitor-analysis', type: 'template' }
    ]
  },

  // Section B: Legal, Admin & Brand Foundation
  {
    stepNumber: 4,
    section: 'Legal, Admin & Brand Foundation',
    title: 'Register Your Business',
    description: 'Decide entity type: sole proprietorship, LLC/OPC, etc. (by country). Complete compliance essentials.',
    checklistActions: [
      'Select entity type',
      'Review filing guides',
      'Complete registration',
      'Upload compliance confirmation'
    ],
    dependencies: [3],
    resources: [
      { title: 'Entity Type Guide', url: '/resources/entity-types', type: 'guide' },
      { title: 'Filing Portal Links', url: '/resources/filing-portals', type: 'links' }
    ],
    mcq: {
      question: 'If you launch without trademarking your store name, biggest risk is?',
      options: [
        'Lower ad spend',
        "Can't open a PayPal account",
        'Forced rebrand if someone else claims it',
        "Customers don't trust logos"
      ],
      correctAnswer: 'c',
      feedback: {
        correct: 'Correct! Without trademark protection, you risk being forced to rebrand if someone else claims the name.',
        incorrect: 'The biggest risk is forced rebranding. While payment processors may require verification, trademark issues are more critical.',
        explanation: 'Trademark protection prevents others from using your name and protects you from costly rebranding later.'
      }
    }
  },
  {
    stepNumber: 5,
    section: 'Legal, Admin & Brand Foundation',
    title: 'Get Trademark & IP Basics',
    description: 'Why and when to trademark: logo, store name (risk of legal disputes).',
    checklistActions: [
      'Save preliminary name and logo',
      'Check trademark availability',
      'Initiate trademark filing',
      'Mark "Files submitted"'
    ],
    dependencies: [4],
    resources: [
      { title: 'Trademark Search Tool', url: '/tools/trademark-search', type: 'tool' },
      { title: 'IP Basics Guide', url: '/resources/ip-basics', type: 'guide' }
    ]
  },
  {
    stepNumber: 6,
    section: 'Legal, Admin & Brand Foundation',
    title: 'Open Bank Account & Payments',
    description: 'Set up bank account and payment processor (Stripe, Razorpay, etc.).',
    checklistActions: [
      'Complete bank account setup',
      'Configure payment processor',
      'Run live payment test',
      'Verify payment flow'
    ],
    dependencies: [4],
    resources: [
      { title: 'Payment Processor Comparison', url: '/resources/payment-processors', type: 'article' },
      { title: 'Bank Setup Checklist', url: '/resources/bank-setup', type: 'checklist' }
    ]
  },

  // Section C: Product Sourcing & Supplier Selection
  {
    stepNumber: 7,
    section: 'Product Sourcing & Supplier Selection',
    title: 'Supplier Platform Research',
    description: 'Main sources: AliExpress, IndiaMART, Oberlo, local B2B platforms.',
    checklistActions: [
      'Research supplier platforms',
      'Save top 3 suppliers per product',
      'Document sample product orders',
      'Compare supplier terms'
    ],
    dependencies: [3],
    resources: [
      { title: 'Supplier Platform Guide', url: '/resources/supplier-platforms', type: 'guide' },
      { title: 'Supplier Evaluation Template', url: '/resources/supplier-evaluation', type: 'template' }
    ]
  },
  {
    stepNumber: 8,
    section: 'Product Sourcing & Supplier Selection',
    title: 'Place Test Orders & Analyze Samples',
    description: 'Evaluate quality, shipping speed, and communication from suppliers.',
    checklistActions: [
      'Place test orders',
      'Receive and evaluate samples',
      'Enter product sample feedback',
      'Rate supplier communication'
    ],
    dependencies: [7],
    resources: [
      { title: 'Sample Evaluation Checklist', url: '/resources/sample-evaluation', type: 'checklist' },
      { title: 'Quality Standards Guide', url: '/resources/quality-standards', type: 'guide' }
    ],
    mcq: {
      question: 'A supplier offers fast shipping but won\'t offer returns. Choose the best practice.',
      options: [
        'Proceed anyway for speed',
        'Find another supplier or set return policies accordingly',
        'Raise prices instead',
        'Hide shipping policy from customers'
      ],
      correctAnswer: 'b',
      feedback: {
        correct: 'Correct! Returns are essential for customer trust. Either find a supplier who offers returns or set up your own return policy.',
        incorrect: 'Returns are critical for customer satisfaction. Never hide policies or proceed without return options.',
        explanation: 'Returns are a standard e-commerce expectation. Work with suppliers who support returns or establish your own return process.'
      }
    }
  },
  {
    stepNumber: 9,
    section: 'Product Sourcing & Supplier Selection',
    title: 'Pricing & Cost Simulator',
    description: 'Use pricing calculator with fees, taxes, shipping, returns, and CAC (Customer Acquisition Cost).',
    checklistActions: [
      'Use pricing calculator tool',
      'Calculate all costs (fees, taxes, shipping)',
      'Factor in returns and CAC',
      'Save target profit percentage'
    ],
    dependencies: [8],
    resources: [
      { title: 'Pricing Calculator', url: '/tools/pricing-calculator', type: 'tool' },
      { title: 'Profit Margin Guide', url: '/resources/profit-margins', type: 'guide' }
    ]
  },

  // Section D: Store Setup & Branding
  {
    stepNumber: 10,
    section: 'Store Setup & Branding',
    title: 'Choose Platform',
    description: 'Shopify, WooCommerce, Dukaan, etc. Compare pros and cons.',
    checklistActions: [
      'Compare platform options',
      'Select platform',
      'Mark selected platform',
      'Open setup wizard'
    ],
    dependencies: [6],
    resources: [
      { title: 'Platform Comparison', url: '/resources/platform-comparison', type: 'article' },
      { title: 'Platform Setup Guides', url: '/resources/platform-setup', type: 'guides' }
    ]
  },
  {
    stepNumber: 11,
    section: 'Store Setup & Branding',
    title: 'Store Design & Branding',
    description: 'Import theme, set logo, brand voice guidelines, and copy basics.',
    checklistActions: [
      'Upload/store logo',
      'Set brand colors',
      'Define brand voice/tone',
      'Complete favicon setup',
      'Apply theme'
    ],
    dependencies: [10],
    resources: [
      { title: 'Branding Guide', url: '/resources/branding-guide', type: 'guide' },
      { title: 'Theme Templates', url: '/resources/themes', type: 'templates' }
    ]
  },
  {
    stepNumber: 12,
    section: 'Store Setup & Branding',
    title: 'Legal Pages Setup',
    description: 'Add T&C, privacy policy, return/refund, shipping policy (auto-generators provided).',
    checklistActions: [
      'Generate/upload Terms & Conditions',
      'Create Privacy Policy',
      'Set up Return/Refund Policy',
      'Define Shipping Policy',
      'Confirm all policies live'
    ],
    dependencies: [11],
    resources: [
      { title: 'Policy Generator', url: '/tools/policy-generator', type: 'tool' },
      { title: 'Legal Requirements Guide', url: '/resources/legal-requirements', type: 'guide' }
    ],
    mcq: {
      question: 'What is required by law on all ecommerce stores?',
      options: [
        'Facebook Pixel',
        'Privacy Policy & T&C',
        'Live Chat Widget',
        'Testimonials'
      ],
      correctAnswer: 'b',
      feedback: {
        correct: 'Correct! Privacy Policy and Terms & Conditions are legally required for e-commerce stores.',
        incorrect: 'Privacy Policy and Terms & Conditions are mandatory legal requirements, not optional features.',
        explanation: 'Most jurisdictions require e-commerce stores to have Privacy Policies and Terms & Conditions to protect both the business and customers.'
      }
    }
  },

  // Section E: Pre-Launch & Testing
  {
    stepNumber: 13,
    section: 'Pre-Launch & Testing',
    title: 'Mock Orders & Checkout Testing',
    description: 'Place test orders for full payment/refund loop to verify everything works.',
    checklistActions: [
      'Place mock test orders',
      'Test payment flow',
      'Test refund process',
      'Screenshot test cases',
      'Confirm all test cases passed'
    ],
    dependencies: [12],
    resources: [
      { title: 'Testing Checklist', url: '/resources/testing-checklist', type: 'checklist' },
      { title: 'Payment Testing Guide', url: '/resources/payment-testing', type: 'guide' }
    ]
  },
  {
    stepNumber: 14,
    section: 'Pre-Launch & Testing',
    title: 'Abandoned Cart Setup',
    description: 'Automate follow-up emails/SMS for abandoned carts.',
    checklistActions: [
      'Configure abandoned cart workflow',
      'Verify workflow activated',
      'Test with dummy account',
      'Review email templates'
    ],
    dependencies: [13],
    resources: [
      { title: 'Abandoned Cart Guide', url: '/resources/abandoned-cart', type: 'guide' },
      { title: 'Email Template Library', url: '/resources/email-templates', type: 'templates' }
    ]
  },
  {
    stepNumber: 15,
    section: 'Pre-Launch & Testing',
    title: 'Analytics Setup',
    description: 'Connect Google Analytics, FB Pixel, Hotjar, and other tracking tools.',
    checklistActions: [
      'Connect Google Analytics',
      'Set up Facebook Pixel',
      'Configure Hotjar (optional)',
      'Confirm scripts working',
      'Test event triggers'
    ],
    dependencies: [13],
    resources: [
      { title: 'Analytics Setup Guide', url: '/resources/analytics-setup', type: 'guide' },
      { title: 'Event Tracking Guide', url: '/resources/event-tracking', type: 'guide' }
    ],
    mcq: {
      question: 'If you forget analytics on launch, what\'s the main issue?',
      options: [
        'More traffic',
        'Can\'t optimize ads or track sales source',
        'Higher payment gateway fees',
        'No effect'
      ],
      correctAnswer: 'b',
      feedback: {
        correct: 'Correct! Without analytics, you cannot optimize ads or understand where sales come from.',
        incorrect: 'Analytics are critical for understanding traffic sources and optimizing marketing spend.',
        explanation: 'Analytics help you understand customer behavior, optimize ad spend, and track ROI. Launching without them means flying blind.'
      }
    }
  },

  // Section F: Launch & First Sales
  {
    stepNumber: 16,
    section: 'Launch & First Sales',
    title: 'Launch Announcement',
    description: 'Email, social media, friends/family blast to announce your launch.',
    checklistActions: [
      'Prepare launch email',
      'Create social media posts',
      'Send to friends/family',
      'List 3 feedback sources',
      'Track launch metrics'
    ],
    dependencies: [15],
    resources: [
      { title: 'Launch Email Template', url: '/resources/launch-email', type: 'template' },
      { title: 'Social Media Templates', url: '/resources/social-templates', type: 'templates' }
    ]
  },
  {
    stepNumber: 17,
    section: 'Launch & First Sales',
    title: 'Paid Traffic & Organic Growth',
    description: 'Define ad test budget; set up influencer/UGC (User Generated Content) flow.',
    checklistActions: [
      'Define ad test budget',
      'Set up initial ad campaigns',
      'Create influencer list',
      'Plan UGC strategy',
      'Attach influencer contacts'
    ],
    dependencies: [16],
    resources: [
      { title: 'Ad Budget Calculator', url: '/tools/ad-budget-calculator', type: 'tool' },
      { title: 'Influencer Outreach Guide', url: '/resources/influencer-outreach', type: 'guide' }
    ],
    mcq: {
      question: 'Why start with a modest ad budget on launch?',
      options: [
        'Because it\'s required',
        'To validate and optimize before scaling',
        'So suppliers won\'t notice you',
        'Only big brands run large ads'
      ],
      correctAnswer: 'b',
      feedback: {
        correct: 'Correct! Start small to validate what works, then scale successful campaigns.',
        incorrect: 'Starting small allows you to test and optimize before investing heavily.',
        explanation: 'A modest budget lets you test different audiences, creatives, and messages. Once you find what works, scale up gradually.'
      }
    }
  },
  {
    stepNumber: 18,
    section: 'Launch & First Sales',
    title: 'Customer Support & Fulfillment Workflow',
    description: 'Respond promptly, process orders as per policy.',
    checklistActions: [
      'Set up support email',
      'Enable order tracker',
      'Create support templates',
      'Test fulfillment workflow',
      'Document support processes'
    ],
    dependencies: [17],
    resources: [
      { title: 'Support Templates', url: '/resources/support-templates', type: 'templates' },
      { title: 'Fulfillment Workflow Guide', url: '/resources/fulfillment-workflow', type: 'guide' }
    ]
  },

  // Section G: Iteration, Compliance & Scale
  {
    stepNumber: 19,
    section: 'Iteration, Compliance & Scale',
    title: 'Post-launch Review & Analytics',
    description: 'Evaluate best-selling products, optimize conversion funnels.',
    checklistActions: [
      'Review weekly analytics report',
      'Upload weekly report',
      'Identify best-selling products',
      'List winning products',
      'Document optimization opportunities'
    ],
    dependencies: [18],
    resources: [
      { title: 'Analytics Review Template', url: '/resources/analytics-review', type: 'template' },
      { title: 'Optimization Guide', url: '/resources/optimization-guide', type: 'guide' }
    ]
  },
  {
    stepNumber: 20,
    section: 'Iteration, Compliance & Scale',
    title: 'Compliance & Tax Filings',
    description: 'Annual/monthly tax workflow, GST, returns, etc.',
    checklistActions: [
      'Set up tax filing schedule',
      'Complete monthly/quarterly filings',
      'File annual returns',
      'Document all tax records',
      'Upload compliance documents'
    ],
    dependencies: [4],
    resources: [
      { title: 'Tax Filing Checklist', url: '/resources/tax-filing', type: 'checklist' },
      { title: 'GST Guide', url: '/resources/gst-guide', type: 'guide' }
    ],
    mcq: {
      question: 'If you sell in the US from India, what must you track?',
      options: [
        'Only Indian tax',
        'US sales tax compliance',
        'Facebook group replies',
        'Supplier commission only'
      ],
      correctAnswer: 'b',
      feedback: {
        correct: 'Correct! Selling to US customers requires US sales tax compliance, in addition to Indian tax obligations.',
        incorrect: 'International sales require compliance with both your home country and destination country tax laws.',
        explanation: 'When selling internationally, you must comply with tax laws in both your country (India) and the destination country (US). US sales tax varies by state.'
      }
    }
  },
  {
    stepNumber: 21,
    section: 'Iteration, Compliance & Scale',
    title: 'Scale-Up Decision Point',
    description: 'Consider building private label, new products, automation tools.',
    checklistActions: [
      'Evaluate scaling opportunities',
      'Consider private label options',
      'Research new products',
      'List automation tools tested',
      'Save roadmap notes'
    ],
    dependencies: [19],
    resources: [
      { title: 'Scaling Guide', url: '/resources/scaling-guide', type: 'guide' },
      { title: 'Automation Tools Directory', url: '/resources/automation-tools', type: 'directory' }
    ]
  }
];

// Helper function to get steps by section
export function getStepsBySection(): Record<string, ChecklistStep[]> {
  const sections: Record<string, ChecklistStep[]> = {};
  DROPSHIPPING_CHECKLIST.forEach(step => {
    if (!sections[step.section]) {
      sections[step.section] = [];
    }
    sections[step.section].push(step);
  });
  return sections;
}

// Helper function to get step by number
export function getStepByNumber(stepNumber: number): ChecklistStep | undefined {
  return DROPSHIPPING_CHECKLIST.find(step => step.stepNumber === stepNumber);
}

// Helper function to check if step dependencies are met
export function areDependenciesMet(stepNumber: number, completedSteps: number[]): boolean {
  const step = getStepByNumber(stepNumber);
  if (!step || step.dependencies.length === 0) return true;
  return step.dependencies.every(dep => completedSteps.includes(dep));
}


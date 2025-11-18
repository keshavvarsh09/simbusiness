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
  reflectionPrompts?: string[];
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

type ChecklistStepBase = Omit<ChecklistStep, 'reflectionPrompts'>;

const BASE_CHECKLIST: ChecklistStepBase[] = [
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
      { title: 'SMART Goals Template (HubSpot)', url: 'https://blog.hubspot.com/marketing/smart-goals-template', type: 'article' },
      { title: 'Time Management for Entrepreneurs (Forbes)', url: 'https://www.forbes.com/sites/forbesbusinesscouncil/2021/03/15/time-management-tips-for-entrepreneurs/', type: 'article' }
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
      { title: 'Google Trends - Niche Research', url: 'https://trends.google.com', type: 'tool' },
      { title: 'Top Dropshipping Niches 2024 (Oberlo)', url: 'https://www.oberlo.com/blog/dropshipping-niches', type: 'article' }
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
      { title: 'Competitor Analysis Guide (Shopify)', url: 'https://www.shopify.com/blog/competitor-analysis', type: 'article' }
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
      { title: 'Business Entity Types Explained (NerdWallet)', url: 'https://www.nerdwallet.com/article/small-business/business-structure-types', type: 'guide' },
      { title: 'US Business Registration (SBA)', url: 'https://www.sba.gov/business-guide/launch-your-business/register-your-business', type: 'guide' }
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
      { title: 'USPTO Trademark Search', url: 'https://www.uspto.gov/trademarks/search', type: 'tool' },
      { title: 'Trademark Basics Guide (USPTO)', url: 'https://www.uspto.gov/trademarks/basics', type: 'guide' }
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
      { title: 'Payment Processor Comparison (Shopify)', url: 'https://www.shopify.com/payment-providers', type: 'article' },
      { title: 'Business Bank Account Guide (NerdWallet)', url: 'https://www.nerdwallet.com/article/small-business/business-bank-account', type: 'guide' }
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
      { title: 'AliExpress Dropshipping Guide (Oberlo)', url: 'https://www.oberlo.com/blog/aliexpress-dropshipping', type: 'guide' },
      { title: 'How to Find Suppliers (Shopify)', url: 'https://www.shopify.com/blog/how-to-find-suppliers', type: 'guide' }
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
      { title: 'Product Quality Checklist (Oberlo)', url: 'https://www.oberlo.com/blog/product-quality-checklist', type: 'article' },
      { title: 'Supplier Quality Control (Shopify)', url: 'https://www.shopify.com/blog/supplier-quality-control', type: 'guide' }
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
      { title: 'Profit Margin Calculator (Calculator.net)', url: 'https://www.calculator.net/profit-margin-calculator.html', type: 'tool' },
      { title: 'Pricing Strategy Guide (Shopify)', url: 'https://www.shopify.com/blog/pricing-strategy', type: 'guide' }
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
      { title: 'E-commerce Platform Comparison (Shopify)', url: 'https://www.shopify.com/blog/ecommerce-platform-comparison', type: 'article' },
      { title: 'Shopify Setup Guide', url: 'https://www.shopify.com/guides', type: 'guides' }
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
      { title: 'Branding Guide for E-commerce (Shopify)', url: 'https://www.shopify.com/blog/branding-guide', type: 'guide' },
      { title: 'Shopify Theme Store', url: 'https://themes.shopify.com', type: 'templates' }
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
      { title: 'Free Privacy Policy Generator (Shopify)', url: 'https://www.shopify.com/tools/policy-generator', type: 'tool' },
      { title: 'E-commerce Legal Requirements (LegalZoom)', url: 'https://www.legalzoom.com/articles/ecommerce-legal-requirements', type: 'guide' }
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
      { title: 'Pre-Launch Checklist (Shopify)', url: 'https://www.shopify.com/blog/pre-launch-checklist', type: 'checklist' },
      { title: 'Payment Testing Guide (Stripe)', url: 'https://stripe.com/docs/testing', type: 'guide' }
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
      { title: 'Abandoned Cart Recovery Guide (Shopify)', url: 'https://www.shopify.com/blog/abandoned-cart-recovery', type: 'guide' },
      { title: 'Email Marketing Templates (Mailchimp)', url: 'https://mailchimp.com/email-templates', type: 'templates' }
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
      { title: 'Google Analytics Setup (Google)', url: 'https://support.google.com/analytics/answer/9304153', type: 'guide' },
      { title: 'Facebook Pixel Setup (Meta)', url: 'https://www.facebook.com/business/help/952192354843755', type: 'guide' }
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
      { title: 'Launch Email Templates (Mailchimp)', url: 'https://mailchimp.com/help/create-an-email-campaign/', type: 'template' },
      { title: 'Social Media Templates (Canva)', url: 'https://www.canva.com/templates/EAE-5qJqJ5k-social-media-post/', type: 'templates' }
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
      { title: 'Facebook Ad Budget Calculator (Meta)', url: 'https://www.facebook.com/business/help/163081508372038', type: 'guide' },
      { title: 'Influencer Marketing Guide (Shopify)', url: 'https://www.shopify.com/blog/influencer-marketing', type: 'guide' }
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
      { title: 'Customer Service Templates (Zendesk)', url: 'https://www.zendesk.com/blog/customer-service-email-templates/', type: 'templates' },
      { title: 'Order Fulfillment Guide (Shopify)', url: 'https://www.shopify.com/blog/order-fulfillment', type: 'guide' }
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
      { title: 'E-commerce Analytics Guide (Google)', url: 'https://support.google.com/analytics/answer/9216061', type: 'guide' },
      { title: 'Conversion Rate Optimization (Shopify)', url: 'https://www.shopify.com/blog/conversion-rate-optimization', type: 'guide' }
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
      { title: 'Small Business Tax Guide (IRS)', url: 'https://www.irs.gov/businesses/small-businesses-self-employed', type: 'guide' },
      { title: 'E-commerce Tax Guide (Shopify)', url: 'https://www.shopify.com/blog/ecommerce-tax-guide', type: 'guide' }
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
      { title: 'Scaling Your Business Guide (Shopify)', url: 'https://www.shopify.com/blog/scaling-your-business', type: 'guide' },
      { title: 'E-commerce Automation Tools (Oberlo)', url: 'https://www.oberlo.com/blog/ecommerce-automation-tools', type: 'article' }
    ]
  }
];

const REFLECTION_PROMPTS: Record<number, string[]> = {
  1: [
    'Does my motivation align with the time I can realistically invest each week?',
    'What does success look like for me 90 days from now?'
  ],
  2: [
    'Which niche best matches both demand data and my personal interest?',
    'What unique gap did my competitor scan reveal?'
  ],
  3: [
    'Which validation signal felt the strongest (data, customer pain point, or competitor weakness)?',
    'Where do I still feel uncertain about demand?'
  ],
  4: [
    'Are there any legal or compliance tasks I am still procrastinating?',
    'Do I have a schedule to review compliance updates after launch?'
  ],
  5: [
    'If my store name was taken tomorrow, what would my backup be?',
    'How does my trademark timeline align with launch milestones?'
  ],
  6: [
    'Did my payment test simulate a real order from start to refund?',
    'Have I factored payment gateway fees into my pricing model?'
  ],
  7: [
    'Which supplier inspired the most confidence and why?',
    'What red flags did I notice while comparing suppliers?'
  ],
  8: [
    'What did the sample reveal about perceived product quality and packaging?',
    'What return or replacement policy will I offer for defective items?'
  ],
  9: [
    'Is my net margin still healthy after returns, taxes, and CAC?',
    'Which cost assumption feels the riskiest or least proven?'
  ],
  10: [
    'Why is this ecommerce platform the best fit for my roadmap?',
    'What integrations or apps will I likely need within the next quarter?'
  ],
  11: [
    'Does the brand voice truly resonate with my target customer persona?',
    'Which design elements still feel like placeholders that need polishing?'
  ],
  12: [
    'Which policy (refund, shipping, privacy, T&C) feels the weakest right now?',
    'Have I role-played a customer actually reading each policy?'
  ],
  13: [
    'What failed or felt clunky during my mock checkout?',
    'How confident am I in processing refunds quickly if needed tomorrow?'
  ],
  14: [
    'What message or incentive felt most compelling in the abandoned cart flow?',
    'How quickly after abandonment does the follow-up trigger?'
  ],
  15: [
    'If ads go live today, can I confidently track every sale back to its source?',
    'What metric will I monitor daily during launch week?'
  ],
  16: [
    'Which audience or channel reacted best to the launch announcement?',
    'What is the top piece of feedback I need to address immediately?'
  ],
  17: [
    'What result will convince me to scale ad spend beyond the test budget?',
    'Which creatives or influencers excite me the most and why?'
  ],
  18: [
    'How fast can I respond to a frustrated customer with today’s workflow?',
    'Which part of fulfillment relies on a single person or supplier, and how do I back it up?'
  ],
  19: [
    'Which product performance metric surprised me the most?',
    'What experiment will I run next week based on this review?'
  ],
  20: [
    'Which filing deadlines or compliance steps make me most nervous?',
    'Have I documented tax obligations for every market I plan to sell into?'
  ],
  21: [
    'What automation or process would save me the most time right now?',
    'Which growth lever deserves my focus for the next quarter?'
  ]
};

export const DROPSHIPPING_CHECKLIST: ChecklistStep[] = BASE_CHECKLIST.map(step => ({
  ...step,
  reflectionPrompts: REFLECTION_PROMPTS[step.stepNumber] || []
}));

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



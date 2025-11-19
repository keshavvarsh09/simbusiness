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
    description: 'Set up bank account and payment processor (Stripe, Razorpay, PayPal, etc.).',
    checklistActions: [
      'Complete bank account setup',
      'Configure payment processor',
      'Run live payment test',
      'Verify payment flow'
    ],
    dependencies: [4],
    resources: [],
    mcq: {
      question: 'You\'re setting up payments for your dropshipping store. You need to accept international payments, want low fees, and need quick setup. Your store is on Shopify. Which payment processor should you prioritize?',
      options: [
        'Shopify Payments - Integrated with Shopify, 2.9% + 30¢ per transaction, accepts all major cards, no setup fees, instant activation',
        'Stripe - 2.9% + 30¢, requires separate account setup, more technical integration, better for custom solutions',
        'PayPal - 2.9% + fixed fee, widely trusted, but higher fees for international, separate account needed',
        'Just use cash on delivery - no fees at all'
      ],
      correctAnswer: 'a',
      feedback: {
        correct: 'Perfect! Shopify Payments is the best choice for Shopify stores. Benefits: Zero setup fees, Instant activation (no waiting for approval), Lower transaction fees (2.9% + 30¢), Accepts all major credit cards and digital wallets, Automatic fraud protection, Unified dashboard with your store, and No additional account management needed. For international stores, it supports 135+ currencies.',
        incorrect: 'While these are valid options, Shopify Payments is optimal for Shopify stores:\n\n**Stripe** (2.9% + 30¢): Great for custom websites, but requires developer setup and separate account management. More complex than needed for Shopify.\n\n**PayPal** (2.9% + fixed fee): Trusted by customers, but international fees are higher (4.4% + fixed fee), and you need a separate PayPal Business account.\n\n**Shopify Payments** eliminates the need for third-party processors, integrates seamlessly, and offers competitive rates with instant setup.',
        explanation: '**Payment Processor Comparison:**\n\n**Shopify Payments** (for Shopify stores):\n- ✅ 2.9% + 30¢ per transaction (US)\n- ✅ Zero setup fees\n- ✅ Instant activation\n- ✅ Accepts credit cards, Apple Pay, Google Pay\n- ✅ 135+ currencies supported\n- ✅ Built-in fraud protection\n- ✅ Unified dashboard\n- ❌ Only works with Shopify\n- ❌ Slightly higher fees than Stripe for non-Shopify stores\n\n**Stripe** (2.9% + 30¢):\n- ✅ Works with any platform\n- ✅ Developer-friendly API\n- ✅ Strong fraud protection\n- ✅ 135+ currencies\n- ❌ Requires technical integration\n- ❌ Separate account management\n- ❌ Approval process can take days\n\n**PayPal** (2.9% + fixed fee):\n- ✅ High customer trust\n- ✅ Easy for customers\n- ✅ Works globally\n- ❌ Higher international fees (4.4%)\n- ❌ Separate account needed\n- ❌ Can hold funds for new accounts\n\n**For Shopify stores, Shopify Payments is the clear winner** - it\'s designed specifically for your platform and offers the best balance of fees, features, and ease of use.'
      }
    }
  },

  // Section C: Product Sourcing & Supplier Selection
  {
    stepNumber: 7,
    section: 'Product Sourcing & Supplier Selection',
    title: 'Supplier Platform Research',
    description: 'Main sources: AliExpress, IndiaMART, Oberlo, local B2B platforms. Each has different advantages for dropshipping.',
    checklistActions: [
      'Research supplier platforms',
      'Save top 3 suppliers per product',
      'Document sample product orders',
      'Compare supplier terms'
    ],
    dependencies: [3],
    resources: [],
    mcq: {
      question: 'You\'re starting dropshipping and need to find suppliers. You want low minimum order quantities, fast shipping options, and easy integration with your Shopify store. Which supplier platform should you start with?',
      options: [
        'AliExpress - Millions of products, MOQ of 1, integrates with Oberlo/DSers, 10-30 day shipping, best for beginners',
        'IndiaMART - Great for Indian suppliers, B2B focused, requires negotiation, better for bulk orders, longer setup',
        'Alibaba - Wholesale prices, MOQ usually 100+, best for scaling, requires direct supplier contact',
        'Local suppliers only - avoid international shipping delays'
      ],
      correctAnswer: 'a',
      feedback: {
        correct: 'Smart choice! AliExpress is perfect for dropshipping beginners. Why it works: MOQ of 1 (order as you sell), Direct integration with Shopify via Oberlo/DSers apps, Millions of products across all categories, ePacket shipping (10-20 days) available, Supplier ratings and reviews help you choose, No upfront inventory costs, and Easy to test multiple products. Most successful dropshippers start here before scaling to Alibaba for bulk orders.',
        incorrect: 'While these platforms have their place, AliExpress is ideal for starting:\n\n**IndiaMART**: Great for Indian market, but requires B2B negotiation, higher MOQs, and more complex setup. Better for established businesses.\n\n**Alibaba**: Wholesale prices are great, but MOQ of 100+ means you need capital upfront. Best for scaling after validating products on AliExpress.\n\n**Local suppliers**: Can work, but limits product selection and may have higher costs. International suppliers offer better margins for dropshipping.\n\n**AliExpress** lets you test products risk-free with MOQ of 1 and integrates seamlessly with Shopify.',
        explanation: '**Supplier Platform Comparison:**\n\n**AliExpress** (Best for beginners):\n- ✅ MOQ: 1 unit (order as you sell)\n- ✅ Millions of products\n- ✅ Integrates with Oberlo, DSers, Spocket\n- ✅ ePacket shipping: 10-20 days\n- ✅ Supplier ratings and reviews\n- ✅ No upfront inventory\n- ✅ Easy product testing\n- ❌ Longer shipping than local\n- ❌ Quality varies by supplier\n\n**IndiaMART** (B2B marketplace):\n- ✅ Great for Indian suppliers\n- ✅ Lower prices for bulk\n- ✅ Local shipping options\n- ❌ Requires negotiation\n- ❌ Higher MOQs (usually 50+)\n- ❌ More complex setup\n- ❌ Less Shopify integration\n\n**Alibaba** (Wholesale):\n- ✅ Lowest prices (wholesale)\n- ✅ Direct supplier contact\n- ✅ Custom manufacturing options\n- ❌ MOQ: 100+ units typically\n- ❌ Requires upfront capital\n- ❌ More complex ordering\n- ❌ Better for scaling, not starting\n\n**Strategy**: Start with AliExpress to test products risk-free. Once you find winners, scale with Alibaba for better margins. Use IndiaMART if targeting the Indian market specifically.'
      }
    }
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
    resources: [],
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
    title: 'SKU Management & Inventory Setup',
    description: 'Learn SKU (Stock Keeping Unit) basics for dropshipping. SKUs help track products, variants, and inventory even when you don\'t hold stock.',
    checklistActions: [
      'Understand what SKU means in dropshipping',
      'Create SKU naming convention (e.g., PROD-001-BLUE-L)',
      'Set up SKU for each product variant',
      'Configure reorder points and quantities',
      'Document SKU system'
    ],
    dependencies: [8],
    resources: [],
    mcq: {
      question: 'In dropshipping, why do you need SKUs even though you don\'t hold inventory?',
      options: [
        'SKUs are only for warehouses, not needed in dropshipping',
        'SKUs help track product variants, supplier info, and automate reordering when stock runs low',
        'SKUs are just for accounting purposes',
        'You only need SKUs if you have 100+ products'
      ],
      correctAnswer: 'b',
      feedback: {
        correct: 'Correct! Even in dropshipping, SKUs help you: Track different product variants (size, color, style), Identify which supplier to order from, Automate reordering when inventory drops, Manage product data across platforms, and Handle returns/exchanges efficiently.',
        incorrect: 'SKUs are essential in dropshipping too. They help track variants, manage supplier relationships, and automate operations even when you don\'t physically hold inventory.',
        explanation: '**SKU in Dropshipping Explained:**\n\n**What is a SKU?**\n- Stock Keeping Unit: A unique identifier for each product variant\n- Example: "TSHIRT-001-BLUE-L" = T-shirt product #001, Blue color, Large size\n\n**Why SKUs Matter in Dropshipping:**\n- **Variant Tracking**: Same product, different sizes/colors need different SKUs\n- **Supplier Management**: Each SKU links to a specific supplier and their product code\n- **Automation**: When stock runs low, system knows which supplier to contact\n- **Platform Integration**: Shopify, WooCommerce use SKUs to sync inventory\n- **Order Management**: Helps route orders to correct supplier automatically\n\n**SKU Naming Best Practices:**\n- Use consistent format: PROD-CATEGORY-VARIANT (e.g., "ELEC-001-BLACK")\n- Include size/color codes: "APP-002-RED-M"\n- Keep it short but descriptive: Max 20 characters\n- Avoid special characters: Use hyphens, not spaces\n\n**In dropshipping, SKUs connect your store to supplier catalogs**, making automation possible even without physical inventory.'
      }
    }
  },
  {
    stepNumber: 10,
    section: 'Product Sourcing & Supplier Selection',
    title: 'Pricing & Cost Simulator',
    description: 'Use pricing calculator with fees, taxes, shipping, returns, and CAC (Customer Acquisition Cost).',
    checklistActions: [
      'Use pricing calculator tool',
      'Calculate all costs (fees, taxes, shipping)',
      'Factor in returns and CAC',
      'Save target profit percentage'
    ],
    dependencies: [9],
    resources: [
      { title: 'Profit Margin Calculator (Calculator.net)', url: 'https://www.calculator.net/profit-margin-calculator.html', type: 'tool' },
      { title: 'Pricing Strategy Guide (Shopify)', url: 'https://www.shopify.com/blog/pricing-strategy', type: 'guide' }
    ]
  },

  // Section D: Store Setup & Branding
  {
    stepNumber: 11,
    section: 'Store Setup & Branding',
    title: 'Choose Platform',
    description: 'Shopify, Webflow, WordPress (WooCommerce) - Each has unique strengths. Choose based on your technical skills, budget, and business needs.',
    checklistActions: [
      'Compare platform options',
      'Select platform',
      'Mark selected platform',
      'Open setup wizard'
    ],
    dependencies: [6],
    resources: [],
    mcq: {
      question: 'You\'re launching a dropshipping store with limited technical skills, need quick setup, and want built-in payment processing. You expect to scale to 100+ products within 6 months. Which platform should you choose?',
      options: [
        'Shopify - Best for beginners, all-in-one solution with 2000+ apps, $29/month, handles everything from payments to inventory',
        'Webflow - Most design flexibility, requires coding knowledge, $23/month, better for custom brand experiences',
        'WordPress + WooCommerce - Free and open-source, full control, but requires hosting, security, and plugin management',
        'Any platform works the same - just pick the cheapest option'
      ],
      correctAnswer: 'a',
      feedback: {
        correct: 'Excellent choice! Shopify is ideal for dropshipping beginners. It offers: Built-in payment processing (Shopify Payments), Easy product import from AliExpress via Oberlo, 2000+ apps for marketing/automation, Mobile app for managing orders, 24/7 support, and scales from startup to enterprise. Starting at $29/month, it handles hosting, security, and updates automatically.',
        incorrect: 'Not the best fit for this scenario. Here\'s why:\n\n**Webflow** ($23/month): Great for designers and developers who want pixel-perfect control, but requires HTML/CSS knowledge and doesn\'t have built-in dropshipping apps like Shopify.\n\n**WordPress + WooCommerce** (Free but needs hosting): While free, you\'ll need to manage hosting ($10-30/month), security plugins, updates, and technical maintenance. More complex for beginners.\n\n**Shopify** is the right choice because it\'s designed specifically for e-commerce, has the largest app ecosystem for dropshipping, and handles all technical aspects automatically.',
        explanation: '**Platform Comparison for Dropshipping:**\n\n**Shopify** ($29-299/month):\n- ✅ Best for beginners - no coding needed\n- ✅ Built-in payment processing (2.9% + 30¢ per transaction)\n- ✅ 2000+ apps including Oberlo, DSers for dropshipping\n- ✅ Automatic updates, hosting, SSL included\n- ✅ Mobile app for order management\n- ✅ 24/7 support\n- ❌ Less design flexibility than Webflow\n- ❌ Transaction fees if not using Shopify Payments\n\n**Webflow** ($23-39/month):\n- ✅ Most design flexibility - pixel-perfect control\n- ✅ Great for custom brand experiences\n- ✅ No transaction fees\n- ❌ Requires HTML/CSS/JavaScript knowledge\n- ❌ Limited dropshipping integrations\n- ❌ More complex setup for e-commerce\n\n**WordPress + WooCommerce** (Free + hosting $10-30/month):\n- ✅ Completely free and open-source\n- ✅ Full control over everything\n- ✅ Massive plugin ecosystem\n- ❌ Requires technical knowledge for setup/maintenance\n- ❌ You manage hosting, security, backups\n- ❌ More time-consuming for beginners\n\n**For dropshipping beginners, Shopify is the clear winner** because it removes technical barriers and provides everything you need out of the box.'
      }
    }
  },
  {
    stepNumber: 12,
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
    dependencies: [11],
    resources: [
      { title: 'Branding Guide for E-commerce (Shopify)', url: 'https://www.shopify.com/blog/branding-guide', type: 'guide' },
      { title: 'Shopify Theme Store', url: 'https://themes.shopify.com', type: 'templates' }
    ]
  },
  {
    stepNumber: 13,
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
    dependencies: [12],
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
    stepNumber: 14,
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
    dependencies: [13],
    resources: [
      { title: 'Pre-Launch Checklist (Shopify)', url: 'https://www.shopify.com/blog/pre-launch-checklist', type: 'checklist' },
      { title: 'Payment Testing Guide (Stripe)', url: 'https://stripe.com/docs/testing', type: 'guide' }
    ]
  },
  {
    stepNumber: 15,
    section: 'Pre-Launch & Testing',
    title: 'Abandoned Cart Setup',
    description: 'Automate follow-up emails/SMS for abandoned carts.',
    checklistActions: [
      'Configure abandoned cart workflow',
      'Verify workflow activated',
      'Test with dummy account',
      'Review email templates'
    ],
    dependencies: [14],
    resources: [
      { title: 'Abandoned Cart Recovery Guide (Shopify)', url: 'https://www.shopify.com/blog/abandoned-cart-recovery', type: 'guide' },
      { title: 'Email Marketing Templates (Mailchimp)', url: 'https://mailchimp.com/email-templates', type: 'templates' }
    ]
  },
  {
    stepNumber: 16,
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
    dependencies: [14],
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
    stepNumber: 17,
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
    dependencies: [16],
    resources: [
      { title: 'Launch Email Templates (Mailchimp)', url: 'https://mailchimp.com/help/create-an-email-campaign/', type: 'template' },
      { title: 'Social Media Templates (Canva)', url: 'https://www.canva.com/templates/EAE-5qJqJ5k-social-media-post/', type: 'templates' }
    ]
  },
  {
    stepNumber: 18,
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
    dependencies: [17],
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
    stepNumber: 19,
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
    dependencies: [18],
    resources: [
      { title: 'Customer Service Templates (Zendesk)', url: 'https://www.zendesk.com/blog/customer-service-email-templates/', type: 'templates' },
      { title: 'Order Fulfillment Guide (Shopify)', url: 'https://www.shopify.com/blog/order-fulfillment', type: 'guide' }
    ]
  },

  // Section G: Iteration, Compliance & Scale
  {
    stepNumber: 20,
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
    dependencies: [19],
    resources: [
      { title: 'E-commerce Analytics Guide (Google)', url: 'https://support.google.com/analytics/answer/9216061', type: 'guide' },
      { title: 'Conversion Rate Optimization (Shopify)', url: 'https://www.shopify.com/blog/conversion-rate-optimization', type: 'guide' }
    ]
  },
  {
    stepNumber: 21,
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
    stepNumber: 22,
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
    dependencies: [20],
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
    'How will my SKU system help me scale when I add more products?',
    'What variant information (size, color, style) do I need to track?'
  ],
  10: [
    'Is my net margin still healthy after returns, taxes, and CAC?',
    'Which cost assumption feels the riskiest or least proven?'
  ],
  11: [
    'Why is this ecommerce platform the best fit for my roadmap?',
    'What integrations or apps will I likely need within the next quarter?'
  ],
  12: [
    'Does the brand voice truly resonate with my target customer persona?',
    'Which design elements still feel like placeholders that need polishing?'
  ],
  13: [
    'Which policy (refund, shipping, privacy, T&C) feels the weakest right now?',
    'Have I role-played a customer actually reading each policy?'
  ],
  14: [
    'What failed or felt clunky during my mock checkout?',
    'How confident am I in processing refunds quickly if needed tomorrow?'
  ],
  15: [
    'What message or incentive felt most compelling in the abandoned cart flow?',
    'How quickly after abandonment does the follow-up trigger?'
  ],
  16: [
    'If ads go live today, can I confidently track every sale back to its source?',
    'What metric will I monitor daily during launch week?'
  ],
  17: [
    'Which audience or channel reacted best to the launch announcement?',
    'What is the top piece of feedback I need to address immediately?'
  ],
  18: [
    'What result will convince me to scale ad spend beyond the test budget?',
    'Which creatives or influencers excite me the most and why?'
  ],
  19: [
    'How fast can I respond to a frustrated customer with today's workflow?',
    'Which part of fulfillment relies on a single person or supplier, and how do I back it up?'
  ],
  20: [
    'Which product performance metric surprised me the most?',
    'What experiment will I run next week based on this review?'
  ],
  21: [
    'Which filing deadlines or compliance steps make me most nervous?',
    'Have I documented tax obligations for every market I plan to sell into?'
  ],
  22: [
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



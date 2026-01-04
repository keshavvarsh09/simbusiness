// Comprehensive Dropshipping Curriculum - Module 1 & 2
// Based on Michael Bernstein methodology and industry best practices

export interface LessonContent {
    id: number;
    moduleId: number;
    moduleTitle: string;
    title: string;
    description: string;
    duration: string;
    icon: string;
    content: {
        intro: string;
        sections: {
            title: string;
            content: string;
            keyPoints?: string[];
        }[];
        practiceTask: string;
    };
    quizTopics: string[];
    xpReward: number;
    unlocksFeature?: string;
}

export const CURRICULUM: LessonContent[] = [
    // ============ MODULE 1: MINDSET & FOUNDATION ============
    {
        id: 1,
        moduleId: 1,
        moduleTitle: 'Mindset & Foundation',
        title: "Define Your 'Why' & Business Goals",
        description: 'Set clear goals and understand your motivation',
        duration: '15 min',
        icon: '🎯',
        content: {
            intro: 'Before you spend a single dollar or hour on dropshipping, you need absolute clarity on WHY you\'re doing this. Your "why" will carry you through the inevitable failures and setbacks.',
            sections: [
                {
                    title: 'Why Your "Why" Matters',
                    content: '80% of dropshippers quit within the first 3 months. The difference between those who succeed and those who quit isn\'t intelligence or luck—it\'s having a compelling reason to push through failure.',
                    keyPoints: [
                        'Side income ($500-2K/month) requires 10-15 hrs/week',
                        'Full-time replacement ($5K+/month) requires 30-40 hrs/week initially',
                        'Your first 10 products will likely fail - this is normal',
                        'Success typically takes 6-12 months of consistent effort'
                    ]
                },
                {
                    title: 'Setting SMART Goals',
                    content: 'Vague goals like "make money online" lead to vague results. Use the SMART framework: Specific, Measurable, Achievable, Relevant, Time-bound.',
                    keyPoints: [
                        'Bad: "I want to make money" → Good: "I want $3K/month profit in 6 months"',
                        'Break yearly goals into monthly milestones',
                        'Track hours invested, not just revenue',
                        'Celebrate small wins to maintain momentum'
                    ]
                },
                {
                    title: 'Time Investment Reality',
                    content: 'With only 10 hours per week, you need extreme focus. The 80/20 rule applies: 80% of results come from 20% of efforts. One winning product can generate your entire income goal.',
                    keyPoints: [
                        '3 hrs: Marketing & content creation',
                        '2 hrs: Customer support',
                        '2 hrs: Product research',
                        '2 hrs: Order processing',
                        '1 hr: Analytics and optimization'
                    ]
                }
            ],
            practiceTask: 'Write down your specific income goal, timeline, and available hours per week. Calculate: If you need $5K/month at $25 profit per order, how many orders do you need daily?'
        },
        quizTopics: ['goal setting', 'time management', 'dropshipping reality'],
        xpReward: 100
    },
    {
        id: 2,
        moduleId: 1,
        moduleTitle: 'Mindset & Foundation',
        title: 'Understanding the Dropshipping Model',
        description: 'How dropshipping actually works and why it\'s profitable',
        duration: '12 min',
        icon: '📚',
        content: {
            intro: 'Dropshipping is NOT a get-rich-quick scheme. It\'s a legitimate retail business model where you sell products without holding inventory. When a customer orders, your supplier ships directly to them.',
            sections: [
                {
                    title: 'The Dropshipping Supply Chain',
                    content: 'You are the marketing and sales arm. The supplier handles inventory, storage, and shipping. Your job is to find products people want, create content that sells, and manage customer experience.',
                    keyPoints: [
                        'Customer → Your Store → You place order with supplier → Supplier ships to customer',
                        'You never touch the product',
                        'Margins typically 30-50% with organic, 15-25% with paid ads',
                        'Your main expenses: marketing, apps, payment processing'
                    ]
                },
                {
                    title: 'Why Dropshipping Works',
                    content: 'Social media changed everything. Before TikTok, you needed huge ad budgets to reach customers. Now, one viral video can generate $10K+ in a day with ZERO ad spend.',
                    keyPoints: [
                        'Low barrier to entry (can start with $100-500)',
                        'Test products without buying inventory',
                        'Organic content = 50%+ margins',
                        'Scalable: same effort for 100 orders vs 10 orders'
                    ]
                },
                {
                    title: 'The Profit Formula',
                    content: 'Profit = Selling Price - (Product Cost + Shipping + Platform Fees + Marketing). You MUST understand your numbers before starting.',
                    keyPoints: [
                        'Target minimum 3x markup for organic ($10 cost → $30 price)',
                        'Target minimum 2x markup for paid ads',
                        'Shopify/Stripe takes ~3% per transaction',
                        'Returns typically 5-15% depending on niche'
                    ]
                }
            ],
            practiceTask: 'Find a product on AliExpress for $10. Calculate your selling price, fees (3%), estimated returns (10%), and final profit margin. Is it worth selling?'
        },
        quizTopics: ['dropshipping model', 'profit margins', 'supply chain'],
        xpReward: 100
    },
    {
        id: 3,
        moduleId: 1,
        moduleTitle: 'Mindset & Foundation',
        title: 'Success vs Failure Patterns',
        description: 'What separates winners from quitters',
        duration: '10 min',
        icon: '📊',
        content: {
            intro: 'After mentoring thousands of dropshippers, clear patterns emerge. Success isn\'t about finding one lucky product—it\'s about consistent execution and learning from failures.',
            sections: [
                {
                    title: 'Patterns of Failure',
                    content: 'Most people fail for predictable reasons. Recognizing these patterns helps you avoid them.',
                    keyPoints: [
                        'Giving up after 2-3 product failures (expect 10+)',
                        'Spending on ads before organic validation',
                        'Copying products exactly instead of innovating',
                        'Ignoring customer feedback and reviews',
                        'Chasing "secret" products instead of mastering marketing'
                    ]
                },
                {
                    title: 'Patterns of Success',
                    content: 'Winners share common traits and behaviors that anyone can learn.',
                    keyPoints: [
                        'Test 20+ products before expecting a winner',
                        'Master content creation BEFORE scaling',
                        'Reinvest profits for first 6 months',
                        'Study what\'s working and iterate quickly',
                        'Focus on ONE product at a time, not 10'
                    ]
                },
                {
                    title: 'The Compound Effect',
                    content: 'Small improvements compound over time. Getting 1% better at hooks, 1% better at product selection, 1% better at customer service adds up to massive results.',
                    keyPoints: [
                        'Day 1: Zero sales is normal',
                        'Month 1: First sale, even $50, is a major win',
                        'Month 3: $1K months if you\'re consistent',
                        'Month 6: $5K-10K months with a winning product',
                        'Year 1: $10K-50K months are realistic goals'
                    ]
                }
            ],
            practiceTask: 'Write down your "failure budget" - how many products will you test before you consider quitting? Commit to a minimum of 15.'
        },
        quizTopics: ['success patterns', 'failure patterns', 'persistence'],
        xpReward: 100
    },
    {
        id: 4,
        moduleId: 1,
        moduleTitle: 'Mindset & Foundation',
        title: 'The Organic-First Strategy',
        description: 'Why you should NEVER start with paid ads',
        duration: '12 min',
        icon: '🌱',
        content: {
            intro: 'The #1 mistake beginners make is running Facebook or TikTok ads before validating organically. This is like burning money. Organic validation is the foundation of sustainable success.',
            sections: [
                {
                    title: 'Why Organic First?',
                    content: 'Organic content is free. If you can\'t make sales with free traffic, you definitely can\'t make sales with paid traffic. Organic validates your offer before you spend.',
                    keyPoints: [
                        'Organic margins: 50%+ (no ad costs)',
                        'Paid ad margins: 15-25% (after ad costs)',
                        'One viral video = $10K+ with $0 spend',
                        'Organic winners make the BEST ad creatives later'
                    ]
                },
                {
                    title: 'The Michael Bernstein Playbook',
                    content: 'Michael Bernstein\'s students consistently go from $0 to $100K/month using organic-first strategies. Virality is a SKILL, not luck. It can be learned.',
                    keyPoints: [
                        'Post 3-5 TikToks/Reels DAILY',
                        'Test different hooks on same product',
                        'Reach $5K-10K organically before ANY ads',
                        'Use organic winners as ad creatives',
                        'Organic builds an audience that trusts you'
                    ]
                },
                {
                    title: 'The Validation Milestone',
                    content: 'Don\'t even THINK about ads until you hit these milestones organically:',
                    keyPoints: [
                        'Minimum: 50+ sales on a single product',
                        'Better: $5K revenue from one product',
                        'Best: $10K+ before scaling with ads',
                        'You should have at least 3-5 viral videos (100K+ views)',
                        'Your cost per sale should be $0 (organic only)'
                    ]
                }
            ],
            practiceTask: 'Commit to the organic-first pledge: "I will not spend $1 on ads until I make $5K in organic sales." Write this down and post it where you\'ll see it daily.'
        },
        quizTopics: ['organic marketing', 'validation', 'ad spending'],
        xpReward: 100
    },
    {
        id: 5,
        moduleId: 1,
        moduleTitle: 'Mindset & Foundation',
        title: 'Building Your Learning System',
        description: 'How to continuously improve and stay ahead',
        duration: '10 min',
        icon: '🧠',
        content: {
            intro: 'The dropshipping landscape changes constantly. What worked 6 months ago might not work today. Building a system for continuous learning is your competitive advantage.',
            sections: [
                {
                    title: 'The Learning Loop',
                    content: 'Every piece of content you create teaches you something. Build a system to capture and apply these learnings.',
                    keyPoints: [
                        'Track every video\'s performance (views, engagement, sales)',
                        'Note what hooks work and what doesn\'t',
                        'Save examples of viral content in your niche',
                        'Review weekly: what worked? what didn\'t?'
                    ]
                },
                {
                    title: 'Sources of Learning',
                    content: 'Learn from multiple sources to build a complete picture.',
                    keyPoints: [
                        'Your own data: your best teacher',
                        'Competitors: what are they doing that works?',
                        'Comments: customers tell you what they want',
                        'Trends: stay on top of platform algorithm changes'
                    ]
                },
                {
                    title: 'The Feedback Loop',
                    content: 'Comments on your videos are goldmines. Every question is a content idea. Every objection shows you what to address.',
                    keyPoints: [
                        'Save frequent questions → make videos answering them',
                        'Common objections → address in your content',
                        'Compliments → double down on what\'s working',
                        'Hate comments → often mean you\'re onto something'
                    ]
                }
            ],
            practiceTask: 'Create a simple tracking spreadsheet with columns: Date, Video Hook, Views, Engagement Rate, Sales, Learnings. Use this for every video you post.'
        },
        quizTopics: ['learning systems', 'feedback loops', 'iteration'],
        xpReward: 100
    },

    // ============ MODULE 2: PRODUCT RESEARCH & VALIDATION ============
    {
        id: 6,
        moduleId: 2,
        moduleTitle: 'Product Research & Validation',
        title: 'Winning Product Criteria',
        description: 'The 7 characteristics of products that sell',
        duration: '15 min',
        icon: '🏆',
        content: {
            intro: 'Product research is BY FAR the most important part of dropshipping. A great product with mediocre marketing will outsell a mediocre product with great marketing. Here are the 7 criteria for winning products.',
            sections: [
                {
                    title: 'The 7 Winning Product Criteria',
                    content: 'A product doesn\'t need ALL 7, but the more it has, the higher probability of success.',
                    keyPoints: [
                        '1. WOW FACTOR: Makes people stop scrolling',
                        '2. PROBLEM-SOLVING: Clear pain point it addresses',
                        '3. DEMONSTRABLE: Easy to show in a 15-30 second video',
                        '4. HARD TO FIND LOCALLY: Not in Walmart or Target',
                        '5. IMPULSE PRICE: $20-60 sweet spot',
                        '6. BROAD APPEAL: Large potential audience',
                        '7. REPEAT PURCHASE POTENTIAL: Consumables or collections'
                    ]
                },
                {
                    title: 'The Virality Spectrum',
                    content: 'Products exist on a spectrum of virality. It\'s not black and white—some products are more shareable than others.',
                    keyPoints: [
                        'HIGH VIRALITY: Unique gadgets, satisfying to watch, unexpected',
                        'MEDIUM VIRALITY: Useful products with good demonstrations',
                        'LOW VIRALITY: Commodities, boring visuals, easy to find locally',
                        'Look for products that make people say "I NEED THIS"'
                    ]
                },
                {
                    title: 'Red Flags to Avoid',
                    content: 'Some products look good but have hidden problems.',
                    keyPoints: [
                        'Patented or trademarked products (legal issues)',
                        'Fragile items with high breakage rates',
                        'Electronics with high defect rates',
                        'Products with sizing issues (clothing)',
                        'Anything that touches skin/food (liability)'
                    ]
                }
            ],
            practiceTask: 'Find 3 products and score them 1-10 on each of the 7 criteria. Total score of 50+ indicates high potential.'
        },
        quizTopics: ['product criteria', 'winning products', 'virality'],
        xpReward: 150,
        unlocksFeature: '/products'
    },
    {
        id: 7,
        moduleId: 2,
        moduleTitle: 'Product Research & Validation',
        title: 'Finding Products on TikTok',
        description: 'Using the platform itself to discover winners',
        duration: '15 min',
        icon: '🔍',
        content: {
            intro: 'TikTok is the best product research tool because it shows you EXACTLY what people are buying right now. The algorithm surfaces products that are already working.',
            sections: [
                {
                    title: 'The TikTok Research Method',
                    content: 'Train the algorithm to show you dropshipping content, then mine it for product ideas.',
                    keyPoints: [
                        'Search hashtags: #TikTokMadeMeBuyIt, #AmazonFinds, #dropshipping',
                        'Engage with product videos (like, watch fully, comment)',
                        'Save videos with high engagement for analysis',
                        'Look for products with 100K+ views in last 7 days'
                    ]
                },
                {
                    title: 'Signals That a Product is Working',
                    content: 'Not all viral videos lead to sales. Look for these buying signals.',
                    keyPoints: [
                        'Comments asking "where can I buy this?"',
                        'Multiple creators selling the same product',
                        'Ads running for 30+ days (means it\'s profitable)',
                        'Before/after demonstrations',
                        'UGC-style content performing well'
                    ]
                },
                {
                    title: 'The Spy Method',
                    content: 'Use tools to see what\'s working for competitors.',
                    keyPoints: [
                        'TikTok Creative Center: see top performing ads',
                        'Facebook Ad Library: search competitor ads',
                        'Minea, PipiAds: paid spy tools',
                        'Follow successful dropshipping accounts'
                    ]
                }
            ],
            practiceTask: 'Spend 30 minutes on TikTok specifically searching product hashtags. Save 10 videos with high engagement. Identify the common patterns.'
        },
        quizTopics: ['TikTok research', 'product discovery', 'competitor analysis'],
        xpReward: 150
    },
    {
        id: 8,
        moduleId: 2,
        moduleTitle: 'Product Research & Validation',
        title: 'Market Validation Techniques',
        description: 'Confirming demand before you commit',
        duration: '12 min',
        icon: '📈',
        content: {
            intro: 'Just because a product looks good on TikTok doesn\'t mean it will sell for YOU. Validation techniques help confirm demand before you invest time and money.',
            sections: [
                {
                    title: 'Google Trends Analysis',
                    content: 'Google Trends shows you if interest is growing, stable, or declining.',
                    keyPoints: [
                        'Compare your product to related terms',
                        'Look for upward trends (growing interest)',
                        'Check for seasonality patterns',
                        'Rising = opportunity, Declining = avoid'
                    ]
                },
                {
                    title: 'Competition Analysis',
                    content: 'Competition isn\'t always bad—it validates the market. No competition can mean no demand.',
                    keyPoints: [
                        'Search product on Google: how many stores sell it?',
                        'Check review counts on AliExpress (high = proven demand)',
                        'Look at competitor pricing and positioning',
                        'Find gaps: better angles, underserved audiences'
                    ]
                },
                {
                    title: 'Quick Validation Test',
                    content: 'Before building a full store, test the concept.',
                    keyPoints: [
                        'Post 10-15 organic videos testing the product',
                        'Monitor engagement, saves, and shares',
                        'Read comments for buying intent',
                        'If no traction after 20 videos, move on'
                    ]
                }
            ],
            practiceTask: 'Take one product idea and validate it: check Google Trends, count competitors, analyze their reviews. Write a 1-paragraph conclusion on viability.'
        },
        quizTopics: ['market validation', 'Google Trends', 'competition analysis'],
        xpReward: 150
    },
    {
        id: 9,
        moduleId: 2,
        moduleTitle: 'Product Research & Validation',
        title: 'Pricing Strategy & Profit Margins',
        description: 'How to price for maximum profit',
        duration: '15 min',
        icon: '💰',
        content: {
            intro: 'Pricing is psychology, not math. The right price maximizes profit while maintaining conversion rates. Too low and you kill margins. Too high and you kill conversions.',
            sections: [
                {
                    title: 'The Pricing Formula',
                    content: 'Calculate your minimum viable price, then optimize from there.',
                    keyPoints: [
                        'Product cost + Shipping + Fees + Target profit = Minimum price',
                        'For organic: Target 3x markup minimum',
                        'For paid ads: Need room for ad costs (higher markup)',
                        'Factor in 5-10% for returns and refunds'
                    ]
                },
                {
                    title: 'Psychological Pricing',
                    content: 'Small pricing tricks can significantly impact conversion rates.',
                    keyPoints: [
                        'Charm pricing: $29.99 vs $30 (feels cheaper)',
                        'Anchor pricing: Show "compare at $99" next to $49',
                        'Bundle discounts: "Buy 2 get 1 free" increases AOV',
                        'Free shipping threshold: $50+ free shipping increases cart size'
                    ]
                },
                {
                    title: 'Understanding ROAS',
                    content: 'Return on Ad Spend determines if paid ads are profitable.',
                    keyPoints: [
                        'ROAS = Revenue ÷ Ad Spend',
                        'Break-even ROAS = Selling Price ÷ Profit per sale',
                        'Example: $50 product, $20 profit → Break-even ROAS = 2.5x',
                        'Target 2x your break-even for healthy margins'
                    ]
                }
            ],
            practiceTask: 'Calculate your break-even ROAS for a product: $15 cost, $45 selling price, 3% payment fees, $5 shipping. What ROAS do you need to profit?'
        },
        quizTopics: ['pricing strategy', 'profit margins', 'ROAS'],
        xpReward: 150
    },
    {
        id: 10,
        moduleId: 2,
        moduleTitle: 'Product Research & Validation',
        title: 'Avoiding Saturated Products',
        description: 'How to spot oversaturated markets',
        duration: '10 min',
        icon: '🚫',
        content: {
            intro: 'A saturated product isn\'t necessarily dead, but it requires much more creativity to stand out. Learn to recognize saturation and find blue ocean opportunities.',
            sections: [
                {
                    title: 'Signs of Saturation',
                    content: 'These red flags indicate a product might be past its peak.',
                    keyPoints: [
                        'Dozens of identical stores selling same product',
                        'Price wars (everyone undercutting)',
                        'Same creative being used by everyone',
                        'Product has been viral for 6+ months',
                        'Negative comments like "seen this everywhere"'
                    ]
                },
                {
                    title: 'Blue Ocean Strategy',
                    content: 'Instead of competing in saturated markets, find adjacent opportunities.',
                    keyPoints: [
                        'Same product, different audience (new angle)',
                        'Same niche, different product (related item)',
                        'Same problem, different solution (innovation)',
                        'Same product, different positioning (premium/budget)'
                    ]
                },
                {
                    title: 'Timing the Market',
                    content: 'The best time to enter varies by product lifecycle.',
                    keyPoints: [
                        'Early adopter phase: High reward, high risk',
                        'Growth phase: Best time to enter',
                        'Peak: Still profitable but competing hard',
                        'Decline: Avoid unless you have a unique angle'
                    ]
                }
            ],
            practiceTask: 'Take a "saturated" product and brainstorm 3 ways to differentiate: different audience, different angle, or different positioning.'
        },
        quizTopics: ['saturation', 'competition', 'blue ocean strategy'],
        xpReward: 150
    },
    // ============ MODULE 3: CONSUMER PSYCHOLOGY ============
    {
        id: 11,
        moduleId: 3,
        moduleTitle: 'Consumer Psychology',
        title: 'Why People Buy Impulsively',
        description: 'Understanding the psychology of impulse purchases',
        duration: '15 min',
        icon: '🧠',
        content: {
            intro: 'Dropshipping targets hedonic (impulse) shoppers. Understanding WHY people buy impulsively lets you craft content that triggers purchases.',
            sections: [
                {
                    title: 'The Impulse Buy Brain',
                    content: 'Impulse purchases bypass logical thinking. They happen in the emotional brain, not the rational brain.',
                    keyPoints: [
                        'Dopamine: the "reward anticipation" chemical',
                        'Social proof: "everyone else has it"',
                        'Scarcity: "I might miss out"',
                        'Novelty: the brain craves new things'
                    ]
                },
                {
                    title: 'The 18-34 Demographic',
                    content: 'This age group is most likely to buy impulsively from social media.',
                    keyPoints: [
                        'Mobile-first shopping behavior',
                        'Influenced by creators they follow',
                        'Value experiences and self-expression',
                        'Make quick decisions based on emotion'
                    ]
                },
                {
                    title: 'The Scroll-Stop-Buy Cycle',
                    content: 'Your content must interrupt browsing, create desire, and make buying effortless.',
                    keyPoints: [
                        'STOP: Hook grabs attention (first 1-3 seconds)',
                        'DESIRE: Content creates emotional want',
                        'ACT: Simple path to purchase (link in bio)',
                        'Reduce friction at every step'
                    ]
                }
            ],
            practiceTask: 'Think about your last 3 impulse purchases. What made you buy? Was it emotion, scarcity, social proof, or novelty?'
        },
        quizTopics: ['impulse buying', 'consumer psychology', 'dopamine'],
        xpReward: 175
    },
    {
        id: 12,
        moduleId: 3,
        moduleTitle: 'Consumer Psychology',
        title: 'Emotional Triggers in Marketing',
        description: 'The 7 emotions that drive purchases',
        duration: '15 min',
        icon: '❤️',
        content: {
            intro: 'People buy with emotion and justify with logic. Master these 7 emotional triggers to create content that converts.',
            sections: [
                {
                    title: 'The 7 Buying Emotions',
                    content: 'Every purchase is driven by one or more of these core emotions.',
                    keyPoints: [
                        '1. FEAR: Fear of missing out, fear of problem continuing',
                        '2. DESIRE: Wanting to be attractive, successful, admired',
                        '3. BELONGING: Being part of a group or trend',
                        '4. ENVY: Wanting what others have',
                        '5. GUILT: Treating yourself, deserving better',
                        '6. PRIDE: Showing off, status signaling',
                        '7. GREED: Getting a deal, saving money'
                    ]
                },
                {
                    title: 'Matching Emotion to Product',
                    content: 'Different products trigger different emotions. Match your messaging accordingly.',
                    keyPoints: [
                        'Beauty products → Desire, Pride, Envy',
                        'Health products → Fear, Guilt',
                        'Gadgets → Pride, Belonging',
                        'Deals/Bundles → Greed'
                    ]
                },
                {
                    title: 'Emotion in Your Hook',
                    content: 'The first 3 seconds should trigger an emotional response.',
                    keyPoints: [
                        '"I was so embarrassed until..." (Fear/Guilt)',
                        '"Everyone is obsessed with..." (Belonging/Envy)',
                        '"This is the secret to..." (Desire)',
                        '"Before you waste money on..." (Greed)'
                    ]
                }
            ],
            practiceTask: 'For your product, identify the primary emotion you\'ll target. Write 3 hooks that trigger that specific emotion.'
        },
        quizTopics: ['emotional triggers', 'marketing psychology', 'hooks'],
        xpReward: 175
    },
    {
        id: 13,
        moduleId: 3,
        moduleTitle: 'Consumer Psychology',
        title: 'The Psychology of Pricing',
        description: 'Price perception and conversion optimization',
        duration: '12 min',
        icon: '💵',
        content: {
            intro: 'Price is perception, not reality. The same product at $49.99 feels significantly cheaper than $50. Learn to use pricing psychology.',
            sections: [
                {
                    title: 'Charm Pricing',
                    content: 'Prices ending in 9 outperform round numbers consistently.',
                    keyPoints: [
                        '$29.99 vs $30 = 8-15% more conversions',
                        '$9.99 vs $10 = significant difference',
                        'Works because we read left to right',
                        'Exception: luxury products use round numbers'
                    ]
                },
                {
                    title: 'Anchoring',
                    content: 'Show a higher price first to make your price feel like a deal.',
                    keyPoints: [
                        '"Compare at $99, Today $49"',
                        'Strikethrough original prices',
                        'Show bundle value vs individual prices',
                        'Use percentage off for deals over $100'
                    ]
                },
                {
                    title: 'The Value Stack',
                    content: 'Build perceived value beyond the product itself.',
                    keyPoints: [
                        'Product + Bonus 1 + Bonus 2 = $XXX value',
                        '"But you pay only $49"',
                        'Free shipping (build into price)',
                        'Guarantees add perceived value'
                    ]
                }
            ],
            practiceTask: 'Rewrite your product pricing page using anchoring and charm pricing. Add a value stack showing total value.'
        },
        quizTopics: ['pricing psychology', 'anchoring', 'conversion'],
        xpReward: 175
    },
    {
        id: 14,
        moduleId: 3,
        moduleTitle: 'Consumer Psychology',
        title: 'Urgency & Scarcity Tactics',
        description: 'Creating FOMO without being sleazy',
        duration: '12 min',
        icon: '⏰',
        content: {
            intro: 'Fear of Missing Out (FOMO) is one of the strongest purchase motivators. But overuse destroys trust. Learn to use urgency ethically.',
            sections: [
                {
                    title: 'Real vs Fake Urgency',
                    content: 'Fake urgency (countdown that resets) kills trust. Real urgency converts.',
                    keyPoints: [
                        'GOOD: Limited inventory (if true)',
                        'GOOD: Seasonal/holiday sales',
                        'GOOD: First-time buyer discount',
                        'BAD: Fake countdown timers that reset',
                        'BAD: "Only 3 left!" when you have 1000'
                    ]
                },
                {
                    title: 'Social Proof Urgency',
                    content: 'Show that others are buying creates natural urgency.',
                    keyPoints: [
                        '"127 people are viewing this"',
                        '"Sold 50 in the last 24 hours"',
                        'Recent purchase notifications',
                        'Reviews mentioning selling out'
                    ]
                },
                {
                    title: 'Content-Based Urgency',
                    content: 'Create urgency in your videos, not just your store.',
                    keyPoints: [
                        '"These always sell out"',
                        '"I barely got one before they were gone"',
                        '"Everyone in the comments wanted to know..."',
                        'Show unboxing excitement'
                    ]
                }
            ],
            practiceTask: 'Write 2 ethical urgency messages for your product. One inventory-based, one time-based.'
        },
        quizTopics: ['urgency', 'scarcity', 'FOMO'],
        xpReward: 175
    },
    {
        id: 15,
        moduleId: 3,
        moduleTitle: 'Consumer Psychology',
        title: 'Building Trust for Unknown Brands',
        description: 'How to make strangers trust you enough to buy',
        duration: '15 min',
        icon: '🤝',
        content: {
            intro: 'Your biggest challenge: you\'re an unknown brand asking strangers to give you their credit card. Trust is everything.',
            sections: [
                {
                    title: 'The Trust Elements',
                    content: 'Every successful store has these trust signals.',
                    keyPoints: [
                        'Professional design (not template-looking)',
                        'Clear contact information',
                        'Real customer reviews with photos',
                        'Secure checkout badges',
                        'Money-back guarantee'
                    ]
                },
                {
                    title: 'Social Proof Stacking',
                    content: 'Multiple forms of proof are more convincing than one.',
                    keyPoints: [
                        'Reviews on product page',
                        'UGC content from real customers',
                        '"As seen on" logos (if applicable)',
                        'Number of happy customers',
                        'Creator/influencer endorsements'
                    ]
                },
                {
                    title: 'The Guarantee Strategy',
                    content: 'A strong guarantee removes purchase risk.',
                    keyPoints: [
                        '30-day money-back, no questions asked',
                        'Free returns (build into margin)',
                        'Lifetime warranty (if applicable)',
                        'Bold guarantee = confident brand'
                    ]
                }
            ],
            practiceTask: 'Audit your store for trust signals. Check: professional design, contact info, reviews, guarantee, secure checkout.'
        },
        quizTopics: ['trust building', 'social proof', 'guarantees'],
        xpReward: 175
    },
    {
        id: 16,
        moduleId: 3,
        moduleTitle: 'Consumer Psychology',
        title: 'Product-Market Fit',
        description: 'Finding the right customers for your product',
        duration: '12 min',
        icon: '🎯',
        content: {
            intro: 'A great product with wrong targeting will fail. Product-market fit means the right offer to the right audience at the right time.',
            sections: [
                {
                    title: 'Defining Your Customer',
                    content: 'Who specifically will buy this product? Be precise.',
                    keyPoints: [
                        'Age range (18-24 vs 35-44 buy differently)',
                        'Gender (impacts content style)',
                        'Pain point (what problem do they have?)',
                        'Platform behavior (where do they hang out?)'
                    ]
                },
                {
                    title: 'Negative Personas',
                    content: 'Equally important: who should NOT see your content?',
                    keyPoints: [
                        'Wrong age → wrong demographic',
                        'Wrong location → can\'t/won\'t buy',
                        'Tire kickers → engage but never buy',
                        'Avoid wasting virality on wrong audience'
                    ]
                },
                {
                    title: 'Testing Fit',
                    content: 'How to know if you have product-market fit.',
                    keyPoints: [
                        'Comments asking "where can I buy?"',
                        'Organic sales with low return rate',
                        'High save/share rate on content',
                        'Repeat customers'
                    ]
                }
            ],
            practiceTask: 'Write a detailed customer avatar: age, gender, pain point, where they hang out online, what content they engage with.'
        },
        quizTopics: ['product-market fit', 'target audience', 'customer avatar'],
        xpReward: 175
    },

    // ============ MODULE 4: CONTENT CREATION MASTERY ============
    {
        id: 17,
        moduleId: 4,
        moduleTitle: 'Content Creation Mastery',
        title: 'The Hook: First 3 Seconds',
        description: 'Master the art of stopping the scroll',
        duration: '15 min',
        icon: '🎣',
        content: {
            intro: 'You have exactly 3 seconds. In a world of infinite content, your hook determines whether anyone sees your message. This is the MOST important skill in content creation.',
            sections: [
                {
                    title: 'Why Hooks Matter',
                    content: 'TikTok shows your video to a small test group. If they don\'t watch past 3 seconds, the algorithm kills your reach.',
                    keyPoints: [
                        '50% of viewers drop off in first 3 seconds',
                        'Every additional second watched = more reach',
                        'A viral video is 90% hook, 10% everything else',
                        'Great product + bad hook = no sales'
                    ]
                },
                {
                    title: 'The 3 Elements of a Hook',
                    content: 'Hooks have visual, audio, and text components. Use all three.',
                    keyPoints: [
                        'VISUAL: Movement, unexpected imagery, product reveal',
                        'AUDIO: Music, voice, sound effect',
                        'TEXT: Curiosity-inducing headline on screen',
                        'All 3 together = maximum stopping power'
                    ]
                },
                {
                    title: 'Hook Psychology',
                    content: 'Hooks work by triggering specific psychological responses.',
                    keyPoints: [
                        'Gap: Promise information (curiosity)',
                        'Pattern interrupt: Break expectations',
                        'Controversy: Polarizing statement',
                        'Benefit: Clear value proposition'
                    ]
                }
            ],
            practiceTask: 'Watch 20 viral videos in your niche. Note the exact hook used in first 3 seconds. Categorize them by type.'
        },
        quizTopics: ['hooks', 'attention', 'TikTok algorithm'],
        xpReward: 200,
        unlocksFeature: '/content'
    },
    {
        id: 18,
        moduleId: 4,
        moduleTitle: 'Content Creation Mastery',
        title: 'Types of Viral Hooks',
        description: '15 hook formulas that stop the scroll',
        duration: '18 min',
        icon: '📝',
        content: {
            intro: 'You don\'t need to invent hooks. These 15 proven formulas work across platforms and products. Memorize them.',
            sections: [
                {
                    title: 'Curiosity Hooks',
                    content: 'Create an information gap that MUST be closed.',
                    keyPoints: [
                        '"I spent 2 years trying to fix this..."',
                        '"Nobody talks about this but..."',
                        '"This is why you can\'t..."',
                        '"The real reason [thing] happens is..."'
                    ]
                },
                {
                    title: 'Controversy Hooks',
                    content: 'Polarizing statements drive engagement (including hate).',
                    keyPoints: [
                        '"I hate when people say..."',
                        '"Unpopular opinion but..."',
                        '"This will make people mad but..."',
                        '"I don\'t care if you disagree..."'
                    ]
                },
                {
                    title: 'Proof Hooks',
                    content: 'Show the result before the process.',
                    keyPoints: [
                        '"I thought this was a scam until..."',
                        '"This changed my life in 30 days..."',
                        '"Before vs after using this..."',
                        '"I didn\'t believe it either but..."'
                    ]
                },
                {
                    title: 'Relatability Hooks',
                    content: 'Connect with shared experiences.',
                    keyPoints: [
                        '"POV: You finally found..."',
                        '"When you realize..."',
                        '"That feeling when..."',
                        '"For my [specific group] people..."'
                    ]
                }
            ],
            practiceTask: 'Write 3 hooks for your product using different formulas: 1 curiosity, 1 controversy, 1 proof.'
        },
        quizTopics: ['hook types', 'copywriting', 'viral content'],
        xpReward: 200
    },
    {
        id: 19,
        moduleId: 4,
        moduleTitle: 'Content Creation Mastery',
        title: 'Video Script Formulas',
        description: 'The structures that convert viewers to buyers',
        duration: '18 min',
        icon: '📜',
        content: {
            intro: 'Every converting video follows a structure. Memorize these frameworks and you\'ll never stare at a blank page again.',
            sections: [
                {
                    title: 'The HPPC Formula',
                    content: 'Hook → Problem → Product → CTA. The most reliable structure.',
                    keyPoints: [
                        'HOOK: Stop the scroll (0-3 sec)',
                        'PROBLEM: Agitate the pain point (3-10 sec)',
                        'PRODUCT: Show the solution (10-25 sec)',
                        'CTA: Tell them what to do (last 5 sec)'
                    ]
                },
                {
                    title: 'The Story Formula',
                    content: 'Personal narrative creates connection and trust.',
                    keyPoints: [
                        'Start with struggle/problem',
                        'Discovery of solution',
                        'Transformation/result',
                        'Invitation to same result'
                    ]
                },
                {
                    title: 'The Demo Formula',
                    content: 'Let the product sell itself through demonstration.',
                    keyPoints: [
                        'Hook showing product in action',
                        'Key features demonstration',
                        'Before/after comparison',
                        'Purchase call-to-action'
                    ]
                }
            ],
            practiceTask: 'Write a complete 30-second script using HPPC formula. Include exact timing for each section.'
        },
        quizTopics: ['video scripts', 'HPPC formula', 'content structure'],
        xpReward: 200
    },
    {
        id: 20,
        moduleId: 4,
        moduleTitle: 'Content Creation Mastery',
        title: 'Sound Design & Psychology',
        description: 'How audio drives emotion and engagement',
        duration: '15 min',
        icon: '🎵',
        content: {
            intro: 'Sound is 50% of video. The right music, voice, and sound effects trigger emotions and keep people watching. Many creators ignore this gold mine.',
            sections: [
                {
                    title: 'Music Psychology',
                    content: 'Different music creates different emotions and behaviors.',
                    keyPoints: [
                        'Upbeat music = excitement, impulse',
                        'Emotional music = connection, trust',
                        'Trending sounds = algorithm boost',
                        'No music = authenticity, rawness'
                    ]
                },
                {
                    title: 'Voice and Narration',
                    content: 'How you speak matters as much as what you say.',
                    keyPoints: [
                        'Energetic voice = excitement',
                        'Calm voice = trust, authority',
                        'Fast pace = urgency',
                        'Pauses = emphasis, curiosity'
                    ]
                },
                {
                    title: 'Sound Effects',
                    content: 'Strategic sounds emphasize key moments.',
                    keyPoints: [
                        'Whoosh sounds for transitions',
                        'Pop sounds for text appearance',
                        'Satisfying sounds for product reveals',
                        'ASMR for sensory products'
                    ]
                }
            ],
            practiceTask: 'Re-edit one of your videos with intentional sound design. Add trending music, sound effects at key moments, vary your voice pace.'
        },
        quizTopics: ['sound design', 'music psychology', 'audio production'],
        xpReward: 200
    },
    {
        id: 21,
        moduleId: 4,
        moduleTitle: 'Content Creation Mastery',
        title: 'Filming Techniques for Products',
        description: 'Make your product look irresistible',
        duration: '15 min',
        icon: '🎬',
        content: {
            intro: 'Professional-looking content builds trust and desire. You don\'t need expensive equipment—you need technique. Here\'s how to make your phone videos look premium.',
            sections: [
                {
                    title: 'Lighting Essentials',
                    content: 'Lighting is the difference between amateur and professional.',
                    keyPoints: [
                        'Natural light from window = best free option',
                        'Face the light, not away from it',
                        'Ring lights for consistent look',
                        'Avoid overhead/harsh shadows'
                    ]
                },
                {
                    title: 'Camera Movement',
                    content: 'Movement creates energy and engagement.',
                    keyPoints: [
                        'Slow zoom in = building anticipation',
                        'Quick cuts = energy, excitement',
                        'Handheld = authenticity',
                        'Product reveal with motion'
                    ]
                },
                {
                    title: 'B-Roll Magic',
                    content: 'Supplementary footage makes content professional.',
                    keyPoints: [
                        'Close-ups of product details',
                        'Hands using product',
                        'Lifestyle shots (product in real life)',
                        'Overlay while you talk'
                    ]
                }
            ],
            practiceTask: 'Film 3 versions of same product video: one with natural light, one with artificial light, one with movement. Compare results.'
        },
        quizTopics: ['filming', 'lighting', 'video production'],
        xpReward: 200
    },
    {
        id: 22,
        moduleId: 4,
        moduleTitle: 'Content Creation Mastery',
        title: 'Why Direct UGC is Dead',
        description: 'The evolution of User Generated Content',
        duration: '12 min',
        icon: '📱',
        content: {
            intro: 'Traditional UGC (obvious reviews) is losing effectiveness. Audiences have become ad-blind. The new wave is "native content" that doesn\'t feel like marketing.',
            sections: [
                {
                    title: 'The Death of Obvious UGC',
                    content: 'Consumers recognize and skip obvious ads.',
                    keyPoints: [
                        '"I love this product!" = instant skip',
                        'Over-produced = feels fake',
                        'Celebrity endorsements = trust decline',
                        'Audiences want authentic, not polished'
                    ]
                },
                {
                    title: 'The Native Content Revolution',
                    content: 'Content that feels like entertainment, not advertising.',
                    keyPoints: [
                        'Storytelling over selling',
                        'Problem-solution framing',
                        'Show, don\'t tell',
                        'Blend into For You Page naturally'
                    ]
                },
                {
                    title: 'Creating Native Ads',
                    content: 'Make your ads feel like regular content.',
                    keyPoints: [
                        'Match platform aesthetics',
                        'Use trending formats',
                        'Start with value, sell at end',
                        'Could this be a normal video from a friend?'
                    ]
                }
            ],
            practiceTask: 'Find 3 ads that don\'t feel like ads. Analyze what makes them "native." Apply same principles to your content.'
        },
        quizTopics: ['UGC', 'native content', 'advertising evolution'],
        xpReward: 200
    },
    {
        id: 23,
        moduleId: 4,
        moduleTitle: 'Content Creation Mastery',
        title: 'AI Tools for Content Production',
        description: 'Leverage AI to create content faster',
        duration: '15 min',
        icon: '🤖',
        content: {
            intro: 'AI tools can 10x your content output. Use them for scripting, editing, voiceovers, and ideation. But never replace authenticity with automation.',
            sections: [
                {
                    title: 'AI for Scripts and Copy',
                    content: 'Generate ideas and first drafts, then personalize.',
                    keyPoints: [
                        'ChatGPT/Claude: Hook ideas, script drafts',
                        'Input: Product details, target audience, emotion',
                        'Output: Multiple options to test',
                        'Always edit for authenticity'
                    ]
                },
                {
                    title: 'AI for Editing',
                    content: 'Speed up repetitive editing tasks.',
                    keyPoints: [
                        'CapCut: Auto-captions, effects',
                        'Runway: Background removal, AI editing',
                        'Opus Clip: AI clips long videos',
                        'Descript: Edit video by editing text'
                    ]
                },
                {
                    title: 'AI for Voice and Avatar',
                    content: 'Create content without being on camera.',
                    keyPoints: [
                        'ElevenLabs: Realistic voiceovers',
                        'HeyGen: AI avatar videos',
                        'Synthesia: Talking head videos',
                        'Use for testing, authenticate winners'
                    ]
                }
            ],
            practiceTask: 'Use ChatGPT to generate 10 hook ideas for your product. Test the top 3 in actual videos.'
        },
        quizTopics: ['AI tools', 'content automation', 'efficiency'],
        xpReward: 200
    },
    {
        id: 24,
        moduleId: 4,
        moduleTitle: 'Content Creation Mastery',
        title: 'Content Calendar & Posting Strategy',
        description: 'How much and when to post for maximum growth',
        duration: '12 min',
        icon: '📅',
        content: {
            intro: 'Consistency beats perfection. A regular posting schedule trains the algorithm and your audience to expect your content. Here\'s the optimal strategy.',
            sections: [
                {
                    title: 'The 3-5x Daily Rule',
                    content: 'For organic growth, volume matters more than perfection.',
                    keyPoints: [
                        'Minimum: 3 posts per day',
                        'Optimal: 5 posts per day',
                        'More posts = more lottery tickets',
                        'Not all will hit, but some will'
                    ]
                },
                {
                    title: 'Batch Creation',
                    content: 'Create content in batches for efficiency.',
                    keyPoints: [
                        'Film 10-15 videos in one session',
                        'Edit in batches',
                        'Schedule ahead using native tools',
                        '1 filming day = 1 week of content'
                    ]
                },
                {
                    title: 'Optimal Posting Times',
                    content: 'Time matters less than consistency, but here are best practices.',
                    keyPoints: [
                        'Generally: 7-9 AM, 12-2 PM, 6-9 PM',
                        'Your audience may differ—test and learn',
                        'Consistency is more important than perfect timing',
                        'Post when your audience is online'
                    ]
                }
            ],
            practiceTask: 'Create a 1-week content calendar. Plan 21 posts (3/day). Include hook, format, and posting time for each.'
        },
        quizTopics: ['content calendar', 'posting frequency', 'batch creation'],
        xpReward: 200
    },
    {
        id: 25,
        moduleId: 4,
        moduleTitle: 'Content Creation Mastery',
        title: 'Iterating on Winning Content',
        description: 'How to multiply success from one viral video',
        duration: '12 min',
        icon: '🔄',
        content: {
            intro: 'When you find a winner, don\'t move on—double down. One viral video can become 10 variations, each with potential to go viral again.',
            sections: [
                {
                    title: 'The Iteration Framework',
                    content: 'Systematically test variations of what works.',
                    keyPoints: [
                        'Same hook, different product footage',
                        'Same product, different hook',
                        'Same script, different voice/delivery',
                        'Same concept, different music'
                    ]
                },
                {
                    title: 'Testing Variables',
                    content: 'Change one thing at a time to understand what works.',
                    keyPoints: [
                        'Hook text vs no text',
                        'Voiceover vs music only',
                        'Fast cuts vs slow pacing',
                        'Call-to-action variations'
                    ]
                },
                {
                    title: 'Scaling Winners',
                    content: 'Turn organic winners into paid ad creatives.',
                    keyPoints: [
                        'Video with 100K+ views = potential ad creative',
                        'Already proven to engage',
                        'Run as Spark Ad on TikTok',
                        'Lower cost per acquisition'
                    ]
                }
            ],
            practiceTask: 'Take your best-performing video and create 5 variations by changing one element each time.'
        },
        quizTopics: ['iteration', 'A/B testing', 'content optimization'],
        xpReward: 200
    },
    {
        id: 26,
        moduleId: 4,
        moduleTitle: 'Content Creation Mastery',
        title: 'Identifying Hit Videos',
        description: 'Metrics that predict virality',
        duration: '10 min',
        icon: '📊',
        content: {
            intro: 'Not all views are created equal. Learn to read metrics that predict if a video will scale, even before it goes fully viral.',
            sections: [
                {
                    title: 'Early Indicators (First 1-6 Hours)',
                    content: 'These signals in the first hours predict success.',
                    keyPoints: [
                        'Watch time above 90% = strong',
                        'High share rate = viral potential',
                        'Comments > likes = engagement',
                        'Saves = purchase intent'
                    ]
                },
                {
                    title: 'The 3-Hour Test',
                    content: 'TikTok shows to test group first. Early performance matters.',
                    keyPoints: [
                        '1000+ views in 3 hours = good sign',
                        'Low views? Might get pushed later',
                        'Views alone don\'t matter—engagement does',
                        'Check if views are accelerating or slowing'
                    ]
                },
                {
                    title: 'Engagement Quality',
                    content: 'Not all engagement is equal.',
                    keyPoints: [
                        'Questions about product = buying intent',
                        '"Link in bio?" = highest intent',
                        'Saves = they want to buy later',
                        'Shares = bringing you new audience'
                    ]
                }
            ],
            practiceTask: 'Track your next 5 videos\' performance at 1 hour, 3 hours, and 24 hours. Note which metrics correlate with final performance.'
        },
        quizTopics: ['video metrics', 'engagement', 'viral prediction'],
        xpReward: 200
    },

    // ============ MODULE 5: PLATFORM MASTERY ============
    {
        id: 27,
        moduleId: 5,
        moduleTitle: 'Platform Mastery',
        title: 'TikTok Algorithm Deep Dive',
        description: 'How TikTok decides what goes viral',
        duration: '15 min',
        icon: '📱',
        content: {
            intro: 'TikTok shows your video to a small test group first. Based on their engagement, it decides whether to push to more people. Understanding this is key to going viral.',
            sections: [
                {
                    title: 'The Test Group System',
                    content: 'Every video starts with 200-500 views. TikTok measures engagement, then decides.',
                    keyPoints: [
                        'First 200-500 views = test group',
                        'Watch time is #1 factor',
                        'Shares > Comments > Likes',
                        'Video completion rate is critical'
                    ]
                },
                {
                    title: 'The Viral Ladder',
                    content: 'Videos climb through stages based on performance.',
                    keyPoints: [
                        '500 → 5K → 50K → 500K → millions',
                        'Each stage requires maintaining engagement',
                        'One bad tier kills momentum',
                        'Strong hook = pass first gate'
                    ]
                }
            ],
            practiceTask: 'Track your next 10 videos. Note views at 1 hour, 6 hours, and 24 hours. Identify patterns in winners vs losers.'
        },
        quizTopics: ['TikTok algorithm', 'virality', 'engagement metrics'],
        xpReward: 225
    },
    {
        id: 28,
        moduleId: 5,
        moduleTitle: 'Platform Mastery',
        title: 'Instagram Reels vs TikTok',
        description: 'Key differences and what works where',
        duration: '12 min',
        icon: '📸',
        content: {
            intro: 'Instagram and TikTok look similar but have different audiences, algorithms, and content preferences. What works on one may flop on the other.',
            sections: [
                {
                    title: 'Audience Differences',
                    content: 'Demographics and behaviors differ significantly.',
                    keyPoints: [
                        'TikTok: Younger (16-24), discovery-focused',
                        'Instagram: Older (25-34), follower-focused',
                        'TikTok: Entertainment first',
                        'Instagram: Aesthetic and lifestyle'
                    ]
                },
                {
                    title: 'Algorithm Differences',
                    content: 'Each platform prioritizes different signals.',
                    keyPoints: [
                        'TikTok: Watch time, shares',
                        'Instagram: Saves, shares, follows',
                        'TikTok: Anyone can go viral',
                        'Instagram: Favors existing followers'
                    ]
                }
            ],
            practiceTask: 'Post the same video on TikTok and Instagram Reels. Compare performance after 48 hours.'
        },
        quizTopics: ['Instagram Reels', 'platform differences', 'cross-posting'],
        xpReward: 225
    },
    {
        id: 29,
        moduleId: 5,
        moduleTitle: 'Platform Mastery',
        title: 'YouTube Shorts Strategy',
        description: 'Monetization and long-term value',
        duration: '12 min',
        icon: '▶️',
        content: {
            intro: 'YouTube Shorts has lower virality but higher long-term value. Videos stay searchable forever, unlike TikTok where content dies in days.',
            sections: [
                {
                    title: 'Shorts vs TikTok',
                    content: 'Different strengths for different goals.',
                    keyPoints: [
                        'Lower virality potential',
                        'Longer content lifespan',
                        'Better monetization',
                        'Funnels to long-form content'
                    ]
                },
                {
                    title: 'Optimization Tips',
                    content: 'YouTube Shorts has unique requirements.',
                    keyPoints: [
                        'Vertical format (9:16)',
                        '#Shorts in title or description',
                        'Under 60 seconds',
                        'Loop-friendly content'
                    ]
                }
            ],
            practiceTask: 'Repurpose your best TikTok for YouTube Shorts. Optimize title and description for search.'
        },
        quizTopics: ['YouTube Shorts', 'monetization', 'SEO'],
        xpReward: 225
    },
    {
        id: 30,
        moduleId: 5,
        moduleTitle: 'Platform Mastery',
        title: 'Multi-Platform Content Strategy',
        description: 'Repurposing content across platforms efficiently',
        duration: '15 min',
        icon: '🔄',
        content: {
            intro: 'Create once, post everywhere—but with platform-specific tweaks. Maximize reach without multiplying workload.',
            sections: [
                {
                    title: 'The Repurposing Workflow',
                    content: 'Efficient process for multi-platform posting.',
                    keyPoints: [
                        'Create for TikTok first (lowest friction)',
                        'Remove TikTok watermark for other platforms',
                        'Adjust captions/hashtags per platform',
                        'Post at optimal times for each'
                    ]
                },
                {
                    title: 'Platform-Specific Edits',
                    content: 'Small tweaks that improve performance.',
                    keyPoints: [
                        'Instagram: Add cover image',
                        'YouTube: Optimize title for search',
                        'All: Platform-native captions',
                        'Test: Same video, different hooks'
                    ]
                }
            ],
            practiceTask: 'Create a repurposing SOP: TikTok → Instagram → YouTube Shorts with specific edits for each.'
        },
        quizTopics: ['content repurposing', 'multi-platform', 'efficiency'],
        xpReward: 225
    },
    {
        id: 31,
        moduleId: 5,
        moduleTitle: 'Platform Mastery',
        title: 'Building a Content Team',
        description: 'When and how to delegate content creation',
        duration: '15 min',
        icon: '👥',
        content: {
            intro: 'You can\'t scale posting 5x/day alone forever. Learn when to hire and who to hire first.',
            sections: [
                {
                    title: 'When to Hire',
                    content: 'Timing matters—don\'t hire too early.',
                    keyPoints: [
                        'After $10K/month profit',
                        'When content creation blocks growth',
                        'When you have proven formulas',
                        'Not before you understand what works'
                    ]
                },
                {
                    title: 'Who to Hire First',
                    content: 'The ideal first hires for a content team.',
                    keyPoints: [
                        'Video editor (most time-saving)',
                        'UGC creator (fresh faces)',
                        'VA for posting/engagement',
                        'Keep strategy in-house initially'
                    ]
                }
            ],
            practiceTask: 'Write a job description for a video editor. Include style references, output expectations, and pay rate.'
        },
        quizTopics: ['team building', 'delegation', 'hiring'],
        xpReward: 225
    },
    {
        id: 32,
        moduleId: 5,
        moduleTitle: 'Platform Mastery',
        title: 'Leveraging Comments for Growth',
        description: 'Turn engagement into content ideas and sales',
        duration: '10 min',
        icon: '💬',
        content: {
            intro: 'Comments are goldmines. Every question is a content idea. Every objection is something to address. Every compliment shows what\'s working.',
            sections: [
                {
                    title: 'Mining Comments',
                    content: 'Systematically extract value from comments.',
                    keyPoints: [
                        'Questions = new video topics',
                        'Objections = things to address',
                        '"Where to buy?" = buying intent',
                        'Hate = you\'re triggering emotions'
                    ]
                },
                {
                    title: 'Comment Engagement',
                    content: 'Strategic commenting boosts algorithm.',
                    keyPoints: [
                        'Reply within first hour',
                        'Pin best comments',
                        'Heart genuine positive comments',
                        'Reply to haters (drives engagement)'
                    ]
                }
            ],
            practiceTask: 'Review your last 10 videos\' comments. List 5 content ideas from questions asked.'
        },
        quizTopics: ['engagement', 'comments', 'content ideas'],
        xpReward: 225
    },
    {
        id: 33,
        moduleId: 5,
        moduleTitle: 'Platform Mastery',
        title: 'Avoiding Shadowbans',
        description: 'Keep your account healthy and visible',
        duration: '10 min',
        icon: '⚠️',
        content: {
            intro: 'Shadowbans kill reach without warning. Learn what triggers them and how to avoid them.',
            sections: [
                {
                    title: 'What Causes Shadowbans',
                    content: 'Common triggers that reduce visibility.',
                    keyPoints: [
                        'Posting copyrighted music',
                        'Uploading with watermarks from other apps',
                        'Excessive hashtags or banned hashtags',
                        'Spammy behavior (mass following/unfollowing)'
                    ]
                },
                {
                    title: 'Prevention Best Practices',
                    content: 'Keep your account healthy.',
                    keyPoints: [
                        'Use trending sounds from the app',
                        'Remove watermarks before cross-posting',
                        'Use 3-5 relevant hashtags only',
                        'Authentic engagement patterns'
                    ]
                }
            ],
            practiceTask: 'Audit your account for shadowban risks. Check recent videos for watermarks and hashtag quality.'
        },
        quizTopics: ['shadowban', 'account health', 'platform rules'],
        xpReward: 225
    },
    {
        id: 34,
        moduleId: 5,
        moduleTitle: 'Platform Mastery',
        title: 'Going Live for Sales',
        description: 'Using live streams to boost conversions',
        duration: '12 min',
        icon: '🔴',
        content: {
            intro: 'Live selling is massive on TikTok Shop. Even without Shop access, lives build trust and drive traffic to your store.',
            sections: [
                {
                    title: 'Why Lives Work',
                    content: 'The psychology behind live selling.',
                    keyPoints: [
                        'Real-time social proof',
                        'Urgency and scarcity',
                        'Personal connection with seller',
                        'Algorithm boost for live content'
                    ]
                },
                {
                    title: 'Live Selling Tips',
                    content: 'How to run effective product lives.',
                    keyPoints: [
                        'Demonstrate product in real-time',
                        'Answer questions live',
                        'Offer live-only discounts',
                        'Pin comment with link'
                    ]
                }
            ],
            practiceTask: 'Plan a 15-minute live: outline topics, have product ready, prep 3 talking points.'
        },
        quizTopics: ['live selling', 'TikTok live', 'real-time engagement'],
        xpReward: 225
    },

    // ============ MODULE 6: STORE DESIGN & CRO ============
    {
        id: 35,
        moduleId: 6,
        moduleTitle: 'Store Design & CRO',
        title: 'High-Converting Store Design',
        description: 'Design principles that build trust and drive sales',
        duration: '15 min',
        icon: '🛍️',
        content: {
            intro: 'Your store has 3 seconds to build trust. Bad design = lost sales. Great design = conversions without extra traffic.',
            sections: [
                {
                    title: 'Trust Elements',
                    content: 'Essential components every store needs.',
                    keyPoints: [
                        'Clean, professional look',
                        'Clear contact information',
                        'Secure checkout badges',
                        'Mobile-first design (80%+ traffic)'
                    ]
                },
                {
                    title: 'Design Psychology',
                    content: 'Colors and layout that convert.',
                    keyPoints: [
                        'CTA buttons in contrasting color',
                        'Plenty of whitespace',
                        'Above-fold product hero',
                        'Social proof visible immediately'
                    ]
                }
            ],
            practiceTask: 'Audit your store on mobile. Time how long it takes to find: price, buy button, and reviews.'
        },
        quizTopics: ['store design', 'trust elements', 'conversion'],
        xpReward: 250,
        unlocksFeature: '/dashboard'
    },
    {
        id: 36,
        moduleId: 6,
        moduleTitle: 'Store Design & CRO',
        title: 'Product Page Optimization',
        description: 'The page that makes or breaks sales',
        duration: '15 min',
        icon: '📄',
        content: {
            intro: 'The product page is where decisions happen. Every element should push toward the purchase.',
            sections: [
                {
                    title: 'Above the Fold',
                    content: 'What visitors see without scrolling.',
                    keyPoints: [
                        'High-quality product images',
                        'Clear price (with strikethrough if discounted)',
                        'Add to cart button visible',
                        'Star rating and review count'
                    ]
                },
                {
                    title: 'Below the Fold',
                    content: 'Content that addresses objections.',
                    keyPoints: [
                        'Feature bullets with benefits',
                        'Customer reviews with photos',
                        'FAQ section',
                        'Shipping and returns info'
                    ]
                }
            ],
            practiceTask: 'Screenshot your product page. Mark every trust element and conversion element. Add what\'s missing.'
        },
        quizTopics: ['product page', 'CRO', 'conversion elements'],
        xpReward: 250
    },
    {
        id: 37,
        moduleId: 6,
        moduleTitle: 'Store Design & CRO',
        title: 'Checkout Optimization',
        description: 'Reduce friction and cart abandonment',
        duration: '12 min',
        icon: '💳',
        content: {
            intro: '70% of carts are abandoned. Most is preventable with proper checkout optimization.',
            sections: [
                {
                    title: 'Reducing Friction',
                    content: 'Every click loses a percentage of buyers.',
                    keyPoints: [
                        'One-page checkout',
                        'Guest checkout option',
                        'Auto-fill address',
                        'Multiple payment options'
                    ]
                },
                {
                    title: 'Trust at Checkout',
                    content: 'The moment of highest anxiety.',
                    keyPoints: [
                        'Security badges visible',
                        'Order summary clear',
                        'Return policy reminder',
                        'Support contact visible'
                    ]
                }
            ],
            practiceTask: 'Do a test checkout on your own store. Count the clicks from cart to confirmation.'
        },
        quizTopics: ['checkout', 'cart abandonment', 'friction'],
        xpReward: 250
    },
    {
        id: 38,
        moduleId: 6,
        moduleTitle: 'Store Design & CRO',
        title: 'Upsells & Cross-sells',
        description: 'Increase average order value',
        duration: '12 min',
        icon: '📈',
        content: {
            intro: 'The easiest way to increase profit is to sell more to existing customers. AOV optimization is free money.',
            sections: [
                {
                    title: 'Upsell Strategies',
                    content: 'Get customers to spend more per order.',
                    keyPoints: [
                        'Bundle deals ("Buy 2, Get 1 Free")',
                        'Volume discounts',
                        'Premium version upsell',
                        'Post-purchase one-click upsell'
                    ]
                },
                {
                    title: 'Cross-sell Strategies',
                    content: 'Suggest complementary products.',
                    keyPoints: [
                        '"Frequently bought together"',
                        'Accessories and add-ons',
                        'Consumables if applicable',
                        'Show on cart page'
                    ]
                }
            ],
            practiceTask: 'Create a bundle offer for your main product. Calculate margin vs individual sale.'
        },
        quizTopics: ['upsells', 'AOV', 'cross-sells'],
        xpReward: 250
    },
    {
        id: 39,
        moduleId: 6,
        moduleTitle: 'Store Design & CRO',
        title: 'Abandoned Cart Recovery',
        description: 'Win back lost sales automatically',
        duration: '12 min',
        icon: '🛒',
        content: {
            intro: 'Abandoned cart emails recover 5-15% of lost sales. Set them up once, profit forever.',
            sections: [
                {
                    title: 'Email Sequence',
                    content: 'The proven 3-email recovery flow.',
                    keyPoints: [
                        'Email 1: 1 hour later - Reminder',
                        'Email 2: 24 hours - Urgency',
                        'Email 3: 72 hours - Discount incentive',
                        'Each email should be different'
                    ]
                },
                {
                    title: 'SMS Recovery',
                    content: 'Higher open rates than email.',
                    keyPoints: [
                        'Requires consent (popup)',
                        'Keep messages short',
                        'Include direct link to cart',
                        'Best for younger demographics'
                    ]
                }
            ],
            practiceTask: 'Set up a 3-email abandoned cart sequence in Klaviyo or your email platform.'
        },
        quizTopics: ['abandoned cart', 'email marketing', 'recovery'],
        xpReward: 250
    },
    {
        id: 40,
        moduleId: 6,
        moduleTitle: 'Store Design & CRO',
        title: 'Analytics & Tracking Setup',
        description: 'Measure what matters',
        duration: '15 min',
        icon: '📊',
        content: {
            intro: 'You can\'t improve what you don\'t measure. Proper tracking is the foundation of optimization.',
            sections: [
                {
                    title: 'Essential Tracking',
                    content: 'Tools every store needs.',
                    keyPoints: [
                        'Meta Pixel (Facebook/Instagram)',
                        'TikTok Pixel',
                        'Google Analytics 4',
                        'Shopify Analytics'
                    ]
                },
                {
                    title: 'Key Metrics',
                    content: 'Numbers to watch weekly.',
                    keyPoints: [
                        'Conversion rate (target: 2-5%)',
                        'Average order value',
                        'Cost per acquisition',
                        'Return on ad spend (ROAS)'
                    ]
                }
            ],
            practiceTask: 'Verify all pixels are firing correctly using browser extensions or platform test tools.'
        },
        quizTopics: ['analytics', 'tracking', 'metrics'],
        xpReward: 250
    },

    // ============ MODULE 7: PAID ADVERTISING ============
    {
        id: 41,
        moduleId: 7,
        moduleTitle: 'Paid Advertising',
        title: 'When to Start Paid Ads',
        description: 'The prerequisites for profitable advertising',
        duration: '15 min',
        icon: '🎯',
        content: {
            intro: 'Paid ads can scale your business to the moon—or drain your bank account in days. Knowing WHEN to start is just as important as knowing HOW.',
            sections: [
                {
                    title: 'The Organic-First Milestone',
                    content: 'You should NEVER run paid ads before hitting these milestones.',
                    keyPoints: [
                        'Minimum $5K-10K in organic sales on ONE product',
                        'At least 50+ orders to validate product-market fit',
                        '3-5 viral videos (100K+ views) to use as ad creatives',
                        'Proven conversion rate (2%+ on your store)',
                        'Healthy margins (50%+) to absorb ad costs'
                    ]
                },
                {
                    title: 'Why Most Beginners Fail with Ads',
                    content: 'Running ads too early is the #1 cause of dropshipping failure.',
                    keyPoints: [
                        'Untested product = burning money on guesses',
                        'Unproven creatives = low engagement, high costs',
                        'Thin margins = no room for ad spend',
                        'No data = blind optimization',
                        'Result: quit after losing $500-2000'
                    ]
                },
                {
                    title: 'Signs You\'re Ready',
                    content: 'Green lights that indicate it\'s time to scale with paid.',
                    keyPoints: [
                        'Consistent organic sales (daily or near-daily)',
                        'Videos proven to convert (not just views)',
                        'Customer feedback is positive (low return rate)',
                        'You have capital to invest ($500-1000 minimum)',
                        'You\'ve exhausted organic growth potential'
                    ]
                }
            ],
            practiceTask: 'Review your organic metrics. Calculate: total organic sales, best-performing video views, current conversion rate. Are you ready for ads?'
        },
        quizTopics: ['ad readiness', 'organic validation', 'scaling prerequisites'],
        xpReward: 275,
        unlocksFeature: '/scaling'
    },
    {
        id: 42,
        moduleId: 7,
        moduleTitle: 'Paid Advertising',
        title: 'TikTok Ads Fundamentals',
        description: 'Master the fastest-growing ad platform',
        duration: '18 min',
        icon: '📱',
        content: {
            intro: 'TikTok Ads is the most powerful platform for dropshippers right now. Lower CPMs, younger audiences, and your organic winners become instant ad creatives.',
            sections: [
                {
                    title: 'Campaign Structure',
                    content: 'Understanding TikTok Ads Manager hierarchy.',
                    keyPoints: [
                        'Campaign: Objective (Conversions, Traffic, etc.)',
                        'Ad Group: Targeting, budget, schedule',
                        'Ad: The actual creative',
                        'Always use Conversions objective for sales'
                    ]
                },
                {
                    title: 'Spark Ads: Your Secret Weapon',
                    content: 'Run ads from your organic posts for better performance.',
                    keyPoints: [
                        'Spark Ads = boosting organic TikToks',
                        'Keeps social proof (likes, comments, shares)',
                        'Lower CPM than traditional ads',
                        'Use your viral organic posts as Spark Ads',
                        'Authenticity drives higher engagement'
                    ]
                },
                {
                    title: 'Beginner Campaign Setup',
                    content: 'Your first TikTok ad campaign structure.',
                    keyPoints: [
                        'Campaign: Conversion, Complete Payment',
                        'Start with $20-50/day per ad group',
                        'Broad targeting initially (let algorithm learn)',
                        'Run 3-5 creatives per ad group',
                        'Give 3-5 days before making decisions'
                    ]
                }
            ],
            practiceTask: 'Set up a TikTok Ads account. Create your first campaign structure (don\'t launch yet): 1 campaign, 1 ad group, 3 creatives.'
        },
        quizTopics: ['TikTok Ads', 'Spark Ads', 'campaign structure'],
        xpReward: 275
    },
    {
        id: 43,
        moduleId: 7,
        moduleTitle: 'Paid Advertising',
        title: 'Meta Ads Fundamentals',
        description: 'Facebook and Instagram advertising essentials',
        duration: '18 min',
        icon: '📘',
        content: {
            intro: 'Meta (Facebook/Instagram) Ads have the most sophisticated targeting and largest audience. They\'re more complex but incredibly powerful once mastered.',
            sections: [
                {
                    title: 'Meta Ads Structure',
                    content: 'The three-tier system.',
                    keyPoints: [
                        'Campaign: Objective selection',
                        'Ad Set: Targeting, placement, budget',
                        'Ad: Creative and copy',
                        'Use Sales objective with Advantage+ shopping campaigns'
                    ]
                },
                {
                    title: 'Audience Types',
                    content: 'Different ways to reach people.',
                    keyPoints: [
                        'Broad: Let Meta\'s AI find buyers (recommended for beginners)',
                        'Interest-based: Target specific interests',
                        'Lookalike: Find people similar to customers',
                        'Custom: Retarget website visitors, buyers'
                    ]
                },
                {
                    title: 'Advantage+ Campaigns',
                    content: 'Meta\'s AI-powered shopping campaigns.',
                    keyPoints: [
                        'Simplified setup, AI handles targeting',
                        'Best for stores with some data (pixel events)',
                        'Start with $50-100/day minimum',
                        'Provide 5-10 creatives for testing',
                        'Let it run 5-7 days before judging'
                    ]
                }
            ],
            practiceTask: 'Install Meta Pixel on your store. Verify it\'s tracking PageView, AddToCart, and Purchase events.'
        },
        quizTopics: ['Meta Ads', 'Facebook advertising', 'audience targeting'],
        xpReward: 275
    },
    {
        id: 44,
        moduleId: 7,
        moduleTitle: 'Paid Advertising',
        title: 'Ad Creative Best Practices',
        description: 'Create ads that convert, not just entertain',
        duration: '15 min',
        icon: '🎬',
        content: {
            intro: 'Creative is 80% of ad success. The same targeting with better creative will outperform every time. Your organic winners are your creative blueprint.',
            sections: [
                {
                    title: 'Organic-to-Paid Creative Bridge',
                    content: 'Turn your viral content into high-performing ads.',
                    keyPoints: [
                        'Videos with 100K+ views = proven hooks',
                        'High save rate = purchase intent content',
                        'Comments asking "where to buy" = ad-ready',
                        'Minor edits: add CTA, shorten if needed',
                        'Test multiple thumbnails/first frames'
                    ]
                },
                {
                    title: 'Ad Creative Formats',
                    content: 'Different formats for different goals.',
                    keyPoints: [
                        'UGC-style testimonials (highest trust)',
                        'Problem-solution demonstrations',
                        'Before/after transformations',
                        'Unboxing and first impressions',
                        'Founder story/brand message'
                    ]
                },
                {
                    title: 'Creative Testing Framework',
                    content: 'Systematically find winning ads.',
                    keyPoints: [
                        'Test 5-10 creatives per ad group',
                        'Different hooks, same product',
                        'Different formats (UGC, demo, story)',
                        'Kill losers after 1000+ impressions with low CTR',
                        'Scale winners by increasing budget 20%/day'
                    ]
                }
            ],
            practiceTask: 'Create 5 ad variations of your best-performing organic video. Vary: hook, music, CTA, and format.'
        },
        quizTopics: ['ad creative', 'creative testing', 'UGC ads'],
        xpReward: 275
    },
    {
        id: 45,
        moduleId: 7,
        moduleTitle: 'Paid Advertising',
        title: 'Targeting & Audience Building',
        description: 'Reach the right people at the right cost',
        duration: '15 min',
        icon: '🎯',
        content: {
            intro: 'Finding your buyers in a sea of scrollers is the targeting game. Modern platforms use AI to find buyers—your job is to feed it the right signals.',
            sections: [
                {
                    title: 'Broad vs Narrow Targeting',
                    content: 'When to use each approach.',
                    keyPoints: [
                        'Broad (recommended for beginners): Let AI learn',
                        'Narrow: Use after you have buyer data',
                        'Start broad, refine with Lookalikes later',
                        'Platforms are smart—trust the algorithm initially'
                    ]
                },
                {
                    title: 'Building Custom Audiences',
                    content: 'Leverage your existing data.',
                    keyPoints: [
                        'Website visitors (last 30-180 days)',
                        'Add to cart but didn\'t purchase',
                        'Past purchasers (for upsells)',
                        'Email list uploaded to platform',
                        'TikTok/Instagram engagers'
                    ]
                },
                {
                    title: 'Lookalike Audiences',
                    content: 'Find people similar to your buyers.',
                    keyPoints: [
                        'Source: Purchasers (best), Cart, PageView',
                        'Start with 1-2% (closest match)',
                        'Expand to 3-5% when 1-2% exhausted',
                        'Need 100+ purchasers for quality Lookalike',
                        'Combine with creative testing for best results'
                    ]
                }
            ],
            practiceTask: 'Set up retargeting audiences: visitors last 30 days, cart abandoners, and past customers (if any).'
        },
        quizTopics: ['targeting', 'audiences', 'Lookalikes'],
        xpReward: 275
    },
    {
        id: 46,
        moduleId: 7,
        moduleTitle: 'Paid Advertising',
        title: 'Budgeting & Scaling Ads',
        description: 'Spend smart and scale profitably',
        duration: '15 min',
        icon: '💰',
        content: {
            intro: 'The goal isn\'t to spend money—it\'s to make money. Proper budgeting prevents losses, and smart scaling maximizes wins.',
            sections: [
                {
                    title: 'Starting Budgets',
                    content: 'How much to spend when testing.',
                    keyPoints: [
                        'TikTok: $20-50/day per ad group',
                        'Meta: $20-50/day per ad set (or $100+ for Advantage+)',
                        'Test for 3-5 days minimum before decisions',
                        'Total testing budget: $200-500 for initial test',
                        'Only spend what you can afford to lose'
                    ]
                },
                {
                    title: 'Reading Your Results',
                    content: 'Key metrics that determine success.',
                    keyPoints: [
                        'CPA (Cost Per Acquisition) vs your profit margin',
                        'ROAS: Revenue ÷ Ad Spend (target 2x+ for profit)',
                        'CTR: Click-through rate (1%+ is good)',
                        'CVR: Conversion rate on landing page',
                        'If CPA > profit margin = losing money'
                    ]
                },
                {
                    title: 'Scaling Strategies',
                    content: 'Grow your winners without breaking them.',
                    keyPoints: [
                        'Vertical scaling: Increase budget 20% every 2-3 days',
                        'Horizontal scaling: Duplicate ad sets with new creatives',
                        'Never more than 20% budget increase at once',
                        'Scale what\'s working, kill what isn\'t',
                        'Watch for creative fatigue (rising CPAs)'
                    ]
                }
            ],
            practiceTask: 'Calculate your break-even CPA. If product profit is $20, what\'s the max you can spend to acquire a customer?'
        },
        quizTopics: ['ad budget', 'CPA', 'ROAS', 'scaling'],
        xpReward: 275
    },
    {
        id: 47,
        moduleId: 7,
        moduleTitle: 'Paid Advertising',
        title: 'Testing & Optimization',
        description: 'Continuously improve your ad performance',
        duration: '15 min',
        icon: '🔬',
        content: {
            intro: 'Ads aren\'t set-and-forget. Continuous testing and optimization separate profitable advertisers from money losers.',
            sections: [
                {
                    title: 'The Testing Cycle',
                    content: 'Systematic approach to improvement.',
                    keyPoints: [
                        'Week 1: Launch tests (5+ creatives)',
                        'Week 2: Analyze, kill losers, keep winners',
                        'Week 3: Create variations of winners',
                        'Week 4: Scale winners, test new concepts',
                        'Repeat forever—never stop testing'
                    ]
                },
                {
                    title: 'What to Test',
                    content: 'Variables that impact performance.',
                    keyPoints: [
                        'Hooks (first 3 seconds)',
                        'Music and voiceover style',
                        'CTA text and placement',
                        'Ad copy (headline, primary text)',
                        'Audiences and placements'
                    ]
                },
                {
                    title: 'Troubleshooting Common Issues',
                    content: 'Diagnose and fix underperforming ads.',
                    keyPoints: [
                        'Low CTR = weak hook or wrong audience',
                        'High CTR, low CVR = landing page issue',
                        'High CPA = creative fatigue or targeting',
                        'No delivery = budget too low or audience too narrow',
                        'Account disabled = policy violation, appeal'
                    ]
                }
            ],
            practiceTask: 'Audit your current ads. For each, note: CTR, CPA, ROAS. Identify 1 thing to test for improvement.'
        },
        quizTopics: ['ad testing', 'optimization', 'troubleshooting'],
        xpReward: 275
    },

    // ============ MODULE 8: SCALING & BRAND BUILDING ============
    {
        id: 48,
        moduleId: 8,
        moduleTitle: 'Scaling & Brand Building',
        title: 'From Product to Brand',
        description: 'Transform your one-hit wonder into a lasting business',
        duration: '15 min',
        icon: '🏢',
        content: {
            intro: 'A product business is fragile. A brand is resilient. Learn to build something that lasts beyond any single viral moment.',
            sections: [
                {
                    title: 'Product vs Brand',
                    content: 'Understanding the fundamental difference.',
                    keyPoints: [
                        'Product: Sells features, competes on price',
                        'Brand: Sells identity, commands premium',
                        'Product: One viral hit away from death',
                        'Brand: Multiple products, loyal customers',
                        'Goal: Build a brand, not just sell products'
                    ]
                },
                {
                    title: 'Elements of a Brand',
                    content: 'What makes a brand more than a store.',
                    keyPoints: [
                        'Mission: Why you exist beyond profit',
                        'Identity: Visual style, voice, personality',
                        'Experience: How customers feel buying from you',
                        'Community: Customers who identify with your brand',
                        'Story: Origin, values, and vision'
                    ]
                },
                {
                    title: 'The Transition',
                    content: 'How to evolve from dropshipper to brand.',
                    keyPoints: [
                        'Find your winning product category',
                        'Develop brand identity around it',
                        'Move to private label/custom products',
                        'Build email/SMS list for owned audience',
                        'Create content ecosystem beyond product ads'
                    ]
                }
            ],
            practiceTask: 'Write your brand mission statement. Why does your store exist? Who do you serve? What do you stand for?'
        },
        quizTopics: ['branding', 'brand building', 'business evolution'],
        xpReward: 300
    },
    {
        id: 49,
        moduleId: 8,
        moduleTitle: 'Scaling & Brand Building',
        title: 'Building Customer Loyalty',
        description: 'Turn one-time buyers into lifelong customers',
        duration: '15 min',
        icon: '❤️',
        content: {
            intro: 'Acquiring a new customer costs 5-7x more than keeping an existing one. Customer retention is the key to sustainable profit.',
            sections: [
                {
                    title: 'The Customer Journey',
                    content: 'Mapping the experience from first click to repeat buyer.',
                    keyPoints: [
                        'Discovery → Purchase → Delivery → Use → Repeat',
                        'Each stage is an opportunity to wow',
                        'Surprise and delight creates loyalty',
                        'Bad experience at any stage = lost customer'
                    ]
                },
                {
                    title: 'Exceeding Expectations',
                    content: 'Small touches that create lasting impressions.',
                    keyPoints: [
                        'Personal thank-you notes in packages',
                        'Fast shipping (underpromise, overdeliver)',
                        'Beautiful unboxing experience',
                        'Follow-up emails checking satisfaction',
                        'Easy returns process (builds trust)'
                    ]
                },
                {
                    title: 'Building Community',
                    content: 'Create a tribe around your brand.',
                    keyPoints: [
                        'VIP customer groups (Facebook, Discord)',
                        'User-generated content features',
                        'Loyalty/rewards programs',
                        'Early access to new products',
                        'Customer celebration and recognition'
                    ]
                }
            ],
            practiceTask: 'Map your current customer journey. Identify 3 "moments of truth" where you can exceed expectations.'
        },
        quizTopics: ['customer loyalty', 'retention', 'customer experience'],
        xpReward: 300
    },
    {
        id: 50,
        moduleId: 8,
        moduleTitle: 'Scaling & Brand Building',
        title: 'Email & SMS Marketing Mastery',
        description: 'Own your audience and sell on autopilot',
        duration: '18 min',
        icon: '📧',
        content: {
            intro: 'Social platforms can change algorithms overnight. Email and SMS are channels you OWN. Build them early, profit forever.',
            sections: [
                {
                    title: 'Building Your List',
                    content: 'Capture leads at every opportunity.',
                    keyPoints: [
                        'Pop-up: 10-15% off first order for email',
                        'SMS consent at checkout',
                        'Exit-intent popups',
                        'Content upgrades and guides',
                        'Target: Email from 5-10% of visitors'
                    ]
                },
                {
                    title: 'Essential Email Flows',
                    content: 'Automated sequences that run 24/7.',
                    keyPoints: [
                        'Welcome series: Brand intro + first purchase nudge',
                        'Abandoned cart: 3-email recovery sequence',
                        'Post-purchase: Thank you + cross-sell',
                        'Win-back: Re-engage lapsed customers',
                        'VIP: Exclusive access for top customers'
                    ]
                },
                {
                    title: 'SMS Strategy',
                    content: 'High open rates, high conversion—use wisely.',
                    keyPoints: [
                        'Abandoned cart reminder (highest ROI)',
                        'Flash sales and limited offers',
                        'Shipping updates',
                        'Max 4-6 SMS per month (avoid unsubscribes)',
                        'Always provide value, not just sales'
                    ]
                }
            ],
            practiceTask: 'Set up Klaviyo (or similar). Create welcome series: Email 1 (brand story), Email 2 (best seller), Email 3 (discount).'
        },
        quizTopics: ['email marketing', 'SMS', 'automation'],
        xpReward: 300
    },
    {
        id: 51,
        moduleId: 8,
        moduleTitle: 'Scaling & Brand Building',
        title: 'Team Building & SOPs',
        description: 'Remove yourself as the bottleneck',
        duration: '15 min',
        icon: '👥',
        content: {
            intro: 'You can\'t scale by working more hours. At some point, you MUST build a team. The key is knowing what to delegate first.',
            sections: [
                {
                    title: 'What to Delegate First',
                    content: 'Tasks that don\'t require founder involvement.',
                    keyPoints: [
                        '1. Customer service responses',
                        '2. Order fulfillment and tracking',
                        '3. Video editing and content posting',
                        '4. Basic bookkeeping',
                        'Keep: Strategy, brand voice, key decisions'
                    ]
                },
                {
                    title: 'Creating SOPs',
                    content: 'Standard Operating Procedures = consistent quality.',
                    keyPoints: [
                        'Document every repeatable process',
                        'Screen record your workflow',
                        'Include decision trees for edge cases',
                        'Update SOPs as you improve processes',
                        'Tools: Notion, Loom, Google Docs'
                    ]
                },
                {
                    title: 'Hiring Smart',
                    content: 'Find and retain great people.',
                    keyPoints: [
                        'Start with contractors, not employees',
                        'Philippines VAs: Great value for service/ops',
                        'Upwork/Fiverr for specialists',
                        'Trial period before committing',
                        'Pay fairly—good talent pays for itself'
                    ]
                }
            ],
            practiceTask: 'Create your first SOP: customer service response templates. Document: common questions, approved answers, escalation rules.'
        },
        quizTopics: ['delegation', 'SOPs', 'hiring'],
        xpReward: 300
    },
    {
        id: 52,
        moduleId: 8,
        moduleTitle: 'Scaling & Brand Building',
        title: 'Financial Management',
        description: 'Master your numbers for sustainable growth',
        duration: '15 min',
        icon: '💰',
        content: {
            intro: 'Revenue is vanity, profit is sanity, cash flow is reality. Understand your finances or risk going broke while "scaling."',
            sections: [
                {
                    title: 'Key Financial Metrics',
                    content: 'Numbers every founder must know.',
                    keyPoints: [
                        'Gross margin: Revenue - COGS / Revenue',
                        'Net profit: After ALL expenses',
                        'LTV: Customer lifetime value',
                        'CAC: Customer acquisition cost',
                        'LTV:CAC ratio (target 3:1 or higher)'
                    ]
                },
                {
                    title: 'Cash Flow Management',
                    content: 'Don\'t run out of money while growing.',
                    keyPoints: [
                        'Money in account ≠ profit',
                        'Reserve for refunds and chargebacks',
                        'Ad spend comes before revenue',
                        'Maintain 2-3 months operating expenses',
                        'Reinvest profits wisely, not blindly'
                    ]
                },
                {
                    title: 'Profit Optimization',
                    content: 'Beyond revenue—actually keeping money.',
                    keyPoints: [
                        'Negotiate with suppliers at volume',
                        'Reduce refunds with better products',
                        'Increase AOV with bundles/upsells',
                        'Cut underperforming ad campaigns',
                        'Automate to reduce labor costs'
                    ]
                }
            ],
            practiceTask: 'Calculate your true net profit for last month. Include: product cost, shipping, fees, ads, software, refunds.'
        },
        quizTopics: ['finance', 'cash flow', 'profitability'],
        xpReward: 300
    },
    {
        id: 53,
        moduleId: 8,
        moduleTitle: 'Scaling & Brand Building',
        title: 'Legal & Business Structure',
        description: 'Protect yourself and your business',
        duration: '12 min',
        icon: '⚖️',
        content: {
            intro: 'As you grow, legal structure matters. Protect your personal assets, stay compliant, and build a real business entity.',
            sections: [
                {
                    title: 'Business Entity',
                    content: 'Separate yourself from your business.',
                    keyPoints: [
                        'LLC: Most common for small ecommerce',
                        'Sole Prop: Easiest but no protection',
                        'S-Corp: Tax advantages at higher income',
                        'Consult an accountant for your situation',
                        'Register in business-friendly state (WY, DE)'
                    ]
                },
                {
                    title: 'Legal Compliance',
                    content: 'Stay on the right side of the law.',
                    keyPoints: [
                        'Privacy policy and terms of service',
                        'GDPR compliance for EU customers',
                        'FTC disclosure for testimonials',
                        'Proper business licenses',
                        'Sales tax collection (Nexus rules)'
                    ]
                },
                {
                    title: 'Intellectual Property',
                    content: 'Protect your brand.',
                    keyPoints: [
                        'Trademark your brand name and logo',
                        'Avoid selling trademarked products',
                        'DMCA takedowns for content theft',
                        'Document your original content',
                        'Consult IP lawyer as you scale'
                    ]
                }
            ],
            practiceTask: 'Research LLC requirements in your state. List: registration cost, annual fees, and filing requirements.'
        },
        quizTopics: ['legal', 'LLC', 'compliance'],
        xpReward: 300
    },
    {
        id: 54,
        moduleId: 8,
        moduleTitle: 'Scaling & Brand Building',
        title: 'Long-Term Vision & Exit Strategies',
        description: 'Build for the future you want',
        duration: '15 min',
        icon: '🚀',
        content: {
            intro: 'What\'s the endgame? Whether you want passive income, a sellable asset, or a legacy brand—plan for it now.',
            sections: [
                {
                    title: 'Defining Your Exit',
                    content: 'Know your goal to plan the path.',
                    keyPoints: [
                        'Lifestyle business: Sustainable income, work-life balance',
                        'Exit: Sell business for lump sum',
                        'Empire: Build portfolio of brands',
                        'Different goals = different strategies',
                        'Define success on YOUR terms'
                    ]
                },
                {
                    title: 'Building Sellable Assets',
                    content: 'What buyers look for.',
                    keyPoints: [
                        'Consistent profit (12+ months track record)',
                        'Systems that run without you',
                        'Diversified traffic sources',
                        'Owned audience (email, SMS)',
                        'Clean financials and documentation'
                    ]
                },
                {
                    title: 'Valuation Basics',
                    content: 'What is your business worth?',
                    keyPoints: [
                        'Ecommerce typically: 2-4x annual profit',
                        'Strong brand: Higher multiple',
                        'Founder-dependent: Lower multiple',
                        'Marketplace: Flippa, Empire Flippers, FE International',
                        'Start documenting everything now'
                    ]
                }
            ],
            practiceTask: 'Write your 3-year vision. Where do you want the business to be? What role do you want to play?'
        },
        quizTopics: ['exit strategy', 'business valuation', 'long-term planning'],
        xpReward: 300
    },
    // Module 9: Supplier Management & Logistics
    {
        id: 55,
        moduleId: 9,
        moduleTitle: 'Supplier Management & Logistics',
        title: 'Finding the Right Suppliers',
        description: 'Beyond AliExpress: modern supplier platforms and vetting',
        duration: '18 min',
        icon: '🔍',
        content: {
            intro: 'Your supplier is your silent business partner. A great supplier can make your business run like clockwork; a bad one can destroy your reputation overnight with damaged products and 45-day shipping times.',
            sections: [
                {
                    title: 'Modern Supplier Platforms in 2024',
                    content: 'The dropshipping landscape has evolved far beyond AliExpress. New platforms offer faster shipping, better quality control, and native integrations.',
                    keyPoints: [
                        'CJ Dropshipping: 25+ global warehouses, quality inspection before shipping, custom packaging from MOQ of 1',
                        'Zendrop: US-based fulfillment (2-5 day delivery), 127-point quality checklist, "Zendrop Certified" badges',
                        'Spocket: 30-60% off retail from US/EU suppliers, branded invoicing, 2-7 day shipping',
                        'EPROLO: Custom branding with no MOQ, sewn-in labels, hangtags, and packaging',
                        'DSers: Official AliExpress partner, bulk order processing (hundreds of orders in seconds)',
                        'AutoDS: 25+ supplier integrations including Amazon, Walmart, Home Depot for US fulfillment'
                    ]
                },
                {
                    title: 'Vetting Suppliers Like a Pro',
                    content: 'Never commit to a supplier without thorough vetting. The upfront work saves you from disasters later.',
                    keyPoints: [
                        'Always order samples: Evaluate packaging, product quality, and actual shipping times',
                        'Check supplier ratings: Look for 95%+ positive feedback and 6+ months of history',
                        'Test communication: Send questions at different times—response speed matters',
                        'Review return policies: Align your store policy with what the supplier actually accepts',
                        'Check processing times: Order-to-ship time matters more than shipping-to-delivery',
                        'Verify inventory stability: Suppliers with consistent stock prevent overselling nightmares'
                    ]
                },
                {
                    title: 'Building a Multi-Supplier Strategy',
                    content: 'Never rely on a single supplier. Diversification protects you from stockouts, price hikes, and quality drops.',
                    keyPoints: [
                        'Primary + backup suppliers: Have at least 2 suppliers for your best sellers',
                        'Geographic diversification: US/EU suppliers for speed, Asia for margin on slower-selling items',
                        'Seasonal switching: Some suppliers handle holiday volume better than others',
                        'Price leverage: Multiple suppliers give you negotiating power'
                    ]
                }
            ],
            practiceTask: 'Choose one of your products and find 3 potential suppliers across different platforms. Order samples from at least 2 and document: shipping time, packaging quality, product accuracy, and communication experience.'
        },
        quizTopics: ['supplier platforms', 'vetting process', 'multi-supplier strategy'],
        xpReward: 325
    },
    {
        id: 56,
        moduleId: 9,
        moduleTitle: 'Supplier Management & Logistics',
        title: 'Negotiating with Suppliers',
        description: 'Getting better prices, terms, and priority treatment',
        duration: '15 min',
        icon: '🤝',
        content: {
            intro: 'Once you have volume, you have leverage. Even small dropshippers can negotiate better terms—most just never ask. Suppliers expect negotiation; it is part of doing business in e-commerce.',
            sections: [
                {
                    title: 'When and What to Negotiate',
                    content: 'Timing and approach are everything in supplier negotiations.',
                    keyPoints: [
                        'Wait until you have 50-100 orders with a supplier before negotiating',
                        'Start with small wins: free shipping on orders over X, or 5-10% discount on best sellers',
                        'Negotiate processing priority before major sales events (Black Friday)',
                        'Ask for exclusive pricing on high-volume products',
                        'Request better packaging or custom inserts at scale',
                        'Negotiate return policies: who pays return shipping, restocking fees'
                    ]
                },
                {
                    title: 'Building Long-Term Relationships',
                    content: 'The best suppliers become partners. Relationships unlock benefits you cannot negotiate directly.',
                    keyPoints: [
                        'Communicate consistently: Regular orders and professional communication build trust',
                        'Pay on time: Payment reliability gets you priority treatment during shortages',
                        'Provide feedback: Help suppliers improve and they will prioritize your orders',
                        'Share your growth plans: Suppliers invest in growing accounts',
                        'Be exclusive when it makes sense: Guaranteed volume earns better margins',
                        'Refer other sellers: Some suppliers reward referrals with better terms'
                    ]
                },
                {
                    title: 'Negotiation Scripts That Work',
                    content: 'Direct, professional communication gets results. Here are proven approaches.',
                    keyPoints: [
                        '"We have been ordering X units monthly. What volume discount can you offer for 2X?"',
                        '"Competitor is offering $Y per unit. Can you match or beat this?"',
                        '"We are planning a major campaign. Can you guarantee 24-hour processing?"',
                        '"We would like branded packaging. What is the MOQ and cost?"',
                        '"What terms do your top 10 customers get? How do we qualify?"'
                    ]
                }
            ],
            practiceTask: 'Draft a negotiation email to your top supplier asking for a 10% discount on your best-selling product. Include your order history and future volume projections.'
        },
        quizTopics: ['negotiation timing', 'relationship building', 'negotiation tactics'],
        xpReward: 325
    },
    {
        id: 57,
        moduleId: 9,
        moduleTitle: 'Supplier Management & Logistics',
        title: 'Quality Control Systems',
        description: 'Preventing defects, damages, and customer complaints',
        duration: '15 min',
        icon: '✅',
        content: {
            intro: 'Quality issues are margin killers. A 10% defect rate means 10% of your revenue goes to refunds, replacements, and angry customers. Proactive quality control is cheaper than reactive damage control.',
            sections: [
                {
                    title: 'Setting Quality Standards',
                    content: 'Define what "acceptable" means before you receive complaints.',
                    keyPoints: [
                        'Create a quality checklist: Specific criteria for each product category',
                        'Define defect categories: Critical (refund), Major (replacement), Minor (acceptable)',
                        'Set acceptable defect rates: Industry standard is under 2-3%',
                        'Document packaging requirements: Protection levels for fragile items',
                        'Establish photo/video requirements: Visual proof of quality before shipping',
                        'Create supplier scorecards: Track defect rates by supplier monthly'
                    ]
                },
                {
                    title: 'Pre-Shipment Inspection',
                    content: 'Quality platforms and agents can inspect before products ship to customers.',
                    keyPoints: [
                        'CJ Dropshipping quality review: Items inspected before shipping, reducing returns',
                        'Zendrop 127-point checklist: Comprehensive quality verification',
                        'Third-party inspection services: For private label or bulk orders',
                        'Photo confirmation: Request photos of actual items before high-value orders ship',
                        'Batch testing: Order from new suppliers to your own address first'
                    ]
                },
                {
                    title: 'Handling Quality Failures',
                    content: 'When quality issues occur—and they will—have a systematic response.',
                    keyPoints: [
                        'Immediate customer response: Acknowledge within 2 hours',
                        'Gather evidence: Request photos/videos from customer',
                        'Supplier communication: Document everything for dispute resolution',
                        'Decide resolution: Refund, replacement, or partial refund',
                        'Update quality protocols: Every failure should improve your system',
                        'Consider supplier termination: Repeated issues warrant replacement'
                    ]
                }
            ],
            practiceTask: 'Create a quality checklist for your top 3 products. Include at least 10 inspection points for each (packaging, appearance, functionality, accessories, etc.).'
        },
        quizTopics: ['quality standards', 'pre-shipment inspection', 'defect handling'],
        xpReward: 325
    },
    {
        id: 58,
        moduleId: 9,
        moduleTitle: 'Supplier Management & Logistics',
        title: 'Shipping Strategies & Speed',
        description: 'Fast delivery without killing margins',
        duration: '18 min',
        icon: '🚚',
        content: {
            intro: '61% of customers expect orders within 3 days. Long shipping times are conversion killers and refund generators. But fast shipping does not have to destroy your margins if you strategize.',
            sections: [
                {
                    title: 'Understanding Shipping Options',
                    content: 'Know the trade-offs between speed, cost, and reliability for each method.',
                    keyPoints: [
                        'ePacket: 7-20 days, affordable, tracking to 40+ countries, max 4.4 lbs',
                        'AliExpress Standard: 15-45 days, cheapest option, inconsistent',
                        'CJ Packet: 7-15 days, CJ Dropshipping alternative to ePacket',
                        'Express (DHL/FedEx/UPS): 3-7 days, expensive, premium option',
                        'Domestic fulfillment: 1-5 days, Zendrop US warehouse, Spocket US/EU suppliers',
                        'Carrier calculated shipping: Let customers choose speed vs cost'
                    ]
                },
                {
                    title: 'The Domestic Supplier Advantage',
                    content: 'US and EU-based suppliers are game changers for conversion rates.',
                    keyPoints: [
                        'Zendrop US fulfillment: 2-5 day delivery, no customs delays',
                        'Spocket: 80% US/EU suppliers, 2-7 day shipping average',
                        'Sellvia: US-based catalog designed for fast shipping',
                        'Higher costs but higher conversions and fewer refunds',
                        'Best for winning products after validation',
                        'Use China suppliers for testing, domestic for scaling'
                    ]
                },
                {
                    title: 'Setting Customer Expectations',
                    content: 'Transparency prevents complaints. Underpromise and overdeliver.',
                    keyPoints: [
                        'Display shipping times clearly on product pages',
                        'Send order confirmation with realistic delivery window',
                        'Provide tracking links proactively',
                        'Send "shipped" notification with tracking',
                        'Create FAQ page addressing shipping questions',
                        'Consider guaranteed delivery dates for premium shipping'
                    ]
                }
            ],
            practiceTask: 'Calculate the true cost-per-order for 3 delivery speeds (standard, expedited, express) including product cost, shipping, and estimated return rate differential. Determine which makes sense for your margins.'
        },
        quizTopics: ['shipping methods', 'domestic suppliers', 'customer expectations'],
        xpReward: 325
    },
    {
        id: 59,
        moduleId: 9,
        moduleTitle: 'Supplier Management & Logistics',
        title: 'Automation & Order Fulfillment',
        description: 'Tools that run your operations on autopilot',
        duration: '18 min',
        icon: '⚙️',
        content: {
            intro: 'At scale, manual order processing is impossible. One person can manage 100+ orders per day with the right automation. The tools you choose determine your ceiling for growth.',
            sections: [
                {
                    title: 'Order Processing Automation',
                    content: 'Eliminate manual data entry and reduce errors to near zero.',
                    keyPoints: [
                        'AutoDS: Auto-order to 25+ suppliers, tracking auto-sync, price monitoring',
                        'DSers: Bulk order to AliExpress (hundreds of orders in seconds)',
                        'Zendrop: One-click fulfillment, automatic tracking updates',
                        'CJ Dropshipping: Order sync, inventory monitoring, auto-fulfillment',
                        'Fulfilled by AutoDS: Hands-off order management service',
                        'Dropified: Auto-fulfill from 50+ marketplaces'
                    ]
                },
                {
                    title: 'Inventory Sync & Price Monitoring',
                    content: 'Never sell out-of-stock items or lose margin to price changes.',
                    keyPoints: [
                        'Real-time stock sync: Prevent overselling with live inventory updates',
                        'Price change alerts: Know immediately when costs change',
                        'Auto-price adjustment: Rules-based pricing maintains margins automatically',
                        'Multi-store management: Sync inventory across Shopify, eBay, Amazon',
                        'Low stock notifications: Reorder alerts before stockouts',
                        'Supplier switching: Auto-route orders to backup suppliers when primary is out'
                    ]
                },
                {
                    title: 'Choosing the Right Tool Stack',
                    content: 'Match tools to your business model and primary suppliers.',
                    keyPoints: [
                        'AliExpress-focused: DSers is the official partner, optimized for this platform',
                        'Multi-supplier: AutoDS for flexibility across 25+ suppliers',
                        'US fulfillment priority: Zendrop or Spocket',
                        'WooCommerce: AliDropship or WooDropship plugins',
                        'TikTok Shop: CJ Dropshipping has native integration',
                        'Scale consideration: Start free tiers, upgrade as volume justifies'
                    ]
                }
            ],
            practiceTask: 'Sign up for free trials of both DSers and AutoDS. Process 5 test orders through each and compare: ease of use, speed, tracking sync, and error rate.'
        },
        quizTopics: ['order automation', 'inventory management', 'tool selection'],
        xpReward: 325
    },
    {
        id: 60,
        moduleId: 9,
        moduleTitle: 'Supplier Management & Logistics',
        title: 'Private Label & White Label Basics',
        description: 'Custom branding without manufacturing',
        duration: '15 min',
        icon: '🏷️',
        content: {
            intro: 'Private and white label dropshipping let you build a real brand without owning inventory. Custom packaging and branding transform a commodity product into YOUR product—commanding higher prices and customer loyalty.',
            sections: [
                {
                    title: 'White Label vs Private Label',
                    content: 'Understand the spectrum of customization options.',
                    keyPoints: [
                        'White label: Generic product with your logo/packaging, same product as competitors',
                        'Private label: Custom or modified product exclusive to your brand',
                        'White label is faster and cheaper to start',
                        'Private label offers better differentiation but higher MOQs',
                        'Many suppliers offer both options with different minimums',
                        'Start white label, graduate to private label with winning products'
                    ]
                },
                {
                    title: 'Branding Options Available',
                    content: 'Modern suppliers offer surprising levels of customization, even at low volumes.',
                    keyPoints: [
                        'Custom packaging: Branded boxes, bags, and inserts',
                        'Logo placement: Printed, sewn-in labels, or embossed',
                        'Thank-you cards: Personalized inserts with your branding',
                        'Tissue paper and stickers: Premium unboxing experience',
                        'Remove supplier branding: No-branding packaging available',
                        'Custom product colors/variants: Limited customization without true private label'
                    ]
                },
                {
                    title: 'Suppliers for Branded Dropshipping',
                    content: 'These platforms specialize in branded fulfillment with low or no MOQs.',
                    keyPoints: [
                        'EPROLO: No MOQ for sewn-in labels, hangtags, packaging',
                        'CJ Dropshipping: Custom packaging from MOQ of 1 (some items)',
                        'Printful: Print-on-demand with full branding suite',
                        'Blanka (beauty): Cruelty-free cosmetics, no minimums',
                        'Supliful (supplements): FDA-compliant, customizable labels',
                        'Dripshipper (coffee): US-roasted, branded coffee pouches'
                    ]
                }
            ],
            practiceTask: 'Design a branded package insert (thank-you card) for your store. Include a discount code for repeat purchase, social media handles, and a personal message. Get it printed and send with your next 10 orders.'
        },
        quizTopics: ['white label vs private label', 'branding options', 'branded suppliers'],
        xpReward: 325
    },
    {
        id: 61,
        moduleId: 9,
        moduleTitle: 'Supplier Management & Logistics',
        title: 'Returns, Disputes & Problems',
        description: 'Handling the inevitable issues professionally',
        duration: '15 min',
        icon: '🔄',
        content: {
            intro: 'Returns and disputes happen to everyone. How you handle them determines whether customers become repeat buyers or charge back and leave 1-star reviews. A systematic approach turns problems into opportunities.',
            sections: [
                {
                    title: 'Creating Your Return Policy',
                    content: 'Your policy must balance customer experience with supplier limitations.',
                    keyPoints: [
                        'Align with supplier: Your policy cannot exceed what suppliers accept',
                        'Clear return window: 14-30 days is standard for dropshipping',
                        'Condition requirements: Original packaging, unused, with tags',
                        'Who pays return shipping: Customer for buyer remorse, you for defects',
                        'Refund timeline: State exactly when refunds process (7-10 business days)',
                        'Make it findable: Link in footer, checkout page, and order confirmation'
                    ]
                },
                {
                    title: 'The Returnless Refund Strategy',
                    content: 'Sometimes it costs more to process a return than to refund and let customers keep the item.',
                    keyPoints: [
                        'Calculate true return cost: Return shipping + restocking + processing time',
                        'Set a threshold: Items under $15-20 often are not worth returning',
                        'Partial refunds: Offer 30-50% refund to keep the item',
                        'Store credit: Encourage future purchases instead of cash refunds',
                        'Building goodwill: Returnless refunds generate positive reviews',
                        'Document everything: Still request photos for supplier disputes'
                    ]
                },
                {
                    title: 'Supplier Dispute Resolution',
                    content: 'When suppliers cause problems, you need evidence and process.',
                    keyPoints: [
                        'Document everything: Save all communication, order details, photos',
                        'Use platform dispute systems: AliExpress, CJ, etc. have formal processes',
                        'Request refunds for defective items: Most suppliers have defect policies',
                        'Escalate appropriately: Start polite, escalate if unresolved',
                        'Know your leverage: Order volume and payment history matter',
                        'Final resort: Dispute via payment processor if supplier is unresponsive'
                    ]
                }
            ],
            practiceTask: 'Write your return policy. Include: return window, condition requirements, return shipping responsibility, refund timeline, and process for defective items. Post it on your store.'
        },
        quizTopics: ['return policy', 'returnless refunds', 'supplier disputes'],
        xpReward: 325
    },
    // Module 10: Customer Service Excellence
    {
        id: 62,
        moduleId: 10,
        moduleTitle: 'Customer Service Excellence',
        title: 'Support Fundamentals',
        description: 'Building a customer service system that scales',
        duration: '15 min',
        icon: '💬',
        content: {
            intro: '89% of consumers switch to competitors after poor customer service. In dropshipping, where you do not control fulfillment, excellent service is your main differentiator. It is also your best defense against chargebacks and negative reviews.',
            sections: [
                {
                    title: 'Response Time Standards',
                    content: 'Speed is everything. Customers expect faster responses than ever before.',
                    keyPoints: [
                        'Email: Respond within 24 hours maximum, 2-4 hours ideal',
                        'Live chat: Under 2 minutes during business hours',
                        'Social media: Within 1 hour for public comments',
                        'Set expectations: Auto-responders with realistic timelines',
                        'After hours: Acknowledge receipt with next-day response promise',
                        'Track metrics: Measure first response time and resolution time'
                    ]
                },
                {
                    title: 'Multi-Channel Support Setup',
                    content: 'Meet customers where they are. Different channels for different purposes.',
                    keyPoints: [
                        'Email: Complex issues, documentation, formal responses',
                        'Live chat: Quick questions, pre-sale support, cart abandonment recovery',
                        'FAQ page: Self-service for common questions (reduces tickets 30-50%)',
                        'Social media: Brand building, public issue resolution',
                        'Phone (optional): High-ticket items or complex B2B sales',
                        'Centralize everything: Use helpdesk software to manage all channels'
                    ]
                },
                {
                    title: 'Building Your Support Team',
                    content: 'You cannot do everything forever. Plan for growth.',
                    keyPoints: [
                        'Start solo: Handle everything yourself to understand patterns',
                        'Document everything: Create SOPs before hiring',
                        'First hire: Virtual assistant for simple inquiries (8-15/hour via Upwork)',
                        'Use templates: Pre-written responses for 80% of inquiries',
                        'Escalation process: Clear rules for when to involve you',
                        'Quality checks: Review random tickets weekly'
                    ]
                }
            ],
            practiceTask: 'Set up a helpdesk (try free tiers of Freshdesk, Tidio, or Zendesk). Create 10 template responses for your most common questions. Track your average response time for one week.'
        },
        quizTopics: ['response standards', 'multi-channel support', 'team building'],
        xpReward: 350
    },
    {
        id: 63,
        moduleId: 10,
        moduleTitle: 'Customer Service Excellence',
        title: 'Handling Refunds Professionally',
        description: 'Turning refund requests into retention opportunities',
        duration: '15 min',
        icon: '💸',
        content: {
            intro: 'Refunds are not failures—they are opportunities. How you handle a refund request often determines whether that customer buys from you again or warns everyone they know to avoid you.',
            sections: [
                {
                    title: 'The Refund Request Process',
                    content: 'A systematic approach ensures consistency and protects both you and the customer.',
                    keyPoints: [
                        'Acknowledge immediately: Thank them for reaching out within 2 hours',
                        'Understand the issue: Ask clarifying questions before offering solutions',
                        'Gather evidence: Request photos/videos for damaged or wrong items',
                        'Offer options: Refund, replacement, store credit, or partial refund',
                        'Processing timeline: State exactly when they will receive their money',
                        'Follow up: Confirm resolution and ask if there is anything else'
                    ]
                },
                {
                    title: 'Alternatives to Full Refunds',
                    content: 'Often customers want the problem solved, not their money back.',
                    keyPoints: [
                        'Replacement: Fastest solution for defective products',
                        'Store credit + bonus: Offer 110-120% of value as store credit',
                        'Partial refund: "Keep the item, here is 30% back" for minor issues',
                        'Upgrade: Send a better version of the product',
                        'Future discount: Discount code for next purchase',
                        'Bundle offer: Add free product to make it right'
                    ]
                },
                {
                    title: 'When to Refund Without Question',
                    content: 'Sometimes fighting a refund costs more than granting it.',
                    keyPoints: [
                        'Obvious shipping failures: Lost packages, extreme delays',
                        'Product completely wrong: Different item entirely',
                        'Safety concerns: Defects that could harm the customer',
                        'Repeat customers: Their lifetime value exceeds one order',
                        'Potential influencer: Their social reach matters',
                        'Items under $15-20: Processing cost exceeds product cost'
                    ]
                }
            ],
            practiceTask: 'Create a flowchart for handling refund requests. Include decision points for: replacement vs refund, full vs partial, and when to escalate. Share with any team members.'
        },
        quizTopics: ['refund process', 'refund alternatives', 'refund thresholds'],
        xpReward: 350
    },
    {
        id: 64,
        moduleId: 10,
        moduleTitle: 'Customer Service Excellence',
        title: 'Preventing & Fighting Chargebacks',
        description: 'Protecting your business from payment disputes',
        duration: '18 min',
        icon: '🛡️',
        content: {
            intro: 'Chargebacks can cost you $20-100+ per dispute in fees, plus the order value. Too many chargebacks (over 1%) can get your payment processing shut down entirely. Prevention is critical.',
            sections: [
                {
                    title: 'Why Chargebacks Happen',
                    content: 'Understanding causes helps you prevent them.',
                    keyPoints: [
                        'Shipping delays: Customer thinks order is lost',
                        'Product not as described: Mismatched expectations',
                        'Forgot they ordered: Do not recognize charge on statement',
                        'Friendly fraud: Customer wants free product',
                        'True fraud: Stolen card used on your store',
                        'Poor customer service: Could not reach you, so disputed instead'
                    ]
                },
                {
                    title: 'Proactive Prevention Strategies',
                    content: 'Most chargebacks are preventable with the right systems.',
                    keyPoints: [
                        'Clear merchant descriptor: Use recognizable business name on statements',
                        'Detailed product descriptions: Accurate images, measurements, materials',
                        'Order confirmation emails: Remind them what they bought',
                        'Proactive tracking updates: Send shipping notifications',
                        'Easy contact: Visible email, chat, phone—make it EASY to reach you',
                        'Fraud prevention: Address verification (AVS), card security codes (CVV)'
                    ]
                },
                {
                    title: 'Fighting Unfair Chargebacks',
                    content: 'You can and should dispute illegitimate chargebacks.',
                    keyPoints: [
                        'Documentation is everything: Order confirmation, tracking, delivery proof',
                        'Customer communication: Save all emails showing customer received/used item',
                        'Delivery confirmation: Signature required for high-value items',
                        'Respond quickly: You typically have 7-14 days to respond',
                        'Chargeback protection services: Chargeflow, Chargebacks911 automate disputes',
                        'Win rate: Well-documented disputes win 40-60% of the time'
                    ]
                }
            ],
            practiceTask: 'Audit your store for chargeback vulnerabilities: check your merchant descriptor, product descriptions, shipping policy visibility, and contact accessibility. Fix any gaps.'
        },
        quizTopics: ['chargeback causes', 'prevention strategies', 'dispute process'],
        xpReward: 350
    },
    {
        id: 65,
        moduleId: 10,
        moduleTitle: 'Customer Service Excellence',
        title: 'Customer Service Automation',
        description: 'AI chatbots and automated workflows',
        duration: '15 min',
        icon: '🤖',
        content: {
            intro: 'The best customer service is instant service. Modern AI chatbots can handle 60-80% of customer inquiries automatically, 24/7, while you sleep. Automation is not about replacing humans—it is about freeing them for complex issues.',
            sections: [
                {
                    title: 'Chatbot Platforms for E-commerce',
                    content: 'Several platforms specialize in e-commerce customer service automation.',
                    keyPoints: [
                        'Tidio: Popular Shopify integration, live chat + AI bots, free tier available',
                        'Zendesk: Enterprise-grade, trained on millions of support conversations',
                        'Zowie: Built specifically for e-commerce, multilingual, learns from your data',
                        'Intercom: Advanced AI, product tours, customer messaging platform',
                        'Ada: Natural language processing, personalized responses',
                        'Gorgias: Shopify-native, pulls order data into conversations automatically'
                    ]
                },
                {
                    title: 'What to Automate',
                    content: 'Not everything should be automated. Focus on high-volume, simple queries.',
                    keyPoints: [
                        'Order status: "Where is my order?" (integrate with tracking)',
                        'Shipping information: Delivery times, costs, methods',
                        'Return policy: Link to policy, basic instructions',
                        'Product questions: Size guides, specifications, availability',
                        'Hours and contact: When you are available, how to reach a human',
                        'After-hours acknowledgment: "We got your message, responding tomorrow"'
                    ]
                },
                {
                    title: 'Keeping It Human',
                    content: 'Automation should feel helpful, not frustrating.',
                    keyPoints: [
                        'Easy escalation: One click to reach a human, always',
                        'Transparent: "I am a bot" disclosure when appropriate',
                        'Personality: Match your brand voice, do not sound robotic',
                        'Fallback: If bot cannot help, transfer seamlessly',
                        'Feedback loop: Improve based on failed interactions',
                        'Hybrid approach: Bot gathers info, human resolves'
                    ]
                }
            ],
            practiceTask: 'Set up a chatbot (Tidio free tier works well). Create automated responses for: order status, shipping times, return policy, and contact information. Test it yourself first.'
        },
        quizTopics: ['chatbot platforms', 'automation scope', 'human handoff'],
        xpReward: 350
    },
    {
        id: 66,
        moduleId: 10,
        moduleTitle: 'Customer Service Excellence',
        title: 'Reviews & Reputation Management',
        description: 'Building trust through customer feedback',
        duration: '15 min',
        icon: '⭐',
        content: {
            intro: 'Reviews drive conversions. Products with 5+ reviews convert 270% better than products with none. But reviews do not happen automatically—you need to ask for them and manage the feedback you receive.',
            sections: [
                {
                    title: 'Collecting Reviews Systematically',
                    content: 'The best time to ask for a review is when customers are happiest.',
                    keyPoints: [
                        'Post-delivery timing: 7-14 days after delivery (they have used it)',
                        'Email automation: Sequence of 2-3 review request emails',
                        'Incentivize: Discount on next order for leaving a review',
                        'Make it easy: Direct link to review form, one-click rating',
                        'Photo reviews: Offer extra incentive for photos (UGC for ads)',
                        'Tools: Loox, Judge.me, Yotpo, Junip automate the entire process'
                    ]
                },
                {
                    title: 'Responding to Negative Reviews',
                    content: 'Negative reviews are opportunities. Your response matters more than the complaint.',
                    keyPoints: [
                        'Respond publicly and quickly: Shows you care to future customers',
                        'Acknowledge the issue: Do not be defensive or dismissive',
                        'Take it private: "Please email us so we can make this right"',
                        'Fix the problem: Refund, replacement, whatever it takes',
                        'Follow up: Ask them to update review after resolution',
                        'Learn from it: Every negative review reveals a system gap'
                    ]
                },
                {
                    title: 'Showcasing Social Proof',
                    content: 'Collected reviews are useless if no one sees them.',
                    keyPoints: [
                        'Product pages: Display reviews prominently above the fold',
                        'Homepage: Feature best reviews or customer photos',
                        'Ads: Use UGC and review quotes in paid campaigns',
                        'Email marketing: Include customer testimonials',
                        'Review counts: Show "Rated 4.8/5 by 500+ customers"',
                        'Photo galleries: Dedicated page for customer photos'
                    ]
                }
            ],
            practiceTask: 'Set up automated review requests (Judge.me has a free tier). Create a post-purchase email sequence that asks for a review 10 days after delivery with a 10% discount incentive.'
        },
        quizTopics: ['review collection', 'negative review response', 'social proof display'],
        xpReward: 350
    },
    {
        id: 67,
        moduleId: 10,
        moduleTitle: 'Customer Service Excellence',
        title: 'Difficult Customers & De-escalation',
        description: 'Turning angry customers into loyal advocates',
        duration: '15 min',
        icon: '😤',
        content: {
            intro: 'Angry customers are not the enemy. Often they are the most passionate and can become your biggest advocates if you handle the situation well. The key is de-escalation, empathy, and solutions—not arguments.',
            sections: [
                {
                    title: 'The De-escalation Framework',
                    content: 'A structured approach keeps emotions from derailing conversations.',
                    keyPoints: [
                        'Listen first: Let them vent completely before responding',
                        'Acknowledge: "I understand why you are frustrated"',
                        'Apologize: Even if it is not your fault—sorry for their experience',
                        'Take ownership: "I am going to fix this for you personally"',
                        'Propose solution: Give options when possible',
                        'Follow through: Do exactly what you promised, then follow up'
                    ]
                },
                {
                    title: 'Phrases That Work',
                    content: 'Words matter. Some phrases calm, others inflame.',
                    keyPoints: [
                        'Use: "I completely understand" / Avoid: "But our policy says..."',
                        'Use: "Let me make this right" / Avoid: "There is nothing I can do"',
                        'Use: "Thank you for bringing this to my attention" / Avoid: "That is not our fault"',
                        'Use: "Here is what I can do" / Avoid: "You should have..."',
                        'Use: "I am sorry this happened" / Avoid: "Calm down"',
                        'Use names: Personalization reduces hostility'
                    ]
                },
                {
                    title: 'When to Walk Away',
                    content: 'Some customers cannot be satisfied. Know when to cut losses.',
                    keyPoints: [
                        'Abusive language: You do not have to tolerate personal attacks',
                        'Unreasonable demands: Full refund AND free product AND compensation',
                        'Repeated chargebacks: Serial abusers should be blocked',
                        'Threatening reviews: If they threaten, they will do it anyway',
                        'Time sink: After 3+ hours on one issue, evaluate ROI',
                        'Document everything: Keep records for potential disputes'
                    ]
                }
            ],
            practiceTask: 'Write scripts for 3 common difficult customer scenarios: late delivery complaint, wrong item received, and "I want a refund after using the product." Practice with a friend and get feedback.'
        },
        quizTopics: ['de-escalation framework', 'effective language', 'knowing when to walk away'],
        xpReward: 350
    },
    // Module 11: Advanced Analytics & Data
    {
        id: 68,
        moduleId: 11,
        moduleTitle: 'Advanced Analytics & Data',
        title: 'Key Metrics That Matter',
        description: 'ROAS, LTV, CAC and the metrics that drive decisions',
        duration: '18 min',
        icon: '📊',
        content: {
            intro: 'Data without understanding is just numbers. Knowing which metrics actually matter—and how they relate to each other—is what separates guessers from decision-makers. Master these fundamentals before diving into dashboards.',
            sections: [
                {
                    title: 'Revenue & Profit Metrics',
                    content: 'Understand the difference between looking successful and actually being profitable.',
                    keyPoints: [
                        'Revenue: Total sales value—vanity metric alone, but important baseline',
                        'Gross Profit: Revenue minus cost of goods sold (COGS)',
                        'Gross Profit Margin: Target 30-40% for dropshipping',
                        'Net Profit: Revenue minus ALL expenses (ads, fees, returns, etc.)',
                        'Net Profit Margin: Target 15-20% after all costs',
                        'Average Order Value (AOV): Total revenue divided by number of orders'
                    ]
                },
                {
                    title: 'Advertising Metrics',
                    content: 'Know if your ads are actually making money.',
                    keyPoints: [
                        'ROAS (Return on Ad Spend): Revenue generated per dollar spent on ads',
                        'Target ROAS: 3:1 minimum (3x revenue for every 1x spent), 4:1+ ideal',
                        'CPA (Cost Per Acquisition): How much you pay to acquire one customer',
                        'CPM (Cost Per Mille): Cost per 1,000 impressions—platform pricing metric',
                        'CTR (Click-Through Rate): Percentage of people who click your ad',
                        'MER (Marketing Efficiency Ratio): Total revenue divided by total marketing spend'
                    ]
                },
                {
                    title: 'Customer Value Metrics',
                    content: 'The metrics that determine long-term profitability.',
                    keyPoints: [
                        'CAC (Customer Acquisition Cost): Total marketing spend divided by new customers',
                        'LTV (Lifetime Value): Total revenue expected from a customer over time',
                        'LTV:CAC Ratio: Target 3:1 minimum (customer value is 3x acquisition cost)',
                        'Repeat Purchase Rate: Percentage of customers who buy again',
                        'Churn Rate: Percentage of customers who stop buying',
                        'Payback Period: Time to recover customer acquisition cost'
                    ]
                }
            ],
            practiceTask: 'Calculate your current ROAS, CAC, and estimated LTV using the last 30 days of data. What is your LTV:CAC ratio? Is it above 3:1?'
        },
        quizTopics: ['profit metrics', 'ROAS calculation', 'LTV CAC ratio'],
        xpReward: 375
    },
    {
        id: 69,
        moduleId: 11,
        moduleTitle: 'Advanced Analytics & Data',
        title: 'Shopify Analytics Deep Dive',
        description: 'Extracting insights from your store data',
        duration: '18 min',
        icon: '📈',
        content: {
            intro: 'Shopify provides a goldmine of data—most store owners barely scratch the surface. Learning to read your Shopify analytics unlocks insights that directly improve your bottom line.',
            sections: [
                {
                    title: 'Overview Dashboard Essentials',
                    content: 'Your daily health check on the business.',
                    keyPoints: [
                        'Total sales: Track daily, weekly, monthly trends',
                        'Sessions: Visitor count and source breakdown',
                        'Conversion rate: Industry average is 2-3%, aim for 3%+',
                        'Average order value: Track over time, optimize with upsells',
                        'Returning customer rate: Higher is better, indicates brand strength',
                        'Compare date ranges: Always compare to previous period'
                    ]
                },
                {
                    title: 'Sales Reports & Analysis',
                    content: 'Dig deeper into what is actually selling.',
                    keyPoints: [
                        'Sales by product: Identify winners and underperformers',
                        'Sales by traffic source: Know which channels convert',
                        'Sales by location: Optimize for your best markets',
                        'Sales by landing page: See which pages drive revenue',
                        'Discount usage: Track promo code performance',
                        'Taxes: Essential for accounting and international sales'
                    ]
                },
                {
                    title: 'Behavior Reports',
                    content: 'Understand how customers interact with your store.',
                    keyPoints: [
                        'Sessions by device: Mobile vs desktop optimization priorities',
                        'Online store speed: Direct impact on conversion rate',
                        'Top landing pages: First impressions matter',
                        'Top referrers: Who sends you the best traffic',
                        'Cart analysis: What items are added but not purchased',
                        'Checkout funnel: Where customers drop off'
                    ]
                }
            ],
            practiceTask: 'Spend 30 minutes in your Shopify analytics. Identify: your top 3 products by revenue, your highest converting traffic source, and your checkout abandonment rate. Write down 3 actions based on what you find.'
        },
        quizTopics: ['sales analysis', 'traffic sources', 'conversion tracking'],
        xpReward: 375
    },
    {
        id: 70,
        moduleId: 11,
        moduleTitle: 'Advanced Analytics & Data',
        title: 'Google Analytics for E-commerce',
        description: 'The complete picture of your traffic and behavior',
        duration: '18 min',
        icon: '🔬',
        content: {
            intro: 'Google Analytics 4 (GA4) provides deeper insights than Shopify alone—tracking users across sessions, understanding attribution, and following the complete customer journey. It is free and essential.',
            sections: [
                {
                    title: 'GA4 Setup for Shopify',
                    content: 'Proper setup ensures accurate data from day one.',
                    keyPoints: [
                        'Create GA4 property: Separate from Universal Analytics',
                        'Install via Shopify: Online Store > Preferences > Google Analytics',
                        'Enable enhanced e-commerce: Track add-to-cart, checkout, purchases',
                        'Set up conversions: Mark purchase as a conversion event',
                        'Link to Google Ads: Essential for attribution',
                        'Configure data retention: Extend from 2 months to 14 months'
                    ]
                },
                {
                    title: 'Key Reports to Monitor',
                    content: 'Focus on reports that drive decisions.',
                    keyPoints: [
                        'Acquisition overview: Where your traffic comes from',
                        'Engagement: Pages per session, session duration, bounce rate',
                        'Monetization: Revenue, transactions, average purchase value',
                        'User acquisition: First-touch attribution for new users',
                        'Traffic acquisition: Session-level channel performance',
                        'E-commerce purchases: Product-level performance data'
                    ]
                },
                {
                    title: 'Attribution & Conversion Paths',
                    content: 'Understand the full customer journey, not just last click.',
                    keyPoints: [
                        'Attribution models: Data-driven, first click, last click, linear',
                        'Conversion paths: See all touchpoints before purchase',
                        'Assisted conversions: Channels that help but do not get last-click credit',
                        'Time to conversion: How long customers take to buy',
                        'Cross-device tracking: Users on multiple devices',
                        'Model comparison: Test different attribution approaches'
                    ]
                }
            ],
            practiceTask: 'Set up GA4 on your Shopify store if you have not already. Configure e-commerce tracking and run your first acquisition report. Identify your top 3 traffic sources by conversion rate (not just volume).'
        },
        quizTopics: ['GA4 setup', 'acquisition reports', 'attribution models'],
        xpReward: 375
    },
    {
        id: 71,
        moduleId: 11,
        moduleTitle: 'Advanced Analytics & Data',
        title: 'A/B Testing Systematically',
        description: 'Making data-driven decisions through experimentation',
        duration: '15 min',
        icon: '🧪',
        content: {
            intro: 'Opinions are worthless; data wins. A/B testing removes guesswork by letting your customers vote with their wallets. Even small improvements compound dramatically over time.',
            sections: [
                {
                    title: 'A/B Testing Fundamentals',
                    content: 'Understand the basics before running tests.',
                    keyPoints: [
                        'Control vs variant: Original (A) vs modified version (B)',
                        'Sample size: Need enough traffic for statistical significance',
                        'Test duration: Minimum 1-2 weeks to capture all patterns',
                        'One variable at a time: Isolate what causes the change',
                        'Statistical significance: 95% confidence before declaring winners',
                        'Document everything: Record hypothesis, test, and results'
                    ]
                },
                {
                    title: 'High-Impact Tests to Run',
                    content: 'Prioritize tests with the biggest potential impact.',
                    keyPoints: [
                        'Headlines: Product titles, homepage hero text',
                        'Call-to-action buttons: Text, color, size, placement',
                        'Product images: Main image, number of images, video vs static',
                        'Pricing: Different price points, display format',
                        'Social proof: Reviews placement, trust badges',
                        'Checkout flow: One-page vs multi-page, form fields'
                    ]
                },
                {
                    title: 'Tools for E-commerce Testing',
                    content: 'Several tools make A/B testing accessible for Shopify stores.',
                    keyPoints: [
                        'Google Optimize (free): Basic A/B testing, integrates with GA4',
                        'Optimizely: Enterprise-grade experimentation platform',
                        'Convert: User-friendly, Shopify integration',
                        'Intelligems: Shopify-native price testing',
                        'Theme A/B testing: Test entire theme layouts',
                        'Email A/B tests: Klaviyo, Mailchimp built-in testing'
                    ]
                }
            ],
            practiceTask: 'Set up your first A/B test on a product page. Test one element: button text, main image, or price display. Run for 2 weeks and document the result with statistical confidence.'
        },
        quizTopics: ['testing fundamentals', 'test prioritization', 'testing tools'],
        xpReward: 375
    },
    {
        id: 72,
        moduleId: 11,
        moduleTitle: 'Advanced Analytics & Data',
        title: 'Ad Platform Analytics',
        description: 'Reading Meta, TikTok, and Google Ads dashboards',
        duration: '18 min',
        icon: '📉',
        content: {
            intro: 'Each ad platform has its own metrics, dashboards, and quirks. Understanding what each platform reports—and its limitations—prevents expensive mistakes and reveals optimization opportunities.',
            sections: [
                {
                    title: 'Meta Ads Manager Essentials',
                    content: 'Navigate Facebook and Instagram ad analytics.',
                    keyPoints: [
                        'Campaign structure: Campaign > Ad Set > Ad hierarchy',
                        'Delivery insights: Reach, frequency, impressions',
                        'Performance columns: CTR, CPC, CPM, conversions',
                        'Attribution window: Default 7-day click, 1-day view',
                        'Breakdown options: Age, gender, placement, device',
                        'Custom columns: Build your own view with key metrics'
                    ]
                },
                {
                    title: 'TikTok Ads Analytics',
                    content: 'TikTok dashboard has its own vocabulary.',
                    keyPoints: [
                        'Video views: 2-second, 6-second, and watched to completion rates',
                        'Engagement: Likes, comments, shares relative to views',
                        'Conversion tracking: TikTok Pixel installation essential',
                        'Smart Performance Campaign: AI-optimized campaigns',
                        'Spark Ads metrics: Engagement on organic-looking ads',
                        'Video insights: Which creatives drive results'
                    ]
                },
                {
                    title: 'Google Ads for E-commerce',
                    content: 'Shopping and Performance Max campaign analytics.',
                    keyPoints: [
                        'Impression share: How often your products appear',
                        'Search term reports: What queries trigger your ads',
                        'Product performance: Which items drive clicks and sales',
                        'Quality Score: Ad relevance rating (affects costs)',
                        'Performance Max asset groups: Creative performance breakdown',
                        'Conversion value: Revenue tracked through Google Ads'
                    ]
                }
            ],
            practiceTask: 'Log into your primary ad platform. Create a custom report showing: spend, ROAS, CPA, and conversion rate broken down by campaign. Export and analyze weekly for 4 weeks.'
        },
        quizTopics: ['Meta Ads metrics', 'TikTok analytics', 'Google Ads reporting'],
        xpReward: 375
    },
    {
        id: 73,
        moduleId: 11,
        moduleTitle: 'Advanced Analytics & Data',
        title: 'AI Tools for Data & Automation',
        description: 'Leveraging AI for product descriptions, pricing, and insights',
        duration: '15 min',
        icon: '🤖',
        content: {
            intro: 'AI tools have revolutionized dropshipping operations. From generating product descriptions to analyzing competitors to predicting trends—AI handles tasks that used to take hours in seconds.',
            sections: [
                {
                    title: 'AI for Product Content',
                    content: 'Generate compelling product copy at scale.',
                    keyPoints: [
                        'ChatGPT: Product descriptions, FAQs, email sequences, ad copy',
                        'Jasper: Specialized marketing copywriter, brand voice consistency',
                        'Copy.ai: Templates for e-commerce product descriptions',
                        'Hypotenuse AI: Bulk product description generation',
                        'Frase: SEO-optimized content and product pages',
                        'PagePilot: Generate entire product pages from AliExpress links'
                    ]
                },
                {
                    title: 'AI for Research & Pricing',
                    content: 'Let AI crunch numbers and spot opportunities.',
                    keyPoints: [
                        'Intelligence Node: Dynamic pricing based on competitors',
                        'PriSync: Competitor price monitoring and optimization',
                        'Browse AI: Web scraping for competitor research',
                        'Tiipe: Personalized product messaging based on customer behavior',
                        'Dropship.io: AI product research and store tracking',
                        'Trend analysis: AI identifies rising products before saturation'
                    ]
                },
                {
                    title: 'AI for Images & Creative',
                    content: 'Visual content creation without expensive agencies.',
                    keyPoints: [
                        'Flair: AI product photography with custom backgrounds',
                        'Midjourney: Generate lifestyle images and ad creatives',
                        'Leonardo AI: High-quality product visuals',
                        'Canva AI: Design templates with AI-powered editing',
                        'DALL-E (via ChatGPT): Generate custom images from descriptions',
                        'Remove.bg: AI background removal for product photos'
                    ]
                }
            ],
            practiceTask: 'Use ChatGPT to generate 5 product descriptions for your best sellers. Compare them to your current descriptions. Test the AI versions for one week and measure conversion rate difference.'
        },
        quizTopics: ['AI content tools', 'pricing automation', 'AI creative tools'],
        xpReward: 375
    },
    // Module 12: International Expansion
    {
        id: 74,
        moduleId: 12,
        moduleTitle: 'International Expansion',
        title: 'EU Sales & IOSS Compliance',
        description: 'Selling to Europe without VAT nightmares',
        duration: '18 min',
        icon: '🇪🇺',
        content: {
            intro: 'The EU represents a massive market—450 million potential customers—but VAT compliance has kept many sellers away. The Import One-Stop Shop (IOSS) simplifies everything for orders under 150 EUR. Understanding it unlocks billions in opportunity.',
            sections: [
                {
                    title: 'EU VAT Basics for Dropshippers',
                    content: 'Understand the rules before you sell.',
                    keyPoints: [
                        'No more 22 EUR exemption: ALL imports to EU are subject to VAT',
                        'VAT rates vary: 17-27% depending on country (average ~20%)',
                        'Place of supply: VAT is charged based on customer location',
                        'Distance selling threshold: 10,000 EUR annual cross-border sales triggers requirements',
                        'B2C vs B2B: Different rules apply for business customers',
                        'Record keeping: 5 years of detailed transaction records required'
                    ]
                },
                {
                    title: 'The IOSS System Explained',
                    content: 'IOSS simplifies VAT for goods under 150 EUR.',
                    keyPoints: [
                        'What it covers: B2C sales of imported goods valued at 150 EUR or less',
                        'How it works: Collect VAT at checkout, remit monthly via one return',
                        'Single registration: Register in one EU country, covers all 27 member states',
                        'Faster customs: IOSS packages clear customs without customer charges',
                        'Customer experience: No surprise fees on delivery',
                        'Non-EU sellers: Must register through an EU-based intermediary'
                    ]
                },
                {
                    title: 'Practical Implementation',
                    content: 'Step-by-step to start selling to EU.',
                    keyPoints: [
                        'Register for IOSS: Through intermediary like Avalara, SimplyVAT, or hellotax',
                        'Update product pricing: Show VAT-inclusive prices to EU customers',
                        'Configure shipping: Provide IOSS number to carriers/suppliers',
                        'CJ Dropshipping: IOSS integration available',
                        'Monthly VAT return: Due by end of following month',
                        'OSS for EU sellers: Intra-EU sales use One-Stop Shop (not IOSS)'
                    ]
                }
            ],
            practiceTask: 'Research IOSS intermediaries (Avalara, SimplyVAT, hellotax). Get quotes for registration and monthly filing. Calculate the cost vs your estimated EU revenue opportunity.'
        },
        quizTopics: ['EU VAT basics', 'IOSS registration', 'VAT collection'],
        xpReward: 400
    },
    {
        id: 75,
        moduleId: 12,
        moduleTitle: 'International Expansion',
        title: 'UK Sales & VAT Rules',
        description: 'Post-Brexit compliance for UK customers',
        duration: '15 min',
        icon: '🇬🇧',
        content: {
            intro: 'After Brexit, the UK has its own VAT system separate from the EU. Different rules, different thresholds, different registration requirements. But the UK is still a massive English-speaking market worth pursuing.',
            sections: [
                {
                    title: 'UK VAT Requirements',
                    content: 'The basics of selling to UK customers.',
                    keyPoints: [
                        'UK VAT rate: 20% standard rate, 5% reduced rate for some items',
                        'Registration threshold: 90,000 GBP for UK-based businesses',
                        'Overseas sellers: Must register from FIRST sale to UK customers',
                        'Low-value goods (under 135 GBP): Seller collects and remits VAT',
                        'High-value goods (over 135 GBP): VAT collected at customs from buyer',
                        'Postponed VAT Accounting: Pay VAT on VAT return, not at border'
                    ]
                },
                {
                    title: 'Practical Implementation',
                    content: 'How to set up UK sales correctly.',
                    keyPoints: [
                        'Register for UK VAT: Through HMRC online portal',
                        'Get EORI number: Required for customs declarations',
                        'Configure pricing: Show VAT-inclusive prices to UK customers',
                        'Shipping declarations: Commercial invoices with correct values',
                        'Quarterly VAT returns: Due one month after quarter end',
                        'Make Tax Digital: Submit returns via compatible software'
                    ]
                },
                {
                    title: 'UK-Specific Considerations',
                    content: 'Unique aspects of the UK market.',
                    keyPoints: [
                        'Northern Ireland: Dual EU and UK rules apply—complex',
                        'Currency: Price in GBP for best customer experience',
                        'Consumer rights: 14-day return right for online purchases',
                        'Product compliance: UK CA marking replacing CE marking',
                        'Delivery expectations: UK customers expect fast shipping',
                        'Payment methods: Credit cards, PayPal, Apple Pay popular'
                    ]
                }
            ],
            practiceTask: 'If you have UK customers: calculate your VAT liability for the last quarter. If you do not: research UK registration requirements and costs through an accountant or HMRC.'
        },
        quizTopics: ['UK VAT rates', 'registration requirements', 'low-value goods rules'],
        xpReward: 400
    },
    {
        id: 76,
        moduleId: 12,
        moduleTitle: 'International Expansion',
        title: 'Currency & Payment Localization',
        description: 'Multi-currency pricing and local payment methods',
        duration: '15 min',
        icon: '💱',
        content: {
            intro: 'Customers abandon checkouts when they see foreign currency. Multi-currency pricing and local payment methods can boost international conversion rates by 20-30%. Making customers feel "at home" is worth the setup effort.',
            sections: [
                {
                    title: 'Multi-Currency Strategies',
                    content: 'Options for displaying and processing local currencies.',
                    keyPoints: [
                        'Shopify Markets: Built-in multi-currency, auto-conversion',
                        'Currency switching: Let customers choose their currency',
                        'Fixed vs dynamic pricing: Rounding friendly prices vs real-time rates',
                        'Exchange rate buffers: Add 2-5% to protect against fluctuations',
                        'Currency risk: Be aware of exchange rate changes',
                        'Settlement currency: Choose which currency you receive'
                    ]
                },
                {
                    title: 'Local Payment Methods',
                    content: 'Different countries prefer different payment options.',
                    keyPoints: [
                        'Europe: iDEAL (Netherlands), Klarna (Nordics), SEPA Direct Debit',
                        'Germany: PayPal heavily used, BNPL popular',
                        'UK: Credit cards, PayPal, Apple Pay, Google Pay',
                        'Australia: Afterpay/Zip very popular',
                        'Asia: Various local methods—Alipay, WeChat Pay',
                        'Klarna/Afterpay: Buy now pay later increases AOV'
                    ]
                },
                {
                    title: 'Implementation Tips',
                    content: 'Practical steps for going multi-currency.',
                    keyPoints: [
                        'Shopify Payments: Supports multi-currency natively in many countries',
                        'PayPal: Offers multi-currency checkout',
                        'Stripe: Supports 135+ currencies',
                        'Geolocation: Auto-detect customer location for currency',
                        'Test thoroughly: Currency display, checkout, refunds',
                        'Accounting: Track sales in original and settlement currency'
                    ]
                }
            ],
            practiceTask: 'Enable Shopify Markets for your top 3 international markets. Set up local currencies and test the checkout experience. Compare conversion rates before and after over 2 weeks.'
        },
        quizTopics: ['multi-currency options', 'local payments', 'implementation'],
        xpReward: 400
    },
    {
        id: 77,
        moduleId: 12,
        moduleTitle: 'International Expansion',
        title: 'International Shipping Strategies',
        description: 'Getting products to customers worldwide efficiently',
        duration: '15 min',
        icon: '🌐',
        content: {
            intro: 'International shipping is complex: customs, duties, delivery times, carrier options, and customer expectations all vary by country. A smart strategy balances speed, cost, and reliability.',
            sections: [
                {
                    title: 'Shipping Method Options',
                    content: 'Different methods for different markets and price points.',
                    keyPoints: [
                        'AliExpress Standard: 15-45 days, cheap, for testing markets',
                        'ePacket: 7-20 days, affordable, 40+ countries',
                        'CJ Packet: 7-15 days, CJ Dropshipping proprietary',
                        'Express (DHL/FedEx/UPS): 3-7 days, expensive, premium option',
                        'Regional warehouses: Faster local delivery from EU, UK, AU hubs',
                        'Hybrid: Test with cheap shipping, upgrade winners to faster options'
                    ]
                },
                {
                    title: 'Customs & Duties Considerations',
                    content: 'Avoiding surprise fees that frustrate customers.',
                    keyPoints: [
                        'DDP vs DAP: Delivered Duty Paid vs customer pays duties',
                        'De minimis thresholds: Duty-free limits vary by country',
                        'HS codes: Product classification affects duty rates',
                        'Commercial invoices: Required documentation for customs',
                        'Declared value: Must match actual value to avoid issues',
                        'Restricted items: Some products prohibited in certain countries'
                    ]
                },
                {
                    title: 'Setting Customer Expectations',
                    content: 'Transparency builds trust in international selling.',
                    keyPoints: [
                        'Clear delivery estimates: By country, not one-size-fits-all',
                        'Shipping page: Dedicated page with country-specific information',
                        'Tracking: Ensure tracking works internationally',
                        'Duties disclaimer: Clearly state if customer is responsible',
                        'Returns: International return policy must be clear',
                        'Contact method: Easy to reach for shipping questions'
                    ]
                }
            ],
            practiceTask: 'Create a shipping matrix: list your top 10 target countries with shipping method, estimated delivery time, cost to you, and price to customer. Identify gaps where you need better options.'
        },
        quizTopics: ['international shipping methods', 'customs clearance', 'customer communication'],
        xpReward: 400
    },
    {
        id: 78,
        moduleId: 12,
        moduleTitle: 'International Expansion',
        title: 'Localization & Translation',
        description: 'Making your store feel local to international customers',
        duration: '15 min',
        icon: '🌍',
        content: {
            intro: 'Localization is more than translation. It is making your entire experience feel native to each market—language, currency, measurements, cultural references, and imagery. Done well, customers forget they are buying from abroad.',
            sections: [
                {
                    title: 'Translation Options',
                    content: 'From AI to professional—choose the right level for your stage.',
                    keyPoints: [
                        'Shopify Translate & Adapt: Built-in, auto-translate',
                        'Langify/Weglot: Third-party translation apps with more control',
                        'Google Translate: Free but lower quality—good for testing',
                        'Professional translation: Invest for key markets (Germany, France)',
                        'Native speakers: Hire for product descriptions on winners',
                        'SEO consideration: Translated content can rank in local Google'
                    ]
                },
                {
                    title: 'Beyond Language',
                    content: 'True localization covers more than words.',
                    keyPoints: [
                        'Measurements: Metric for most of world, imperial for US',
                        'Date formats: DD/MM/YYYY vs MM/DD/YYYY',
                        'Currency formatting: Comma vs period decimals',
                        'Images: Use models/photos appropriate for each market',
                        'Cultural references: Holidays, humor, color meanings differ',
                        'Local trust signals: Country-specific reviews, certifications'
                    ]
                },
                {
                    title: 'Implementation Approach',
                    content: 'A phased approach to localization.',
                    keyPoints: [
                        'Start with currency and shipping: Biggest friction points',
                        'Add language for top markets: German, French, Spanish first for EU',
                        'Localize checkout: Most critical for conversions',
                        'Product pages next: Where buying decisions happen',
                        'Test before full rollout: Monitor conversion by market',
                        'Local domains: Consider .de, .fr, .co.uk for serious commitment'
                    ]
                }
            ],
            practiceTask: 'Choose one international market to fully localize. Set up currency, shipping, and translated product pages for your top 5 products. Run ads to that market and compare conversion rates to non-localized version.'
        },
        quizTopics: ['translation tools', 'cultural localization', 'implementation priority'],
        xpReward: 400
    },
    {
        id: 79,
        moduleId: 12,
        moduleTitle: 'International Expansion',
        title: 'TikTok Shop & Emerging Platforms',
        description: 'Selling on new channels and marketplaces globally',
        duration: '18 min',
        icon: '📱',
        content: {
            intro: 'TikTok Shop is reshaping e-commerce with in-app purchasing. Launching in the US, UK, and Southeast Asia, it offers massive organic reach with native checkout. Understanding emerging platforms early provides first-mover advantage.',
            sections: [
                {
                    title: 'TikTok Shop Fundamentals',
                    content: 'The new frontier of social commerce.',
                    keyPoints: [
                        'In-app shopping: Customers buy without leaving TikTok',
                        'Seller registration: Through TikTok Shop Seller Center',
                        'Requirements: Business verification, valid ID, bank account',
                        'Product listing: Upload products with details, images, videos',
                        'Affiliate program: Connect with creators to promote products',
                        'Shop tab: Dedicated shopping section on your TikTok profile'
                    ]
                },
                {
                    title: 'Creator Partnerships',
                    content: 'TikTok Shop thrives on creator-driven sales.',
                    keyPoints: [
                        'Open collaboration: Make products visible to all creators',
                        'Targeted collaboration: Invite specific creators with custom terms',
                        'Commission structure: Set rates, creators earn per sale',
                        'Free samples: Send products to creators for authentic content',
                        'Affiliate dashboard: Track creator performance',
                        'Live selling: Creators drive sales during live streams'
                    ]
                },
                {
                    title: 'Live Selling on TikTok',
                    content: 'Interactive, real-time shopping experiences.',
                    keyPoints: [
                        'Requirements: 18+, 1,000+ followers for live selling',
                        'Pin products: Showcase items during live stream',
                        'Live exclusives: Special discounts only during live',
                        'Engagement: Answer questions, demo products in real time',
                        'Duration: Aim for 1+ hours for best algorithm performance',
                        'Scheduling: Promote lives in advance for maximum attendance'
                    ]
                }
            ],
            practiceTask: 'Register for TikTok Shop Seller Center (if available in your region). List your top 3 products and set up open collaboration so creators can find and promote your products.'
        },
        quizTopics: ['TikTok Shop setup', 'creator collaboration', 'live selling'],
        xpReward: 400
    }
];

// Export module metadata
export const MODULES = [
    { id: 1, title: 'Mindset & Foundation', icon: '🎯', lessonCount: 5 },
    { id: 2, title: 'Product Research & Validation', icon: '🔍', lessonCount: 5 },
    { id: 3, title: 'Consumer Psychology', icon: '🧠', lessonCount: 6 },
    { id: 4, title: 'Content Creation Mastery', icon: '🎬', lessonCount: 10 },
    { id: 5, title: 'Platform Mastery', icon: '📱', lessonCount: 8 },
    { id: 6, title: 'Store Design & CRO', icon: '🛍️', lessonCount: 6 },
    { id: 7, title: 'Paid Advertising', icon: '💰', lessonCount: 7 },
    { id: 8, title: 'Scaling & Brand Building', icon: '🚀', lessonCount: 7 },
    { id: 9, title: 'Supplier Management & Logistics', icon: '📦', lessonCount: 7 },
    { id: 10, title: 'Customer Service Excellence', icon: '💬', lessonCount: 6 },
    { id: 11, title: 'Advanced Analytics & Data', icon: '📊', lessonCount: 6 },
    { id: 12, title: 'International Expansion', icon: '🌍', lessonCount: 6 },
];

// Helper function to get lessons by module
export function getLessonsByModule(moduleId: number): LessonContent[] {
    return CURRICULUM.filter(lesson => lesson.moduleId === moduleId);
}

// Helper function to get a lesson by ID
export function getLessonById(id: number): LessonContent | undefined {
    return CURRICULUM.find(lesson => lesson.id === id);
}


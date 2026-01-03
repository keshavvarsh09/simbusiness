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
];

// Helper function to get lessons by module
export function getLessonsByModule(moduleId: number): LessonContent[] {
    return CURRICULUM.filter(lesson => lesson.moduleId === moduleId);
}

// Helper function to get a lesson by ID
export function getLessonById(id: number): LessonContent | undefined {
    return CURRICULUM.find(lesson => lesson.id === id);
}


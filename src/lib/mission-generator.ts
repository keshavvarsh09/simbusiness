/**
 * Mission Generator
 * Auto-generates missions based on real-world events, festivals, news, and business conditions
 */

import { fetchRelevantNews, getUpcomingFestivals, NewsEvent } from './news-api';

/**
 * Validate and ensure URL is properly formatted
 */
export function validateAndFixUrl(url: string | undefined | null): string | undefined {
  if (!url || url.trim() === '') return undefined;
  
  const trimmedUrl = url.trim();
  
  // If URL is already valid, return it
  if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://')) {
    try {
      new URL(trimmedUrl);
      return trimmedUrl;
    } catch {
      // Invalid URL format, return default
      return 'https://www.reuters.com/business/';
    }
  }
  
  // If URL doesn't start with http, try to fix it
  if (trimmedUrl.includes('.') && !trimmedUrl.includes(' ')) {
    return `https://${trimmedUrl}`;
  }
  
  // If it's not a valid URL at all, return default news URL (main domain, guaranteed to work)
  return 'https://www.reuters.com';
}

export interface MissionTemplate {
  title: string;
  description: string;
  type: string;
  durationHours: number;
  costToSolve: number;
  impact: Record<string, number>;
  eventSource?: 'news' | 'festival' | 'labour' | 'curfew' | 'system';
  affectedLocation?: string;
  newsUrl?: string;
}

/**
 * Generate missions based on real-world events
 */
export async function generateMissionsFromEvents(
  userLocations: string[] = ['India', 'Delhi', 'Mumbai']
): Promise<MissionTemplate[]> {
  const missions: MissionTemplate[] = [];

  // 1. Fetch news-based missions (with better error handling)
  try {
    const newsEvents = await fetchRelevantNews(userLocations);
    if (newsEvents && Array.isArray(newsEvents)) {
      const highRelevanceEvents = newsEvents.filter(e => e && e.relevance === 'high');
      for (const event of highRelevanceEvents) {
        try {
          const mission = createMissionFromNews(event);
          if (mission && mission.title && mission.description) {
            missions.push(mission);
          }
        } catch (error: any) {
          console.error('Error creating mission from news event:', error.message);
          // Continue with next event
        }
      }
    }
  } catch (error: any) {
    console.error('Error fetching news for missions (continuing with other sources):', error.message);
    // Don't throw - continue with festivals and system missions
  }

  // 2. Check upcoming festivals (always works, no API needed)
  try {
    const festivals = getUpcomingFestivals();
    const today = new Date();
    for (const festival of festivals) {
      if (festival && festival.date) {
        const daysUntil = Math.ceil((festival.date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        if (daysUntil <= 7 && daysUntil >= 0) {
          try {
            const mission = createMissionFromFestival(festival);
            if (mission && mission.title && mission.description) {
              missions.push(mission);
            }
          } catch (error: any) {
            console.error('Error creating mission from festival:', error.message);
          }
        }
      }
    }
  } catch (error: any) {
    console.error('Error processing festivals:', error.message);
  }

  // 3. Add system-generated missions (labour, curfew, etc.) - always works
  try {
    const systemMissions = generateSystemMissions(userLocations);
    if (systemMissions && Array.isArray(systemMissions)) {
      missions.push(...systemMissions.filter(m => m && m.title && m.description));
    }
  } catch (error: any) {
    console.error('Error generating system missions:', error.message);
  }

  // Always return at least an empty array (never throw)
  return missions;
}

/**
 * Create mission from news event
 */

function createMissionFromNews(event: NewsEvent): MissionTemplate {
  const baseImpact = {
    sales: -10,
    customerSatisfaction: -15
  };

  // Validate and fix the news URL
  const validUrl = validateAndFixUrl(event.url);

  switch (event.impactType) {
    case 'supply_chain':
      return {
        title: `Supply Chain Disruption: ${event.title.substring(0, 50)}`,
        description: `${event.description.substring(0, 200)}... Your shipments from ${event.location || 'the region'} may be delayed.`,
        type: 'supply_chain',
        durationHours: 48,
        costToSolve: 600,
        impact: { ...baseImpact, inventory: -20 },
        eventSource: 'news',
        affectedLocation: event.location,
        newsUrl: validUrl
      };
    
    case 'shipping':
      return {
        title: `Shipping Delay Alert: ${event.title.substring(0, 50)}`,
        description: `${event.description.substring(0, 200)}... Delivery times may be extended.`,
        type: 'logistics',
        durationHours: 36,
        costToSolve: 500,
        impact: { ...baseImpact, customerSatisfaction: -25 },
        eventSource: 'news',
        affectedLocation: event.location,
        newsUrl: validUrl
      };
    
    case 'labour':
      return {
        title: `Labour Unavailability: ${event.title.substring(0, 50)}`,
        description: `${event.description.substring(0, 200)}... Manufacturing and shipping operations may be affected.`,
        type: 'labour',
        durationHours: 72,
        costToSolve: 800,
        impact: { ...baseImpact, inventory: -30, expenses: 15 },
        eventSource: 'labour',
        affectedLocation: event.location,
        newsUrl: validUrl
      };
    
    case 'curfew':
      return {
        title: `Restrictions Imposed: ${event.title.substring(0, 50)}`,
        description: `${event.description.substring(0, 200)}... Operations in ${event.location || 'the region'} are restricted.`,
        type: 'curfew',
        durationHours: 96,
        costToSolve: 1000,
        impact: { ...baseImpact, sales: -25, inventory: -40 },
        eventSource: 'curfew',
        affectedLocation: event.location,
        newsUrl: validUrl
      };
    
    case 'disaster':
      return {
        title: `Emergency Situation: ${event.title.substring(0, 50)}`,
        description: `${event.description.substring(0, 200)}... Shipments are being held due to safety concerns.`,
        type: 'disaster',
        durationHours: 120,
        costToSolve: 1200,
        impact: { ...baseImpact, sales: -30, inventory: -50, customerSatisfaction: -30 },
        eventSource: 'news',
        affectedLocation: event.location,
        newsUrl: validUrl
      };
    
    default:
      return {
        title: `Business Impact: ${event.title.substring(0, 50)}`,
        description: `${event.description.substring(0, 200)}... This may affect your operations.`,
        type: 'supply_chain',
        durationHours: 48,
        costToSolve: 500,
        impact: baseImpact,
        eventSource: 'news',
        affectedLocation: event.location,
        newsUrl: validUrl
      };
  }
}

/**
 * Create mission from festival
 */
function createMissionFromFestival(festival: { name: string; date: Date; location: string; impact: string }): MissionTemplate {
  const daysUntil = Math.ceil((festival.date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  
  return {
    title: `${festival.name} Festival - Supply Chain Impact`,
    description: `${festival.name} is approaching (${daysUntil} days away) in ${festival.location}. ${festival.impact}. Plan ahead for delays.`,
    type: 'festival',
    durationHours: 72,
    costToSolve: 400,
    impact: {
      sales: -15,
      inventory: -25,
      customerSatisfaction: -10
    },
    eventSource: 'festival',
    affectedLocation: festival.location
  };
}

/**
 * Generate system missions (labour unavailability, curfew, etc.)
 */
function generateSystemMissions(locations: string[]): MissionTemplate[] {
  const missions: MissionTemplate[] = [];

  // Random labour unavailability (10% chance)
  if (Math.random() < 0.1) {
    const location = locations[Math.floor(Math.random() * locations.length)];
    missions.push({
      title: `Labour Unavailability in ${location}`,
      description: `Workers in ${location} are on strike/unavailable. Manufacturing and shipping operations are delayed.`,
      type: 'labour',
      durationHours: 48,
      costToSolve: 700,
      impact: {
        sales: -20,
        inventory: -30,
        expenses: 12
      },
      eventSource: 'labour',
      affectedLocation: location
    });
  }

  // Random curfew/restrictions (5% chance)
  if (Math.random() < 0.05) {
    const location = locations[Math.floor(Math.random() * locations.length)];
    missions.push({
      title: `Restrictions Imposed in ${location}`,
      description: `Local authorities have imposed restrictions in ${location}. Operations are limited.`,
      type: 'curfew',
      durationHours: 72,
      costToSolve: 900,
      impact: {
        sales: -25,
        inventory: -35,
        customerSatisfaction: -20
      },
      eventSource: 'curfew',
      affectedLocation: location
    });
  }

  return missions;
}

/**
 * Get standard mission templates (fallback)
 * Pre-generated time-bound missions with valid working links
 */
export function getStandardMissionTemplates(): MissionTemplate[] {
  return [
    {
      title: 'Delayed Supplier Shipment from China',
      description: 'Your manufacturer in Guangzhou has delayed shipment by 2 weeks due to port congestion. You have 10 pending orders that need to be fulfilled. Customers are getting impatient and threatening chargebacks.',
      type: 'supply_chain',
      durationHours: 24,
      costToSolve: 500,
      impact: { sales: -15, customerSatisfaction: -20 },
      eventSource: 'system',
      affectedLocation: 'China',
      newsUrl: 'https://www.reuters.com/business/'
    },
    {
      title: 'Stock Management Crisis - Best Seller Out of Stock',
      description: 'You\'ve run out of your best-selling product. Orders are piling up but you have no inventory. Quick decisions needed! Consider emergency restocking or refunding customers.',
      type: 'inventory',
      durationHours: 12,
      costToSolve: 300,
      impact: { sales: -25, reputation: -15 },
      eventSource: 'system',
      newsUrl: 'https://www.shopify.com/blog'
    },
    {
      title: 'Logistics Partner Delay - 3 Day Shipping Delay',
      description: 'Your delivery partner has delayed all shipments by 3 days due to weather conditions. 15 customers are waiting. You need to keep them happy with proactive communication.',
      type: 'logistics',
      durationHours: 18,
      costToSolve: 400,
      impact: { customerSatisfaction: -25, refunds: 10 },
      eventSource: 'system',
      newsUrl: 'https://www.fedex.com'
    },
    {
      title: 'Payment Gateway Issue - Stripe Outage',
      description: 'Your payment processor (Stripe) is experiencing an outage. Customers can\'t complete purchases. Revenue is being lost every minute. Set up backup payment method immediately.',
      type: 'technical',
      durationHours: 6,
      costToSolve: 200,
      impact: { sales: -30 },
      eventSource: 'system',
      newsUrl: 'https://status.stripe.com/'
    },
    {
      title: 'Negative Review Crisis - Viral Bad Review',
      description: 'A viral negative review on Trustpilot is affecting your brand reputation. The review has 500+ likes and is ranking high in search results. You need to respond quickly to prevent further damage.',
      type: 'reputation',
      durationHours: 8,
      costToSolve: 150,
      impact: { sales: -20, reputation: -30 },
      eventSource: 'system',
      newsUrl: 'https://www.trustpilot.com'
    },
    {
      title: 'Competitor Price War - 30% Price Drop',
      description: 'A major competitor just dropped prices by 30% on your top 3 products. Your sales have dropped 40% in the last 24 hours. You need to respond strategically without starting a price war.',
      type: 'competition',
      durationHours: 48,
      costToSolve: 800,
      impact: { sales: -35, profitMargin: -15 },
      eventSource: 'system',
      newsUrl: 'https://www.shopify.com/blog/pricing-strategy'
    },
    {
      title: 'Supplier Quality Issue - Defective Batch Received',
      description: 'You received a batch of 50 defective products from your supplier. Customers are complaining about quality. You need to handle returns and find an alternative supplier quickly.',
      type: 'quality',
      durationHours: 36,
      costToSolve: 600,
      impact: { reputation: -25, refunds: 20, customerSatisfaction: -30 },
      eventSource: 'system',
      newsUrl: 'https://www.aliexpress.com'
    },
    {
      title: 'Customs Clearance Delay - Shipment Held',
      description: 'Your shipment from India is held at customs due to incomplete documentation. 20 orders are stuck. You need to provide proper documentation within 48 hours or face penalties.',
      type: 'customs',
      durationHours: 48,
      costToSolve: 700,
      impact: { sales: -20, customerSatisfaction: -25, expenses: 15 },
      eventSource: 'system',
      affectedLocation: 'India',
      newsUrl: 'https://www.cbp.gov'
    },
    {
      title: 'Social Media Crisis - Brand Mention Gone Viral',
      description: 'A negative TikTok video about your product has gone viral with 100K+ views. Your brand reputation is at risk. You need to respond professionally and address concerns immediately.',
      type: 'reputation',
      durationHours: 12,
      costToSolve: 250,
      impact: { sales: -30, reputation: -35 },
      eventSource: 'system',
      newsUrl: 'https://www.tiktok.com/'
    },
    {
      title: 'Warehouse Fire - Inventory Loss',
      description: 'A fire at your supplier\'s warehouse has destroyed your inventory. You need to find alternative suppliers immediately and inform customers about delays.',
      type: 'disaster',
      durationHours: 72,
      costToSolve: 1200,
      impact: { sales: -40, inventory: -60, customerSatisfaction: -30 },
      eventSource: 'system',
      newsUrl: 'https://www.reuters.com/business/'
    },
    {
      title: 'Currency Exchange Rate Crash',
      description: 'The local currency has dropped 15% against USD. Your supplier costs have increased significantly. You need to adjust pricing or find local suppliers to maintain margins.',
      type: 'financial',
      durationHours: 24,
      costToSolve: 500,
      impact: { expenses: 20, profitMargin: -18 },
      eventSource: 'system',
      newsUrl: 'https://www.xe.com/currencyconverter/'
    },
    {
      title: 'Platform Account Suspension Risk',
      description: 'Your Shopify account is at risk of suspension due to policy violations. You need to fix issues immediately or risk losing your entire business.',
      type: 'compliance',
      durationHours: 6,
      costToSolve: 300,
      impact: { sales: -100, reputation: -50 },
      eventSource: 'system',
      newsUrl: 'https://www.shopify.com/legal/terms'
    },
    {
      title: 'Email Marketing Blacklist',
      description: 'Your email domain has been blacklisted by major email providers. Your marketing campaigns are not reaching customers. You need to resolve this quickly.',
      type: 'marketing',
      durationHours: 12,
      costToSolve: 200,
      impact: { sales: -15, marketingEffectiveness: -40 },
      eventSource: 'system',
      newsUrl: 'https://mxtoolbox.com'
    },
    {
      title: 'Customer Data Breach Alert',
      description: 'You\'ve discovered a potential data breach. Customer information may be compromised. You need to notify customers and implement security measures immediately.',
      type: 'security',
      durationHours: 4,
      costToSolve: 1000,
      impact: { reputation: -40, legalRisk: 50 },
      eventSource: 'system',
      newsUrl: 'https://www.ftc.gov'
    },
    {
      title: 'Shipping Cost Surge - Carrier Rate Increase',
      description: 'Your shipping carrier has increased rates by 25% effective immediately. Your profit margins are shrinking. You need to renegotiate or find alternative carriers.',
      type: 'logistics',
      durationHours: 24,
      costToSolve: 400,
      impact: { expenses: 18, profitMargin: -12 },
      eventSource: 'system',
      newsUrl: 'https://www.fedex.com'
    }
  ];
}

/**
 * Get pre-generated time-bound missions for all users
 * These are always available and don't depend on external APIs
 */
export function getPreGeneratedTimeBoundMissions(): MissionTemplate[] {
  const now = new Date();
  const missions: MissionTemplate[] = [];
  
  // Generate 10+ time-bound missions with varying deadlines
  const baseMissions = getStandardMissionTemplates();
  
  // Create variations with different deadlines (1 hour to 7 days)
  const deadlineVariations = [1, 3, 6, 12, 24, 48, 72, 96, 120, 168]; // hours
  
  baseMissions.forEach((mission, index) => {
    if (index < 10) { // Get first 10 missions
      missions.push({
        ...mission,
        durationHours: deadlineVariations[index] || 24,
        // Ensure newsUrl is always a valid URL (use main domain to avoid 404s)
        newsUrl: mission.newsUrl || 'https://www.reuters.com'
      });
    }
  });
  
  return missions;
}


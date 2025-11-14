/**
 * Mission Generator
 * Auto-generates missions based on real-world events, festivals, news, and business conditions
 */

import { fetchRelevantNews, getUpcomingFestivals, NewsEvent } from './news-api';

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

  // 1. Fetch news-based missions
  try {
    const newsEvents = await fetchRelevantNews(userLocations);
    for (const event of newsEvents.filter(e => e.relevance === 'high')) {
      missions.push(createMissionFromNews(event));
    }
  } catch (error) {
    console.error('Error fetching news for missions:', error);
  }

  // 2. Check upcoming festivals
  const festivals = getUpcomingFestivals();
  const today = new Date();
  for (const festival of festivals) {
    const daysUntil = Math.ceil((festival.date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (daysUntil <= 7 && daysUntil >= 0) {
      missions.push(createMissionFromFestival(festival));
    }
  }

  // 3. Add system-generated missions (labour, curfew, etc.)
  missions.push(...generateSystemMissions(userLocations));

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
        newsUrl: event.url
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
        newsUrl: event.url
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
        newsUrl: event.url
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
        newsUrl: event.url
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
        newsUrl: event.url
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
        newsUrl: event.url
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
 */
export function getStandardMissionTemplates(): MissionTemplate[] {
  return [
    {
      title: 'Delayed Supplier Shipment',
      description: 'Your manufacturer has delayed shipment by 2 weeks. You have 10 pending orders that need to be fulfilled. Customers are getting impatient.',
      type: 'supply_chain',
      durationHours: 24,
      costToSolve: 500,
      impact: { sales: -15, customerSatisfaction: -20 }
    },
    {
      title: 'Stock Management Crisis',
      description: 'You\'ve run out of your best-selling product. Orders are piling up but you have no inventory. Quick decisions needed!',
      type: 'inventory',
      durationHours: 12,
      costToSolve: 300,
      impact: { sales: -25, reputation: -15 }
    },
    {
      title: 'Logistics Partner Delay',
      description: 'Your delivery partner has delayed all shipments by 3 days. 15 customers are waiting. You need to keep them happy.',
      type: 'logistics',
      durationHours: 18,
      costToSolve: 400,
      impact: { customerSatisfaction: -25, refunds: 10 }
    },
    {
      title: 'Payment Gateway Issue',
      description: 'Your payment processor is down. Customers can\'t complete purchases. Revenue is being lost every minute.',
      type: 'technical',
      durationHours: 6,
      costToSolve: 200,
      impact: { sales: -30 }
    },
    {
      title: 'Negative Review Crisis',
      description: 'A viral negative review is affecting your brand. You need to respond quickly to prevent further damage.',
      type: 'reputation',
      durationHours: 8,
      costToSolve: 150,
      impact: { sales: -20, reputation: -30 }
    },
    {
      title: 'Competitor Price War',
      description: 'A major competitor just dropped prices by 30%. Your sales have dropped. You need to respond strategically.',
      type: 'competition',
      durationHours: 48,
      costToSolve: 800,
      impact: { sales: -35, profitMargin: -15 }
    }
  ];
}


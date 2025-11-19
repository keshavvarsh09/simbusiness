/**
 * News API Service
 * Fetches relevant news events that could affect supply chain, shipping, or business operations
 * 
 * Free APIs Available:
 * 1. NewsAPI.org - 100 requests/day free (https://newsapi.org)
 * 2. GNews API - 100 requests/day free (https://gnews.io)
 * 3. Currents API - 200 requests/day free (https://currentsapi.services)
 * 4. NewsData.io - 200 requests/day free (https://newsdata.io)
 */

export interface NewsEvent {
  title: string;
  description: string;
  source: string;
  url: string;
  publishedAt: string;
  location?: string;
  relevance: 'high' | 'medium' | 'low';
  impactType: 'supply_chain' | 'shipping' | 'labour' | 'curfew' | 'festival' | 'disaster' | 'other';
  affectedLocations?: string[];
}

// Request timeout (10 seconds for news APIs)
const NEWS_API_TIMEOUT_MS = 10000;

/**
 * Create a timeout promise
 */
function createTimeout(ms: number): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error(`Request timeout after ${ms}ms`)), ms);
  });
}

/**
 * Fetch with timeout
 */
async function fetchWithTimeout(url: string, options: RequestInit = {}): Promise<Response> {
  const timeoutPromise = createTimeout(NEWS_API_TIMEOUT_MS);
  const fetchPromise = fetch(url, options);
  
  return await Promise.race([fetchPromise, timeoutPromise]);
}

/**
 * Fetch news relevant to supply chain, shipping, and business operations
 * Improved with timeout handling and better error recovery
 */
export async function fetchRelevantNews(
  locations: string[] = ['India', 'China', 'Delhi', 'Mumbai', 'Bangalore'],
  keywords: string[] = ['supply chain', 'shipping delay', 'logistics', 'manufacturing', 'curfew', 'festival', 'strike', 'disaster']
): Promise<NewsEvent[]> {
  const events: NewsEvent[] = [];

  // Try NewsAPI.org first
  if (process.env.NEWS_API_KEY) {
    try {
      const query = keywords.join(' OR ');
      const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&apiKey=${process.env.NEWS_API_KEY}`;
      
      const response = await fetchWithTimeout(url, { 
        signal: AbortSignal.timeout(NEWS_API_TIMEOUT_MS) 
      });
      
      if (!response.ok) {
        throw new Error(`NewsAPI returned ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.articles && Array.isArray(data.articles)) {
        for (const article of data.articles.slice(0, 10)) {
          const relevance = calculateRelevance(article, locations, keywords);
          if (relevance !== 'low') {
            events.push({
              title: article.title || 'Untitled',
              description: article.description || article.title || '',
              source: article.source?.name || 'Unknown',
              url: article.url || '#',
              publishedAt: article.publishedAt || new Date().toISOString(),
              location: extractLocation(article.title + ' ' + (article.description || '')),
              relevance,
              impactType: determineImpactType(article.title + ' ' + (article.description || '')),
              affectedLocations: extractLocations(article.title + ' ' + (article.description || ''), locations)
            });
          }
        }
      }
      
      // If we got results, return early
      if (events.length > 0) {
        return events;
      }
    } catch (error: any) {
      console.error('NewsAPI error:', error.message);
      // Continue to next API
    }
  }

  // Try GNews API as fallback
  if (events.length === 0 && process.env.GNEWS_API_KEY) {
    try {
      const query = keywords.join(' OR ');
      const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=en&max=10&apikey=${process.env.GNEWS_API_KEY}`;
      
      const response = await fetchWithTimeout(url, { 
        signal: AbortSignal.timeout(NEWS_API_TIMEOUT_MS) 
      });
      
      if (!response.ok) {
        throw new Error(`GNews API returned ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.articles && Array.isArray(data.articles)) {
        for (const article of data.articles) {
          const relevance = calculateRelevance(article, locations, keywords);
          if (relevance !== 'low') {
            events.push({
              title: article.title || 'Untitled',
              description: article.description || article.title || '',
              source: article.source?.name || 'Unknown',
              url: article.url || '#',
              publishedAt: article.publishedAt || new Date().toISOString(),
              location: extractLocation(article.title + ' ' + (article.description || '')),
              relevance,
              impactType: determineImpactType(article.title + ' ' + (article.description || '')),
              affectedLocations: extractLocations(article.title + ' ' + (article.description || ''), locations)
            });
          }
        }
      }
      
      // If we got results, return early
      if (events.length > 0) {
        return events;
      }
    } catch (error: any) {
      console.error('GNews API error:', error.message);
      // Continue to next API
    }
  }

  // Try Currents API as another fallback
  if (events.length === 0 && process.env.CURRENTS_API_KEY) {
    try {
      const query = keywords.join(' OR ');
      const url = `https://api.currentsapi.services/v1/search?keywords=${encodeURIComponent(query)}&language=en&apiKey=${process.env.CURRENTS_API_KEY}`;
      
      const response = await fetchWithTimeout(url, { 
        signal: AbortSignal.timeout(NEWS_API_TIMEOUT_MS) 
      });
      
      if (!response.ok) {
        throw new Error(`Currents API returned ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.news && Array.isArray(data.news)) {
        for (const article of data.news.slice(0, 10)) {
          const relevance = calculateRelevance(article, locations, keywords);
          if (relevance !== 'low') {
            events.push({
              title: article.title || 'Untitled',
              description: article.description || article.title || '',
              source: article.author || 'Unknown',
              url: article.url || '#',
              publishedAt: article.published || new Date().toISOString(),
              location: extractLocation(article.title + ' ' + (article.description || '')),
              relevance,
              impactType: determineImpactType(article.title + ' ' + (article.description || '')),
              affectedLocations: extractLocations(article.title + ' ' + (article.description || ''), locations)
            });
          }
        }
      }
    } catch (error: any) {
      console.error('Currents API error:', error.message);
      // Continue - return empty or fallback data
    }
  }

  // If no events found from APIs, return empty array (or could add fallback mock data)
  return events;
}

/**
 * Calculate relevance of news article to business operations
 */
function calculateRelevance(article: any, locations: string[], keywords: string[]): 'high' | 'medium' | 'low' {
  const text = (article.title + ' ' + (article.description || '')).toLowerCase();
  
  // High relevance: mentions location + supply chain keywords
  const locationMatch = locations.some(loc => text.includes(loc.toLowerCase()));
  const supplyChainKeywords = ['supply', 'shipping', 'logistics', 'manufacturing', 'delay', 'disruption', 'strike', 'curfew', 'festival'];
  const hasSupplyChainKeyword = supplyChainKeywords.some(keyword => text.includes(keyword));
  
  if (locationMatch && hasSupplyChainKeyword) {
    return 'high';
  }
  
  // Medium relevance: either location or supply chain keyword
  if (locationMatch || hasSupplyChainKeyword) {
    return 'medium';
  }
  
  return 'low';
}

/**
 * Extract location from text
 */
function extractLocation(text: string): string | undefined {
  const locations = ['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'India', 'China', 'Beijing', 'Shanghai', 'Guangzhou', 'Shenzhen'];
  const lowerText = text.toLowerCase();
  
  for (const loc of locations) {
    if (lowerText.includes(loc.toLowerCase())) {
      return loc;
    }
  }
  
  return undefined;
}

/**
 * Extract all mentioned locations
 */
function extractLocations(text: string, relevantLocations: string[]): string[] {
  const found: string[] = [];
  const lowerText = text.toLowerCase();
  
  for (const loc of relevantLocations) {
    if (lowerText.includes(loc.toLowerCase())) {
      found.push(loc);
    }
  }
  
  return found;
}

/**
 * Determine impact type from article content
 */
function determineImpactType(text: string): NewsEvent['impactType'] {
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('curfew') || lowerText.includes('lockdown') || lowerText.includes('restriction')) {
    return 'curfew';
  }
  if (lowerText.includes('festival') || lowerText.includes('holiday') || lowerText.includes('celebration')) {
    return 'festival';
  }
  if (lowerText.includes('strike') || lowerText.includes('labour') || lowerText.includes('worker') || lowerText.includes('unavailability')) {
    return 'labour';
  }
  if (lowerText.includes('shipping') || lowerText.includes('delivery') || lowerText.includes('logistics')) {
    return 'shipping';
  }
  if (lowerText.includes('supply') || lowerText.includes('manufacturing') || lowerText.includes('production')) {
    return 'supply_chain';
  }
  if (lowerText.includes('disaster') || lowerText.includes('blast') || lowerText.includes('accident') || lowerText.includes('emergency')) {
    return 'disaster';
  }
  
  return 'other';
}

/**
 * Get festival dates for India (common festivals that affect business)
 */
export function getUpcomingFestivals(): Array<{ name: string; date: Date; location: string; impact: string }> {
  const now = new Date();
  const currentYear = now.getFullYear();
  
  // Common Indian festivals that affect business
  const festivals = [
    { name: 'Diwali', month: 10, day: 20, location: 'All India', impact: 'Major festival - 3-5 day delay expected' },
    { name: 'Dussehra', month: 9, day: 15, location: 'All India', impact: 'Festival period - 2-3 day delay' },
    { name: 'Holi', month: 2, day: 25, location: 'North India', impact: 'Festival - 1-2 day delay' },
    { name: 'Eid', month: 3, day: 10, location: 'All India', impact: 'Religious holiday - 1-2 day delay' },
    { name: 'Christmas', month: 11, day: 25, location: 'All India', impact: 'Holiday - 1 day delay' },
    { name: 'New Year', month: 0, day: 1, location: 'All India', impact: 'Holiday - 1 day delay' },
  ];
  
  return festivals
    .map(f => ({
      name: f.name,
      date: new Date(currentYear, f.month, f.day),
      location: f.location,
      impact: f.impact
    }))
    .filter(f => f.date >= now)
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 3);
}


/**
 * Supplier Generator - AI-powered supplier recommendations
 * Uses same algorithm as product recommendations
 */

import { generateProductRecommendations } from './ai-router';

export interface Supplier {
  id: number;
  name: string;
  location: string;
  category: string;
  rating: number;
  lead_time: string;
  price_level: 'Low' | 'Medium' | 'High';
  min_order: number;
  reliability_score?: number;
  specialties?: string[];
  contact_info?: {
    email?: string;
    website?: string;
  };
}

/**
 * Generate supplier recommendations based on user's products
 */
export async function generateSupplierRecommendations(
  userProducts: Array<{ category: string; name: string }>,
  budget?: number,
  preferredLocations?: string[]
): Promise<Supplier[]> {
  // Analyze user's product categories
  const categories = Array.from(new Set(userProducts.map(p => p.category)));
  const mainCategory = categories[0] || 'General';
  
  // Create prompt for supplier recommendations
  const prompt = `Based on the following dropshipping products, recommend 10 reliable suppliers:

Products:
${userProducts.map(p => `- ${p.name} (${p.category})`).join('\n')}

Main Category: ${mainCategory}
${budget ? `Budget: $${budget}` : ''}
${preferredLocations ? `Preferred Locations: ${preferredLocations.join(', ')}` : ''}

For each supplier, provide:
1. Supplier name (realistic business name)
2. Location (country/city)
3. Category they specialize in
4. Rating (4.0-5.0)
5. Lead time (e.g., "7-12 days", "3-5 days")
6. Price level (Low/Medium/High)
7. Minimum order quantity (MOQ)
8. Reliability score (0-100)
9. Specialties (what products they're best for)
10. Brief description of why they're recommended

Format as JSON array:
[
  {
    "name": "string",
    "location": "string (country/city)",
    "category": "string",
    "rating": number (4.0-5.0),
    "lead_time": "string (e.g., '7-12 days')",
    "price_level": "Low|Medium|High",
    "min_order": number,
    "reliability_score": number (0-100),
    "specialties": ["string"],
    "description": "string"
  }
]`;

  try {
    // Use AI router to generate recommendations
    const { generateWithGroq, isGroqAvailable } = await import('./groq');
    const { chatWithGemini } = await import('./gemini-optimized');

    let response: string;

    if (isGroqAvailable()) {
      try {
        response = await generateWithGroq(prompt, {
          temperature: 0.7,
          maxTokens: 2048
        });
      } catch (error) {
        // Fallback to Gemini
        response = await chatWithGemini(prompt);
      }
    } else {
      response = await chatWithGemini(prompt);
    }

    // Parse JSON response
    try {
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const suppliers = JSON.parse(jsonMatch[0]);
        
        // Transform to Supplier interface
        return suppliers.map((s: any, index: number) => ({
          id: index + 1,
          name: s.name || `Supplier ${index + 1}`,
          location: s.location || 'Unknown',
          category: s.category || mainCategory,
          rating: parseFloat(s.rating) || 4.0,
          lead_time: s.lead_time || '10-15 days',
          price_level: s.price_level || 'Medium',
          min_order: parseInt(s.min_order) || 10,
          reliability_score: parseInt(s.reliability_score) || 75,
          specialties: s.specialties || [s.category || mainCategory],
          description: s.description
        })) as Supplier[];
      }
    } catch (e) {
      console.error('Failed to parse supplier recommendations JSON:', e);
    }

    // If parsing fails, return default suppliers
    return getDefaultSuppliers(mainCategory);
  } catch (error) {
    console.error('Error generating supplier recommendations:', error);
    return getDefaultSuppliers(mainCategory);
  }
}

/**
 * Get default suppliers as fallback
 */
function getDefaultSuppliers(category: string): Supplier[] {
  const locations = ['China', 'India', 'Vietnam', 'USA', 'Germany'];
  const priceLevels: Array<'Low' | 'Medium' | 'High'> = ['Low', 'Medium', 'High'];
  
  return Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    name: `${category} Supplier ${i + 1}`,
    location: locations[i % locations.length],
    category,
    rating: 4.0 + (Math.random() * 1.0),
    lead_time: `${5 + i * 2}-${10 + i * 2} days`,
    price_level: priceLevels[i % priceLevels.length],
    min_order: 5 + i * 2,
    reliability_score: 70 + Math.floor(Math.random() * 30),
    specialties: [category]
  }));
}


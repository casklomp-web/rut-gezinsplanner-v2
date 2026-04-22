/**
 * Image Service
 * Fetches recipe images from external APIs
 */

import { useState, useEffect } from 'react';
import { Meal } from '@/lib/types';

// Unsplash API configuration
const UNSPLASH_ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY || '';
const UNSPLASH_API_URL = 'https://api.unsplash.com/search/photos';

// Cache for images to avoid repeated API calls
const imageCache = new Map<string, string>();

/**
 * Search for an image based on meal name and category
 */
export async function fetchRecipeImage(meal: Meal): Promise<string | null> {
  // Check cache first
  const cacheKey = `${meal.name}-${meal.category}`;
  if (imageCache.has(cacheKey)) {
    return imageCache.get(cacheKey)!;
  }

  // If no API key, return null (will use placeholder)
  if (!UNSPLASH_ACCESS_KEY) {
    return null;
  }

  try {
    // Build search query
    const searchTerms = [
      meal.name,
      meal.category === 'breakfast' ? 'breakfast' : '',
      meal.category === 'lunch' ? 'lunch' : '',
      meal.category === 'dinner' ? 'dinner' : '',
      'food',
    ].filter(Boolean).join(' ');

    const response = await fetch(
      `${UNSPLASH_API_URL}?query=${encodeURIComponent(searchTerms)}&per_page=1&orientation=squarish`,
      {
        headers: {
          'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch image');
    }

    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      const imageUrl = data.results[0].urls.small;
      // Cache the result
      imageCache.set(cacheKey, imageUrl);
      return imageUrl;
    }

    return null;
  } catch (error) {
    console.error('Error fetching recipe image:', error);
    return null;
  }
}

/**
 * Get a placeholder image URL based on category
 */
export function getPlaceholderImage(category: string): string {
  const placeholders: Record<string, string> = {
    breakfast: '/images/placeholder-breakfast.jpg',
    lunch: '/images/placeholder-lunch.jpg',
    dinner: '/images/placeholder-dinner.jpg',
    snack: '/images/placeholder-snack.jpg',
  };
  
  return placeholders[category] || '/images/placeholder-food.jpg';
}

/**
 * Hook to get image for a meal
 * Returns cached image or fetches new one
 */
export function useRecipeImage(meal: Meal): string {
  const [imageUrl, setImageUrl] = useState<string>(meal.imageUrl || getPlaceholderImage(meal.category));
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // If meal already has an image, use it
    if (meal.imageUrl) {
      setImageUrl(meal.imageUrl);
      return;
    }

    // Try to fetch from API
    const fetchImage = async () => {
      setIsLoading(true);
      const fetchedUrl = await fetchRecipeImage(meal);
      if (fetchedUrl) {
        setImageUrl(fetchedUrl);
      }
      setIsLoading(false);
    };

    fetchImage();
  }, [meal]);

  return imageUrl;
}

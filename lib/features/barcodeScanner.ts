/**
 * Barcode Scanner Utilities
 * Feature 7: Scan producten voor boodschappenlijst, auto-aanvullen van ingrediënten
 */

import { ShoppingItem, StoreCategory } from '@/lib/types';

export interface ScannedProduct {
  barcode: string;
  name: string;
  category: StoreCategory;
  defaultAmount: number;
  defaultUnit: string;
  estimatedPrice: number;
}

export interface BarcodeScanResult {
  success: boolean;
  product?: ScannedProduct;
  error?: string;
}

// Mock barcode database (in production, this would be an API)
const MOCK_BARCODE_DB: Record<string, ScannedProduct> = {
  '8710398001234': {
    barcode: '8710398001234',
    name: 'Kipfilet',
    category: 'meat',
    defaultAmount: 400,
    defaultUnit: 'g',
    estimatedPrice: 4.99,
  },
  '8710398001235': {
    barcode: '8710398001235',
    name: 'Rundergehakt',
    category: 'meat',
    defaultAmount: 500,
    defaultUnit: 'g',
    estimatedPrice: 5.49,
  },
  '8710398001236': {
    barcode: '8710398001236',
    name: 'Volle melk',
    category: 'dairy',
    defaultAmount: 1,
    defaultUnit: 'L',
    estimatedPrice: 1.29,
  },
  '8710398001237': {
    barcode: '8710398001237',
    name: 'Eieren',
    category: 'dairy',
    defaultAmount: 10,
    defaultUnit: 'stuks',
    estimatedPrice: 2.99,
  },
  '8710398001238': {
    barcode: '8710398001238',
    name: 'Boter',
    category: 'dairy',
    defaultAmount: 250,
    defaultUnit: 'g',
    estimatedPrice: 2.19,
  },
  '8710398001239': {
    barcode: '8710398001239',
    name: 'Pasta penne',
    category: 'pantry',
    defaultAmount: 500,
    defaultUnit: 'g',
    estimatedPrice: 1.49,
  },
  '8710398001240': {
    barcode: '8710398001240',
    name: 'Rijst',
    category: 'pantry',
    defaultAmount: 1,
    defaultUnit: 'kg',
    estimatedPrice: 2.49,
  },
  '8710398001241': {
    barcode: '8710398001241',
    name: 'Tomaten',
    category: 'produce',
    defaultAmount: 6,
    defaultUnit: 'stuks',
    estimatedPrice: 2.29,
  },
  '8710398001242': {
    barcode: '8710398001242',
    name: 'Komkommer',
    category: 'produce',
    defaultAmount: 1,
    defaultUnit: 'stuk',
    estimatedPrice: 0.99,
  },
  '8710398001243': {
    barcode: '8710398001243',
    name: 'Brood volkoren',
    category: 'bakery',
    defaultAmount: 1,
    defaultUnit: 'stuk',
    estimatedPrice: 2.49,
  },
  '8710398001244': {
    barcode: '8710398001244',
    name: 'Diepvries spinazie',
    category: 'frozen',
    defaultAmount: 450,
    defaultUnit: 'g',
    estimatedPrice: 1.79,
  },
  '8710398001245': {
    barcode: '8710398001245',
    name: 'Olijfolie',
    category: 'pantry',
    defaultAmount: 500,
    defaultUnit: 'ml',
    estimatedPrice: 4.99,
  },
};

export async function lookupBarcode(barcode: string): Promise<BarcodeScanResult> {
  // In production, this would call an external API
  // For now, use mock database with a simulated delay
  return new Promise((resolve) => {
    setTimeout(() => {
      const product = MOCK_BARCODE_DB[barcode];
      if (product) {
        resolve({ success: true, product });
      } else {
        resolve({
          success: false,
          error: 'Product niet gevonden. Voeg het handmatig toe.',
        });
      }
    }, 500);
  });
}

export function createShoppingItemFromProduct(
  product: ScannedProduct,
  weekId: string
): ShoppingItem {
  return {
    id: `scanned_${Date.now()}`,
    ingredientId: product.barcode,
    name: product.name,
    amount: product.defaultAmount,
    unit: product.defaultUnit,
    displayText: `${product.defaultAmount} ${product.defaultUnit} ${product.name}`,
    checked: false,
    isFresh: ['produce', 'meat', 'dairy'].includes(product.category),
    buyThisWeek: true,
    estimatedPrice: product.estimatedPrice,
  };
}

export function isBarcodeValid(barcode: string): boolean {
  // Basic validation: EAN-8, EAN-13, UPC-A
  return /^\d{8}$|^\d{12,13}$/.test(barcode);
}

export function formatBarcode(barcode: string): string {
  // Remove non-numeric characters
  return barcode.replace(/\D/g, '');
}

// Camera permission handling
export async function requestCameraPermission(): Promise<boolean> {
  try {
    const result = await navigator.permissions.query({ name: 'camera' as PermissionName });
    return result.state === 'granted';
  } catch {
    // Fallback: try to get user media
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch {
      return false;
    }
  }
}

export function isBarcodeScannerSupported(): boolean {
  return typeof navigator !== 'undefined' && 
    !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}

// Recently scanned cache
const RECENTLY_SCANNED_KEY = 'rut-recently-scanned';
const MAX_RECENT_ITEMS = 20;

export function getRecentlyScanned(): ScannedProduct[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(RECENTLY_SCANNED_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function addToRecentlyScanned(product: ScannedProduct): void {
  if (typeof window === 'undefined') return;
  
  const recent = getRecentlyScanned();
  const filtered = recent.filter(p => p.barcode !== product.barcode);
  const updated = [product, ...filtered].slice(0, MAX_RECENT_ITEMS);
  
  localStorage.setItem(RECENTLY_SCANNED_KEY, JSON.stringify(updated));
}

// Quick add items (common groceries)
export const QUICK_ADD_ITEMS: ScannedProduct[] = [
  {
    barcode: 'quick_milk',
    name: 'Melk',
    category: 'dairy',
    defaultAmount: 1,
    defaultUnit: 'L',
    estimatedPrice: 1.29,
  },
  {
    barcode: 'quick_eggs',
    name: 'Eieren',
    category: 'dairy',
    defaultAmount: 10,
    defaultUnit: 'stuks',
    estimatedPrice: 2.99,
  },
  {
    barcode: 'quick_bread',
    name: 'Brood',
    category: 'bakery',
    defaultAmount: 1,
    defaultUnit: 'stuk',
    estimatedPrice: 2.49,
  },
  {
    barcode: 'quick_butter',
    name: 'Boter',
    category: 'dairy',
    defaultAmount: 250,
    defaultUnit: 'g',
    estimatedPrice: 2.19,
  },
  {
    barcode: 'quick_cheese',
    name: 'Kaas',
    category: 'dairy',
    defaultAmount: 200,
    defaultUnit: 'g',
    estimatedPrice: 3.49,
  },
  {
    barcode: 'quick_pasta',
    name: 'Pasta',
    category: 'pantry',
    defaultAmount: 500,
    defaultUnit: 'g',
    estimatedPrice: 1.49,
  },
  {
    barcode: 'quick_rice',
    name: 'Rijst',
    category: 'pantry',
    defaultAmount: 1,
    defaultUnit: 'kg',
    estimatedPrice: 2.49,
  },
  {
    barcode: 'quick_tomatoes',
    name: 'Tomaten',
    category: 'produce',
    defaultAmount: 6,
    defaultUnit: 'stuks',
    estimatedPrice: 2.29,
  },
];

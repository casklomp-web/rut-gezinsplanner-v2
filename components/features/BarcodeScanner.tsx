'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Scan, X, Plus, History, Search, Camera, Loader2 } from 'lucide-react';
import { BrowserMultiFormatReader } from '@zxing/browser';
import {
  lookupBarcode,
  createShoppingItemFromProduct,
  isBarcodeScannerSupported,
  requestCameraPermission,
  getRecentlyScanned,
  addToRecentlyScanned,
  QUICK_ADD_ITEMS,
  ScannedProduct,
} from '@/lib/features/barcodeScanner';
import { ShoppingItem } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/Toast';

interface BarcodeScannerProps {
  weekId: string;
  onAddItem: (item: ShoppingItem) => void;
  className?: string;
}

export function BarcodeScanner({ weekId, onAddItem, className }: BarcodeScannerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedProduct, setScannedProduct] = useState<ScannedProduct | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recentItems, setRecentItems] = useState<ScannedProduct[]>([]);
  const [activeTab, setActiveTab] = useState<'scan' | 'recent' | 'quick'>('scan');
  const [manualBarcode, setManualBarcode] = useState('');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);

  useEffect(() => {
    setRecentItems(getRecentlyScanned());
  }, []);

  const startScanning = useCallback(async () => {
    if (!isBarcodeScannerSupported()) {
      setError('Camera niet ondersteund in deze browser');
      return;
    }

    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      setError('Camera toegang geweigerd');
      return;
    }

    setIsScanning(true);
    setError(null);

    try {
      codeReaderRef.current = new BrowserMultiFormatReader();
      
      await codeReaderRef.current.decodeFromConstraints(
        { video: { facingMode: 'environment' } },
        videoRef.current!,
        (result: { getText(): string } | undefined, error: Error | undefined) => {
          if (result) {
            handleBarcodeDetected(result.getText());
          }
          if (error && error.name !== 'NotFoundException') {
            console.error('Scan error:', error);
          }
        }
      );
    } catch (err) {
      console.error('Failed to start scanner:', err);
      setError('Kon scanner niet starten');
      setIsScanning(false);
    }
  }, []);

  const stopScanning = useCallback(() => {
    if (codeReaderRef.current) {
      // @ts-expect-error - reset exists at runtime but not in types
      codeReaderRef.current.reset?.();
      codeReaderRef.current = null;
    }
    setIsScanning(false);
  }, []);

  const handleBarcodeDetected = useCallback(async (barcode: string) => {
    if (isLoading) return;
    
    setIsLoading(true);
    stopScanning();

    const result = await lookupBarcode(barcode);
    
    if (result.success && result.product) {
      setScannedProduct(result.product);
      addToRecentlyScanned(result.product);
      setRecentItems(getRecentlyScanned());
    } else {
      setError(result.error || 'Product niet gevonden');
    }
    
    setIsLoading(false);
  }, [isLoading, stopScanning]);

  const handleManualLookup = useCallback(async () => {
    if (!manualBarcode.trim()) return;
    await handleBarcodeDetected(manualBarcode.trim());
    setManualBarcode('');
  }, [manualBarcode, handleBarcodeDetected]);

  const handleAddProduct = useCallback(() => {
    if (!scannedProduct) return;

    const item = createShoppingItemFromProduct(scannedProduct, weekId);
    onAddItem(item);
    toast.success(`${scannedProduct.name} toegevoegd`);
    
    setScannedProduct(null);
    setIsOpen(false);
  }, [scannedProduct, weekId, onAddItem]);

  const handleAddQuickItem = useCallback((product: ScannedProduct) => {
    const item = createShoppingItemFromProduct(product, weekId);
    onAddItem(item);
    toast.success(`${product.name} toegevoegd`);
    addToRecentlyScanned(product);
    setRecentItems(getRecentlyScanned());
  }, [weekId, onAddItem]);

  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, [stopScanning]);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          'flex items-center gap-2 px-4 py-2 bg-[#4A90A4] text-white rounded-lg hover:bg-[#3a7a8c] transition-colors',
          className
        )}
      >
        <Scan className="w-4 h-4" />
        <span>Scanner</span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Product toevoegen
          </h3>
          <button
            onClick={() => {
              stopScanning();
              setIsOpen(false);
              setScannedProduct(null);
              setError(null);
            }}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <TabButton
            active={activeTab === 'scan'}
            onClick={() => {
              setActiveTab('scan');
              setScannedProduct(null);
              setError(null);
            }}
            icon={Camera}
            label="Scannen"
          />
          <TabButton
            active={activeTab === 'quick'}
            onClick={() => {
              setActiveTab('quick');
              stopScanning();
            }}
            icon={Plus}
            label="Snel toevoegen"
          />
          <TabButton
            active={activeTab === 'recent'}
            onClick={() => {
              setActiveTab('recent');
              stopScanning();
            }}
            icon={History}
            label="Recent"
          />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'scan' && (
            <div className="space-y-4">
              {/* Scanner View */}
              {!scannedProduct && !error && (
                <>
                  <div className="relative aspect-square bg-black rounded-xl overflow-hidden">
                    {isScanning ? (
                      <video
                        ref={videoRef}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-white">
                        <Scan className="w-16 h-16 mb-4 opacity-50" />
                        <p className="text-sm opacity-70">Camera starten...</p>
                      </div>
                    )}
                    
                    {/* Scan overlay */}
                    {isScanning && (
                      <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute inset-0 bg-black/30" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-white/50 rounded-lg">
                          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#4A90A4]" />
                          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#4A90A4]" />
                          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#4A90A4]" />
                          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#4A90A4]" />
                        </div>
                      </div>
                    )}
                  </div>

                  {!isScanning && !isLoading && (
                    <Button onClick={startScanning} className="w-full">
                      <Camera className="w-4 h-4 mr-2" />
                      Start scanner
                    </Button>
                  )}

                  {isLoading && (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-8 h-8 animate-spin text-[#4A90A4]" />
                    </div>
                  )}

                  {/* Manual entry */}
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Of voer barcode handmatig in</p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={manualBarcode}
                        onChange={(e) => setManualBarcode(e.target.value)}
                        placeholder="Barcode nummer"
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                      />
                      <Button onClick={handleManualLookup} disabled={!manualBarcode.trim()}>
                        <Search className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </>
              )}

              {/* Scanned Product Result */}
              {scannedProduct && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    {scannedProduct.name}
                  </h4>
                  <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <p>Categorie: {scannedProduct.category}</p>
                    <p>Hoeveelheid: {scannedProduct.defaultAmount} {scannedProduct.defaultUnit}</p>
                    <p>Prijs: €{scannedProduct.estimatedPrice.toFixed(2)}</p>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button onClick={handleAddProduct} className="flex-1">
                      <Plus className="w-4 h-4 mr-2" />
                      Toevoegen
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setScannedProduct(null);
                        startScanning();
                      }}
                    >
                      Opnieuw
                    </Button>
                  </div>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 text-center">
                  <p className="text-red-600 dark:text-red-400 mb-3">{error}</p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setError(null);
                      startScanning();
                    }}
                  >
                    Probeer opnieuw
                  </Button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'quick' && (
            <div className="grid grid-cols-2 gap-2">
              {QUICK_ADD_ITEMS.map((item) => (
                <button
                  key={item.barcode}
                  onClick={() => handleAddQuickItem(item)}
                  className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-left hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <p className="font-medium text-sm text-gray-800 dark:text-gray-200">{item.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {item.defaultAmount} {item.defaultUnit}
                  </p>
                </button>
              ))}
            </div>
          )}

          {activeTab === 'recent' && (
            <div className="space-y-2">
              {recentItems.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                  Geen recente items
                </p>
              ) : (
                recentItems.map((item) => (
                  <button
                    key={item.barcode}
                    onClick={() => handleAddQuickItem(item)}
                    className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-sm text-gray-800 dark:text-gray-200">{item.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {item.defaultAmount} {item.defaultUnit}
                      </p>
                    </div>
                    <Plus className="w-4 h-4 text-[#4A90A4]" />
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ElementType;
  label: string;
}

function TabButton({ active, onClick, icon: Icon, label }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors',
        active
          ? 'text-[#4A90A4] border-b-2 border-[#4A90A4]'
          : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
      )}
    >
      <Icon className="w-4 h-4" />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

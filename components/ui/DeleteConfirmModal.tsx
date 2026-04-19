/**
 * Delete Confirm Modal
 * Confirmation dialog for destructive actions
 */

'use client';

import { AlertTriangle, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  itemName?: string;
  isDeleting?: boolean;
}

export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  itemName,
  isDeleting = false
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl w-full max-w-md p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-6 h-6 text-red-500" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">
              {title}
            </h2>
            <p className="text-gray-600 text-sm">
              {description}
            </p>
            {itemName && (
              <p className="mt-2 font-medium text-gray-900 bg-gray-100 rounded-lg px-3 py-2">
                "{itemName}"
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-end gap-3 mt-6">
          <Button variant="outline" onClick={onClose} disabled={isDeleting}>
            Annuleren
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-red-500 hover:bg-red-600"
          >
            {isDeleting ? 'Verwijderen...' : 'Verwijderen'}
          </Button>
        </div>
      </div>
    </div>
  );
}

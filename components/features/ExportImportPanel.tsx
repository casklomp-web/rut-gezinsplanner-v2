'use client';

import { useState, useRef, useCallback } from 'react';
import {
  Download,
  Upload,
  FileJson,
  FileSpreadsheet,
  Check,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  createBackup,
  exportToJSON,
  exportWeekToCSV,
  exportShoppingListToCSV,
  downloadCSV,
  parseBackupFile,
  validateBackup,
  BackupData,
} from '@/lib/features/exportImport';
import { Week, Meal, User } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/Toast';

interface ExportImportPanelProps {
  weeks: Week[];
  recipes: Meal[];
  user: User | null;
  onImport?: (data: BackupData) => void;
  className?: string;
}

export function ExportImportPanel({
  weeks,
  recipes,
  user,
  onImport,
  className,
}: ExportImportPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportJSON = useCallback(() => {
    const backup = createBackup(weeks, recipes, user);
    exportToJSON(backup);
    toast.success('Backup gedownload');
  }, [weeks, recipes, user]);

  const handleExportWeekCSV = useCallback(() => {
    const currentWeek = weeks[0];
    if (!currentWeek) {
      toast.error('Geen week om te exporteren');
      return;
    }
    const csv = exportWeekToCSV(currentWeek);
    downloadCSV(csv, `week-${currentWeek.weekNumber}-${currentWeek.year}.csv`);
    toast.success('Week geëxporteerd als CSV');
  }, [weeks]);

  const handleExportShoppingCSV = useCallback(() => {
    const currentWeek = weeks[0];
    if (!currentWeek?.shoppingList) {
      toast.error('Geen boodschappenlijst om te exporteren');
      return;
    }
    const csv = exportShoppingListToCSV(currentWeek);
    downloadCSV(csv, `boodschappen-week-${currentWeek.weekNumber}.csv`);
    toast.success('Boodschappenlijst geëxporteerd');
  }, [weeks]);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImportFile(file);
    }
  }, []);

  const handleImport = useCallback(async () => {
    if (!importFile) return;

    setIsImporting(true);
    try {
      const data = await parseBackupFile(importFile);
      onImport?.(data);
      toast.success('Backup succesvol geïmporteerd');
      setImportFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      toast.error('Import mislukt: ' + (error as Error).message);
    } finally {
      setIsImporting(false);
    }
  }, [importFile, onImport]);

  return (
    <div className={cn('bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700', className)}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 text-left"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#4A90A4]/10 rounded-lg flex items-center justify-center">
            <FileJson className="w-5 h-5 text-[#4A90A4]" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-200">Backup & Import</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Exporteer of importeer je data</p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 space-y-4">
          {/* Export Section */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Exporteren</h4>
            <div className="grid grid-cols-1 gap-2">
              <ExportButton
                onClick={handleExportJSON}
                icon={FileJson}
                label="Volledige backup (JSON)"
                description="Alle weken, recepten en instellingen"
              />
              <ExportButton
                onClick={handleExportWeekCSV}
                icon={FileSpreadsheet}
                label="Weekplanning (CSV)"
                description="Huidige week als spreadsheet"
              />
              <ExportButton
                onClick={handleExportShoppingCSV}
                icon={FileSpreadsheet}
                label="Boodschappenlijst (CSV)"
                description="Boodschappen als spreadsheet"
              />
            </div>
          </div>

          {/* Import Section */}
          <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Importeren</h4>
            <div className="space-y-3">
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileSelect}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center gap-3 p-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-[#4A90A4] dark:hover:border-[#4A90A4] transition-colors"
              >
                <Upload className="w-5 h-5 text-gray-400" />
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {importFile ? importFile.name : 'Kies een backup bestand'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">JSON bestanden (.json)</p>
                </div>
              </button>

              {importFile && (
                <Button
                  onClick={handleImport}
                  disabled={isImporting}
                  className="w-full"
                >
                  {isImporting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Importeren...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Importeer backup
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ExportButton({
  onClick,
  icon: Icon,
  label,
  description,
}: {
  onClick: () => void;
  icon: React.ElementType;
  label: string;
  description: string;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 w-full p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-left"
    >
      <Icon className="w-5 h-5 text-[#4A90A4]" />
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{label}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
      </div>
      <Download className="w-4 h-4 text-gray-400" />
    </button>
  );
}

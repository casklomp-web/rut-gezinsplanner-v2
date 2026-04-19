'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Users,
  Activity,
  AlertTriangle,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  Clock,
  User,
  Wifi,
  WifiOff,
} from 'lucide-react';
import {
  getActivityLog,
  formatActivityLogEntry,
  getHousehold,
  updateMemberOnlineStatus,
  Conflict,
  ActivityLogEntry,
  Household,
  HouseholdMember,
} from '@/lib/features/collaborativeEditing';
import { Week, User as UserType } from '@/lib/types';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/Toast';

interface CollaborativeStatusProps {
  week: Week;
  currentUser: UserType;
  conflicts?: Conflict[];
  onResolveConflict?: (conflict: Conflict, resolution: 'local' | 'remote') => void;
  className?: string;
}

export function CollaborativeStatus({
  week,
  currentUser,
  conflicts = [],
  onResolveConflict,
  className,
}: CollaborativeStatusProps) {
  const [household, setHousehold] = useState<Household | null>(null);
  const [activityLog, setActivityLog] = useState<ActivityLogEntry[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showActivity, setShowActivity] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setHousehold(getHousehold());
    setActivityLog(getActivityLog(week.id));
  }, [week.id]);

  // Update online status periodically
  useEffect(() => {
    if (!household) return;

    const interval = setInterval(() => {
      const updated = updateMemberOnlineStatus(household, currentUser.id, true);
      setHousehold(updated);
    }, 30000);

    return () => clearInterval(interval);
  }, [household, currentUser.id]);

  // Listen for online/offline events
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const unresolvedConflicts = conflicts.filter(c => !c.resolved);
  const onlineMembers = household?.members.filter(m => m.isOnline) || [];

  return (
    <div className={cn('space-y-4', className)}>
      {/* Connection Status */}
      <div className={cn(
        'flex items-center gap-2 px-3 py-2 rounded-lg text-sm',
        isOnline
          ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
          : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
      )}>
        {isOnline ? (
          <Wifi className="w-4 h-4" />
        ) : (
          <WifiOff className="w-4 h-4" />
        )}
        <span>{isOnline ? 'Verbonden' : 'Offline'}</span>
      </div>

      {/* Household Members */}
      {household && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#4A90A4]/10 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-[#4A90A4]" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-200">{household.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {onlineMembers.length} van {household.members.length} online
                </p>
              </div>
            </div>
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>

          {isExpanded && (
            <div className="px-4 pb-4">
              <div className="space-y-2">
                {household.members.map(member => (
                  <MemberRow key={member.userId} member={member} isCurrentUser={member.userId === currentUser.id} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Conflicts */}
      {unresolvedConflicts.length > 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4 border border-yellow-200 dark:border-yellow-800">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            <h3 className="font-semibold text-yellow-800 dark:text-yellow-400">
              {unresolvedConflicts.length} conflict{unresolvedConflicts.length > 1 ? 'en' : ''} gevonden
            </h3>
          </div>
          <div className="space-y-2">
            {unresolvedConflicts.map(conflict => (
              <ConflictCard
                key={conflict.id}
                conflict={conflict}
                onResolve={onResolveConflict}
              />
            ))}
          </div>
        </div>
      )}

      {/* Activity Log */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <button
          onClick={() => setShowActivity(!showActivity)}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">Activiteit</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {activityLog.length} recente acties
              </p>
            </div>
          </div>
          {showActivity ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>

        {showActivity && (
          <div className="px-4 pb-4">
            {activityLog.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                Nog geen activiteit
              </p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {activityLog.slice(0, 20).map(entry => (
                  <ActivityRow key={entry.id} entry={entry} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function MemberRow({ member, isCurrentUser }: { member: HouseholdMember; isCurrentUser: boolean }) {
  return (
    <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
      <div className="flex items-center gap-2">
        <div className={cn(
          'w-2 h-2 rounded-full',
          member.isOnline ? 'bg-green-500' : 'bg-gray-400'
        )} />
        <User className="w-4 h-4 text-gray-400" />
        <span className="text-sm text-gray-700 dark:text-gray-300">
          {member.name}
          {isCurrentUser && <span className="text-gray-400 ml-1">(jij)</span>}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className={cn(
          'text-xs px-2 py-0.5 rounded-full',
          member.role === 'admin'
            ? 'bg-[#4A90A4]/10 text-[#4A90A4]'
            : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
        )}>
          {member.role === 'admin' ? 'Beheerder' : 'Lid'}
        </span>
        {!member.isOnline && (
          <span className="text-xs text-gray-400">
            <Clock className="w-3 h-3 inline mr-1" />
            {new Date(member.lastSeen).toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
      </div>
    </div>
  );
}

function ConflictCard({
  conflict,
  onResolve,
}: {
  conflict: Conflict;
  onResolve?: (conflict: Conflict, resolution: 'local' | 'remote') => void;
}) {
  const [isResolving, setIsResolving] = useState(false);

  const handleResolve = (resolution: 'local' | 'remote') => {
    setIsResolving(true);
    onResolve?.(conflict, resolution);
    setIsResolving(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-yellow-300 dark:border-yellow-700">
      <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
        Wijziging in {conflict.field}
      </p>
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded">
          <p className="text-xs text-gray-500 dark:text-gray-400">Jouw versie</p>
          <p className="text-sm text-gray-700 dark:text-gray-300">{String(conflict.localValue)}</p>
        </div>
        <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded">
          <p className="text-xs text-gray-500 dark:text-gray-400">Andere versie</p>
          <p className="text-sm text-gray-700 dark:text-gray-300">{String(conflict.remoteValue)}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => handleResolve('local')}
          disabled={isResolving}
          className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-[#4A90A4] text-white rounded-lg text-sm hover:bg-[#3a7a8c] transition-colors disabled:opacity-50"
        >
          <Check className="w-4 h-4" />
          Jouw versie
        </button>
        <button
          onClick={() => handleResolve('remote')}
          disabled={isResolving}
          className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors disabled:opacity-50"
        >
          <X className="w-4 h-4" />
          Andere versie
        </button>
      </div>
    </div>
  );
}

function ActivityRow({ entry }: { entry: ActivityLogEntry }) {
  return (
    <div className="flex items-start gap-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors">
      <div className="w-6 h-6 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
        <User className="w-3 h-3 text-gray-500" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          {formatActivityLogEntry(entry)}
        </p>
        <p className="text-xs text-gray-400">
          {new Date(entry.timestamp).toLocaleString('nl-NL', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>
    </div>
  );
}

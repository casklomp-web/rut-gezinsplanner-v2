'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { Task } from '@/lib/types/task';
import { useTaskStore } from '@/lib/store/taskStore';
import { useUserStore } from '@/lib/store/userStore';
import { useNotificationStore } from '@/lib/store/notificationStore';
import { Check, GripHorizontal, User } from 'lucide-react';
import { toast } from '@/components/ui/Toast';

interface DragToAssignProps {
  task: Task;
  onAssign: (memberId: string) => void;
}

export function DragToAssign({ task, onAssign }: DragToAssignProps) {
  const { users, currentUser } = useUserStore();
  const [isDragging, setIsDragging] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  const constraintsRef = useRef(null);
  
  const allUsers = currentUser ? [currentUser, ...users.filter(u => u.id !== currentUser.id)] : users;
  const currentAssignee = allUsers.find(u => u.id === task.assignedTo);

  const handleDragEnd = (event: any, info: PanInfo) => {
    setIsDragging(false);
    
    // Check if dragged far enough to show members
    if (info.offset.x > 50 || info.offset.x < -50) {
      setShowMembers(true);
    }
  };

  const handleAssign = (memberId: string) => {
    onAssign(memberId);
    setShowMembers(false);
    const member = allUsers.find(u => u.id === memberId);
    toast.success(`Taak toegewezen aan ${member?.name || 'gezinslid'}`);
  };

  return (
    <div className="relative" ref={constraintsRef}>
      {/* Draggable task card */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        whileTap={{ scale: 1.02 }}
        className={`bg-white rounded-xl p-4 shadow-sm border border-gray-100 cursor-grab active:cursor-grabbing ${
          isDragging ? 'shadow-lg' : ''
        }`}
      >
        <div className="flex items-center gap-3">
          <GripHorizontal className="w-5 h-5 text-gray-400" />
          <div className="flex-1">
            <p className="font-medium text-gray-900">{task.title}</p>
            <p className="text-sm text-gray-500">
              {currentAssignee ? `Toegewezen aan: ${currentAssignee.name}` : 'Niet toegewezen'}
            </p>
          </div>
          {task.status === 'done' && <Check className="w-5 h-5 text-green-500" />}
        </div>
        
        {/* Swipe hint */}
        <div className="flex justify-center mt-2">
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <span>← Swipe om toe te wijzen →</span>
          </div>
        </div>
      </motion.div>

      {/* Members selection overlay */}
      {showMembers && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 p-4 z-10"
        >
          <p className="text-sm font-medium text-gray-700 mb-3">Toewijzen aan:</p>
          <div className="flex gap-2">
            {allUsers.map((user: any) => (
              <motion.button
                key={user.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAssign(user.id)}
                className={`flex flex-col items-center p-3 rounded-xl transition-colors ${
                  task.assignedTo === user.id 
                    ? 'bg-[#4A90A4]/10 ring-2 ring-[#4A90A4]' 
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div 
                  className="w-12 h-12 rounded-full mb-2 flex items-center justify-center text-white font-medium"
                  style={{ backgroundColor: user.color || '#4A90A4' }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-gray-700">{user.name}</span>
              </motion.button>
            ))}
          </div>
          <button
            onClick={() => setShowMembers(false)}
            className="w-full mt-3 py-2 text-sm text-gray-500 hover:text-gray-700"
          >
            Annuleren
          </button>
        </motion.div>
      )}
    </div>
  );
}

// Simpler version for task board - swipe to reveal assign button
export function SwipeableTaskCard({ 
  task, 
  onEdit 
}: { 
  task: Task; 
  onEdit: (task: Task) => void;
}) {
  const { users, currentUser } = useUserStore();
  const { updateTask, getFamilyMemberById } = useTaskStore();
  const { notifyTaskAssigned } = useNotificationStore();
  const [isRevealed, setIsRevealed] = useState(false);
  const x = useMotionValue(0);
  const background = useTransform(
    x,
    [-100, 0, 100],
    ["rgba(74, 144, 164, 0.2)", "rgba(255, 255, 255, 1)", "rgba(124, 179, 66, 0.2)"]
  );

  const allUsers = currentUser ? [currentUser, ...users.filter(u => u.id !== currentUser.id)] : users;
  const assignee = getFamilyMemberById(task.assignedTo) || allUsers.find(u => u.id === task.assignedTo);

  const handleDragEnd = (event: any, info: PanInfo) => {
    if (info.offset.x > 80) {
      setIsRevealed(true);
    } else if (info.offset.x < -80) {
      // Quick complete on left swipe
      updateTask(task.id, { status: task.status === 'done' ? 'todo' : 'done' });
      toast.success(task.status === 'done' ? 'Taak heropend' : 'Taak voltooid!');
    }
    setIsRevealed(false);
  };

  const handleAssign = (memberId: string) => {
    updateTask(task.id, { assignedTo: memberId });
    setIsRevealed(false);
    const member = allUsers.find(u => u.id === memberId);
    toast.success(`Toegewezen aan ${member?.name || 'gezinslid'}`);
    
    // Send notification to assigned user
    if (memberId !== currentUser?.id) {
      notifyTaskAssigned(task.title, currentUser?.name || 'Iemand', memberId);
    }
  };

  return (
    <div className="relative overflow-hidden">
      {/* Background actions */}
      <div className="absolute inset-0 flex">
        <div className="flex-1 bg-red-50 flex items-center justify-start pl-4">
          <span className="text-red-600 font-medium text-sm">← Voltooien</span>
        </div>
        <div className="flex-1 bg-[#4A90A4]/10 flex items-center justify-end pr-4">
          <span className="text-[#4A90A4] font-medium text-sm">Toewijzen →</span>
        </div>
      </div>

      {/* Draggable card */}
      <motion.div
        style={{ x, background }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        onClick={() => !isRevealed && onEdit(task)}
        className="relative bg-white rounded-xl p-4 border border-gray-100 cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium flex-shrink-0"
            style={{ backgroundColor: assignee?.color || '#4A90A4' }}
          >
            {assignee ? assignee.name.charAt(0).toUpperCase() : <User className="w-5 h-5" />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 truncate">{task.title}</p>
            <p className="text-sm text-gray-500">
              {assignee ? assignee.name : 'Niet toegewezen'}
            </p>
          </div>
          {task.status === 'done' && (
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <Check className="w-4 h-4 text-white" />
            </div>
          )}
        </div>
      </motion.div>

      {/* Assign overlay */}
      {isRevealed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-xl flex items-center justify-center gap-2 p-2"
        >
          {allUsers.slice(0, 4).map((user: any) => (
            <motion.button
              key={user.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                handleAssign(user.id);
              }}
              className="w-12 h-12 rounded-full text-white font-medium shadow-md"
              style={{ backgroundColor: user.color || '#4A90A4' }}
              title={user.name}
            >
              {user.name.charAt(0).toUpperCase()}
            </motion.button>
          ))}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsRevealed(false);
            }}
            className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-500"
          >
            ×
          </button>
        </motion.div>
      )}
    </div>
  );
}

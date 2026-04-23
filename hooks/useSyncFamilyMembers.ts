'use client';

import { useEffect } from 'react';
import { useUserStore } from '@/lib/store/userStore';
import { useTaskStore } from '@/lib/store/taskStore';

export function useSyncFamilyMembers() {
  const { currentUser, users } = useUserStore();
  const { familyMembers, addFamilyMember, removeFamilyMember } = useTaskStore();

  useEffect(() => {
    // Convert users to family members format
    const allUsers = currentUser ? [currentUser, ...users.filter(u => u.id !== currentUser.id)] : users;
    
    allUsers.forEach((user: any) => {
      const exists = familyMembers.find(m => m.id === user.id);
      if (!exists) {
        addFamilyMember({
          id: user.id,
          name: user.name,
          role: user.role === 'primary' ? 'parent' : 'other',
          color: user.color || '#4A90A4',
        });
      }
    });
    
    // Remove family members that no longer exist in users
    familyMembers.forEach(member => {
      const userExists = allUsers.find((u: any) => u.id === member.id);
      if (!userExists) {
        removeFamilyMember(member.id);
      }
    });
  }, [users, currentUser, familyMembers, addFamilyMember, removeFamilyMember]);
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Gift, Globe, Target, Edit3, Settings, ShieldAlert, UserCheck } from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  currentView: string;
  setView: (v: string) => void;
  setSelectedItem: (item: any) => void;
  currentUser: UserProfile;
  allUsers: UserProfile[];
  onSelectUser: (user: UserProfile) => void;
}

export default function Navbar({
  currentView,
  setView,
  setSelectedItem,
  currentUser,
  allUsers,
  onSelectUser,
}: NavbarProps) {
  return (
    <aside className="w-[220px] h-full border-r border-[#333] flex flex-col px-6 py-8 box-border shrink-0 bg-black overflow-y-auto">
      {/* Logo & Slogan */}
      <div 
        className="text-[18px] font-black tracking-[-1px] mb-[60px] uppercase cursor-pointer"
        onClick={() => { setView('explore'); setSelectedItem(null); }}
        id="nav-brand-logo"
      >
        回憶轉運站
      </div>

      <div className="flex flex-col flex-1">
        <div 
          onClick={() => { setView('explore'); setSelectedItem(null); }}
          className={`mb-6 text-[11px] font-semibold tracking-[1px] uppercase cursor-pointer ${currentView === 'explore' ? 'text-white' : 'text-[#666] hover:text-white'}`}
        >
          Explore Pool
        </div>
        <div 
          onClick={() => { setView('dashboard'); setSelectedItem(null); }}
          className={`mb-6 text-[11px] font-semibold tracking-[1px] uppercase cursor-pointer ${currentView === 'dashboard' ? 'text-white' : 'text-[#666] hover:text-white'}`}
        >
          My Dashboard
        </div>
        <div 
          onClick={() => { setView('post'); setSelectedItem(null); }}
          className={`mb-6 text-[11px] font-semibold tracking-[1px] uppercase cursor-pointer ${currentView === 'post' ? 'text-white' : 'text-[#666] hover:text-white'}`}
        >
          Post Story
        </div>
        <div 
          onClick={() => { setView('admin'); setSelectedItem(null); }}
          className={`mb-6 text-[11px] font-semibold tracking-[1px] uppercase cursor-pointer ${currentView === 'admin' ? 'text-white' : 'text-[#666] hover:text-white'}`}
        >
          State Logs
        </div>
      </div>

      <div className="mt-8 border-t border-[#333] pt-6 flex flex-col gap-4">
        <div className="text-[10px] text-[#666] uppercase tracking-[1px] font-bold">
          Current Identify:
        </div>
        {allUsers.map((u) => (
          <div
            key={u.id}
            onClick={() => onSelectUser(u)}
            className={`text-[11px] font-semibold tracking-[1px] uppercase cursor-pointer flex items-center gap-2 ${u.id === currentUser.id ? 'text-white' : 'text-[#666] hover:text-white'}`}
          >
            <div className={`w-2 h-2 rounded-full ${u.id === currentUser.id ? 'bg-white' : 'bg-[#333]'}`}></div>
            {u.name.split('-')[0]}
          </div>
        ))}
      </div>
    </aside>
  );
}

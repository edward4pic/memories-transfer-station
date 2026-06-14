/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Globe, Search, HeartHandshake, Inbox, Star, Flame, Tag, 
  HelpCircle, User, Sparkles, Filter, CheckCircle2, AlertTriangle, BadgeAlert
} from 'lucide-react';
import { Item } from '../types';

interface ExploreViewProps {
  items: Item[];
  onSelectItem: (item: Item) => void;
}

export default function ExploreView({ items, onSelectItem }: ExploreViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all'); // 'all', 'active', 'completed'

  // Extract all unique tags
  const allTags = Array.from(
    new Set(items.flatMap((item) => item.tags))
  );

  // Filter items
  const filteredItems = items.filter((item) => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.story.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.ownerName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTag = selectedTag ? item.tags.includes(selectedTag) : true;
    
    const matchesStatus = 
      statusFilter === 'all' || 
      (statusFilter === 'active' && item.status === 'active') ||
      (statusFilter === 'completed' && item.status === 'completed');

    return matchesSearch && matchesTag && matchesStatus;
  });

  return (
    <div className="h-full px-8 py-8 md:px-12 object-contain box-border relative flex flex-col font-sans">
      
      {/* Front-end Header */}
      <div className="flex justify-between items-end mb-10 shrink-0">
        <h1 className="text-[80px] md:text-[120px] font-black m-0 leading-[0.8] tracking-[-6px] uppercase">
          EXPLORE
        </h1>
        <div className="flex gap-10">
          <div className="text-right">
            <div className="text-[10px] uppercase text-[#666] tracking-[1px] mb-2">Total Items</div>
            <div className="text-[32px] font-light">{items.length}</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase text-[#666] tracking-[1px] mb-2">Active</div>
            <div className="text-[32px] font-light">{items.filter(i => i.status === 'active').length}</div>
          </div>
        </div>
      </div>

      {/* Control Widgets: Search, Tags, Status Filter */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 shrink-0">
        {/* Search Bar */}
        <div className="col-span-1 border border-[#333] p-6 flex flex-col">
          <div className="text-[10px] uppercase tracking-[1px] mb-4 text-[#666]">Query Items</div>
          <input 
            type="text" 
            placeholder="Search by keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-b border-[#333] pb-2 text-[16px] text-white placeholder-[#666] focus:outline-none focus:border-white transition-all rounded-none"
          />
        </div>

        {/* Status Filters */}
        <div className="col-span-1 border border-[#333] p-6 flex flex-col">
          <div className="text-[10px] uppercase tracking-[1px] mb-4 text-[#666]">Status State</div>
          <div className="flex gap-2 flex-wrap">
            {['all', 'active', 'completed'].map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1 text-[10px] font-bold uppercase tracking-[0.5px] rounded-full border ${statusFilter === s ? 'bg-white text-black border-white' : 'border-[#444] text-[#aaa] hover:border-white hover:text-white'}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="col-span-1 border border-[#333] p-6 flex flex-col">
          <div className="text-[10px] uppercase tracking-[1px] mb-4 text-[#666]">Data Tags</div>
          <div className="flex gap-2 flex-wrap overflow-y-auto max-h-[80px]">
             <button
                onClick={() => setSelectedTag(null)}
                className={`px-3 py-1 text-[10px] font-bold uppercase tracking-[0.5px] rounded-full border ${selectedTag === null ? 'bg-white text-black border-white' : 'border-[#444] text-[#aaa] hover:border-white hover:text-white'}`}
              >
                ALL
              </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-3 py-1 text-[10px] font-bold uppercase tracking-[0.5px] rounded-full border ${selectedTag === tag ? 'bg-white text-black border-white' : 'border-[#444] text-[#aaa] hover:border-white hover:text-white'}`}
              >
                {tag.replace('#', '')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table Interface for Grid items to match Bold Typography */}
      <div className="flex-1 border-t border-[#333] flex flex-col overflow-y-auto min-h-0">
        <div className="grid grid-cols-[100px_minmax(150px,1.5fr)_minmax(100px,1fr)_120px] py-5 border-b border-[#1a1a1a] items-center text-[11px] uppercase tracking-[1px] text-[#444] font-semibold sticky top-0 bg-black z-10">
          <div>ID</div>
          <div>Memory Object</div>
          <div>Status</div>
          <div className="text-right">Action</div>
        </div>

        {filteredItems.length === 0 ? (
          <div className="text-[#666] text-center p-12 text-[12px] uppercase tracking-[2px]">No modules found.</div>
        ) : (
          filteredItems.map(item => {
            const isCompleted = item.status === 'completed';
            const isSuspended = item.status === 'suspended';
            return (
              <div key={item.id} className="grid grid-cols-[100px_minmax(150px,1.5fr)_minmax(100px,1fr)_120px] py-5 border-b border-[#1a1a1a] items-center hover:bg-[#0a0a0a] transition-colors cursor-pointer group" onClick={() => onSelectItem(item)}>
                <div className="font-mono text-[12px] text-[#666] uppercase">#{item.id.split('_')[1].slice(-4)}</div>
                <div className="pr-4">
                  <div className="font-semibold text-white truncate max-w-full text-base">{item.title}</div>
                  <div className="text-[10px] text-[#666] uppercase tracking-[1px] truncate max-w-full">{item.ownerName}</div>
                </div>
                <div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.5px] inline-block text-center ${
                    item.status === 'active' ? 'bg-white text-black' : 
                    isCompleted ? 'bg-[#00ff00] text-black' : 
                    isSuspended ? 'bg-[#ff3b30] text-white' : 
                    'border border-[#444] text-[#aaa]'
                  }`}>
                    {item.status}
                  </span>
                </div>
                <div className="text-right text-[12px] font-semibold underline cursor-pointer text-[#aaa] group-hover:text-white">
                  INSPECT
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  );
}

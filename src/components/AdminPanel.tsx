/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Settings, ShieldAlert, CheckCircle2, AlertTriangle, BadgeAlert, 
  Trash2, RefreshCw, Layers, Database, Coins, Terminal, Sparkles, Plus, Play, User
} from 'lucide-react';
import { Item, UserGoal, SystemLog } from '../types';

interface AdminPanelProps {
  items: Item[];
  userGoals: UserGoal[];
  systemLogs: SystemLog[];
  onUpdateItemStatus: (itemId: string, status: 'pending' | 'active' | 'suspended' | 'completed') => void;
  onSimulateBid: (itemId: string, bidderName: string, amount: number) => void;
  onUpdateGoalProgress: (goalId: string, delta: number) => void;
  onClearLogs: () => void;
  onResetDatabase: () => void;
}

export default function AdminPanel({
  items,
  userGoals,
  systemLogs,
  onUpdateItemStatus,
  onSimulateBid,
  onUpdateGoalProgress,
  onClearLogs,
  onResetDatabase
}: AdminPanelProps) {
  
  // States for simulated actions
  const [selectedItemForBid, setSelectedItemForBid] = useState(items[0]?.id || '');
  const [simulatedBidder, setSimulatedBidder] = useState('黑客帝國愛好者');
  const [simulatedBidAmount, setSimulatedBidAmount] = useState(500);

  const handleSimulatedBidSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItemForBid) return;
    const targetItem = items.find(i => i.id === selectedItemForBid);
    if (!targetItem) return;
    
    if (simulatedBidAmount <= targetItem.highestBid) {
      alert(`模擬出價金額大於目前最高金額 ($${targetItem.highestBid}) 才能加碼成功！`);
      return;
    }

    onSimulateBid(selectedItemForBid, simulatedBidder, simulatedBidAmount);
    // Auto increment default state
    setSimulatedBidAmount(prev => prev + 150);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans text-white" id="admin-panel-root">
      
      {/* Admin Title Banner */}
      <div className="mb-10 bg-[#111111] border-2 border-white p-6 md:p-8 text-white relative">
        <div className="absolute right-6 top-1/2 -translate-y-1/2 text-white/10 pointer-events-none">
          <Database className="w-56 h-56" />
        </div>
        <div className="z-10 relative">
          <span className="bg-black border border-white text-white text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1 inline-flex items-center mb-3">
            <Settings className="w-3.5 h-3.5 mr-1.5 animate-spin-hover" />
            後台管理與狀態沙盒模擬器 (Backend Admin)
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter">
            回憶轉運站 — 系統控制台
          </h1>
          <p className="text-[#cccccc] font-mono text-xs mt-1 max-w-xl font-medium leading-relaxed">
            此管理面板是為審查、測試所設的<strong>全方位狀態後台</strong>。
            您可以隨時變更二手物品的公開狀態，仿真注入海量贊助或搶標出價金額入學費進度，並監視完整的交易日誌。
          </p>
        </div>
      </div>

      {/* Main Grid: Item Status Table & Goals Manipulation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left column (span 2): Items Status Management Table */}
        <div className="lg:col-span-2 space-y-8">
          
          <div className="bg-black border-2 border-white/20 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-mono font-bold text-white uppercase tracking-widest flex items-center">
                <Layers className="w-4 h-4 mr-1.5 text-white/50" />
                物件公開與審核狀態管理
              </h3>
              <span className="text-[10px] bg-[#111111] px-2.5 py-1 font-bold font-mono border border-[#333333]">
                共 {items.length} 件註冊物件
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#333333] text-[10px] font-mono font-bold text-[#cccccc] uppercase tracking-wider bg-[#111111]">
                    <th className="py-2.5 px-3">物件＆原創者</th>
                    <th className="py-2.5 px-3">當前狀態</th>
                    <th className="py-2.5 px-3">金流資訊</th>
                    <th className="py-2.5 px-3 text-right">更改狀態 (模擬審查)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#333333] text-xs font-mono">
                  {items.map((item) => {
                    const isCompleted = item.status === 'completed';
                    const isPending = item.status === 'pending';
                    const isSuspended = item.status === 'suspended';

                    return (
                      <tr key={item.id} className="hover:bg-[#111111] transition-colors">
                        
                        {/* Title/Owner */}
                        <td className="py-3 px-3">
                          <div className="font-bold text-white line-clamp-1">{item.title}</div>
                          <div className="text-[10px] text-[#999999] mt-0.5 flex items-center">
                            <span className="font-semibold text-white/60">{item.ownerName}</span>
                            <span className="mx-1.5">•</span>
                            <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                          </div>
                        </td>

                        {/* Current Status Badge */}
                        <td className="py-3 px-3">
                          {isCompleted && (
                            <span className="bg-[#112211] text-[#22cc22] border border-[#22cc22] px-2 py-0.5 inline-flex items-center gap-1 font-bold text-[10px]">
                              <CheckCircle2 className="w-3 h-3 text-[#22cc22]" /> 圓夢結算
                            </span>
                          )}
                          {isPending && (
                            <span className="bg-[#222211] text-[#cccc22] border border-[#cccc22] px-2 py-0.5 inline-flex items-center gap-1 font-bold text-[10px]">
                              <AlertTriangle className="w-3 h-3 text-[#cccc22]" /> 審核中
                            </span>
                          )}
                          {isSuspended && (
                            <span className="bg-[#221111] text-[#cc2222] border border-[#cc2222] px-2 py-0.5 inline-flex items-center gap-1 font-bold text-[10px]">
                              <BadgeAlert className="w-3 h-3 text-[#cc2222]" /> 已下線
                            </span>
                          )}
                          {item.status === 'active' && (
                            <span className="bg-white text-black px-2 py-0.5 inline-flex items-center gap-1 font-bold text-[10px]">
                              <span className="w-1.5 h-1.5 bg-black rounded-full animate-ping mr-0.5"></span> 轉運公開中
                            </span>
                          )}
                        </td>

                        {/* Money figures */}
                        <td className="py-3 px-3 font-mono">
                          <div className="text-[#999999]">競標: <strong className="font-black">${item.highestBid}</strong></div>
                          <div className="text-white/30 text-[10px]">贊助: <strong className="font-bold">${item.tipsAmount}</strong></div>
                        </td>

                        {/* Action status changes triggers */}
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1 flex-wrap">
                            <button
                              onClick={() => onUpdateItemStatus(item.id, 'active')}
                              disabled={item.status === 'active'}
                              className={`px-2 py-1 rounded text-[10px] font-bold ${
                                item.status === 'active' 
                                  ? 'bg-[#111111] text-[#555555] cursor-not-allowed border border-[#333333]' 
                                  : 'bg-white text-black hover:bg-gray-200 border border-transparent'
                              }`}
                            >
                              上架
                            </button>
                            <button
                              onClick={() => onUpdateItemStatus(item.id, 'completed')}
                              disabled={isCompleted}
                              className={`px-2 py-1 rounded text-[10px] font-bold ${
                                isCompleted 
                                  ? 'bg-[#111111] text-[#555555] cursor-not-allowed border border-[#333333]' 
                                  : 'bg-[#22cc22] text-black hover:bg-[#1faa1f] border border-transparent'
                              }`}
                            >
                              結算
                            </button>
                            <button
                              onClick={() => onUpdateItemStatus(item.id, 'suspended')}
                              disabled={isSuspended}
                              className={`px-2 py-1 rounded text-[10px] font-bold ${
                                isSuspended 
                                  ? 'bg-[#111111] text-[#555555] cursor-not-allowed border border-[#333333]' 
                                  : 'bg-[#cc2222] text-white hover:bg-[#aa1f1f] border border-transparent'
                              }`}
                            >
                              下線
                            </button>
                          </div>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Quick Hard reset of initial states */}
            <div className="mt-6 pt-5 border-t border-white/20 flex flex-col sm:flex-row justify-between items-center gap-3">
              <span className="text-[10px] text-[#999999] font-mono font-bold">
                資料更迭混亂？隨時恢復出廠預設狀態。
              </span>
              <button
                onClick={onResetDatabase}
                className="bg-[#110000] border border-[#cc2222] text-[#cc2222] hover:bg-[#220000] hover:text-white font-mono font-bold text-xs py-2 px-4 flex items-center transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin-hover" />
                重置預設資料與日誌
              </button>
            </div>

          </div>

          {/* Simulate Bidding Form Panel */}
          <div className="bg-[#111111] border-2 border-[#333333] p-6" id="bidding-simulation">
            <h3 className="text-sm font-mono font-bold text-white uppercase tracking-widest flex items-center mb-4 border-b border-[#333333] pb-2">
              <Coins className="w-4 h-4 mr-1.5 text-white/50" />
              模擬外部買家出價 (注入高額競價)
            </h3>
            
            <form onSubmit={handleSimulatedBidSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-[10px] font-mono font-bold text-white/50 mb-1">目標故事物件</label>
                <select
                  value={selectedItemForBid}
                  onChange={(e) => setSelectedItemForBid(e.target.value)}
                  className="w-full bg-black border border-[#333333] p-2 text-xs font-mono font-bold text-white outline-none focus:border-white"
                >
                  {items.filter(i => i.status === 'active').map(i => (
                    <option key={i.id} value={i.id}>{i.title.substring(0, 16)}...</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold text-white/50 mb-1">模擬競買者名稱</label>
                <input 
                  type="text" 
                  value={simulatedBidder}
                  onChange={(e) => setSimulatedBidder(e.target.value)}
                  className="w-full bg-black border border-[#333333] p-2 text-xs font-mono font-bold text-white outline-none focus:border-white"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold text-white/50 mb-1">出價金額 (TWD)</label>
                <input 
                  type="number" 
                  value={simulatedBidAmount}
                  onChange={(e) => setSimulatedBidAmount(Number(e.target.value))}
                  className="w-full bg-black border border-[#333333] p-2 text-xs font-mono font-bold text-white outline-none focus:border-white"
                />
              </div>

              <div className="flex items-end">
                <button 
                  type="submit"
                  className="w-full bg-white hover:bg-gray-200 text-black font-mono font-bold text-xs p-2.5 flex items-center justify-center gap-1.5 transition-transform border border-transparent"
                >
                  <Play className="w-3.5 h-3.5 fill-white text-transparent" />
                  送出模擬出價
                </button>
              </div>
            </form>
          </div>

        </div>

        {/* Right column: Target Goals and Live Terminal system logs */}
        <div className="space-y-8">
          
          {/* Goal simulation multipliers */}
          <div className="bg-black border-2 border-white/20 p-6">
            <h3 className="text-sm font-mono font-bold text-white uppercase tracking-widest flex items-center mb-4 border-b border-[#333333] pb-2">
              <Sparkles className="w-4 h-4 mr-1.5 text-white/60 animate-pulse" />
              主線學費與募資進度微調
            </h3>
            <p className="text-[11px] text-[#999999] font-mono leading-relaxed mb-4 font-medium">
              快速微調不同創作者的主線進度，體驗<strong>達標結算 (Quest Completed)</strong> 的高潮動畫與「寫明信片」功能。
            </p>

            <div className="space-y-3">
              {userGoals.map((g) => {
                const isReached = g.current >= g.target;
                return (
                  <div key={g.id} className="p-3 bg-[#111111] border border-[#333333] flex items-center justify-between">
                    <div>
                      <div className="font-mono font-bold text-xs text-white line-clamp-1">{g.title.split('(')[0]}</div>
                      <div className="text-[9px] text-[#999999] font-mono font-bold mt-1 uppercase flex items-center gap-1.5">
                        <User className="w-3 h-3 text-[#555555]" /> {g.ownerName}
                        <span>•</span>
                        <span className={isReached ? 'text-[#22cc22]' : 'text-[#cccc22]'}>
                          ${g.current.toLocaleString()} / ${g.target.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => onUpdateGoalProgress(g.id, -1000)}
                        className="bg-black hover:bg-[#222222] border border-[#333333] w-6 h-6 text-xs text-white font-mono font-bold flex items-center justify-center"
                      >
                        -
                      </button>
                      <button
                        onClick={() => onUpdateGoalProgress(g.id, 1000)}
                        className="bg-white hover:bg-gray-200 border border-transparent w-6 h-6 text-xs text-black font-mono font-bold flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Monospace terminal logs */}
          <div className="bg-black p-6 border-2 border-[#333333] text-[#cccccc]">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] font-bold tracking-widest text-white/50 uppercase flex items-center font-mono">
                <Terminal className="w-3.5 h-3.5 mr-1 text-white/50 animate-pulse" />
                即時系統狀態日誌 (Logs)
              </span>
              <button 
                onClick={onClearLogs}
                className="text-[10px] text-[#999999] hover:text-white underline font-semibold font-mono"
              >
                清除歷史
              </button>
            </div>

            <div className="bg-[#0a0a0a] p-3 h-64 overflow-y-auto space-y-2.5 font-mono text-[10px] leading-relaxed text-white border-2 border-[#333333]" id="terminal-screen-logs">
              {systemLogs.map((log) => (
                <div key={log.id} className="border-b border-[#222222] pb-1.5">
                  <div className="flex justify-between text-[9px] text-white/30">
                    <span>[{log.type.toUpperCase()}]</span>
                    <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <p className="mt-0.5 text-white/70">{log.message}</p>
                </div>
              ))}
              {systemLogs.length === 0 && (
                <p className="text-[#999999] font-mono text-center py-20 italic">靜待您的贊助或審查操作，新日誌將會即時產生於此處...</p>
              )}
            </div>
            
            <div className="text-[9px] font-mono text-[#555555] mt-3 text-center">
              * 只要進行打賞、競價、撰寫明信片或狀態更換，此終端都會即時計入紀錄。
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Sparkles, CheckCircle2, Radio, Edit3, Target, Mail, Send, X, 
  Map, ArrowUpRight, Gift, Coins, Flame, Lightbulb, Users
} from 'lucide-react';
import { UserGoal, Item, UserProfile } from '../types';

interface DashboardViewProps {
  currentUser: UserProfile;
  userGoal: UserGoal;
  linkedItems: Item[];
  onSendPostcard: (message: string) => void;
  onAdjustGoal: (target: number) => void;
}

export default function DashboardView({
  currentUser,
  userGoal,
  linkedItems,
  onSendPostcard,
  onAdjustGoal
}: DashboardViewProps) {
  const [showPostcardForm, setShowPostcardForm] = useState(false);
  const [postcardMessage, setPostcardMessage] = useState('');
  const [showGoalTune, setShowGoalTune] = useState(false);
  const [newTarget, setNewTarget] = useState(userGoal.target);

  const percent = Math.min(100, Math.round((userGoal.current / userGoal.target) * 100));
  const isReached = percent >= 100;

  const handlePostcardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postcardMessage.trim()) return;
    onSendPostcard(postcardMessage);
    setShowPostcardForm(false);
    setPostcardMessage('');
  };

  const handleGoalAdjustSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdjustGoal(newTarget);
    setShowGoalTune(false);
  };

  // Sum contributions
  const calculatedTotalFuel = linkedItems.reduce(
    (acc, curr) => acc + curr.tipsAmount + curr.highestBid, 
    0
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans text-white" id="dashboard-root-view">
      
      {/* Title block */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 border-b-2 border-white/20 pb-6 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white mb-2 uppercase tracking-tighter">
            個人主線進度條
          </h1>
          <p className="text-[#cccccc] font-mono font-medium text-xs md:text-sm">
            您的斷捨離舊物，在此自動蓄力為點燃夢想的實體燃料。
          </p>
        </div>
        
        {/* Quick adjustments in view */}
        <div className="flex gap-2">
          <button 
            onClick={() => setShowGoalTune(!showGoalTune)}
            className="text-xs font-mono font-bold text-black bg-white hover:bg-gray-200 border-2 border-transparent px-4 py-2 transition-all flex items-center shadow-sm"
          >
            <Edit3 className="w-3.5 h-3.5 mr-1.5" />
            調整夢想目標
          </button>
        </div>
      </div>

      {/* Adjust Goal Modal Form (Inline) */}
      {showGoalTune && (
        <form onSubmit={handleGoalAdjustSubmit} className="bg-[#111111] border-2 border-[#333333] p-5 mb-6 space-y-4 shadow-inner">
          <h4 className="text-xs font-mono font-bold text-white uppercase tracking-widest flex items-center border-b border-[#333333] pb-2">
            <Target className="w-4 h-4 mr-2 text-white/50" />
            修改當前夢想與預算額度 (模擬自定)
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-mono font-bold text-white/50 mb-1">目標所需資金 (TWD)</label>
              <input 
                type="number" 
                value={newTarget} 
                onChange={(e) => setNewTarget(Number(e.target.value))}
                className="w-full bg-black border border-[#333333] p-2 text-xs font-mono font-bold text-white focus:outline-none focus:border-white focus:bg-[#111111]"
                min={100}
              />
            </div>
            <div className="flex items-end">
              <button type="submit" className="bg-white text-black text-xs font-mono font-bold px-4 py-2 hover:bg-gray-200 transition-colors">
                確認調整
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Main progress milestone container */}
      <div className={`p-6 md:p-10 border-2 mb-10 relative overflow-hidden transition-all duration-700 ${
        isReached 
          ? 'bg-[#112211] border-[#22cc22]' 
          : 'bg-black border-white/20'
      }`}>
        
        {isReached && (
          <div className="absolute top-0 left-0 w-full bg-[#111111] border-b border-[#22cc22] text-[#22cc22] text-center py-2 text-[10px] font-mono font-bold tracking-widest uppercase animate-pulse shadow-sm flex items-center justify-center gap-1.5">
             <Sparkles className="w-3 h-3 text-yellow-300 animate-spin" /> 🎉 QUEST COMPLETED! 我的夢想宣告達標 🎉 <Sparkles className="w-3 h-3 text-yellow-300 animate-spin" />
          </div>
        )}
        
        <div className={`max-w-2xl mx-auto relative z-10 ${isReached ? 'mt-4' : ''}`}>
          
          <div className="text-center mb-8">
            <span className={`inline-flex items-center px-4 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider mb-4 border ${
              isReached ? 'bg-[#112211] border-[#22cc22] text-[#22cc22]' : 'bg-black border-white/50 text-white'
            }`}>
              {isReached ? <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-[#22cc22]"/> : <Radio className="w-3.5 h-3.5 mr-1.5 animate-pulse text-white/50"/>}
              {isReached ? '已達標結算' : '當前夢想進行中'}
            </span>
            
            <h2 className="text-xl sm:text-3xl font-black text-white leading-tight uppercase tracking-tighter">
              {userGoal.title}
            </h2>
            <p className="text-[11px] text-[#999999] mt-2 font-bold font-mono">
              夢想信託行囊負責人：{currentUser.name} 
            </p>
          </div>

          {/* Premium Progress Bar section */}
          <div className="bg-black border-2 border-white/20 p-5 sm:p-6 mb-6">
            <div className="flex justify-between items-end mb-3">
              <span className={`text-3xl sm:text-4xl font-mono font-bold tracking-tighter flex items-center ${
                isReached ? 'text-[#22cc22]' : 'text-white'
              }`}>
                {percent}%
              </span>
              <span className="text-xs text-[#999999]">
                已募得 <span className="font-mono text-white font-bold text-sm">${userGoal.current.toLocaleString()}</span> / 目標 <span className="font-mono text-[#999999]">${userGoal.target.toLocaleString()}</span>
              </span>
            </div>

            {/* Simulated bar */}
            <div className="w-full bg-black h-4 overflow-hidden relative border border-[#333333]">
              <div 
                className={`h-full transition-all duration-1000 ease-out ${
                  isReached 
                    ? 'bg-[#22cc22]' 
                    : 'bg-white'
                }`}
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>

          {/* If reached, display dedicated custom gratitude post formulation */}
          {isReached && !showPostcardForm && (
            <div className="mt-8 bg-black border border-[#22cc22] p-6 text-center animate-fade-in">
              <div className="w-12 h-12 border border-[#22cc22] rounded-full flex items-center justify-center mx-auto mb-4 bg-black">
                <Mail className="w-6 h-6 text-[#22cc22] animate-pulse" />
              </div>
              <h3 className="text-base font-mono font-bold text-[#22cc22] mb-2">準備好向大家報喜了嗎？</h3>
              <p className="text-xs text-[#999999] font-mono max-w-md mx-auto mb-5 leading-relaxed">
                您的舊回憶們，成功燃燒並轉化為了這筆新里程的學費/旅費！
                現在您可以撰寫並寄送<strong>「電子圓夢明信片」</strong>通知所有參與投資、競標您的贊助者，分享這份達標的熱度！
              </p>
              <button 
                onClick={() => {
                  setShowPostcardForm(true);
                  setPostcardMessage(`謝謝大家的溫暖支持！在你們的打賞及物件競標支持下，我終於湊齊了 $${userGoal.target.toLocaleString()}，完成了這項計畫！在前往實踐計畫的路上，我也會懷揣著屬於大家物品回憶的期待，謝謝回憶轉運站！`);
                }}
                className="bg-[#22cc22] hover:bg-[#1faa1f] text-black px-6 py-2.5 font-mono font-bold text-xs transition-all flex items-center mx-auto border border-transparent"
              >
                製作圓夢感謝明信片 <ArrowUpRight className="w-4 h-4 ml-1.5" />
              </button>
            </div>
          )}

        </div>

      </div>

      {/* Detailed Postcard Editor formulation */}
      {showPostcardForm && (
        <div className="bg-[#111111] p-6 md:p-8 border-2 border-white mb-10">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-mono font-bold text-white flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-white/60 animate-spin" />
              寄送圓夢感謝信明信片
            </h3>
            <button 
              onClick={() => setShowPostcardForm(false)}
              className="text-[#999999] hover:text-white bg-black border border-white/20 p-1.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <form onSubmit={handlePostcardSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Visual preview slot */}
            <div className="bg-black p-5 border border-white/30 flex flex-col items-center justify-center text-center space-y-3 min-h-[220px]">
              <div className="border-2 border-dashed border-[#555555] w-full h-full flex flex-col justify-center items-center py-8 px-4 bg-black">
                <Map className="w-10 h-10 text-white/50 mb-2" />
                <span className="text-xs font-mono font-bold text-[#cccccc]">實踐夢想的照片預置</span>
                <span className="text-[10px] text-[#999999] mt-1.5 leading-relaxed">
                  可上傳您坐在家教課上課的自拍照片，或是沖繩櫻花郵輪行程的電子票證存根，感謝大家的心碎與祝福。
                </span>
                <span className="bg-[#222222] text-[#cccccc] border border-[#555555] text-[9px] font-mono font-bold mt-3 px-2 py-0.5">
                  預設已自動上傳
                </span>
              </div>
            </div>

            {/* Input message slot */}
            <div className="flex flex-col justify-between">
              <div>
                <label className="block text-xs font-mono font-bold text-[#cccccc] mb-2">
                  寫一段真心感謝的話給贊助者：
                </label>
                <textarea 
                  rows={5}
                  value={postcardMessage}
                  onChange={(e) => setPostcardMessage(e.target.value)}
                  className="w-full bg-black border border-[#333333] p-3 text-xs text-white font-mono leading-relaxed outline-none focus:border-white focus:bg-[#111111]"
                  placeholder="寫給心照不宣的世界各個角落夥伴..."
                  required
                />
              </div>

              <button 
                type="submit"
                className="bg-white hover:bg-gray-200 text-black w-full py-3 text-xs font-mono font-bold border border-transparent shadow-md flex items-center justify-center gap-1.5 mt-4 transition-all"
              >
                <Send className="w-4 h-4" /> 寄出電子明信片 (感謝廣播已同步成立)
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Linked Assets detail table */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xs font-mono font-bold text-white uppercase tracking-widest flex items-center">
            <Gift className="w-4 h-4 mr-1.5 text-white/60" /> 
            與此計畫綁定的回憶物品 ({linkedItems.length})
          </h3>
          <span className="text-[11px] font-mono font-bold text-[#cccccc] bg-[#111111] border border-[#333333] px-2.5 py-1">
            合計轉運燃料貢獻值：${calculatedTotalFuel.toLocaleString()}
          </span>
        </div>

        <div className="bg-black border border-white/20 divide-y divide-white/20 overflow-hidden">
          {linkedItems.map((item) => (
            <div key={item.id} className="p-4 flex items-center justify-between hover:bg-[#111111] transition-colors">
              <div className="flex items-center space-x-3.5">
                <img 
                  src={item.photos[0]} 
                  alt={item.title} 
                  className="w-12 h-12 object-cover shrink-0 border border-white" 
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="font-mono font-bold text-white text-xs line-clamp-1">{item.title}</h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-[10px] text-[#999999] font-mono">目前競標最高：${item.highestBid}</span>
                    <span className="text-white/30 text-[9px]">•</span>
                    <span className="text-[10px] text-[#999999] font-mono">累計打賞贊助：${item.tipsAmount}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className="inline-block bg-black text-white border border-[#333333] font-mono text-[10px] font-bold px-2 py-1">
                  貢獻值：${(item.highestBid + item.tipsAmount).toLocaleString()}
                </span>
              </div>
            </div>
          ))}

          {linkedItems.length === 0 && (
            <div className="py-12 text-center p-6 text-[#999999] font-mono text-xs">
              目前尚未與任何物件綁定。您可以在「上架故事」後強迫綁定當前主線目標！
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

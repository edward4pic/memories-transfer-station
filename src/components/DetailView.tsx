/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ChevronLeft, Clock, TrendingUp, Target, HeartHandshake, 
  Inbox, Shield, DollarSign, Calendar, MessageSquare, History, Tag, Sparkles
} from 'lucide-react';
import { Item } from '../types';

interface DetailViewProps {
  item: Item;
  onBack: () => void;
  onFund: (itemId: string, type: 'tip' | 'bid', amount: number, backerName: string, message?: string) => void;
}

export default function DetailView({ item, onBack, onFund }: DetailViewProps) {
  const [tipAmount, setTipAmount] = useState<number>(300);
  const [tipMessage, setTipMessage] = useState<string>('');
  const [bidAmount, setBidAmount] = useState<number>(item.highestBid + 100);
  const [backerName, setBackerName] = useState<string>('路過的小文');

  const [activeTab, setActiveTab] = useState<'fund' | 'history'>('fund');

  const handleTipSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tipAmount <= 0) return;
    onFund(item.id, 'tip', tipAmount, backerName, tipMessage || '對故事有共鳴，打賞支持你的下一站旅程！');
    setTipMessage('');
  };

  const handleBidSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (bidAmount <= item.highestBid) {
      alert(`出價必須高於目前最高出價 $${item.highestBid}`);
      return;
    }
    onFund(item.id, 'bid', bidAmount, backerName);
  };

  const isCompleted = item.status === 'completed';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans text-white">
      
      {/* Back feed anchor */}
      <button 
        onClick={onBack} 
        id="btn-back-to-explore"
        className="text-white/60 mb-6 flex items-center hover:text-white transition-colors font-mono font-bold text-xs border border-white/20 hover:border-white px-4 py-2 w-fit"
      >
        <ChevronLeft className="w-4 h-4 mr-1" /> 
        <span>返回公共許願池</span>
      </button>

      <div className="bg-black border-2 border-white overflow-hidden flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-white/20">
        
        {/* Left Side: Images, narrative stories */}
        <div className="lg:w-3/5 flex flex-col bg-[#0a0a0a]">
          
          <div className="relative h-72 sm:h-96 lg:h-[480px]">
            <img 
              src={item.photos[0]} 
              alt={item.title} 
              className="w-full h-full object-cover" 
              referrerPolicy="no-referrer"
            />
            {/* Owner Header Info card */}
            <div className="absolute top-4 left-4 bg-black/90 px-4 py-2 border-2 border-white flex items-center shadow-lg">
              <img 
                src={item.ownerAvatar} 
                alt={item.ownerName} 
                className="w-7 h-7 rounded-full mr-2 object-cover border border-white" 
                referrerPolicy="no-referrer"
              />
              <div>
                <span className="text-[10px] uppercase font-mono font-bold text-white/50 block tracking-tight">故事原主人</span>
                <span className="text-xs font-black text-white block">{item.ownerName}</span>
              </div>
            </div>

            {/* Float badge if completed */}
            {isCompleted && (
              <div className="absolute top-4 right-4 bg-black text-white border-2 border-white px-4 py-2 flex items-center font-mono font-bold text-sm shadow-md animate-bounce">
                <Sparkles className="w-4 h-4 mr-1" /> 圓夢成就達成！
              </div>
            )}
          </div>
          
          {/* Narrative contents */}
          <div className="p-6 sm:p-8 lg:p-10 space-y-8">
            <div>
              <div className="flex flex-wrap gap-2 mb-4">
                {item.tags.map(t => (
                  <span key={t} className="bg-white/10 text-white px-3 py-1 border border-white/20 text-xs font-mono font-bold tracking-wide flex items-center">
                    <Tag className="w-3 h-3 mr-1 text-white/50" /> {t}
                  </span>
                ))}
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white mb-2 leading-tight uppercase tracking-tighter">
                {item.title}
              </h1>
              <div className="flex items-center text-xs text-white/60 font-mono font-bold space-x-4">
                <span className="flex items-center"><Calendar className="w-3.5 h-3.5 mr-1 text-white/60" /> 收購年份: {item.yearAcquired}</span>
                <span>•</span>
                <span>上架時間: {new Date(item.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="space-y-6">
              {/* Story */}
              <div>
                <h3 className="text-xs font-mono font-bold text-white/50 uppercase tracking-widest mb-2.5 flex items-center border-b border-white/10 pb-2">
                  <Clock className="w-4 h-4 mr-2 text-white/50" /> 由來與記憶回顧
                </h3>
                <p className="text-[#cccccc] leading-relaxed text-sm md:text-base font-semibold bg-[#0a0a0a] p-5 border border-white/20 whitespace-pre-line">
                  {item.story}
                </p>
              </div>

              {/* Transition Reason */}
              <div>
                <h3 className="text-xs font-mono font-bold text-white/50 uppercase tracking-widest mb-2.5 flex items-center border-b border-white/10 pb-2">
                  <TrendingUp className="w-4 h-4 mr-2 text-white/50" /> 轉運釋出原因 (斷捨離)
                </h3>
                <div className="p-5 border-2 border-dashed border-white/20 bg-black">
                  <p className="text-[#999999] leading-relaxed text-xs md:text-sm font-mono">
                    {item.reason}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Right Side: Interaction options, tipping, bid logs */}
        <div className="lg:w-2/5 p-6 sm:p-8 lg:p-10 bg-black flex flex-col justify-between" id="detail-action-panel">
          
          <div>
            {/* Head Linked Goal panel */}
            <div className="bg-[#111111] border-2 border-[#333333] p-5 md:p-6 text-white mb-6">
               <div className="text-white/60 text-[10px] font-mono font-bold uppercase tracking-widest mb-1.5 flex items-center border-b border-[#333333] pb-2">
                 <Target className="w-3.5 h-3.5 mr-1.5 text-white/60 animate-pulse" /> 夢想資金目的地 (此物主人目標)
               </div>
               <h2 className="text-sm md:text-base font-bold leading-snug text-white mb-3 mt-3">
                 {item.goalLinked}
               </h2>
               <p className="text-[11px] text-[#999999] font-mono leading-relaxed bg-[#222222] p-2.5 border border-[#333333]">
                 此物件所累積的所有贊助及搶標金，將 100% 助瀾原主人推進他的個人新任務。
               </p>
            </div>

            {/* Mode SwitcherTabs */}
            <div className="flex border-b-2 border-white/20 mb-6">
              <button 
                onClick={() => setActiveTab('fund')}
                className={`py-3 px-4 font-mono font-bold text-xs md:text-sm flex-1 text-center transition-all ${activeTab === 'fund' ? 'border-b-4 border-white text-white' : 'text-white/50 hover:text-white'}`}
              >
                打賞與出價
              </button>
              <button 
                onClick={() => setActiveTab('history')}
                className={`py-3 px-4 font-mono font-bold text-xs md:text-sm flex-1 text-center transition-all flex items-center justify-center gap-1.5 ${activeTab === 'history' ? 'border-b-4 border-white text-white' : 'text-white/50 hover:text-white'}`}
              >
                <History className="w-3.5 h-3.5" />
                交易紀錄 ({item.bidHistory.length + item.tipHistory.length})
              </button>
            </div>

            {/* Tab 1: Funding Inputs */}
            {activeTab === 'fund' && (
              <div className="space-y-5">
                
                {/* Simulated Identity configuration for interactive testing */}
                <div className="bg-[#0a0a0a] border border-white/20 p-3 mb-4">
                  <label className="block text-[10px] font-mono font-bold text-white/50 uppercase tracking-widest mb-1.5">
                    請輸入您模擬的贊助者名字：
                  </label>
                  <input
                    type="text"
                    value={backerName}
                    onChange={(e) => setBackerName(e.target.value)}
                    placeholder="例如：路過的小文、愛書人、愛心咖啡控"
                    className="w-full bg-black border border-white/30 p-2 text-xs font-mono font-bold text-white outline-none focus:border-white focus:bg-[#111111]"
                    required
                  />
                </div>

                {isCompleted ? (
                  <div className="bg-black border border-white/20 p-5 text-center">
                    <p className="text-white font-bold text-sm mb-1.5 font-mono">🎉 此舊物故事已完成轉運圓夢！</p>
                    <p className="text-white/60 text-xs font-mono">最高出價者已被原主人接受並開始面交。敬請瀏覽公共許願池的其他故事物件！</p>
                  </div>
                ) : (
                  <>
                    {/* Support with Tipping */}
                    <div className="bg-black border-2 border-[#333333] p-4 hover:border-white transition-all">
                       <div className="flex justify-between items-start mb-1">
                         <h3 className="text-xs font-mono font-bold text-white flex items-center">
                           <HeartHandshake className="w-4 h-4 mr-1.5 text-white/60" />
                           隨喜贊助 (不拿實體)
                         </h3>
                         <span className="bg-[#222222] text-[#cccccc] border border-[#555555] text-[9px] font-mono font-bold px-1.5 py-0.5 uppercase tracking-wider">純打賞</span>
                       </div>
                       <p className="text-[#999999] text-[11px] font-mono mb-3 leading-relaxed">
                         深受故事打動，純粹提供打賞幫助物主圓夢，由原主人妥善保留物件。
                       </p>
                       <form onSubmit={handleTipSubmit} className="space-y-2">
                         <div className="flex gap-2">
                           <div className="relative flex-1">
                             <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-white/50 font-mono">$</span>
                             <input 
                               type="number" 
                               value={tipAmount}
                               onChange={(e) => setTipAmount(Number(e.target.value))}
                               className="w-full bg-black border border-[#333333] py-2 pl-6 pr-2 text-xs font-bold font-mono text-white focus:outline-none focus:border-white"
                               min={50}
                               step={50}
                             />
                           </div>
                           <button type="submit" className="bg-white hover:bg-gray-200 text-black px-4 py-2 text-xs font-bold font-mono transition-transform border border-transparent">
                             確定隨喜打賞
                           </button>
                         </div>
                         <input
                           type="text"
                           placeholder="留下一句鼓勵的話吧..."
                           value={tipMessage}
                           onChange={(e) => setTipMessage(e.target.value)}
                           className="w-full bg-black border border-[#333333] p-2 text-xs font-mono text-white focus:outline-none focus:border-white"
                         />
                       </form>
                    </div>

                    {/* Support with Bidding */}
                    <div className="bg-black border-2 border-[#333333] p-4 hover:border-white transition-all mt-4" id="bidding-panel">
                       <div className="flex justify-between items-start mb-1">
                         <h3 className="text-xs font-mono font-bold text-white flex items-center">
                           <Inbox className="w-4 h-4 mr-1.5 text-white/60" />
                           搶標實體物 (競標)
                         </h3>
                         <span className="bg-[#222222] text-[#cccccc] border border-[#555555] text-[9px] font-mono font-bold px-1.5 py-0.5 uppercase tracking-wider">實物面交</span>
                       </div>
                       <p className="text-[#999999] text-[11px] font-mono mb-3 leading-relaxed">
                         我想擁有這件故事紀念品，同時為物主的新里程加油。物主同意後即可約定面交。
                       </p>
                       
                       <div className="bg-[#111111] border border-[#333333] p-2.5 flex items-center justify-between mb-3 font-mono">
                         <span className="text-[10px] uppercase font-bold text-white/50">當前最高出價</span>
                         <span className="text-sm font-black text-white">${item.highestBid.toLocaleString()} {item.highestBidder ? `(${item.highestBidder})` : ''}</span>
                       </div>

                       <form onSubmit={handleBidSubmit} className="flex gap-2">
                         <div className="relative flex-1">
                           <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-white/50 font-mono">$</span>
                           <input 
                             type="number" 
                             value={bidAmount}
                             onChange={(e) => setBidAmount(Number(e.target.value))}
                             className="w-full bg-black border border-[#333333] py-2 pl-6 pr-2 text-xs font-bold font-mono text-white focus:outline-none focus:border-white"
                             min={item.highestBid + 10}
                           />
                         </div>
                         <button type="submit" className="bg-white hover:bg-gray-200 text-black px-4 py-2 text-xs font-bold font-mono transition-transform">
                           出價加碼搶標
                         </button>
                       </form>
                    </div>
                  </>
                )}

              </div>
            )}

            {/* Tab 2: Logs showing transaction records */}
            {activeTab === 'history' && (
              <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                <span className="text-[10px] font-mono font-bold text-white/50 uppercase tracking-widest block mb-1">對話與出價序列</span>
                
                {/* Bidding logs */}
                {item.bidHistory.map((b) => (
                  <div key={b.id} className="border-l-[3px] border-white pl-3 py-1.5 bg-[#111111] mb-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-mono font-bold text-white flex items-center">
                        <Inbox className="w-3 h-3 mr-1 text-white/60" />
                        {b.bidderName} <span className="text-[10px] text-[#999] ml-1.5 font-normal">加碼出價</span>
                      </span>
                      <span className="font-mono font-bold text-white">${b.amount}</span>
                    </div>
                    <div className="text-[9px] font-mono text-[#999999] mt-1 flex justify-between">
                      <span>狀態：{b.status === 'pending' ? '🔥 領先中' : '已退款/被超越'}</span>
                      <span>{new Date(b.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </div>
                ))}

                {/* Tipping logs */}
                {item.tipHistory.map((t) => (
                  <div key={t.id} className="border-l-[3px] border-[#666666] pl-3 py-1.5 bg-[#111111] mb-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-mono font-bold text-white flex items-center">
                        <HeartHandshake className="w-3 h-3 mr-1 text-white/60" />
                        {t.backerName} <span className="text-[10px] text-[#999] ml-1.5 font-normal">隨喜打賞</span>
                      </span>
                      <span className="font-mono font-bold text-white">${t.amount}</span>
                    </div>
                    {t.message && (
                      <p className="text-[11px] text-[#cccccc] font-mono bg-[#222222] p-2 mt-1 border border-[#333333] italic">
                        &ldquo;{t.message}&rdquo;
                      </p>
                    )}
                    <div className="text-[9px] text-[#999999] mt-1.5 text-right font-mono">
                      {new Date(t.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                ))}

                {item.bidHistory.length === 0 && item.tipHistory.length === 0 && (
                  <p className="text-center py-10 text-xs text-[#999999] font-mono">目前尚無打賞或出價記錄，趕緊成為第一個支持的人！</p>
                )}
              </div>
            )}

          </div>

          <div className="mt-6 border-t font-mono border-white/20 pt-4 flex items-center text-[10px] text-[#999999] justify-center gap-1.5 bg-black">
            <Shield className="w-3.5 h-3.5 text-white/50" />
            <span>第三方信託安全保障：達標交收後方撥款，買賣安心</span>
          </div>

        </div>

      </div>
    </div>
  );
}

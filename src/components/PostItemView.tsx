/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Target, X, Sparkles, BookOpen, ImageIcon, PenTool, CheckCircle, Tag } from 'lucide-react';
import { UserGoal, UserProfile } from '../types';

interface PostItemViewProps {
  currentUser: UserProfile;
  currentGoal: UserGoal;
  onSubmit: (data: {
    title: string;
    yearAcquired: string;
    story: string;
    reason: string;
    tags: string[];
    photos: string[];
  }) => void;
  onCancel: () => void;
}

const STOCK_PHOTOS = [
  'https://images.unsplash.com/photo-1512446813927-4a7b7b4e9404?auto=format&fit=crop&q=80&w=600', // retro camera
  'https://images.unsplash.com/photo-1495707902641-75cac588d2e9?auto=format&fit=crop&q=80&w=600', // typewriter
  'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=600', // vintage books
  'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&q=80&w=600', // vinyl player
  'https://images.unsplash.com/photo-1528740564265-5304af132fce?auto=format&fit=crop&q=80&w=600', // tea pot set
];

export default function PostItemView({
  currentUser,
  currentGoal,
  onSubmit,
  onCancel,
}: PostItemViewProps) {
  const [title, setTitle] = useState('');
  const [yearAcquired, setYearAcquired] = useState('2516');
  const [story, setStory] = useState('');
  const [reason, setReason] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState(STOCK_PHOTOS[0]);

  const yearOptions = Array.from(
    { length: 47 }, 
    (_, i) => (2026 - i).toString()
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !story.trim() || !reason.trim()) {
      alert('請填寫所有欄位以保障受教者或購買者的故事體驗！');
      return;
    }

    // Split tags
    const processedTags = tagsInput
      .split(/[,，\s]+/)
      .map(t => t.trim())
      .filter(t => t.length > 0)
      .map(t => t.startsWith('#') ? t : `#${t}`);

    onSubmit({
      title,
      yearAcquired,
      story,
      reason,
      tags: processedTags.length > 0 ? processedTags : ['#轉運回憶', '#斷捨離'],
      photos: [selectedPhoto]
    });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 font-sans text-white" id="post-item-view-root">
      
      {/* Header card info */}
      <div className="mb-8 border-b-2 border-white/20 pb-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white mb-2 uppercase tracking-tighter">
            上架故事與信物
          </h1>
          <p className="text-[#cccccc] font-mono font-medium text-xs md:text-sm">
            為您的舊物撰寫一段真實而溫暖的故事，引領更多靈魂資助您的下一站目標。
          </p>
        </div>
        <button 
          onClick={onCancel}
          className="border border-white/20 hover:border-white p-2.5 text-white/50 hover:text-white transition-colors bg-black"
        >
          <X className="w-5 h-5"/>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Active Goal linking notice */}
        <div className="bg-[#111111] border-2 border-[#333333] p-5 md:p-6 flex items-start flex-col sm:flex-row shadow-sm">
          <div className="border-2 border-[#333333] p-3 mb-3 sm:mb-0 sm:mr-4 shrink-0 self-start text-[#cccccc] bg-black">
            <Target className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h4 className="font-mono font-bold text-white text-sm mb-1">
              自動綁定您的當前主線目標：
            </h4>
            <p className="text-[#999999] font-mono text-xs mb-3">
              這件物品未來所獲得的「所有打賞贊助」與「競標出價金」，將直接挹注為以下任務進度：
            </p>
            <div className="bg-black text-white px-3.5 py-1.5 inline-block font-mono font-bold text-xs border border-white">
              {currentGoal.title}
            </div>
          </div>
        </div>

        {/* Input Details */}
        <div className="bg-black p-6 md:p-8 border-2 border-white/20 space-y-5">
          
          {/* Title */}
          <div>
            <label className="block text-xs font-mono font-bold text-white/50 mb-1.5 uppercase tracking-wide">
              一、物品名稱與感性標題
            </label>
            <input 
              type="text"
              required 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#111111] border border-[#333333] p-3 text-xs md:text-sm font-mono text-white outline-none focus:border-white"
              placeholder="例如：高中放學常常一邊偷聽一邊寫算式的二手 Sony 隨身聽"
            />
          </div>

          {/* Acquisition Year */}
          <div>
            <label className="block text-xs font-mono font-bold text-white/50 mb-1.5 uppercase tracking-wide">
              二、這件物品大約是哪一年來到你身邊的？
            </label>
            <select
              value={yearAcquired}
              onChange={(e) => setYearAcquired(e.target.value)}
              className="w-full bg-[#111111] border border-[#333333] p-3 text-xs md:text-sm font-mono text-white outline-none focus:border-white"
            >
              {yearOptions.map(y => (
                <option key={y} value={y}>{y} 年</option>
              ))}
            </select>
          </div>

          {/* Photo library select */}
          <div>
            <label className="block text-xs font-mono font-bold text-white/50 mb-2 uppercase tracking-wide">
              三、選擇適合的物件照片意境 (多圖庫模擬)
            </label>
            <div className="grid grid-cols-5 gap-3">
              {STOCK_PHOTOS.map((src, idx) => (
                <div 
                  key={idx}
                  onClick={() => setSelectedPhoto(src)}
                  className={`aspect-square overflow-hidden cursor-pointer border-2 transition-all relative ${
                    selectedPhoto === src ? 'border-white scale-95 opacity-100' : 'border-transparent opacity-50 hover:opacity-100'
                  }`}
                >
                  <img src={src} className="w-full h-full object-cover" alt="stock" referrerPolicy="no-referrer" />
                  {selectedPhoto === src && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center border-4 border-white">
                      <CheckCircle className="w-6 h-6 text-black bg-white rounded-full" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Story telling segment */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-mono font-bold text-white/50 uppercase tracking-wide">
                四、由來與記憶 (The Memory's Origin Story)
              </label>
              <span className="text-[10px] text-white/30 font-mono font-bold flex items-center"><BookOpen className="w-3 h-3 mr-1" /> 建議 100 字以上</span>
            </div>
            <textarea 
              rows={4}
              required 
              value={story}
              onChange={(e) => setStory(e.target.value)}
              className="w-full bg-[#111111] border border-[#333333] p-3 text-xs md:text-sm font-mono text-white leading-relaxed outline-none focus:border-white"
              placeholder="當初是誰買給你的？還是你在哪個跳蚤市場淘來的？那時的心情如何？希望買家體會這件物品的哪個呼吸面..."
            />
          </div>

          {/* Letting Go Reason */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-mono font-bold text-white/50 uppercase tracking-wide">
                五、釋出轉運原因 (當前的斷捨離理由與決心)
              </label>
              <span className="text-[10px] text-white/30 font-mono font-bold flex items-center"><PenTool className="w-3 h-3 mr-1" /> 為何決定放手？</span>
            </div>
            <textarea 
              rows={3}
              required 
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-[#111111] border border-[#333333] p-3 text-xs md:text-sm font-mono text-white leading-relaxed outline-none focus:border-white"
              placeholder="例如：屋內空間整理、或覺得它跟不上現在的步調、但我願意用它微薄的殘值滋助我的新家教課程..."
            />
          </div>

          {/* Tags inputs */}
          <div>
            <label className="block text-xs font-mono font-bold text-white/50 mb-1 uppercase tracking-wide">
              六、搜尋關鍵字標籤
            </label>
            <p className="text-[10px] text-[#999999] font-mono mb-2 font-medium">使用逗號或空白隔開，系統會自動在最前置上 hashtag</p>
            <input 
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full bg-[#111111] border border-[#333333] p-3 text-xs md:text-sm font-mono text-white outline-none focus:border-white"
              placeholder="例如: 青春, Sony離愁, 自戀, 考卷"
            />
          </div>

        </div>

        {/* Submit */}
        <div className="flex justify-end pt-4" id="post-submit-container">
          <button 
            type="submit"
            className="bg-white hover:bg-gray-200 text-black w-full sm:w-auto px-10 py-3.5 text-xs font-mono font-bold shadow-lg transition-transform flex items-center justify-center border border-transparent"
          >
            發布至許願池 <Sparkles className="w-4 h-4 ml-1.5 text-yellow-300 animate-pulse" />
          </button>
        </div>

      </form>
    </div>
  );
}

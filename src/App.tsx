/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ExploreView from './components/ExploreView';
import DetailView from './components/DetailView';
import DashboardView from './components/DashboardView';
import PostItemView from './components/PostItemView';
import AdminPanel from './components/AdminPanel';
import { MOCK_USERS, INITIAL_GOALS, INITIAL_ITEMS } from './data';
import { Item, UserGoal, UserProfile, SystemLog, BidRecord, TipRecord } from './types';

export default function App() {
  // 1. Core State Hooks
  const [currentUser, setCurrentUser] = useState<UserProfile>(MOCK_USERS[0]);
  const [items, setItems] = useState<Item[]>([]);
  const [userGoals, setUserGoals] = useState<UserGoal[]>([]);
  const [systemLogs, setSystemLogs] = useState<SystemLog[]>([]);
  
  const [currentView, setCurrentView] = useState<string>('explore');
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [toastMessage, setToastMessage] = useState<string>('');

  // 2. Local Storage Hydration on startup
  useEffect(() => {
    try {
      const storedItems = localStorage.getItem('memory_hub_items_v2');
      const storedGoals = localStorage.getItem('memory_hub_goals_v2');
      const storedLogs = localStorage.getItem('memory_hub_logs_v2');

      if (storedItems) {
        setItems(JSON.parse(storedItems));
      } else {
        setItems(INITIAL_ITEMS);
        localStorage.setItem('memory_hub_items_v2', JSON.stringify(INITIAL_ITEMS));
      }

      if (storedGoals) {
        setUserGoals(JSON.parse(storedGoals));
      } else {
        setUserGoals(INITIAL_GOALS);
        localStorage.setItem('memory_hub_goals_v2', JSON.stringify(INITIAL_GOALS));
      }

      if (storedLogs) {
        setSystemLogs(JSON.parse(storedLogs));
      } else {
        const initialLog: SystemLog = {
          id: 'log_init',
          type: 'status_change',
          message: '🌌 回憶轉運站系統安全啟動。加載預置的 4 位創作者、4 項主線任務與 4 本二手心碎故事簿。',
          timestamp: new Date().toISOString()
        };
        setSystemLogs([initialLog]);
        localStorage.setItem('memory_hub_logs_v2', JSON.stringify([initialLog]));
      }
    } catch (e) {
      console.error('Failed to parse local storage, loading fallback presets', e);
      setItems(INITIAL_ITEMS);
      setUserGoals(INITIAL_GOALS);
    }
  }, []);

  // Sync back to local storage whenever states alter
  const saveToStorage = (updatedItems: Item[], updatedGoals: UserGoal[], updatedLogs: SystemLog[]) => {
    localStorage.setItem('memory_hub_items_v2', JSON.stringify(updatedItems));
    localStorage.setItem('memory_hub_goals_v2', JSON.stringify(updatedGoals));
    localStorage.setItem('memory_hub_logs_v2', JSON.stringify(updatedLogs));
  };

  // Toast notifier
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 4500);
  };

  const addSystemLog = (
    type: 'bid' | 'tip' | 'status_change' | 'postcard' | 'item_create' | 'goal_update',
    message: string,
    details?: any
  ): SystemLog => {
    const newLog: SystemLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      type,
      message,
      timestamp: new Date().toISOString(),
      details
    };
    return newLog;
  };

  // 3. Handlers & Transactions Loop
  
  // Submit new item
  const handlePostItem = (fields: {
    title: string;
    yearAcquired: string;
    story: string;
    reason: string;
    tags: string[];
    photos: string[];
  }) => {
    // Look up current user's goal
    const myGoal = userGoals.find(g => g.ownerId === currentUser.id);
    const goalTitle = myGoal ? myGoal.title : '暫無綁定任務';

    const newItem: Item = {
      id: `item_${Date.now()}`,
      ownerId: currentUser.id,
      ownerName: currentUser.name,
      ownerAvatar: currentUser.avatar,
      title: fields.title,
      yearAcquired: fields.yearAcquired,
      story: fields.story,
      reason: fields.reason,
      goalLinked: goalTitle,
      photos: fields.photos,
      highestBid: 150, // basic default minimum
      highestBidder: null,
      tipsAmount: 0,
      tags: fields.tags,
      createdAt: new Date().toISOString(),
      status: 'active', // default instantly approved for fluid testing
      bidHistory: [],
      tipHistory: []
    };

    const nextItems = [newItem, ...items];
    const logMsg = `📝 創作者 [${currentUser.name}] 成功上架了新物件：【${fields.title}】。自動綁定夢夢任務：${goalTitle.substring(0, 20)}...`;
    const nextLogs = [addSystemLog('item_create', logMsg, { itemId: newItem.id }), ...systemLogs];
    
    setItems(nextItems);
    setSystemLogs(nextLogs);
    saveToStorage(nextItems, userGoals, nextLogs);

    triggerToast(`✨ 上架故事成功！【${fields.title}】已發布至公共許願池。`);
    setCurrentView('explore');
  };

  // Fund item: Process tips (pure support) vs bids (taking the item)
  const handleFundItem = (
    itemId: string, 
    type: 'tip' | 'bid', 
    amount: number, 
    backerName: string, 
    message?: string
  ) => {
    const targetItem = items.find(i => i.id === itemId);
    if (!targetItem) return;

    let nextItems = [...items];
    let nextGoals = [...userGoals];
    let logMsg = '';
    let toastNtf = '';

    if (type === 'tip') {
      const newTip: TipRecord = {
        id: `tip_${Date.now()}`,
        backerName: backerName || '匿名暖心夥伴',
        amount,
        timestamp: new Date().toISOString(),
        message
      };

      nextItems = items.map(item => {
        if (item.id === itemId) {
          return {
            ...item,
            tipsAmount: item.tipsAmount + amount,
            tipHistory: [newTip, ...item.tipHistory]
          };
        }
        return item;
      });

      // Advance linked owner's active goal progress immediately!
      nextGoals = userGoals.map(goal => {
        // Match by item's bound goal title or owner
        if (goal.ownerId === targetItem.ownerId && goal.status === 'active') {
          return {
            ...goal,
            current: goal.current + amount
          };
        }
        return goal;
      });

      logMsg = `💖 贊助者 [${backerName || '匿名'}] 為回憶物件【${targetItem.title}】隨喜打賞了 $${amount} TWD。寄語: "${message || '無'}"。金額立刻匯入原創者 [${targetItem.ownerName}] 的夢想進度條中！`;
      toastNtf = `💖 感謝您的隨喜贊助 $${amount}！已即時協助推進原主任的主線目標進度。`;

    } else if (type === 'bid') {
      const newBid: BidRecord = {
        id: `bid_${Date.now()}`,
        bidderName: backerName,
        amount,
        timestamp: new Date().toISOString(),
        status: 'pending'
      };

      // When a new highest bid arrives, the previous bid gets "refunded" or overridden
      nextItems = items.map(item => {
        if (item.id === itemId) {
          const updatedHistory = item.bidHistory.map(b => ({
            ...b,
            status: 'refunded' as const
          }));
          return {
            ...item,
            highestBid: amount,
            highestBidder: backerName,
            bidHistory: [newBid, ...updatedHistory]
          };
        }
        return item;
      });

      // Calculate the delta of progress we should advance on the Goal progress
      const previousBid = targetItem.highestBid || 0;
      const bidDelta = amount - previousBid;

      nextGoals = userGoals.map(goal => {
        if (goal.ownerId === targetItem.ownerId && goal.status === 'active') {
          return {
            ...goal,
            current: goal.current + bidDelta
          };
        }
        return goal;
      });

      logMsg = `🔥 競標者 [${backerName}] 為物件【${targetItem.title}】提出了加碼出價：$${amount} TWD (超越原價 $${previousBid}，增量 $${bidDelta} 已補實進度)！`;
      toastNtf = `🎉 競標成功！您以最高出價 $${amount} 暫時領先。原創者的目標進度已增加 +$${bidDelta}！`;
    }

    const nextLogs = [addSystemLog(type, logMsg, { itemId, amount, backerName }), ...systemLogs];
    
    setItems(nextItems);
    setUserGoals(nextGoals);
    setSystemLogs(nextLogs);
    saveToStorage(nextItems, nextGoals, nextLogs);

    // If detail view was selected, refresh details
    const updatedSelected = nextItems.find(i => i.id === itemId);
    if (updatedSelected) {
      setSelectedItem(updatedSelected);
    }

    triggerToast(toastNtf);
  };

  // Administration update status (pending, active, completed, suspended)
  const handleUpdateItemStatus = (itemId: string, status: 'pending' | 'active' | 'suspended' | 'completed') => {
    const targetItem = items.find(i => i.id === itemId);
    if (!targetItem) return;

    const nextItems = items.map(item => {
      if (item.id === itemId) {
        return { ...item, status };
      }
      return item;
    });

    const statusTransMap = {
      active: '開啟並公開上架中',
      pending: '歸入下線審查中',
      suspended: '宣告違憲下架',
      completed: '宣佈成交並結算金流'
    };

    const logMsg = `⚙️ 管理員調整了【${targetItem.title}】的狀態為: 【${statusTransMap[status]}】。原擁有者: [${targetItem.ownerName}]。`;
    const nextLogs = [addSystemLog('status_change', logMsg, { itemId, status }), ...systemLogs];

    setItems(nextItems);
    setSystemLogs(nextLogs);
    saveToStorage(nextItems, userGoals, nextLogs);

    // If matches selected, update selection
    const updatedSelected = nextItems.find(i => i.id === itemId);
    if (updatedSelected) {
      setSelectedItem(updatedSelected);
    }

    triggerToast(`⚙️ 後台狀態已更新：物件已切換為【${statusTransMap[status]}】。`);
  };

  // Simulate Bid from inside backend dashboard
  const handleSimulateBid = (itemId: string, bidderName: string, amount: number) => {
    handleFundItem(itemId, 'bid', amount, bidderName);
  };

  // Update target goal budget progressDelta internally
  const handleUpdateGoalProgress = (goalId: string, delta: number) => {
    const targetGoal = userGoals.find(g => g.id === goalId);
    if (!targetGoal) return;

    const nextGoals = userGoals.map(g => {
      if (g.id === goalId) {
        const nextVal = Math.max(0, g.current + delta);
        return { ...g, current: nextVal };
      }
      return g;
    });

    const logMsg = `📊 系統調節了創作者 [${targetGoal.ownerName}] 的主線進度條，增減量：$${delta} TWD。新餘額為：$${Math.max(0, targetGoal.current + delta).toLocaleString()}。`;
    const nextLogs = [addSystemLog('goal_update', logMsg, { goalId, delta }), ...systemLogs];

    setUserGoals(nextGoals);
    setSystemLogs(nextLogs);
    saveToStorage(items, nextGoals, nextLogs);

    triggerToast(`📊 進度已變更！當前主線資金已調節過。`);
  };

  // Simple adjustment of target requirement
  const handleAdjustGoalTarget = (targetVal: number) => {
    const myGoal = userGoals.find(g => g.ownerId === currentUser.id);
    if (!myGoal) return;

    const nextGoals = userGoals.map(g => {
      if (g.id === myGoal.id) {
        return { ...g, target: targetVal };
      }
      return g;
    });

    const logMsg = `🎯 創作者 [${currentUser.name}] 重新核准並修改其主線目標額度為：$${targetVal.toLocaleString()} TWD。`;
    const nextLogs = [addSystemLog('goal_update', logMsg, { goalId: myGoal.id, target: targetVal }), ...systemLogs];

    setUserGoals(nextGoals);
    setSystemLogs(nextLogs);
    saveToStorage(items, nextGoals, nextLogs);

    triggerToast(`🎯 目標圓夢需求已更新至 $${targetVal.toLocaleString()} TWD！`);
  };

  // Clear system administrative log records
  const handleClearLogs = () => {
    const nextLogs: SystemLog[] = [{
      id: `log_clear_${Date.now()}`,
      type: 'status_change',
      message: '🧹 控制台日誌已被管理員手動晴空清空。運行環境綠色就緒。',
      timestamp: new Date().toISOString()
    }];
    setSystemLogs(nextLogs);
    saveToStorage(items, userGoals, nextLogs);
    triggerToast('🧹 交易模擬日誌已清空！');
  };

  // Hard Reset Entire Demo Application states back to initial presets
  const handleResetDatabase = () => {
    if (!confirm('您確定要將回憶轉運站所有的模擬進度、新上架故事以及出價打賞日誌重置為初始狀態嗎？')) return;
    
    localStorage.removeItem('memory_hub_items_v2');
    localStorage.removeItem('memory_hub_goals_v2');
    localStorage.removeItem('memory_hub_logs_v2');

    const freshLogs: SystemLog[] = [{
      id: 'log_reset',
      type: 'status_change',
      message: '♻️ 系統資料庫進行了「乾淨硬重置（Hard Reset）」。所有隨喜進度、交易標單與自訂明信片皆已回歸工廠初始狀態！',
      timestamp: new Date().toISOString()
    }];

    setItems(INITIAL_ITEMS);
    setUserGoals(INITIAL_GOALS);
    setSystemLogs(freshLogs);
    setSelectedItem(null);
    setCurrentView('explore');
    setCurrentUser(MOCK_USERS[0]);

    saveToStorage(INITIAL_ITEMS, INITIAL_GOALS, freshLogs);
    triggerToast('♻️ 系統已完全重置成 pristine 初始場景！');
  };

  // Mail postcard broadcast logging
  const handleSendPostcard = (msg: string) => {
    const logMsg = `💌 創作者 [${currentUser.name}] 完成圓夢方案！她親手寄送了『圓夢明信片』給所有買家及打賞天使："${msg.substring(0, 50)}..."`;
    const nextLogs = [addSystemLog('postcard', logMsg), ...systemLogs];
    
    setSystemLogs(nextLogs);
    saveToStorage(items, userGoals, nextLogs);

    triggerToast('💌 電子圓夢明信片已成功寄送予所有贊助旅人，功德圓滿！');
  };

  // Identity Switch wrapper
  const handleSelectSimulatedUser = (user: UserProfile) => {
    setCurrentUser(user);
    const logMsg = `👤 行為模擬者切换至： [${user.name}]。現在您可以查看、管理或編輯此位旅人的專屬主線及上架商品。`;
    const nextLogs = [addSystemLog('status_change', logMsg), ...systemLogs];
    setSystemLogs(nextLogs);
    saveToStorage(items, userGoals, nextLogs);
    triggerToast(`👤 已切換創作者身份為：[${user.name}]`);
  };

  // 4. Computed stats
  const activeUserGoal = userGoals.find(g => g.ownerId === currentUser.id) || {
    id: 'g_empty',
    ownerId: currentUser.id,
    ownerName: currentUser.name,
    title: '暫無設定目標',
    target: 10000,
    current: 0,
    status: 'active' as const
  };

  const userLinkedItems = items.filter(
    item => item.ownerId === currentUser.id
  );

  return (
    <div className="h-screen w-full flex bg-black text-white font-sans overflow-hidden">
      
      {/* Top Navigation */}
      <Navbar 
        currentView={currentView}
        setView={setCurrentView}
        setSelectedItem={setSelectedItem}
        currentUser={currentUser}
        allUsers={MOCK_USERS}
        onSelectUser={handleSelectSimulatedUser}
      />

      {/* Main View Router */}
      <main className="flex-1 overflow-y-auto relative h-full">
        
        {/* VIEW 1: Feed/Explore list */}
        {currentView === 'explore' && !selectedItem && (
          <ExploreView 
            items={items} 
            onSelectItem={setSelectedItem} 
          />
        )}
        
        {/* VIEW 1.5: Feed Detail inspect */}
        {currentView === 'explore' && selectedItem && (
          <DetailView 
            item={selectedItem} 
            onBack={() => setSelectedItem(null)} 
            onFund={handleFundItem}
          />
        )}

        {/* VIEW 2: Back-end Creator dashboard */}
        {currentView === 'dashboard' && (
          <DashboardView 
            currentUser={currentUser}
            userGoal={activeUserGoal}
            linkedItems={userLinkedItems}
            onSendPostcard={handleSendPostcard}
            onAdjustGoal={handleAdjustGoalTarget}
          />
        )}

        {/* VIEW 3: Publishing Item story */}
        {currentView === 'post' && (
          <PostItemView 
            currentUser={currentUser}
            currentGoal={activeUserGoal}
            onSubmit={handlePostItem}
            onCancel={() => setCurrentView('explore')}
          />
        )}

        {/* VIEW 4: Admin State sandbox control panel */}
        {currentView === 'admin' && (
          <AdminPanel 
            items={items}
            userGoals={userGoals}
            systemLogs={systemLogs}
            onUpdateItemStatus={handleUpdateItemStatus}
            onSimulateBid={handleSimulateBid}
            onUpdateGoalProgress={handleUpdateGoalProgress}
            onClearLogs={handleClearLogs}
            onResetDatabase={handleResetDatabase}
          />
        )}

      </main>

      {/* Toast Overlay */}
      {toastMessage && (
        <div 
          id="toast-notification-system"
          className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] bg-white text-black px-6 py-3 shadow-2xl flex items-center justify-between gap-4 font-bold text-[12px] border border-[#333] uppercase tracking-[1px]"
        >
          <span>{toastMessage}</span>
          <button 
            className="text-[#666] hover:text-black font-black text-xs select-none"
            onClick={() => setToastMessage('')}
          >
            [X]
          </button>
        </div>
      )}

    </div>
  );
}

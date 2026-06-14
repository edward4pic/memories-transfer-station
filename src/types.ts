/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface BidRecord {
  id: string;
  bidderName: string;
  amount: number;
  timestamp: string;
  status: 'pending' | 'accepted' | 'refunded';
}

export interface TipRecord {
  id: string;
  backerName: string;
  amount: number;
  timestamp: string;
  message?: string;
}

export interface Item {
  id: string;
  ownerId: string;
  ownerName: string;
  ownerAvatar: string;
  title: string;
  yearAcquired: string;
  story: string;
  reason: string;
  goalLinked: string;
  photos: string[];
  highestBid: number;
  highestBidder: string | null;
  tipsAmount: number;
  tags: string[];
  createdAt: string;
  status: 'pending' | 'active' | 'suspended' | 'completed';
  bidHistory: BidRecord[];
  tipHistory: TipRecord[];
}

export interface UserGoal {
  id: string;
  ownerId: string;
  ownerName: string;
  title: string;
  target: number;
  current: number;
  status: 'active' | 'completed';
}

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  background: string;
}

export interface SystemLog {
  id: string;
  type: 'bid' | 'tip' | 'status_change' | 'postcard' | 'item_create' | 'goal_update';
  message: string;
  timestamp: string;
  details?: any;
}

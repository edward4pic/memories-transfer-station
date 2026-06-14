/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Item, UserGoal, UserProfile } from './types';

export const MOCK_USERS: UserProfile[] = [
  {
    id: 'u_current',
    name: '林語希',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    background: '自由接案設計師、底片攝影愛好者。常在溫州街巷弄遊蕩，相信物品是有靈性的，它們只是在不同旅人之間代為保管罷了。'
  },
  {
    id: 'u_miner',
    name: '老派礦工-阿盛',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    background: '退休硬體工程師，見證了光華商場最繁榮的年代。喜歡囤積電子零件，近年開始強迫自己斷捨離，讓矽與電子回到更適合它們的地方。'
  },
  {
    id: 'u_haruko',
    name: '晴子',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
    background: '地方獨立書店店員。喜歡在睡前彈一曲不合時宜的民謠，期望讓生活中的寂寞碎片轉化為可攜帶的文學養分。'
  },
  {
    id: 'u_zhuo',
    name: '卓焙咖啡店主',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    background: '自家烘焙咖啡小店創辦人。熱愛追求極限的乾淨風味，深信「每杯好咖啡背後，都建立在十杯失敗的深焙焦苦中」。'
  }
];

export const INITIAL_GOALS: UserGoal[] = [
  {
    id: 'g_1',
    ownerId: 'u_current',
    ownerName: '林語希',
    title: '籌措日語與印尼語家教課學費 (目標聽懂底片廠手製職人口音)',
    target: 10000,
    current: 8250,
    status: 'active'
  },
  {
    id: 'g_2',
    ownerId: 'u_miner',
    ownerName: '老派礦工-阿盛',
    title: '補貼 Costa Serena 郵輪沖繩日韓旅費 (送給老婆的三十週年驚喜)',
    target: 25000,
    current: 18500,
    status: 'active'
  },
  {
    id: 'g_3',
    ownerId: 'u_haruko',
    ownerName: '晴子',
    title: '支持溫州街無人流浪貓貓醫療保險與小集資基金',
    target: 8000,
    current: 7800, // 故意接近達標，方便點擊測試 display/card
    status: 'active'
  },
  {
    id: 'g_4',
    ownerId: 'u_zhuo',
    ownerName: '卓焙咖啡店主',
    title: '資助尋根之旅：前往衣索比亞 Yirgacheffe 產區微型莊園學習烘豆',
    target: 50000,
    current: 42000,
    status: 'active'
  }
];

export const INITIAL_ITEMS: Item[] = [
  {
    id: 'item_1',
    ownerId: 'u_current',
    ownerName: '林語希',
    ownerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    title: '童年制約：長輩給的陶瓷紅豬撲滿',
    yearAcquired: '2002',
    story: '國小時期阿公買的陶瓷紅豬撲滿。記得那時候放暑假回新屋老家，一邊吃著阿嬤剛蒸好的饅頭，一邊被阿公叮囑要養成每日儲蓄的踏實習慣。後來裡面裝滿了五十元硬幣，雖然最後在外地讀大學為了買第一台二手底片相機把它殺了（阿公知道了只是笑笑），但我總覺得相片裡一直留著那個下午的饅頭香氣。',
    reason: '現在實體硬幣漸漸少用，都改為數位帳戶了。我想把這個具有紀念儀式感、但有點厚重的占空間撲滿，交託給希望重建對儲蓄執念的人，而它的殘餘價值會全數用來幫我繳交語言班的學費，換成無形的精神資產。',
    goalLinked: '籌措日語與印尼語家教課學費 (目標聽懂底片廠手製職人口音)',
    photos: ['https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=800'],
    highestBid: 450,
    highestBidder: '神秘咖啡客',
    tipsAmount: 2300,
    tags: ['#家族記憶', '#新屋老家', '#儲蓄'],
    createdAt: '2026-06-13T15:00:00Z',
    status: 'active',
    bidHistory: [
      { id: 'b_1', bidderName: '小朱', amount: 300, timestamp: '2026-06-13T16:00:00Z', status: 'refunded' },
      { id: 'b_2', bidderName: '神秘咖啡客', amount: 450, timestamp: '2026-06-13T18:30:00Z', status: 'pending' }
    ],
    tipHistory: [
      { id: 't_1', backerName: '匿名暖心旅人', amount: 500, timestamp: '2026-06-13T15:30:00Z', message: '好溫馨的故事，祝你早日學會流利的日語跟職人對話！' },
      { id: 't_2', backerName: '底片同好 A', amount: 1000, timestamp: '2026-06-13T16:15:00Z', message: '感同身受，阿嬤蒸的饅頭真的是世界上最棒的味道，支持你！' },
      { id: 't_3', backerName: '新屋同鄉人', amount: 800, timestamp: '2026-06-13T17:40:00Z', message: '看著文字差點流眼淚，加油！' }
    ]
  },
  {
    id: 'item_2',
    ownerId: 'u_miner',
    ownerName: '老派礦工-阿盛',
    ownerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    title: '老爸當年跟風加密貨幣狂潮、買來拆解與「研究」的主機板',
    yearAcquired: '2017',
    story: '這不是一片科技廢鐵，這是我那個古怪、甚至不太懂得與家人溝通的老爸，在 2017 年突然熱衷於「區塊鏈信仰」與「電子貨幣礦潮」的歷史標本。那陣子家裡客廳 24 小時充斥著高頻風扇聲，老爸逢人便聊顯卡的算力與乙太幣的未來。雖然狂熱在兩年後跌落谷底、機器也開不了機，但它記錄了他一輩子最冒險也最失控的金融夢想。',
    reason: '老爸去年平靜地走了，這片留著濃厚高頻風扇積灰的主機與筆電殘骸我想清理出來。直接丟回收簡直是對他那段燃燒歲月的褻瀆。我希望能將它的時代價值，轉化為補貼給媽媽去搭郵輪出國旅行的基金，圓她這輩子還沒出過國的夢。',
    goalLinked: '補貼 Costa Serena 郵輪沖繩日韓旅費 (送給老婆的三十週年驚喜)',
    photos: ['https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800'],
    highestBid: 1200,
    highestBidder: '硬體重度收藏狂',
    tipsAmount: 500,
    tags: ['#加密貨幣', '#時代標本', '#投資夢', '#父子情感'],
    createdAt: '2026-06-12T10:00:00Z',
    status: 'active',
    bidHistory: [
      { id: 'b_3', bidderName: '硬體重度收藏狂', amount: 1200, timestamp: '2026-06-12T11:00:00Z', status: 'pending' }
    ],
    tipHistory: [
      { id: 't_4', backerName: '老台北IT男', amount: 500, timestamp: '2026-06-12T10:30:00Z', message: '以前在八德路也是跟老爸組電腦...這個故事後勁好強。希望阿姨郵輪旅程玩得開心！' }
    ]
  },
  {
    id: 'item_3',
    ownerId: 'u_haruko',
    ownerName: '晴子',
    ownerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
    title: '大一吉他社「最不合群」的那把二手雅馬哈古典吉他',
    yearAcquired: '2014',
    story: '大一剛進吉他社時，大家都買亮麗的亮面鋼弦吉他。只有我，固執地在公館舊貨二手攤上挑了這把琴柄寬大、音色溫吞且指板極難按壓的尼龍古典琴。每天在天台，當大家熱血沸騰地唱著流行搖滾，我便一個人在角落彈著不合群的卡農。琴身有兩處明顯的磨損，但它陪伴了我整個被同儕邊緣化卻無比自由的失眠大學年代。',
    reason: '如今琴聲少彈，它在角落漸漸結網。我決定釋出給需要孤獨慰藉的新一代靈魂。所有的拍賣或隨喜所得，我都不會留作私用，將全數捐助給溫州街街角流浪貓們的醫療互助會，這群貓咪當初在無數失眠夜晚，是我的唯一聽眾。',
    goalLinked: '支持溫州街無人流浪貓貓醫療保險與小集資基金',
    photos: ['https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&q=80&w=800'],
    highestBid: 1600,
    highestBidder: '台大吉他社新生A',
    tipsAmount: 1200,
    tags: ['#古典吉他', '#大學記憶', '#寂寞天台', '#溫州街貓咪'],
    createdAt: '2026-06-11T08:00:00Z',
    status: 'active',
    bidHistory: [
      { id: 'b_4', bidderName: '台大吉他社新生A', amount: 1600, timestamp: '2026-06-11T12:00:00Z', status: 'pending' }
    ],
    tipHistory: [
      { id: 't_5', backerName: '過路讀書貓', amount: 600, timestamp: '2026-06-11T09:00:00Z', message: '為不合群的古典吉他乾杯！也為溫州街的貓貓加油！' },
      { id: 't_6', backerName: '公館原住民', amount: 600, timestamp: '2026-06-11T10:15:00Z', message: '我也常去溫州街摸摸小橘！謝謝晴子的溫柔。' }
    ]
  },
  {
    id: 'item_4',
    ownerId: 'u_zhuo',
    ownerName: '卓焙咖啡店主',
    ownerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    title: '生平第一次「把曼特寧烘成焦炭」之後，淘汰的初學者手搖磨豆機',
    yearAcquired: '2019',
    story: '這是伴隨我創業旅程最初的微型磨豆機。2019 年夏天，我剛租下小小的閣樓自烘豆。第一次滿懷期望地拿著這支手搖磨慢吞吞地磨著自烘的經典曼特寧，結果火候沒抓好，不僅把咖啡豆烘成了像柏油一樣的焦炭，還在研磨時因為力道過猛把磨豆機的鑄鐵手把稍微弄歪了。但那是第一杯挫折的滋味，沒有它，就沒有現在對極致乾淨果酸的敏感度。',
    reason: '現在店裡已經引進了數十萬元的精密商用平刀磨豆機。這台有些歪斜且充滿深色焦油痕跡的手搖磨被安置在展示櫃上，是時候解散它的「站崗職務」，轉用它的餘熱，去燃燒我親赴衣索比亞產區學習的行囊旅籌。',
    goalLinked: '資助尋根之旅：前往衣索比亞 Yirgacheffe 產區微型莊園學習烘豆',
    photos: ['https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=800'],
    highestBid: 850,
    highestBidder: '咖啡成癮症主治醫師',
    tipsAmount: 1800,
    tags: ['#咖啡軌跡', '#手搖磨豆機', '#烘豆失敗學', '#尋根之旅'],
    createdAt: '2026-06-10T14:20:00Z',
    status: 'active',
    bidHistory: [
      { id: 'b_5', bidderName: '咖啡成癮症主治醫師', amount: 850, timestamp: '2026-06-10T15:00:00Z', status: 'pending' }
    ],
    tipHistory: [
      { id: 't_7', backerName: '衣索比亞愛好者', amount: 1000, timestamp: '2026-06-10T16:00:00Z', message: '耶加雪菲的日曬真的世界一絕！祝福店主可以抱回最棒的模型莊園紀錄回來分享給大家！' },
      { id: 't_8', backerName: '烘豆小廢物', amount: 800, timestamp: '2026-06-11T13:40:00Z', message: '原來神之主烘師也是從木炭曼特寧走過來的！這太勵志了！' }
    ]
  }
];

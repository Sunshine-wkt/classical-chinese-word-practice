// 資料依據：教育局《逍遙遊》（節錄）原文及校本筆記「一、重點詞解」。
export const lesson = { title: '逍遙遊', author: '莊子' };

export const passages = [
  '惠子謂莊子曰：「魏王{{yi|貽}}我大瓠之{{zhong-seed|種}}，我{{shu-grow|樹}}之成而實五石。以盛水漿，其{{jian|堅}}不能自{{ju|舉}}也。{{pou|剖}}之以為瓢，則{{huoluo|瓠落}}無所容。非不{{xiaoran|呺然}}大也，吾為其無用而{{pou-break|掊}}之。」莊子曰：「夫子固{{zhuoyu|拙於}}{{yong-use|用}}大矣！宋人有善為不龜手之藥者，世世以{{pingpi|洴澼}}絖為事。客聞之，請買其方百金。聚族而謀曰：『我世世為洴澼絖，不過數金；今一朝而{{yu-sell|鬻}}技百金，請{{yu-agree|與}}之。』客得之，以{{shui|說}}吳王。越有難，吳王使之{{jiang|將}}，冬與越人水戰，大敗越人，裂地而封之。能不龜手{{yi-same|一}}也；或以封，或不免於洴澼絖，則所用之異也。今子有五石之瓠，何不慮以為大樽而浮於江湖，而憂其瓠落無所容，則夫子猶有{{peng|蓬}}之心也夫！」',
  '惠子謂莊子曰：「吾有大樹，人謂之樗；其大本擁腫而不{{zhong-fit|中}}繩墨，其小枝卷曲而不中規矩。立之塗，匠者不顧。今子之言，大而無用，眾所同{{qu|去}}也。」莊子曰：「子{{du|獨}}不見狸狌乎？卑身而伏，以候敖者；東西跳{{liang|梁}}，不{{bi-avoid|辟}}高下，中於機辟，死於罔罟。今夫斄牛，其大若垂天之雲；此能為大矣，而不能{{zhi|執}}鼠。今子有大樹，患其無用，何不{{shu-plant|樹}}之於{{wuheyoup|無何有}}之{{xiang-place|鄉}}，廣莫之野，{{panghuang|彷徨}}乎無為其側，{{xiaoyao|逍遙}}乎寢卧其下；不{{yao|夭}}斤斧，物無害者。無所可用，{{an|安}}所困苦哉？」'
];

export const terms = [
  { id: 'yi', word: '貽', meaning: '贈送。', options: ['收藏。', '交換。', '贈送。', '借用。'], answer: 2, excerpt: '魏王貽我大瓠之種，我樹之成而實五石。' },
  { id: 'zhong-seed', word: '種', meaning: '種子。', options: ['種類、品種。', '種子。', '種植、栽種。', '後代、子孫。'], answer: 1, excerpt: '魏王貽我大瓠之種，我樹之成而實五石。' },
  { id: 'shu-grow', word: '樹', meaning: '種植、栽種。', options: ['樹立、建立。', '種植、栽種。', '依靠、憑藉。', '遮蔽、保護。'], answer: 1, excerpt: '魏王貽我大瓠之種，我樹之成而實五石。' },
  { id: 'jian', word: '堅', meaning: '硬度。', options: ['堅持不變。', '堅固程度。', '硬度。', '堅硬的器物。'], answer: 2, excerpt: '以盛水漿，其堅不能自舉也。' },
  { id: 'ju', word: '舉', meaning: '拿起。', options: ['推舉、推薦。', '拿起。', '全、都。', '舉行、辦理。'], answer: 1, excerpt: '以盛水漿，其堅不能自舉也。' },
  { id: 'pou', word: '剖', meaning: '破開、中分。', options: ['雕刻成形。', '破開、中分。', '盛載、容納。', '磨平邊緣。'], answer: 1, excerpt: '剖之以為瓢，則瓠落無所容。' },
  { id: 'huoluo', word: '瓠落', meaning: '大，空廓的樣子。', options: ['外形小巧的樣子。', '大，空廓的樣子。', '破裂殘缺的樣子。', '圓滿充實的樣子。'], answer: 1, excerpt: '剖之以為瓢，則瓠落無所容。' },
  { id: 'xiaoran', word: '呺然', meaning: '虛空而巨大的樣子。', options: ['聲音洪亮的樣子。', '虛空而巨大的樣子。', '堅硬難破的樣子。', '細小精巧的樣子。'], answer: 1, excerpt: '非不呺然大也，吾為其無用而掊之。' },
  { id: 'pou-break', word: '掊', meaning: '擊破。', options: ['收藏、保存。', '擊破。', '捧起、托住。', '塗抹、修補。'], answer: 1, excerpt: '非不呺然大也，吾為其無用而掊之。' },
  { id: 'zhuoyu', word: '拙於', meaning: '不善於。', options: ['特別擅長。', '不善於。', '刻意避開。', '過分重視。'], answer: 1, excerpt: '夫子固拙於用大矣！' },
  { id: 'yong-use', word: '用', meaning: '利用。', options: ['用途、功效。', '需要、耗費。', '利用。', '任用、起用。'], answer: 2, excerpt: '夫子固拙於用大矣！' },
  { id: 'pingpi', word: '洴澼', meaning: '漂洗。', options: ['織造絲絮。', '漂洗。', '煮染衣物。', '收藏藥方。'], answer: 1, excerpt: '宋人有善為不龜手之藥者，世世以洴澼絖為事。' },
  { id: 'yu-sell', word: '鬻', meaning: '賣。', options: ['買入。', '贈送。', '交換。', '賣。'], answer: 3, excerpt: '今一朝而鬻技百金，請與之。' },
  { id: 'yu-agree', word: '與', meaning: '答應。', options: ['給予。', '答應。', '參與。', '交往。'], answer: 1, excerpt: '今一朝而鬻技百金，請與之。' },
  { id: 'shui', word: '說', meaning: '遊說。', options: ['解釋、說明。', '責備、勸戒。', '遊說。', '愉悅、高興。'], answer: 2, excerpt: '客得之，以說吳王。' },
  { id: 'jiang', word: '將', meaning: '領兵。', options: ['將要、快要。', '帶領、扶持。', '領兵。', '送交、交付。'], answer: 2, excerpt: '越有難，吳王使之將，冬與越人水戰，大敗越人，裂地而封之。' },
  { id: 'yi-same', word: '一', meaning: '同樣、同一。', options: ['一次、一下。', '專一、不二。', '同樣、同一。', '全部、所有。'], answer: 2, excerpt: '能不龜手一也；' },
  { id: 'peng', word: '蓬', meaning: '一種捲曲不直的草，蓬之心：指心思如蓬草，閉塞不通。', options: ['一種可作藥用的草。', '一種捲曲不直的草，蓬之心：指心思如蓬草，閉塞不通。', '比喻志向遠大的心。', '比喻隨風飄蕩的生活。'], answer: 1, excerpt: '而憂其瓠落無所容，則夫子猶有蓬之心也夫！' },
  { id: 'zhong-fit', word: '中', meaning: '符合。', options: ['射中、命中。', '符合。', '中央、中間。', '受到、遭遇。'], answer: 1, excerpt: '其大本擁腫而不中繩墨，其小枝卷曲而不中規矩。' },
  { id: 'qu', word: '去', meaning: '離棄、拋棄。', options: ['離棄、拋棄。', '離開、前往。', '距離、相隔。', '過去、從前。'], answer: 0, excerpt: '今子之言，大而無用，眾所同去也。' },
  { id: 'du', word: '獨', meaning: '豈、難道。', options: ['只有、僅僅。', '單獨、獨自。', '豈、難道。', '偏偏、特意。'], answer: 2, excerpt: '子獨不見狸狌乎？' },
  { id: 'liang', word: '梁', meaning: '通「踉」，跳躍。', options: ['橋樑、棟梁。', '通「踉」，跳躍。', '山脊、高處。', '支撐屋頂的木材。'], answer: 1, excerpt: '東西跳梁，不辟高下，中於機辟，死於罔罟。' },
  { id: 'bi-avoid', word: '辟', meaning: '通「避」。', options: ['開闢、開拓。', '通「避」。', '邪僻、不正。', '比喻、譬喻。'], answer: 1, excerpt: '東西跳梁，不辟高下，中於機辟，死於罔罟。' },
  { id: 'zhi', word: '執', meaning: '捕捉。', options: ['拿著、握住。', '執行、實行。', '堅持、固守。', '捕捉。'], answer: 3, excerpt: '此能為大矣，而不能執鼠。' },
  { id: 'shu-plant', word: '樹', meaning: '種植。', options: ['種植。', '建立、樹立。', '倚靠、依附。', '成長、茂盛。'], answer: 0, excerpt: '今子有大樹，患其無用，何不樹之於無何有之鄉，廣莫之野，彷徨乎無為其側，逍遙乎寢卧其下；' },
  { id: 'wuheyoup', word: '無何有', meaning: '甚麼都沒有。', options: ['甚麼都沒有。', '沒有多久。', '不知在何處。', '沒有必要。'], answer: 0, excerpt: '今子有大樹，患其無用，何不樹之於無何有之鄉，廣莫之野，彷徨乎無為其側，逍遙乎寢卧其下；' },
  { id: 'xiang-place', word: '鄉', meaning: '處所、地方。', options: ['家鄉、鄉里。', '處所、地方。', '通「向」，從前。', '朝向、面向。'], answer: 1, excerpt: '今子有大樹，患其無用，何不樹之於無何有之鄉，廣莫之野，彷徨乎無為其側，逍遙乎寢卧其下；' },
  { id: 'panghuang', word: '彷徨', meaning: '縱任不拘。', options: ['來回徘徊，猶豫不決。', '縱任不拘。', '感到恐懼不安。', '四處尋找道路。'], answer: 1, excerpt: '今子有大樹，患其無用，何不樹之於無何有之鄉，廣莫之野，彷徨乎無為其側，逍遙乎寢卧其下；' },
  { id: 'xiaoyao', word: '逍遙', meaning: '優游自在。', options: ['遙遠而難以到達。', '優游自在。', '逃避世事。', '行走緩慢。'], answer: 1, excerpt: '今子有大樹，患其無用，何不樹之於無何有之鄉，廣莫之野，彷徨乎無為其側，逍遙乎寢卧其下；' },
  { id: 'yao', word: '夭', meaning: '摧折。', options: ['年少、美好。', '早死、短命。', '摧折。', '彎曲、柔弱。'], answer: 2, excerpt: '不夭斤斧，物無害者。' },
  { id: 'an', word: '安', meaning: '怎會、哪會。', options: ['安定、安穩。', '安置、放置。', '怎會、哪會。', '安心、安然。'], answer: 2, excerpt: '無所可用，安所困苦哉？' }
];

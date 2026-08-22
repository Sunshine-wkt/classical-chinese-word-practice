// 資料依據：教育局《唐詩三首》官方原文及教師提供的「一、重點詞解」截圖。
export const lesson = { title: '詩三首', author: '王維、李白、杜甫', index: '第九篇' };

export const passages = [
  {
    title: '《山居秋{{ming|暝}}》・王維',
    lines: [
      '空山新雨後，天氣晚來秋。',
      '明月松間照，清泉石上流。',
      '{{zhuxuan|竹喧}}歸{{huannv|浣女}}，蓮動下漁舟。',
      '{{suiyi|隨意}}春芳{{xie|歇}}，王孫自可留。'
    ]
  },
  {
    title: '《月下獨酌（其一）》・李白',
    lines: [
      '花間一壺酒，獨酌無{{xiangqin|相親}}。',
      '舉杯邀明月，對影成{{sanren|三人}}。',
      '月既不{{jie|解}}飲，影{{tu|徒}}隨我身。',
      '暫伴月{{jiang|將}}影，行樂須{{ji,chun|及春}}。',
      '我歌月{{paihuai|徘徊}}，我{{wu|舞}}影{{lingluan|零亂}}。',
      '醒時同{{jiaohuan|交歡}}，醉後各{{fensan|分散}}。',
      '永結{{wuqing|無情}}遊，{{xiangqi|相期}}{{miao|邈}}雲漢。'
    ]
  },
  {
    title: '《登樓》・杜甫',
    lines: [
      '花近高樓傷客心，萬方多難此登臨。',
      '錦江春色來天地，玉壘浮雲變古今。',
      '{{beiji|北極}}朝廷終不改，西山寇盜莫相侵。',
      '{{kelian|可憐}}後主還祠廟，日暮{{liao|聊}}為梁甫吟。'
    ]
  }
];

export const terms = [
  { id: 'ming', word: '暝', meaning: '暮色，夜色。', options: ['天將破曉的微光。', '暮色，夜色。', '山間瀰漫的霧氣。', '月光照耀的夜景。'], answer: 1, excerpt: '詩題：《山居秋暝》。' },
  { id: 'zhuxuan', word: '竹喧', meaning: '竹林裏的喧鬧聲。', options: ['竹子隨風搖曳的聲音。', '竹林間流水的聲音。', '竹林裏的喧鬧聲。', '竹林裏的鳥鳴聲。'], answer: 2, excerpt: '竹喧歸浣女，蓮動下漁舟。' },
  { id: 'huannv', word: '浣女', meaning: '洗衣女。', options: ['採蓮的女子。', '捕魚的女子。', '洗衣女。', '居於山中的女子。'], answer: 2, excerpt: '竹喧歸浣女，蓮動下漁舟。' },
  { id: 'suiyi', word: '隨意', meaning: '任憑、任由。', options: ['任憑、任由。', '隨自己的意願行事。', '任意放縱。', '不加約束地改變。'], answer: 0, excerpt: '隨意春芳歇，王孫自可留。' },
  { id: 'xie', word: '歇', meaning: '凋謝。', options: ['停止休息。', '停留不去。', '聲音消歇。', '凋謝。'], answer: 3, excerpt: '隨意春芳歇，王孫自可留。' },
  { id: 'xiangqin', word: '相親', meaning: '互相親愛、親近。此指可相親近的人。', options: ['一同飲酒的人。', '親戚家人。', '彼此相識的朋友。', '互相親愛、親近。此指可相親近的人。'], answer: 3, excerpt: '花間一壺酒，獨酌無相親。' },
  { id: 'sanren', word: '三人', meaning: '此指李白、月和李白的影子。', options: ['李白與兩位飲酒同伴。', '月、星星和李白。', '李白、酒壺和影子。', '此指李白、月和李白的影子。'], answer: 3, excerpt: '舉杯邀明月，對影成三人。' },
  { id: 'jie', word: '解', meaning: '懂得。', options: ['懂得。', '解除、解開。', '分解、拆散。', '解答、解釋。'], answer: 0, excerpt: '月既不解飲，影徒隨我身。' },
  { id: 'tu', word: '徒', meaning: '只、但。', options: ['徒步行走。', '門徒、學生。', '只、但。', '白白地、徒然。'], answer: 2, excerpt: '月既不解飲，影徒隨我身。' },
  { id: 'jiang', word: '將', meaning: '和、共。', options: ['拿着、帶着。', '和、共。', '即將、將要。', '扶持、帶領。'], answer: 1, excerpt: '暫伴月將影，行樂須及春。' },
  { id: 'ji', word: '及', meaning: '趁着、乘着。', options: ['到達、達到。', '涉及、關連。', '來得及、趕上。', '趁着、乘着。'], answer: 3, excerpt: '暫伴月將影，行樂須及春。' },
  { id: 'chun', word: '及春', meaning: '趁着春天。', options: ['趁着春天。', '等到春天到來。', '在春天結束以前。', '與春天一同。'], answer: 0, excerpt: '暫伴月將影，行樂須及春。' },
  { id: 'paihuai', word: '徘徊', meaning: '往返、迴旋、來回走動。', options: ['遲疑不決。', '停留不前。', '往返、迴旋、來回走動。', '四處尋覓。'], answer: 2, excerpt: '我歌月徘徊，我舞影零亂。' },
  { id: 'wu', word: '舞', meaning: '此指舞劍。', options: ['跳舞。', '此指舞劍。', '手舞足蹈。', '舞弄衣袖。'], answer: 1, excerpt: '我歌月徘徊，我舞影零亂。' },
  { id: 'lingluan', word: '零亂', meaning: '散亂。', options: ['散亂。', '細碎而明亮。', '快速旋轉。', '整齊有序。'], answer: 0, excerpt: '我歌月徘徊，我舞影零亂。' },
  { id: 'jiaohuan', word: '交歡', meaning: '一齊歡樂。', options: ['彼此結交。', '一同飲酒。', '一齊歡樂。', '互相勸酒。'], answer: 2, excerpt: '醒時同交歡，醉後各分散。' },
  { id: 'fensan', word: '分散', meaning: '離散、別離。', options: ['分配、分發。', '離散、別離。', '疏散人群。', '散開居住。'], answer: 1, excerpt: '醒時同交歡，醉後各分散。' },
  { id: 'wuqing', word: '無情', meaning: '即忘情，指泯除是非、得失、物我之別，不為世俗所困的超脫精神境界。', options: ['沒有情感、冷酷。', '無須掛念親友。', '不受自然景物影響。', '即忘情，指泯除是非、得失、物我之別，不為世俗所困的超脫精神境界。'], answer: 3, excerpt: '永結無情遊，相期邈雲漢。' },
  { id: 'xiangqi', word: '相期', meaning: '相約。', options: ['相約。', '期待相見的日期。', '彼此約定時間。', '相互期望。'], answer: 0, excerpt: '永結無情遊，相期邈雲漢。' },
  { id: 'miao', word: '邈', meaning: '遙遠。', options: ['高遠不可及。', '遙遠。', '隱約不清。', '久遠古老。'], answer: 1, excerpt: '永結無情遊，相期邈雲漢。' },
  { id: 'beiji', word: '北極', meaning: '北極星，比喻北方的朝廷。', options: ['北方極遠之地。', '北斗七星。', '北極星，比喻北方的朝廷。', '北方邊境。'], answer: 2, excerpt: '北極朝廷終不改，西山寇盜莫相侵。' },
  { id: 'kelian', word: '可憐', meaning: '可悲。', options: ['可悲。', '可愛、值得憐愛。', '令人同情。', '可惜、令人惋惜。'], answer: 0, excerpt: '可憐後主還祠廟，日暮聊為梁甫吟。' },
  { id: 'liao', word: '聊', meaning: '姑且、暫且、只好。', options: ['稍微、略微。', '姑且、暫且、只好。', '依靠、憑藉。', '閒談、聊天。'], answer: 1, excerpt: '可憐後主還祠廟，日暮聊為梁甫吟。' }
];

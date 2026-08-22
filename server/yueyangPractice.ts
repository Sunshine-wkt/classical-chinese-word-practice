/**
 * 《岳陽樓記》全端試行教材資料。
 * 此檔由 tools/generate-yueyang-pilot-data.mjs 從已核對的離線練習原樣生成；
 * 正解與答案位置只在伺服器端使用，前端只會收到四個未標示正解的選項。
 */
type SourceTerm = {
  id: string;
  word: string;
  meaning: string;
  distractors: string[];
  excerpt: string;
};

const passages = [
  "慶曆四年春，滕子京{{zhe|謫}}{{shou|守}}巴陵郡。{{yue|越}}明年，政通人和，百廢{{ju|具}}興。乃重修岳陽樓，增其舊制，刻唐賢、今人詩賦於其上；{{shu|屬}}予作文以記之。",
  "予觀夫巴陵{{sheng|勝}}狀，在洞庭一湖。{{xian|銜}}遠山，吞長江，浩浩{{tang|湯湯}}，橫無際涯；朝暉夕陰，氣象萬千。此則岳陽樓之{{daguan|大觀}}也，前人之述{{bei|備}}矣。然則北通巫峽，南極瀟湘，{{qianke|遷客}}{{saoren|騷人}}，多會於此，覽物之情，得無異乎？",
  "若夫{{yin|霪}}雨{{feifei|霏霏}}，連月不{{kai|開}}；{{yin-feng|陰}}風怒{{hao|號}}，濁浪{{paikong|排空}}；日星隱耀，山岳潛形；商旅不行，{{qiang|檣}}{{ji|楫}}{{qing|傾}}摧；{{bo|薄}}暮{{ming|冥冥}}，虎嘯猿啼。登斯樓也，則有{{qu|去}}國懷鄉，憂讒畏譏，滿目{{xiaoran|蕭然}}，感極而悲者矣。",
  "至若春和{{jing|景}}明，波瀾不驚，上下天光，一碧萬頃；沙鷗{{xiang|翔}}{{ji-ji|集}}，錦鱗游泳；岸芷汀蘭，{{youyou|郁郁}}{{qingqing|青青}}。而或長煙{{yi|一}}{{kong|空}}，皓月千里，浮光躍金，靜影沉璧；漁歌互答，此樂何極！登斯樓也，則有心曠神怡，{{chong|寵}}{{ru|辱}}皆忘，{{ba|把}}酒{{lin|臨}}風，其喜洋洋者矣。",
  "嗟夫！予嘗求{{guren|古仁人之心}}，{{huo|或}}{{yi-diff|異}}二者之{{erwei|為}}。何哉？{{buyi|不以物喜，不以己悲}}。居{{miaotang|廟堂}}之高，則憂其民；處{{jianghu|江湖}}之遠，則憂其君。是進亦憂，退亦憂，然則何時而樂耶？其必曰：「先天下之憂而憂，後天下之樂而樂」歟！噫！{{wei|微}}{{si|斯}}人，吾誰與{{gui|歸}}！"
];
const sourceTerms: SourceTerm[] = [
  {
    "id": "zhe",
    "word": "謫",
    "meaning": "貶謫、貶官",
    "distractors": [
      "升遷任官",
      "調任他郡",
      "辭官退隱"
    ],
    "excerpt": "慶曆四年春，滕子京謫守巴陵郡。"
  },
  {
    "id": "shou",
    "word": "守",
    "meaning": "太守之簡稱，文中指出任為太守",
    "distractors": [
      "守衛城池",
      "保守舊制",
      "遵守法令"
    ],
    "excerpt": "慶曆四年春，滕子京謫守巴陵郡。"
  },
  {
    "id": "yue",
    "word": "越",
    "meaning": "過了",
    "distractors": [
      "超越勝過",
      "越過邊境",
      "愈發更加"
    ],
    "excerpt": "越明年，政通人和，百廢具興。"
  },
  {
    "id": "ju",
    "word": "具",
    "meaning": "通「俱」，全部",
    "distractors": [
      "具備器具",
      "詳細列舉",
      "準備妥當"
    ],
    "excerpt": "越明年，政通人和，百廢具興。"
  },
  {
    "id": "shu",
    "word": "屬",
    "meaning": "通「囑」，囑咐",
    "distractors": [
      "隸屬歸屬",
      "接連不斷",
      "聚集一處"
    ],
    "excerpt": "屬予作文以記之。"
  },
  {
    "id": "sheng",
    "word": "勝",
    "meaning": "美",
    "distractors": [
      "勝過他人",
      "戰勝敵軍",
      "勝任職務"
    ],
    "excerpt": "予觀夫巴陵勝狀，在洞庭一湖。"
  },
  {
    "id": "xian",
    "word": "銜",
    "meaning": "即「啣」，意指「用嘴含物」",
    "distractors": [
      "連接相連",
      "負擔職責",
      "奉命受任"
    ],
    "excerpt": "銜遠山，吞長江，浩浩湯湯，橫無際涯；"
  },
  {
    "id": "tang",
    "word": "湯湯",
    "meaning": "形容水勢浩瀚",
    "distractors": [
      "水流湍急",
      "水聲喧鬧",
      "水面平靜"
    ],
    "excerpt": "銜遠山，吞長江，浩浩湯湯，橫無際涯；"
  },
  {
    "id": "daguan",
    "word": "大觀",
    "meaning": "盛大壯觀的景象",
    "distractors": [
      "觀看的場所",
      "眾人觀覽的儀式",
      "遠望的角度"
    ],
    "excerpt": "此則岳陽樓之大觀也，前人之述備矣。"
  },
  {
    "id": "bei",
    "word": "備",
    "meaning": "完備、詳盡",
    "distractors": [
      "預備安排",
      "防備戒備",
      "備受重視"
    ],
    "excerpt": "此則岳陽樓之大觀也，前人之述備矣。"
  },
  {
    "id": "qianke",
    "word": "遷客",
    "meaning": "被貶謫的官吏",
    "distractors": [
      "遷居的旅客",
      "奉命出使的官員",
      "升遷任職的官吏"
    ],
    "excerpt": "然則北通巫峽，南極瀟湘，遷客騷人，多會於此，覽物之情，得無異乎？"
  },
  {
    "id": "saoren",
    "word": "騷人",
    "meaning": "即詩人",
    "distractors": [
      "憂愁煩躁的人",
      "流浪失意的人",
      "善於辭令的人"
    ],
    "excerpt": "然則北通巫峽，南極瀟湘，遷客騷人，多會於此，覽物之情，得無異乎？"
  },
  {
    "id": "yin",
    "word": "霪",
    "meaning": "通「淫」，過量",
    "distractors": [
      "淫逸放縱",
      "浸潤滲透",
      "連續不斷"
    ],
    "excerpt": "若夫霪雨霏霏，連月不開；"
  },
  {
    "id": "feifei",
    "word": "霏霏",
    "meaning": "形容雨絲細密",
    "distractors": [
      "雨勢猛烈",
      "霧氣濃重",
      "風聲淒厲"
    ],
    "excerpt": "若夫霪雨霏霏，連月不開；"
  },
  {
    "id": "kai",
    "word": "開",
    "meaning": "放晴，天色開朗",
    "distractors": [
      "開始發生",
      "開闢道路",
      "散開分離"
    ],
    "excerpt": "若夫霪雨霏霏，連月不開；"
  },
  {
    "id": "yin-feng",
    "word": "陰",
    "meaning": "陰冷",
    "distractors": [
      "陰暗無光",
      "隱蔽不明",
      "背面一方"
    ],
    "excerpt": "陰風怒號，濁浪排空；"
  },
  {
    "id": "hao",
    "word": "號",
    "meaning": "呼嘯",
    "distractors": [
      "呼喊求救",
      "號令指揮",
      "編列號碼"
    ],
    "excerpt": "陰風怒號，濁浪排空；"
  },
  {
    "id": "paikong",
    "word": "排空",
    "meaning": "指浪濤洶湧，直上雲霄",
    "distractors": [
      "清除空中雲霧",
      "排隊升上天空",
      "浪花拍打水面"
    ],
    "excerpt": "陰風怒號，濁浪排空；"
  },
  {
    "id": "qiang",
    "word": "檣",
    "meaning": "船的桅杆",
    "distractors": [
      "船身的側板",
      "船上的帆布",
      "繫船的纜繩"
    ],
    "excerpt": "商旅不行，檣楫傾摧；"
  },
  {
    "id": "ji",
    "word": "楫",
    "meaning": "船槳",
    "distractors": [
      "船舵方向",
      "船帆布幕",
      "渡船碼頭"
    ],
    "excerpt": "商旅不行，檣楫傾摧；"
  },
  {
    "id": "qing",
    "word": "傾",
    "meaning": "倒下",
    "distractors": [
      "傾聽接受",
      "傾盡全部",
      "傾向偏向"
    ],
    "excerpt": "商旅不行，檣楫傾摧；"
  },
  {
    "id": "bo",
    "word": "薄",
    "meaning": "通「迫」，迫近",
    "distractors": [
      "薄弱微少",
      "輕視鄙薄",
      "淡薄不濃"
    ],
    "excerpt": "薄暮冥冥，虎嘯猿啼。"
  },
  {
    "id": "ming",
    "word": "冥",
    "meaning": "昏暗、陰沉",
    "distractors": [
      "幽深寂靜",
      "冥想思索",
      "死後幽冥"
    ],
    "excerpt": "薄暮冥冥，虎嘯猿啼。"
  },
  {
    "id": "qu",
    "word": "去",
    "meaning": "離開",
    "distractors": [
      "前往抵達",
      "除去消滅",
      "過去已逝"
    ],
    "excerpt": "登斯樓也，則有去國懷鄉，憂讒畏譏，滿目蕭然，感極而悲者矣。"
  },
  {
    "id": "xiaoran",
    "word": "蕭然",
    "meaning": "蕭條冷落的景況",
    "distractors": [
      "悠閒安適的樣子",
      "寂靜莊嚴的樣子",
      "清新明朗的景況"
    ],
    "excerpt": "登斯樓也，則有去國懷鄉，憂讒畏譏，滿目蕭然，感極而悲者矣。"
  },
  {
    "id": "jing",
    "word": "景",
    "meaning": "日光",
    "distractors": [
      "景色風光",
      "景仰敬重",
      "情景處境"
    ],
    "excerpt": "至若春和景明，波瀾不驚，上下天光，一碧萬頃；"
  },
  {
    "id": "xiang",
    "word": "翔",
    "meaning": "飛翔",
    "distractors": [
      "巡行尋覓",
      "滑行降落",
      "鳴叫應和"
    ],
    "excerpt": "沙鷗翔集，錦鱗游泳；"
  },
  {
    "id": "ji-ji",
    "word": "集",
    "meaning": "聚集、棲息",
    "distractors": [
      "收集整理",
      "集市買賣",
      "聚會商議"
    ],
    "excerpt": "沙鷗翔集，錦鱗游泳；"
  },
  {
    "id": "youyou",
    "word": "郁郁",
    "meaning": "形容色彩爛漫、香氣馥郁",
    "distractors": [
      "心情憂悶",
      "草木幽暗",
      "聲音低沉"
    ],
    "excerpt": "岸芷汀蘭，郁郁青青。"
  },
  {
    "id": "qingqing",
    "word": "青青",
    "meaning": "形容花葉茂盛",
    "distractors": [
      "顏色青黑",
      "年少青春",
      "天色清明"
    ],
    "excerpt": "岸芷汀蘭，郁郁青青。"
  },
  {
    "id": "yi",
    "word": "一",
    "meaning": "全部",
    "distractors": [
      "一個",
      "初次",
      "相同"
    ],
    "excerpt": "而或長煙一空，皓月千里，浮光躍金，靜影沉璧；"
  },
  {
    "id": "kong",
    "word": "空",
    "meaning": "消散",
    "distractors": [
      "空曠無物",
      "落空白費",
      "天空上方"
    ],
    "excerpt": "而或長煙一空，皓月千里，浮光躍金，靜影沉璧；"
  },
  {
    "id": "chong",
    "word": "寵",
    "meaning": "得寵",
    "distractors": [
      "寵愛他人",
      "珍視愛護",
      "嬌慣縱容"
    ],
    "excerpt": "登斯樓也，則有心曠神怡，寵辱皆忘，把酒臨風，其喜洋洋者矣。"
  },
  {
    "id": "ru",
    "word": "辱",
    "meaning": "受辱",
    "distractors": [
      "羞辱他人",
      "恥辱名聲",
      "污損玷辱"
    ],
    "excerpt": "登斯樓也，則有心曠神怡，寵辱皆忘，把酒臨風，其喜洋洋者矣。"
  },
  {
    "id": "ba",
    "word": "把",
    "meaning": "持",
    "distractors": [
      "把守看管",
      "把握掌控",
      "把玩欣賞"
    ],
    "excerpt": "登斯樓也，則有心曠神怡，寵辱皆忘，把酒臨風，其喜洋洋者矣。"
  },
  {
    "id": "lin",
    "word": "臨",
    "meaning": "對、迎",
    "distractors": [
      "接近將到",
      "親自巡視",
      "臨時暫且"
    ],
    "excerpt": "登斯樓也，則有心曠神怡，寵辱皆忘，把酒臨風，其喜洋洋者矣。"
  },
  {
    "id": "guren",
    "word": "古仁人之心",
    "meaning": "古代那些品德高尚、憂國憂民的賢人之心境",
    "distractors": [
      "古代仁人的文章",
      "古人追求仁德的方法",
      "古時仁人的名聲"
    ],
    "excerpt": "予嘗求古仁人之心，或異二者之為。"
  },
  {
    "id": "huo",
    "word": "或",
    "meaning": "或許",
    "distractors": [
      "有人",
      "有的",
      "或者"
    ],
    "excerpt": "予嘗求古仁人之心，或異二者之為。"
  },
  {
    "id": "yi-diff",
    "word": "異",
    "meaning": "不同",
    "distractors": [
      "奇異罕見",
      "驚異詫異",
      "變異改變"
    ],
    "excerpt": "予嘗求古仁人之心，或異二者之為。"
  },
  {
    "id": "erwei",
    "word": "二者之為",
    "meaning": "指因景色慘淡「感極而悲」和因景色秀美而「其喜洋洋」兩種表現",
    "distractors": [
      "兩人的作為",
      "兩種景物",
      "兩地風俗"
    ],
    "excerpt": "予嘗求古仁人之心，或異二者之為。"
  },
  {
    "id": "buyi",
    "word": "不以物喜，不以己悲",
    "meaning": "不因外物變化或一己際遇而悲喜",
    "distractors": [
      "不為外物而歡喜，只為自己悲傷",
      "不因外物得失而喜，卻因自身境遇而悲",
      "不為個人際遇而喜，只為外物變化而悲"
    ],
    "excerpt": "不以物喜，不以己悲。"
  },
  {
    "id": "miaotang",
    "word": "廟堂",
    "meaning": "朝廷",
    "distractors": [
      "祭祀祖先的廟宇",
      "讀書講學的學堂",
      "官員居住的殿堂"
    ],
    "excerpt": "居廟堂之高，則憂其民；"
  },
  {
    "id": "jianghu",
    "word": "江湖",
    "meaning": "民間或遠離朝廷的地方",
    "distractors": [
      "江河湖泊的景色",
      "行走四方的旅途",
      "隱士結社的幫派"
    ],
    "excerpt": "處江湖之遠，則憂其君。"
  },
  {
    "id": "wei",
    "word": "微",
    "meaning": "沒有",
    "distractors": [
      "細微渺小",
      "稍微略微",
      "幽微隱約"
    ],
    "excerpt": "微斯人，吾誰與歸！"
  },
  {
    "id": "si",
    "word": "斯",
    "meaning": "這",
    "distractors": [
      "如此這樣",
      "於是因而",
      "從此以後"
    ],
    "excerpt": "微斯人，吾誰與歸！"
  },
  {
    "id": "gui",
    "word": "歸",
    "meaning": "依歸",
    "distractors": [
      "回到故鄉",
      "歸還物品",
      "歸類合併"
    ],
    "excerpt": "微斯人，吾誰與歸！"
  }
];

export const YUEYANG_PILOT_META = {
  slug: "yueyang-lou-ji",
  title: "岳陽樓記",
  author: "范仲淹",
  contentVersion: "2026-08-pilot-1",
  questionCount: sourceTerms.length,
} as const;

const answerIndexFor = (termIndex: number) => (termIndex * 3 + 1) % 4;

const optionsFor = (term: SourceTerm, termIndex: number) => {
  const options = [...term.distractors];
  options.splice(answerIndexFor(termIndex), 0, term.meaning);
  return options;
};

export function getYueyangPilotLesson() {
  return {
    ...YUEYANG_PILOT_META,
    passages,
    terms: sourceTerms.map((term, termIndex) => ({
      id: term.id,
      word: term.word,
      excerpt: term.excerpt,
      options: optionsFor(term, termIndex),
    })),
  };
}

export function gradeYueyangPilotSelection(termId: string, selectedIndex: number) {
  const termIndex = sourceTerms.findIndex(term => term.id === termId);
  if (termIndex === -1 || !Number.isInteger(selectedIndex) || selectedIndex < 0 || selectedIndex > 3) {
    throw new Error("無效的《岳陽樓記》試行題目或選項。");
  }

  const term = sourceTerms[termIndex];
  const isCorrect = selectedIndex === answerIndexFor(termIndex);
  return {
    isCorrect,
    correctMeaning: isCorrect ? term.meaning : undefined,
  };
}

// 資料來源：教育局《魚我所欲也》官方原文及校本筆記「一、重點詞解」。
// 正確答案逐字保留筆記詞義；其餘三項只作語境辨義的干擾項。

export const lesson = {
  slug: 'yuwoyusuo',
  title: '魚我所欲也',
  author: '孟子',
  sourceLabel: '教育局《魚我所欲也》',
  sourceUrl: 'https://www.edb.gov.hk/attachment/tc/curriculum-development/kla/chi-edu/recommended-passages/ks4_04_text.pdf',
};

export const passages = [
  '孟子曰：「魚，我所欲也，熊掌，亦我所欲也；二者不可得兼，{{she|舍}}魚而取熊掌者也。生亦我所欲也，義亦我所欲也；二者不可得兼，舍生而取義者也。生亦我所欲，所欲有甚於生者，故{{gou,goude|不為苟得}}也；死亦我所{{wu|惡}}，所惡有甚於死者，故患有所不{{bi|辟}}也。如使人之所欲莫甚於生，則凡可以得生者，何不用也？使人之所惡莫甚於死者，則凡可以辟患者，何不為也？由是則生而有不用也，由是則可以辟患而有不為也，是故所欲有甚於生者，所惡有甚於死者。非獨賢者有是心也，人皆有之，賢者能勿喪耳。」',
  '一{{dan|簞}}食，一{{dou|豆}}{{geng|羹}}，得之則生，{{fu|弗}}得則死。{{hu,huer|嘑爾}}而與之，{{xingdaozhiren|行道之人}}{{fushou|弗受}}；{{cu|蹴}}爾而{{yu-give|與}}之，{{qiren|乞人}}{{buxie|不屑}}也。{{wanzhong,zhong|萬鍾}}則不{{bian|辯}}禮義而受之。{{hejia,jia|萬鍾於我何加}}焉？為宮室之美、妻妾之{{feng|奉}}、所識窮乏者{{de|得}}我{{yu-question|與}}？{{xiang|鄉}}為身死而不受，今為宮室之美為之；鄉為身死而不受，今為妻妾之奉為之；鄉為身死而不受，今為所識窮乏者得我而為之，是亦不可以{{yi|已}}乎？此之謂失其{{benxin|本心}}。」',
];

export const terms = [
  { id: 'she', word: '舍', meaning: '同「捨」，抛棄。', options: ['居住的房屋。', '停止、休息。', '同「捨」，抛棄。', '留置、安放。'], answer: 2, excerpt: '二者不可得兼，舍魚而取熊掌者也。' },
  { id: 'gou', word: '苟', meaning: '隨便、輕率。', options: ['暫且、姑且。', '隨便、輕率。', '只求利益。', '勉強取得。'], answer: 1, excerpt: '生亦我所欲，所欲有甚於生者，故不為苟得也；' },
  { id: 'goude', word: '不為苟得', meaning: '指苟且偷生。', options: ['勉強獲得。', '隨意取得。', '僥倖得到。', '指苟且偷生。'], answer: 3, excerpt: '生亦我所欲，所欲有甚於生者，故不為苟得也；' },
  { id: 'wu', word: '惡', meaning: '憎厭。', options: ['憎厭。', '醜惡、邪惡。', '惡劣、不好。', '責罵、斥責。'], answer: 0, excerpt: '死亦我所惡，所惡有甚於死者，故患有所不辟也。' },
  { id: 'bi', word: '辟', meaning: '同「避」，即逃避。', options: ['開闢、興建。', '排除、排斥。', '同「避」，即逃避。', '偏僻、隱蔽。'], answer: 2, excerpt: '死亦我所惡，所惡有甚於死者，故患有所不辟也。' },
  { id: 'dan', word: '簞', meaning: '盛器。', options: ['煮食的器具。', '盛器。', '盛酒的器皿。', '計量俸祿的器具。'], answer: 1, excerpt: '一簞食，一豆羹，得之則生，弗得則死。' },
  { id: 'dou', word: '豆', meaning: '盛食之器。', options: ['豆類植物。', '盛酒的器皿。', '食物羹湯。', '盛食之器。'], answer: 3, excerpt: '一簞食，一豆羹，得之則生，弗得則死。' },
  { id: 'geng', word: '羹', meaning: '指帶汁之肉。', options: ['指帶汁之肉。', '穀物煮成的粥。', '沒有湯汁的肉食。', '供祭祀的酒。'], answer: 0, excerpt: '一簞食，一豆羹，得之則生，弗得則死。' },
  { id: 'fu', word: '弗', meaning: '通「不」。', options: ['通「非」。', '通「否」。', '通「不」。', '表示已經發生。'], answer: 2, excerpt: '一簞食，一豆羹，得之則生，弗得則死。' },
  { id: 'hu', word: '嘑', meaning: '通「呼」。', options: ['通「乎」。', '通「呼」。', '通「號」。', '表示嘆息。'], answer: 1, excerpt: '嘑爾而與之，行道之人弗受；' },
  { id: 'huer', word: '嘑爾', meaning: '呼喝。', options: ['呼喚、招呼。', '輕聲詢問。', '大聲哭喊。', '呼喝。'], answer: 3, excerpt: '嘑爾而與之，行道之人弗受；' },
  { id: 'xingdaozhiren', word: '行道之人', meaning: '路人。', options: ['路人。', '行走正道的人。', '傳達命令的人。', '外出求學的人。'], answer: 0, excerpt: '嘑爾而與之，行道之人弗受；' },
  { id: 'fushou', word: '弗受', meaning: '不接受。', options: ['不給予。', '不忍受。', '不接受。', '不領會。'], answer: 2, excerpt: '嘑爾而與之，行道之人弗受；' },
  { id: 'cu', word: '蹴', meaning: '踐踏。', options: ['急步走近。', '踐踏。', '彎腰行禮。', '退讓、避開。'], answer: 1, excerpt: '蹴爾而與之，乞人不屑也。' },
  { id: 'yu-give', word: '與', meaning: '給予。', options: ['參與、加入。', '和、跟。', '贊同、稱許。', '給予。'], answer: 3, excerpt: '蹴爾而與之，乞人不屑也。' },
  { id: 'qiren', word: '乞人', meaning: '行乞之人。', options: ['行乞之人。', '請求他人的人。', '賣藝謀生的人。', '貧窮失業的人。'], answer: 0, excerpt: '蹴爾而與之，乞人不屑也。' },
  { id: 'buxie', word: '不屑', meaning: '輕視。', options: ['不願意、嫌棄。', '不值得計較。', '輕視。', '不忍心接受。'], answer: 2, excerpt: '蹴爾而與之，乞人不屑也。' },
  { id: 'wanzhong', word: '萬鍾', meaning: '這裏解作達官貴人豐厚的俸祿。', options: ['古代萬種金屬器具。', '這裏解作達官貴人豐厚的俸祿。', '極多數量的鐘聲。', '用作祭祀的音樂。'], answer: 1, excerpt: '萬鍾則不辯禮義而受之。' },
  { id: 'zhong', word: '鍾', meaning: '古代盛酒器，作量詞用，表示俸祿的數量。', options: ['古代計時用的樂器。', '盛食物的圓形器皿。', '表示時間的計量單位。', '古代盛酒器，作量詞用，表示俸祿的數量。'], answer: 3, excerpt: '萬鍾則不辯禮義而受之。' },
  { id: 'bian', word: '辯', meaning: '辨別。', options: ['辨別。', '爭辯、辯論。', '辯護、申訴。', '巧言善辯。'], answer: 0, excerpt: '萬鍾則不辯禮義而受之。' },
  { id: 'jia', word: '加', meaning: '增益。', options: ['加上、添加。', '施加、加諸。', '增益。', '超越、勝過。'], answer: 2, excerpt: '萬鍾於我何加焉？' },
  { id: 'hejia', word: '何加', meaning: '有何增益。', options: ['何處可加。', '有何增益。', '何以增加。', '何人加封。'], answer: 1, excerpt: '萬鍾於我何加焉？' },
  { id: 'feng', word: '奉', meaning: '侍奉。', options: ['奉獻、呈上。', '接受、奉行。', '供給、供養。', '侍奉。'], answer: 3, excerpt: '為宮室之美、妻妾之奉、所識窮乏者得我與？' },
  { id: 'de', word: '得', meaning: '通「德」，即恩德，這裏作動詞，解作「感激」。', options: ['通「德」，即恩德，這裏作動詞，解作「感激」。', '獲得、取得。', '得到、可以。', '合宜、得當。'], answer: 0, excerpt: '為宮室之美、妻妾之奉、所識窮乏者得我與？' },
  { id: 'yu-question', word: '與', meaning: '通「歟」，解作「嗎」。', options: ['通「予」，解作給予。', '通「餘」，解作剩下。', '通「歟」，解作「嗎」。', '連詞，解作和。'], answer: 2, excerpt: '為宮室之美、妻妾之奉、所識窮乏者得我與？' },
  { id: 'xiang', word: '鄉', meaning: '通「向」，解作過往、從前。', options: ['鄉里、家鄉。', '通「向」，解作過往、從前。', '面向、朝向。', '嚮往、崇尚。'], answer: 1, excerpt: '鄉為身死而不受，今為宮室之美為之；' },
  { id: 'yi', word: '已', meaning: '停止。', options: ['已經、既然。', '罷免、辭退。', '完成、結束。', '停止。'], answer: 3, excerpt: '是亦不可以已乎？' },
  { id: 'benxin', word: '本心', meaning: '即羞惡之心。', options: ['即羞惡之心。', '原來的志向。', '內心的欲望。', '善惡的判斷。'], answer: 0, excerpt: '此之謂失其本心。」' },
];

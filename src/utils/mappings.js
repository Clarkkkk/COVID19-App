// contains all countries in echarts world map
const nameMap = {
  'Afghanistan': '阿富汗',
  'Aland': '奥兰',
  'Albania': '阿尔巴尼亚',
  'Algeria': '阿尔及利亚',
  'American Samoa': '',
  'Andorra': '安道尔',
  'Angola': '安圭拉',
  'Antarctica': '南极洲',
  'Antigua and Barb.': '安提瓜和巴布达',
  'Argentina': '阿根廷',
  'Armenia': '亚美尼亚',
  'Australia': '澳大利亚',
  'Austria': '奥地利',
  'Azerbaijan': '阿塞拜疆',
  'Bahamas': '巴哈马',
  'Bahrain': '巴林',
  'Bangladesh': '孟加拉国',
  'Barbados': '巴巴多斯',
  'Belarus': '白俄罗斯',
  'Belgium': '比利时',
  'Belize': '伯利兹',
  'Benin': '贝宁',
  'Bermuda': '百慕大',
  'Bhutan': '不丹',
  'Bolivia': '玻利维亚',
  'Bosnia and Herz.': '波斯尼亚和黑塞哥维那',
  'Botswana': '博茨瓦纳',
  'Brazil': '巴西',
  'Br. Indian Ocean Ter.': '英屬印度洋領地',
  'Brunei': '文莱',
  'Bulgaria': '保加利亚',
  'Burkina Faso': '布基纳法索',
  'Burundi': '布隆迪',
  'Cambodia': '柬埔寨',
  'Cameroon': '喀麦隆',
  'Canada': '加拿大',
  'Cape Verde': '佛得角',
  'Cayman Is.': '开曼群岛',
  'Central African Rep.': '中非共和国',
  'Chad': '乍得',
  'Chile': '智利',
  'China': '中国',
  'Colombia': '哥伦比亚',
  'Comoros': '科摩罗',
  'Costa Rica': '哥斯达黎加',
  'Côte d\'Ivoire': '科特迪瓦',
  'Croatia': '克罗地亚',
  'Cuba': '古巴',
  'Curaçao': '库拉索岛',
  'Cyprus': '塞浦路斯',
  'Czech Rep.': '捷克共和国',
  'Dem. Rep. Congo': '刚果（金）',
  'Denmark': '丹麦',
  'Djibouti': '吉布提',
  'Dominica': '多米尼加',
  'Dominican Rep.': '多明尼加共和国',
  'Ecuador': '厄瓜多尔',
  'Egypt': '埃及',
  'El Salvador': '萨尔瓦多',
  'Eq. Guinea': '赤道几内亚',
  'Eritrea': '厄立特里亚',
  'Estonia': '爱沙尼亚',
  'Ethiopia': '埃塞俄比亚',
  'Falkland Is.': '福克兰群岛',
  'Faeroe Is.': '法罗群岛',
  'Fiji': '斐济',
  'Finland': '芬兰',
  'France': '法国',
  'French Guiana': '法属圭亚那',
  'Fr. S. Antarctic Lands': '法属南部和南极领地',
  'Fr. Polynesia': '',
  'Gabon': '加蓬',
  'Gambia': '冈比亚',
  'Gaza Strip': '加沙',
  'Georgia': '格鲁吉亚',
  'Germany': '德国',
  'Ghana': '加纳',
  'Greece': '希腊',
  'Greenland': '格陵兰',
  'Grenada': '格林那达',
  'Guadeloupe': '瓜德罗普',
  'Guam': '关岛',
  'Guatemala': '危地马拉',
  'Guinea': '几内亚',
  'Guinea-Bissau': '几内亚比绍',
  'Guyana': '圭亚那',
  'Haiti': '海地',
  'Heard I. and McDonald Is.': '赫德岛和麦克唐纳群岛',
  'Honduras': '洪都拉斯',
  'Hong Kong': '香港',
  'Hungary': '匈牙利',
  'Iceland': '冰岛',
  'India': '印度',
  'Indonesia': '印度尼西亚',
  'Iran': '伊朗',
  'Iraq': '伊拉克',
  'Iraq-Saudi Arabia Neutral Zone': '伊拉克阿拉伯中立区',
  'Ireland': '爱尔兰',
  'Isle of Man': '马恩岛',
  'Israel': '以色列',
  'Italy': '意大利',
  'Jamaica': '牙买加',
  'Jan Mayen': '扬马延岛',
  'Japan': '日本',
  'Jersey': '泽西',
  'Jordan': '约旦',
  'Kazakhstan': '哈萨克斯坦',
  'Kenya': '肯尼亚',
  'Kerguelen': '凯尔盖朗群岛',
  'Kiribati': '基里巴斯',
  'Dem. Rep. Korea': '朝鲜',
  'Korea': '韩国',
  'Kosovo': '科索沃',
  'Kuwait': '科威特',
  'Kyrgyzstan': '吉尔吉斯斯坦',
  'Lao PDR': '老挝',
  'Latvia': '拉脱维亚',
  'Lebanon': '黎巴嫩',
  'Lesotho': '莱索托',
  'Liberia': '利比里亚',
  'Libya': '利比亚',
  'Liechtenstein': '列支敦士登',
  'Lithuania': '立陶宛',
  'Luxembourg': '卢森堡',
  'Macau': '澳门',
  'Macedonia': '马其顿',
  'Madagascar': '马达加斯加',
  'Malawi': '马拉维',
  'Malaysia': '马来西亚',
  'Maldives': '马尔代夫',
  'Mali': '马里',
  'Malta': '马耳他',
  'Martinique': '马提尼克',
  'Mauritania': '毛里塔尼亚',
  'Mauritius': '毛里求斯',
  'Mexico': '墨西哥',
  'Micronesia': '密克罗尼西亚联邦',
  'Moldova': '摩尔多瓦',
  'Monaco': '摩纳哥',
  'Mongolia': '蒙古',
  'Montenegro': '黑山',
  'Montserrat': '蒙特塞拉特',
  'Morocco': '摩洛哥',
  'Mozambique': '莫桑比克',
  'Myanmar': '缅甸',
  'Namibia': '纳米比亚',
  'Nepal': '尼泊尔',
  'Netherlands': '荷兰',
  'New Caledonia': '新喀里多尼亚',
  'New Zealand': '新西兰',
  'Nicaragua': '尼加拉瓜',
  'Niger': '尼日尔',
  'Nigeria': '尼日利亚',
  'Niue': '',
  'N. Mariana Is.': '北马里亚纳群岛',
  'Norway': '挪威',
  'Oman': '阿曼',
  'Palau': '帕劳',
  'Palestine': '巴勒斯坦',
  'Pakistan': '巴基斯坦',
  'Panama': '巴拿马',
  'Papua New Guinea': '巴布亚新几内亚',
  'Paraguay': '巴拉圭',
  'Peru': '秘鲁',
  'Philippines': '菲律宾',
  'Poland': '波兰',
  'Portugal': '葡萄牙',
  'Puerto Rico': '波多黎各',
  'Qatar': '卡塔尔',
  'Serbia': '塞尔维亚',
  'Congo': '刚果（布）',
  'Reunion': '留尼旺',
  'Romania': '罗马尼亚',
  'Russia': '俄罗斯',
  'Rwanda': '卢旺达',
  'San Marino': '圣马力诺',
  'São Tomé and Principe': '圣多美和普林西比',
  'Saint Helena': '圣赫勒拿、阿森松和特里斯坦-达库尼亚',
  'Saudi Arabia': '沙特阿拉伯',
  'Senegal': '塞内加尔',
  'Seychelles': '塞舌尔',
  'S. Geo. and S. Sandw. Is.': '南乔治亚和南桑威奇群岛',
  'Siachen Glacier': '锡亚琴冰川',
  'Sierra Leone': '塞拉利昂',
  'Singapore': '新加坡',
  'Slovakia': '斯洛伐克',
  'Slovenia': '斯洛文尼亚',
  'Solomon Is.': '所罗门群岛',
  'Somalia': '索马里',
  'Somaliland': '索马里兰',
  'South Africa': '南非',
  'S. Sudan': '南苏丹',
  'Spain': '西班牙',
  'Sri Lanka': '斯里兰卡',
  'St. Christopher-Nevis': '圣其茨和尼维斯',
  'Saint Lucia': '圣卢西亚',
  'St. Pierre and Miquelon': '圣皮埃尔和密克隆',
  'St. Vin. and Gren.': '圣文森特和格林纳丁斯',
  'Sudan': '苏丹',
  'Suriname': '苏里南',
  'Svalbard': '斯瓦尔巴和扬马延',
  'Swaziland': '斯威士兰',
  'Sweden': '瑞典',
  'Switzerland': '瑞士',
  'Syria': '叙利亚',
  'Taiwan': '台湾',
  'Tajikistan': '塔吉克斯坦',
  'Tanzania': '坦桑尼亚',
  'Thailand': '泰国',
  'Timor-Leste': '东帝汶',
  'Togo': '多哥',
  'Tonga': '汤加',
  'Trinidad and Tobago': '特立尼达和多巴哥',
  'Tunisia': '突尼斯',
  'Turkey': '土耳其',
  'Turkmenistan': '土库曼斯坦',
  'Turks and Caicos Is.': '特克斯和凯科斯群岛',
  'Uganda': '乌干达',
  'Ukraine': '乌克兰',
  'United Arab Emirates': '阿联酋',
  'United Kingdom': '英国',
  'United States': '美国',
  'U.S. Virgin Is.': '美属维尔京群岛',
  'Uruguay': '乌拉圭',
  'Uzbekistan': '乌兹别克斯坦',
  'Vanuatu': '瓦努阿图',
  'Venezuela': '委内瑞拉',
  'Vietnam': '越南',
  'W. Sahara': '西撒哈拉',
  'Samoa': '萨摩亚',
  'Yemen': '也门',
  'Yugoslavia': '南斯拉夫',
  'Zambia': '赞比亚',
  'Zimbabwe': '津巴布韦'
};

// iso 3166-1 country code to the country name in echarts map
const isoCountryToEchartsName = {
  AF: '阿富汗',
  AL: '阿尔巴尼亚',
  DZ: '阿尔及利亚',
  AD: '安道尔',
  AO: '安圭拉',
  AG: '安提瓜和巴布达',
  AR: '阿根廷',
  AM: '亚美尼亚',
  AT: '奥地利',
  AZ: '阿塞拜疆',
  BS: '巴哈马',
  BH: '巴林',
  BD: '孟加拉国',
  BB: '巴巴多斯',
  BY: '白俄罗斯',
  BE: '比利时',
  BZ: '伯利兹',
  BJ: '贝宁',
  BT: '不丹',
  BO: '玻利维亚',
  BA: '波斯尼亚和黑塞哥维那',
  BW: '博茨瓦纳',
  BR: '巴西',
  BN: '文莱',
  BG: '保加利亚',
  BF: '布基纳法索',
  MM: '缅甸',
  BI: '布隆迪',
  CV: '佛得角',
  KH: '柬埔寨',
  CM: '喀麦隆',
  CF: '中非共和国',
  TD: '乍得',
  CL: '智利',
  CO: '哥伦比亚',
  CG: '刚果（布）',
  CD: '刚果（金）',
  KM: '科摩罗',
  CR: '哥斯达黎加',
  CI: '科特迪瓦',
  HR: '克罗地亚',
  CU: '古巴',
  CY: '塞浦路斯',
  CZ: '捷克共和国',
  DK: '丹麦',
  DJ: '吉布提',
  DM: '多米尼加',
  DO: '多明尼加共和国',
  EC: '厄瓜多尔',
  EG: '埃及',
  SV: '萨尔瓦多',
  GQ: '赤道几内亚',
  ER: '厄立特里亚',
  EE: '爱沙尼亚',
  SZ: '斯威士兰',
  ET: '埃塞俄比亚',
  FJ: '斐济',
  FI: '芬兰',
  FR: '法国',
  GA: '加蓬',
  GM: '冈比亚',
  GE: '格鲁吉亚',
  DE: '德国',
  GH: '加纳',
  GR: '希腊',
  GD: '格林那达',
  GL: '格陵兰',
  GT: '危地马拉',
  GN: '几内亚',
  GW: '几内亚比绍',
  GY: '圭亚那',
  HT: '海地',
  VA: undefined,
  HN: '洪都拉斯',
  HU: '匈牙利',
  IS: '冰岛',
  IN: '印度',
  ID: '印度尼西亚',
  IR: '伊朗',
  IQ: '伊拉克',
  IE: '爱尔兰',
  IL: '以色列',
  IT: '意大利',
  JM: '牙买加',
  JP: '日本',
  JO: '约旦',
  KZ: '哈萨克斯坦',
  KE: '肯尼亚',
  KR: '韩国',
  XK: '科索沃',
  KW: '科威特',
  KG: '吉尔吉斯斯坦',
  LA: '老挝',
  LV: '拉脱维亚',
  LB: '黎巴嫩',
  LS: '莱索托',
  LR: '利比里亚',
  LY: '利比亚',
  LI: '列支敦士登',
  LT: '立陶宛',
  LU: '卢森堡',
  MG: '马达加斯加',
  MW: '马拉维',
  MY: '马来西亚',
  MV: '马尔代夫',
  ML: '马里',
  MT: '马耳他',
  MH: undefined,
  MR: '毛里塔尼亚',
  MU: '毛里求斯',
  MX: '墨西哥',
  FM: '密克罗尼西亚联邦',
  MD: '摩尔多瓦',
  MC: '摩纳哥',
  MN: '蒙古',
  ME: '黑山',
  MA: '摩洛哥',
  MZ: '莫桑比克',
  NA: '纳米比亚',
  NP: '尼泊尔',
  NL: '荷兰',
  NZ: '新西兰',
  NI: '尼加拉瓜',
  NE: '尼日尔',
  NG: '尼日利亚',
  MK: '马其顿',
  NO: '挪威',
  OM: '阿曼',
  PK: '巴基斯坦',
  PW: '帕劳',
  PA: '巴拿马',
  PG: '巴布亚新几内亚',
  PY: '巴拉圭',
  PE: '秘鲁',
  PH: '菲律宾',
  PL: '波兰',
  PT: '葡萄牙',
  QA: '卡塔尔',
  RO: '罗马尼亚',
  RU: '俄罗斯',
  RW: '卢旺达',
  KN: '圣其茨和尼维斯',
  LC: '圣卢西亚',
  VC: '圣文森特和格林纳丁斯',
  WS: '萨摩亚',
  SM: '圣马力诺',
  ST: '圣多美和普林西比',
  SA: '沙特阿拉伯',
  SN: '塞内加尔',
  RS: '塞尔维亚',
  SC: '塞舌尔',
  SL: '塞拉利昂',
  SG: '新加坡',
  SK: '斯洛伐克',
  SI: '斯洛文尼亚',
  SB: '所罗门群岛',
  SO: '索马里',
  ZA: '南非',
  SS: '南苏丹',
  ES: '西班牙',
  LK: '斯里兰卡',
  SD: '苏丹',
  SR: '苏里南',
  SE: '瑞典',
  CH: '瑞士',
  SY: '叙利亚',
  TW: '台湾',
  TJ: '塔吉克斯坦',
  TZ: '坦桑尼亚',
  TH: '泰国',
  TL: '东帝汶',
  TG: '多哥',
  TT: '特立尼达和多巴哥',
  TN: '突尼斯',
  TR: '土耳其',
  UG: '乌干达',
  UA: '乌克兰',
  AE: '阿联酋',
  GB: '英国',
  UY: '乌拉圭',
  UZ: '乌兹别克斯坦',
  VU: '瓦努阿图',
  VE: '委内瑞拉',
  VN: '越南',
  PS: '巴勒斯坦',
  EH: '西撒哈拉',
  YE: '也门',
  ZM: '赞比亚',
  ZW: '津巴布韦',
  AU: '澳大利亚',
  CA: '加拿大',
  CN: '中国',
  US: '美国'
};

const echartsNameToIsoCountry = {
  '阿富汗': 'AF',
  '阿尔巴尼亚': 'AL',
  '阿尔及利亚': 'DZ',
  '安道尔': 'AD',
  '安圭拉': 'AO',
  '安提瓜和巴布达': 'AG',
  '阿根廷': 'AR',
  '亚美尼亚': 'AM',
  '奥地利': 'AT',
  '阿塞拜疆': 'AZ',
  '巴哈马': 'BS',
  '巴林': 'BH',
  '孟加拉国': 'BD',
  '巴巴多斯': 'BB',
  '白俄罗斯': 'BY',
  '比利时': 'BE',
  '伯利兹': 'BZ',
  '贝宁': 'BJ',
  '不丹': 'BT',
  '玻利维亚': 'BO',
  '波斯尼亚和黑塞哥维那': 'BA',
  '博茨瓦纳': 'BW',
  '巴西': 'BR',
  '文莱': 'BN',
  '保加利亚': 'BG',
  '布基纳法索': 'BF',
  '缅甸': 'MM',
  '布隆迪': 'BI',
  '佛得角': 'CV',
  '柬埔寨': 'KH',
  '喀麦隆': 'CM',
  '中非共和国': 'CF',
  '乍得': 'TD',
  '智利': 'CL',
  '哥伦比亚': 'CO',
  '刚果（布）': 'CG',
  '刚果（金）': 'CD',
  '科摩罗': 'KM',
  '哥斯达黎加': 'CR',
  '科特迪瓦': 'CI',
  '克罗地亚': 'HR',
  '古巴': 'CU',
  '塞浦路斯': 'CY',
  '捷克共和国': 'CZ',
  '丹麦': 'DK',
  '吉布提': 'DJ',
  '多米尼加': 'DM',
  '多明尼加共和国': 'DO',
  '厄瓜多尔': 'EC',
  '埃及': 'EG',
  '萨尔瓦多': 'SV',
  '赤道几内亚': 'GQ',
  '厄立特里亚': 'ER',
  '爱沙尼亚': 'EE',
  '斯威士兰': 'SZ',
  '埃塞俄比亚': 'ET',
  '斐济': 'FJ',
  '芬兰': 'FI',
  '法国': 'FR',
  '加蓬': 'GA',
  '冈比亚': 'GM',
  '格鲁吉亚': 'GE',
  '德国': 'DE',
  '加纳': 'GH',
  '希腊': 'GR',
  '格林那达': 'GD',
  '格陵兰': 'GL',
  '危地马拉': 'GT',
  '几内亚': 'GN',
  '几内亚比绍': 'GW',
  '圭亚那': 'GY',
  '海地': 'HT',
  '洪都拉斯': 'HN',
  '匈牙利': 'HU',
  '冰岛': 'IS',
  '印度': 'IN',
  '印度尼西亚': 'ID',
  '伊朗': 'IR',
  '伊拉克': 'IQ',
  '爱尔兰': 'IE',
  '以色列': 'IL',
  '意大利': 'IT',
  '牙买加': 'JM',
  '日本': 'JP',
  '约旦': 'JO',
  '哈萨克斯坦': 'KZ',
  '肯尼亚': 'KE',
  '韩国': 'KR',
  '科索沃': 'XK',
  '科威特': 'KW',
  '吉尔吉斯斯坦': 'KG',
  '老挝': 'LA',
  '拉脱维亚': 'LV',
  '黎巴嫩': 'LB',
  '莱索托': 'LS',
  '利比里亚': 'LR',
  '利比亚': 'LY',
  '列支敦士登': 'LI',
  '立陶宛': 'LT',
  '卢森堡': 'LU',
  '马达加斯加': 'MG',
  '马拉维': 'MW',
  '马来西亚': 'MY',
  '马尔代夫': 'MV',
  '马里': 'ML',
  '马耳他': 'MT',
  '毛里塔尼亚': 'MR',
  '毛里求斯': 'MU',
  '墨西哥': 'MX',
  '密克罗尼西亚联邦': 'FM',
  '摩尔多瓦': 'MD',
  '摩纳哥': 'MC',
  '蒙古': 'MN',
  '黑山': 'ME',
  '摩洛哥': 'MA',
  '莫桑比克': 'MZ',
  '纳米比亚': 'NA',
  '尼泊尔': 'NP',
  '荷兰': 'NL',
  '新西兰': 'NZ',
  '尼加拉瓜': 'NI',
  '尼日尔': 'NE',
  '尼日利亚': 'NG',
  '马其顿': 'MK',
  '挪威': 'NO',
  '阿曼': 'OM',
  '巴基斯坦': 'PK',
  '帕劳': 'PW',
  '巴拿马': 'PA',
  '巴布亚新几内亚': 'PG',
  '巴拉圭': 'PY',
  '秘鲁': 'PE',
  '菲律宾': 'PH',
  '波兰': 'PL',
  '葡萄牙': 'PT',
  '卡塔尔': 'QA',
  '罗马尼亚': 'RO',
  '俄罗斯': 'RU',
  '卢旺达': 'RW',
  '圣其茨和尼维斯': 'KN',
  '圣卢西亚': 'LC',
  '圣文森特和格林纳丁斯': 'VC',
  '萨摩亚': 'WS',
  '圣马力诺': 'SM',
  '圣多美和普林西比': 'ST',
  '沙特阿拉伯': 'SA',
  '塞内加尔': 'SN',
  '塞尔维亚': 'RS',
  '塞舌尔': 'SC',
  '塞拉利昂': 'SL',
  '新加坡': 'SG',
  '斯洛伐克': 'SK',
  '斯洛文尼亚': 'SI',
  '所罗门群岛': 'SB',
  '索马里': 'SO',
  '南非': 'ZA',
  '南苏丹': 'SS',
  '西班牙': 'ES',
  '斯里兰卡': 'LK',
  '苏丹': 'SD',
  '苏里南': 'SR',
  '瑞典': 'SE',
  '瑞士': 'CH',
  '叙利亚': 'SY',
  '台湾': 'TW',
  '塔吉克斯坦': 'TJ',
  '坦桑尼亚': 'TZ',
  '泰国': 'TH',
  '东帝汶': 'TL',
  '多哥': 'TG',
  '特立尼达和多巴哥': 'TT',
  '突尼斯': 'TN',
  '土耳其': 'TR',
  '乌干达': 'UG',
  '乌克兰': 'UA',
  '阿联酋': 'AE',
  '英国': 'GB',
  '乌拉圭': 'UY',
  '乌兹别克斯坦': 'UZ',
  '瓦努阿图': 'VU',
  '委内瑞拉': 'VE',
  '越南': 'VN',
  '巴勒斯坦': 'PS',
  '西撒哈拉': 'EH',
  '也门': 'YE',
  '赞比亚': 'ZM',
  '津巴布韦': 'ZW',
  '澳大利亚': 'AU',
  '加拿大': 'CA',
  '中国': 'CN',
  '美国': 'US',
  '世界': 'WORLD'
};

// iso 3166-2 province code to the country name in echarts map
const isoProvinceToEchartsName = {
  'CN-AH': '安徽',
  'CN-BJ': '北京',
  'CN-CQ': '重庆',
  'CN-FJ': '福建',
  'CN-GD': '广东',
  'CN-GS': '甘肃',
  'CN-GX': '广西',
  'CN-GZ': '贵州',
  'CN-HA': '河南',
  'CN-HB': '湖北',
  'CN-HE': '河北',
  'CN-HI': '海南',
  'CN-HK': '香港',
  'CN-HL': '黑龙江',
  'CN-HN': '湖南',
  'CN-JL': '吉林',
  'CN-JS': '江苏',
  'CN-JX': '江西',
  'CN-LN': '辽宁',
  'CN-MO': '澳门',
  'CN-NM': '内蒙古',
  'CN-NX': '宁夏',
  'CN-QH': '青海',
  'CN-SC': '四川',
  'CN-SD': '山东',
  'CN-SH': '上海',
  'CN-SN': '陕西',
  'CN-SX': '山西',
  'CN-TJ': '天津',
  'CN-TW': '台湾',
  'CN-XJ': '新疆',
  'CN-XZ': '西藏',
  'CN-YN': '云南',
  'CN-ZJ': '浙江'
};

const countryPopulation = {
  '阿富汗': 38928341,
  '阿尔巴尼亚': 2877800,
  '阿尔及利亚': 43851043,
  '安道尔': 77265,
  '安圭拉': 32866268,
  '安提瓜和巴布达': 97928,
  '阿根廷': 45195777,
  '亚美尼亚': 2963234,
  '奥地利': 9006400,
  '阿塞拜疆': 10139175,
  '巴哈马': 393248,
  '巴林': 1701583,
  '孟加拉国': 164689383,
  '巴巴多斯': 287371,
  '白俄罗斯': 9449321,
  '比利时': 11589616,
  '伯利兹': 397621,
  '贝宁': 12123198,
  '不丹': 771612,
  '玻利维亚': 11673029,
  '波斯尼亚和黑塞哥维那': 3280815,
  '博茨瓦纳': 2351625,
  '巴西': 212559409,
  '文莱': 437483,
  '保加利亚': 6948445,
  '布基纳法索': 20903278,
  '缅甸': 54409794,
  '布隆迪': 11890781,
  '佛得角': 555988,
  '柬埔寨': 16718971,
  '喀麦隆': 26545864,
  '中非共和国': 4829764,
  '乍得': 16425859,
  '智利': 19116209,
  '哥伦比亚': 50882884,
  '刚果（布）': 5518092,
  '刚果（金）': 89561404,
  '科摩罗': 869595,
  '哥斯达黎加': 5094114,
  '科特迪瓦': 26378275,
  '克罗地亚': 4105268,
  '古巴': 11326616,
  '塞浦路斯': 1207361,
  '捷克共和国': 10708982,
  '丹麦': 5792203,
  '吉布提': 988002,
  '多米尼加': 71991,
  '多明尼加共和国': 10847904,
  '厄瓜多尔': 17643060,
  '埃及': 102334403,
  '萨尔瓦多': 6486201,
  '赤道几内亚': 1402985,
  '厄立特里亚': 3546427,
  '爱沙尼亚': 1326539,
  '斯威士兰': 1160164,
  '埃塞俄比亚': 114963583,
  '斐济': 896444,
  '芬兰': 5540718,
  '法国': 65273512,
  '加蓬': 2225728,
  '冈比亚': 2416664,
  '格鲁吉亚': 3989175,
  '德国': 83783945,
  '加纳': 31072945,
  '希腊': 10423056,
  '格林那达': 112519,
  '危地马拉': 17915567,
  '几内亚': 13132792,
  '几内亚比绍': 1967998,
  '圭亚那': 786559,
  '海地': 11402533,
  '洪都拉斯': 9904608,
  '匈牙利': 9660350,
  '冰岛': 341250,
  '印度': 1380004385,
  '印度尼西亚': 273523621,
  '伊朗': 83992953,
  '伊拉克': 40222503,
  '爱尔兰': 4937796,
  '以色列': 8655541,
  '意大利': 60461828,
  '牙买加': 2961161,
  '日本': 126476458,
  '约旦': 10203140,
  '哈萨克斯坦': 18776707,
  '肯尼亚': 53771300,
  '韩国': 51269183,
  '科索沃': 1810366,
  '科威特': 4270563,
  '吉尔吉斯斯坦': 6524191,
  '老挝': 7275556,
  '拉脱维亚': 1886202,
  '黎巴嫩': 6825442,
  '莱索托': 2142252,
  '利比里亚': 5057677,
  '利比亚': 6871287,
  '列支敦士登': 38137,
  '立陶宛': 2722291,
  '卢森堡': 625976,
  '马达加斯加': 27691019,
  '马拉维': 19129955,
  '马来西亚': 32365998,
  '马尔代夫': 540542,
  '马里': 20250834,
  '马耳他': 441539,
  '毛里塔尼亚': 4649660,
  '毛里求斯': 1271767,
  '墨西哥': 127792286,
  '密克罗尼西亚联邦': 113815,
  '摩尔多瓦': 4033963,
  '摩纳哥': 39244,
  '蒙古': 3278292,
  '黑山': 628062,
  '摩洛哥': 36910558,
  '莫桑比克': 31255435,
  '纳米比亚': 2540916,
  '尼泊尔': 29136808,
  '荷兰': 17134873,
  '新西兰': 4822233,
  '尼加拉瓜': 6624554,
  '尼日尔': 24206636,
  '尼日利亚': 206139587,
  '马其顿': 2083380,
  '挪威': 5421242,
  '阿曼': 5106622,
  '巴基斯坦': 220892331,
  '帕劳': 18008,
  '巴拿马': 4314768,
  '巴布亚新几内亚': 8947027,
  '巴拉圭': 7132530,
  '秘鲁': 32971846,
  '菲律宾': 109581085,
  '波兰': 37846605,
  '葡萄牙': 10196707,
  '卡塔尔': 2881060,
  '罗马尼亚': 19237682,
  '俄罗斯': 145934460,
  '卢旺达': 12952209,
  '圣其茨和尼维斯': 53192,
  '圣卢西亚': 183629,
  '圣文森特和格林纳丁斯': 110947,
  '萨摩亚': 196130,
  '圣马力诺': 33938,
  '圣多美和普林西比': 219161,
  '沙特阿拉伯': 34813867,
  '塞内加尔': 16743930,
  '塞尔维亚': 8737370,
  '塞舌尔': 98340,
  '塞拉利昂': 7976985,
  '新加坡': 5850343,
  '斯洛伐克': 5459643,
  '斯洛文尼亚': 2078932,
  '所罗门群岛': 652858,
  '索马里': 15893219,
  '南非': 59308690,
  '南苏丹': 11193729,
  '西班牙': 46754783,
  '斯里兰卡': 21413250,
  '苏丹': 43849269,
  '苏里南': 586634,
  '瑞典': 10099270,
  '瑞士': 8654618,
  '叙利亚': 17500657,
  '塔吉克斯坦': 9537642,
  '坦桑尼亚': 59734213,
  '泰国': 69799978,
  '东帝汶': 1318442,
  '多哥': 8278737,
  '特立尼达和多巴哥': 1399491,
  '突尼斯': 11818618,
  '土耳其': 84339067,
  '乌干达': 45741000,
  '乌克兰': 43733759,
  '阿联酋': 9890400,
  '英国': 67886004,
  '乌拉圭': 3473727,
  '乌兹别克斯坦': 33469199,
  '瓦努阿图': 292680,
  '委内瑞拉': 28435943,
  '越南': 97338583,
  '巴勒斯坦': 5101416,
  '西撒哈拉': 597330,
  '也门': 29825968,
  '赞比亚': 18383956,
  '津巴布韦': 14862927,
  '澳大利亚': 25459700,
  '加拿大': 37855702,
  '中国': 1404676330,
  '美国': 329466283
};

const provincePopulation = {
  '安徽': 63240000,
  '北京': 21540000,
  '重庆': 31020000,
  '福建': 39410000,
  '甘肃': 26370000,
  '广东': 113460000,
  '广西': 49260000,
  '贵州': 36000000,
  '海南': 9340000,
  '河北': 75560000,
  '黑龙江': 37730000,
  '河南': 96050000,
  '湖北': 59170000,
  '湖南': 68990000,
  '内蒙古': 25340000,
  '江苏': 80510000,
  '江西': 46480000,
  '吉林': 27040000,
  '辽宁': 43590000,
  '宁夏': 6880000,
  '青海': 6030000,
  '陕西': 38640000,
  '山东': 100470000,
  '上海': 24240000,
  '山西': 37180000,
  '四川': 83410000,
  '天津': 15600000,
  '西藏': 3440000,
  '台湾': 23816775,
  '新疆': 24870000,
  '云南': 48300000,
  '浙江': 57370000,
  '香港': 7496988,
  '澳门': 649342
};

export {
  nameMap,
  isoCountryToEchartsName,
  echartsNameToIsoCountry,
  isoProvinceToEchartsName,
  countryPopulation,
  provincePopulation
};

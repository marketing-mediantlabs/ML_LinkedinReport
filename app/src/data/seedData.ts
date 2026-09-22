import type { LocRow, TopPost, CompRow, AdSetRow } from '../types';

/**
 * Baseline history from the LinkedIn exports and PDF reports covering
 * Apr 2025 - Jul 2026. Uploads merge on top of this; it is never wiped.
 */

export const MONTHS: string[] = ['Sep 26'];
export const F_TOT: number[] = [110];
/** Index of the first 2026 month, used to colour the bars by year. */
export const F_YEAR_SPLIT = 0;
/** Trailing partial month gets the orange treatment. */
export const F_PARTIAL_INDEX = -1;

export const F_SEN_L: string[] = [];
export const F_SEN_D: number[] = [];
export const F_CS_L: string[] = [];
export const F_CS_D: number[] = [];

export const F_LOC: LocRow[] = [];

export const V_MONTHS = ['Jul 25','Aug 25','Sep 25','Oct 25','Nov 25','Dec 25','Jan 26','Feb 26','Mar 26','Apr 26','May 26','Jun 26','Jul 26'];
export const V_PV = [556,716,1127,836,996,544,660,638,852,1404,1137,1028,596];
export const V_UV = [214,280,393,326,404,214,243,235,328,472,466,343,184];

export const V_IND_L = ['IT Services & IT Consulting','E-Learning Providers','Software Development','Technology & Internet','Education','Design Services','Graphic Design','Animation & Post-prod.','HR Services','Edu Admin Programs'];
export const V_IND_D = [4962,3329,1507,1217,643,610,458,438,334,320];
export const V_JOB_L = ['Arts & Design','Education','Engineering','Human Resources','IT','Business Dev','Media & Comm.','Operations','Marketing','Project Mgmt'];
export const V_JOB_D = [2340,2009,1790,1269,1208,887,707,555,546,461];
export const V_SEN_L = ['Senior','Entry','Manager','Training','Director','CXO','VP','Owner'];
export const V_SEN_D = [5785,5659,938,797,413,234,179,178];
export const V_CS_L = ['51–200','10,001+','11–50','1,001–5K','501–1K','201–500','2–10','5K–10K'];
export const V_CS_D = [3158,2796,1968,1659,1449,1086,757,581];

export const V_LOC: LocRow[] = [
  { l: 'Greater Chennai Area, India', v: 8984, p: 52.5 },
  { l: 'Greater Bengaluru Area, India', v: 2322, p: 13.6 },
  { l: 'Greater Delhi Area, India', v: 1010, p: 5.9 },
  { l: 'Greater Hyderabad Area, India', v: 885, p: 5.2 },
  { l: 'Mumbai Metropolitan Region, India', v: 524, p: 3.1 },
  { l: 'Pune/Pimpri-Chinchwad Area, India', v: 497, p: 2.9 },
  { l: 'Greater Coimbatore Area, India', v: 381, p: 2.2 },
  { l: 'Greater Madurai Area, India', v: 226, p: 1.3 },
  { l: 'Noida, India', v: 201, p: 1.2 },
  { l: 'Greater Kolkata Area, India', v: 199, p: 1.2 },
  { l: 'Austin, Texas Metropolitan Area', v: 195, p: 1.1 },
  { l: 'Tiruvallur, India', v: 151, p: 0.9 },
  { l: 'Siliguri, India', v: 105, p: 0.6 },
  { l: 'Tiruchirappalli, India', v: 103, p: 0.6 },
  { l: 'Kochi, India', v: 97, p: 0.6 },
];

export const C_MONTHS = ['Jun 25','Jul 25','Aug 25','Sep 25','Oct 25','Nov 25','Dec 25','Jan 26','Feb 26','Mar 26','Apr 26','May 26','Jun 26','Jul 26'];
export const C_IMP = [4165,3711,3436,8039,23564,11221,5792,19061,17664,43580,75799,36526,15266,8992];
export const C_ENG = [575,321,279,1091,994,687,484,1999,1747,1288,1317,1702,1239,808];

export const PC_MONTHS = ['Aug 25','Sep 25','Oct 25','Nov 25','Dec 25','Jan 26','Feb 26','Mar 26','Apr 26','May 26','Jun 26','Jul 26'];
export const PC_COUNT = [2,3,9,3,2,12,16,11,23,18,15,8];

export const C_POST_TYPE_L = ['Welcome aboard','Thought Leadership','Employer Branding','Wishes','Employee Milestone','Job Opening'];
export const C_POST_ENG_R = [8.6,7.4,14.1,12.7,12.6,10.2];
export const C_POST_IMP = [29245,28736,17982,11671,11007,4407];

export const STACK_MONTHS = ['Jun25','Jul25','Aug25','Sep25','Oct25','Nov25','Dec25','Jan26','Feb26','Mar26','Apr26','May26'];
export const STACK_VIDEO = [1608,1796,1802,5019,5555,0,2027,4841,0,2394,0,2053];
export const STACK_IMGTXT = [5046,3823,917,4290,9019,10405,2764,16417,16561,9670,13928,12671];
export const STACK_ARTICLE = [0,0,0,0,0,0,0,0,0,0,1760,581];

export const MEDIA_L = ['Video','Image','Text','Article'];
export const MEDIA_AVG_IMPR = [1693,1453,1038,541];
export const MEDIA_ENG_RATE = [13.02,10.7,4.9,5.51];
export const MEDIA_COUNT = [16,39,21,5];
export const MEDIA_TOTAL_IMPR = [27095,56704,21804,2706];

export const TOP_POSTS: TopPost[] = [
  { date: '3/13/2025', type: 'Employer Branding', media: 'Image', impr: 3802, eng: 519, react: 188 },
  { date: '9/8/2025', type: 'Employer Branding', media: 'Video', impr: 3430, eng: 583, react: 72 },
  { date: '4/4/2025', type: 'Employer Branding', media: 'Image', impr: 3414, eng: 361, react: 117 },
  { date: '1/23/2026', type: 'Thought Leadership', media: 'Text', impr: 4718, eng: 47, react: 15 },
  { date: '10/19/2025', type: 'Wishes', media: 'Video', impr: 2085, eng: 109, react: 45 },
  { date: '1/27/2026', type: 'Welcome aboard', media: 'Image', impr: 2251, eng: 242, react: 49 },
  { date: '6/23/2025', type: 'Wishes', media: 'Image', impr: 1867, eng: 452, react: 42 },
  { date: '1/30/2026', type: 'Employer Branding', media: 'Video', impr: 1820, eng: 403, react: 64 },
  { date: '2/5/2026', type: 'Employee Milestone', media: 'Image', impr: 1999, eng: 204, react: 78 },
  { date: '11/5/2025', type: 'Welcome aboard', media: 'Image', impr: 1807, eng: 170, react: 84 },
];

export const COMP: CompRow[] = [
  { n: 'Novac Technology', f: 55729, p: 228, c: 103, r: 21809 },
  { n: 'GP Strategies', f: 51111, p: 327, c: 266, r: 9465 },
  { n: 'Infopro Learning', f: 14367, p: 424, c: 220, r: 7048 },
  { n: 'SweetRush', f: 6774, p: 289, c: 265, r: 4445 },
  { n: 'Mediant Labs ✦', f: 3371, p: 139, c: 233, r: 4670, highlight: true },
  { n: 'ELB Learning', f: 2754, p: 431, c: 238, r: 3554 },
  { n: 'Upside Learning', f: 1015, p: 237, c: 65, r: 2912 },
  { n: 'Learning Tech Group', f: 814, p: 0, c: 0, r: 0 },
  { n: 'Apposite', f: 727, p: 376, c: 228, r: 4547 },
  { n: 'Evo11ve.ai', f: 379, p: 57, c: 10, r: 147 },
];

export const ADS_CAMP = ['Pilot Oct 25','ML Boost Video','HASQ TOF Apr 26','HASQ MOF May 26','Boost May 26'];
export const ADS_SPEND = [100,149.55,499.97,699.98,150];
export const ADS_IMPR = [11349,79406,7344,12270,5766];
export const ADS_COLORS = ['rgba(139,147,176,.8)','rgba(155,89,182,.8)','rgba(33,168,102,.8)','rgba(33,137,189,.8)','rgba(224,123,42,.8)'];
export const ADS_BORDER = ['#8b93b0','#9b59b6','#21a866','#2189bd','#e07b2a'];

export const AD_SETS: AdSetRow[] = [
  { rank: 1, camp: 'ML-HASQ-MOF-May 2026', set: 'Set 02', obj: 'Website visits', period: 'May 1–8, 26', spend: '$527.37', impr: '9,569', clicks: '41', ctr: '0.428%', cpm: '$55.11', cpc: '$12.86', top: true },
  { rank: 2, camp: 'ML-HASQ-TOF-April 2026', set: 'Set 02', obj: 'Website visits', period: 'Apr 24–30, 26', spend: '$258.90', impr: '3,836', clicks: '11', ctr: '0.287%', cpm: '$67.49', cpc: '$23.54' },
  { rank: 3, camp: 'ML-HASQ-TOF-April 2026', set: 'Set 01', obj: 'Website visits', period: 'Apr 24–30, 26', spend: '$241.07', impr: '3,508', clicks: '10', ctr: '0.285%', cpm: '$68.72', cpc: '$24.11' },
  { rank: 4, camp: 'ML-HASQ-MOF-May 2026', set: 'Set 01', obj: 'Website visits', period: 'May 1–8, 26', spend: '$172.61', impr: '2,701', clicks: '7', ctr: '0.259%', cpm: '$63.90', cpc: '$24.66' },
  { rank: 5, camp: 'ML_Boost Post Campaign', set: 'Video Brand Awareness', obj: 'Brand awareness', period: 'Mar 30–Apr 3, 26', spend: '$149.55', impr: '79,406', clicks: '6', ctr: '0.008%', cpm: '$1.88', cpc: '$24.93', bigImpr: true, bestCpm: true },
  { rank: 6, camp: 'ML-Boost May 2026', set: 'Part 4', obj: 'Brand awareness', period: 'May 11–13, 26', spend: '$50.00', impr: '1,988', clicks: '2', ctr: '0.101%', cpm: '$25.16', cpc: '$25.00' },
  { rank: 7, camp: 'ML-Boost May 2026', set: 'Part 3', obj: 'Brand awareness', period: 'May 11–13, 26', spend: '$50.00', impr: '1,881', clicks: '0', ctr: '0.000%', cpm: '$26.58', cpc: '—' },
  { rank: 8, camp: 'Pilot', set: 'Pilot Oct 2025', obj: 'Video views', period: 'Oct 20–24, 25', spend: '$100.00', impr: '11,349', clicks: '4', ctr: '0.035%', cpm: '$8.81', cpc: '$25.00' },
  { rank: 9, camp: 'ML-Boost May 2026', set: 'Part 1 & 2', obj: 'Brand awareness', period: 'May 11–13, 26', spend: '$50.00', impr: '1,897', clicks: '1', ctr: '0.053%', cpm: '$26.35', cpc: '$50.00' },
  { rank: 10, camp: 'Sponsored Messaging_06092026', set: 'Full List', obj: 'Website visits (InMail)', period: 'Jun 9, 26 →', spend: '$150.00', impr: '145 sends', clicks: '80 opens', ctr: '55.2% open rate', cpm: '—', cpc: '—' },
];

export const AD_IND_L = ['Tech & Internet','IT Services','Business Consulting','Transport Mfg','Engineering Svcs','Media & Telecom','Machinery Mfg','Higher Education'];
export const AD_IND_D = [48369,34473,16460,10334,9019,8468,7976,6451];
export const AD_JOB_L = ['Engineering','Business Dev','IT','Operations','Sales','Proj. Mgmt','Education'];
export const AD_JOB_D = [23858,22873,22748,16933,14211,7046,5967];
export const AD_SEN_L = ['Senior','Director','Manager','Owner','VP','CXO','Others'];
export const AD_SEN_D = [53152,17674,15591,9382,8854,7525,10000];
export const AD_LOC_L = ['United States','Canada','Greater Toronto','New York City','Others'];
export const AD_LOC_D = [86098,29833,9343,7293,57535];

export const AD_TITLES = [
  { t: 'Owner', pct: 12.0 }, { t: 'Founder', pct: 9.1 }, { t: 'President', pct: 8.6 },
  { t: 'Chief Executive Officer', pct: 6.8 }, { t: 'Senior Software Engineer', pct: 6.5 },
  { t: 'Co-Founder', pct: 4.9 }, { t: 'IT Specialist', pct: 4.6 },
  { t: 'Director', pct: 3.9 }, { t: 'Vice President', pct: 3.3 },
  { t: 'Chief Technology Officer', pct: 2.9 },
];

export const VIDEO_FUNNEL_L = ['Impressions','Video Plays','Views 25%','Views 50%','Views 75%','Completions'];
export const VIDEO_FUNNEL_D = [79406,64967,20499,16869,12735,12735];

export const HASQ_CTR_L = ['TOF Set 01','TOF Set 02','MOF Set 01','MOF Set 02'];
export const HASQ_CTR_D = [0.285,0.287,0.259,0.428];

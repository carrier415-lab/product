import { useState, useRef, useEffect } from "react";
import {
  Plus, Upload, X, Check, AlertCircle, Clock, Send, Eye,
  Trash2, Image, ArrowLeft, Loader, FileText, Package,
  Zap, Tag, Calendar, Layers, ChevronDown, ChevronRight
} from "lucide-react";

/* ─────────────────────────────────────────────────────
   DESIGN TOKENS
───────────────────────────────────────────────────── */
const ACCENT       = "#6366F1";
const ACCENT_LIGHT = "#EEF2FF";
const SIDEBAR_BG   = "#0F172A";
const SURFACE      = "#F8FAFC";
const BORDER       = "#E2E8F0";
const TEXT         = "#0F172A";
const MUTED        = "#64748B";

/* ─────────────────────────────────────────────────────
   MOCK DATA
───────────────────────────────────────────────────── */
const MOCK_PRODUCTS = [
  { id: 1, name: "제주 황금 고구마 3kg",  category: "식품",       brand: "제주팜스토리", status: "complete",   date: "2026-03-10", images: 5, mode: "production"  },
  { id: 2, name: "무소음 홈트 매트 10mm", category: "스포츠/레저", brand: "피트홈",      status: "complete",   date: "2026-03-09", images: 8, mode: "experiment"  },
  { id: 3, name: "수분크림 50ml",         category: "화장품",      brand: "더마클린",    status: "processing", date: "2026-03-12", images: 3, mode: "experiment"  },
  { id: 4, name: "무선 진공청소기 V9",    category: "가전",        brand: "클린텍",      status: "error",      date: "2026-03-08", images: 6, mode: "production"  },
];

const CATEGORIES = [
  "식품/건강기능식품", "화장품", "전기/전자", "스포츠/레저",
  "패션/의류", "어린이/유아", "일반 공산품",
];

/* 카테고리별 추가 입력 필드 */
const CATEGORY_EXTRA_FIELDS = {
  "식품/건강기능식품": {
    sections: [
      {
        title: null,
        fields: [
          { key: "volume",   label: "내용량",              placeholder: "예: 500g 또는 500ml" },
          { key: "allergen", label: "알레르기 유발 성분",  placeholder: "예: 우유, 대두" },
        ],
      },
      {
        title: "영양성분 (선택)",
        fields: [
          { key: "serving",   label: "1회 제공량 (g)",  placeholder: "예: 30"  },
          { key: "calories",  label: "열량 (kcal)",      placeholder: "예: 150" },
          { key: "carbs",     label: "탄수화물 (g)",     placeholder: "예: 25"  },
          { key: "protein",   label: "단백질 (g)",       placeholder: "예: 3"   },
          { key: "fat",       label: "지방 (g)",         placeholder: "예: 5"   },
          { key: "sodium",    label: "나트륨 (mg)",       placeholder: "예: 100" },
        ],
      },
    ],
  },
  "화장품": {
    sections: [
      {
        title: null,
        fields: [
          { key: "volume",    label: "용량/사이즈",    placeholder: "예: 50ml"              },
          { key: "skinType",  label: "피부 타입",      placeholder: "예: 건성, 지성, 복합성" },
          { key: "material1", label: "주요 성분 1",    placeholder: "예: 히알루론산"         },
          { key: "material2", label: "주요 성분 2",    placeholder: "예: 나이아신아마이드"   },
          { key: "usage",     label: "사용 방법",      placeholder: "예: 세안 후 적당량 도포" },
          { key: "color1",    label: "색상/색호",      placeholder: "예: #21 핑크베이지"    },
        ],
      },
    ],
  },
  "전기/전자": {
    sections: [
      {
        title: null,
        fields: [
          { key: "size",      label: "크기/사이즈",       placeholder: "예: 260 × 180 × 50mm"   },
          { key: "weight",    label: "무게 (g)",           placeholder: "예: 350"                },
          { key: "battery",   label: "배터리 용량 (mAh)", placeholder: "예: 5000"               },
          { key: "charging",  label: "충전 시간 (분)",    placeholder: "예: 120"                },
          { key: "color1",    label: "색상 옵션 1",        placeholder: "예: 블랙"               },
          { key: "color2",    label: "색상 옵션 2",        placeholder: "예: 화이트"             },
        ],
      },
    ],
  },
  "스포츠/레저": {
    sections: [
      {
        title: null,
        fields: [
          { key: "size",      label: "크기/사이즈",  placeholder: "예: 183 × 61cm"  },
          { key: "weight",    label: "무게 (g)",      placeholder: "예: 1200"        },
          { key: "material1", label: "주요 소재 1",  placeholder: "예: TPE"         },
          { key: "material2", label: "주요 소재 2",  placeholder: "예: 천연고무"    },
          { key: "color1",    label: "색상 옵션 1",  placeholder: "예: 블랙"        },
          { key: "color2",    label: "색상 옵션 2",  placeholder: "예: 그레이"      },
        ],
      },
    ],
  },
  "패션/의류": {
    sections: [
      {
        title: null,
        fields: [
          { key: "size",      label: "크기/사이즈",  placeholder: "예: 260mm 또는 95(S)"  },
          { key: "weight",    label: "무게 (g)",      placeholder: "예: 350"              },
          { key: "material1", label: "주요 소재 1",  placeholder: "예: 천연 소가죽"      },
          { key: "material2", label: "주요 소재 2",  placeholder: "예: 메쉬 원단"        },
          { key: "color1",    label: "색상 옵션 1",  placeholder: "예: 스틸그레이"       },
          { key: "color2",    label: "색상 옵션 2",  placeholder: "예: 네이비"           },
          { key: "fit",       label: "핏 (Fit)",      placeholder: "예: 레귤러핏, 슬림핏" },
          { key: "wash",      label: "세탁 방법",    placeholder: "예: 찬물 손세탁"       },
          { key: "fabric",    label: "원단 두께",    placeholder: "예: 얇음, 보통, 두꺼움" },
        ],
      },
    ],
  },
  "어린이/유아": {
    sections: [
      {
        title: null,
        fields: [
          { key: "age",       label: "대상 연령",    placeholder: "예: 3세 이상"              },
          { key: "size",      label: "크기/사이즈",  placeholder: "예: 가로 30 × 세로 20cm"  },
          { key: "material1", label: "주요 소재",    placeholder: "예: ABS 플라스틱"          },
          { key: "safety",    label: "안전 인증",    placeholder: "예: KC 인증"               },
          { key: "color1",    label: "색상 옵션 1",  placeholder: "예: 핑크"                  },
          { key: "color2",    label: "색상 옵션 2",  placeholder: "예: 블루"                  },
        ],
      },
    ],
  },
  "일반 공산품": {
    sections: [
      {
        title: null,
        fields: [
          { key: "size",      label: "크기/사이즈",  placeholder: "예: 가로 × 세로 × 높이 (cm)" },
          { key: "weight",    label: "무게 (g)",      placeholder: "예: 500"                  },
          { key: "material1", label: "주요 소재",    placeholder: "예: 스테인리스 스틸"       },
          { key: "color1",    label: "색상 옵션 1",  placeholder: "예: 실버"                  },
          { key: "color2",    label: "색상 옵션 2",  placeholder: "예: 블랙"                  },
        ],
      },
    ],
  },
};

const NODE_LIST = [
  { id: 1,    name: "입력 분석 및 정보 수집",  desc: "Vision 분석 + 웹서치"         },
  { id: 2,    name: "타겟 페르소나 선정",       desc: "Tree of Thoughts"             },
  { id: "5a", name: "법정 표기사항 생성",       desc: "병렬 실행", parallel: true    },
  { id: 3,    name: "기획 전략 수립",           desc: "Self-Correction Loop"         },
  { id: 4,    name: "섹션별 카피 생성",         desc: "MoE 모드 전환"                },
  { id: "5b", name: "컴플라이언스 검수",        desc: "LLM-as-a-Judge"               },
  { id: 6,    name: "이미지 프롬프트 작성",     desc: "Multi-Image Distribution"     },
  { id: 7,    name: "HTML 코드 생성",           desc: "DSPy Optimization"            },
  { id: 8,    name: "GEO/SEO 최적화",          desc: "Schema.org + E-E-A-T"         },
  { id: 9,    name: "최종 품질 검수",           desc: "4개 축 자동 채점"             },
  { id: 10,   name: "수정 대기",               desc: "사용자 검토 지점", final: true },
];

/* 노드별 산출물 — JSON을 사람이 읽기 쉬운 표 형태로 정리 */
const NODE_OUTPUTS = {
  1: {
    validator: { result: "pass", issues: [] },
    sections: [
      { title: "상품 기본 정보",
        rows: [
          { label: "상품명",    value: "제주 황금 고구마 3kg" },
          { label: "브랜드",    value: "제주팜스토리" },
          { label: "카테고리",  value: "식품" },
          { label: "판매가",    value: "24,900원" },
        ] },
      { title: "이미지 분석 결과 (5장)",
        rows: [
          { label: "대표 이미지",  value: "Image #1 — 정면 Product Shot" },
          { label: "Image #1",     value: "정면 / Product Shot / 상품 단독", tag: "대표" },
          { label: "Image #2",     value: "상단 / Detail Shot / 상품 단독" },
          { label: "Image #3",     value: "측면 / Lifestyle Shot / 배경+상품" },
          { label: "Image #4, 5",  value: "근접 / Detail Shot / 표면 질감" },
        ] },
      { title: "웹서치 수집 정보",
        rows: [
          { label: "시장 트렌드",  value: "국내산 고구마 수요 증가, 건강식품 카테고리 성장 (외부수집)" },
          { label: "경쟁상품 1",   value: "해남 황금 고구마 5kg — 가격 경쟁 강점" },
          { label: "경쟁상품 2",   value: "유기농 고구마 2kg — 인증 차별화" },
          { label: "미확인 필드",  value: "영양성분 상세, 유통기한, 영업소 명칭", tag: "DATA_REQUIRED" },
        ] },
    ],
  },
  2: {
    validator: { result: "pass", issues: [] },
    sections: [
      { title: "선정된 페르소나",
        rows: [
          { label: "이름(가명)",       value: "김지현 (35세)" },
          { label: "직업",             value: "워킹맘 / 초등 자녀 2명" },
          { label: "라이프스타일",     value: "건강한 식단에 관심, 온라인 장보기 선호" },
          { label: "구매 동기",        value: "아이에게 안심하고 먹일 수 있는 국내산 간식" },
          { label: "핵심 페인포인트",  value: "산지 불명확 상품에 대한 불신, 과한 당도 걱정" },
        ] },
      { title: "핵심 USP 3개",
        rows: [
          { label: "USP 1", value: "산지 직송으로 중간 유통 없이 신선함 그대로", tag: "Benefit" },
          { label: "USP 2", value: "당 함량 낮은 품종으로 아이 간식도 걱정 없이", tag: "Benefit" },
          { label: "USP 3", value: "제주 인증 농가 재배, 원산지 투명 공개", tag: "Benefit" },
        ] },
      { title: "SEO 검색 의도",
        rows: [
          { label: "정보 탐색형",   value: "고구마 당도 낮은 품종 추천" },
          { label: "비교 탐색형",   value: "제주 고구마 국내산 비교" },
          { label: "구매 결정형",   value: "제주 황금 고구마 3kg 구매" },
        ] },
    ],
  },
  "5a": {
    validator: { result: "partial", issues: ["영업소 명칭, 유통기한 미확인"] },
    sections: [
      { title: "식품 법정 표기사항 (Section 8)",
        rows: [
          { label: "제품명",      value: "제주 황금 고구마" },
          { label: "식품 유형",   value: "농산물" },
          { label: "원산지",      value: "제주특별자치도" },
          { label: "내용량",      value: "3kg" },
          { label: "알레르기",    value: "해당 없음" },
          { label: "보관 방법",   value: "서늘하고 통풍이 잘 되는 곳에 보관" },
          { label: "영업소 명칭", value: "[DATA_REQUIRED]", tag: "DATA_REQUIRED" },
          { label: "유통기한",    value: "[DATA_REQUIRED]", tag: "DATA_REQUIRED" },
        ] },
      { title: "배송 / 반품 안내",
        rows: [
          { label: "배송 정책", value: "주문 후 2~3 영업일 이내 출고 (DB 표준 문구)" },
          { label: "반품 정책", value: "수령 후 7일 이내 교환/반품 가능 (DB 표준 문구)" },
        ] },
    ],
  },
  3: {
    validator: { result: "pass", issues: [] },
    sections: [
      { title: "섹션별 전략 요약",
        rows: [
          { label: "Section 1 Brand",    value: "제주 자연과 농가 신뢰를 전면에. 감성적 무드 배경 1장." },
          { label: "Section 2 Intro",    value: "문제 해결형 헤드카피 + USP 3개 요약. 키비주얼 2장." },
          { label: "Section 3 Problem",  value: "국내산 불신, 당도 걱정 — 페인포인트 질문형 공감." },
          { label: "Section 4 Body",     value: "USP 4단 논리: 신선도 → 품종 안전 → 인증 → 가격." },
          { label: "Section 5 V-1",      value: "실사용 후기 연출 컷 + 별점 데이터." },
          { label: "Section 6 V-2",      value: "제주 인증 원본 이미지 + 원산지 명시." },
          { label: "Section 7 Purchase", value: "구성품, FAQ 4개, 스펙표, 사이즈 비교 문구." },
        ] },
      { title: "이미지 수량 계획",
        rows: [
          { label: "총 계획",    value: "10장 (최소 8 / 최대 14 기준 충족)" },
          { label: "원본 활용",  value: "5장 (reference)" },
          { label: "신규 생성",  value: "5장 (나노바나나 generate)" },
        ] },
    ],
  },
  4: {
    validator: { result: "pass", issues: [] },
    sections: [
      { title: "Section 2 · Intro",
        rows: [
          { label: "헤드 카피",    value: "아이가 먼저 찾는 제주 황금 고구마" },
          { label: "서브 카피",    value: "산지 직송 · 당도 낮은 품종 · 인증 농가 직배송" },
          { label: "사회적 증거",  value: "3,200명 이상이 재구매한 믿을 수 있는 맛" },
        ] },
      { title: "Section 5 · Verification-1 (샘플 후기)",
        rows: [
          { label: "후기 #1", value: "아이가 너무 좋아해서 두 번째 주문이에요. 당이 낮아 오히려 좋았어요.", tag: "SAMPLE" },
          { label: "후기 #2", value: "제주산이라서 믿고 구매했는데 사이즈도 크고 맛도 좋아요.", tag: "SAMPLE" },
          { label: "후기 #3", value: "포장이 꼼꼼해서 상처 없이 잘 도착했어요. 가성비 최고입니다.", tag: "SAMPLE" },
          { label: "리뷰 수치", value: "구매자 만족도 4.8점 (샘플 데이터)", tag: "SAMPLE" },
        ] },
      { title: "미처리 DATA_REQUIRED",
        rows: [
          { label: "항목", value: "실제 리뷰 수, 별점 평균, 모델명", tag: "DATA_REQUIRED" },
        ] },
    ],
  },
  "5b": {
    validator: { result: "pass", issues: [] },
    sections: [
      { title: "검수 결과 요약",
        rows: [
          { label: "전체 판정",       value: "PASS" },
          { label: "발견된 이슈",     value: "1건 (자동 수정 완료)" },
          { label: "수동 처리 필요",  value: "0건" },
          { label: "샘플 후기 항목",  value: "4건 — 검수 제외 (experiment 모드)", tag: "SAMPLE" },
        ] },
      { title: "수정 이력",
        rows: [
          { label: "원문",     value: "가장 맛있는 제주 고구마", tag: "수정됨" },
          { label: "이슈",     value: "근거 없는 최상급 표현 ('가장')" },
          { label: "수정 후",  value: "신선한 제주 고구마" },
        ] },
      { title: "SEO 수정 허용 필드 (compliance_safe_fields)",
        rows: [
          { label: "허용",  value: "FAQ 답변 텍스트, alt 속성, 메타 description, section_5_reviews(SAMPLE)" },
          { label: "차단",  value: "헤드카피, USP 본문, 수치 데이터" },
        ] },
    ],
  },
  6: {
    validator: { result: "pass", issues: [] },
    sections: [
      { title: "상품 외관 고정 명세 (product_visual_anchor)",
        rows: [
          { label: "형태",          value: "불규칙 타원형, 고구마 자연 형태" },
          { label: "주요 색상",     value: "황금빛 오렌지 #E8891A, 연보라 껍질 #8B5E9E" },
          { label: "표면 재질",     value: "자연산 흙 묻은 질감, 무광" },
          { label: "로고",          value: "없음" },
          { label: "특징 요소",     value: "제주 황토색 묻음, 자연 굴곡" },
        ] },
      { title: "이미지 배분 계획 (총 10장)",
        rows: [
          { label: "Section 1 Brand",    value: "신규 생성 1장 — 등급 C (배경 전용)" },
          { label: "Section 2 Intro",    value: "원본 #1 + 신규 생성 1장 — 등급 B" },
          { label: "Section 3 Problem",  value: "신규 생성 1장 — 등급 C" },
          { label: "Section 4 Body",     value: "원본 #2, #3 + 신규 생성 1장 — 등급 B" },
          { label: "Section 5 V-1",      value: "신규 생성 1장 — 등급 B" },
          { label: "Section 6 V-2",      value: "원본 #4, #5 — 등급 A (상품 고정형)" },
          { label: "Section 7 Purchase", value: "신규 생성 1장 — 등급 A" },
        ] },
    ],
  },
  7: {
    validator: { result: "pass", issues: [] },
    sections: [
      { title: "HTML 생성 결과",
        rows: [
          { label: "총 섹션",         value: "8개 (Section 1~8 전체 포함)" },
          { label: "이미지 placeholder", value: "10개 (data-seo-filename 속성 전체 포함)" },
          { label: "DATA_REQUIRED",   value: "3건 (영업소 명칭, 유통기한, 리뷰 수)", tag: "DATA_REQUIRED" },
          { label: "alt 속성",        value: "전체 img 태그 포함 완료" },
        ] },
      { title: "레이아웃 적용 방식",
        rows: [
          { label: "키비주얼 섹션",    value: "방식 A — position:absolute 텍스트 오버레이" },
          { label: "설명 섹션",        value: "방식 B — flex 좌우 분리 배치" },
          { label: "법정 표기 섹션",   value: "방식 C — 텍스트 + table 전용" },
          { label: "가로폭",           value: "860px 고정 (샵바이 전용)" },
        ] },
    ],
  },
  8: {
    validator: { result: "pass", issues: [] },
    sections: [
      { title: "구조적 SEO (트랙 A)",
        rows: [
          { label: "JSON-LD 스키마",    value: "Product + Offer + FAQPage 삽입 완료" },
          { label: "meta title",        value: "제주 황금 고구마 3kg | 제주팜스토리 | 식품 (38자)" },
          { label: "meta description",  value: "제주 산지 직송, 당도 낮은 황금 고구마 3kg. 아이 간식도 걱정 없는 인증 농가 직배송. (55자)" },
          { label: "이미지 파일명",     value: "10개 seo_filename_hint 적용 완료" },
          { label: "aria-label",        value: "8개 section 태그 전체 추가" },
        ] },
      { title: "콘텐츠 SEO (트랙 B)",
        rows: [
          { label: "FAQ 총 개수",  value: "4개 — 기존 3개 + informational 의도 기반 1개 추가" },
          { label: "추가 FAQ",     value: "Q. 황금 고구마와 일반 고구마 차이는 무엇인가요?" },
          { label: "E-E-A-T 항목", value: "경험(후기 요약) / 전문성(품종 설명) / 권위(인증) / 신뢰(공식 표기) 4항목" },
          { label: "Quick Summary", value: "cm-quick-summary 블록 Section 2 직후 삽입 완료" },
        ] },
      { title: "SEO 점수 추정",
        rows: [
          { label: "구조 (Structure)",  value: "88 / 100" },
          { label: "콘텐츠 (Content)",  value: "82 / 100" },
          { label: "E-E-A-T",           value: "76 / 100" },
        ] },
    ],
  },
  9: {
    validator: { result: "pass", issues: [] },
    sections: [
      { title: "4개 축 품질 점수",
        rows: [
          { label: "마케팅 소구력",   value: "82 / 100 — 페르소나 페인포인트 충족, CTA 자연스러움" },
          { label: "법적 준수",       value: "83 / 100 — DATA_REQUIRED 3건 잔존, Section 8 완비" },
          { label: "시각 정합성",     value: "78 / 100 — placeholder 위치·톤앤매너 일치" },
          { label: "GEO/SEO 완성도",  value: "82 / 100 — 스키마 유효, FAQ 4개, E-E-A-T 반영" },
        ] },
      { title: "최종 판정",
        rows: [
          { label: "overall_pass",  value: "true — 전 축 기준 점수 이상" },
          { label: "자동 재귀",     value: "없음" },
          { label: "다음 단계",     value: "Node 10 (사용자 검토) 이관 완료" },
        ] },
    ],
  },
  10: {
    validator: { result: "pass", issues: [] },
    sections: [
      { title: "사용자 검토 대기",
        rows: [
          { label: "상태",  value: "생성 완료 — 사용자 검토 대기 중" },
          { label: "안내",  value: "우측 텍스트 수정 탭에서 수정 요청을 입력하세요." },
          { label: "지원",  value: "텍스트 기반 자유 수정 → AI가 재실행 노드 자동 판단" },
        ] },
    ],
  },
};

const STATUS_CONFIG = {
  complete:   { label: "생성 완료", color: "#10B981", bg: "#ECFDF5", Icon: Check       },
  processing: { label: "생성 중",   color: "#F59E0B", bg: "#FFFBEB", Icon: Loader      },
  error:      { label: "오류",      color: "#EF4444", bg: "#FEF2F2", Icon: AlertCircle },
};

/* ─────────────────────────────────────────────────────
   ROOT
───────────────────────────────────────────────────── */
export default function App() {
  const [screen,   setScreen]   = useState("list");
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [selected, setSelected] = useState(null);

  const gotoResult = (p) => { setSelected(p); setScreen("result"); };

  const addProduct = (p) => {
    const newP = {
      ...p,
      id: Date.now(),
      status: "processing",
      date: new Date().toISOString().split("T")[0],
    };
    setProducts(prev => [newP, ...prev]);
    setScreen("list");
  };

  const deleteProduct = (id) => setProducts(prev => prev.filter(p => p.id !== id));

  return (
    <div style={{ fontFamily: "'Noto Sans KR','Apple SD Gothic Neo','Malgun Gothic',sans-serif", minHeight: "100vh", background: SURFACE }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 10px; }
        .ch  { transition: all .18s ease; cursor: pointer; }
        .ch:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(15,23,42,.1) !important; }
        .bp  { transition: all .15s ease; }
        .bp:hover { opacity: .87; transform: translateY(-1px); }
        .gh:hover { background: #F1F5F9 !important; }
        @keyframes spin  { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:.4; } }
        @keyframes fi    { from { opacity:0; transform:translateY(5px); } to { opacity:1; transform:translateY(0); } }
        .spin  { animation: spin  .9s linear infinite; }
        .pulse { animation: pulse 1.6s ease-in-out infinite; }
        .fi    { animation: fi .22s ease; }
      `}</style>

      {screen === "list"   && <ListScreen   products={products} onNew={() => setScreen("create")} onView={gotoResult} onDelete={deleteProduct} />}
      {screen === "create" && <CreateScreen onBack={() => setScreen("list")} onCreate={addProduct} />}
      {screen === "result" && <ResultScreen product={selected} onBack={() => setScreen("list")} />}
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   SHARED: SIDEBAR
───────────────────────────────────────────────────── */
function Sidebar({ extra }) {
  return (
    <aside style={{ width: 218, background: SIDEBAR_BG, flexShrink: 0, display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "22px 18px 16px", borderBottom: "1px solid rgba(255,255,255,.07)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: ACCENT, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Zap size={13} color="#fff" />
          </div>
          <div>
            <div style={{ color: "#fff", fontSize: 12, fontWeight: 700 }}>ProductCopy</div>
            <div style={{ color: "rgba(255,255,255,.3)", fontSize: 9.5 }}>AI 상품기술서 v2.5</div>
          </div>
        </div>
      </div>

      <nav style={{ padding: "12px 10px" }}>
        {[
          { Icon: FileText, label: "상품기술서 목록", active: true  },
          { Icon: Package,  label: "설정",           active: false },
        ].map(({ Icon, label, active }) => (
          <div key={label} className="gh" style={{ display: "flex", alignItems: "center", gap: 9, padding: "7px 10px", borderRadius: 7, marginBottom: 2, background: active ? "rgba(99,102,241,.16)" : "transparent", cursor: "pointer" }}>
            <Icon size={14} color={active ? "#A5B4FC" : "rgba(255,255,255,.3)"} />
            <span style={{ fontSize: 12.5, color: active ? "#E0E7FF" : "rgba(255,255,255,.35)", fontWeight: active ? 500 : 400 }}>{label}</span>
          </div>
        ))}
      </nav>

      <div style={{ flex: 1 }}>{extra}</div>

      <div style={{ padding: "11px 18px", borderTop: "1px solid rgba(255,255,255,.07)" }}>
        <div style={{ fontSize: 9.5, color: "rgba(255,255,255,.2)", lineHeight: 1.7 }}>
          <div>Pilot v0.2 · 내부 전용</div>
          <div>Node 기반 파이프라인</div>
        </div>
      </div>
    </aside>
  );
}

/* ─────────────────────────────────────────────────────
   SCREEN 1: LIST
───────────────────────────────────────────────────── */
function ListScreen({ products, onNew, onView, onDelete }) {
  const [filter,    setFilter]    = useState("all");
  const [confirmId, setConfirmId] = useState(null);

  const filtered = filter === "all" ? products : products.filter(p => p.status === filter);

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />

      <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* ── 상단 헤더 ── */}
        <div style={{ background: "#fff", borderBottom: `1px solid ${BORDER}`, padding: "15px 30px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div>
            <h1 style={{ fontSize: 17, fontWeight: 700, color: TEXT }}>상품기술서 목록</h1>
            <p style={{ fontSize: 11.5, color: MUTED, marginTop: 2 }}>
              총 {products.length}건 · 완료 {products.filter(p => p.status === "complete").length}건
            </p>
          </div>
          <button
            onClick={onNew}
            className="bp"
            style={{ display: "flex", alignItems: "center", gap: 6, background: ACCENT, color: "#fff", border: "none", borderRadius: 8, padding: "9px 17px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
          >
            <Plus size={14} />신규 생성
          </button>
        </div>

        {/* ── 필터 바 ── */}
        <div style={{ background: "#fff", borderBottom: `1px solid ${BORDER}`, padding: "9px 30px", display: "flex", gap: 3, flexShrink: 0 }}>
          {[["all", "전체"], ["complete", "완료"], ["processing", "생성 중"], ["error", "오류"]].map(([v, l]) => (
            <button key={v} onClick={() => setFilter(v)} style={{ padding: "4px 12px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 12, fontWeight: filter === v ? 600 : 400, background: filter === v ? ACCENT_LIGHT : "transparent", color: filter === v ? ACCENT : MUTED, transition: "all .15s" }}>
              {l}
              {v !== "all" && (
                <span style={{ marginLeft: 3, fontSize: 10, opacity: .7 }}>({products.filter(p => p.status === v).length})</span>
              )}
            </button>
          ))}
        </div>

        {/* ── 카드 그리드 ── */}
        <div style={{ padding: "22px 30px", flex: 1, overflowY: "auto" }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "72px 0", color: MUTED }}>
              <FileText size={38} color="#CBD5E1" style={{ margin: "0 auto 10px" }} />
              <p style={{ fontSize: 13.5 }}>등록된 상품기술서가 없습니다.</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))", gap: 14 }}>
              {filtered.map(p => (
                <ProductCard key={p.id} product={p} onView={() => onView(p)} onDelete={() => setConfirmId(p.id)} />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* ── 삭제 확인 모달 ── */}
      {confirmId && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div className="fi" style={{ background: "#fff", borderRadius: 13, padding: 26, width: 330, boxShadow: "0 20px 60px rgba(0,0,0,.2)" }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: TEXT, marginBottom: 7 }}>삭제 확인</h3>
            <p style={{ fontSize: 12.5, color: MUTED, lineHeight: 1.6 }}>삭제하면 복구가 불가능합니다. 진행하시겠습니까?</p>
            <div style={{ display: "flex", gap: 8, marginTop: 18, justifyContent: "flex-end" }}>
              <button onClick={() => setConfirmId(null)} style={{ padding: "7px 14px", borderRadius: 7, border: `1px solid ${BORDER}`, background: "#fff", fontSize: 12.5, cursor: "pointer", color: MUTED }}>취소</button>
              <button onClick={() => { onDelete(confirmId); setConfirmId(null); }} style={{ padding: "7px 14px", borderRadius: 7, border: "none", background: "#EF4444", color: "#fff", fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}>삭제</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProductCard({ product, onView, onDelete }) {
  const { label, color, bg, Icon } = STATUS_CONFIG[product.status];
  return (
    <div className="ch" style={{ background: "#fff", borderRadius: 11, border: `1px solid ${BORDER}`, padding: 16, boxShadow: "0 1px 4px rgba(0,0,0,.05)", display: "flex", flexDirection: "column", gap: 11 }}>
      <div style={{ background: SURFACE, borderRadius: 8, height: 100, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
        <Image size={24} color="#CBD5E1" />
        <div style={{ position: "absolute", top: 7, right: 7, display: "flex", alignItems: "center", gap: 3, background: bg, borderRadius: 5, padding: "2px 7px" }}>
          <Icon size={9} color={color} className={product.status === "processing" ? "spin" : ""} />
          <span style={{ fontSize: 9.5, fontWeight: 600, color }}>{label}</span>
        </div>
        <div style={{ position: "absolute", top: 7, left: 7 }}>
          <span style={{ fontSize: 9.5, fontWeight: 500, padding: "2px 7px", borderRadius: 9999, background: product.mode === "experiment" ? "#FEF3C7" : "#EFF6FF", color: product.mode === "experiment" ? "#D97706" : "#2563EB" }}>
            {product.mode === "experiment" ? "테스트" : "운영"}
          </span>
        </div>
      </div>
      <div>
        <h3 style={{ fontSize: 13.5, fontWeight: 700, color: TEXT, lineHeight: 1.35, marginBottom: 5 }}>{product.name}</h3>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {[
            { I: Tag,      v: product.category || "미분류" },
            { I: Calendar, v: product.date },
            { I: Layers,   v: `이미지 ${product.images}장` },
          ].map(({ I, v }) => (
            <span key={v} style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 10.5, color: MUTED }}>
              <I size={9} />{v}
            </span>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", gap: 6, borderTop: `1px solid ${BORDER}`, paddingTop: 9 }}>
        <button onClick={onView} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, padding: "7px", borderRadius: 7, border: `1px solid ${BORDER}`, background: "#fff", fontSize: 11.5, cursor: "pointer", color: TEXT, fontWeight: 500 }}>
          <Eye size={11} />보기 / 수정
        </button>
        <button onClick={onDelete} className="gh" style={{ padding: "7px 10px", borderRadius: 7, border: `1px solid ${BORDER}`, background: "#fff", cursor: "pointer", color: "#EF4444" }}>
          <Trash2 size={11} />
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   SCREEN 2: CREATE
───────────────────────────────────────────────────── */
function CreateScreen({ onBack, onCreate }) {
  const [images, setImages] = useState([]);
  const [form,   setForm]   = useState({ name: "", category: "", brand: "", price: "", mode: "experiment", extra: {} });
  const [drag,   setDrag]   = useState(false);
  const [errors, setErrors] = useState({});
  const fileRef = useRef();

  const handleExtra = (key, val) => setForm(p => ({ ...p, extra: { ...p.extra, [key]: val } }));

  const addFiles = (files) => {
    const imgs  = Array.from(files).filter(f => f.type.startsWith("image/"));
    const toAdd = imgs.slice(0, 10 - images.length).map(f => ({
      file: f,
      url:  URL.createObjectURL(f),
      id:   Math.random(),
    }));
    setImages(prev => [...prev, ...toAdd]);
  };

  const removeImage = (id) => setImages(prev => prev.filter(i => i.id !== id));

  const validate = () => {
    const e = {};
    if (!form.name.trim())    e.name   = "상품명은 필수입니다.";
    if (images.length === 0)  e.images = "이미지를 1장 이상 등록해주세요.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onCreate({
      name:     form.name.trim(),
      category: form.category || "미분류",
      brand:    form.brand,
      price:    form.price,
      images:   images.length,
      mode:     form.mode,
      extra:    form.extra,
    });
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar extra={
        <div style={{ padding: "18px 18px 0" }}>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,.28)", marginBottom: 12, fontWeight: 500, letterSpacing: ".3px" }}>진행 단계</div>
          {["이미지 등록", "기본 정보 입력", "생성 시작"].map((l, i) => (
            <div key={l} style={{ display: "flex", gap: 9, marginBottom: 14, alignItems: "flex-start" }}>
              <div style={{ width: 19, height: 19, borderRadius: "50%", background: ACCENT, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontSize: 8.5, fontWeight: 700, color: "#fff" }}>{i + 1}</span>
              </div>
              <span style={{ fontSize: 11.5, color: "rgba(255,255,255,.65)", lineHeight: 1.4 }}>{l}</span>
            </div>
          ))}
        </div>
      } />

      <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* ── 헤더 ── */}
        <div style={{ background: "#fff", borderBottom: `1px solid ${BORDER}`, padding: "13px 28px", display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
          <button onClick={onBack} className="gh" style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", borderRadius: 7, border: `1px solid ${BORDER}`, background: "#fff", cursor: "pointer", fontSize: 11.5, color: MUTED }}>
            <ArrowLeft size={12} />목록
          </button>
          <div>
            <h1 style={{ fontSize: 17, fontWeight: 700, color: TEXT }}>신규 상품기술서 생성</h1>
            <p style={{ fontSize: 11.5, color: MUTED }}>이미지 1~10장과 상품명만으로 AI가 자동 생성합니다.</p>
          </div>
        </div>

        {/* ── 폼 ── */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px" }}>
          <div style={{ maxWidth: 740, margin: "0 auto", display: "flex", flexDirection: "column", gap: 18 }}>

            {/* 이미지 업로드 */}
            <FormCard title="이미지 등록" badge={`${images.length} / 10장`}>
              <div
                onDragOver={e => { e.preventDefault(); setDrag(true); }}
                onDragLeave={() => setDrag(false)}
                onDrop={e => { e.preventDefault(); setDrag(false); addFiles(e.dataTransfer.files); }}
                onClick={() => fileRef.current && fileRef.current.click()}
                style={{
                  border: `2px dashed ${errors.images ? "#EF4444" : drag ? ACCENT : BORDER}`,
                  borderRadius: 9, padding: "24px 18px", textAlign: "center", cursor: "pointer",
                  background: drag ? ACCENT_LIGHT : "#FAFBFC", transition: "all .18s",
                }}
              >
                <Upload size={22} color={drag ? ACCENT : "#94A3B8"} style={{ margin: "0 auto 7px" }} />
                <p style={{ fontSize: 12.5, color: MUTED }}>이미지를 드래그하거나 클릭해서 업로드</p>
                <p style={{ fontSize: 10.5, color: "#94A3B8", marginTop: 3 }}>JPG · PNG · WEBP · 최대 10장 · 장당 10MB 이하</p>
                <input ref={fileRef} type="file" multiple accept="image/*" style={{ display: "none" }} onChange={e => addFiles(e.target.files)} />
              </div>
              {errors.images && <p style={{ fontSize: 10.5, color: "#EF4444", marginTop: 5 }}>{errors.images}</p>}

              {images.length > 0 && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 7, marginTop: 12 }}>
                  {images.map((img, idx) => (
                    <div key={img.id} style={{ position: "relative", borderRadius: 7, overflow: "hidden", aspectRatio: "1", border: `2px solid ${idx === 0 ? ACCENT : BORDER}` }}>
                      <img src={img.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      {idx === 0 && (
                        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: ACCENT, padding: "2px 0", textAlign: "center", fontSize: 8.5, color: "#fff", fontWeight: 700 }}>대표</div>
                      )}
                      <button onClick={() => removeImage(img.id)} style={{ position: "absolute", top: 3, right: 3, width: 17, height: 17, borderRadius: "50%", background: "rgba(0,0,0,.6)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <X size={9} color="#fff" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </FormCard>

            {/* 기본 정보 */}
            <FormCard title="기본 정보">
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <label style={{ fontSize: 11.5, fontWeight: 600, color: TEXT, display: "block", marginBottom: 5 }}>
                    상품명 <span style={{ color: "#EF4444" }}>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="예: 제주 황금 고구마 3kg"
                    value={form.name}
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    style={{ width: "100%", padding: "8px 11px", borderRadius: 7, border: `1px solid ${errors.name ? "#EF4444" : BORDER}`, fontSize: 12.5, outline: "none", color: TEXT, background: "#fff" }}
                  />
                  {errors.name && <p style={{ fontSize: 10.5, color: "#EF4444", marginTop: 4 }}>{errors.name}</p>}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 11.5, fontWeight: 600, color: TEXT, display: "block", marginBottom: 5 }}>카테고리 <span style={{ fontSize: 10, color: MUTED, fontWeight: 400 }}>(선택)</span></label>
                    <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value, extra: {} }))} style={{ width: "100%", padding: "8px 11px", borderRadius: 7, border: `1px solid ${BORDER}`, fontSize: 12.5, color: TEXT, background: "#fff", cursor: "pointer", outline: "none" }}>
                      <option value="">선택 안 함</option>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 11.5, fontWeight: 600, color: TEXT, display: "block", marginBottom: 5 }}>브랜드 <span style={{ fontSize: 10, color: MUTED, fontWeight: 400 }}>(선택)</span></label>
                    <input type="text" placeholder="예: 제주팜스토리" value={form.brand} onChange={e => setForm(p => ({ ...p, brand: e.target.value }))} style={{ width: "100%", padding: "8px 11px", borderRadius: 7, border: `1px solid ${BORDER}`, fontSize: 12.5, color: TEXT, outline: "none", background: "#fff" }} />
                  </div>
                </div>
                <div style={{ maxWidth: 220 }}>
                  <label style={{ fontSize: 11.5, fontWeight: 600, color: TEXT, display: "block", marginBottom: 5 }}>판매가 <span style={{ fontSize: 10, color: MUTED, fontWeight: 400 }}>(선택)</span></label>
                  <input type="text" placeholder="예: 24,900" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} style={{ width: "100%", padding: "8px 11px", borderRadius: 7, border: `1px solid ${BORDER}`, fontSize: 12.5, color: TEXT, outline: "none", background: "#fff" }} />
                </div>
              </div>
            </FormCard>

            {/* 카테고리 추가 정보 */}
            {form.category && CATEGORY_EXTRA_FIELDS[form.category] && (
              <FormCard title="카테고리 추가 정보" badge={form.category}>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {CATEGORY_EXTRA_FIELDS[form.category].sections.map((section, si) => (
                    <div key={si}>
                      {section.title && (
                        <div style={{ fontSize: 11, fontWeight: 700, color: ACCENT, letterSpacing: ".3px", marginBottom: 10, paddingBottom: 6, borderBottom: `1px solid ${ACCENT_LIGHT}` }}>
                          {section.title}
                        </div>
                      )}
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                        {section.fields.map(field => (
                          <div key={field.key}>
                            <label style={{ fontSize: 11.5, fontWeight: 600, color: TEXT, display: "block", marginBottom: 5 }}>
                              {field.label} <span style={{ fontSize: 10, color: MUTED, fontWeight: 400 }}>(선택)</span>
                            </label>
                            <input
                              type="text"
                              placeholder={field.placeholder}
                              value={form.extra[field.key] || ""}
                              onChange={e => handleExtra(field.key, e.target.value)}
                              style={{ width: "100%", padding: "8px 11px", borderRadius: 7, border: `1px solid ${BORDER}`, fontSize: 12.5, color: TEXT, outline: "none", background: "#fff" }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </FormCard>
            )}

            {/* 실행 모드 */}
            <FormCard title="실행 모드">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {[
                  { v: "experiment", l: "Experiment", s: "테스트 · 샘플 후기 자동 생성",   c: "#D97706", bg: "#FFFBEB" },
                  { v: "production", l: "Production",  s: "실제 등록 · 샘플 데이터 차단",  c: "#2563EB", bg: "#EFF6FF" },
                ].map(({ v, l, s, c, bg }) => (
                  <div key={v} onClick={() => setForm(p => ({ ...p, mode: v }))} style={{ padding: 13, borderRadius: 9, border: `2px solid ${form.mode === v ? c : BORDER}`, background: form.mode === v ? bg : "#fff", cursor: "pointer", transition: "all .15s" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 3 }}>
                      <div style={{ width: 13, height: 13, borderRadius: "50%", border: `2px solid ${form.mode === v ? c : "#CBD5E1"}`, background: form.mode === v ? c : "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {form.mode === v && <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#fff" }} />}
                      </div>
                      <span style={{ fontSize: 12.5, fontWeight: 700, color: form.mode === v ? c : TEXT }}>{l}</span>
                    </div>
                    <p style={{ fontSize: 10.5, color: MUTED, paddingLeft: 20 }}>{s}</p>
                  </div>
                ))}
              </div>
              {form.mode === "experiment" && (
                <div style={{ marginTop: 10, padding: "9px 12px", background: "#FFFBEB", borderRadius: 7, border: "1px solid #FDE68A" }}>
                  <p style={{ fontSize: 10.5, color: "#92400E", lineHeight: 1.6 }}>Experiment 모드에서는 플랫폼 등록이 차단됩니다. Node 4에서 샘플 후기가 [SAMPLE] 태그와 함께 자동 생성됩니다.</p>
                </div>
              )}
            </FormCard>

            {/* 제출 버튼 */}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, paddingBottom: 16 }}>
              <button onClick={onBack} className="gh" style={{ padding: "9px 18px", borderRadius: 8, border: `1px solid ${BORDER}`, background: "#fff", fontSize: 12.5, cursor: "pointer", color: MUTED }}>취소</button>
              <button onClick={handleSubmit} className="bp" style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 22px", borderRadius: 8, border: "none", background: ACCENT, color: "#fff", fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}>
                <Zap size={12} />AI 생성 시작
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function FormCard({ title, badge, children }) {
  return (
    <div style={{ background: "#fff", borderRadius: 11, border: `1px solid ${BORDER}`, overflow: "hidden" }}>
      <div style={{ padding: "12px 18px", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", gap: 7 }}>
        <span style={{ fontSize: 13.5, fontWeight: 700, color: TEXT }}>{title}</span>
        {badge && <span style={{ marginLeft: "auto", fontSize: 11, color: MUTED }}>{badge}</span>}
      </div>
      <div style={{ padding: 18 }}>{children}</div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   SCREEN 3: RESULT
───────────────────────────────────────────────────── */
function ResultScreen({ product, onBack }) {
  const initialStates = () =>
    NODE_LIST.map((n, i) =>
      product?.status === "complete"
        ? { ...n, status: "done",    time: (Math.random() * 9 + 1.5).toFixed(1) + "s" }
        : { ...n, status: i === 0 ? "running" : "waiting", time: null }
    );

  const [nodeStates,  setNodeStates]  = useState(initialStates);
  const [done,        setDone]        = useState(product?.status === "complete");
  const [tab,         setTab]         = useState(product?.status === "complete" ? "revision" : "progress");
  const [expandedId,  setExpandedId]  = useState(null);
  const [messages,    setMessages]    = useState(
    product?.status === "complete"
      ? [
          { r: "sys",  t: "생성이 완료되었습니다. 수정이 필요한 내용을 자유롭게 입력하세요." },
          { r: "user", t: "Section 2 헤드카피를 더 강렬하게 바꿔주세요." },
          { r: "sys",  t: "요청 내용: Section 2 Intro 헤드카피 수정\n재실행 노드: Node 4\n연결 실행: Node 4 → Node 5b → Node 7 → Node 8 → Node 9\n예상 처리: 헤드카피 재생성 및 하위 노드 연쇄 실행\n\n진행하시겠습니까?" },
          { r: "btns" },
        ]
      : [{ r: "sys", t: "기술서를 생성하고 있습니다. 잠시만 기다려주세요..." }]
  );
  const [input,   setInput]   = useState("");
  const chatRef               = useRef();

  /* 생성 시뮬레이션 */
  useEffect(() => {
    if (done) return;
    let idx = 0;
    const iv = setInterval(() => {
      if (idx >= NODE_LIST.length) {
        clearInterval(iv);
        setDone(true);
        setTab("revision");
        setMessages([{ r: "sys", t: "생성이 완료되었습니다. 수정이 필요한 내용을 자유롭게 입력하세요." }]);
        return;
      }
      setNodeStates(p => p.map((n, i) =>
        i === idx     ? { ...n, status: "done",    time: (Math.random() * 9 + 1.5).toFixed(1) + "s" } :
        i === idx + 1 ? { ...n, status: "running" } : n
      ));
      idx++;
    }, 520);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  const send = () => {
    if (!input.trim() || !done) return;
    const msg = input.trim();
    setInput("");
    setMessages(p => [...p, { r: "user", t: msg }]);
    setTimeout(() => {
      setMessages(p => [
        ...p,
        { r: "sys",  t: `요청 내용: ${msg}\n재실행 노드: Node 4\n연결 실행: Node 4 → Node 5b → Node 7 → Node 8 → Node 9\n예상 처리: 관련 섹션 카피 재생성 및 하위 노드 연쇄 실행\n\n진행하시겠습니까?` },
        { r: "btns" },
      ]);
    }, 700);
  };

  const doneCount = nodeStates.filter(n => n.status === "done").length;
  const pct       = Math.round(doneCount / NODE_LIST.length * 100);

  /* ── 사이드바 내부 콘텐츠 ── */
  const SidebarContent = () => (
    <div style={{ padding: "0 16px 14px" }}>
      <div style={{ padding: "12px 0", borderTop: "1px solid rgba(255,255,255,.07)", marginBottom: 10 }}>
        <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 9px", borderRadius: 6, border: "1px solid rgba(255,255,255,.12)", background: "rgba(255,255,255,.05)", cursor: "pointer", fontSize: 10.5, color: "rgba(255,255,255,.45)", width: "100%" }}>
          <ArrowLeft size={10} />목록으로
        </button>
      </div>
      <p style={{ fontSize: 9.5, color: "rgba(255,255,255,.28)", marginBottom: 4, fontWeight: 500 }}>현재 상품</p>
      <p style={{ fontSize: 11.5, fontWeight: 600, color: "rgba(255,255,255,.8)", lineHeight: 1.4, marginBottom: 6 }}>{product?.name}</p>
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 12 }}>
        <span style={{ fontSize: 9.5, padding: "1px 7px", borderRadius: 9999, background: "rgba(255,255,255,.08)", color: "rgba(255,255,255,.4)" }}>{product?.category || "미분류"}</span>
        <span style={{ fontSize: 9.5, padding: "1px 7px", borderRadius: 9999, background: product?.mode === "experiment" ? "rgba(245,158,11,.15)" : "rgba(37,99,235,.15)", color: product?.mode === "experiment" ? "#FCD34D" : "#93C5FD" }}>
          {product?.mode === "experiment" ? "테스트" : "운영"}
        </span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontSize: 9.5, color: "rgba(255,255,255,.28)", fontWeight: 500 }}>진행률</span>
        <span style={{ fontSize: 10, color: done ? "#34D399" : "#FBBF24", fontWeight: 600 }}>{pct}%</span>
      </div>
      <div style={{ height: 4, background: "rgba(255,255,255,.08)", borderRadius: 9999, marginBottom: 10 }}>
        <div style={{ height: "100%", borderRadius: 9999, background: done ? "#34D399" : ACCENT, width: `${pct}%`, transition: "width .4s ease" }} />
      </div>
      {nodeStates.map(n => (
        <div key={String(n.id)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "2.5px 0" }}>
          <div style={{ width: 11, height: 11, borderRadius: "50%", background: n.status === "done" ? "#34D399" : n.status === "running" ? "#FBBF24" : "rgba(255,255,255,.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            {n.status === "done"    && <Check size={6} color="#fff" strokeWidth={3} />}
            {n.status === "running" && <div style={{ width: 5, height: 5, borderRadius: "50%", border: "1.5px solid #fff", borderTopColor: "transparent", animation: "spin .8s linear infinite" }} />}
          </div>
          <span style={{ fontSize: 9, color: n.status === "done" ? "rgba(255,255,255,.6)" : n.status === "running" ? "#FCD34D" : "rgba(255,255,255,.2)", lineHeight: 1.4 }}>
            {n.parallel ? "(병렬) " : ""}{n.name}
          </span>
          {n.time && <span style={{ marginLeft: "auto", fontSize: 8, color: "rgba(255,255,255,.18)" }}>{n.time}</span>}
        </div>
      ))}
    </div>
  );

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <Sidebar extra={<SidebarContent />} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* ── 상단 헤더 ── */}
        <div style={{ background: "#fff", borderBottom: `1px solid ${BORDER}`, padding: "10px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <h2 style={{ fontSize: 14.5, fontWeight: 700, color: TEXT }}>{product?.name}</h2>
            {done
              ? <span style={{ fontSize: 9.5, fontWeight: 600, padding: "2px 7px", borderRadius: 9999, background: "#ECFDF5", color: "#059669", display: "flex", alignItems: "center", gap: 3 }}><Check size={9} />생성 완료</span>
              : <span className="pulse" style={{ fontSize: 9.5, fontWeight: 600, padding: "2px 7px", borderRadius: 9999, background: "#FFFBEB", color: "#D97706", display: "flex", alignItems: "center", gap: 3 }}><Clock size={9} />생성 중</span>
            }
          </div>
          {done && product?.mode === "production" && (
            <button className="bp" style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 13px", borderRadius: 7, border: "none", background: ACCENT, color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
              <Package size={11} />플랫폼 등록
            </button>
          )}
          {done && product?.mode === "experiment" && (
            <span style={{ fontSize: 10.5, color: "#D97706", background: "#FEF3C7", padding: "4px 10px", borderRadius: 9999, fontWeight: 500 }}>
              Experiment 모드 · 등록 차단됨
            </span>
          )}
        </div>

        {/* ── 본문 ── */}
        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
          {/* HTML 미리보기 */}
          <div style={{ flex: 1, overflowY: "auto", background: "#F1F5F9", padding: "16px" }}>
            <div style={{ maxWidth: 860, margin: "0 auto" }}>
              {done ? <HTMLPreview name={product?.name} /> : <GeneratingPlaceholder />}
            </div>
          </div>

          {/* ── 우측 패널 ── */}
          <div style={{ width: 356, borderLeft: `1px solid ${BORDER}`, display: "flex", flexDirection: "column", background: "#fff", flexShrink: 0 }}>
            {/* 탭 헤더 */}
            <div style={{ display: "flex", borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
              {[["progress", "노드 현황"], ["revision", "텍스트 수정"]].map(([v, l]) => (
                <button key={v} onClick={() => setTab(v)} style={{ flex: 1, padding: "10px 0", border: "none", background: "none", cursor: "pointer", fontSize: 12, fontWeight: tab === v ? 700 : 400, color: tab === v ? ACCENT : MUTED, borderBottom: `2px solid ${tab === v ? ACCENT : "transparent"}`, transition: "all .15s" }}>{l}</button>
              ))}
            </div>

            {/* ── 노드 현황 탭 ── */}
            {tab === "progress" && (
              <div style={{ flex: 1, overflowY: "auto" }}>
                {/* 진행률 */}
                <div style={{ padding: "12px 15px 10px", borderBottom: `1px solid ${BORDER}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: MUTED }}>전체 진행률</span>
                    <span style={{ fontSize: 12.5, fontWeight: 700, color: done ? "#059669" : ACCENT }}>{pct}%</span>
                  </div>
                  <div style={{ height: 5, background: SURFACE, borderRadius: 9999 }}>
                    <div style={{ height: "100%", background: done ? "#10B981" : ACCENT, width: `${pct}%`, transition: "width .4s", borderRadius: 9999 }} />
                  </div>
                  {done && (
                    <p style={{ fontSize: 10, color: MUTED, marginTop: 6 }}>
                      노드 행을 클릭하면 산출물을 확인할 수 있습니다.
                    </p>
                  )}
                </div>

                {/* 노드 목록 */}
                {nodeStates.map(n => (
                  <NodeRow
                    key={String(n.id)}
                    node={n}
                    expanded={expandedId === String(n.id)}
                    onToggle={() => {
                      if (n.status !== "done") return;
                      setExpandedId(prev => prev === String(n.id) ? null : String(n.id));
                    }}
                  />
                ))}
              </div>
            )}

            {/* ── 텍스트 수정 탭 ── */}
            {tab === "revision" && (
              <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                <div style={{ padding: "8px 13px", background: done ? ACCENT_LIGHT : SURFACE, borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
                  <p style={{ fontSize: 10.5, color: done ? ACCENT : MUTED, fontWeight: done ? 500 : 400, lineHeight: 1.5 }}>
                    {done ? "Node 10 · 수정 요청을 입력하면 AI가 재실행 노드를 자동으로 판단합니다." : "생성 완료 후 수정 기능이 활성화됩니다."}
                  </p>
                </div>
                <div ref={chatRef} style={{ flex: 1, overflowY: "auto", padding: 13 }}>
                  {messages.map((msg, i) => (
                    <div key={i} className="fi" style={{ marginBottom: 11 }}>
                      {msg.r === "user" ? (
                        <div style={{ display: "flex", justifyContent: "flex-end" }}>
                          <div style={{ maxWidth: "84%", background: ACCENT, color: "#fff", borderRadius: "10px 10px 2px 10px", padding: "7px 11px", fontSize: 11.5, lineHeight: 1.55 }}>{msg.t}</div>
                        </div>
                      ) : msg.r === "btns" ? (
                        <div style={{ display: "flex", gap: 6, paddingLeft: 30, marginTop: 5 }}>
                          <button style={{ padding: "4px 12px", borderRadius: 6, border: "none", background: ACCENT, color: "#fff", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>확인</button>
                          <button style={{ padding: "4px 12px", borderRadius: 6, border: `1px solid ${BORDER}`, background: "#fff", fontSize: 11, cursor: "pointer", color: MUTED }}>취소</button>
                        </div>
                      ) : (
                        <div style={{ display: "flex", gap: 7, alignItems: "flex-start" }}>
                          <div style={{ width: 22, height: 22, borderRadius: 7, background: ACCENT, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Zap size={10} color="#fff" /></div>
                          <div style={{ maxWidth: "87%", background: SURFACE, borderRadius: "2px 10px 10px 10px", padding: "7px 11px", fontSize: 11.5, lineHeight: 1.6, color: TEXT, whiteSpace: "pre-wrap", border: `1px solid ${BORDER}` }}>{msg.t}</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div style={{ padding: "10px 13px", borderTop: `1px solid ${BORDER}`, flexShrink: 0 }}>
                  <div style={{ display: "flex", gap: 7, alignItems: "flex-end" }}>
                    <textarea
                      placeholder={done ? "수정 내용 입력... (Enter 전송)" : "생성 완료 후 활성화"}
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      disabled={!done}
                      onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
                      rows={2}
                      style={{ flex: 1, padding: "7px 10px", borderRadius: 7, border: `1px solid ${BORDER}`, fontSize: 11.5, resize: "none", outline: "none", fontFamily: "inherit", color: TEXT, background: done ? "#fff" : SURFACE, opacity: done ? 1 : .6 }}
                    />
                    <button onClick={send} disabled={!done || !input.trim()} style={{ width: 33, height: 33, borderRadius: 7, border: "none", background: done && input.trim() ? ACCENT : "#E2E8F0", cursor: done && input.trim() ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Send size={12} color={done && input.trim() ? "#fff" : "#94A3B8"} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   NODE ROW — 클릭 시 산출물 펼침
───────────────────────────────────────────────────── */
function NodeRow({ node, expanded, onToggle }) {
  const output    = NODE_OUTPUTS[node.id];
  const canExpand = node.status === "done" && output;

  const statusDot = () => {
    if (node.status === "done")
      return <Check size={9} color="#10B981" strokeWidth={2.5} />;
    if (node.status === "running")
      return <Loader size={9} color="#F59E0B" className="spin" />;
    return <Clock size={9} color="#CBD5E1" />;
  };

  const ringColor = node.status === "done" ? "#10B981" : node.status === "running" ? "#F59E0B" : BORDER;
  const ringBg    = node.status === "done" ? "#ECFDF5" : node.status === "running" ? "#FFFBEB" : SURFACE;

  return (
    <div style={{ borderBottom: `1px solid ${BORDER}` }}>
      {/* 헤더 행 */}
      <div
        onClick={canExpand ? onToggle : undefined}
        style={{
          display: "flex", alignItems: "flex-start", gap: 9, padding: "9px 14px",
          cursor: canExpand ? "pointer" : "default",
          background: expanded ? "#F8F9FF" : "#fff",
          transition: "background .12s",
        }}
      >
        <div style={{ width: 21, height: 21, borderRadius: "50%", background: ringBg, border: `1.5px solid ${ringColor}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
          {statusDot()}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 11.5, fontWeight: 600, color: node.status === "waiting" ? "#CBD5E1" : TEXT }}>
              Node {node.id}{node.parallel ? " (병렬)" : ""}
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              {node.time && <span style={{ fontSize: 10, color: MUTED }}>{node.time}</span>}
              {canExpand && (
                expanded
                  ? <ChevronDown  size={13} color={MUTED} />
                  : <ChevronRight size={13} color={MUTED} />
              )}
            </div>
          </div>
          <p style={{ fontSize: 10.5, color: node.status === "waiting" ? "#CBD5E1" : MUTED }}>{node.name}</p>
          <p style={{ fontSize: 9.5, color: "#94A3B8" }}>{node.desc}</p>
        </div>
      </div>

      {/* 산출물 상세 패널 */}
      {canExpand && expanded && output && (
        <div className="fi" style={{ background: "#F8F9FF", borderTop: `1px solid ${BORDER}`, padding: "11px 14px 14px" }}>

          {/* Validator 배지 */}
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 11 }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 4, padding: "3px 8px",
              borderRadius: 9999,
              background: output.validator.result === "pass" ? "#ECFDF5" : "#FFFBEB",
              border: `1px solid ${output.validator.result === "pass" ? "#A7F3D0" : "#FDE68A"}`,
            }}>
              {output.validator.result === "pass"
                ? <Check size={9} color="#059669" strokeWidth={3} />
                : <AlertCircle size={9} color="#D97706" />}
              <span style={{ fontSize: 9.5, fontWeight: 700, color: output.validator.result === "pass" ? "#059669" : "#D97706" }}>
                Auto-Validator: {output.validator.result === "pass" ? "PASS" : "PARTIAL"}
              </span>
            </div>
            {output.validator.issues.length > 0 && (
              <span style={{ fontSize: 9.5, color: "#D97706" }}>{output.validator.issues.join(", ")}</span>
            )}
          </div>

          {/* 섹션별 테이블 */}
          {output.sections.map((sec, si) => (
            <div key={si} style={{ marginBottom: si < output.sections.length - 1 ? 13 : 0 }}>
              <div style={{ fontSize: 9.5, fontWeight: 700, color: MUTED, letterSpacing: ".3px", marginBottom: 6, paddingBottom: 4, borderBottom: `1px solid ${BORDER}` }}>
                {sec.title}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {sec.rows.map((row, ri) => (
                  <div key={ri} style={{ display: "flex", gap: 7, alignItems: "flex-start" }}>
                    <span style={{ fontSize: 10, color: "#94A3B8", flexShrink: 0, width: 88, lineHeight: 1.55, paddingTop: 1 }}>
                      {row.label}
                    </span>
                    <span style={{ fontSize: 10.5, color: TEXT, lineHeight: 1.55, flex: 1 }}>
                      {row.value}
                      {row.tag && (
                        <span style={{
                          marginLeft: 5, padding: "1px 5px", borderRadius: 4, fontSize: 9, fontWeight: 700,
                          background: row.tag === "DATA_REQUIRED" ? "#FEF2F2"
                                    : row.tag === "SAMPLE"        ? "#FFFBEB"
                                    : row.tag === "수정됨"        ? "#FEF3C7"
                                    : row.tag === "대표"          ? "#EEF2FF"
                                    : "#F0FDF4",
                          color:      row.tag === "DATA_REQUIRED" ? "#EF4444"
                                    : row.tag === "SAMPLE"        ? "#D97706"
                                    : row.tag === "수정됨"        ? "#B45309"
                                    : row.tag === "대표"          ? ACCENT
                                    : "#059669",
                        }}>
                          {row.tag}
                        </span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   HTML 미리보기 목
───────────────────────────────────────────────────── */
function HTMLPreview({ name }) {
  const secs = [
    {
      id: 1, nm: "Brand", bg: "#1E293B", h: 148,
      body: () => (
        <>
          <div style={{ fontSize: 9.5, color: "rgba(255,255,255,.4)", marginBottom: 5 }}>브랜드 소개</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#fff", lineHeight: 1.3 }}>자연이 키운 맛,<br />신뢰가 만든 품질</div>
        </>
      ),
    },
    {
      id: 2, nm: "Intro", bg: "#1E3A5F", h: 195,
      body: () => (
        <>
          <div style={{ fontSize: 21, fontWeight: 800, color: "#fff", lineHeight: 1.25, marginBottom: 10 }}>아이가 먼저 찾는<br />{name}</div>
          <div style={{ display: "flex", gap: 7 }}>
            {["산지 직송", "당도 낮은 품종", "인증 농가"].map(t => (
              <span key={t} style={{ fontSize: 10, fontWeight: 600, padding: "3px 9px", borderRadius: 9999, border: "1px solid rgba(255,255,255,.3)", color: "rgba(255,255,255,.8)" }}>{t}</span>
            ))}
          </div>
        </>
      ),
    },
    {
      id: 3, nm: "Problem", bg: "#F8FAFC", h: 125, border: true,
      body: () => (
        <>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: TEXT, marginBottom: 9 }}>이런 고민, 있으신가요?</div>
          {["국내산인지 확인이 안 돼서 불안하셨나요?", "아이 간식으로 당도가 높을까봐 걱정되셨나요?"].map(q => (
            <div key={q} style={{ fontSize: 11.5, color: "#475569", padding: "4px 0", display: "flex", gap: 6, alignItems: "center" }}>
              <div style={{ width: 4, height: 4, borderRadius: "50%", background: ACCENT, flexShrink: 0 }} />{q}
            </div>
          ))}
        </>
      ),
    },
    {
      id: 4, nm: "Body", bg: "#F8FAFC", h: 175, border: true,
      body: () => (
        <>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: TEXT, marginBottom: 10 }}>왜 이 상품이어야 할까요?</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {[
              ["USP 1 · 신선도", "산지 직송, 중간 유통 없는 신선함"],
              ["USP 2 · 안전",   "당 낮은 황금 품종, 아이 간식 걱정 없음"],
              ["USP 3 · 인증",   "제주 인증 농가, 원산지 투명 공개"],
              ["USP 4 · 가치",   "국내 평균 대비 합리적인 가격"],
            ].map(([u, d]) => (
              <div key={u} style={{ padding: "9px 11px", background: ACCENT_LIGHT, borderRadius: 7 }}>
                <div style={{ fontSize: 10, color: ACCENT, fontWeight: 700, marginBottom: 2 }}>{u}</div>
                <div style={{ fontSize: 10.5, color: MUTED, lineHeight: 1.4 }}>{d}</div>
              </div>
            ))}
          </div>
        </>
      ),
    },
    {
      id: 5, nm: "Verification-1", bg: "#F0FDF4", h: 108,
      body: () => (
        <>
          <div style={{ fontSize: 12.5, fontWeight: 700, color: "#166534", marginBottom: 7 }}>실사용 후기</div>
          <div style={{ fontSize: 10.5, color: "#166534", opacity: .8 }}>[SAMPLE] 구매자 만족도 4.8점 · 후기 3,200건 기반</div>
          <div style={{ fontSize: 10.5, color: "#166534", opacity: .7, marginTop: 5 }}>[SAMPLE] "아이가 너무 좋아해서 두 번째 주문이에요."</div>
        </>
      ),
    },
    {
      id: 6, nm: "Verification-2", bg: "#EFF6FF", h: 108,
      body: () => (
        <>
          <div style={{ fontSize: 12.5, fontWeight: 700, color: "#1D4ED8", marginBottom: 7 }}>인증 정보</div>
          <div style={{ display: "flex", gap: 7 }}>
            {["제주 인증 농가", "원산지 제주", "GAP 인증"].map(c => (
              <span key={c} style={{ fontSize: 10, padding: "2px 8px", borderRadius: 9999, background: "#DBEAFE", color: "#1D4ED8", fontWeight: 500 }}>{c}</span>
            ))}
          </div>
        </>
      ),
    },
    {
      id: 7, nm: "Purchase", bg: "#F8FAFC", h: 155, border: true,
      body: () => (
        <>
          <div style={{ fontSize: 12.5, fontWeight: 700, color: TEXT, marginBottom: 8 }}>FAQ</div>
          {[
            "황금 고구마와 일반 고구마의 차이는 무엇인가요?",
            "이 제품은 어떻게 보관하나요?",
            "배송은 얼마나 걸리나요?",
            "교환/반품이 가능한가요?",
          ].map((q, i, a) => (
            <div key={q} style={{ padding: "5px 0", borderBottom: i < a.length - 1 ? `1px solid ${BORDER}` : "none" }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: TEXT }}>Q. {q}</div>
              <div style={{ fontSize: 10.5, color: MUTED }}>A. 해당 질문에 대한 명확한 답변이 표시됩니다.</div>
            </div>
          ))}
        </>
      ),
    },
    {
      id: 8, nm: "Operation", bg: "#fff", h: 155, border: true,
      body: () => (
        <>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#475569", marginBottom: 9 }}>공식 인증 정보 · 법정 필수 표기사항</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3 }}>
            {[["제품명", "제주 황금 고구마"], ["원산지", "제주특별자치도"], ["내용량", "3kg"], ["보관방법", "서늘하고 통풍 좋은 곳"], ["유통기한", "[DATA_REQUIRED]"], ["AS안내", "[DATA_REQUIRED]"]].map(([f, v]) => (
              <div key={f} style={{ display: "flex", gap: 8, fontSize: 10, padding: "3px 0" }}>
                <span style={{ color: "#94A3B8", width: 56, flexShrink: 0 }}>{f}</span>
                <span style={{ color: v.startsWith("[DATA") ? "#EF4444" : "#475569" }}>{v}</span>
              </div>
            ))}
          </div>
        </>
      ),
    },
  ];

  return (
    <div style={{ background: "#fff", borderRadius: 8, overflow: "hidden", border: `1px solid ${BORDER}`, boxShadow: "0 4px 20px rgba(0,0,0,.07)" }}>
      {secs.map(s => (
        <div key={s.id} style={{ background: s.bg, padding: "18px 22px", borderBottom: s.border ? `1px solid ${BORDER}` : "none", minHeight: s.h, display: "flex", flexDirection: "column", justifyContent: "center", position: "relative" }}>
          <div style={{ position: "absolute", top: 7, right: 9, fontSize: 8.5, opacity: .3, fontWeight: 600, color: s.id <= 2 ? "#fff" : TEXT }}>
            Section {s.id} · {s.nm}
          </div>
          {s.body()}
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   GENERATING PLACEHOLDER
───────────────────────────────────────────────────── */
function GeneratingPlaceholder() {
  return (
    <div style={{ background: "#fff", borderRadius: 9, border: `1px solid ${BORDER}`, padding: "56px 28px", textAlign: "center" }}>
      <div style={{ width: 42, height: 42, borderRadius: "50%", border: `3px solid ${ACCENT}`, borderTopColor: "transparent", margin: "0 auto 14px", animation: "spin 1s linear infinite" }} />
      <p style={{ fontSize: 14.5, fontWeight: 600, color: TEXT, marginBottom: 5 }}>상품기술서를 생성하고 있습니다</p>
      <p style={{ fontSize: 11.5, color: MUTED }}>11개 AI 노드가 순차적으로 실행됩니다.</p>
      <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 18, flexWrap: "wrap" }}>
        {["이미지 분석", "페르소나 선정", "전략 수립", "카피 생성"].map((s, i) => (
          <div key={s} className="pulse" style={{ animationDelay: `${i * 0.32}s`, padding: "4px 10px", borderRadius: 9999, background: ACCENT_LIGHT, fontSize: 11, color: ACCENT, fontWeight: 500 }}>
            {s}
          </div>
        ))}
      </div>
    </div>
  );
}

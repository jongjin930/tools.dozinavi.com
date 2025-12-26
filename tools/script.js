// --- Data Definitions ---
const CATEGORIES = [
    { id: 'content', title: '블로그·콘텐츠 도구', icon: 'edit_note' },
    { id: 'storage', title: '나만의 저장소', icon: 'folder_open' },
    { id: 'calc', title: '생활 계산기 도구', icon: 'calculate' },
    { id: 'aid', title: '정부지원·생활정보 안내', icon: 'account_balance' },
    { id: 'fun', title: '취미·확률 도구', icon: 'sports_esports' },
];

const TOOLS = [
    // 블로그·콘텐츠 도구 (content)
    { 
        id: 'charcount', 
        name: '글자 수 세기', 
        desc: '공백 포함/제외 글자 수 및 바이트 계산', 
        href: '/charcount', 
        icon: 'notes', 
        colorClass: 'bg-red-500', 
        category: 'content' 
    },
    { 
        id: 'sentence', 
        name: '문장 길이 분석기', 
        desc: '문장 개수 및 가독성 최적화 분석', 
        href: '/sentence-length', 
        icon: 'straighten', 
        colorClass: 'bg-orange-500', 
        category: 'content' 
    },
    { 
        id: 'freq', 
        name: '단어 빈도수 분석기', 
        desc: '자주 사용된 핵심 키워드 추출', 
        href: '/word-frequency', 
        icon: 'bar_chart', 
        colorClass: 'bg-amber-500', 
        category: 'content' 
    },
    { 
        id: 'case', 
        name: '대소문자 변환기', 
        desc: '영어 대문자/소문자 일괄 변환', 
        href: '/case-converter', 
        icon: 'text_fields', 
        colorClass: 'bg-yellow-500', 
        category: 'content' 
    },
    { 
        id: 'cleaner', 
        name: '줄바꿈/공백 정리기', 
        desc: '불필요한 공백과 줄바꿈 자동 제거', 
        href: '/text-cleaner', 
        icon: 'cleaning_services', 
        colorClass: 'bg-lime-500', 
        category: 'content' 
    },
    { 
        id: 'convert', 
        name: '이미지 변환기', 
        desc: 'WebP, JPG, PNG 포맷 간편 변환', 
        href: '/convert', 
        icon: 'image', 
        colorClass: 'bg-green-500', 
        category: 'content' 
    },

    // 나만의 저장소 (storage)
    { 
        id: 'memo', 
        name: '임시 메모장', 
        desc: '브라우저에 저장되는 휘발성 메모', 
        href: '/memo', 
        icon: 'edit', 
        colorClass: 'bg-emerald-500', 
        category: 'storage' 
    },
    { 
        id: 'snippets', 
        name: '나만의 문구 저장소', 
        desc: '자주 쓰는 상용구 저장 및 복사', 
        href: '/snippets', 
        icon: 'content_paste', 
        colorClass: 'bg-teal-500', 
        category: 'storage' 
    },

    // 생활 계산기 도구 (calc)
    { 
        id: 'salary', 
        name: '시급/월급 변환기', 
        desc: '최저시급 기준 월급/연봉 환산', 
        href: '/salary', 
        icon: 'payments', 
        colorClass: 'bg-cyan-500', 
        category: 'calc' 
    },
    { 
        id: 'severance', 
        name: '퇴직금 계산기', 
        desc: '근속연수에 따른 예상 퇴직금 조회', 
        href: '/severance-pay', 
        icon: 'work_history', 
        colorClass: 'bg-sky-500', 
        category: 'calc' 
    },
    { 
        id: 'insurance', 
        name: '4대 보험 계산기', 
        desc: '국민연금, 건강보험료 등 공제액 계산', 
        href: '/insurance', 
        icon: 'health_and_safety', 
        colorClass: 'bg-blue-500', 
        category: 'calc' 
    },
    { 
        id: 'weekpay', 
        name: '주휴수당 계산기', 
        desc: '근로 시간에 따른 주휴수당 확인', 
        href: '/week-pay', 
        icon: 'calendar_view_week', 
        colorClass: 'bg-indigo-500', 
        category: 'calc' 
    },
    { 
        id: 'realestate', 
        name: '부동산 수수료 계산기', 
        desc: '매매/전세/월세 중개보수료 계산', 
        href: '/real-estate-fee', 
        icon: 'home_work', 
        colorClass: 'bg-violet-500', 
        category: 'calc' 
    },
    { 
        id: 'vat', 
        name: '부가세 계산기', 
        desc: '공급가액 및 부가가치세(VAT) 산출', 
        href: '/vat-calculator', 
        icon: 'receipt_long', 
        colorClass: 'bg-purple-500', 
        category: 'calc' 
    },

    // 정부지원·생활정보 안내 (aid)
    { 
        id: 'eitc', 
        name: '근로장려금 안내', 
        desc: '신청 자격 및 지급액 모의 조회', 
        href: '/eitc', 
        icon: 'account_balance_wallet', 
        colorClass: 'bg-fuchsia-500', 
        category: 'aid' 
    },
    { 
        id: 'ctc', 
        name: '자녀장려금 안내', 
        desc: '자녀 양육 지원금 정보 확인', 
        href: '/ctc', 
        icon: 'child_care', 
        colorClass: 'bg-pink-500', 
        category: 'aid' 
    },
    { 
        id: 'emergency', 
        name: '긴급 복지지원 안내', 
        desc: '위기 상황 발생 시 긴급생계비 지원', 
        href: '/emergency-welfare', 
        icon: 'emergency', 
        colorClass: 'bg-rose-500', 
        category: 'aid' 
    },
    { 
        id: 'basic', 
        name: '기초생활보장 안내', 
        desc: '생계, 의료, 주거급여 수급 자격', 
        href: '/basic-welfare', 
        icon: 'accessibility_new', 
        colorClass: 'bg-red-400', 
        category: 'aid' 
    },
    { 
        id: 'org', 
        name: '전국 관공서 전화번호', 
        desc: '시청, 구청, 주민센터 연락처 검색', 
        href: '/org-contacts/', 
        icon: 'contact_phone', 
        colorClass: 'bg-orange-400', 
        category: 'aid' 
    },

    // 취미·확률 도구 (fun)
    { 
        id: 'lotto', 
        name: '로또 번호 생성기', 
        desc: '운세 기반 행운의 번호 추출', 
        href: '/lotto', 
        icon: 'casino', 
        colorClass: 'bg-amber-400', 
        category: 'fun' 
    },
    { 
        id: 'dice', 
        name: '주사위 던지기', 
        desc: '간단한 내기용 3D 주사위 게임', 
        href: '/dice/', 
        icon: 'deployed_code', 
        colorClass: 'bg-yellow-400', 
        category: 'fun' 
    },
];

// --- HTML Generators ---

function createToolCardHTML(tool) {
    // Generates the HTML for a single tool card.
    // Includes Icon, Title, and the new Description field.
    return `
    <a class="tool-card group" href="${tool.href}">
        <div class="glass-icon ${tool.colorClass}">
            <span class="material-symbols-outlined text-white">
                ${tool.icon}
            </span>
        </div>
        <div class="tool-text-container">
            <span class="tool-title">
                ${tool.name}
            </span>
            <span class="tool-desc">
                ${tool.desc}
            </span>
        </div>
    </a>
    `;
}

function createAdCardHTML() {
    // Renders a small square ad card for mobile/grid view
    return `
    <div class="tool-card xl:hidden">
        <div class="glass-icon ad-icon-bg flex flex-col items-center justify-center border-2 border-slate-300 dark:border-slate-600">
            <span class="text-[10px] font-bold text-slate-400 dark:text-slate-500 z-10">AD</span>
            <span class="material-symbols-outlined text-slate-400 dark:text-slate-500 mt-1 z-10" style="font-size: 24px !important;">shopping_bag</span>
            <div class="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>
        <div class="tool-text-container">
            <span class="tool-title text-slate-500 dark:text-slate-400">Sponsored</span>
            <span class="tool-desc">Advertisement</span>
        </div>
    </div>
    `;
}

function createSectionHTML(category, toolsHTML, showAd) {
    const adHTML = showAd ? createAdCardHTML() : '';
    
    return `
    <section>
        <div class="flex items-center gap-2 mb-5 px-2 border-b border-slate-200/50 dark:border-slate-700/50 pb-2">
            <span class="material-symbols-outlined text-primary text-xl" style="font-size: 24px !important;">${category.icon}</span>
            <h2 class="text-sm font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase">
                ${category.title}
            </h2>
        </div>
        <div class="tools-grid">
            ${toolsHTML}
            ${adHTML}
        </div>
    </section>
    `;
}

// --- Main Render Function ---

function renderTools(filterText = '') {
    const container = document.getElementById('tools-container');
    const noResults = document.getElementById('no-results');
    
    if (!container) return;

    container.innerHTML = ''; // Clear existing content
    
    let hasResults = false;
    const normalizedFilter = filterText.toLowerCase();

    // Filter tools based on name, category, OR description
    const filteredTools = TOOLS.filter(tool => 
        tool.name.toLowerCase().includes(normalizedFilter) ||
        tool.category.toLowerCase().includes(normalizedFilter) ||
        tool.desc.toLowerCase().includes(normalizedFilter)
    );

    // Iterate through defined categories to maintain order
    CATEGORIES.forEach((category, index) => {
        // Get tools for this category that match search
        const categoryTools = filteredTools.filter(t => t.category === category.id);
        
        if (categoryTools.length > 0) {
            hasResults = true;
            
            // Generate HTML for tools in this category
            const toolsHTML = categoryTools.map(createToolCardHTML).join('');
            
            // Show inline ad card in 1st (index 0) and 3rd (index 2) categories for variety
            const showAd = (index === 0 || index === 2);
            
            // Append section to container
            container.innerHTML += createSectionHTML(category, toolsHTML, showAd);
        }
    });

    // Toggle No Results view
    if (hasResults) {
        noResults.classList.add('hidden');
        noResults.classList.remove('flex');
        container.classList.remove('hidden');
    } else {
        noResults.classList.remove('hidden');
        noResults.classList.add('flex');
        container.classList.add('hidden');
    }
}

// --- Initialization ---

document.addEventListener('DOMContentLoaded', () => {
    // Initial render
    renderTools();

    // --- Search Functionality ---
    const desktopSearch = document.getElementById('desktop-search');
    const mobileSearch = document.getElementById('mobile-search');
    const mobileSearchToggle = document.getElementById('mobile-search-toggle');
    const mobileSearchContainer = document.getElementById('mobile-search-container');

    const handleSearch = (e) => {
        const term = e.target.value;
        // Sync inputs between desktop and mobile to keep state consistent
        if (e.target.id === 'desktop-search' && mobileSearch) mobileSearch.value = term;
        if (e.target.id === 'mobile-search' && desktopSearch) desktopSearch.value = term;
        
        renderTools(term);
    };

    if (desktopSearch) desktopSearch.addEventListener('input', handleSearch);
    if (mobileSearch) mobileSearch.addEventListener('input', handleSearch);

    // --- Mobile Search Toggle ---
    if (mobileSearchToggle && mobileSearchContainer) {
        mobileSearchToggle.addEventListener('click', () => {
            mobileSearchContainer.classList.toggle('hidden');
            if (!mobileSearchContainer.classList.contains('hidden')) {
                // Focus input when opened
                setTimeout(() => mobileSearch.focus(), 100);
            }
        });
    }

    // --- AdSense Error Handling (Optional) ---
    // Prevents console errors if Ad blockers are active
    try {
        (adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
        console.log("AdSense failed to load (likely blocked by client).");
    }
});
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Trash2,
  Calendar,
  Calculator,
  CheckSquare,
  Search,
  CheckCircle2,
  Info,
  Scroll,
  ArrowRight,
} from 'lucide-react';
import { TRASH_ITEMS } from '../../data/initialData';
import { ChecklistItem, Language, TrashItem, VisaTrackerState } from '../../types';
import {
  getTrashName,
  getTrashInstructions,
  getChecklistTitle,
  getChecklistDesc,
} from '../../utils/localization';

interface ToolsScreenProps {
  language: Language;
  checklists: ChecklistItem[];
  onToggleChecklist: (id: string) => void;
  visaState: VisaTrackerState;
  onUpdateVisaState: (state: VisaTrackerState) => void;
  onOpenRitesQuiz?: () => void;
}

type ActiveSubTool = 'trash' | 'visa' | 'wage' | 'checklist';

export const ToolsScreen: React.FC<ToolsScreenProps> = ({
  language,
  checklists,
  onToggleChecklist,
  visaState,
  onUpdateVisaState,
  onOpenRitesQuiz,
}) => {
  const { t } = useTranslation();
  const [activeSubTool, setActiveSubTool] = useState<ActiveSubTool>('trash');

  // Trash Sorter State
  const [trashQuery, setTrashQuery] = useState('');
  const [trashCategoryFilter, setTrashCategoryFilter] = useState<'all' | 'food' | 'general' | 'recycle' | 'special'>('all');

  // Visa State Local
  const [localVisaType, setLocalVisaType] = useState(visaState.visaType || 'D-2 (유학/Student)');
  const [localExpiryDate, setLocalExpiryDate] = useState(visaState.expiryDate || '');

  // Wage Calculator State
  const [hourlyWage, setHourlyWage] = useState<number>(10030); // 2025/2026 standard
  const [hoursPerWeek, setHoursPerWeek] = useState<number>(20);
  const [taxOption, setTaxOption] = useState<'freelance' | 'fourInsurances' | 'none'>('freelance');

  // Checklist Filter
  const [checklistStage, setChecklistStage] = useState<'all' | 'week1' | 'month1' | 'month3'>('all');

  // Trash filtering
  const filteredTrash = TRASH_ITEMS.filter((item) => {
    const matchesFilter =
      trashCategoryFilter === 'all' || item.type === trashCategoryFilter;
    const itemName = getTrashName(item, language).toLowerCase();
    const instructions = getTrashInstructions(item, language).toLowerCase();
    const q = trashQuery.toLowerCase();
    const matchesQuery =
      !trashQuery.trim() ||
      itemName.includes(q) ||
      instructions.includes(q) ||
      item.nameKo.toLowerCase().includes(q) ||
      item.nameEn.toLowerCase().includes(q);

    return matchesFilter && matchesQuery;
  });

  // Calculate Visa D-Day
  let visaDaysLeft: number | null = null;
  let isExtensionEligible = false;
  if (localExpiryDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiry = new Date(localExpiryDate);
    expiry.setHours(0, 0, 0, 0);
    const diff = expiry.getTime() - today.getTime();
    visaDaysLeft = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (visaDaysLeft <= 120 && visaDaysLeft >= 0) {
      isExtensionEligible = true;
    }
  }

  const handleSaveVisa = () => {
    onUpdateVisaState({
      visaType: localVisaType,
      expiryDate: localExpiryDate,
      reminderEnabled: true,
    });
  };

  // Calculate Wage & Holiday Allowance
  const baseWeeklyPay = hourlyWage * hoursPerWeek;
  const weeklyHolidayAllowance =
    hoursPerWeek >= 15 ? (hoursPerWeek / 40) * 8 * hourlyWage : 0;
  const totalWeeklyPay = baseWeeklyPay + weeklyHolidayAllowance;
  const monthlyGross = Math.round(totalWeeklyPay * 4.345);
  let taxRate = 0;
  if (taxOption === 'freelance') taxRate = 0.033;
  if (taxOption === 'fourInsurances') taxRate = 0.094;
  const monthlyTax = Math.round(monthlyGross * taxRate);
  const monthlyNet = monthlyGross - monthlyTax;

  // Checklist Progress
  const completedCount = checklists.filter((c) => c.completed).length;
  const totalChecklistCount = checklists.length;
  const checklistPercent =
    totalChecklistCount > 0
      ? Math.round((completedCount / totalChecklistCount) * 100)
      : 0;

  const filteredChecklists = checklists.filter(
    (c) => checklistStage === 'all' || c.stage === checklistStage
  );

  return (
    <div className="space-y-4 pb-8">
      {/* Sub-tool Selection Segmented Tabs with Dancheong Noerok & Vermilion */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 bg-[#EAE4D8]/80 rounded-2xl border border-[#E8E2D6]">
        <button
          onClick={() => setActiveSubTool('trash')}
          className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
            activeSubTool === 'trash'
              ? 'bg-white text-[#3D836E] shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Trash2 className="w-3.5 h-3.5 text-[#3D836E]" />
          <span>{t('toolTrash', '쓰레기 분리배출')}</span>
        </button>

        <button
          onClick={() => setActiveSubTool('visa')}
          className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
            activeSubTool === 'visa'
              ? 'bg-white text-[#DF684E] shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Calendar className="w-3.5 h-3.5 text-[#DF684E]" />
          <span>{t('toolVisa', '체류만료 D-Day')}</span>
        </button>

        <button
          onClick={() => setActiveSubTool('wage')}
          className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
            activeSubTool === 'wage'
              ? 'bg-white text-[#D49B28] shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Calculator className="w-3.5 h-3.5 text-[#D49B28]" />
          <span>{t('toolWage', '알바·급여 계산기')}</span>
        </button>

        <button
          onClick={() => setActiveSubTool('checklist')}
          className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
            activeSubTool === 'checklist'
              ? 'bg-white text-[#253342] shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <CheckSquare className="w-3.5 h-3.5 text-[#253342]" />
          <span>{t('toolChecklist', '정착 체크리스트')}</span>
        </button>
      </div>

      {/* 1. TRASH SORTER SUB-TOOL */}
      {activeSubTool === 'trash' && (
        <div className="space-y-3.5 animate-in fade-in">
          <div className="p-4 rounded-2xl bg-white/95 border border-[#E8E2D6] shadow-2xs space-y-3">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[#253342]">
                {t('trashTitle', '쓰레기 분리배출 스마트 판별기')}
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                {t('trashDesc', '버릴 물건 이름을 검색하면 분리수거 방법과 전용 봉투를 바로 알려드립니다.')}
              </p>
            </div>

            {/* Trash Search */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                value={trashQuery}
                onChange={(e) => setTrashQuery(e.target.value)}
                placeholder={t('trashSearchPlaceholder', '버릴 물건 이름 검색 (예: 치킨뼈, 바나나껍질, 깨진유리)')}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8E2D6] text-xs sm:text-sm text-stone-900 placeholder-stone-400 focus:outline-hidden focus:border-[#3D836E]"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
              {[
                { id: 'all', label: t('trashAll', '전체') },
                { id: 'food', label: t('trashFood', '음식물 쓰레기') },
                { id: 'general', label: t('trashGeneral', '일반 쓰레기') },
                { id: 'recycle', label: t('trashRecycle', '재활용품') },
                { id: 'special', label: t('trashSpecial', '특수/대형 폐기물') },
              ].map((pill) => (
                <button
                  key={pill.id}
                  onClick={() => setTrashCategoryFilter(pill.id as any)}
                  className={`px-3 py-1 text-xs font-medium rounded-lg whitespace-nowrap shrink-0 transition-colors ${
                    trashCategoryFilter === pill.id
                      ? 'bg-[#3D836E] text-white shadow-2xs'
                      : 'bg-[#FAF7F2] text-stone-600 border border-[#E8E2D6]'
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </div>

          {/* Golden Rule Callout (Dancheong Hwang Ochre) */}
          <div className="p-3.5 rounded-xl bg-[#FCF6E8] border border-[#F2D08E] flex items-start gap-2.5">
            <Info className="w-4 h-4 text-[#D49B28] mt-0.5 shrink-0" />
            <div className="text-xs text-[#7A5610] leading-relaxed">
              <strong className="font-semibold">{t('trashRuleTitle', '음식물 쓰레기 핵심 판별 공식:')}</strong>{' '}
              {t('trashRuleDesc', '"동물이 먹을 수 있는 사료인가?" 뼈나 껍질은 일반 종량제 봉투에 버려야 합니다!')}
            </div>
          </div>

          {/* Trash Items List */}
          <div className="space-y-2.5">
            {filteredTrash.length === 0 ? (
              <div className="text-center py-8 bg-white/90 rounded-xl border border-[#E8E2D6]">
                <p className="text-xs text-stone-500">{t('noSearchResults', '검색된 품목이 없습니다.')}</p>
              </div>
            ) : (
              filteredTrash.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl bg-white/95 border border-[#E8E2D6] shadow-2xs flex flex-col justify-between gap-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[#253342]">
                          {getTrashName(item, language)}
                        </span>
                        {item.isCommonMistake && (
                          <span className="text-[10px] font-semibold text-[#C4472D] bg-[#FDF0EC] px-1.5 py-0.2 rounded-md border border-[#F6BCB0]">
                            {t('trashMistakeBadge', '자주 실수하는 품목')}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        {language === 'ko' ? item.nameEn : item.nameKo}
                      </p>
                    </div>

                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-md whitespace-nowrap shrink-0 ${
                        item.type === 'food'
                          ? 'bg-[#FCF6E8] text-[#9A6C16] border border-[#F2D08E]'
                          : item.type === 'general'
                          ? 'bg-stone-100 text-stone-800 border border-stone-200'
                          : item.type === 'recycle'
                          ? 'bg-[#EEF6F3] text-[#255849] border border-[#A3CEC2]'
                          : 'bg-[#FDF0EC] text-[#BA462E] border border-[#F6BCB0]'
                      }`}
                    >
                      {item.type === 'food'
                        ? t('trashFood', '음식물 쓰레기')
                        : item.type === 'general'
                        ? t('trashGeneral', '일반 쓰레기')
                        : item.type === 'recycle'
                        ? t('trashRecycle', '재활용품')
                        : t('trashSpecial', '특수/대형 폐기물')}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-[#F0EBE1] text-xs space-y-1">
                    <p className="text-stone-800 font-medium">
                      📌 {item.disposalBagKo}
                    </p>
                    <p className="text-stone-600 text-[11px] leading-relaxed">
                      {getTrashInstructions(item, language)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 2. VISA D-DAY SUB-TOOL */}
      {activeSubTool === 'visa' && (
        <div className="space-y-3.5 animate-in fade-in">
          <div className="p-4 rounded-2xl bg-white/95 border border-[#E8E2D6] shadow-2xs space-y-4">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[#253342]">
                {t('visaTitle', '체류기간(비자) 만료일 계산기')}
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                {t('visaDesc', '외국인등록증(ARC) 뒷면에 적힌 만료일을 입력하면 남은 기간과 연장 신청 가능일을 분석합니다.')}
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {t('visaTypeLabel', '내 체류자격(비자)')}
                </label>
                <select
                  value={localVisaType}
                  onChange={(e) => setLocalVisaType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#E8E2D6] text-xs sm:text-sm text-stone-900 focus:outline-hidden focus:border-[#3D836E]"
                >
                  <option value="D-2 (유학 / International Student)">D-2 (유학 / Student)</option>
                  <option value="D-4 (어학연수 / General Trainee)">D-4 (어학연수 / Trainee)</option>
                  <option value="D-10 (구직 / Job Seeker)">D-10 (구직 / Job Seeker)</option>
                  <option value="E-7 (특정활동 / Professional Employment)">E-7 (특정활동 / Professional)</option>
                  <option value="E-9 (비전문취업 / Non-professional)">E-9 (비전문취업 / Non-prof)</option>
                  <option value="F-2 (거주 / Resident)">F-2 (거주 / Resident)</option>
                  <option value="F-5 (영주 / Permanent Resident)">F-5 (영주 / Permanent)</option>
                  <option value="F-6 (결혼이민 / Marriage Migrant)">F-6 (결혼이민 / Marriage)</option>
                  <option value="H-2 (방문취업 / Working Visit)">H-2 (방문취업 / Working)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {t('visaExpiryLabel', '외국인등록증 뒷면 만료일')}
                </label>
                <input
                  type="date"
                  value={localExpiryDate}
                  onChange={(e) => setLocalExpiryDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#E8E2D6] text-xs sm:text-sm text-stone-900 focus:outline-hidden focus:border-[#3D836E]"
                />
              </div>

              <button
                onClick={handleSaveVisa}
                className="w-full py-2.5 rounded-xl bg-[#3D836E] hover:bg-[#255849] text-white font-semibold text-xs sm:text-sm shadow-xs transition-colors"
              >
                {t('visaSaveBtn', '만료일 저장 및 D-Day 설정')}
              </button>
            </div>
          </div>

          {/* Visa Analysis Result Card */}
          {visaDaysLeft !== null && (
            <div
              className={`p-4 rounded-2xl border shadow-xs space-y-3 ${
                visaDaysLeft < 0
                  ? 'bg-[#FDF0EC] border-[#F6BCB0]'
                  : visaDaysLeft <= 30
                  ? 'bg-[#FCF6E8] border-[#F2D08E]'
                  : 'bg-[#EEF6F3] border-[#A3CEC2]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#253342]">
                  {t('visaDdayWidgetTitle', '만료일 분석 결과')}
                </span>
                <span
                  className={`text-xl font-extrabold ${
                    visaDaysLeft < 0
                      ? 'text-[#C4472D]'
                      : visaDaysLeft <= 30
                      ? 'text-[#DF684E]'
                      : 'text-[#3D836E]'
                  }`}
                >
                  {visaDaysLeft < 0 ? '만료' : `D-${visaDaysLeft}`}
                </span>
              </div>

              <div className="space-y-1.5 text-xs">
                {visaDaysLeft < 0 ? (
                  <p className="text-[#BA462E] font-semibold leading-relaxed">
                    {t('visaExpired', '체류기간이 이미 지났습니다! 즉시 출입국 1345로 확인하세요.')}
                  </p>
                ) : isExtensionEligible ? (
                  <div className="text-[#255849] font-medium space-y-1">
                    <p>
                      ✅ <strong>{t('visaEligibleText', '지금 연장 신청 가능 기간입니다!')}</strong>
                    </p>
                    <p className="text-[11px] text-stone-600">
                      {t('visaEligibleSub', '하이코리아(hikorea.go.kr)에 접속하여 예약을 잡거나 연장을 신청하세요.')}
                    </p>
                  </div>
                ) : (
                  <p className="text-stone-700">
                    {t('visaPlentyTime', '체류 기간이 충분히 남아 있습니다.')}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. WAGE CALCULATOR SUB-TOOL */}
      {activeSubTool === 'wage' && (
        <div className="space-y-3.5 animate-in fade-in">
          <div className="p-4 rounded-2xl bg-white/95 border border-[#E8E2D6] shadow-2xs space-y-4">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[#253342]">
                {t('wageTitle', '최저임금 & 주휴수당 계산기')}
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                {t('wageDesc', '근로기준법 기준 최저시급 및 주휴수당을 반영한 실수령액을 계산합니다.')}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {t('wageHourRate', '시급 (원)')} (2025/2026: 10,030 KRW)
                </label>
                <input
                  type="number"
                  value={hourlyWage}
                  onChange={(e) => setHourlyWage(Number(e.target.value))}
                  step="100"
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#E8E2D6] text-xs sm:text-sm text-stone-900 focus:outline-hidden focus:border-[#3D836E] font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {t('wageHoursPerWeek', '주당 근무시간 (시간)')}
                </label>
                <input
                  type="number"
                  value={hoursPerWeek}
                  onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                  min="1"
                  max="52"
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#E8E2D6] text-xs sm:text-sm text-stone-900 focus:outline-hidden focus:border-[#3D836E] font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {t('wageTaxType', '세금 및 공제 유형')}
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setTaxOption('freelance')}
                  className={`py-1.5 px-2 rounded-xl text-xs font-medium border transition-colors ${
                    taxOption === 'freelance'
                      ? 'border-[#3D836E] bg-[#EEF6F3] text-[#255849] font-semibold'
                      : 'border-[#E8E2D6] text-stone-600 bg-white'
                  }`}
                >
                  {t('wageFreelance', '3.3% 사업소득')}
                </button>
                <button
                  type="button"
                  onClick={() => setTaxOption('fourInsurances')}
                  className={`py-1.5 px-2 rounded-xl text-xs font-medium border transition-colors ${
                    taxOption === 'fourInsurances'
                      ? 'border-[#3D836E] bg-[#EEF6F3] text-[#255849] font-semibold'
                      : 'border-[#E8E2D6] text-stone-600 bg-white'
                  }`}
                >
                  {t('wageFourInsurances', '4대보험 (~9.4%)')}
                </button>
                <button
                  type="button"
                  onClick={() => setTaxOption('none')}
                  className={`py-1.5 px-2 rounded-xl text-xs font-medium border transition-colors ${
                    taxOption === 'none'
                      ? 'border-[#3D836E] bg-[#EEF6F3] text-[#255849] font-semibold'
                      : 'border-[#E8E2D6] text-stone-600 bg-white'
                  }`}
                >
                  {t('wageNone', '세전 (공제 없음)')}
                </button>
              </div>
            </div>
          </div>

          {/* Wage Calculation Breakdown Card (Dancheong Guncheong & Noerok) */}
          <div className="p-4 rounded-2xl bg-[#253342] text-white shadow-xs space-y-3">
            <span className="text-xs text-[#A3CEC2] font-semibold uppercase tracking-wider">
              {t('wagePaySlip', '예상 월 급여 명세표')}
            </span>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center text-[#E2DDD4]">
                <span>{t('wageBasePay', '기본 주급')} ({hoursPerWeek}h × {hourlyWage.toLocaleString()} KRW)</span>
                <span className="font-mono">{baseWeeklyPay.toLocaleString()} KRW</span>
              </div>

              <div className="flex justify-between items-center text-[#E2DDD4]">
                <span>{t('wageHolidayPay', '주휴수당 (주 15시간 이상 대상)')}</span>
                <span className="font-mono text-[#529B85]">
                  +{Math.round(weeklyHolidayAllowance).toLocaleString()} KRW
                </span>
              </div>

              <div className="flex justify-between items-center text-[#E2DDD4] pt-1 border-t border-white/10">
                <span>{t('wageMonthlyGross', '세전 총 월 환산액')}</span>
                <span className="font-mono">{monthlyGross.toLocaleString()} KRW</span>
              </div>

              {monthlyTax > 0 && (
                <div className="flex justify-between items-center text-[#F18F7E]">
                  <span>{t('wageDeduction', '예상 공제액')} ({taxOption === 'freelance' ? '3.3%' : '~9.4%'})</span>
                  <span className="font-mono">-{monthlyTax.toLocaleString()} KRW</span>
                </div>
              )}

              <div className="flex justify-between items-center text-sm font-bold text-white pt-2 border-t border-white/20">
                <span>{t('wageNet', '예상 실수령액 (월)')}</span>
                <span className="font-mono text-lg text-[#529B85]">
                  {monthlyNet.toLocaleString()} KRW
                </span>
              </div>
            </div>

            <p className="text-[11px] text-[#C5BDB0] pt-2 border-t border-white/10 leading-relaxed">
              * {t('wageNote', '주휴수당은 주 15시간 이상 근무 시 법적으로 보장됩니다.')}
            </p>
          </div>
        </div>
      )}

      {/* 4. SETTLEMENT CHECKLIST SUB-TOOL */}
      {activeSubTool === 'checklist' && (
        <div className="space-y-3.5 animate-in fade-in">
          <div className="p-4 rounded-2xl bg-white/95 border border-[#E8E2D6] shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-[#253342]">
                  {t('checklistTitle', '한국 입국 정착 체크리스트')}
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  {t('checklistDesc', '한국 입국부터 정착까지 필수 행정 절차를 차례대로 체크하세요.')}
                </p>
              </div>

              <div className="text-right">
                <span className="text-lg font-bold text-[#3D836E]">
                  {checklistPercent}%
                </span>
                <span className="text-[11px] text-stone-500 block">
                  ({completedCount}/{totalChecklistCount})
                </span>
              </div>
            </div>

            {/* Progress Bar with Dancheong Noerok */}
            <div className="w-full bg-[#EAE4D8] h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-[#3D836E] h-full rounded-full transition-all duration-300"
                style={{ width: `${checklistPercent}%` }}
              />
            </div>

            {/* Stage Filter Tabs */}
            <div className="flex items-center gap-1.5 pt-1">
              {[
                { id: 'all', label: t('stageAll', '전체') },
                { id: 'week1', label: t('stageWeek1', '1주 이내') },
                { id: 'month1', label: t('stageMonth1', '1달 이내') },
                { id: 'month3', label: t('stageMonth3', '3달 차') },
              ].map((stage) => (
                <button
                  key={stage.id}
                  onClick={() => setChecklistStage(stage.id as any)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
                    checklistStage === stage.id
                      ? 'bg-[#253342] text-white'
                      : 'bg-[#FAF7F2] text-stone-600 border border-[#E8E2D6]'
                  }`}
                >
                  {stage.label}
                </button>
              ))}
            </div>
          </div>

          {/* Checklist Items */}
          <div className="space-y-2.5">
            {filteredChecklists.map((item) => (
              <div
                key={item.id}
                onClick={() => onToggleChecklist(item.id)}
                className={`p-3.5 rounded-2xl border shadow-2xs cursor-pointer transition-all flex items-start gap-3 ${
                  item.completed
                    ? 'bg-[#EEF6F3] border-[#A3CEC2]'
                    : 'bg-white/95 border-[#E8E2D6] hover:border-[#3D836E]'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                      item.completed
                        ? 'bg-[#3D836E] border-[#3D836E] text-white'
                        : 'border-[#C8BFB0] bg-white'
                    }`}
                  >
                    {item.completed && <CheckCircle2 className="w-4 h-4" />}
                  </div>
                </div>

                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4
                      className={`text-xs sm:text-sm font-bold leading-snug ${
                        item.completed
                          ? 'text-stone-400 line-through'
                          : 'text-[#253342]'
                      }`}
                    >
                      {getChecklistTitle(item, language)}
                    </h4>
                    <span className="text-[10px] font-semibold text-[#3D836E] bg-[#EEF6F3] border border-[#A3CEC2] px-1.5 py-0.5 rounded-md shrink-0">
                      {language === 'ko' ? item.deadlineTextKo : item.deadlineTextEn}
                    </span>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed">
                    {getChecklistDesc(item, language)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rites of Passage Etiquette Quiz Banner */}
      {onOpenRitesQuiz && (
        <section className="p-4 rounded-2xl bg-gradient-to-r from-[#253342] to-[#3D836E] text-white shadow-2xs space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-[#E8F3F0]">
              <Scroll className="w-3.5 h-3.5 text-amber-300" />
              오프라인 관혼상제 예절 학습
            </span>
            <span className="text-[11px] text-[#E8F3F0]">10문항 4지선다</span>
          </div>

          <div className="space-y-1">
            <h4 className="text-sm font-bold leading-snug">
              한국의 관혼상제(장례·결혼·첫돌·제사) 예절 마스터 퀴즈
            </h4>
            <p className="text-xs text-[#E8F3F0]/90 leading-relaxed">
              절하는 횟수, 축의금/부의금 홀수 금액 법칙, 식사실 건배 금지 등 핵심 전통 예절을 퀴즈로 풀고 해설을 확인해 보세요.
            </p>
          </div>

          <button
            onClick={onOpenRitesQuiz}
            className="w-full py-2.5 rounded-xl bg-white text-[#253342] hover:bg-[#FAF7F2] text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>예절 퀴즈 풀기 (정답 & 전통 해설)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </section>
      )}
    </div>
  );
};

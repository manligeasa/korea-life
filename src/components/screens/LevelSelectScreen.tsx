import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  GraduationCap,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  BookOpen,
  HelpCircle,
  Lightbulb,
  Award,
  ChevronRight,
  Sliders,
  Database,
  Check,
} from 'lucide-react';
import { KoreanLearningLevel, LearningLevelInfo, QuizQuestion } from '../../types';
import { LEARNING_LEVELS, getQuestionsByLevel, getLevelMeta } from '../../data/learningQuizzes';
import { saveStoredLearningLevel, appStorage, STORAGE_KEYS } from '../../utils/storage';

interface LevelSelectScreenProps {
  currentLevel: KoreanLearningLevel;
  onSelectLevel: (level: KoreanLearningLevel) => void;
  onClose?: () => void;
  canClose?: boolean;
}

export const LevelSelectScreen: React.FC<LevelSelectScreenProps> = ({
  currentLevel,
  onSelectLevel,
  onClose,
  canClose = false,
}) => {
  const { t } = useTranslation();

  // Mode: 'select' (수준 설정) or 'quiz' (맞춤 문제 풀기)
  const [activeMode, setActiveMode] = useState<'select' | 'quiz'>('select');

  // Selected level state
  const [selectedLevel, setSelectedLevel] = useState<KoreanLearningLevel>(currentLevel);
  const [savedSuccessMessage, setSavedSuccessMessage] = useState<string | null>(null);
  const [lastSavedTimestamp, setLastSavedTimestamp] = useState<string | null>(null);

  // Quiz state with randomized 4-choice options
  const [questions, setQuestions] = useState<QuizQuestion[]>(() => {
    return getQuestionsByLevel(selectedLevel).map((q) => ({
      ...q,
      options: [...q.options].sort(() => Math.random() - 0.5),
    }));
  });
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);

  // Sync with currentLevel prop & shuffle options
  useEffect(() => {
    setSelectedLevel(currentLevel);
    setQuestions(
      getQuestionsByLevel(currentLevel).map((q) => ({
        ...q,
        options: [...q.options].sort(() => Math.random() - 0.5),
      }))
    );
  }, [currentLevel]);

  // Load last saved timestamp from storage
  useEffect(() => {
    appStorage.getItem(STORAGE_KEYS.LEARNING_LEVEL_SET_AT).then((val) => {
      if (val) {
        try {
          const date = new Date(JSON.parse(val));
          setLastSavedTimestamp(date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        } catch {
          setLastSavedTimestamp(val);
        }
      }
    });
  }, []);

  // Handle level change & AsyncStorage save
  const handleLevelChoose = async (level: KoreanLearningLevel) => {
    setSelectedLevel(level);
    onSelectLevel(level);
    await saveStoredLearningLevel(level);

    // Reset quiz for new level with freshly randomized options
    const randomized = getQuestionsByLevel(level).map((q) => ({
      ...q,
      options: [...q.options].sort(() => Math.random() - 0.5),
    }));
    setQuestions(randomized);
    setCurrentQuestionIndex(0);
    setSelectedOptionId(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setIsQuizCompleted(false);

    const now = new Date();
    setLastSavedTimestamp(now.toLocaleDateString() + ' ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    
    const meta = getLevelMeta(level);
    setSavedSuccessMessage(`학습 수준이 '${meta.nameKo} (${meta.badge})' 단계로 기기 내장 저장소에 안전하게 저장되었습니다.`);
    setTimeout(() => {
      setSavedSuccessMessage(null);
    }, 3500);
  };

  const currentQ: QuizQuestion | undefined = questions[currentQuestionIndex];

  const handleOptionSelect = (optionId: string) => {
    if (isAnswerSubmitted) return;
    setSelectedOptionId(optionId);
  };

  const handleCheckAnswer = () => {
    if (!selectedOptionId || !currentQ) return;
    setIsAnswerSubmitted(true);
    if (selectedOptionId === currentQ.correctAnswerId) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOptionId(null);
      setIsAnswerSubmitted(false);
    } else {
      setIsQuizCompleted(true);
    }
  };

  const handleRestartQuiz = () => {
    // Reshuffle options randomly on restart
    const randomized = getQuestionsByLevel(selectedLevel).map((q) => ({
      ...q,
      options: [...q.options].sort(() => Math.random() - 0.5),
    }));
    setQuestions(randomized);
    setCurrentQuestionIndex(0);
    setSelectedOptionId(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setIsQuizCompleted(false);
  };

  const currentMeta = getLevelMeta(selectedLevel);

  return (
    <div className="space-y-4 pb-8 text-stone-800">
      {/* Top Header Card with Dancheong Indigo & Noerok Gradient */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#253342] via-[#2A4B42] to-[#1E3B33] p-5 text-white shadow-sm border border-[#3D836E]/30">
        <div className="relative z-10 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#3D836E] text-white shadow-xs">
                <GraduationCap className="w-4 h-4 text-[#FDF0EC]" />
              </span>
              <span className="text-xs font-bold tracking-wider uppercase text-[#A3CEC2]">
                Adaptive Korean Learning
              </span>
            </div>

            {canClose && onClose && (
              <button
                onClick={onClose}
                className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/20"
              >
                닫기
              </button>
            )}
          </div>

          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#FAF7F2]">
            한국어 학습 수준 & 문제 난이도
          </h1>
          <p className="text-xs sm:text-sm text-[#E2DDD4] leading-relaxed">
            나에게 딱 맞는 학습 단계를 선택하세요. 선택된 수준은 기기 로컬 저장소(AsyncStorage)에 보존되어 맞춤형 실전 문제가 자동 출제됩니다.
          </p>

          {/* Current Level Pill Badge */}
          <div className="pt-1 flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs border border-white/20 text-xs font-semibold text-white">
              <span>현재 설정 수준:</span>
              <span className="text-[#F8D28A] font-bold">
                [{currentMeta.nameKo}] {currentMeta.subtitleKo}
              </span>
            </div>

            <div className="inline-flex items-center gap-1 text-[11px] text-[#A3CEC2] bg-[#1E3B33]/80 px-2.5 py-1 rounded-full border border-[#3D836E]/50">
              <Database className="w-3 h-3 text-[#529B85]" />
              <span>로컬 저장소 저장됨</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mode Switcher Tabs (수준 변경 vs 수준 맞춤 문제 풀기) */}
      <div className="flex rounded-xl p-1 bg-stone-200/60 border border-[#E8E2D6] gap-1">
        <button
          onClick={() => setActiveMode('select')}
          className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeMode === 'select'
              ? 'bg-white text-[#253342] shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Sliders className="w-3.5 h-3.5 text-[#3D836E]" />
          <span>수준 선택 및 변경 (4단계)</span>
        </button>

        <button
          onClick={() => setActiveMode('quiz')}
          className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeMode === 'quiz'
              ? 'bg-white text-[#253342] shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 text-[#DF684E]" />
          <span>맞춤형 문제 풀기 ({questions.length}문항)</span>
        </button>
      </div>

      {/* Save Success Toast */}
      {savedSuccessMessage && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-[#EEF6F3] border border-[#3D836E] text-[#255849] text-xs font-medium animate-in fade-in slide-in-from-top-1 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-[#3D836E] shrink-0" />
          <span>{savedSuccessMessage}</span>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODE 1: LEVEL SELECTION SCREEN                           */}
      {/* ======================================================== */}
      {activeMode === 'select' && (
        <div className="space-y-3.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              한국어 단계 선택 (터치 시 기기 저장)
            </span>
            <span className="text-xs text-stone-500">
              총 4단계 체계
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {LEARNING_LEVELS.map((level) => {
              const isCurrent = selectedLevel === level.id;
              const { dancheongColor } = level;

              return (
                <div
                  key={level.id}
                  onClick={() => handleLevelChoose(level.id)}
                  className={`group relative p-4 rounded-2xl border transition-all duration-200 cursor-pointer active:scale-[0.99] ${
                    isCurrent
                      ? 'border-[#3D836E] bg-white shadow-md ring-2 ring-[#3D836E]/30'
                      : 'border-[#E8E2D6] bg-white/90 hover:border-[#A3CEC2] hover:bg-white shadow-2xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    {/* Left Info Zone */}
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Level badge */}
                        <span
                          className="px-2 py-0.5 rounded-md text-[11px] font-bold tracking-tight shadow-2xs"
                          style={{
                            backgroundColor: dancheongColor.soft,
                            color: dancheongColor.text,
                            border: `1px solid ${dancheongColor.border}`,
                          }}
                        >
                          {level.badge}
                        </span>

                        <span className="text-base font-extrabold text-[#253342]">
                          {level.nameKo}
                        </span>
                        <span className="text-xs text-stone-500 font-medium">
                          ({level.nameEn})
                        </span>

                        {/* Difficulty dots */}
                        <div className="flex items-center gap-1 ml-auto sm:ml-0">
                          {Array.from({ length: 4 }).map((_, i) => (
                            <span
                              key={i}
                              className={`w-1.5 h-1.5 rounded-full ${
                                i < level.difficulty
                                  ? 'bg-[#3D836E]'
                                  : 'bg-stone-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      <h3 className="text-sm font-bold text-[#3D836E]">
                        {level.subtitleKo}
                      </h3>

                      <p className="text-xs text-stone-600 leading-relaxed">
                        {level.descriptionKo}
                      </p>

                      {/* Targeted learner info box */}
                      <div className="mt-2 p-2 rounded-lg bg-[#FAF7F2] border border-[#E8E2D6] text-[11px] text-stone-600 space-y-0.5">
                        <div className="font-semibold text-stone-700 flex items-center gap-1">
                          <Lightbulb className="w-3 h-3 text-[#D49B28]" />
                          <span>추천 대상: {level.targetAudienceKo}</span>
                        </div>
                        <div className="text-stone-500 italic pl-4">
                          예시 표현: "{level.samplePhraseKo}"
                        </div>
                      </div>
                    </div>

                    {/* Right Checkmark indicator */}
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                        isCurrent
                          ? 'bg-[#3D836E] text-white shadow-xs'
                          : 'border-2 border-stone-300 group-hover:border-[#3D836E]'
                      }`}
                    >
                      {isCurrent ? (
                        <Check className="w-4 h-4 stroke-[3]" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-transparent group-hover:bg-[#3D836E]/40" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action button to immediately solve questions */}
          <div className="pt-2">
            <button
              onClick={() => setActiveMode('quiz')}
              className="w-full py-3.5 px-4 rounded-2xl bg-[#3D836E] hover:bg-[#255849] text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer"
            >
              <span>'{currentMeta.nameKo}' 수준 맞춤 문제 풀기 시작</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Device Storage Status & Architecture Card */}
          <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E8E2D6] text-xs space-y-2 text-stone-600">
            <div className="flex items-center gap-2 font-bold text-[#253342]">
              <ShieldCheck className="w-4 h-4 text-[#3D836E]" />
              <span>기기 내장 저장소 (AsyncStorage) 기술 정보</span>
            </div>
            <p className="leading-relaxed text-[11px]">
              • 저장 키: <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-[#E8E2D6]">{STORAGE_KEYS.LEARNING_LEVEL}</code><br />
              • 저장된 값: <span className="font-bold text-[#3D836E]">"{selectedLevel}"</span> ({currentMeta.nameKo})<br />
              {lastSavedTimestamp && (
                <>• 최근 저장 일시: <span className="text-stone-700 font-medium">{lastSavedTimestamp}</span><br /></>
              )}
              • 외부 서버 의존성 없이 기기 내부 로컬 저장소에 영구 보존되며, 앱을 다시 실행해도 설정된 난이도가 즉시 유지됩니다.
            </p>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODE 2: ADAPTIVE LEVEL QUIZ                              */}
      {/* ======================================================== */}
      {activeMode === 'quiz' && (
        <div className="space-y-4">
          {/* Quiz Header Bar */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#E8E2D6] shadow-2xs">
            <div className="flex items-center gap-2">
              <span
                className="px-2 py-0.5 rounded text-[11px] font-bold"
                style={{
                  backgroundColor: currentMeta.dancheongColor.soft,
                  color: currentMeta.dancheongColor.text,
                  border: `1px solid ${currentMeta.dancheongColor.border}`,
                }}
              >
                {currentMeta.nameKo} ({currentMeta.badge})
              </span>
              <span className="text-xs font-semibold text-stone-700">
                문항 {currentQuestionIndex + 1} / {questions.length}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#3D836E]">
                점수: {score}점
              </span>
              <button
                onClick={handleRestartQuiz}
                title="문제 다시 풀기"
                className="p-1 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-md transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#3D836E] transition-all duration-300 rounded-full"
              style={{
                width: `${((currentQuestionIndex + (isAnswerSubmitted ? 1 : 0)) / questions.length) * 100}%`,
              }}
            />
          </div>

          {/* Completed State or Active Question */}
          {isQuizCompleted ? (
            <div className="p-6 rounded-2xl bg-white border border-[#E8E2D6] text-center space-y-4 shadow-sm">
              <div className="w-14 h-14 mx-auto rounded-full bg-[#EEF6F3] text-[#3D836E] flex items-center justify-center">
                <Award className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-bold text-[#253342]">
                  '{currentMeta.nameKo}' 단계 테스트 완료!
                </h3>
                <p className="text-xs text-stone-600">
                  총 {questions.length}문제 중 <span className="font-bold text-[#3D836E]">{score}문제</span>를 맞히셨습니다.
                </p>
              </div>

              {score === questions.length ? (
                <div className="p-3 rounded-xl bg-[#EEF6F3] border border-[#3D836E] text-xs font-medium text-[#255849]">
                  🎉 완벽합니다! 한국 생활에 필요한 핵심 표현을 훌륭하게 숙지하셨습니다.
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-[#FCF6E8] border border-[#D49B28] text-xs font-medium text-[#8F6310]">
                  💡 복습을 통해 틀린 문제의 단청 꿀팁을 다시 한 번 확인해 보세요.
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleRestartQuiz}
                  className="flex-1 py-3 px-4 rounded-xl border border-[#E8E2D6] bg-[#FAF7F2] hover:bg-stone-100 text-xs font-bold text-stone-700 flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>다시 풀기</span>
                </button>

                <button
                  onClick={() => setActiveMode('select')}
                  className="flex-1 py-3 px-4 rounded-xl bg-[#3D836E] hover:bg-[#255849] text-white text-xs font-bold shadow-xs flex items-center justify-center gap-1.5"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>수준 변경하기</span>
                </button>
              </div>
            </div>
          ) : currentQ ? (
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E8E2D6] space-y-4 shadow-sm">
              {/* Question Context & Title */}
              <div className="space-y-1.5 border-b border-[#E8E2D6]/70 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-[#DF684E] uppercase tracking-wider">
                    {currentQ.categoryTitleKo}
                  </span>
                  <span className="text-xs text-stone-400">·</span>
                  <span className="text-xs text-stone-500 font-medium">
                    {currentQ.categoryTitleEn}
                  </span>
                </div>

                {/* Situation narrative box */}
                <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8E2D6] text-xs text-stone-700 leading-relaxed font-medium">
                  {currentQ.situationKo}
                </div>

                <h3 className="text-sm sm:text-base font-extrabold text-[#253342] pt-1">
                  Q{currentQuestionIndex + 1}. {currentQ.questionKo}
                </h3>
              </div>

              {/* Options List */}
              <div className="space-y-2">
                {currentQ.options.map((opt) => {
                  const isSelected = selectedOptionId === opt.id;
                  const isCorrect = opt.id === currentQ.correctAnswerId;

                  let optClass = 'border-[#E8E2D6] bg-white hover:border-[#3D836E]/60 text-stone-800';

                  if (isAnswerSubmitted) {
                    if (isCorrect) {
                      optClass = 'border-[#3D836E] bg-[#EEF6F3] text-[#255849] ring-2 ring-[#3D836E]/40 font-bold';
                    } else if (isSelected && !isCorrect) {
                      optClass = 'border-[#DF684E] bg-[#FDF1EE] text-[#9C341F] ring-1 ring-[#DF684E]';
                    } else {
                      optClass = 'border-stone-200 bg-stone-50 opacity-60 text-stone-400';
                    }
                  } else if (isSelected) {
                    optClass = 'border-[#3D836E] bg-[#EEF6F3] text-[#255849] ring-1 ring-[#3D836E] font-semibold';
                  }

                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleOptionSelect(opt.id)}
                      disabled={isAnswerSubmitted}
                      className={`w-full p-3 sm:p-3.5 rounded-xl border text-left transition-all duration-150 flex items-center justify-between gap-2.5 cursor-pointer active:scale-[0.99] ${optClass}`}
                    >
                      <div className="min-w-0">
                        <div className="text-xs sm:text-sm">{opt.textKo}</div>
                        {opt.meaningEn && (
                          <div className="text-[11px] text-stone-500 font-normal truncate mt-0.5">
                            {opt.meaningEn}
                          </div>
                        )}
                      </div>

                      {isAnswerSubmitted && isCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-[#3D836E] shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Answer submission or next action */}
              <div className="pt-2">
                {!isAnswerSubmitted ? (
                  <button
                    onClick={handleCheckAnswer}
                    disabled={!selectedOptionId}
                    className={`w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center gap-2 ${
                      selectedOptionId
                        ? 'bg-[#3D836E] hover:bg-[#255849] text-white cursor-pointer active:scale-[0.98]'
                        : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                    }`}
                  >
                    <span>정답 확인하기</span>
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    className="w-full py-3 px-4 rounded-xl bg-[#253342] hover:bg-[#1A242F] text-white font-bold text-xs sm:text-sm shadow-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer"
                  >
                    <span>
                      {currentQuestionIndex + 1 < questions.length
                        ? '다음 문제로 넘어가기'
                        : '결과 보기'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Detailed Explanation & Dancheong Tip Box (visible after answer submitted) */}
              {isAnswerSubmitted && (
                <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E8E2D6] space-y-2 animate-in fade-in">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-[#253342]">
                    <HelpCircle className="w-3.5 h-3.5 text-[#3D836E]" />
                    <span>정답 해설</span>
                  </div>
                  <p className="text-xs text-stone-700 leading-relaxed">
                    {currentQ.explanationKo}
                  </p>
                  <p className="text-[11px] text-stone-500 italic">
                    {currentQ.explanationEn}
                  </p>

                  <div className="mt-2 pt-2 border-t border-[#E8E2D6]/80 flex items-start gap-1.5 text-[11px] text-[#255849] bg-[#EEF6F3] p-2 rounded-lg">
                    <Sparkles className="w-3.5 h-3.5 text-[#DF684E] shrink-0 mt-0.5" />
                    <span className="font-medium">{currentQ.dancheongTipKo}</span>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

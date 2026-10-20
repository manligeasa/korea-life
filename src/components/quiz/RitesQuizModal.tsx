import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  X,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  Award,
  Lightbulb,
  BookOpen,
  Scroll,
  HelpCircle,
  ChevronRight,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { Language } from '../../types';
import { RITES_QUIZZES, RitesQuizItem } from '../../data/ritesQuizzes';

interface RitesQuizModalProps {
  language: Language;
  onClose: () => void;
}

export const RitesQuizModal: React.FC<RitesQuizModalProps> = ({
  language,
  onClose,
}) => {
  const { t } = useTranslation();

  // Quiz items with randomized options
  const [quizzes, setQuizzes] = useState<RitesQuizItem[]>(() => {
    return RITES_QUIZZES.map((q) => ({
      ...q,
      options: [...q.options].sort(() => Math.random() - 0.5),
    }));
  });

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [hasAnswered, setHasAnswered] = useState<boolean>(false);
  const [userAnswers, setUserAnswers] = useState<
    { quizId: string; selectedId: string; isCorrect: boolean }[]
  >([]);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const totalQuestions = quizzes.length;
  const currentQuiz: RitesQuizItem = quizzes[currentIndex];

  // Handle option selection
  const handleSelectOption = (optionId: string) => {
    if (hasAnswered) return; // Prevent multiple clicks on same question

    const isCorrect = optionId === currentQuiz.correctAnswerId;
    setSelectedOptionId(optionId);
    setHasAnswered(true);

    setUserAnswers((prev) => [
      ...prev,
      {
        quizId: currentQuiz.id,
        selectedId: optionId,
        isCorrect,
      },
    ]);
  };

  // Next Question
  const handleNextQuestion = () => {
    if (currentIndex + 1 < totalQuestions) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOptionId(null);
      setHasAnswered(false);
    } else {
      setIsCompleted(true);
    }
  };

  // Reset Quiz with freshly reshuffled options
  const handleRestartQuiz = () => {
    setQuizzes(
      RITES_QUIZZES.map((q) => ({
        ...q,
        options: [...q.options].sort(() => Math.random() - 0.5),
      }))
    );
    setCurrentIndex(0);
    setSelectedOptionId(null);
    setHasAnswered(false);
    setUserAnswers([]);
    setIsCompleted(false);
  };

  // Score calculations
  const correctCount = userAnswers.filter((a) => a.isCorrect).length;
  const scorePercentage = Math.round((correctCount / totalQuestions) * 100);

  // Localized question text
  const localizedQuestion =
    language !== 'ko' && currentQuiz.questionTranslations?.[language]
      ? currentQuiz.questionTranslations[language]
      : null;

  return (
    <div className="relative flex flex-col h-full max-h-[92vh] bg-[#FAF7F2] rounded-3xl overflow-hidden shadow-2xl border border-[#E8E2D6]">
      {/* Top Header */}
      <div className="px-4 py-3 bg-white border-b border-[#E8E2D6] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#253342] text-white flex items-center justify-center shadow-2xs">
            <Scroll className="w-4 h-4 text-[#EAD198]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-[#253342]">
                한국의 관혼상제 예절 퀴즈
              </span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-[#EEF6F3] text-[#3D836E] border border-[#A3CEC2]">
                4지선다 객관식
              </span>
            </div>
            <p className="text-[10px] text-stone-500">
              오프라인 하드코딩 JSON 데이터 기반 · 정답 및 전통 해설
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleRestartQuiz}
            className="p-1.5 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-colors"
            title="퀴즈 처음부터 다시 풀기"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Bar & Indicators */}
      {!isCompleted && (
        <div className="px-4 py-2.5 bg-[#FAF7F2] border-b border-[#E8E2D6] shrink-0">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-extrabold text-[#253342] flex items-center gap-1.5">
              <span className="px-2 py-0.5 rounded-md bg-[#253342] text-white text-[10px] font-mono">
                문제 {currentIndex + 1} / {totalQuestions}
              </span>
              <span className="text-[11px] text-stone-500">
                {currentQuiz.categoryNameKo}
              </span>
            </span>

            <div className="flex items-center gap-2 text-[11px] font-bold">
              <span className="text-[#3D836E]">✓ 정답 {correctCount}</span>
              <span className="text-stone-300">|</span>
              <span className="text-[#DF684E]">
                ✗ 오답 {userAnswers.length - correctCount}
              </span>
            </div>
          </div>

          {/* Progress bar track */}
          <div className="w-full h-2 rounded-full bg-stone-200 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#3D836E] to-[#DF684E] transition-all duration-300"
              style={{
                width: `${((currentIndex + (hasAnswered ? 1 : 0)) / totalQuestions) * 100}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Main Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
        {!isCompleted ? (
          <>
            {/* Question Card */}
            <div className="p-4 rounded-2xl bg-white border border-[#E8E2D6] shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-stone-400">
                  QUESTION #{currentIndex + 1}
                </span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#FAF7F2] text-[#253342] border border-[#E8E2D6]">
                  {currentQuiz.categoryNameKo}
                </span>
              </div>

              <h3 className="text-sm sm:text-base font-extrabold text-[#253342] leading-snug">
                {currentQuiz.questionKo}
              </h3>

              {localizedQuestion && (
                <p className="text-xs text-[#3D836E] font-medium pt-1 border-t border-stone-100 leading-relaxed">
                  {localizedQuestion}
                </p>
              )}
            </div>

            {/* 4 Multiple Choice Options (4지선다형) */}
            <div className="space-y-2.5">
              {currentQuiz.options.map((option, optIdx) => {
                const isSelected = selectedOptionId === option.id;
                const isCorrectAnswer = option.id === currentQuiz.correctAnswerId;

                // State styles
                let optionStyle =
                  'bg-white border-[#E8E2D6] text-stone-800 hover:border-[#3D836E] hover:bg-[#FAF7F2]';
                let badgeStyle = 'bg-stone-100 text-stone-700';

                if (hasAnswered) {
                  if (isCorrectAnswer) {
                    optionStyle =
                      'bg-[#EEF6F3] border-[#3D836E] text-[#255849] ring-2 ring-[#3D836E]/30';
                    badgeStyle = 'bg-[#3D836E] text-white';
                  } else if (isSelected && !isCorrectAnswer) {
                    optionStyle =
                      'bg-[#FDF0EC] border-[#DF684E] text-[#9A301A] ring-2 ring-[#DF684E]/30';
                    badgeStyle = 'bg-[#DF684E] text-white';
                  } else {
                    optionStyle = 'bg-stone-50/70 border-stone-200 text-stone-400 opacity-60';
                    badgeStyle = 'bg-stone-100 text-stone-400';
                  }
                }

                return (
                  <button
                    key={option.id}
                    disabled={hasAnswered}
                    onClick={() => handleSelectOption(option.id)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 shadow-2xs cursor-pointer active:scale-[0.99] ${optionStyle}`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shrink-0 transition-colors ${badgeStyle}`}
                      >
                        {optIdx + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-bold leading-snug">
                          {option.textKo}
                        </p>
                        {language !== 'ko' && (
                          <p className="text-[11px] text-stone-500 mt-0.5 truncate">
                            {option.textEn}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="shrink-0">
                      {hasAnswered && isCorrectAnswer && (
                        <CheckCircle2 className="w-5 h-5 text-[#3D836E]" />
                      )}
                      {hasAnswered && isSelected && !isCorrectAnswer && (
                        <XCircle className="w-5 h-5 text-[#DF684E]" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Answer Result & Cultural Explanation Box */}
            {hasAnswered && (
              <div className="p-4 rounded-2xl bg-white border border-[#E8E2D6] shadow-sm space-y-3 animate-in fade-in slide-in-from-bottom-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {selectedOptionId === currentQuiz.correctAnswerId ? (
                      <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EEF6F3] text-[#3D836E] text-xs font-black border border-[#A3CEC2]">
                        <CheckCircle2 className="w-4 h-4" />
                        정답입니다! 🎉
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FDF0EC] text-[#DF684E] text-xs font-black border border-[#F6BCB0]">
                        <XCircle className="w-4 h-4" />
                        아쉽네요! 정답을 확인하세요
                      </span>
                    )}
                  </div>
                </div>

                {/* Cultural Explanation */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-black uppercase text-[#253342] flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-[#3D836E]" />
                    전통 예절 상세 해설
                  </span>
                  <p className="text-xs text-stone-700 leading-relaxed bg-[#FAF7F2] p-3 rounded-xl border border-[#E8E2D6]">
                    {currentQuiz.explanationKo}
                  </p>
                  {language !== 'ko' && (
                    <p className="text-[11px] text-stone-500 italic mt-1 leading-relaxed">
                      {currentQuiz.explanationEn}
                    </p>
                  )}
                </div>

                {/* Dancheong Cultural Tip */}
                <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p className="leading-snug">
                    {currentQuiz.dancheongTipKo}
                  </p>
                </div>

                {/* Next Button */}
                <button
                  onClick={handleNextQuestion}
                  className="w-full py-3 rounded-xl bg-[#253342] hover:bg-[#1a2530] text-white text-xs sm:text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <span>
                    {currentIndex + 1 < totalQuestions ? '다음 문제 풀기' : '결과 확인하기'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        ) : (
          /* FINAL SUMMARY REPORT CARD */
          <div className="p-5 rounded-3xl bg-white border border-[#E8E2D6] shadow-sm text-center space-y-4 animate-in zoom-in-95 my-auto">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#3D836E] to-[#255849] text-white flex items-center justify-center mx-auto shadow-md">
              <Award className="w-9 h-9 text-[#EAD198]" />
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                QUIZ COMPLETED
              </span>
              <h3 className="text-lg sm:text-xl font-black text-[#253342]">
                관혼상제 예절 퀴즈 완료!
              </h3>
              <p className="text-xs text-stone-500">
                한국의 장례·결혼·첫돌·제사 문화에 대한 학습 결과입니다.
              </p>
            </div>

            {/* Score Highlight Box */}
            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8E2D6] space-y-2">
              <div className="text-3xl sm:text-4xl font-black text-[#253342] tracking-tight">
                {scorePercentage}
                <span className="text-base sm:text-lg font-bold text-stone-500">
                  {' '}
                  / 100점
                </span>
              </div>
              <div className="flex items-center justify-center gap-3 text-xs font-bold">
                <span className="text-[#3D836E] bg-white px-2.5 py-1 rounded-lg border border-[#A3CEC2]">
                  정답: {correctCount}문항
                </span>
                <span className="text-[#DF684E] bg-white px-2.5 py-1 rounded-lg border border-[#F6BCB0]">
                  오답: {totalQuestions - correctCount}문항
                </span>
              </div>
            </div>

            {/* Motivational Evaluation Badge */}
            <div className="p-3 rounded-xl bg-[#EEF6F3] border border-[#A3CEC2] text-xs font-medium text-[#255849] leading-relaxed">
              {scorePercentage >= 80 ? (
                <span>
                  🎉 <strong>관혼상제 예절 마스터!</strong> 한국인 못지않게 깊이 있는 전통 예절과 배려의 문화를 완벽히 습득하셨습니다.
                </span>
              ) : scorePercentage >= 50 ? (
                <span>
                  👏 <strong>훌륭한 성취입니다!</strong> 한국의 기본 관혼상제 절차와 조문 예절을 잘 이해하고 계십니다.
                </span>
              ) : (
                <span>
                  📚 <strong>한 번 더 도전해 보세요!</strong> 해설을 다시 읽어보며 한국의 따뜻한 관혼상제 문화를 익혀보세요.
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={handleRestartQuiz}
                className="w-full py-2.5 rounded-xl bg-[#3D836E] hover:bg-[#2A5C4E] text-white text-xs font-bold transition-colors shadow-2xs cursor-pointer flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>퀴즈 다시 풀기</span>
              </button>
              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-white border border-[#E8E2D6] hover:bg-stone-50 text-stone-700 text-xs font-bold transition-colors cursor-pointer"
              >
                닫기
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

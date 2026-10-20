import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Mic,
  MicOff,
  Volume2,
  X,
  RotateCcw,
  Sparkles,
  Award,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  HelpCircle,
  Keyboard,
  Send,
  Scroll,
  MessageSquare,
  BookOpen,
  VolumeX,
  ThumbsUp,
  FileCode2,
} from 'lucide-react';
import { Language, RoleplayMessage, RoleplayScenario } from '../../types';
import { ROLEPLAY_SCENARIOS } from '../../data/roleplayScenarios';
import {
  isSpeechRecognitionSupported,
  startNativeSpeechRecognition,
  speakKoreanText,
  EXPO_VOICE_INTEGRATION_GUIDE,
} from '../../utils/stt';
import {
  evaluateResponseRuleBased,
  RuleEvaluationResult,
  getCorrectionDictionary,
} from '../../utils/ruleMatcher';

interface ExtendedRoleplayMessage extends RoleplayMessage {
  feedbackResult?: RuleEvaluationResult;
}

interface RoleplayModalProps {
  language: Language;
  initialScenarioId?: string;
  onClose: () => void;
}

export const RoleplayModal: React.FC<RoleplayModalProps> = ({
  language,
  initialScenarioId,
  onClose,
}) => {
  const { t } = useTranslation();

  // Find scenario or fallback to first
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(
    initialScenarioId && ROLEPLAY_SCENARIOS.some((s) => s.id === initialScenarioId)
      ? initialScenarioId
      : ROLEPLAY_SCENARIOS[0].id
  );

  const scenario =
    ROLEPLAY_SCENARIOS.find((s) => s.id === selectedScenarioId) ||
    ROLEPLAY_SCENARIOS[0];

  // Conversation state
  const [messages, setMessages] = useState<ExtendedRoleplayMessage[]>(
    scenario.initialMessages
  );
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // STT recording state
  const [isListening, setIsListening] = useState<boolean>(false);
  const [spokenTranscript, setSpokenTranscript] = useState<string>('');
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const [sttError, setSttError] = useState<string | null>(null);
  const [isSpeakingTTS, setIsSpeakingTTS] = useState<boolean>(false);

  // Fallback keyboard mode
  const [isKeyboardMode, setIsKeyboardMode] = useState<boolean>(false);
  const [manualInput, setManualInput] = useState<string>('');

  // Info modals
  const [showExpoInfo, setShowExpoInfo] = useState<boolean>(false);
  const [showDictionaryModal, setShowDictionaryModal] = useState<boolean>(false);
  const [isCulturalTipOpen, setIsCulturalTipOpen] = useState<boolean>(false);

  // Active recognition ref to stop anytime
  const recognitionRef = useRef<{ stop: () => void } | null>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll chat to bottom
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, interimTranscript, isListening]);

  // When scenario changes, reset state
  useEffect(() => {
    setMessages(scenario.initialMessages);
    setStepIndex(0);
    setIsCompleted(false);
    setSpokenTranscript('');
    setInterimTranscript('');
    setSttError(null);
  }, [selectedScenarioId]);

  // Cleanup recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const currentExpected = scenario.expectedResponses[stepIndex];

  // Handle STT toggle
  const handleToggleListening = () => {
    if (isListening) {
      // Stop listening
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
      setIsListening(false);
      return;
    }

    setSttError(null);
    setInterimTranscript('');

    const controller = startNativeSpeechRecognition({
      onInterim: (interim) => {
        setInterimTranscript(interim);
      },
      onFinal: (finalText) => {
        setSpokenTranscript(finalText);
        setInterimTranscript('');
        setIsListening(false);
      },
      onError: (errMsg) => {
        setSttError(errMsg);
        setIsListening(false);
      },
      onEnd: () => {
        setIsListening(false);
      },
      lang: 'ko-KR',
    });

    recognitionRef.current = controller;
    setIsListening(true);
  };

  // Submit response (via rule-based matching engine)
  const handleSubmitSpoken = (textToSubmit?: string) => {
    const text = (textToSubmit || spokenTranscript || manualInput).trim();
    if (!text || !currentExpected) return;

    // Zero-AI Local Rule-Based Evaluation
    const ruleEvaluation = evaluateResponseRuleBased({
      scenarioId: selectedScenarioId,
      stepIndex,
      spokenText: text,
      language,
    });

    // Add user message with evaluation result
    const userMsgId = `user-${Date.now()}`;
    const userMsg: ExtendedRoleplayMessage = {
      id: userMsgId,
      sender: 'user',
      textKo: text,
      translation: currentExpected.meaning[language] || currentExpected.meaning.ko || '',
      timestamp: '방금',
      accuracyScore: ruleEvaluation.score,
      feedbackResult: ruleEvaluation,
    };

    setMessages((prev) => [...prev, userMsg]);
    setSpokenTranscript('');
    setManualInput('');
    setInterimTranscript('');

    // If taboo detected, do not advance step! Give gentle guidance to try again
    if (!ruleEvaluation.shouldAdvance) {
      // Optional subtle voice prompt for guidance
      return;
    }

    // If successful, trigger partner reply after short delay
    setTimeout(() => {
      const partnerReplyId = `partner-${Date.now()}`;
      const partnerMsg: ExtendedRoleplayMessage = {
        id: partnerReplyId,
        sender: 'partner',
        textKo: currentExpected.partnerReply,
        translation:
          currentExpected.partnerReplyTranslation[language] ||
          currentExpected.partnerReplyTranslation.ko ||
          '',
        timestamp: '방금',
      };

      setMessages((prev) => [...prev, partnerMsg]);

      // Speak partner reply automatically via TTS
      speakKoreanText(currentExpected.partnerReply);

      // Advance step or complete
      if (stepIndex + 1 < scenario.expectedResponses.length) {
        setStepIndex((prev) => prev + 1);
      } else {
        setIsCompleted(true);
      }
    }, 1100);
  };

  // Play audio of a text
  const handlePlayAudio = (text: string) => {
    setIsSpeakingTTS(true);
    speakKoreanText(text, () => {
      setIsSpeakingTTS(false);
    });
  };

  // Reset conversation
  const handleResetConversation = () => {
    setMessages(scenario.initialMessages);
    setStepIndex(0);
    setIsCompleted(false);
    setSpokenTranscript('');
    setInterimTranscript('');
    setSttError(null);
  };

  // Raw dictionary for inspection modal
  const dictionaryJson = getCorrectionDictionary();

  return (
    <div className="relative flex flex-col h-full bg-[#FAF7F2] rounded-3xl overflow-hidden shadow-2xl border border-[#E8E2D6] min-h-0">
      {/* Top Bar with Dancheong Header */}
      <div className="px-3.5 py-2.5 bg-white border-b border-[#E8E2D6] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white shadow-2xs shrink-0"
            style={{ backgroundColor: scenario.dancheongColor.accent }}
          >
            {scenario.categoryId === 'rites' ? (
              <Scroll className="w-3.5 h-3.5" />
            ) : (
              <MessageSquare className="w-3.5 h-3.5" />
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-bold text-[#253342] truncate">
                {scenario.titleByLang[language] || scenario.titleKo}
              </span>
              <span
                className="px-1.5 py-0.2 rounded text-[9.5px] font-bold"
                style={{
                  backgroundColor: scenario.dancheongColor.soft,
                  color: scenario.dancheongColor.accent,
                }}
              >
                {scenario.categoryId === 'rites' ? '관혼상제 🕊️' : '실전 회화 🗣️'}
              </span>
            </div>
            <p className="text-[10px] text-stone-500 truncate">
              상대: {scenario.partnerRoleTrans[language] || scenario.partnerRole} · 나:{' '}
              {scenario.userRoleTrans[language] || scenario.userRole}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {/* JSON Dictionary Viewer Button */}
          <button
            onClick={() => setShowDictionaryModal(true)}
            className="p-1 rounded-lg text-[#3D836E] hover:text-[#255849] hover:bg-[#EEF6F3] transition-colors flex items-center gap-0.5 text-[10.5px] font-bold cursor-pointer"
            title="상황별 교정 사전 (JSON) 보기"
          >
            <FileCode2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">사전</span>
          </button>
          <button
            onClick={() => setShowExpoInfo(true)}
            className="p-1 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-colors cursor-pointer"
            title="기기 내장 STT 안내"
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleResetConversation}
            className="p-1 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-colors cursor-pointer"
            title="대화 다시 시작"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Scenario Selector Pill Tabs (Compact horizontal scroller) */}
      <div className="px-3.5 py-1.5 bg-[#F3EDE2]/60 border-b border-[#E8E2D6] flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
        {ROLEPLAY_SCENARIOS.map((s) => (
          <button
            key={s.id}
            onClick={() => setSelectedScenarioId(s.id)}
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer ${
              s.id === selectedScenarioId
                ? 'bg-[#253342] text-white shadow-2xs'
                : 'bg-white/80 text-stone-600 hover:bg-white border border-[#E8E2D6]'
            }`}
          >
            {s.titleByLang[language] || s.titleKo}
          </button>
        ))}
      </div>

      {/* Cultural Etiquette Context Bar (Compact with smooth accordion, never squishes chat) */}
      <div className="px-3.5 py-1.5 bg-[#FAF7F2] border-b border-[#E8E2D6] shrink-0 text-xs">
        <button
          onClick={() => setIsCulturalTipOpen(!isCulturalTipOpen)}
          className="w-full flex items-center justify-between text-left text-[11px] text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-1.5 truncate pr-2">
            <Sparkles className="w-3.5 h-3.5 text-[#DF684E] shrink-0" />
            <span className="font-bold text-[#253342] shrink-0">문화 팁:</span>
            <span className="truncate text-stone-500">
              {language === 'ko' ? scenario.culturalTipKo : scenario.culturalTipEn}
            </span>
          </div>
          <span className="text-[10px] text-[#3D836E] font-bold shrink-0 ml-1">
            {isCulturalTipOpen ? '접기 ▲' : '자세히 ▼'}
          </span>
        </button>

        {isCulturalTipOpen && (
          <div className="mt-1.5 pt-1.5 border-t border-[#E8E2D6] text-[11px] text-stone-600 leading-relaxed max-h-24 overflow-y-auto animate-in fade-in">
            <p>{language === 'ko' ? scenario.culturalTipKo : scenario.culturalTipEn}</p>
          </div>
        )}
      </div>

      {/* Chat Messages Log Area (Ensured plenty of breathing room, min-h-0 for proper flex shrink & scrolling) */}
      <div
        ref={chatScrollRef}
        className="flex-1 min-h-0 overflow-y-auto px-3.5 sm:px-4 py-3 sm:py-4 space-y-3.5 no-scrollbar bg-gradient-to-b from-[#FAF7F2] to-white"
      >
        {messages.map((msg) => {
          const isPartner = msg.sender === 'partner';
          const feedback = msg.feedbackResult;

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isPartner ? 'items-start' : 'items-end'} space-y-1`}
            >
              <div className="flex items-center gap-1.5 px-1">
                <span className="text-[10.5px] font-semibold text-stone-500">
                  {isPartner
                    ? scenario.partnerRoleTrans[language] || scenario.partnerRole
                    : scenario.userRoleTrans[language] || scenario.userRole}
                </span>
                <span className="text-[9.5px] text-stone-400">{msg.timestamp}</span>
                {msg.accuracyScore !== undefined && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[9px] font-extrabold flex items-center gap-0.5 ${
                      msg.accuracyScore >= 80
                        ? 'bg-emerald-100 text-emerald-800'
                        : msg.accuracyScore >= 55
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    <Award className="w-2.5 h-2.5" />
                    정확도 {msg.accuracyScore}%
                  </span>
                )}
              </div>

              {/* Chat Bubble with generous padding, text legibility, and line-height */}
              <div
                className={`max-w-[88%] rounded-2xl p-3 sm:p-3.5 shadow-2xs relative group ${
                  isPartner
                    ? 'bg-white border border-[#E8E2D6] text-stone-900 rounded-tl-xs'
                    : 'bg-[#253342] text-white rounded-tr-xs'
                }`}
              >
                <div className="flex items-start justify-between gap-2.5">
                  <p className="text-sm font-semibold leading-relaxed break-keep break-words tracking-tight">
                    {msg.textKo}
                  </p>
                  <button
                    onClick={() => handlePlayAudio(msg.textKo)}
                    className={`p-1 rounded-lg shrink-0 transition-colors ${
                      isPartner
                        ? 'text-stone-400 hover:text-[#3D836E] hover:bg-stone-100'
                        : 'text-stone-300 hover:text-white hover:bg-white/10'
                    }`}
                    title="원어민 발음 듣기"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {msg.romanization && (
                  <p className={`text-[10.5px] mt-1 font-mono italic ${isPartner ? 'text-stone-400' : 'text-stone-300/80'}`}>
                    [{msg.romanization}]
                  </p>
                )}

                {msg.translation && (
                  <p
                    className={`text-xs mt-1.5 pt-1.5 border-t leading-relaxed break-keep break-words ${
                      isPartner
                        ? 'text-stone-500 border-stone-100'
                        : 'text-stone-200 border-white/15'
                    }`}
                  >
                    {msg.translation}
                  </p>
                )}
              </div>

              {/* RULE-BASED SPEECH BUBBLES (말풍선 피드백) */}
              {feedback && (
                <div
                  className={`max-w-[90%] rounded-2xl p-3 shadow-xs animate-in zoom-in-95 space-y-1 relative ${
                    feedback.speechBubbleType === 'compliment'
                      ? 'bg-[#EEF6F3] border border-[#A3CEC2] text-[#255849] rounded-tr-xs mr-1'
                      : feedback.speechBubbleType === 'warning'
                      ? 'bg-[#FDF0EC] border border-[#F6BCB0] text-[#9A301A] rounded-tr-xs mr-1'
                      : 'bg-amber-50 border border-amber-200 text-amber-900 rounded-tr-xs mr-1'
                  }`}
                >
                  {/* Speech bubble tail pointer */}
                  <div
                    className={`absolute -top-1.5 right-4 w-3 h-3 rotate-45 border-t border-l ${
                      feedback.speechBubbleType === 'compliment'
                        ? 'bg-[#EEF6F3] border-[#A3CEC2]'
                        : feedback.speechBubbleType === 'warning'
                        ? 'bg-[#FDF0EC] border-[#F6BCB0]'
                        : 'bg-amber-50 border-amber-200'
                    }`}
                  />

                  <div className="flex items-center gap-1.5">
                    {feedback.speechBubbleType === 'compliment' ? (
                      <ThumbsUp className="w-4 h-4 text-[#3D836E] shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-[#DF684E] shrink-0" />
                    )}
                    <span className="text-xs font-black tracking-tight">
                      {feedback.feedbackTitle}
                    </span>
                  </div>

                  <p className="text-[11px] font-medium leading-relaxed">
                    {feedback.feedbackText}
                  </p>

                  {/* If taboo warning, provide direct retry button with the correct phrase */}
                  {feedback.speechBubbleType === 'warning' && (
                    <div className="pt-1.5 border-t border-rose-200/80 flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold text-stone-600 truncate">
                        바른 표현: "{feedback.expectedPhrase}"
                      </span>
                      <button
                        onClick={() => handleSubmitSpoken(feedback.expectedPhrase)}
                        className="px-2 py-0.5 rounded-lg bg-[#DF684E] text-white text-[10px] font-bold hover:bg-[#BA462E] transition-colors shrink-0 shadow-2xs"
                      >
                        바른 문장으로 다시 말하기
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* Live Speech Recognition Transcription Preview */}
        {isListening && (
          <div className="flex flex-col items-end animate-in fade-in">
            <span className="text-[10px] font-bold text-[#DF684E] mb-1 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#DF684E] animate-ping" />
              실시간 음성 인식 중...
            </span>
            <div className="max-w-[85%] rounded-2xl rounded-tr-xs p-3 bg-red-50/90 border border-red-200 text-stone-800">
              <p className="text-xs sm:text-sm font-medium italic">
                {interimTranscript || '마이크에 대고 또박또박 말씀하세요...'}
              </p>
            </div>
          </div>
        )}

        {/* Conversation Completed Banner */}
        {isCompleted && (
          <div className="p-4 rounded-2xl bg-[#EEF6F3] border border-[#A3CEC2] text-center space-y-2 animate-in zoom-in-95">
            <div className="w-10 h-10 rounded-full bg-[#3D836E] text-white flex items-center justify-center mx-auto shadow-2xs">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-[#253342]">
              🎉 역할극을 성공적으로 마쳤습니다!
            </h4>
            <p className="text-xs text-stone-600">
              한국의 관혼상제 및 생활 상황에서 자연스럽게 대화할 수 있는 실력을 쌓았습니다.
            </p>
            <div className="pt-1 flex justify-center gap-2">
              <button
                onClick={handleResetConversation}
                className="px-3 py-1.5 rounded-xl bg-white border border-[#A3CEC2] text-xs font-bold text-[#3D836E] hover:bg-[#FAF7F2] transition-colors"
              >
                다시 연습하기
              </button>
              <button
                onClick={() => {
                  const nextIndex =
                    (ROLEPLAY_SCENARIOS.findIndex((s) => s.id === selectedScenarioId) + 1) %
                    ROLEPLAY_SCENARIOS.length;
                  setSelectedScenarioId(ROLEPLAY_SCENARIOS[nextIndex].id);
                }}
                className="px-3 py-1.5 rounded-xl bg-[#3D836E] text-xs font-bold text-white hover:bg-[#2A5C4E] transition-colors shadow-2xs"
              >
                다음 상황 연습 →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Step Prompt Guide Box (Comfortable spacing & clear legibility, never squished) */}
      {!isCompleted && currentExpected && (
        <div className="px-3.5 py-2 bg-[#FAF7F2] border-t border-[#E8E2D6] shrink-0">
          <div className="p-3 rounded-2xl bg-white border border-[#E8E2D6] shadow-2xs space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#EEF6F3] text-[#3D836E] shrink-0">
                  Step {stepIndex + 1}/{scenario.expectedResponses.length}
                </span>
                <span className="text-[11px] font-bold text-stone-600">
                  이렇게 말해보세요:
                </span>
              </div>
              <button
                onClick={() => handlePlayAudio(currentExpected.expectedKo)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#EEF6F3] text-[11px] font-bold text-[#3D836E] hover:bg-[#A3CEC2]/40 transition-colors shrink-0 cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>발음 듣기</span>
              </button>
            </div>

            <div className="space-y-0.5">
              <p className="text-sm sm:text-base font-extrabold text-[#253342] leading-snug break-keep">
                "{currentExpected.expectedKo}"
              </p>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-stone-500 pt-0.5">
                <span className="font-mono text-[10.5px] text-stone-400">
                  [{currentExpected.phonetic}]
                </span>
                <span className="text-stone-300">·</span>
                <span className="text-[#3D836E] font-medium">
                  {currentExpected.meaning[language] || currentExpected.meaning.ko}
                </span>
              </div>
            </div>

            {/* Quick Test Presets (Comfortable inline chips with clear margins) */}
            <div className="pt-1.5 border-t border-stone-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              <span className="text-[10px] font-bold text-stone-400 shrink-0">
                빠른 테스트:
              </span>
              <button
                onClick={() => handleSubmitSpoken(currentExpected.expectedKo)}
                className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-bold border border-emerald-200 transition-colors whitespace-nowrap cursor-pointer shadow-2xs"
                title="정답 문장을 말하여 칭찬 말풍선 확인"
              >
                ✓ 올바른 문장 (칭찬 말풍선)
              </button>
              {selectedScenarioId === 'rites-funeral' ? (
                <button
                  onClick={() => handleSubmitSpoken('장례식 진심으로 축하해요!')}
                  className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-800 text-[11px] font-bold border border-rose-200 transition-colors whitespace-nowrap cursor-pointer shadow-2xs"
                  title="'축하' 단어를 사용하여 결례 교정 말풍선 확인"
                >
                  ✗ 결례 테스트: "축하" (교정 말풍선)
                </button>
              ) : selectedScenarioId === 'rites-wedding' ? (
                <button
                  onClick={() => handleSubmitSpoken('삼가 고인의 명복을 빕니다')}
                  className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-800 text-[11px] font-bold border border-rose-200 transition-colors whitespace-nowrap cursor-pointer shadow-2xs"
                  title="'명복/삼가'를 사용하여 결례 교정 말풍선 확인"
                >
                  ✗ 결례 테스트: "명복" (교정 말풍선)
                </button>
              ) : (
                <button
                  onClick={() => handleSubmitSpoken('야! 물 빨리 줘')}
                  className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-800 text-[11px] font-bold border border-rose-200 transition-colors whitespace-nowrap cursor-pointer shadow-2xs"
                  title="'야/빨리' 반말을 사용하여 결례 교정 말풍선 확인"
                >
                  ✗ 결례 테스트: 반말 (교정 말풍선)
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* STT Error Alert */}
      {sttError && (
        <div className="px-3.5 py-1.5 bg-rose-50 border-t border-rose-200 text-rose-700 text-[11px] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span className="line-clamp-1">{sttError}</span>
          </div>
          <button
            onClick={() => setSttError(null)}
            className="text-stone-400 hover:text-stone-700 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Bottom Chat Bar with Large Microphone Button (Comfortable bottom padding & clearance) */}
      <div className="pt-2 pb-4 px-4 bg-white border-t border-[#E8E2D6] shrink-0">
        {!isKeyboardMode ? (
          <div className="flex flex-col items-center justify-center space-y-1.5">
            {/* Recognized text preview before sending */}
            {spokenTranscript ? (
              <div className="w-full p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8E2D6] flex items-center justify-between gap-2 animate-in fade-in mb-1">
                <div className="min-w-0">
                  <span className="text-[10px] font-semibold text-stone-500 block">
                    인식된 문장:
                  </span>
                  <p className="text-xs sm:text-sm font-bold text-[#253342] truncate">
                    {spokenTranscript}
                  </p>
                </div>
                <button
                  onClick={() => handleSubmitSpoken()}
                  className="px-3 py-1.5 rounded-xl bg-[#3D836E] text-white text-xs font-bold hover:bg-[#2A5C4E] flex items-center gap-1 shrink-0 transition-colors shadow-2xs cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>전송</span>
                </button>
              </div>
            ) : null}

            {/* The Prominent Microphone Button (Safe 54px size, comfortable margins, never cut off) */}
            <div className="relative flex items-center justify-center my-0.5">
              {isListening && (
                <>
                  <span className="absolute w-16 h-16 rounded-full bg-[#DF684E]/20 animate-ping" />
                  <span className="absolute w-18 h-18 rounded-full bg-[#DF684E]/10 animate-pulse" />
                </>
              )}

              <button
                onClick={handleToggleListening}
                className={`relative z-10 w-13 h-13 sm:w-14 sm:h-14 rounded-full flex flex-col items-center justify-center text-white transition-all transform active:scale-95 shadow-md cursor-pointer ${
                  isListening
                    ? 'bg-gradient-to-br from-[#DF684E] to-[#C4472D] ring-4 ring-[#DF684E]/30 scale-105'
                    : 'bg-gradient-to-br from-[#3D836E] to-[#2A5C4E] hover:from-[#346F5D] hover:to-[#234D41]'
                }`}
                title={isListening ? '말하기 중지' : '마이크 켜고 말하기'}
              >
                {isListening ? (
                  <MicOff className="w-6 h-6 animate-bounce" />
                ) : (
                  <Mic className="w-6 h-6" />
                )}
              </button>
            </div>

            {/* Instruction and Mode Toggle */}
            <div className="flex items-center justify-between w-full pt-1">
              <span className="text-[11px] font-medium text-stone-500 text-center flex-1">
                {isListening ? (
                  <span className="text-[#DF684E] font-bold flex items-center justify-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#DF684E] animate-pulse" />
                    듣고 있습니다... 말씀하세요 🎙️
                  </span>
                ) : (
                  '마이크를 터치하고 한국어로 말씀하세요'
                )}
              </span>

              <button
                onClick={() => setIsKeyboardMode(true)}
                className="px-2 py-1 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-colors flex items-center gap-1 text-[11px] font-medium cursor-pointer"
                title="직접 텍스트로 입력하기"
              >
                <Keyboard className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">키보드</span>
              </button>
            </div>
          </div>
        ) : (
          /* Manual Keyboard Input Fallback */
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-stone-500">
              <span className="font-semibold text-[11.5px]">직접 입력 모드</span>
              <button
                onClick={() => setIsKeyboardMode(false)}
                className="text-[#3D836E] font-bold flex items-center gap-1 text-[11.5px] cursor-pointer hover:underline"
              >
                <Mic className="w-3.5 h-3.5" />
                <span>마이크 음성 모드 복귀</span>
              </button>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSubmitSpoken();
                  }
                }}
                placeholder={currentExpected?.expectedKo || '한국어 문장을 입력하세요'}
                className="flex-1 px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#E8E2D6] text-xs sm:text-sm text-stone-800 placeholder-stone-400 focus:outline-hidden focus:border-[#3D836E]"
              />
              <button
                onClick={() => handleSubmitSpoken()}
                disabled={!manualInput.trim()}
                className="px-3.5 py-2 rounded-xl bg-[#3D836E] disabled:bg-stone-300 text-white text-xs font-bold transition-colors flex items-center gap-1 shadow-2xs cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>전송</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* JSON Correction Dictionary Inspection Modal */}
      {showDictionaryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-lg max-h-[85vh] bg-white rounded-3xl p-5 shadow-2xl border border-[#E8E2D6] flex flex-col space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#E8E2D6]">
              <div className="flex items-center gap-2">
                <FileCode2 className="w-5 h-5 text-[#3D836E]" />
                <div>
                  <h3 className="text-sm font-bold text-[#253342]">
                    상황별 예상 답변 및 교정 사전 (JSON)
                  </h3>
                  <p className="text-[10px] text-stone-500">
                    유료 AI 없이 100% 로컬 동작하는 규칙 기반 매칭 데이터
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowDictionaryModal(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar space-y-3 text-xs">
              <p className="text-stone-600 leading-relaxed">
                각 상황마다 <strong>올바른 답변(정답 및 칭찬 문구)</strong>과{' '}
                <strong className="text-[#DF684E]">금기어/결례 단어(교정 피드백 문구)</strong>가
                JSON 데이터로 내장되어 있어, 오프라인 환경에서도 즉각적인 실시간 피드백을 제공합니다.
              </p>

              <div className="space-y-2">
                {Object.entries(dictionaryJson.scenarios).map(([key, sData]: [string, any]) => (
                  <div
                    key={key}
                    className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E8E2D6] space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#253342]">
                        {sData.scenarioNameKo} ({sData.scenarioNameEn})
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white text-stone-600 border border-[#E8E2D6]">
                        {key}
                      </span>
                    </div>

                    <div className="space-y-1 text-[11px]">
                      <div>
                        <span className="font-bold text-[#3D836E]">✓ 모범 답변: </span>
                        {sData.expectedAnswers.map((ea: any) => (
                          <span key={ea.step} className="block text-stone-700 ml-2">
                            • "{ea.targetPhrase}"
                          </span>
                        ))}
                      </div>

                      <div className="pt-1 border-t border-stone-200/60">
                        <span className="font-bold text-[#DF684E]">✗ 감지 금기어: </span>
                        {sData.tabooKeywords.map((tk: any, i: number) => (
                          <div key={i} className="ml-2 mt-0.5 text-stone-600">
                            • <span className="font-bold text-rose-700">[{tk.words.join(', ')}]</span> → {tk.feedbackKo.slice(0, 45)}...
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-xl bg-stone-900 text-emerald-400 font-mono text-[10px] overflow-x-auto whitespace-pre no-scrollbar">
                {JSON.stringify(dictionaryJson, null, 2).slice(0, 1000)}
                ... (생략)
              </div>
            </div>

            <button
              onClick={() => setShowDictionaryModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#3D836E] text-white text-xs font-bold cursor-pointer"
            >
              닫기
            </button>
          </div>
        </div>
      )}

      {/* Expo Native Voice Setup Architecture Dialog */}
      {showExpoInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-5 shadow-2xl border border-[#E8E2D6] space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mic className="w-5 h-5 text-[#3D836E]" />
                <h3 className="text-sm font-bold text-[#253342]">
                  무료 기기 내장 음성인식 (STT) 아키텍처
                </h3>
              </div>
              <button
                onClick={() => setShowExpoInfo(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs text-stone-600 space-y-2">
              <p>
                본 기능은 외부 유료 클라우드 API 호출 없이, 스마트폰 OS(Android/iOS) 및
                브라우저에 내장된 <strong>무료 네이티브 음성 엔진</strong>을 활용합니다.
              </p>
              <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8E2D6] space-y-1 font-mono text-[11px]">
                <p className="font-bold text-[#253342]">
                  Web: Web Speech API (SpeechRecognition)
                </p>
                <p className="text-stone-500">
                  Expo / React Native: @react-native-voice/voice
                </p>
              </div>
              <pre className="p-2.5 rounded-xl bg-stone-900 text-emerald-400 font-mono text-[10px] overflow-x-auto whitespace-pre no-scrollbar">
                {EXPO_VOICE_INTEGRATION_GUIDE.setupDocs}
              </pre>
            </div>

            <button
              onClick={() => setShowExpoInfo(false)}
              className="w-full py-2 rounded-xl bg-[#3D836E] text-white text-xs font-bold cursor-pointer"
            >
              확인 완료
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

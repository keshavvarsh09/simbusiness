'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, getAuthHeaders } from '@/lib/auth';
import { FiCheckCircle, FiCircle, FiClock, FiLock, FiUnlock, FiDownload, FiBook, FiExternalLink } from 'react-icons/fi';

interface ChecklistStep {
  stepNumber: number;
  section: string;
  title: string;
  description: string;
  checklistActions: string[];
  dependencies: number[];
  resources: Array<{ title: string; url: string; type: string }>;
  reflectionPrompts?: string[];
  progress: {
    status: 'pending' | 'in_progress' | 'completed';
    completedAt: string | null;
    notes: string | null;
    checklistData: any;
  };
  mcq?: {
    question: string;
    options: string[];
    correctAnswer: string;
    feedback: {
      correct: string;
      incorrect: string;
      explanation: string;
    };
  };
  useAiMcq?: boolean; // Flag to indicate AI MCQ should be generated
  isAiGenerated?: boolean; // Flag to indicate this MCQ is AI-generated
}

interface ChecklistSummary {
  totalSteps: number;
  completedSteps: number;
  inProgressSteps: number;
  pendingSteps: number;
  completionPercentage: number;
  nextSuggestedStep: number | null;
}

export default function DropshippingLauncherPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [steps, setSteps] = useState<ChecklistStep[]>([]);
  const [summary, setSummary] = useState<ChecklistSummary | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set());
  const [selectedStep, setSelectedStep] = useState<number | null>(null);
  const [mcqAnswer, setMcqAnswer] = useState<string>('');
  const [mcqFeedback, setMcqFeedback] = useState<any>(null);
  const [notesDrafts, setNotesDrafts] = useState<Record<number, string>>({});
  const [savingReflectionStep, setSavingReflectionStep] = useState<number | null>(null);
  const [loadingAiMcq, setLoadingAiMcq] = useState<number | null>(null);
  const [aiMcqs, setAiMcqs] = useState<Record<number, any>>({});

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/auth/signin');
      return;
    }
    fetchChecklist();
  }, [router]);

  const fetchChecklist = async () => {
    try {
      const response = await fetch('/api/dropshipping/checklist', {
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      if (data.success) {
        setSteps(data.steps);
        setSummary(data.summary);
        const initialDrafts: Record<number, string> = {};
        data.steps.forEach((step: ChecklistStep) => {
          initialDrafts[step.stepNumber] = step.progress.notes || '';
        });
        setNotesDrafts(initialDrafts);
        // Expand first section by default
        if (data.steps.length > 0) {
          setExpandedSections(new Set([data.steps[0].section]));
        }
      }
    } catch (error) {
      console.error('Error fetching checklist:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNotesChange = (stepNumber: number, value: string) => {
    setNotesDrafts(prev => ({
      ...prev,
      [stepNumber]: value,
    }));
  };

  const saveReflectionNotes = async (stepNumber: number) => {
    const step = steps.find(s => s.stepNumber === stepNumber);
    if (!step) return;
    setSavingReflectionStep(stepNumber);
    try {
      await updateStepProgress(stepNumber, step.progress.status, notesDrafts[stepNumber] || '');
    } finally {
      setSavingReflectionStep(null);
    }
  };

  const updateStepProgress = async (stepNumber: number, status: 'pending' | 'in_progress' | 'completed', notes?: string) => {
    try {
      const response = await fetch('/api/dropshipping/progress', {
        method: 'POST',
        headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ stepNumber, status, notes }),
      });
      const data = await response.json();
      if (data.success) {
        fetchChecklist();
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const generateAiMcq = async (stepNumber: number) => {
    setLoadingAiMcq(stepNumber);
    try {
      const response = await fetch('/api/dropshipping/generate-mcq', {
        method: 'POST',
        headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ stepNumber }),
      });
      const data = await response.json();
      if (data.success && data.mcq) {
        // Store the AI-generated MCQ
        setAiMcqs(prev => ({
          ...prev,
          [stepNumber]: { ...data.mcq, isAiGenerated: true }
        }));
        // Update the step with the AI MCQ
        setSteps(prevSteps => prevSteps.map(step => 
          step.stepNumber === stepNumber 
            ? { ...step, mcq: data.mcq, isAiGenerated: true }
            : step
        ));
      } else {
        console.error('Failed to generate AI MCQ:', data.error);
        alert('Failed to generate question. Please try again.');
      }
    } catch (error) {
      console.error('Error generating AI MCQ:', error);
      alert('Error generating question. Please try again.');
    } finally {
      setLoadingAiMcq(null);
    }
  };

  const submitMcq = async (stepNumber: number, questionText: string, selectedAnswer: string, mcqData?: any) => {
    try {
      const step = steps.find(s => s.stepNumber === stepNumber);
      const isAiGenerated = step?.isAiGenerated || mcqData?.isAiGenerated || false;
      
      const payload: any = {
        stepNumber,
        questionText,
        selectedAnswer
      };

      // If AI-generated, include full context
      if (isAiGenerated && mcqData) {
        payload.isAiGenerated = true;
        payload.allOptions = mcqData.options;
        payload.correctAnswer = mcqData.correctAnswer;
        payload.feedback = mcqData.feedback;
        payload.explanation = mcqData.feedback.explanation;
      }

      const response = await fetch('/api/dropshipping/mcq', {
        method: 'POST',
        headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (data.success) {
        setMcqFeedback(data);
        // Refresh checklist to update useAiMcq flags
        fetchChecklist();
      }
    } catch (error) {
      console.error('Error submitting MCQ:', error);
    }
  };

  const areDependenciesMet = (step: ChecklistStep): boolean => {
    if (step.dependencies.length === 0) return true;
    return step.dependencies.every(dep => {
      const depStep = steps.find(s => s.stepNumber === dep);
      return depStep?.progress.status === 'completed';
    });
  };

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const toggleStep = (stepNumber: number) => {
    const newExpanded = new Set(expandedSteps);
    if (newExpanded.has(stepNumber)) {
      newExpanded.delete(stepNumber);
    } else {
      newExpanded.add(stepNumber);
    }
    setExpandedSteps(newExpanded);
  };

  const getSections = () => {
    const sections: Record<string, ChecklistStep[]> = {};
    steps.forEach(step => {
      if (!sections[step.section]) {
        sections[step.section] = [];
      }
      sections[step.section].push(step);
    });
    return sections;
  };

  const exportProgress = () => {
    const report = {
      summary,
      steps: steps.map(s => ({
        stepNumber: s.stepNumber,
        title: s.title,
        status: s.progress.status,
        completedAt: s.progress.completedAt,
        notes: s.progress.notes,
      })),
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dropshipping-progress-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading checklist...</p>
        </div>
      </div>
    );
  }

  const sections = getSections();
  const sectionNames = Object.keys(sections);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Welcome & Progress Panel */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Kickstart Your Dropshipping Business
          </h1>
          <p className="text-gray-600 mb-6">
            Follow Each Step, Learn, and Build As You Go
          </p>

          {summary && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-600">{summary.completionPercentage}%</div>
                <div className="text-sm text-gray-600">Complete</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-600">{summary.completedSteps}</div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-yellow-600">{summary.inProgressSteps}</div>
                <div className="text-sm text-gray-600">In Progress</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-gray-600">{summary.pendingSteps}</div>
                <div className="text-sm text-gray-600">Pending</div>
              </div>
            </div>
          )}

          {/* Progress Bar */}
          {summary && (
            <div className="mb-4">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${summary.completionPercentage}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Next Suggested Step */}
          {summary && summary.nextSuggestedStep && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <FiClock className="text-blue-600" />
                <span className="font-semibold text-blue-800">Next Suggested Step:</span>
              </div>
              <p className="text-blue-700">
                Step {summary.nextSuggestedStep}: {steps.find(s => s.stepNumber === summary.nextSuggestedStep)?.title}
              </p>
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={exportProgress}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              <FiDownload />
              Export Progress
            </button>
          </div>
        </div>

        {/* Master Checklist */}
        <div className="space-y-4">
          {sectionNames.map((sectionName, sectionIndex) => {
            const sectionSteps = sections[sectionName];
            const isExpanded = expandedSections.has(sectionName);
            const sectionCompleted = sectionSteps.every(s => s.progress.status === 'completed');
            const sectionInProgress = sectionSteps.some(s => s.progress.status === 'in_progress');

            return (
              <div key={sectionName} className="bg-white rounded-lg shadow-md overflow-hidden">
                <button
                  onClick={() => toggleSection(sectionName)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`text-2xl font-bold ${sectionCompleted ? 'text-green-600' : sectionInProgress ? 'text-yellow-600' : 'text-gray-400'}`}>
                      {String.fromCharCode(65 + sectionIndex)}
                    </div>
                    <div className="text-left">
                      <h2 className="text-xl font-semibold text-gray-800">{sectionName}</h2>
                      <p className="text-sm text-gray-500">
                        {sectionSteps.filter(s => s.progress.status === 'completed').length} / {sectionSteps.length} steps completed
                      </p>
                    </div>
                  </div>
                  <div className="text-gray-400">
                    {isExpanded ? '▼' : '▶'}
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t border-gray-200">
                    {sectionSteps.map(step => {
                      const isStepExpanded = expandedSteps.has(step.stepNumber);
                      const dependenciesMet = areDependenciesMet(step);
                      const isLocked = !dependenciesMet && step.dependencies.length > 0;

                      return (
                        <div key={step.stepNumber} className="border-b border-gray-100 last:border-b-0">
                          <div className="px-6 py-4">
                            <div className="flex items-start gap-4">
                              <div className="flex-shrink-0 mt-1">
                                {step.progress.status === 'completed' ? (
                                  <FiCheckCircle className="text-green-600 text-2xl" />
                                ) : step.progress.status === 'in_progress' ? (
                                  <FiClock className="text-yellow-600 text-2xl" />
                                ) : isLocked ? (
                                  <FiLock className="text-gray-400 text-2xl" />
                                ) : (
                                  <FiCircle className="text-gray-400 text-2xl" />
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-sm font-semibold text-gray-500">Step {step.stepNumber}</span>
                                  {isLocked && (
                                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Locked</span>
                                  )}
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">{step.title}</h3>
                                <p className="text-gray-600 mb-3">{step.description}</p>

                                <button
                                  onClick={() => toggleStep(step.stepNumber)}
                                  className="text-sm text-blue-600 hover:text-blue-800 mb-3"
                                  disabled={isLocked}
                                >
                                  {isStepExpanded ? 'Hide Details' : 'Show Details'}
                                </button>

                                {isStepExpanded && (
                                  <div className="mt-4 space-y-4">
                                    {/* Checklist Actions */}
                                    <div>
                                      <h4 className="font-semibold text-gray-700 mb-2">Checklist Actions:</h4>
                                      <ul className="list-disc list-inside space-y-1 text-gray-600">
                                        {step.checklistActions.map((action, idx) => (
                                          <li key={idx}>{action}</li>
                                        ))}
                                      </ul>
                                    </div>

                                    {/* Resources */}
                                    {step.resources && step.resources.length > 0 && (
                                      <div>
                                        <h4 className="font-semibold text-gray-700 mb-2">Resources:</h4>
                                        <div className="space-y-2">
                                          {step.resources.map((resource, idx) => (
                                            <a
                                              key={idx}
                                              href={resource.url}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm"
                                            >
                                              <FiExternalLink />
                                              {resource.title}
                                            </a>
                                          ))}
                                        </div>
                                      </div>
                                    )}

                                    {/* MCQ */}
                                    {step.useAiMcq && !step.mcq && (
                                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                                        <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                          <FiBook className="text-purple-600" />
                                          AI-Powered Learning Question:
                                        </h4>
                                        <p className="text-gray-600 mb-4 text-sm">
                                          Get a personalized question based on your budget, interests, and learning progress.
                                        </p>
                                        <button
                                          onClick={() => generateAiMcq(step.stepNumber)}
                                          disabled={loadingAiMcq === step.stepNumber}
                                          className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                        >
                                          {loadingAiMcq === step.stepNumber ? (
                                            <>
                                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                              Generating...
                                            </>
                                          ) : (
                                            'Generate Personalized Question'
                                          )}
                                        </button>
                                      </div>
                                    )}
                                    {step.mcq && (
                                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                          <FiBook className="text-blue-600" />
                                          {step.isAiGenerated ? 'AI-Powered ' : ''}Learning Question:
                                        </h4>
                                        <p className="text-gray-800 mb-4">{step.mcq.question}</p>
                                        <div className="space-y-2 mb-4">
                                          {step.mcq.options.map((option, idx) => {
                                            const optionLetter = String.fromCharCode(97 + idx);
                                            return (
                                              <label
                                                key={idx}
                                                className="flex items-center gap-2 p-2 bg-white rounded border border-gray-200 cursor-pointer hover:bg-gray-50"
                                              >
                                                <input
                                                  type="radio"
                                                  name={`mcq-${step.stepNumber}`}
                                                  value={optionLetter}
                                                  checked={mcqAnswer === optionLetter && selectedStep === step.stepNumber}
                                                  onChange={() => {
                                                    setMcqAnswer(optionLetter);
                                                    setSelectedStep(step.stepNumber);
                                                    setMcqFeedback(null);
                                                  }}
                                                  className="text-blue-600"
                                                />
                                                <span className="text-gray-700">{option}</span>
                                              </label>
                                            );
                                          })}
                                        </div>
                                        {mcqAnswer && selectedStep === step.stepNumber && (
                                          <button
                                            onClick={() => submitMcq(step.stepNumber, step.mcq!.question, mcqAnswer, step.mcq)}
                                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                                          >
                                            Submit Answer
                                          </button>
                                        )}
                                        {mcqFeedback && selectedStep === step.stepNumber && (
                                          <div className={`mt-4 p-4 rounded-lg ${mcqFeedback.isCorrect ? 'bg-green-50 border-2 border-green-300' : 'bg-red-50 border-2 border-red-300'}`}>
                                            <p className={`font-bold text-lg mb-3 ${mcqFeedback.isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                                              {mcqFeedback.isCorrect ? '✓ Correct!' : '✗ Incorrect'}
                                            </p>
                                            <div className="text-sm mt-3 text-gray-800 whitespace-pre-line space-y-2">
                                              {mcqFeedback.feedback?.split('\n').map((line: string, idx: number) => {
                                                // Handle bold markdown **text**
                                                const parts = line.split(/(\*\*.*?\*\*)/g);
                                                return (
                                                  <p key={idx} className="mb-2">
                                                    {parts.map((part, pIdx) => {
                                                      if (part.startsWith('**') && part.endsWith('**')) {
                                                        return <strong key={pIdx} className="font-semibold">{part.slice(2, -2)}</strong>;
                                                      }
                                                      return <span key={pIdx}>{part}</span>;
                                                    })}
                                                  </p>
                                                );
                                              })}
                                            </div>
                                            {mcqFeedback.explanation && (
                                              <div className="mt-4 pt-4 border-t border-gray-300">
                                                <p className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Detailed Explanation:</p>
                                                <div className="text-sm text-gray-700 whitespace-pre-line space-y-2">
                                                  {mcqFeedback.explanation.split('\n').map((line: string, idx: number) => {
                                                    // Handle bold markdown **text**
                                                    const parts = line.split(/(\*\*.*?\*\*)/g);
                                                    return (
                                                      <p key={idx} className="mb-1">
                                                        {parts.map((part, pIdx) => {
                                                          if (part.startsWith('**') && part.endsWith('**')) {
                                                            return <strong key={pIdx} className="font-semibold text-gray-800">{part.slice(2, -2)}</strong>;
                                                          }
                                                          return <span key={pIdx}>{part}</span>;
                                                        })}
                                                      </p>
                                                    );
                                                  })}
                                                </div>
                                              </div>
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    )}

                                    {/* Reflection Prompts */}
                                    {step.reflectionPrompts && step.reflectionPrompts.length > 0 && (
                                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-3">
                                        <div className="flex items-center gap-2">
                                          <FiBook className="text-amber-600" />
                                          <h4 className="font-semibold text-gray-800">Reflect & Adjust</h4>
                                        </div>
                                        <ul className="list-disc list-inside text-gray-700 space-y-1">
                                          {step.reflectionPrompts.map((prompt, idx) => (
                                            <li key={idx}>{prompt}</li>
                                          ))}
                                        </ul>
                                        <div>
                                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Your Reflection Notes
                                          </label>
                                          <textarea
                                            className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                                            rows={3}
                                            value={notesDrafts[step.stepNumber] ?? ''}
                                            onChange={(e) => handleNotesChange(step.stepNumber, e.target.value)}
                                            placeholder="Summarize what you learned or what needs adjustment..."
                                          />
                                          <button
                                            onClick={() => saveReflectionNotes(step.stepNumber)}
                                            disabled={savingReflectionStep === step.stepNumber}
                                            className="mt-2 bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-700 disabled:opacity-50"
                                          >
                                            {savingReflectionStep === step.stepNumber ? 'Saving...' : 'Save Reflection'}
                                          </button>
                                        </div>
                                      </div>
                                    )}

                                    {/* Progress Controls */}
                                    <div className="flex gap-2 pt-4 border-t border-gray-200">
                                      {step.progress.status !== 'completed' && (
                                        <>
                                          {step.progress.status === 'pending' && (
                                            <button
                                              onClick={() => updateStepProgress(step.stepNumber, 'in_progress')}
                                              disabled={isLocked}
                                              className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                              Start Step
                                            </button>
                                          )}
                                          <button
                                            onClick={() => updateStepProgress(step.stepNumber, 'completed')}
                                            disabled={isLocked}
                                            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                          >
                                            Mark Complete
                                          </button>
                                        </>
                                      )}
                                      {step.progress.status === 'completed' && (
                                        <button
                                          onClick={() => updateStepProgress(step.stepNumber, 'in_progress')}
                                          className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
                                        >
                                          Reopen Step
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}


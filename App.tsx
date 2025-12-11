
import React, { useState, useEffect } from 'react';
import { Microscope, Settings } from 'lucide-react';
import AnalysisForm from './components/AnalysisForm';
import ReportViewer from './components/ReportViewer';
import ApiKeyModal from './components/ApiKeyModal';
import { analyzeLCMethod } from './services/geminiService';
import { ExperimentData, AnalysisState } from './types';
import { getStoredApiKey } from './utils/apiKeyStorage';

function App() {
  const [analysisState, setAnalysisState] = useState<AnalysisState>({
    isLoading: false,
    result: null,
    error: null,
  });

  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Check local storage for key on initial load
    const storedKey = getStoredApiKey();
    if (storedKey) {
      setApiKey(storedKey);
    } else {
      setIsModalOpen(true); // Prompt user if no key found
    }
  }, []);

  const handleAnalysis = async (data: ExperimentData) => {
    if (!apiKey) {
      setIsModalOpen(true);
      return;
    }

    setAnalysisState({ isLoading: true, result: null, error: null });
    try {
      const report = await analyzeLCMethod(data, apiKey);
      setAnalysisState({ isLoading: false, result: report, error: null });
    } catch (error: any) {
      setAnalysisState({ 
        isLoading: false, 
        result: null, 
        error: error.message || 'An unexpected error occurred.' 
      });
    }
  };

  const handleKeySave = (newKey: string) => {
    setApiKey(newKey);
    // Clear any previous API related errors
    if (analysisState.error?.includes('API Key')) {
        setAnalysisState(prev => ({ ...prev, error: null }));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-12">
      <ApiKeyModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleKeySave}
      />

      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Microscope className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">LC Method Optimizer AI</h1>
              <p className="text-xs text-slate-500">천연물 분석 조건 최적화 도우미</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-slate-500 hidden sm:block">
              Powered by Google Gemini 2.5
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <Settings className="w-4 h-4" />
              API Key 설정
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* Left Column: Input Form */}
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-blue-800">
              <p className="font-semibold mb-1">💡 사용 가이드</p>
              <p>
                현재 수행 중인 HPLC/LC-MS 분석 조건과 문제점(피크 겹침, 모양 불량 등)을 입력하면, 
                AI 수석 연구원이 <strong>크로마토그래피 이론</strong>에 기반한 최적화 솔루션을 제안합니다.
              </p>
            </div>
            
            <AnalysisForm 
              onSubmit={handleAnalysis} 
              isLoading={analysisState.isLoading} 
            />
            
            {analysisState.error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 flex items-start gap-3">
                <div className="mt-0.5 font-bold">Error:</div>
                <div>{analysisState.error}</div>
              </div>
            )}
          </div>

          {/* Right Column: Report */}
          <div className="lg:h-[calc(100vh-8rem)] lg:sticky lg:top-24 min-h-[500px]">
            {analysisState.result ? (
              <ReportViewer report={analysisState.result} />
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 border-dashed h-full flex flex-col items-center justify-center p-12 text-center text-slate-400">
                {analysisState.isLoading ? (
                  <div className="space-y-4 animate-pulse">
                    <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto flex items-center justify-center">
                      <Microscope className="w-8 h-8 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-slate-700">분석 중입니다...</h3>
                      <p className="text-sm">복잡한 화합물의 상호작용을 계산하고 있습니다.</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <Microscope className="w-16 h-16 mb-4 opacity-20" />
                    <h3 className="text-lg font-medium text-slate-600">분석 결과 대기 중</h3>
                    <p className="text-sm max-w-xs mx-auto mt-2">
                      왼쪽 폼에 실험 데이터를 입력하고 '최적화 솔루션 받기'를 클릭하세요.
                    </p>
                    {!apiKey && (
                       <p className="text-xs text-red-400 mt-4 bg-red-50 px-3 py-1 rounded-full">
                         ⚠️ API Key 설정이 필요합니다
                       </p>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}

export default App;

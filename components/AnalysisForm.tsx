import React, { useState, useRef } from 'react';
import { ExperimentData } from '../types';
import { FlaskConical, TestTube, Settings2, Activity, AlertTriangle, FileText, ImagePlus, X, Upload } from 'lucide-react';

interface Props {
  onSubmit: (data: ExperimentData) => void;
  isLoading: boolean;
}

const AnalysisForm: React.FC<Props> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<ExperimentData>({
    sampleInfo: '',
    targetSubstance: '',
    currentColumn: 'C18, 5µm, 4.6x150mm',
    mobilePhase: 'A: 0.1% Formic acid in Water, B: ACN',
    gradient: '0-30 min: 10% -> 90% B',
    problem: '',
    imageBase64: undefined,
    imageMimeType: undefined
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일(JPG, PNG)만 업로드 가능합니다.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      // result is a data URL like "data:image/jpeg;base64,/9j/4AAQ..."
      const [meta, base64Data] = result.split(',');
      const mimeType = meta.match(/:(.*?);/)?.[1];

      setFormData(prev => ({
        ...prev,
        imageBase64: base64Data,
        imageMimeType: mimeType
      }));
      setImagePreview(result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({
      ...prev,
      imageBase64: undefined,
      imageMimeType: undefined
    }));
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const fillExample = () => {
    setFormData(prev => ({
      ...prev,
      sampleInfo: '소나무 껍질 에탄올 추출물',
      targetSubstance: '퀘르세틴 배당체 추정',
      currentColumn: 'C18, 5µm, 4.6x150mm',
      mobilePhase: 'A: 0.1% Formic acid in Water, B: ACN',
      gradient: '0-30분: 10%->90% B',
      problem: 'RT 15분 대에서 피크 2개가 겹쳐서 나옴, Tailing이 심함'
    }));
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <Settings2 className="w-5 h-5 text-blue-600" />
          분석 조건 입력
        </h2>
        <button 
          type="button" 
          onClick={fillExample}
          className="text-xs text-blue-600 hover:text-blue-800 font-medium px-3 py-1 bg-blue-50 rounded-full transition-colors"
        >
          예시 데이터 채우기
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        
        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1">
              <FlaskConical className="w-4 h-4 text-slate-400" /> 샘플 정보
            </label>
            <input
              type="text"
              name="sampleInfo"
              required
              className="w-full rounded-lg border-slate-300 border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="예: 소나무 껍질 추출물"
              value={formData.sampleInfo}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1">
              <TestTube className="w-4 h-4 text-slate-400" /> 타겟 물질
            </label>
            <input
              type="text"
              name="targetSubstance"
              required
              className="w-full rounded-lg border-slate-300 border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="예: Flavonoids, Lignans..."
              value={formData.targetSubstance}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Row 2 */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1">
            <Activity className="w-4 h-4 text-slate-400" /> 현재 컬럼
          </label>
          <input
            type="text"
            name="currentColumn"
            className="w-full rounded-lg border-slate-300 border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            value={formData.currentColumn}
            onChange={handleChange}
          />
        </div>

        {/* Row 3 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1">
              <FileText className="w-4 h-4 text-slate-400" /> 이동상 조성 (Mobile Phase)
            </label>
            <input
              type="text"
              name="mobilePhase"
              className="w-full rounded-lg border-slate-300 border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              value={formData.mobilePhase}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1">
              <Activity className="w-4 h-4 text-slate-400" /> 그래디언트 (Gradient)
            </label>
            <input
              type="text"
              name="gradient"
              className="w-full rounded-lg border-slate-300 border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              value={formData.gradient}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Problem Description with Image Upload */}
        <div className="space-y-3">
           <label className="block text-sm font-medium text-slate-700 flex items-center gap-1">
            <AlertTriangle className="w-4 h-4 text-red-400" /> 문제점 (Problem Description)
          </label>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Text Area */}
            <div className="md:col-span-2">
               <textarea
                name="problem"
                required
                rows={5}
                className="w-full h-full min-h-[120px] rounded-lg border-slate-300 border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                placeholder="예: 15분 대에서 피크 겹침, 전반적인 분리능 저하, 베이스라인 노이즈 심함 등"
                value={formData.problem}
                onChange={handleChange}
              />
            </div>

            {/* Image Upload Area */}
            <div className="md:col-span-1">
              {!imagePreview ? (
                <div 
                  className="w-full h-full min-h-[120px] border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 hover:border-blue-400 transition-colors group"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="p-3 bg-blue-50 rounded-full mb-2 group-hover:bg-blue-100 transition-colors">
                     <ImagePlus className="w-5 h-5 text-blue-500" />
                  </div>
                  <span className="text-xs text-slate-500 font-medium group-hover:text-blue-600">
                    이미지 업로드
                  </span>
                  <span className="text-[10px] text-slate-400 mt-1">
                    크로마토그램/스펙트럼
                  </span>
                </div>
              ) : (
                <div className="relative w-full h-full min-h-[120px] rounded-lg border border-slate-200 overflow-hidden bg-slate-50 group">
                  <img 
                    src={imagePreview} 
                    alt="Chromatogram Preview" 
                    className="w-full h-full object-contain"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveImage();
                    }}
                    className="absolute top-1 right-1 bg-white/80 hover:bg-red-50 p-1 rounded-full shadow-sm border border-slate-200 text-slate-500 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-0 inset-x-0 bg-black/50 text-white text-[10px] py-1 px-2 truncate">
                    이미지 첨부됨
                  </div>
                </div>
              )}
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/png, image/jpeg, image/jpg"
                className="hidden"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 px-4 rounded-lg text-white font-semibold shadow-md transition-all flex justify-center items-center gap-2
            ${isLoading 
              ? 'bg-slate-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg active:scale-[0.99]'
            }`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              분석 중... (AI Thinking)
            </>
          ) : (
            <>
              최적화 솔루션 받기
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default AnalysisForm;
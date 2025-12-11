
import React, { useState, useEffect } from 'react';
import { Key, Check, X, Loader2, Save } from 'lucide-react';
import { validateApiKey } from '../services/geminiService';
import { setStoredApiKey, getStoredApiKey } from '../utils/apiKeyStorage';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (key: string) => void;
}

const ApiKeyModal: React.FC<Props> = ({ isOpen, onClose, onSave }) => {
  const [apiKey, setApiKey] = useState('');
  const [status, setStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      const existing = getStoredApiKey();
      if (existing) setApiKey(existing);
      setStatus('idle');
      setMessage('');
    }
  }, [isOpen]);

  const handleTestConnection = async () => {
    if (!apiKey.trim()) {
      setStatus('error');
      setMessage('API Key를 입력해주세요.');
      return;
    }

    setStatus('testing');
    const isValid = await validateApiKey(apiKey);

    if (isValid) {
      setStatus('success');
      setMessage('✅ 연결 성공! 유효한 키입니다.');
    } else {
      setStatus('error');
      setMessage('❌ 유효하지 않은 키입니다. 다시 확인해주세요.');
    }
  };

  const handleSave = () => {
    if (!apiKey.trim()) {
      setStatus('error');
      setMessage('저장하기 전에 API Key를 입력해야 합니다.');
      return;
    }
    
    setStoredApiKey(apiKey);
    onSave(apiKey);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Key className="w-5 h-5 text-blue-600" />
            API Key 설정
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <p className="text-sm text-slate-600">
            Google Gemini API를 사용하기 위해 Key가 필요합니다.<br/>
            키는 브라우저에 안전하게 저장되며 서버로 전송되지 않습니다.
          </p>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Gemini API Key</label>
            <input 
              type="password" 
              value={apiKey}
              onChange={(e) => {
                setApiKey(e.target.value);
                setStatus('idle');
                setMessage('');
              }}
              placeholder="AIzaSy..."
              className="w-full rounded-lg border-slate-300 border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-mono"
            />
          </div>

          {message && (
            <div className={`text-sm p-3 rounded-lg flex items-center gap-2 ${
              status === 'success' ? 'bg-green-50 text-green-700' : 
              status === 'error' ? 'bg-red-50 text-red-700' : 'bg-slate-50 text-slate-700'
            }`}>
              {status === 'success' && <Check className="w-4 h-4" />}
              {status === 'error' && <X className="w-4 h-4" />}
              {message}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleTestConnection}
              disabled={status === 'testing' || !apiKey}
              className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium disabled:opacity-50 flex justify-center items-center gap-2"
            >
              {status === 'testing' ? <Loader2 className="w-4 h-4 animate-spin" /> : '연결 테스트'}
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex justify-center items-center gap-2"
            >
              <Save className="w-4 h-4" />
              저장 및 닫기
            </button>
          </div>
          
          <div className="text-center">
             <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline">
               API Key가 없으신가요? 여기서 발급받으세요.
             </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyModal;

import React from 'react';
import ReactMarkdown from 'react-markdown';
import { FileSearch, Download } from 'lucide-react';

interface Props {
  report: string;
}

const ReportViewer: React.FC<Props> = ({ report }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden h-full flex flex-col">
      <div className="bg-emerald-50 px-6 py-4 border-b border-emerald-100 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-emerald-800 flex items-center gap-2">
          <FileSearch className="w-5 h-5" />
          분석 리포트
        </h2>
        <button 
          onClick={handlePrint}
          className="text-emerald-700 hover:text-emerald-900 bg-white hover:bg-emerald-100 border border-emerald-200 p-2 rounded-lg transition-colors"
          title="Print or Save as PDF"
        >
          <Download className="w-4 h-4" />
        </button>
      </div>
      <div className="p-8 overflow-y-auto flex-1 bg-white">
        <div className="prose prose-slate prose-sm md:prose-base max-w-none">
          <ReactMarkdown>{report}</ReactMarkdown>
        </div>
      </div>
      <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 text-xs text-slate-500 text-center">
        * AI generated report. Experimental verification is required.
      </div>
    </div>
  );
};

export default ReportViewer;
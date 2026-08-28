import React, { useState } from 'react';
import { FileText, Eye, Download, UploadCloud, AlertCircle, CheckCircle2, ShieldAlert, X, Activity, Brain } from 'lucide-react';
import { HealthRecord, LabReport } from '../types';
import { soundService } from '../services/soundService';

interface HealthRecordsScreenProps {
  records: HealthRecord;
  onUploadRecord: (report: Partial<LabReport>) => void;
  patientName: string;
}

export const HealthRecordsScreen: React.FC<HealthRecordsScreenProps> = ({
  records,
  onUploadRecord,
  patientName,
}) => {
  const [selectedReport, setSelectedReport] = useState<LabReport | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDoctor, setNewDoctor] = useState('');
  const [newSummary, setNewSummary] = useState('');
  const [infoCondition, setInfoCondition] = useState<string | null>(null);

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onUploadRecord({
      title: newTitle.trim(),
      date: 'Today',
      type: 'blood',
      doctor: newDoctor.trim() || 'Attending Physician',
      summary: newSummary.trim() || 'Routine medical laboratory assessment.',
      fileSize: '1.2 MB',
    });

    soundService.playSuccess();
    setNewTitle('');
    setNewDoctor('');
    setNewSummary('');
    setShowUploadModal(false);
  };

  return (
    <div id="health-records-screen" className="space-y-6 pb-28">
      {/* Title */}
      <div className="space-y-1">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Health Records
        </h2>
        <p className="text-sm text-purple-200/80">
          Medical profile and laboratory reports for {patientName}.
        </p>
      </div>

      {/* 1. Medical Conditions Section */}
      <div className="bg-[#1C172E] border border-purple-900/40 rounded-3xl p-5 shadow-xl space-y-4">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-amber-400" />
          <h3 className="text-lg font-bold text-white tracking-tight">
            Medical Conditions
          </h3>
        </div>

        <div className="space-y-2.5">
          {records.conditions.map((cond, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-[#141022] border border-purple-900/40 flex items-center justify-between gap-3 hover:border-purple-700/50 transition-all"
            >
              <div>
                <h4 className="text-sm font-bold text-white">{cond.name}</h4>
                <p className="text-xs text-purple-300/80 mt-0.5">{cond.info}</p>
              </div>
              <button
                onClick={() => setInfoCondition(cond.info)}
                className="p-1.5 rounded-full text-purple-400 hover:text-purple-200 hover:bg-purple-950/60"
                title="Condition details"
              >
                <AlertCircle className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Allergies Section */}
      <div className="bg-[#1C172E] border border-purple-900/40 rounded-3xl p-5 shadow-xl space-y-3">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-rose-400" />
          <h3 className="text-lg font-bold text-white tracking-tight">
            Allergies
          </h3>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {records.allergies.map((allergy, idx) => (
            <div
              key={idx}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-950/60 border border-rose-800/50 text-rose-200 text-xs font-semibold"
            >
              <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
              <span>{allergy.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Recent Lab Reports Section (Exact styling matching Health Records.png) */}
      <div className="bg-[#1C172E] border border-purple-900/40 rounded-3xl p-5 shadow-xl space-y-4">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-bold text-white tracking-tight">
            Recent Lab Reports
          </h3>
        </div>

        <div className="space-y-3">
          {records.reports.map((report) => (
            <div
              key={report.id}
              id={`report-item-${report.id}`}
              className="bg-[#141022] border border-purple-900/40 rounded-2xl p-4 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-base font-bold text-white">{report.title}</h4>
                  <p className="text-xs text-purple-300/80">{report.date} • {report.doctor}</p>
                </div>
                <span className="text-[11px] px-2 py-0.5 rounded-md bg-purple-950 text-purple-300 border border-purple-800/40">
                  {report.fileSize}
                </span>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  id={`view-report-${report.id}-btn`}
                  onClick={() => setSelectedReport(report)}
                  className="flex-1 py-2.5 rounded-xl bg-[#251E3D] hover:bg-[#30284D] text-white text-xs font-semibold flex items-center justify-center gap-1.5 border border-purple-800/50 transition-all active:scale-95"
                >
                  <Eye className="w-4 h-4 text-purple-300" />
                  <span>View</span>
                </button>

                <button
                  id={`download-report-${report.id}-btn`}
                  onClick={() => {
                    soundService.playSuccess();
                    alert(`Downloading ${report.title} (${report.fileSize}) for medical records.`);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-[#251E3D] hover:bg-[#30284D] text-white text-xs font-semibold flex items-center justify-center gap-1.5 border border-purple-800/50 transition-all active:scale-95"
                >
                  <Download className="w-4 h-4 text-purple-300" />
                  <span>PDF</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Vaccinations Section */}
      <div className="bg-[#1C172E] border border-purple-900/40 rounded-3xl p-5 shadow-xl space-y-3">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-amber-400" />
          <h3 className="text-lg font-bold text-white tracking-tight">
            Vaccinations
          </h3>
        </div>

        <div className="space-y-2">
          {records.vaccinations.map((vac, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-[#141022] border border-purple-900/40 flex items-center justify-between"
            >
              <div>
                <p className="text-sm font-bold text-white">{vac.name}</p>
                <p className="text-xs text-purple-300/80">{vac.date}</p>
              </div>
              <CheckCircle2 className="w-5 h-5 text-amber-400" />
            </div>
          ))}
        </div>
      </div>

      {/* Floating Upload Record Pill Button (Matches Health Records.png) */}
      <div className="fixed bottom-20 right-4 z-30">
        <button
          id="floating-upload-record-btn"
          onClick={() => setShowUploadModal(true)}
          className="py-3 px-5 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-2xl shadow-purple-900/80 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all border border-purple-400/40"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload Record</span>
        </button>
      </div>

      {/* VIEW REPORT MODAL */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#181427] border border-purple-700/50 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-fade-in">
            <div className="flex items-start justify-between border-b border-purple-950/60 pb-3">
              <div>
                <h3 className="text-lg font-bold text-white">{selectedReport.title}</h3>
                <p className="text-xs text-purple-300">{selectedReport.date} · {selectedReport.doctor}</p>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="p-1 rounded-full text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-[#141022] border border-purple-900/50">
                <p className="text-xs font-semibold text-purple-300 mb-1">Clinical Findings Summary:</p>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">{selectedReport.summary}</p>
              </div>

              {selectedReport.type === 'mri' && (
                <div className="h-44 rounded-2xl overflow-hidden border border-purple-800/40 relative">
                  <img
                    src="https://images.unsplash.com/photo-1559757175-5700dde675bc?w=600&h=300&fit=crop"
                    alt="MRI scan preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 bg-black/70 px-2 py-0.5 rounded text-[10px] text-purple-200">
                    Brain Scan Visualization (Hippocampal Protocol)
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedReport(null)}
              className="w-full py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs"
            >
              Done Reading
            </button>
          </div>
        </div>
      )}

      {/* UPLOAD RECORD MODAL */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#181427] border border-purple-700/50 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Upload New Health Record</h3>

            <form onSubmit={handleUploadSubmit} className="space-y-3">
              <div>
                <label className="text-xs text-purple-300 font-semibold block mb-1">Document Title</label>
                <input
                  type="text"
                  placeholder="e.g. Cognitive Battery Report, Lipid Profile"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#201A38] border border-purple-700/50 text-white text-sm focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-purple-300 font-semibold block mb-1">Doctor / Clinic</label>
                <input
                  type="text"
                  placeholder="e.g. Dr. B. Sharma, Tezpur Clinic"
                  value={newDoctor}
                  onChange={(e) => setNewDoctor(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#201A38] border border-purple-700/50 text-white text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-purple-300 font-semibold block mb-1">Report Summary</label>
                <textarea
                  rows={3}
                  placeholder="Key doctor notes or lab values..."
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#201A38] border border-purple-700/50 text-white text-sm focus:outline-none resize-none"
                />
              </div>

              <div className="p-4 rounded-xl border-2 border-dashed border-purple-800/60 text-center text-xs text-purple-300 cursor-pointer hover:border-purple-500">
                📁 Drag & drop PDF or photo here, or tap to browse
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 py-3 rounded-xl bg-[#282142] text-slate-300 text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-bold shadow-lg"
                >
                  Upload & Sync
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

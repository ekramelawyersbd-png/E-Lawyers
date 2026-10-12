import React, { useState } from 'react';
import { Briefcase, CheckCircle2, Clock, FileText, Sparkles, Calendar, Video, MapPin, AlertCircle, Check } from 'lucide-react';

interface InterviewSlot {
  id: string;
  date: string;
  time: string;
  type: 'Online Video Call (Google Meet)' | 'In-Person (Gulshan Head Office)';
  interviewer: string;
}

interface ApplicationItem {
  id: string;
  jobTitle: string;
  department: string;
  appliedDate: string;
  status: 'Submitted' | 'Under Review' | 'Shortlisted for CBT' | 'Interview Scheduled' | 'Offer Extended';
  currentStepIndex: number; // 0 to 4
  cbtDate?: string;
  location: string;
  availableInterviewSlots?: InterviewSlot[];
  confirmedInterviewSlot?: InterviewSlot;
}

export function ApplicationTracker() {
  const [applications, setApplications] = useState<ApplicationItem[]>([
    {
      id: 'app-001',
      jobTitle: 'Accountant (Accounts Division)',
      department: 'Accounts Division',
      appliedDate: 'October 12, 2026',
      status: 'Interview Scheduled',
      currentStepIndex: 3,
      cbtDate: 'October 18, 2026 (10:00 AM BST - Online CBT)',
      location: 'Dhaka Office / Online',
      availableInterviewSlots: [
        { id: 'slot-1', date: 'October 20, 2026', time: '11:00 AM - 11:45 AM BST', type: 'Online Video Call (Google Meet)', interviewer: 'Barrister Tanvir Ahmed & Head of Accounts' },
        { id: 'slot-2', date: 'October 21, 2026', time: '03:00 PM - 03:45 PM BST', type: 'In-Person (Gulshan Head Office)', interviewer: 'Senior Partner, Accounts Division' },
        { id: 'slot-3', date: 'October 22, 2026', time: '10:00 AM - 10:45 AM BST', type: 'Online Video Call (Google Meet)', interviewer: 'HR Director & Accounts Manager' }
      ]
    }
  ]);

  const [selectedSlotId, setSelectedSlotId] = useState<Record<string, string>>({});

  const handleConfirmSlot = (appId: string, slots: InterviewSlot[]) => {
    const slotId = selectedSlotId[appId];
    if (!slotId) return;
    const chosen = slots.find(s => s.id === slotId);
    if (!chosen) return;

    setApplications(prev => prev.map(app => {
      if (app.id === appId) {
        return {
          ...app,
          confirmedInterviewSlot: chosen
        };
      }
      return app;
    }));
  };

  const steps = [
    { title: 'Submitted', description: 'Application received & registered' },
    { title: 'Under Review', description: 'HR & Accounts Committee screening' },
    { title: 'Shortlisted for CBT', description: 'Invited for Computer-Based Test' },
    { title: 'Interview Scheduled', description: 'Final panel discussion' },
    { title: 'Offer Extended', description: 'Joining & Onboarding' }
  ];

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3 h-3" /> Career Hub Tracker
          </div>
          <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
            My Job Applications &amp; Interview Scheduler
          </h3>
          <p className="text-xs text-slate-500">
            Track real-time progress of your applications and confirm your interview time slots.
          </p>
        </div>
        <button
          type="button"
          onClick={() => alert('Applications are synced automatically with your registered profile email.')}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
        >
          Refresh Status
        </button>
      </div>

      {applications.length === 0 ? (
        <div className="py-12 text-center space-y-3 bg-slate-50 rounded-2xl border border-slate-200">
          <Briefcase className="w-10 h-10 text-slate-400 mx-auto" />
          <h4 className="text-sm font-bold text-slate-700">No Active Applications Found</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Browse our open positions in Tax Advisory, Accounts Division, Legal Litigations, or Tech and submit your application today.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {applications.map((app) => (
            <div key={app.id} className="p-6 rounded-3xl bg-slate-50/80 border border-slate-200/90 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-lg">
                    {app.department}
                  </span>
                  <h4 className="text-base sm:text-lg font-extrabold text-slate-900 pt-1">
                    {app.jobTitle}
                  </h4>
                  <p className="text-xs text-slate-500">
                    Applied on: <span className="font-semibold text-slate-700">{app.appliedDate}</span> | Location: {app.location}
                  </p>
                </div>

                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-xs">
                  <span>Status: {app.status}</span>
                </div>
              </div>

              {app.cbtDate && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-200 text-amber-800 flex items-center justify-center font-bold shrink-0">
                    💻
                  </div>
                  <div className="space-y-1">
                    <span className="font-bold block">Computer-Based Test (CBT) Completed / Scheduled</span>
                    <p className="text-amber-800">
                      CBT Schedule: <strong className="underline">{app.cbtDate}</strong>.
                    </p>
                  </div>
                </div>
              )}

              {/* Interview Scheduler Section */}
              {app.availableInterviewSlots && app.availableInterviewSlots.length > 0 && (
                <div className="p-5 rounded-2xl bg-white border border-emerald-200 space-y-4 shadow-2xs">
                  <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs uppercase tracking-wider border-b border-slate-100 pb-3">
                    <Calendar className="w-4 h-4 text-emerald-600" />
                    <span>Interview Panel Slot Scheduler</span>
                  </div>

                  {app.confirmedInterviewSlot ? (
                    <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 space-y-2">
                      <div className="flex items-center gap-2 font-extrabold text-xs">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Interview Slot Successfully Confirmed!</span>
                      </div>
                      <div className="text-xs space-y-1 pl-6 text-slate-700">
                        <p>📅 <strong>Date &amp; Time:</strong> {app.confirmedInterviewSlot.date} at {app.confirmedInterviewSlot.time}</p>
                        <p>📍 <strong>Mode:</strong> {app.confirmedInterviewSlot.type}</p>
                        <p>👥 <strong>Interviewer:</strong> {app.confirmedInterviewSlot.interviewer}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-xs text-slate-600">
                        Congratulations! You have been shortlisted for the final interview round. Please choose and confirm one of the available interview time slots below:
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {app.availableInterviewSlots.map((slot) => {
                          const isSelected = selectedSlotId[app.id] === slot.id;
                          return (
                            <div
                              key={slot.id}
                              onClick={() => setSelectedSlotId(prev => ({ ...prev, [app.id]: slot.id }))}
                              className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-2 ${
                                isSelected
                                  ? 'bg-emerald-50/80 border-emerald-600 ring-2 ring-emerald-500/20 shadow-xs'
                                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700">
                                  {slot.date}
                                </span>
                                {isSelected ? (
                                  <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                                    <Check className="w-3 h-3" />
                                  </div>
                                ) : (
                                  <div className="w-5 h-5 rounded-full border border-slate-300 bg-white" />
                                )}
                              </div>
                              <div className="space-y-1">
                                <p className="text-xs font-bold text-slate-900">{slot.time}</p>
                                <p className="text-[10px] text-slate-600 flex items-center gap-1">
                                  {slot.type.includes('Online') ? <Video className="w-3 h-3 text-emerald-600" /> : <MapPin className="w-3 h-3 text-emerald-600" />}
                                  <span>{slot.type}</span>
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="pt-2 flex justify-end">
                        <button
                          type="button"
                          disabled={!selectedSlotId[app.id]}
                          onClick={() => handleConfirmSlot(app.id, app.availableInterviewSlots!)}
                          className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer inline-flex items-center gap-1.5"
                        >
                          <Check className="w-4 h-4" />
                          <span>Confirm Selected Interview Slot</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Progress Timeline */}
              <div className="space-y-3 pt-2">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700">Recruitment &amp; Selection Pipeline</h5>
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                  {steps.map((step, idx) => {
                    const isCompleted = idx <= app.currentStepIndex;
                    const isCurrent = idx === app.currentStepIndex;

                    return (
                      <div
                        key={idx}
                        className={`p-3.5 rounded-2xl border transition-all space-y-1.5 ${
                          isCurrent
                            ? 'bg-white border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs'
                            : isCompleted
                            ? 'bg-emerald-50/60 border-emerald-200 text-slate-800'
                            : 'bg-white/50 border-slate-200 text-slate-400 opacity-60'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
                            isCompleted ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                          }`}>
                            {idx + 1}
                          </span>
                          {isCompleted && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                        </div>
                        <h6 className={`text-xs font-bold ${isCurrent ? 'text-emerald-900 font-extrabold' : 'text-slate-800'}`}>
                          {step.title}
                        </h6>
                        <p className="text-[10px] text-slate-500 leading-tight line-clamp-2">
                          {step.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
                <span>Application ID: <strong className="text-slate-700">ELAW-ACC-2026-8942</strong></span>
                <button
                  type="button"
                  onClick={() => alert('Downloading application summary & receipt PDF...')}
                  className="font-bold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Download Application Receipt</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

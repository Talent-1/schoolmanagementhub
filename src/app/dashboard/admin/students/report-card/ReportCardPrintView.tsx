"use client";

import Image from "next/image";
import { useState } from "react";
import type { Result, Student, School, TermSummary } from "@prisma/client";
import { saveFormTeacherRemark } from "../computeEngine";

type ResultWithSubject = Result & { subject?: { name?: string } };
type ReportSummary = TermSummary & {
  punctuality?: number;
  neatness?: number;
  honesty?: number;
  attentiveness?: number;
  sportsParticipation?: number;
};

interface ReportCardPrintViewProps {
  student: Student;
  school: School;
  classLabel: string;
  results: ResultWithSubject[];
  summary: ReportSummary | null;
  term: string;
  session: string;
}

export default function ReportCardPrintView({
  student,
  school,
  classLabel,
  results,
  summary,
  term,
  session
}: ReportCardPrintViewProps) {
  const [remark, setRemark] = useState(summary?.formTeacherRemark || "");
  const [ratings, setRatings] = useState({
    punctuality: summary?.punctuality ?? 0,
    neatness: summary?.neatness ?? 0,
    honesty: summary?.honesty ?? 0,
    attentiveness: summary?.attentiveness ?? 0,
    sportsParticipation: summary?.sportsParticipation ?? 0,
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleRemarkUpdate = async () => {
    setIsSaving(true);
    await saveFormTeacherRemark(student.id, term, session, remark, {
      punctuality: ratings.punctuality,
      neatness: ratings.neatness,
      honesty: ratings.honesty,
      attentiveness: ratings.attentiveness,
      sportsParticipation: ratings.sportsParticipation,
    });
    setIsSaving(false);
  };

  const generateAutoRemark = () => {
    const average = summary?.studentAverage ?? 0;
    const strongSubjects = results.filter((r) => r.totalScore >= 70).map((res) => res.subject?.name).slice(0, 2);
    const weakSubjects = results.filter((r) => r.totalScore < 40).map((res) => res.subject?.name).slice(0, 2);

    let remarkText = "";
    if (average >= 75) {
      remarkText = `An exceptionally brilliant performance. ${student.firstName} demonstrates strong analytical competence and a consistent work ethic across the year.`;
    } else if (average >= 60) {
      remarkText = `A solid term performance. ${student.firstName} has shown good progress and should continue to sharpen consistency in weaker areas.`;
    } else if (average >= 40) {
      remarkText = `A developing performance. ${student.firstName} must work harder to lift weak areas and sustain more dependable study discipline.`;
    } else {
      remarkText = `A challenging term. ${student.firstName} needs close support, improved focus, and regular revision to move toward the pass band.`;
    }

    if (strongSubjects.length > 0) {
      remarkText += ` Strengths were particularly evident in ${strongSubjects.join(", ")} subjects.`;
    }
    if (weakSubjects.length > 0) {
      remarkText += ` Improvement is especially needed in ${weakSubjects.join(", ")} subjects.`;
    }

    remarkText += ` Overall, the student benefits from consistent effort and more attention to homework and class participation.`;
    setRemark(remarkText);
  };

  return (
    <div className="w-[210mm] min-h-[297mm] bg-white p-12 border-t-14 border-blue-600 shadow-md relative rounded-b-3xl print:rounded-none print:shadow-none print:border-t-14 print:p-6 print:my-0 page-break-after-always">
      
      {/* 1. REPORT HEADER AFFIXED WITH UNIQUE SCHOOL LOGO */}
      <div className="flex items-center justify-between border-b-4 border-slate-900 pb-6 mb-6">
        {school?.logoUrl ? (
          <Image
            src={school.logoUrl}
            alt="Logo"
            width={96}
            height={96}
            unoptimized
            className="w-24 h-24 object-contain"
          />
        ) : (
          <div className="w-24 h-24 bg-slate-200 rounded-xl flex items-center justify-center text-xs font-bold text-slate-400">NO LOGO</div>
        )}
        <div className="text-center flex-1 px-6">
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">{school?.name || "HILLCITY ACADEMICS"}</h1>
          <p className="text-xs font-semibold text-slate-500 italic mt-1">{school?.address || "Anambra State, Nigeria"}</p>
          <div className="mt-3 inline-block rounded-full bg-blue-50 px-6 py-1 text-sm font-black uppercase tracking-widest text-blue-700">
            Official Academic Report Sheet
          </div>
        </div>
        <div className="w-24 h-24 border-2 border-dashed border-slate-300 rounded-2xl flex items-center justify-center text-center p-2 text-[10px] font-bold text-slate-400 uppercase">
          Passport Attached
        </div>
      </div>

      {/* 2. STUDENT METRIC PROFILE IDENTIFIERS */}
      <div className="grid grid-cols-2 gap-y-3 gap-x-8 rounded-2xl bg-slate-50 p-4 border border-slate-200 text-sm mb-6">
        <div><span className="text-slate-500 font-medium">Student Name:</span> <strong className="text-slate-900 uppercase">{student.lastName}, {student.firstName}</strong></div>
        <div><span className="text-slate-500 font-medium">Class Arm:</span> <strong className="text-slate-900">{classLabel}</strong></div>
        <div><span className="text-slate-500 font-medium">Admission Reg No:</span> <strong className="text-slate-800 font-mono">{student.regNumber}</strong></div>
        <div><span className="text-slate-500 font-medium">Term / Session:</span> <strong className="text-slate-800 uppercase">{term} TERM ({session})</strong></div>
      </div>

      {/* 3. PERFORMANCE STATISTICAL AGGREGATES */}
      <div className="grid grid-cols-4 gap-4 text-center mb-6">
        <div className="rounded-xl border border-slate-200 bg-white p-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Marks Obtained</div>
          <div className="text-xl font-black text-slate-900 font-mono mt-1">{summary?.totalObtained ?? 0}</div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Obtainable</div>
          <div className="text-xl font-black text-slate-700 font-mono mt-1">{summary?.totalObtainable ?? 0}</div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Term Average</div>
          <div className="text-xl font-black text-blue-600 font-mono mt-1">{(summary?.studentAverage ?? 0).toFixed(1)}%</div>
        </div>
        <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-3">
          <div className="text-xs font-bold uppercase tracking-wider text-blue-500">Class Position</div>
          <div className="text-xl font-black text-green-600 mt-1">
            {summary?.position ? `No. ${summary.position}` : "N/A"}
          </div>
        </div>
      </div>

      {/* 4. ACADEMIC BROAD SHEET SUBJECT GRID */}
      <div className="border border-slate-300 rounded-xl overflow-hidden mb-8">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-slate-900 text-white font-bold uppercase text-xs tracking-wider">
              <th className="p-3 border-r border-slate-700">Subject Course Title</th>
              <th className="p-3 text-center border-r border-slate-700">CA Score (40)</th>
              <th className="p-3 text-center border-r border-slate-700">Exam Score (60)</th>
              <th className="p-3 text-center border-r border-slate-700">Total (100)</th>
              <th className="p-3 text-center">Grade Letter</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 font-medium text-slate-800">
            {results.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-400 italic">No grading entries recorded for this candidate.</td>
              </tr>
            ) : (
              results.map((res) => (
                <tr key={res.id} className="hover:bg-slate-50/50">
                  <td className="p-3 font-semibold border-r border-slate-200 uppercase">{res.subject?.name}</td>
                  <td className="p-3 text-center font-mono border-r border-slate-200">{res.caScore}</td>
                  <td className="p-3 text-center font-mono border-r border-slate-200">{res.examScore}</td>
                  <td className="p-3 text-center font-mono font-bold text-blue-600 border-r border-slate-200">{res.totalScore}</td>
                  <td className="p-3 text-center font-black text-slate-900">{res.grade || "N/A"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 5. FORM TEACHER REMARK CONFIGURATOR */}
      <div className="mt-8 border border-slate-200 rounded-2xl p-4 bg-slate-50">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-2">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">Form Teacher&apos;s Remark</h4>
            <p className="text-[11px] text-slate-500 mt-1">Use the button to auto-generate a contextual remark from the student’s current average and subject performance.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={generateAutoRemark}
              className="rounded-2xl bg-white border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition print:hidden"
            >
              ✨ Generate Remark
            </button>
            <button
              type="button"
              onClick={handleRemarkUpdate}
              disabled={isSaving}
              className="rounded-2xl bg-blue-600 text-white px-4 py-2 text-xs font-bold hover:bg-blue-700 transition disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "💾 Save Remark & Ratings"}
            </button>
          </div>
        </div>
        <textarea
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
          placeholder="Enter custom terminal evaluation narrative regarding conduct, academic performance, and discipline..."
          className="w-full min-h-20 bg-white border border-slate-200 rounded-xl p-3 text-sm font-medium text-slate-800 focus:outline-none focus:border-blue-500 print:bg-transparent print:border-none print:p-0 print:resize-none"
        />

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: "Punctuality", key: "punctuality" },
            { label: "Neatness", key: "neatness" },
            { label: "Honesty", key: "honesty" },
            { label: "Attentiveness", key: "attentiveness" },
            { label: "Sports Participation", key: "sportsParticipation" },
          ].map((item) => (
            <div key={item.key} className="bg-white rounded-2xl border border-slate-200 p-3">
              <label htmlFor={`${item.key}-rating`} className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">{item.label}</label>
              <select
                id={`${item.key}-rating`}
                value={ratings[item.key as keyof typeof ratings]}
                onChange={(e) =>
                  setRatings((prev) => ({
                    ...prev,
                    [item.key]: Number(e.target.value),
                  }))
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-medium text-slate-800 focus:outline-none focus:border-blue-500"
              >
                <option value={0}>Not scored</option>
                <option value={1}>1 - Needs urgent support</option>
                <option value={2}>2 - Developing</option>
                <option value={3}>3 - Steady</option>
                <option value={4}>4 - Strong</option>
                <option value={5}>5 - Excellent</option>
              </select>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-700 print:text-slate-900">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Behavior & Conduct Summary</h5>
          <div className="space-y-2">
            <div><strong>Punctuality:</strong> {ratings.punctuality || "Not scored"}</div>
            <div><strong>Neatness:</strong> {ratings.neatness || "Not scored"}</div>
            <div><strong>Honesty:</strong> {ratings.honesty || "Not scored"}</div>
            <div><strong>Attentiveness:</strong> {ratings.attentiveness || "Not scored"}</div>
            <div><strong>Sports Participation:</strong> {ratings.sportsParticipation || "Not scored"}</div>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Teacher Insight</h5>
          <p className="text-xs text-slate-600">This section can be used for final behavioural grading and to support the student’s overall report narrative. Capture performance trends, discipline notes, or participation highlights here.</p>
        </div>
      </div>

      {/* 6. SIGNATURE STAMPS AND VALIDATION */}
      <div className="mt-12 grid grid-cols-2 gap-12 text-center text-xs font-bold uppercase tracking-wider text-slate-500 pt-10">
        <div className="border-t border-dashed border-slate-400 pt-3">
          <p className="text-slate-800 font-black">Class Form Teacher Signature</p>
          <p className="text-[10px] lowercase font-normal italic text-slate-400 mt-1">date signed validation stamp</p>
        </div>
        <div className="border-t border-dashed border-slate-400 pt-3">
          <p className="text-slate-800 font-black">Principal / Director&apos;s Approval Stamp</p>
          <p className="text-[10px] lowercase font-normal italic text-slate-400 mt-1">hillcity authenticated signature seal</p>
        </div>
      </div>
    </div>
  );
}
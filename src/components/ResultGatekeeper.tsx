import { prisma } from "@/lib/prisma";
import { ResultStatus } from "@prisma/client";
import { ScratchCardForm } from "./ScratchCardForm";

/**
 * ResultGatekeeper
 * This component controls access to the student's results.
 * It ensures the result is PUBLISHED by the admin,
 * AND ensures the student has a valid AccessGrant for this term/session.
 */
export async function ResultGatekeeper({ 
  studentId, 
  term, 
  session, 
  children 
}: { 
  studentId: string; 
  term: string; 
  session: string; 
  children: React.ReactNode 
}) {
  // 1. Check if the result has been published by the administration
  const summary = await prisma.termSummary.findFirst({ 
    where: { studentId, term, session } 
  });

  if (!summary || summary.status !== ResultStatus.PUBLISHED) {
    return (
      <div className="p-10 text-center text-red-600 font-bold border border-red-200 rounded-xl bg-red-50">
        Result not yet released by management.
      </div>
    );
  }

  // 2. Check if the student has already unlocked this specific term/session
  const accessGrant = await prisma.accessGrant.findFirst({
    where: { 
      studentId,
      term,
      session 
    }
  });

  // 3. If NO grant exists, show the scratch card form to unlock it
  if (!accessGrant) {
    return (
      <ScratchCardForm 
        studentId={studentId} 
        term={term} 
        session={session} 
      />
    );
  }

  // 4. If published AND access is granted, show the children (the ResultsTable)
  return <>{children}</>;
}
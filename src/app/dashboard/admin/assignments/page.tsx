import { prisma } from "@/lib/prisma";
import AssignmentRow from "./AssignmentRow";
import ClassSelector from "./ClassSelector";
import SectionDepartmentSelector from "./SectionDepartmentSelector";
 

export default async function AssignmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ school?: string; parentClass?: string; class?: string; section?: string; department?: string }>;
}) {
  const resolvedParams = await searchParams;
  const schoolId = resolvedParams.school || "HILLCITY-01";
  const parentClassId = resolvedParams.parentClass;
  const classId = resolvedParams.class;
  const section = resolvedParams.section;
  const department = resolvedParams.department;
  
  // Fetch parent classes (main levels)
  const parentClasses = await prisma.class.findMany({
    where: { 
      schoolId: schoolId,
      parentId: null
    },
    orderBy: { name: 'asc' }
  });

  // Fetch child classes if parent is selected
  let childClasses: any[] = [];
  if (parentClassId) {
    childClasses = await prisma.class.findMany({
      where: { 
        schoolId: schoolId,
        parentId: parentClassId
      },
      orderBy: { name: 'asc' }
    });
  }

  // Fetch available sections and departments
  const allSections = await prisma.subject.findMany({
    where: { schoolId: schoolId },
    distinct: ['section'],
    select: { section: true }
  });

  const uniqueSections = Array.from(new Set(allSections.map(s => s.section)));

  let availableDepartments: string[] = [];
  if (section) {
    const depts = await prisma.subject.findMany({
      where: { schoolId: schoolId, section },
      distinct: ['department'],
      select: { department: true }
    });
    availableDepartments = Array.from(new Set(depts.map(d => d.department).filter(Boolean)));
  }

  // Fetch subjects based on class, section, and department
  let subjects: any[] = [];
  let assignments: any[] = [];
  
  if (classId) {
    const whereClause: any = { schoolId: schoolId };
    if (section) whereClause.section = section;
    if (department) whereClause.department = department;

    subjects = await prisma.subject.findMany({ 
      where: whereClause,
      orderBy: { name: 'asc' }
    });

    // Fetch existing assignments for this class
    assignments = await prisma.assignment.findMany({
      where: { classId },
      include: { staff: { select: { id: true, name: true } } }
    });
  }

  return (
    <div className="p-10 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Academic Assignments</h1>
          <p className="text-slate-500 font-medium">Assign teachers to subjects for the current session.</p>
        </header>

        {/* This component handles the dropdowns and navigation */}
        <ClassSelector 
          parentClasses={parentClasses} 
          childClasses={childClasses}
          schoolId={schoolId}
          selectedParentId={parentClassId}
        />

        {classId && (
          <div className="space-y-6">
            {/* Section and Department Selectors */}
            <SectionDepartmentSelector
              sections={uniqueSections}
              availableDepartments={availableDepartments}
              schoolId={schoolId}
              selectedSection={section}
            />

            {/* Subjects Table */}
            <div className="bg-white rounded-[2rem] overflow-hidden border border-slate-200 shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Subject</th>
                    <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Assigned Teacher</th>
                    <th className="p-6"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {subjects.length > 0 ? (
                    subjects.map((sub) => {
                      const assignment = assignments.find(a => a.subjectId === sub.id);
                      return (
                        <AssignmentRow
                          key={sub.id}
                          subject={sub}
                          classId={classId}
                          schoolId={schoolId}
                          assignedStaff={assignment?.staff}
                        />
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={3} className="p-6 text-center text-slate-400 font-medium">
                        No subjects found for the selected filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
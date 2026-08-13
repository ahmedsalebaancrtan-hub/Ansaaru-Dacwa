import {
  useMemo,
  useState,
  type FormEvent,
} from "react";

import {
  BookOpenCheck,
  FileBarChart,
  GraduationCap,
  LoaderCircle,
  Plus,
  Save,
  Search,
  Trophy,
} from "lucide-react";

import { useStudents } from "../../hooks/school/useStudents";
import { useSubjects } from "../../hooks/school/useSubjects";

import {
  useCreateExam,
  useStudentExamReport,
  useSubmitExamMarks,
} from "../../hooks/school/useExams";

interface CreateExamForm {
  title: string;
  academicYear: string;
  term: string;
  examType: string;
  maxMarks: string;
}

interface MarkForm {
  subjectId: number;
  marksObtained: string;
  remarks: string;
}

type ExamTab =
  | "create"
  | "marks"
  | "report";

const initialExamForm: CreateExamForm = {
  title: "",
  academicYear: "2026-2027",
  term: "Term 1",
  examType: "WRITTEN",
  maxMarks: "100",
};

function ExamsPage() {
  const studentsQuery = useStudents();
  const subjectsQuery = useSubjects();

  const createExamMutation =
    useCreateExam();

  const submitMarksMutation =
    useSubmitExamMarks();

  const reportMutation =
    useStudentExamReport();

  const [activeTab, setActiveTab] =
    useState<ExamTab>("create");

  const [examForm, setExamForm] =
    useState<CreateExamForm>(
      initialExamForm,
    );

  const [marksExamId, setMarksExamId] =
    useState("");

  const [
    marksStudentId,
    setMarksStudentId,
  ] = useState("");

  const [markRows, setMarkRows] =
    useState<MarkForm[]>([]);

  const [reportExamId, setReportExamId] =
    useState("");

  const [
    reportStudentId,
    setReportStudentId,
  ] = useState("");

  const [studentSearch, setStudentSearch] =
    useState("");

  const students =
    studentsQuery.data ?? [];

  const subjects =
    subjectsQuery.data ?? [];

  const selectedMarksStudent =
    students.find(
      (student) =>
        student.id ===
        Number(marksStudentId),
    );

  const studentSubjects = useMemo(() => {
    if (!selectedMarksStudent) {
      return [];
    }

    return subjects.filter(
      (subject) =>
        subject.class_id ===
        selectedMarksStudent.class_id,
    );
  }, [
    subjects,
    selectedMarksStudent,
  ]);

  const reportStudents = useMemo(() => {
    const value = studentSearch
      .trim()
      .toLowerCase();

    if (!value) {
      return students;
    }

    return students.filter(
      (student) =>
        student.full_name
          .toLowerCase()
          .includes(value) ||
        student.student_code
          .toLowerCase()
          .includes(value),
    );
  }, [students, studentSearch]);

  const handleExamSubmit = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (
      !examForm.title.trim() ||
      !examForm.academicYear.trim() ||
      !examForm.term.trim() ||
      !examForm.examType.trim() ||
      Number(examForm.maxMarks) <= 0
    ) {
      return;
    }

    createExamMutation.mutate(
      {
        title: examForm.title.trim(),

        academic_year:
          examForm.academicYear.trim(),

        term: examForm.term.trim(),

        exam_type:
          examForm.examType.trim(),

        max_marks: Number(
          examForm.maxMarks,
        ),
      },
      {
        onSuccess: () => {
          setExamForm(initialExamForm);
        },
      },
    );
  };

  const handleStudentChange = (
    studentId: string,
  ) => {
    setMarksStudentId(studentId);

    const student = students.find(
      (item) =>
        item.id === Number(studentId),
    );

    if (!student) {
      setMarkRows([]);
      return;
    }

    const matchingSubjects =
      subjects.filter(
        (subject) =>
          subject.class_id ===
          student.class_id,
      );

    setMarkRows(
      matchingSubjects.map(
        (subject) => ({
          subjectId: subject.id,
          marksObtained: "",
          remarks: "",
        }),
      ),
    );
  };

  const updateMark = (
    subjectId: number,
    field: "marksObtained" | "remarks",
    value: string,
  ) => {
    setMarkRows((currentRows) =>
      currentRows.map((row) =>
        row.subjectId === subjectId
          ? {
              ...row,
              [field]: value,
            }
          : row,
      ),
    );
  };

  const handleMarksSubmit = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const examId = Number(
      marksExamId,
    );

    const studentId = Number(
      marksStudentId,
    );

    if (
      !examId ||
      !studentId ||
      markRows.length === 0
    ) {
      return;
    }

    const invalidMark =
      markRows.some((row) => {
        const subject =
          studentSubjects.find(
            (item) =>
              item.id === row.subjectId,
          );

        const mark = Number(
          row.marksObtained,
        );

        return (
          !subject ||
          row.marksObtained === "" ||
          Number.isNaN(mark) ||
          mark < 0 ||
          mark > subject.marks
        );
      });

    if (invalidMark) {
      return;
    }

    submitMarksMutation.mutate(
      {
        exam_id: examId,

        marks: markRows.map(
          (row) => ({
            student_id: studentId,

            subject_id:
              row.subjectId,

            marks_obtained: Number(
              row.marksObtained,
            ),

            remarks:
              row.remarks.trim(),
          }),
        ),
      },
      {
        onSuccess: () => {
          setMarkRows((currentRows) =>
            currentRows.map((row) => ({
              ...row,
              marksObtained: "",
              remarks: "",
            })),
          );
        },
      },
    );
  };

  const handleReportSubmit = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const examId = Number(
      reportExamId,
    );

    const studentId = Number(
      reportStudentId,
    );

    if (!examId || !studentId) {
      return;
    }

    reportMutation.mutate({
      exam_id: examId,
      student_id: studentId,
    });
  };

  const inputClass =
    "h-8 w-full rounded-md border border-[#dfcbc4] bg-[#fff8f5] px-2.5 text-[9px] text-[#30201a] outline-none transition focus:border-[#8b2408] focus:bg-white focus:ring-2 focus:ring-orange-100";

  const report = reportMutation.data;

  return (
    <div className="space-y-3">
      {/* Header */}
      <div>
        <h1 className="text-base font-black text-[#30201a]">
          Imtixaannada
        </h1>

        <p className="mt-0.5 text-[9px] text-slate-500">
          Samee imtixaan, geli dhibcaha
          ardayda, kana eeg natiijooyinka.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1.5 rounded-lg border border-[#eadbd5] bg-white p-1.5 shadow-sm">
        <button
          type="button"
          onClick={() =>
            setActiveTab("create")
          }
          className={`flex h-8 items-center gap-1.5 rounded-md px-3 text-[9px] font-black transition ${
            activeTab === "create"
              ? "bg-[#8b2408] text-white"
              : "text-slate-500 hover:bg-[#fff4f0]"
          }`}
        >
          <Plus size={12} />
          Samee Exam
        </button>

        <button
          type="button"
          onClick={() =>
            setActiveTab("marks")
          }
          className={`flex h-8 items-center gap-1.5 rounded-md px-3 text-[9px] font-black transition ${
            activeTab === "marks"
              ? "bg-[#8b2408] text-white"
              : "text-slate-500 hover:bg-[#fff4f0]"
          }`}
        >
          <BookOpenCheck size={12} />
          Geli Marks
        </button>

        <button
          type="button"
          onClick={() =>
            setActiveTab("report")
          }
          className={`flex h-8 items-center gap-1.5 rounded-md px-3 text-[9px] font-black transition ${
            activeTab === "report"
              ? "bg-[#8b2408] text-white"
              : "text-slate-500 hover:bg-[#fff4f0]"
          }`}
        >
          <FileBarChart size={12} />
          Report
        </button>
      </div>

      {/* CREATE EXAM */}
      {activeTab === "create" && (
        <section className="rounded-xl border border-[#eadbd5] bg-white p-3 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-[#fff0eb] text-[#8b2408]">
              <BookOpenCheck size={15} />
            </div>

            <div>
              <h2 className="text-[11px] font-black text-[#30201a]">
                Samee Imtixaan
              </h2>

              <p className="text-[8px] text-slate-500">
                Geli xogta imtixaanka.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleExamSubmit}
            className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3"
          >
            <div>
              <label className="mb-0.5 block text-[8px] font-bold text-slate-500">
                Magaca Imtixaanka
              </label>

              <input
                value={examForm.title}
                onChange={(event) =>
                  setExamForm(
                    (current) => ({
                      ...current,
                      title:
                        event.target.value,
                    }),
                  )
                }
                placeholder="Midterm Examination"
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-0.5 block text-[8px] font-bold text-slate-500">
                Academic Year
              </label>

              <input
                value={
                  examForm.academicYear
                }
                onChange={(event) =>
                  setExamForm(
                    (current) => ({
                      ...current,
                      academicYear:
                        event.target.value,
                    }),
                  )
                }
                placeholder="2026-2027"
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-0.5 block text-[8px] font-bold text-slate-500">
                Term
              </label>

              <select
                value={examForm.term}
                onChange={(event) =>
                  setExamForm(
                    (current) => ({
                      ...current,
                      term:
                        event.target.value,
                    }),
                  )
                }
                className={inputClass}
              >
                <option value="Term 1">
                  Term 1
                </option>

                <option value="Term 2">
                  Term 2
                </option>

                <option value="Term 3">
                  Term 3
                </option>
              </select>
            </div>

            <div>
              <label className="mb-0.5 block text-[8px] font-bold text-slate-500">
                Exam Type
              </label>

              <select
                value={examForm.examType}
                onChange={(event) =>
                  setExamForm(
                    (current) => ({
                      ...current,
                      examType:
                        event.target.value,
                    }),
                  )
                }
                className={inputClass}
              >
                <option value="WRITTEN">
                  WRITTEN
                </option>

                <option value="MIDTERM">
                  MIDTERM
                </option>

                <option value="FINAL">
                  FINAL
                </option>
              </select>
            </div>

            <div>
              <label className="mb-0.5 block text-[8px] font-bold text-slate-500">
                Max Marks
              </label>

              <input
                type="number"
                min="1"
                value={examForm.maxMarks}
                onChange={(event) =>
                  setExamForm(
                    (current) => ({
                      ...current,
                      maxMarks:
                        event.target.value,
                    }),
                  )
                }
                className={inputClass}
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={
                  createExamMutation.isPending
                }
                className="flex h-8 items-center justify-center gap-1.5 rounded-md bg-[#8b2408] px-4 text-[9px] font-black text-white transition hover:bg-[#701b05] disabled:opacity-60"
              >
                {createExamMutation.isPending ? (
                  <LoaderCircle
                    size={12}
                    className="animate-spin"
                  />
                ) : (
                  <Plus size={12} />
                )}

                Kaydi Exam
              </button>
            </div>
          </form>
        </section>
      )}

      {/* SUBMIT MARKS */}
      {activeTab === "marks" && (
        <form
          onSubmit={handleMarksSubmit}
          className="overflow-hidden rounded-xl border border-[#eadbd5] bg-white shadow-sm"
        >
          <div className="border-b border-[#eee1dc] p-3">
            <h2 className="text-[11px] font-black text-[#30201a]">
              Geli Dhibcaha
            </h2>

            <p className="text-[8px] text-slate-500">
              Dooro exam-ka iyo ardayga.
            </p>

            <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
              <div>
                <label className="mb-0.5 block text-[8px] font-bold text-slate-500">
                  Exam ID
                </label>

                <input
                  type="number"
                  min="1"
                  value={marksExamId}
                  onChange={(event) =>
                    setMarksExamId(
                      event.target.value,
                    )
                  }
                  placeholder="1"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-0.5 block text-[8px] font-bold text-slate-500">
                  Ardayga
                </label>

                <select
                  value={marksStudentId}
                  onChange={(event) =>
                    handleStudentChange(
                      event.target.value,
                    )
                  }
                  className={inputClass}
                >
                  <option value="">
                    Dooro ardayga
                  </option>

                  {students.map(
                    (student) => (
                      <option
                        key={student.id}
                        value={student.id}
                      >
                        {student.student_code} -{" "}
                        {student.full_name}
                      </option>
                    ),
                  )}
                </select>
              </div>
            </div>
          </div>

          {!marksStudentId ? (
            <div className="flex h-32 flex-col items-center justify-center">
              <GraduationCap
                size={20}
                className="text-slate-300"
              />

              <p className="mt-1 text-[9px] text-slate-500">
                Dooro ardayga.
              </p>
            </div>
          ) : studentSubjects.length === 0 ? (
            <div className="flex h-32 items-center justify-center">
              <p className="text-[9px] text-slate-500">
                Fasalka ardaygan maadooyin
                kuma jiraan.
              </p>
            </div>
          ) : (
            <>
              <div className="hidden grid-cols-[1fr_100px_1fr] border-b border-[#eee1dc] bg-[#fff8f5] px-3 py-2 md:grid">
                <span className="text-[8px] font-black text-slate-400">
                  MAADADA
                </span>

                <span className="text-[8px] font-black text-slate-400">
                  MARKS
                </span>

                <span className="text-[8px] font-black text-slate-400">
                  REMARKS
                </span>
              </div>

              <div className="divide-y divide-[#eee1dc]">
                {studentSubjects.map(
                  (subject) => {
                    const row =
                      markRows.find(
                        (item) =>
                          item.subjectId ===
                          subject.id,
                      );

                    return (
                      <div
                        key={subject.id}
                        className="grid gap-2 px-3 py-2 md:grid-cols-[1fr_100px_1fr] md:items-center"
                      >
                        <div>
                          <p className="text-[9px] font-black text-[#30201a]">
                            {subject.name}
                          </p>

                          <p className="text-[7px] text-slate-400">
                            Max:{" "}
                            {subject.marks}
                          </p>
                        </div>

                        <input
                          type="number"
                          min="0"
                          max={subject.marks}
                          step="0.01"
                          value={
                            row?.marksObtained ??
                            ""
                          }
                          onChange={(event) =>
                            updateMark(
                              subject.id,
                              "marksObtained",
                              event.target
                                .value,
                            )
                          }
                          placeholder="0"
                          className={inputClass}
                        />

                        <input
                          type="text"
                          value={
                            row?.remarks ?? ""
                          }
                          onChange={(event) =>
                            updateMark(
                              subject.id,
                              "remarks",
                              event.target
                                .value,
                            )
                          }
                          placeholder="Aad u wanaagsan"
                          className={inputClass}
                        />
                      </div>
                    );
                  },
                )}
              </div>

              <div className="flex justify-end border-t border-[#eee1dc] bg-[#fffaf8] p-3">
                <button
                  type="submit"
                  disabled={
                    submitMarksMutation.isPending
                  }
                  className="flex h-8 items-center gap-1.5 rounded-md bg-[#8b2408] px-4 text-[9px] font-black text-white disabled:opacity-60"
                >
                  {submitMarksMutation.isPending ? (
                    <LoaderCircle
                      size={12}
                      className="animate-spin"
                    />
                  ) : (
                    <Save size={12} />
                  )}

                  Kaydi Marks
                </button>
              </div>
            </>
          )}
        </form>
      )}

      {/* REPORT */}
      {activeTab === "report" && (
        <div className="space-y-3">
          <form
            onSubmit={handleReportSubmit}
            className="rounded-xl border border-[#eadbd5] bg-white p-3 shadow-sm"
          >
            <div className="mb-3">
              <h2 className="text-[11px] font-black text-[#30201a]">
                Natiijada Ardayga
              </h2>

              <p className="text-[8px] text-slate-500">
                Geli Exam ID kadibna dooro
                ardayga.
              </p>
            </div>

            <div className="grid gap-2.5 sm:grid-cols-[150px_1fr_auto]">
              <input
                type="number"
                min="1"
                value={reportExamId}
                onChange={(event) =>
                  setReportExamId(
                    event.target.value,
                  )
                }
                placeholder="Exam ID"
                className={inputClass}
              />

              <select
                value={reportStudentId}
                onChange={(event) =>
                  setReportStudentId(
                    event.target.value,
                  )
                }
                className={inputClass}
              >
                <option value="">
                  Dooro ardayga
                </option>

                {reportStudents.map(
                  (student) => (
                    <option
                      key={student.id}
                      value={student.id}
                    >
                      {student.student_code} -{" "}
                      {student.full_name}
                    </option>
                  ),
                )}
              </select>

              <button
                type="submit"
                disabled={
                  reportMutation.isPending
                }
                className="flex h-8 items-center justify-center gap-1.5 rounded-md bg-[#8b2408] px-4 text-[9px] font-black text-white disabled:opacity-60"
              >
                {reportMutation.isPending ? (
                  <LoaderCircle
                    size={12}
                    className="animate-spin"
                  />
                ) : (
                  <Search size={12} />
                )}

                Raadi
              </button>
            </div>

            <input
              value={studentSearch}
              onChange={(event) =>
                setStudentSearch(
                  event.target.value,
                )
              }
              placeholder="Filter ardayda..."
              className="mt-2 h-7 w-full max-w-xs rounded-md border border-[#eee1dc] px-2 text-[8px] outline-none focus:border-[#8b2408]"
            />
          </form>

          {report && (
            <section className="overflow-hidden rounded-xl border border-[#eadbd5] bg-white shadow-sm">
              {/* Report header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#eee1dc] bg-[#fff8f5] p-3">
                <div className="flex items-center gap-2">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-[#fff0eb] text-[#8b2408]">
                    <Trophy size={16} />
                  </div>

                  <div>
                    <h3 className="text-[11px] font-black text-[#30201a]">
                      {
                        report.student
                          .full_name
                      }
                    </h3>

                    <p className="text-[8px] text-slate-500">
                      {
                        report.student
                          .student_code
                      }{" "}
                      •{" "}
                      {
                        report.student
                          .class?.title
                      }
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-[8px] text-slate-400">
                    {
                      report.exam.title
                    }
                  </p>

                  <p className="text-[9px] font-black text-[#8b2408]">
                    {
                      report.exam
                        .academic_year
                    }{" "}
                    • {report.exam.term}
                  </p>
                </div>
              </div>

              {/* Summary */}
              <div className="grid grid-cols-2 gap-2 p-3 sm:grid-cols-4">
                <div className="rounded-lg bg-[#fff8f5] p-2.5">
                  <p className="text-[7px] font-bold uppercase text-slate-400">
                    Grade
                  </p>

                  <p className="mt-1 text-base font-black text-[#8b2408]">
                    {
                      report.overall_grade
                    }
                  </p>
                </div>

                <div className="rounded-lg bg-[#fff8f5] p-2.5">
                  <p className="text-[7px] font-bold uppercase text-slate-400">
                    Percentage
                  </p>

                  <p className="mt-1 text-base font-black text-emerald-700">
                    {report.percentage}%
                  </p>
                </div>

                <div className="rounded-lg bg-[#fff8f5] p-2.5">
                  <p className="text-[7px] font-bold uppercase text-slate-400">
                    Obtained
                  </p>

                  <p className="mt-1 text-base font-black text-[#30201a]">
                    {
                      report.total_obtained
                    }
                  </p>
                </div>

                <div className="rounded-lg bg-[#fff8f5] p-2.5">
                  <p className="text-[7px] font-bold uppercase text-slate-400">
                    Total
                  </p>

                  <p className="mt-1 text-base font-black text-[#30201a]">
                    {report.total_max}
                  </p>
                </div>
              </div>

              {/* Subject marks */}
              <div className="border-t border-[#eee1dc]">
                <div className="grid grid-cols-[1fr_80px_70px_1fr] gap-2 bg-[#fff8f5] px-3 py-2">
                  <p className="text-[7px] font-black text-slate-400">
                    SUBJECT
                  </p>

                  <p className="text-[7px] font-black text-slate-400">
                    MARK
                  </p>

                  <p className="text-[7px] font-black text-slate-400">
                    GRADE
                  </p>

                  <p className="text-[7px] font-black text-slate-400">
                    REMARKS
                  </p>
                </div>

                <div className="divide-y divide-[#eee1dc]">
                  {report.subject_marks.map(
                    (mark) => (
                      <div
                        key={mark.id}
                        className="grid grid-cols-[1fr_80px_70px_1fr] gap-2 px-3 py-2"
                      >
                        <p className="truncate text-[9px] font-black text-[#30201a]">
                          {
                            mark.subject
                              .name
                          }
                        </p>

                        <p className="text-[9px] font-bold">
                          {
                            mark.marks_obtained
                          }
                          /
                          {
                            mark.subject
                              .marks
                          }
                        </p>

                        <p className="text-[9px] font-black text-[#8b2408]">
                          {mark.grade}
                        </p>

                        <p className="truncate text-[8px] text-slate-500">
                          {mark.remarks ||
                            "—"}
                        </p>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

export default ExamsPage;
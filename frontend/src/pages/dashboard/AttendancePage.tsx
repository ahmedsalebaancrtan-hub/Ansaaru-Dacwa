import {
  useMemo,
  useState,
  type FormEvent,
} from "react";

import {
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  LoaderCircle,
  RefreshCw,
  Save,
  Search,
  UsersRound,
} from "lucide-react";

import { useClasses } from "../../hooks/school/useClasses";

import { useStudents } from "../../hooks/school/useStudents";

import {
  useClassAttendance,
  useCreateAttendance,
} from "../../hooks/school/useAttendance";

interface AttendanceRow {
  studentId: number;
  status: string;
  remarks: string;
}

function getTodayDate() {
  const date = new Date();

  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1,
  ).padStart(2, "0");

  const day = String(
    date.getDate(),
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function AttendancePage() {
  const classesQuery = useClasses();
  const studentsQuery = useStudents();

  const createAttendanceMutation =
    useCreateAttendance();

  const [classId, setClassId] =
    useState("");

  const [date, setDate] =
    useState(getTodayDate());

  const [search, setSearch] =
    useState("");

  const [rows, setRows] =
    useState<AttendanceRow[]>([]);

  const numericClassId =
    Number(classId) || 0;

  const attendanceQuery =
    useClassAttendance({
      class_id: numericClassId,
      date,
    });

  const classes =
    classesQuery.data ?? [];

  const students =
    studentsQuery.data ?? [];

  const classStudents = useMemo(() => {
    if (!numericClassId) {
      return [];
    }

    return students.filter(
      (student) =>
        student.class_id ===
        numericClassId,
    );
  }, [students, numericClassId]);

  const filteredStudents = useMemo(() => {
    const value = search
      .trim()
      .toLowerCase();

    if (!value) {
      return classStudents;
    }

    return classStudents.filter(
      (student) =>
        student.full_name
          .toLowerCase()
          .includes(value) ||
        student.student_code
          .toLowerCase()
          .includes(value),
    );
  }, [classStudents, search]);

  const selectedClass = classes.find(
    (schoolClass) =>
      schoolClass.id === numericClassId,
  );

  const getRow = (
    studentId: number,
  ): AttendanceRow => {
    const localRow = rows.find(
      (row) =>
        row.studentId === studentId,
    );

    if (localRow) {
      return localRow;
    }

    const existingAttendance =
      attendanceQuery.data?.find(
        (attendance) =>
          attendance.student_id ===
          studentId,
      );

    return {
      studentId,
      status:
        existingAttendance?.status ??
        "PRESENT",

      remarks:
        existingAttendance?.remarks ??
        "",
    };
  };

  const updateRow = (
    studentId: number,
    field: "status" | "remarks",
    value: string,
  ) => {
    setRows((currentRows) => {
      const existingRow =
        currentRows.find(
          (row) =>
            row.studentId ===
            studentId,
        );

      if (existingRow) {
        return currentRows.map((row) =>
          row.studentId === studentId
            ? {
                ...row,
                [field]: value,
              }
            : row,
        );
      }

      const baseRow =
        getRow(studentId);

      return [
        ...currentRows,
        {
          ...baseRow,
          [field]: value,
        },
      ];
    });
  };

  const handleClassChange = (
    value: string,
  ) => {
    setClassId(value);
    setRows([]);
    setSearch("");
  };

  const handleDateChange = (
    value: string,
  ) => {
    setDate(value);
    setRows([]);
  };

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (
      !numericClassId ||
      !date ||
      classStudents.length === 0
    ) {
      return;
    }

    const attendances =
      classStudents.map((student) => {
        const row = getRow(student.id);

        return {
          student_id: student.id,

          status:
            row.status.trim() ||
            "PRESENT",

          remarks:
            row.remarks.trim(),
        };
      });

    createAttendanceMutation.mutate(
      {
        class_id: numericClassId,

        date: `${date}T08:00:00Z`,

        attendances,
      },
      {
        onSuccess: () => {
          setRows([]);
        },
      },
    );
  };

  const markAllPresent = () => {
    const updatedRows =
      classStudents.map(
        (student) => ({
          studentId: student.id,
          status: "PRESENT",
          remarks:
            getRow(student.id).remarks,
        }),
      );

    setRows(updatedRows);
  };

  return (
    <div className="space-y-3">
      {/* Heading */}
      <div>
        <h1 className="text-base font-black text-[#30201a]">
          Imaanshaha Ardayda
        </h1>

        <p className="mt-0.5 text-[9px] text-slate-500">
          Dooro fasalka iyo taariikhda,
          kadib diiwaangeli attendance-ka
          ardayda.
        </p>
      </div>

      {/* Filters */}
      <section className="rounded-xl border border-[#eadbd5] bg-white p-3 shadow-sm">
        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-[1fr_220px_auto]">
          {/* Class */}
          <div>
            <label className="mb-0.5 block text-[9px] font-bold text-[#51433e]">
              Fasalka
            </label>

            <select
              value={classId}
              onChange={(event) =>
                handleClassChange(
                  event.target.value,
                )
              }
              className="h-9 w-full rounded-lg border border-[#dfcbc4] bg-[#fff8f5] px-3 text-[10px] text-[#30201a] outline-none transition focus:border-[#8b2408] focus:bg-white focus:ring-2 focus:ring-orange-100"
            >
              <option value="">
                Dooro fasalka
              </option>

              {classes.map(
                (schoolClass) => (
                  <option
                    key={schoolClass.id}
                    value={schoolClass.id}
                  >
                    {schoolClass.title} -{" "}
                    {
                      schoolClass.AcademicYear
                    }
                  </option>
                ),
              )}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="mb-0.5 block text-[9px] font-bold text-[#51433e]">
              Taariikhda
            </label>

            <div className="relative">
              <CalendarDays
                size={13}
                className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="date"
                value={date}
                onChange={(event) =>
                  handleDateChange(
                    event.target.value,
                  )
                }
                className="h-9 w-full rounded-lg border border-[#dfcbc4] bg-[#fff8f5] pl-8 pr-3 text-[10px] text-[#30201a] outline-none transition focus:border-[#8b2408] focus:bg-white focus:ring-2 focus:ring-orange-100"
              />
            </div>
          </div>

          <div className="flex items-end">
            <button
              type="button"
              disabled={
                !numericClassId ||
                attendanceQuery.isFetching
              }
              onClick={() =>
                attendanceQuery.refetch()
              }
              className="flex h-9 items-center justify-center gap-1.5 rounded-lg border border-[#dfcbc4] px-3 text-[9px] font-bold text-[#8b2408] transition hover:bg-[#fff4f0] disabled:opacity-40"
            >
              <RefreshCw
                size={12}
                className={
                  attendanceQuery.isFetching
                    ? "animate-spin"
                    : ""
                }
              />

              Refresh
            </button>
          </div>
        </div>
      </section>

      {!numericClassId ? (
        /* Empty class state */
        <section className="flex h-40 flex-col items-center justify-center rounded-xl border border-dashed border-[#dfcbc4] bg-white">
          <div className="flex size-9 items-center justify-center rounded-lg bg-[#fff0eb] text-[#8b2408]">
            <UsersRound size={17} />
          </div>

          <p className="mt-2 text-[10px] font-black text-[#51433e]">
            Dooro fasalka
          </p>

          <p className="mt-0.5 text-[8px] text-slate-400">
            Ardayda fasalka ayaa halkan
            kasoo muuqanaysa.
          </p>
        </section>
      ) : studentsQuery.isLoading ||
        attendanceQuery.isLoading ? (
        /* Loading */
        <section className="flex h-40 items-center justify-center rounded-xl border border-[#eadbd5] bg-white">
          <LoaderCircle
            size={20}
            className="animate-spin text-[#8b2408]"
          />
        </section>
      ) : classStudents.length === 0 ? (
        /* No students */
        <section className="flex h-40 flex-col items-center justify-center rounded-xl border border-[#eadbd5] bg-white">
          <UsersRound
            size={20}
            className="text-slate-300"
          />

          <p className="mt-2 text-[9px] text-slate-500">
            Fasalkan arday kama diiwaangashana.
          </p>
        </section>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="overflow-hidden rounded-xl border border-[#eadbd5] bg-white shadow-sm"
        >
          {/* List toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#eee1dc] p-3">
            <div className="flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-md bg-[#fff0eb] text-[#8b2408]">
                <ClipboardCheck
                  size={13}
                />
              </div>

              <div>
                <h2 className="text-[10px] font-black text-[#30201a]">
                  {selectedClass?.title ??
                    "Attendance"}
                </h2>

                <p className="text-[8px] text-slate-400">
                  {classStudents.length}{" "}
                  arday
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <div className="relative">
                <Search
                  size={11}
                  className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value,
                    )
                  }
                  placeholder="Raadi arday..."
                  className="h-8 w-36 rounded-lg border border-[#dfcbc4] bg-[#fff8f5] pl-7 pr-2 text-[8px] outline-none focus:border-[#8b2408]"
                />
              </div>

              <button
                type="button"
                onClick={markAllPresent}
                className="flex h-8 items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 text-[8px] font-black text-emerald-700"
              >
                <CheckCircle2
                  size={11}
                />

                All Present
              </button>
            </div>
          </div>

          {/* Desktop heading */}
          <div className="hidden grid-cols-[55px_1.2fr_150px_1fr] gap-2 border-b border-[#eee1dc] bg-[#fff8f5] px-3 py-2 md:grid">
            <p className="text-[8px] font-black uppercase text-slate-400">
              #
            </p>

            <p className="text-[8px] font-black uppercase text-slate-400">
              Ardayga
            </p>

            <p className="text-[8px] font-black uppercase text-slate-400">
              Status
            </p>

            <p className="text-[8px] font-black uppercase text-slate-400">
              Remarks
            </p>
          </div>

          {/* Students */}
          <div className="divide-y divide-[#f0e4df]">
            {filteredStudents.map(
              (student, index) => {
                const row = getRow(
                  student.id,
                );

                return (
                  <div
                    key={student.id}
                    className="grid gap-2 px-3 py-2.5 transition hover:bg-[#fffaf8] md:grid-cols-[55px_1.2fr_150px_1fr] md:items-center"
                  >
                    {/* Number */}
                    <div className="hidden md:block">
                      <span className="text-[8px] font-bold text-slate-400">
                        {String(
                          index + 1,
                        ).padStart(2, "0")}
                      </span>
                    </div>

                    {/* Student */}
                    <div className="flex min-w-0 items-center gap-2">
                      <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-[#fff0eb] text-[#8b2408]">
                        <span className="text-[9px] font-black">
                          {student.full_name
                            .charAt(0)
                            .toUpperCase()}
                        </span>
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-[9px] font-black text-[#30201a]">
                          {
                            student.full_name
                          }
                        </p>

                        <p className="text-[8px] text-slate-400">
                          {
                            student.student_code
                          }
                        </p>
                      </div>
                    </div>

                    {/* Status */}
                    <div>
                      <label className="mb-0.5 block text-[8px] font-bold text-slate-400 md:hidden">
                        Status
                      </label>

                      <input
                        type="text"
                        value={row.status}
                        onChange={(event) =>
                          updateRow(
                            student.id,
                            "status",
                            event.target
                              .value
                              .toUpperCase(),
                          )
                        }
                        placeholder="PRESENT"
                        className="h-8 w-full rounded-md border border-[#dfcbc4] bg-[#fff8f5] px-2.5 text-[8px] font-bold uppercase text-[#51433e] outline-none transition focus:border-[#8b2408] focus:bg-white"
                      />
                    </div>

                    {/* Remarks */}
                    <div>
                      <label className="mb-0.5 block text-[8px] font-bold text-slate-400 md:hidden">
                        Remarks
                      </label>

                      <input
                        type="text"
                        value={row.remarks}
                        onChange={(event) =>
                          updateRow(
                            student.id,
                            "remarks",
                            event.target
                              .value,
                          )
                        }
                        placeholder="Faahfaahin..."
                        className="h-8 w-full rounded-md border border-[#dfcbc4] bg-[#fff8f5] px-2.5 text-[8px] text-[#51433e] outline-none transition focus:border-[#8b2408] focus:bg-white"
                      />
                    </div>
                  </div>
                );
              },
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between gap-3 border-t border-[#eee1dc] bg-[#fffaf8] px-3 py-2.5">
            <p className="text-[8px] text-slate-500">
              Attendance:{" "}
              <span className="font-black text-[#30201a]">
                {date}
              </span>
            </p>

            <button
              type="submit"
              disabled={
                createAttendanceMutation.isPending
              }
              className="flex h-8 items-center justify-center gap-1.5 rounded-lg bg-[#8b2408] px-4 text-[9px] font-black text-white transition hover:bg-[#701b05] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {createAttendanceMutation.isPending ? (
                <LoaderCircle
                  size={12}
                  className="animate-spin"
                />
              ) : (
                <Save size={12} />
              )}

              {createAttendanceMutation.isPending
                ? "Waa la kaydinayaa..."
                : "Kaydi Attendance"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default AttendancePage;
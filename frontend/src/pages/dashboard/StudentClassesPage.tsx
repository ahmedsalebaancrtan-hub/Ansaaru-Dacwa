import {
  useMemo,
  useState,
  type FormEvent,
} from "react";

import {
  AlertCircle,
  BookOpenCheck,
  GraduationCap,
  LoaderCircle,
  Plus,
  RefreshCw,
  School,
  Search,
  UserCheck,
  X,
} from "lucide-react";

import {
  useClasses,
} from "../../hooks/school/useClasses";

import {
  useStudents,
} from "../../hooks/school/useStudents";

import {
  useAddStudentToClass,
  useStudentClasses,
} from "../../hooks/school/useStudentClasses";

interface StudentClassForm {
  studentId: string;
  classId: string;
}

interface StudentClassFormErrors {
  studentId?: string;
  classId?: string;
}

const initialForm: StudentClassForm = {
  studentId: "",
  classId: "",
};

function getStudentFullName(
  firstName?: string,
  middleName?: string,
  lastName?: string,
): string {
  const fullName = [
    firstName,
    middleName,
    lastName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  return fullName || "Arday aan magac lahayn";
}

function formatDate(value: string): string {
  if (
    !value ||
    value.startsWith("0001-01-01")
  ) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function StudentClassesPage() {
  const studentsQuery = useStudents();
  const classesQuery = useClasses();
  const studentClassesQuery =
    useStudentClasses();

  const addStudentMutation =
    useAddStudentToClass();

  const [showCreateForm, setShowCreateForm] =
    useState(false);

  const [searchValue, setSearchValue] =
    useState("");

  const [form, setForm] =
    useState<StudentClassForm>(initialForm);

  const [errors, setErrors] =
    useState<StudentClassFormErrors>({});

  const students = studentsQuery.data ?? [];
  const classes = classesQuery.data ?? [];

  const studentClasses =
    studentClassesQuery.data ?? [];

  const filteredAssignments = useMemo(() => {
    const searchTerm = searchValue
      .trim()
      .toLowerCase();

    if (!searchTerm) {
      return studentClasses;
    }

    return studentClasses.filter(
      (assignment) => {
        const studentName =
          getStudentFullName(
            assignment.Student?.first_name,
            assignment.Student?.middle_name,
            assignment.Student?.last_name,
          ).toLowerCase();

        const studentCode =
          assignment.Student?.student_code
            ?.toLowerCase() ?? "";

        const classTitle =
          assignment.Class?.title
            ?.toLowerCase() ?? "";

        const academicYear =
          assignment.Class?.AcademicYear
            ?.toLowerCase() ?? "";

        return (
          studentName.includes(searchTerm) ||
          studentCode.includes(searchTerm) ||
          classTitle.includes(searchTerm) ||
          academicYear.includes(searchTerm)
        );
      },
    );
  }, [searchValue, studentClasses]);

  const activeAssignments =
    studentClasses.filter(
      (assignment) => assignment.is_active,
    ).length;

  const updateField = <
    Field extends keyof StudentClassForm,
  >(
    field: Field,
    value: StudentClassForm[Field],
  ) => {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));

    setErrors((currentErrors) => ({
      ...currentErrors,
      [field]: undefined,
    }));
  };

  const closeCreateForm = () => {
    setShowCreateForm(false);
    setForm(initialForm);
    setErrors({});
  };

  const validateForm =
    (): StudentClassFormErrors => {
      const newErrors: StudentClassFormErrors =
        {};

      if (!form.studentId) {
        newErrors.studentId =
          "Fadlan dooro ardayga";
      }

      if (!form.classId) {
        newErrors.classId =
          "Fadlan dooro fasalka";
      }

      return newErrors;
    };

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const validationErrors =
      validateForm();

    if (
      Object.keys(validationErrors).length >
      0
    ) {
      setErrors(validationErrors);
      return;
    }

    addStudentMutation.mutate(
      {
        student_id: Number(form.studentId),
        class_id: Number(form.classId),
      },
      {
        onSuccess: () => {
          closeCreateForm();
        },
      },
    );
  };

  const isReferenceDataLoading =
    studentsQuery.isLoading ||
    classesQuery.isLoading;

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#30201a] sm:text-3xl">
            Ardayda Fasallada
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Ardayda ku dar fasallada oo la soco
            assignments-kooda.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            setShowCreateForm(
              (currentValue) => !currentValue,
            )
          }
          className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[#8b2408] px-5 text-sm font-black text-white transition hover:bg-[#701b05] focus:outline-none focus:ring-4 focus:ring-orange-200"
        >
          {showCreateForm ? (
            <X size={19} />
          ) : (
            <Plus size={19} />
          )}

          {showCreateForm
            ? "Xir Form-ka"
            : "Arday Fasal Ku Dar"}
        </button>
      </section>

      {/* Statistics */}
      <section className="grid gap-4 sm:grid-cols-3">
        <article className="rounded-2xl border border-[#eadbd5] bg-white p-5 shadow-sm">
          <div className="flex size-11 items-center justify-center rounded-xl bg-[#fff0eb] text-[#8b2408]">
            <BookOpenCheck size={22} />
          </div>

          <p className="mt-4 text-sm font-semibold text-slate-500">
            Dhammaan Assignments
          </p>

          <p className="mt-1 text-3xl font-black text-[#30201a]">
            {studentClasses.length}
          </p>
        </article>

        <article className="rounded-2xl border border-[#eadbd5] bg-white p-5 shadow-sm">
          <div className="flex size-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
            <UserCheck size={22} />
          </div>

          <p className="mt-4 text-sm font-semibold text-slate-500">
            Active
          </p>

          <p className="mt-1 text-3xl font-black text-[#30201a]">
            {activeAssignments}
          </p>
        </article>

        <article className="rounded-2xl border border-[#eadbd5] bg-white p-5 shadow-sm">
          <div className="flex size-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
            <School size={22} />
          </div>

          <p className="mt-4 text-sm font-semibold text-slate-500">
            Fasallada
          </p>

          <p className="mt-1 text-3xl font-black text-[#30201a]">
            {classes.length}
          </p>
        </article>
      </section>

      {/* Create assignment form */}
      {showCreateForm && (
        <section className="rounded-2xl border border-[#eadbd5] bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-[#fff0eb] text-[#8b2408]">
              <UserCheck size={22} />
            </div>

            <div>
              <h2 className="font-black text-[#30201a]">
                Arday Fasal Ku Dar
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Dooro ardayga iyo fasalka aad ku
                darayso.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid gap-5 md:grid-cols-2"
            noValidate
          >
            {/* Student selection */}
            <div>
              <label
                htmlFor="student"
                className="mb-2 block text-sm font-bold text-[#51433e]"
              >
                Ardayga
              </label>

              <div className="relative">
                <GraduationCap
                  size={20}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#99847c]"
                />

                <select
                  id="student"
                  value={form.studentId}
                  disabled={
                    studentsQuery.isLoading
                  }
                  onChange={(event) =>
                    updateField(
                      "studentId",
                      event.target.value,
                    )
                  }
                  className={`h-12 w-full appearance-none rounded-xl border bg-[#fff8f5] pl-12 pr-4 outline-none transition focus:bg-white focus:ring-4 disabled:cursor-not-allowed disabled:opacity-60 ${
                    errors.studentId
                      ? "border-red-400 focus:ring-red-100"
                      : "border-[#dfcbc4] focus:border-[#8b2408] focus:ring-orange-100"
                  }`}
                >
                  <option value="">
                    {studentsQuery.isLoading
                      ? "Ardayda waa la soo qaadayaa..."
                      : "Dooro ardayga"}
                  </option>

                  {students.map((student) => (
                    <option
                      key={student.id}
                      value={student.id}
                    >
                      {getStudentFullName(
                        student.first_name,
                        student.middle_name,
                        student.last_name,
                      )}{" "}
                      — {student.student_code}
                    </option>
                  ))}
                </select>
              </div>

              {errors.studentId && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.studentId}
                </p>
              )}
            </div>

            {/* Class selection */}
            <div>
              <label
                htmlFor="class"
                className="mb-2 block text-sm font-bold text-[#51433e]"
              >
                Fasalka
              </label>

              <div className="relative">
                <School
                  size={20}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#99847c]"
                />

                <select
                  id="class"
                  value={form.classId}
                  disabled={classesQuery.isLoading}
                  onChange={(event) =>
                    updateField(
                      "classId",
                      event.target.value,
                    )
                  }
                  className={`h-12 w-full appearance-none rounded-xl border bg-[#fff8f5] pl-12 pr-4 outline-none transition focus:bg-white focus:ring-4 disabled:cursor-not-allowed disabled:opacity-60 ${
                    errors.classId
                      ? "border-red-400 focus:ring-red-100"
                      : "border-[#dfcbc4] focus:border-[#8b2408] focus:ring-orange-100"
                  }`}
                >
                  <option value="">
                    {classesQuery.isLoading
                      ? "Fasallada waa la soo qaadayaa..."
                      : "Dooro fasalka"}
                  </option>

                  {classes.map((schoolClass) => (
                    <option
                      key={schoolClass.id}
                      value={schoolClass.id}
                    >
                      {schoolClass.title} —{" "}
                      {schoolClass.AcademicYear}
                    </option>
                  ))}
                </select>
              </div>

              {errors.classId && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.classId}
                </p>
              )}
            </div>

            {(studentsQuery.isError ||
              classesQuery.isError) && (
              <div className="rounded-xl bg-red-50 p-4 text-sm font-semibold text-red-700 md:col-span-2">
                Ardayda ama fasallada lama soo heli
                karin. Hubi API endpoints-ka.
              </div>
            )}

            <div className="flex flex-col-reverse gap-3 md:col-span-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeCreateForm}
                className="h-12 rounded-xl border border-[#d9c6be] px-6 font-bold text-[#5c453d] transition hover:bg-[#fff4f0]"
              >
                Ka Noqo
              </button>

              <button
                type="submit"
                disabled={
                  addStudentMutation.isPending ||
                  isReferenceDataLoading ||
                  students.length === 0 ||
                  classes.length === 0
                }
                className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[#8b2408] px-6 font-black text-white transition hover:bg-[#701b05] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {addStudentMutation.isPending ? (
                  <LoaderCircle
                    size={19}
                    className="animate-spin"
                  />
                ) : (
                  <Plus size={19} />
                )}

                Ku Dar Fasalka
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Assignments list */}
      <section className="overflow-hidden rounded-2xl border border-[#eadbd5] bg-white shadow-sm">
        <header className="flex flex-col gap-4 border-b border-[#eee2dd] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <h2 className="font-black text-[#30201a]">
              Liiska Ardayda Fasallada
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Wadarta: {studentClasses.length} assignment
            </p>
          </div>

          <div className="flex w-full gap-2 sm:w-auto">
            <div className="relative flex-1 sm:w-72">
              <Search
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="search"
                value={searchValue}
                onChange={(event) =>
                  setSearchValue(event.target.value)
                }
                placeholder="Raadi arday ama fasal..."
                className="h-11 w-full rounded-xl border border-[#dfd0ca] bg-[#fffaf8] pl-11 pr-4 text-sm outline-none transition focus:border-[#8b2408] focus:bg-white focus:ring-4 focus:ring-orange-100"
              />
            </div>

            <button
              type="button"
              onClick={() =>
                studentClassesQuery.refetch()
              }
              disabled={
                studentClassesQuery.isFetching
              }
              className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-[#dfd0ca] text-[#76564b] transition hover:bg-[#fff0eb] disabled:opacity-60"
              aria-label="Refresh assignments"
            >
              <RefreshCw
                size={18}
                className={
                  studentClassesQuery.isFetching
                    ? "animate-spin"
                    : ""
                }
              />
            </button>
          </div>
        </header>

        {studentClassesQuery.isLoading && (
          <div className="flex min-h-72 items-center justify-center">
            <div className="text-center">
              <LoaderCircle
                size={34}
                className="mx-auto animate-spin text-[#8b2408]"
              />

              <p className="mt-3 text-sm text-slate-500">
                Xogta waa la soo qaadayaa...
              </p>
            </div>
          </div>
        )}

        {studentClassesQuery.isError && (
          <div className="flex min-h-72 items-center justify-center p-6 text-center">
            <div>
              <AlertCircle
                size={38}
                className="mx-auto text-red-500"
              />

              <h3 className="mt-4 font-black text-[#30201a]">
                Xogta lama soo heli karin
              </h3>

              <button
                type="button"
                onClick={() =>
                  studentClassesQuery.refetch()
                }
                className="mt-4 rounded-xl bg-[#8b2408] px-5 py-2.5 text-sm font-bold text-white"
              >
                Isku day mar kale
              </button>
            </div>
          </div>
        )}

        {!studentClassesQuery.isLoading &&
          !studentClassesQuery.isError &&
          filteredAssignments.length === 0 && (
            <div className="flex min-h-72 items-center justify-center p-6 text-center">
              <div>
                <BookOpenCheck
                  size={42}
                  className="mx-auto text-[#b98b7d]"
                />

                <h3 className="mt-4 font-black text-[#30201a]">
                  Assignment lama helin
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Ardayga ugu horreeya fasal ku dar.
                </p>
              </div>
            </div>
          )}

        {!studentClassesQuery.isLoading &&
          !studentClassesQuery.isError &&
          filteredAssignments.length > 0 && (
            <>
              {/* Desktop table */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full">
                  <thead className="bg-[#fff8f5] text-left">
                    <tr>
                      <th className="px-6 py-4 text-xs font-black uppercase tracking-wide text-slate-500">
                        Ardayga
                      </th>

                      <th className="px-6 py-4 text-xs font-black uppercase tracking-wide text-slate-500">
                        Student Code
                      </th>

                      <th className="px-6 py-4 text-xs font-black uppercase tracking-wide text-slate-500">
                        Fasalka
                      </th>

                      <th className="px-6 py-4 text-xs font-black uppercase tracking-wide text-slate-500">
                        Academic Year
                      </th>

                      <th className="px-6 py-4 text-xs font-black uppercase tracking-wide text-slate-500">
                        Status
                      </th>

                      <th className="px-6 py-4 text-xs font-black uppercase tracking-wide text-slate-500">
                        Taariikhda
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[#f0e4df]">
                    {filteredAssignments.map(
                      (assignment) => {
                        const studentName =
                          getStudentFullName(
                            assignment.Student
                              ?.first_name,
                            assignment.Student
                              ?.middle_name,
                            assignment.Student
                              ?.last_name,
                          );

                        return (
                          <tr
                            key={assignment.id}
                            className="transition hover:bg-[#fffaf8]"
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="flex size-10 items-center justify-center rounded-xl bg-[#fff0eb] text-[#8b2408]">
                                  <GraduationCap
                                    size={19}
                                  />
                                </div>

                                <div>
                                  <p className="font-black capitalize text-[#30201a]">
                                    {studentName}
                                  </p>

                                  <p className="mt-1 text-xs text-slate-400">
                                    ID: #
                                    {
                                      assignment.student_id
                                    }
                                  </p>
                                </div>
                              </div>
                            </td>

                            <td className="px-6 py-4 text-sm font-semibold text-slate-600">
                              {assignment.Student
                                ?.student_code ??
                                "—"}
                            </td>

                            <td className="px-6 py-4 font-bold text-[#4a3028]">
                              {assignment.Class
                                ?.title ?? "—"}
                            </td>

                            <td className="px-6 py-4 text-sm text-slate-500">
                              {assignment.Class
                                ?.AcademicYear ?? "—"}
                            </td>

                            <td className="px-6 py-4">
                              <span
                                className={`rounded-full px-3 py-1.5 text-xs font-black ${
                                  assignment.is_active
                                    ? "bg-emerald-50 text-emerald-700"
                                    : "bg-slate-100 text-slate-600"
                                }`}
                              >
                                {assignment.is_active
                                  ? "ACTIVE"
                                  : "INACTIVE"}
                              </span>
                            </td>

                            <td className="px-6 py-4 text-sm text-slate-500">
                              {formatDate(
                                assignment.Createdat,
                              )}
                            </td>
                          </tr>
                        );
                      },
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="space-y-3 p-4 md:hidden">
                {filteredAssignments.map(
                  (assignment) => (
                    <article
                      key={assignment.id}
                      className="rounded-xl border border-[#eadbd5] bg-[#fffaf8] p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#fff0eb] text-[#8b2408]">
                          <GraduationCap
                            size={21}
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <h3 className="truncate font-black capitalize text-[#30201a]">
                            {getStudentFullName(
                              assignment.Student
                                ?.first_name,
                              assignment.Student
                                ?.middle_name,
                              assignment.Student
                                ?.last_name,
                            )}
                          </h3>

                          <p className="mt-1 text-sm font-semibold text-blue-700">
                            {assignment.Student
                              ?.student_code ?? "—"}
                          </p>
                        </div>

                        <span
                          className={`rounded-full px-2.5 py-1 text-[10px] font-black ${
                            assignment.is_active
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {assignment.is_active
                            ? "ACTIVE"
                            : "INACTIVE"}
                        </span>
                      </div>

                      <div className="mt-4 grid gap-3 border-t border-[#eadbd5] pt-4 text-sm text-slate-600">
                        <p className="flex items-center gap-2">
                          <School
                            size={16}
                            className="text-[#8b2408]"
                          />

                          <span className="font-bold">
                            {assignment.Class
                              ?.title ?? "—"}
                          </span>
                        </p>

                        <p>
                          Academic Year:{" "}
                          <span className="font-bold">
                            {assignment.Class
                              ?.AcademicYear ?? "—"}
                          </span>
                        </p>

                        <p>
                          Taariikhda:{" "}
                          {formatDate(
                            assignment.Createdat,
                          )}
                        </p>
                      </div>
                    </article>
                  ),
                )}
              </div>
            </>
          )}
      </section>
    </div>
  );
}

export default StudentClassesPage;
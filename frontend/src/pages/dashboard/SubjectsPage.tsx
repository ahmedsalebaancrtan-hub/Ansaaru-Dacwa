import {
  useMemo,
  useState,
  type FormEvent,
} from "react";

import {
  BookOpen,
  GraduationCap,
  LoaderCircle,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  X,
} from "lucide-react";

import { useClasses } from "../../hooks/school/useClasses";

import {
  useAssignSubjects,
  useSubjects,
} from "../../hooks/school/useSubjects";

interface SubjectFormItem {
  name: string;
  marks: string;
}

interface SubjectForm {
  classId: string;
  subjects: SubjectFormItem[];
}

interface SubjectErrors {
  classId?: string;
  subjects?: string;
}

const emptySubject: SubjectFormItem = {
  name: "",
  marks: "100",
};

const initialForm: SubjectForm = {
  classId: "",
  subjects: [{ ...emptySubject }],
};

function SubjectsPage() {
  const subjectsQuery = useSubjects();
  const classesQuery = useClasses();

  const assignSubjectsMutation =
    useAssignSubjects();

  const [showForm, setShowForm] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [classFilter, setClassFilter] =
    useState("");

  const [form, setForm] =
    useState<SubjectForm>(initialForm);

  const [errors, setErrors] =
    useState<SubjectErrors>({});

  const subjects = subjectsQuery.data ?? [];
  const classes = classesQuery.data ?? [];

  const filteredSubjects = useMemo(() => {
    const searchValue = search
      .trim()
      .toLowerCase();

    return subjects.filter((subject) => {
      const matchesSearch =
        !searchValue ||
        subject.name
          .toLowerCase()
          .includes(searchValue) ||
        subject.class?.title
          ?.toLowerCase()
          .includes(searchValue);

      const matchesClass =
        !classFilter ||
        subject.class_id ===
          Number(classFilter);

      return (
        matchesSearch && matchesClass
      );
    });
  }, [
    subjects,
    search,
    classFilter,
  ]);

  const closeForm = () => {
    setShowForm(false);
    setForm({
      classId: "",
      subjects: [{ ...emptySubject }],
    });
    setErrors({});
  };

  const updateClass = (
    value: string,
  ) => {
    setForm((currentForm) => ({
      ...currentForm,
      classId: value,
    }));

    setErrors((currentErrors) => ({
      ...currentErrors,
      classId: undefined,
    }));
  };

  const updateSubject = (
    index: number,
    field: keyof SubjectFormItem,
    value: string,
  ) => {
    setForm((currentForm) => ({
      ...currentForm,

      subjects:
        currentForm.subjects.map(
          (subject, subjectIndex) =>
            subjectIndex === index
              ? {
                  ...subject,
                  [field]: value,
                }
              : subject,
        ),
    }));

    setErrors((currentErrors) => ({
      ...currentErrors,
      subjects: undefined,
    }));
  };

  const addSubject = () => {
    setForm((currentForm) => ({
      ...currentForm,

      subjects: [
        ...currentForm.subjects,
        {
          name: "",
          marks: "100",
        },
      ],
    }));
  };

  const removeSubject = (
    index: number,
  ) => {
    setForm((currentForm) => {
      if (
        currentForm.subjects.length === 1
      ) {
        return currentForm;
      }

      return {
        ...currentForm,

        subjects:
          currentForm.subjects.filter(
            (_, subjectIndex) =>
              subjectIndex !== index,
          ),
      };
    });
  };

  const validateForm =
    (): SubjectErrors => {
      const newErrors: SubjectErrors = {};

      if (!form.classId) {
        newErrors.classId =
          "Dooro fasalka";
      }

      const invalidSubject =
        form.subjects.some((subject) => {
          const marks = Number(
            subject.marks,
          );

          return (
            subject.name.trim().length < 2 ||
            Number.isNaN(marks) ||
            marks <= 0
          );
        });

      if (invalidSubject) {
        newErrors.subjects =
          "Hubi magaca maadada iyo marks-ka";
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

    assignSubjectsMutation.mutate(
      {
        class_id: Number(form.classId),

        subjects: form.subjects.map(
          (subject) => ({
            name: subject.name.trim(),
            marks: Number(subject.marks),
          }),
        ),
      },
      {
        onSuccess: () => {
          closeForm();
        },
      },
    );
  };

  return (
    <div className="space-y-3">
      {/* Heading */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-base font-black text-[#30201a]">
            Maadooyinka
          </h1>

          <p className="mt-0.5 text-[9px] text-slate-500">
            Maadooyinka ku xidh fasallada
            dugsiga.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            setShowForm(
              (current) => !current,
            )
          }
          className="flex h-8 items-center gap-1.5 rounded-lg bg-[#8b2408] px-3 text-[9px] font-black text-white transition hover:bg-[#701b05]"
        >
          {showForm ? (
            <X size={13} />
          ) : (
            <Plus size={13} />
          )}

          {showForm
            ? "Xir"
            : "Ku Dar Maado"}
        </button>
      </div>

      {/* Assign subjects form */}
      {showForm && (
        <section className="rounded-xl border border-[#eadbd5] bg-white p-3 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-[#fff0eb] text-[#8b2408]">
              <BookOpen size={15} />
            </div>

            <div>
              <h2 className="text-[11px] font-black text-[#30201a]">
                Maadooyinka Fasalka
              </h2>

              <p className="text-[8px] text-slate-500">
                Dooro fasalka kadibna ku
                dar maadooyinka.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-3"
            noValidate
          >
            {/* Class */}
            <div className="max-w-sm">
              <label
                htmlFor="subject-class"
                className="mb-0.5 block text-[9px] font-bold text-[#51433e]"
              >
                Fasalka
              </label>

              <select
                id="subject-class"
                value={form.classId}
                onChange={(event) =>
                  updateClass(
                    event.target.value,
                  )
                }
                className={`h-9 w-full rounded-lg border bg-[#fff8f5] px-3 text-[10px] text-[#30201a] outline-none transition focus:bg-white focus:ring-2 ${
                  errors.classId
                    ? "border-red-400 focus:ring-red-100"
                    : "border-[#dfcbc4] focus:border-[#8b2408] focus:ring-orange-100"
                }`}
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

              {errors.classId && (
                <p className="mt-0.5 text-[8px] text-red-600">
                  {errors.classId}
                </p>
              )}
            </div>

            {/* Subjects */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <p className="text-[9px] font-black text-[#51433e]">
                  Maadooyinka
                </p>

                <button
                  type="button"
                  onClick={addSubject}
                  className="flex h-7 items-center gap-1 rounded-md border border-[#dfcbc4] px-2 text-[8px] font-bold text-[#8b2408] transition hover:bg-[#fff4f0]"
                >
                  <Plus size={11} />
                  Maado kale
                </button>
              </div>

              <div className="space-y-2">
                {form.subjects.map(
                  (subject, index) => (
                    <div
                      key={index}
                      className="grid gap-2 rounded-lg border border-[#eee1dc] bg-[#fffaf8] p-2 sm:grid-cols-[1fr_130px_32px]"
                    >
                      {/* Subject name */}
                      <div>
                        <label className="mb-0.5 block text-[8px] font-bold text-slate-500">
                          Magaca Maadada
                        </label>

                        <input
                          type="text"
                          value={subject.name}
                          onChange={(event) =>
                            updateSubject(
                              index,
                              "name",
                              event.target
                                .value,
                            )
                          }
                          placeholder="Mathematics"
                          className="h-8 w-full rounded-md border border-[#dfcbc4] bg-white px-2.5 text-[9px] outline-none transition focus:border-[#8b2408] focus:ring-2 focus:ring-orange-100"
                        />
                      </div>

                      {/* Marks */}
                      <div>
                        <label className="mb-0.5 block text-[8px] font-bold text-slate-500">
                          Marks
                        </label>

                        <input
                          type="number"
                          min="1"
                          step="1"
                          value={
                            subject.marks
                          }
                          onChange={(event) =>
                            updateSubject(
                              index,
                              "marks",
                              event.target
                                .value,
                            )
                          }
                          placeholder="100"
                          className="h-8 w-full rounded-md border border-[#dfcbc4] bg-white px-2.5 text-[9px] outline-none transition focus:border-[#8b2408] focus:ring-2 focus:ring-orange-100"
                        />
                      </div>

                      {/* Remove */}
                      <div className="flex items-end">
                        <button
                          type="button"
                          disabled={
                            form.subjects
                              .length === 1
                          }
                          onClick={() =>
                            removeSubject(
                              index,
                            )
                          }
                          className="flex size-8 items-center justify-center rounded-md border border-red-100 bg-red-50 text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-30"
                          aria-label="Remove subject"
                        >
                          <Trash2
                            size={12}
                          />
                        </button>
                      </div>
                    </div>
                  ),
                )}
              </div>

              {errors.subjects && (
                <p className="mt-1 text-[8px] font-medium text-red-600">
                  {errors.subjects}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 border-t border-[#eee1dc] pt-3">
              <button
                type="button"
                onClick={closeForm}
                className="h-8 rounded-lg border border-[#dfcbc4] px-4 text-[9px] font-bold text-[#604c45] transition hover:bg-[#fff4f0]"
              >
                Ka Noqo
              </button>

              <button
                type="submit"
                disabled={
                  assignSubjectsMutation.isPending
                }
                className="flex h-8 items-center justify-center gap-1.5 rounded-lg bg-[#8b2408] px-4 text-[9px] font-black text-white transition hover:bg-[#701b05] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {assignSubjectsMutation.isPending ? (
                  <LoaderCircle
                    size={13}
                    className="animate-spin"
                  />
                ) : (
                  <Plus size={13} />
                )}

                {assignSubjectsMutation.isPending
                  ? "Waa la kaydinayaa..."
                  : "Kaydi Maadooyinka"}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Subjects list */}
      <section className="overflow-hidden rounded-xl border border-[#eadbd5] bg-white shadow-sm">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#eee1dc] p-3">
          <div>
            <h2 className="text-[11px] font-black text-[#30201a]">
              Liiska Maadooyinka
            </h2>

            <p className="text-[8px] text-slate-500">
              Wadarta: {subjects.length}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {/* Class filter */}
            <select
              value={classFilter}
              onChange={(event) =>
                setClassFilter(
                  event.target.value,
                )
              }
              className="h-8 max-w-36 rounded-lg border border-[#dfcbc4] bg-[#fff8f5] px-2 text-[8px] outline-none focus:border-[#8b2408]"
            >
              <option value="">
                Fasallada oo dhan
              </option>

              {classes.map(
                (schoolClass) => (
                  <option
                    key={schoolClass.id}
                    value={schoolClass.id}
                  >
                    {schoolClass.title}
                  </option>
                ),
              )}
            </select>

            {/* Search */}
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
                placeholder="Raadi..."
                className="h-8 w-32 rounded-lg border border-[#dfcbc4] bg-[#fff8f5] pl-7 pr-2 text-[8px] outline-none focus:border-[#8b2408]"
              />
            </div>

            {/* Refresh */}
            <button
              type="button"
              onClick={() =>
                subjectsQuery.refetch()
              }
              className="flex size-8 items-center justify-center rounded-lg border border-[#dfcbc4] text-[#8b2408] transition hover:bg-[#fff4f0]"
              aria-label="Refresh subjects"
            >
              <RefreshCw
                size={12}
                className={
                  subjectsQuery.isFetching
                    ? "animate-spin"
                    : ""
                }
              />
            </button>
          </div>
        </div>

        {/* Loading */}
        {subjectsQuery.isLoading ? (
          <div className="flex h-32 items-center justify-center">
            <LoaderCircle
              size={20}
              className="animate-spin text-[#8b2408]"
            />
          </div>
        ) : filteredSubjects.length ===
          0 ? (
          <div className="flex h-32 flex-col items-center justify-center gap-1">
            <BookOpen
              size={19}
              className="text-slate-300"
            />

            <p className="text-[9px] text-slate-500">
              Maadooyin lama helin.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop */}
            <div className="hidden md:block">
              <table className="w-full">
                <thead className="bg-[#fff8f5]">
                  <tr className="border-b border-[#eee1dc]">
                    <th className="px-3 py-2 text-left text-[8px] font-black uppercase tracking-wide text-slate-500">
                      Maadada
                    </th>

                    <th className="px-3 py-2 text-left text-[8px] font-black uppercase tracking-wide text-slate-500">
                      Fasalka
                    </th>

                    <th className="px-3 py-2 text-left text-[8px] font-black uppercase tracking-wide text-slate-500">
                      Academic Year
                    </th>

                    <th className="px-3 py-2 text-left text-[8px] font-black uppercase tracking-wide text-slate-500">
                      Marks
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#f0e4df]">
                  {filteredSubjects.map(
                    (subject) => (
                      <tr
                        key={subject.id}
                        className="transition hover:bg-[#fffaf8]"
                      >
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-2">
                            <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-[#fff0eb] text-[#8b2408]">
                              <BookOpen
                                size={12}
                              />
                            </div>

                            <div>
                              <p className="text-[9px] font-black text-[#30201a]">
                                {subject.name}
                              </p>

                              <p className="text-[7px] text-slate-400">
                                ID #{subject.id}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-3 py-2">
                          <div className="flex items-center gap-1.5">
                            <GraduationCap
                              size={11}
                              className="text-[#8b2408]"
                            />

                            <span className="text-[9px] font-bold text-[#51433e]">
                              {subject.class
                                ?.title ??
                                "—"}
                            </span>
                          </div>
                        </td>

                        <td className="px-3 py-2 text-[9px] text-slate-500">
                          {subject.class
                            ?.AcademicYear ??
                            "—"}
                        </td>

                        <td className="px-3 py-2">
                          <span className="inline-flex rounded-md bg-emerald-50 px-2 py-1 text-[8px] font-black text-emerald-700">
                            {subject.marks}
                          </span>
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile */}
            <div className="divide-y divide-[#f0e4df] md:hidden">
              {filteredSubjects.map(
                (subject) => (
                  <div
                    key={subject.id}
                    className="p-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex min-w-0 items-center gap-2">
                        <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-[#fff0eb] text-[#8b2408]">
                          <BookOpen
                            size={12}
                          />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-[9px] font-black text-[#30201a]">
                            {subject.name}
                          </p>

                          <p className="text-[8px] text-slate-400">
                            {subject.class
                              ?.title ?? "—"}
                          </p>
                        </div>
                      </div>

                      <span className="rounded-md bg-emerald-50 px-2 py-1 text-[8px] font-black text-emerald-700">
                        {subject.marks}
                      </span>
                    </div>

                    <p className="mt-2 text-[8px] text-slate-500">
                      Academic Year:{" "}
                      <span className="font-bold">
                        {subject.class
                          ?.AcademicYear ??
                          "—"}
                      </span>
                    </p>
                  </div>
                ),
              )}
            </div>
          </>
        )}
      </section>
    </div>
  );
}

export default SubjectsPage;
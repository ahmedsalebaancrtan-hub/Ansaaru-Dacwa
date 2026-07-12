import {
  useMemo,
  useState,
  type FormEvent,
} from "react";

import {
  AlertCircle,
  CalendarDays,
  LoaderCircle,
  Plus,
  RefreshCw,
  School,
  Search,
  X,
} from "lucide-react";

import {
  useClasses,
  useCreateClass,
} from "../../hooks/school/useClasses";

interface ClassForm {
  title: string;
  academicYear: string;
}

interface ClassFormErrors {
  title?: string;
  academicYear?: string;
}

const initialForm: ClassForm = {
  title: "",
  academicYear: "",
};

function formatDate(value: string): string {
  if (!value || value.startsWith("0001-01-01")) {
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

function validateAcademicYear(value: string): boolean {
  const match = value.match(/^(\d{4})-(\d{4})$/);

  if (!match) {
    return false;
  }

  const firstYear = Number(match[1]);
  const secondYear = Number(match[2]);

  return secondYear === firstYear + 1;
}

function ClassesPage() {
  const classesQuery = useClasses();
  const createClassMutation = useCreateClass();

  const [searchValue, setSearchValue] =
    useState("");

  const [showCreateForm, setShowCreateForm] =
    useState(false);

  const [form, setForm] =
    useState<ClassForm>(initialForm);

  const [errors, setErrors] =
    useState<ClassFormErrors>({});

  const classes = classesQuery.data ?? [];

  const filteredClasses = useMemo(() => {
    const searchTerm = searchValue
      .trim()
      .toLowerCase();

    if (!searchTerm) {
      return classes;
    }

    return classes.filter((schoolClass) => {
      return (
        schoolClass.title
          .toLowerCase()
          .includes(searchTerm) ||
        schoolClass.AcademicYear
          .toLowerCase()
          .includes(searchTerm)
      );
    });
  }, [classes, searchValue]);

  const closeCreateForm = () => {
    setShowCreateForm(false);
    setForm(initialForm);
    setErrors({});
  };

  const validateForm = (): ClassFormErrors => {
    const newErrors: ClassFormErrors = {};

    if (form.title.trim().length < 2) {
      newErrors.title =
        "Magaca class-ku waa inuu ugu yaraan yahay 2 xaraf";
    }

    if (!validateAcademicYear(form.academicYear.trim())) {
      newErrors.academicYear =
        "Academic year-ku waa inuu noqdaa sida 2026-2027";
    }

    return newErrors;
  };

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const validationErrors = validateForm();

    if (
      Object.keys(validationErrors).length > 0
    ) {
      setErrors(validationErrors);
      return;
    }

    createClassMutation.mutate(
      {
        title: form.title.trim(),
        AcademicYear: form.academicYear.trim(),
      },
      {
        onSuccess: () => {
          closeCreateForm();
        },
      },
    );
  };

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#30201a] sm:text-3xl">
            Fasallada
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Maamul fasallada iyo sannad-dugsiyeedkooda.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            setShowCreateForm((current) => !current)
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
            : "Class Cusub"}
        </button>
      </section>

      {/* Create class form */}
      {showCreateForm && (
        <section className="rounded-2xl border border-[#eadbd5] bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-[#fff0eb] text-[#8b2408]">
              <School size={22} />
            </div>

            <div>
              <h2 className="font-black text-[#30201a]">
                Samee Class Cusub
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Geli magaca class-ka iyo sannad-dugsiyeedka.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid gap-5 md:grid-cols-2"
            noValidate
          >
            <div>
              <label
                htmlFor="class-title"
                className="mb-2 block text-sm font-bold text-[#51433e]"
              >
                Magaca Class-ka
              </label>

              <div className="relative">
                <School
                  size={20}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#99847c]"
                />

                <input
                  id="class-title"
                  type="text"
                  value={form.title}
                  onChange={(event) => {
                    setForm((currentForm) => ({
                      ...currentForm,
                      title: event.target.value,
                    }));

                    setErrors((currentErrors) => ({
                      ...currentErrors,
                      title: undefined,
                    }));
                  }}
                  placeholder="Tusaale: Form Four A"
                  className={`h-12 w-full rounded-xl border bg-[#fff8f5] pl-12 pr-4 outline-none transition focus:bg-white focus:ring-4 ${
                    errors.title
                      ? "border-red-400 focus:ring-red-100"
                      : "border-[#dfcbc4] focus:border-[#8b2408] focus:ring-orange-100"
                  }`}
                />
              </div>

              {errors.title && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.title}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="academic-year"
                className="mb-2 block text-sm font-bold text-[#51433e]"
              >
                Sannad-dugsiyeedka
              </label>

              <div className="relative">
                <CalendarDays
                  size={20}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#99847c]"
                />

                <input
                  id="academic-year"
                  type="text"
                  value={form.academicYear}
                  onChange={(event) => {
                    setForm((currentForm) => ({
                      ...currentForm,
                      academicYear: event.target.value,
                    }));

                    setErrors((currentErrors) => ({
                      ...currentErrors,
                      academicYear: undefined,
                    }));
                  }}
                  placeholder="2026-2027"
                  className={`h-12 w-full rounded-xl border bg-[#fff8f5] pl-12 pr-4 outline-none transition focus:bg-white focus:ring-4 ${
                    errors.academicYear
                      ? "border-red-400 focus:ring-red-100"
                      : "border-[#dfcbc4] focus:border-[#8b2408] focus:ring-orange-100"
                  }`}
                />
              </div>

              {errors.academicYear && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.academicYear}
                </p>
              )}
            </div>

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
                disabled={createClassMutation.isPending}
                className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[#8b2408] px-6 font-black text-white transition hover:bg-[#701b05] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {createClassMutation.isPending ? (
                  <LoaderCircle
                    size={19}
                    className="animate-spin"
                  />
                ) : (
                  <Plus size={19} />
                )}

                Kaydi Class-ka
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Class list */}
      <section className="overflow-hidden rounded-2xl border border-[#eadbd5] bg-white shadow-sm">
        <header className="flex flex-col gap-4 border-b border-[#eee2dd] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <h2 className="font-black text-[#30201a]">
              Liiska Fasallada
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Wadarta: {classes.length} fasal
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
                placeholder="Raadi class..."
                className="h-11 w-full rounded-xl border border-[#dfd0ca] bg-[#fffaf8] pl-11 pr-4 text-sm outline-none transition focus:border-[#8b2408] focus:bg-white focus:ring-4 focus:ring-orange-100"
              />
            </div>

            <button
              type="button"
              onClick={() => classesQuery.refetch()}
              disabled={classesQuery.isFetching}
              className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-[#dfd0ca] text-[#76564b] transition hover:bg-[#fff0eb] disabled:opacity-60"
              aria-label="Refresh classes"
            >
              <RefreshCw
                size={18}
                className={
                  classesQuery.isFetching
                    ? "animate-spin"
                    : ""
                }
              />
            </button>
          </div>
        </header>

        {classesQuery.isLoading && (
          <div className="flex min-h-72 items-center justify-center">
            <div className="text-center">
              <LoaderCircle
                size={34}
                className="mx-auto animate-spin text-[#8b2408]"
              />

              <p className="mt-3 text-sm text-slate-500">
                Fasallada waa la soo qaadayaa...
              </p>
            </div>
          </div>
        )}

        {classesQuery.isError && (
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
                onClick={() => classesQuery.refetch()}
                className="mt-4 rounded-xl bg-[#8b2408] px-5 py-2.5 text-sm font-bold text-white"
              >
                Isku day mar kale
              </button>
            </div>
          </div>
        )}

        {!classesQuery.isLoading &&
          !classesQuery.isError &&
          filteredClasses.length === 0 && (
            <div className="flex min-h-72 items-center justify-center p-6 text-center">
              <div>
                <School
                  size={42}
                  className="mx-auto text-[#b98b7d]"
                />

                <h3 className="mt-4 font-black text-[#30201a]">
                  Class lama helin
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Samee class-ka ugu horreeya.
                </p>
              </div>
            </div>
          )}

        {!classesQuery.isLoading &&
          !classesQuery.isError &&
          filteredClasses.length > 0 && (
            <>
              {/* Desktop table */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full">
                  <thead className="bg-[#fff8f5] text-left">
                    <tr>
                      <th className="px-6 py-4 text-xs font-black uppercase tracking-wide text-slate-500">
                        ID
                      </th>

                      <th className="px-6 py-4 text-xs font-black uppercase tracking-wide text-slate-500">
                        Class
                      </th>

                      <th className="px-6 py-4 text-xs font-black uppercase tracking-wide text-slate-500">
                        Academic Year
                      </th>

                      <th className="px-6 py-4 text-xs font-black uppercase tracking-wide text-slate-500">
                        La Sameeyay
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[#f0e4df]">
                    {filteredClasses.map((schoolClass) => (
                      <tr
                        key={schoolClass.id}
                        className="transition hover:bg-[#fffaf8]"
                      >
                        <td className="px-6 py-4 text-sm font-semibold text-slate-500">
                          #{schoolClass.id}
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-xl bg-[#fff0eb] text-[#8b2408]">
                              <School size={19} />
                            </div>

                            <p className="font-black text-[#30201a]">
                              {schoolClass.title}
                            </p>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">
                            {schoolClass.AcademicYear}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-500">
                          {formatDate(
                            schoolClass.Createdat,
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="space-y-3 p-4 md:hidden">
                {filteredClasses.map((schoolClass) => (
                  <article
                    key={schoolClass.id}
                    className="rounded-xl border border-[#eadbd5] bg-[#fffaf8] p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#fff0eb] text-[#8b2408]">
                        <School size={21} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="truncate font-black text-[#30201a]">
                          {schoolClass.title}
                        </h3>

                        <p className="mt-1 text-sm font-semibold text-blue-700">
                          {schoolClass.AcademicYear}
                        </p>
                      </div>

                      <span className="text-xs font-bold text-slate-400">
                        #{schoolClass.id}
                      </span>
                    </div>

                    <div className="mt-4 border-t border-[#eadbd5] pt-3 text-xs text-slate-500">
                      La sameeyay:{" "}
                      {formatDate(schoolClass.Createdat)}
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
      </section>
    </div>
  );
}

export default ClassesPage;
import {
  useMemo,
  useState,
  type FormEvent,
} from "react";

import {
  AlertCircle,
  GraduationCap,
  Hash,
  LoaderCircle,
  Phone,
  Plus,
  RefreshCw,
  Search,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";

import {
  useCreateStudent,
  useStudents,
} from "../../hooks/school/useStudents";

import { useFamilies } from "../../hooks/school/useFamilies";

import type {
  StudentGender,
} from "../../types/Admin/student.types";

interface StudentForm {
  studentCode: string;
  firstName: string;
  middleName: string;
  lastName: string;
  gender: StudentGender | "";
  familyId: string;
}

interface StudentFormErrors {
  studentCode?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  gender?: string;
  familyId?: string;
}

const initialForm: StudentForm = {
  studentCode: "",
  firstName: "",
  middleName: "",
  lastName: "",
  gender: "",
  familyId: "",
};

function isValidPhoneNumber(value: string): boolean {
  const cleanedPhone = value.replace(/\s+/g, "");

  return /^\+?[0-9]{7,15}$/.test(cleanedPhone);
}

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

function formatGender(gender: string): string {
  if (gender.toLowerCase() === "male") {
    return "Lab";
  }

  if (gender.toLowerCase() === "female") {
    return "Dhedig";
  }

  return gender || "—";
}

function StudentsPage() {
  const studentsQuery = useStudents();
  const familiesQuery = useFamilies();
  const createStudentMutation =
    useCreateStudent();

  const [searchValue, setSearchValue] =
    useState("");

  const [showCreateForm, setShowCreateForm] =
    useState(false);

  const [form, setForm] =
    useState<StudentForm>(initialForm);

  const [errors, setErrors] =
    useState<StudentFormErrors>({});

  const students = studentsQuery.data ?? [];

  const filteredStudents = useMemo(() => {
    const searchTerm = searchValue
      .trim()
      .toLowerCase();

    if (!searchTerm) {
      return students;
    }

    return students.filter((student) => {
      const fullName = [
        student.first_name,
        student.middle_name,
        student.last_name,
      ]
        .join(" ")
        .toLowerCase();

      return (
        fullName.includes(searchTerm) ||
        student.student_code
          .toLowerCase()
          .includes(searchTerm) ||
        student.family?.familyName
          ?.toLowerCase()
          .includes(searchTerm) ||
        student.family?.parent_one_phone
          ?.toLowerCase()
          .includes(searchTerm)
      );
    });
  }, [searchValue, students]);

  const updateField = <
    Field extends keyof StudentForm,
  >(
    field: Field,
    value: StudentForm[Field],
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

  const validateForm = (): StudentFormErrors => {
    const newErrors: StudentFormErrors = {};

    if (form.studentCode.trim().length < 3) {
      newErrors.studentCode =
        "Student code-ku waa required";
    }

    if (form.firstName.trim().length < 2) {
      newErrors.firstName =
        "Magaca koowaad waa required";
    }

    if (form.middleName.trim().length < 2) {
      newErrors.middleName =
        "Magaca dhexe waa required";
    }

    if (form.lastName.trim().length < 2) {
      newErrors.lastName =
        "Magaca dambe waa required";
    }

    if (!form.gender) {
      newErrors.gender =
        "Dooro gender-ka ardayga";
    }

    if (!form.familyId) {
      newErrors.familyId =
        "Fadlan dooro qoyska";
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

    if (!form.gender) {
      return;
    }

    createStudentMutation.mutate(
      {
        first_name: form.firstName.trim(),
        middle_name: form.middleName.trim(),
        last_name: form.lastName.trim(),
        student_code: form.studentCode.trim(),
        family_id: Number(form.familyId),
        gender: form.gender,
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
            Ardayda
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Diiwaangeli oo maamul ardayda
            dugsiga.
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
            : "Arday Cusub"}
        </button>
      </section>

      {/* Create student form */}
      {showCreateForm && (
        <section className="rounded-2xl border border-[#eadbd5] bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-[#fff0eb] text-[#8b2408]">
              <GraduationCap size={22} />
            </div>

            <div>
              <h2 className="font-black text-[#30201a]">
                Diiwaangeli Arday Cusub
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Geli xogta ardayga iyo waalidka.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid gap-5 md:grid-cols-2 xl:grid-cols-3"
            noValidate
          >
            {/* Student code */}
            <div>
              <label
                htmlFor="student-code"
                className="mb-2 block text-sm font-bold text-[#51433e]"
              >
                Student Code
              </label>

              <div className="relative">
                <Hash
                  size={20}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#99847c]"
                />

                <input
                  id="student-code"
                  value={form.studentCode}
                  onChange={(event) =>
                    updateField(
                      "studentCode",
                      event.target.value,
                    )
                  }
                  placeholder="2026-form1-1"
                  className={`h-12 w-full rounded-xl border bg-[#fff8f5] pl-12 pr-4 outline-none transition focus:bg-white focus:ring-4 ${
                    errors.studentCode
                      ? "border-red-400 focus:ring-red-100"
                      : "border-[#dfcbc4] focus:border-[#8b2408] focus:ring-orange-100"
                  }`}
                />
              </div>

              {errors.studentCode && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.studentCode}
                </p>
              )}
            </div>

            {/* First name */}
            <div>
              <label
                htmlFor="first-name"
                className="mb-2 block text-sm font-bold text-[#51433e]"
              >
                Magaca Koowaad
              </label>

              <div className="relative">
                <UserRound
                  size={20}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#99847c]"
                />

                <input
                  id="first-name"
                  value={form.firstName}
                  onChange={(event) =>
                    updateField(
                      "firstName",
                      event.target.value,
                    )
                  }
                  placeholder="Ahmed"
                  className={`h-12 w-full rounded-xl border bg-[#fff8f5] pl-12 pr-4 outline-none transition focus:bg-white focus:ring-4 ${
                    errors.firstName
                      ? "border-red-400 focus:ring-red-100"
                      : "border-[#dfcbc4] focus:border-[#8b2408] focus:ring-orange-100"
                  }`}
                />
              </div>

              {errors.firstName && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.firstName}
                </p>
              )}
            </div>

            {/* Middle name */}
            <div>
              <label
                htmlFor="middle-name"
                className="mb-2 block text-sm font-bold text-[#51433e]"
              >
                Magaca Dhexe
              </label>

              <input
                id="middle-name"
                value={form.middleName}
                onChange={(event) =>
                  updateField(
                    "middleName",
                    event.target.value,
                  )
                }
                placeholder="Saleban"
                className={`h-12 w-full rounded-xl border bg-[#fff8f5] px-4 outline-none transition focus:bg-white focus:ring-4 ${
                  errors.middleName
                    ? "border-red-400 focus:ring-red-100"
                    : "border-[#dfcbc4] focus:border-[#8b2408] focus:ring-orange-100"
                }`}
              />

              {errors.middleName && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.middleName}
                </p>
              )}
            </div>

            {/* Last name */}
            <div>
              <label
                htmlFor="last-name"
                className="mb-2 block text-sm font-bold text-[#51433e]"
              >
                Magaca Dambe
              </label>

              <input
                id="last-name"
                value={form.lastName}
                onChange={(event) =>
                  updateField(
                    "lastName",
                    event.target.value,
                  )
                }
                placeholder="Cartan"
                className={`h-12 w-full rounded-xl border bg-[#fff8f5] px-4 outline-none transition focus:bg-white focus:ring-4 ${
                  errors.lastName
                    ? "border-red-400 focus:ring-red-100"
                    : "border-[#dfcbc4] focus:border-[#8b2408] focus:ring-orange-100"
                }`}
              />

              {errors.lastName && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.lastName}
                </p>
              )}
            </div>

            {/* Gender */}
            <div>
              <label
                htmlFor="gender"
                className="mb-2 block text-sm font-bold text-[#51433e]"
              >
                Gender
              </label>

              <select
                id="gender"
                value={form.gender}
                onChange={(event) =>
                  updateField(
                    "gender",
                    event.target
                      .value as StudentGender | "",
                  )
                }
                className={`h-12 w-full rounded-xl border bg-[#fff8f5] px-4 outline-none transition focus:bg-white focus:ring-4 ${
                  errors.gender
                    ? "border-red-400 focus:ring-red-100"
                    : "border-[#dfcbc4] focus:border-[#8b2408] focus:ring-orange-100"
                }`}
              >
                <option value="">
                  Dooro gender
                </option>

                <option value="male">
                  Lab
                </option>

                <option value="female">
                  Dhedig
                </option>
              </select>

              {errors.gender && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.gender}
                </p>
              )}
            </div>

            {/* Family selection */}
            <div>
              <label
                htmlFor="family-id"
                className="mb-2 block text-sm font-bold text-[#51433e]"
              >
                Qoyska
              </label>

              <div className="relative">
                <UsersRound
                  size={20}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#99847c]"
                />

                <select
                  id="family-id"
                  value={form.familyId}
                  disabled={familiesQuery.isLoading}
                  onChange={(event) =>
                    updateField(
                      "familyId",
                      event.target.value,
                    )
                  }
                  className={`h-12 w-full appearance-none rounded-xl border bg-[#fff8f5] pl-12 pr-4 outline-none transition focus:bg-white focus:ring-4 disabled:cursor-not-allowed disabled:opacity-60 ${
                    errors.familyId
                      ? "border-red-400 focus:ring-red-100"
                      : "border-[#dfcbc4] focus:border-[#8b2408] focus:ring-orange-100"
                  }`}
                >
                  <option value="">
                    {familiesQuery.isLoading
                      ? "Qoysaska waa la soo qaadayaa..."
                      : "Dooro qoyska"}
                  </option>

                  {(familiesQuery.data ?? []).map((family) => (
                    <option
                      key={family.id}
                      value={family.id}
                    >
                      {family.familyName} — {family.Parent_one_Name}
                    </option>
                  ))}
                </select>
              </div>

              {errors.familyId && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.familyId}
                </p>
              )}
            </div>

            {/* Form actions */}
            <div className="flex flex-col-reverse gap-3 md:col-span-2 sm:flex-row sm:justify-end xl:col-span-3">
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
                  createStudentMutation.isPending
                }
                className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[#8b2408] px-6 font-black text-white transition hover:bg-[#701b05] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {createStudentMutation.isPending ? (
                  <LoaderCircle
                    size={19}
                    className="animate-spin"
                  />
                ) : (
                  <Plus size={19} />
                )}

                Diiwaangeli Ardayga
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Students list */}
      <section className="overflow-hidden rounded-2xl border border-[#eadbd5] bg-white shadow-sm">
        <header className="flex flex-col gap-4 border-b border-[#eee2dd] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <h2 className="font-black text-[#30201a]">
              Liiska Ardayda
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Wadarta: {students.length} arday
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
                placeholder="Raadi arday..."
                className="h-11 w-full rounded-xl border border-[#dfd0ca] bg-[#fffaf8] pl-11 pr-4 text-sm outline-none transition focus:border-[#8b2408] focus:bg-white focus:ring-4 focus:ring-orange-100"
              />
            </div>

            <button
              type="button"
              onClick={() => studentsQuery.refetch()}
              disabled={studentsQuery.isFetching}
              className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-[#dfd0ca] text-[#76564b] transition hover:bg-[#fff0eb] disabled:opacity-60"
              aria-label="Refresh students"
            >
              <RefreshCw
                size={18}
                className={
                  studentsQuery.isFetching
                    ? "animate-spin"
                    : ""
                }
              />
            </button>
          </div>
        </header>

        {studentsQuery.isLoading && (
          <div className="flex min-h-72 items-center justify-center">
            <div className="text-center">
              <LoaderCircle
                size={34}
                className="mx-auto animate-spin text-[#8b2408]"
              />

              <p className="mt-3 text-sm text-slate-500">
                Ardayda waa la soo qaadayaa...
              </p>
            </div>
          </div>
        )}

        {studentsQuery.isError && (
          <div className="flex min-h-72 items-center justify-center p-6 text-center">
            <div>
              <AlertCircle
                size={38}
                className="mx-auto text-red-500"
              />

              <h3 className="mt-4 font-black text-[#30201a]">
                Ardayda lama soo heli karin
              </h3>

              <button
                type="button"
                onClick={() =>
                  studentsQuery.refetch()
                }
                className="mt-4 rounded-xl bg-[#8b2408] px-5 py-2.5 text-sm font-bold text-white"
              >
                Isku day mar kale
              </button>
            </div>
          </div>
        )}

        {!studentsQuery.isLoading &&
          !studentsQuery.isError &&
          filteredStudents.length === 0 && (
            <div className="flex min-h-72 items-center justify-center p-6 text-center">
              <div>
                <GraduationCap
                  size={42}
                  className="mx-auto text-[#b98b7d]"
                />

                <h3 className="mt-4 font-black text-[#30201a]">
                  Arday lama helin
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Diiwaangeli ardayga ugu horreeya.
                </p>
              </div>
            </div>
          )}

        {!studentsQuery.isLoading &&
          !studentsQuery.isError &&
          filteredStudents.length > 0 && (
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
                        Gender
                      </th>

                      <th className="px-6 py-4 text-xs font-black uppercase tracking-wide text-slate-500">
                        Qoyska
                      </th>

                      <th className="px-6 py-4 text-xs font-black uppercase tracking-wide text-slate-500">
                        La Diiwaangeliyay
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[#f0e4df]">
                    {filteredStudents.map(
                      (student) => {
                        const fullName = [
                          student.first_name,
                          student.middle_name,
                          student.last_name,
                        ].join(" ");

                        return (
                          <tr
                            key={student.id}
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
                                    {fullName}
                                  </p>

                                  <p className="mt-1 text-xs text-slate-400">
                                    ID: #{student.id}
                                  </p>
                                </div>
                              </div>
                            </td>

                            <td className="px-6 py-4">
                              <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">
                                {student.student_code}
                              </span>
                            </td>

                            <td className="px-6 py-4 text-sm font-semibold text-[#4a3028]">
                              {formatGender(
                                student.gender,
                              )}
                            </td>

                            <td className="px-6 py-4 text-sm text-slate-500">
                              {student.family
                                ?.familyName ||
                                `Family #${student.familyId}`}
                            </td>

                            <td className="px-6 py-4 text-sm text-slate-500">
                              {formatDate(
                                student.Createdat,
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
                {filteredStudents.map(
                  (student) => {
                    const fullName = [
                      student.first_name,
                      student.middle_name,
                      student.last_name,
                    ].join(" ");

                    return (
                      <article
                        key={student.id}
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
                              {fullName}
                            </h3>

                            <p className="mt-1 text-sm font-semibold text-blue-700">
                              {student.student_code}
                            </p>
                          </div>

                          <span className="text-xs font-bold text-slate-400">
                            #{student.id}
                          </span>
                        </div>

                        <div className="mt-4 grid gap-3 border-t border-[#eadbd5] pt-4 text-sm text-slate-600">
                          <p>
                            Gender:{" "}
                            <span className="font-bold">
                              {formatGender(
                                student.gender,
                              )}
                            </span>
                          </p>

                          <p>
                            Qoyska:{" "}
                            <span className="font-bold">
                              {student.family
                                ?.familyName ||
                                `Family #${student.familyId}`}
                            </span>
                          </p>

                          {student.family
                            ?.parent_one_phone && (
                            <p className="flex items-center gap-2">
                              <Phone
                                size={16}
                                className="text-[#8b2408]"
                              />

                              {
                                student.family
                                  .parent_one_phone
                              }
                            </p>
                          )}
                        </div>
                      </article>
                    );
                  },
                )}
              </div>
            </>
          )}
      </section>
    </div>
  );
}

export default StudentsPage;
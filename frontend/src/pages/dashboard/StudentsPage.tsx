import {
  useMemo,
  useState,
  type FormEvent,
} from "react";

import {
  CalendarDays,
  GraduationCap,
  LoaderCircle,
  Percent,
  Phone,
  Plus,
  RefreshCw,
  Search,
  School,
  UsersRound,
  X,
} from "lucide-react";

import {
  useCreateStudent,
  useStudents,
} from "../../hooks/school/useStudents";

import { useClasses } from "../../hooks/school/useClasses";
import { useFamilies } from "../../hooks/school/useFamilies";

interface StudentForm {
  fullName: string;
  studentCode: string;
  classId: string;
  familyId: string;
  dateOfAdmission: string;
  discountFee: string;
  mobileNumber: string;
  gender: string;
}

interface StudentErrors {
  fullName?: string;
  studentCode?: string;
  classId?: string;
  familyId?: string;
  dateOfAdmission?: string;
  discountFee?: string;
  mobileNumber?: string;
  gender?: string;
}

const initialForm: StudentForm = {
  fullName: "",
  studentCode: "",
  classId: "",
  familyId: "",
  dateOfAdmission: "",
  discountFee: "0",
  mobileNumber: "",
  gender: "",
};

function StudentsPage() {
  const studentsQuery = useStudents();
  const classesQuery = useClasses();
  const familiesQuery = useFamilies();

  const createStudentMutation =
    useCreateStudent();

  const [showForm, setShowForm] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [form, setForm] =
    useState<StudentForm>(initialForm);

  const [errors, setErrors] =
    useState<StudentErrors>({});

  const students =
    studentsQuery.data ?? [];

  const classes =
    classesQuery.data ?? [];

  const families =
    familiesQuery.data ?? [];

  const filteredStudents = useMemo(() => {
    const value = search
      .trim()
      .toLowerCase();

    if (!value) {
      return students;
    }

    return students.filter((student) => {
      return (
        student.full_name
          ?.toLowerCase()
          .includes(value) ||
        student.student_code
          ?.toLowerCase()
          .includes(value) ||
        student.mobile_number
          ?.toLowerCase()
          .includes(value) ||
        student.class?.title
          ?.toLowerCase()
          .includes(value) ||
        student.family?.familyName
          ?.toLowerCase()
          .includes(value)
      );
    });
  }, [search, students]);

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

  const closeForm = () => {
    setShowForm(false);
    setForm(initialForm);
    setErrors({});
  };

  const validateForm =
    (): StudentErrors => {
      const newErrors: StudentErrors = {};

      if (
        form.fullName.trim().length < 3
      ) {
        newErrors.fullName =
          "Geli magaca ardayga";
      }

      if (
        form.studentCode.trim().length < 3
      ) {
        newErrors.studentCode =
          "Geli student code";
      }

      if (!form.classId) {
        newErrors.classId =
          "Dooro fasalka";
      }

      if (!form.familyId) {
        newErrors.familyId =
          "Dooro qoyska";
      }

      if (!form.dateOfAdmission) {
        newErrors.dateOfAdmission =
          "Dooro taariikhda gelitaanka";
      }

      if (!form.gender) {
        newErrors.gender =
          "Dooro gender-ka";
      }

      const discount = Number(
        form.discountFee,
      );

      if (
        Number.isNaN(discount) ||
        discount < 0 ||
        discount > 100
      ) {
        newErrors.discountFee =
          "Discount-ku waa inuu noqdaa 0 ilaa 100";
      }

      const cleanPhone =
        form.mobileNumber.replace(
          /\s+/g,
          "",
        );

      if (
        !/^\+?[0-9]{7,15}$/.test(
          cleanPhone,
        )
      ) {
        newErrors.mobileNumber =
          "Geli mobile sax ah";
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
      Object.keys(validationErrors)
        .length > 0
    ) {
      setErrors(validationErrors);
      return;
    }

    createStudentMutation.mutate(
      {
        full_name:
          form.fullName.trim(),

        student_code:
          form.studentCode.trim(),

        class_id: Number(
          form.classId,
        ),

        date_of_admission:
          form.dateOfAdmission,

        family_id: Number(
          form.familyId,
        ),

        discount_fee: Number(
          form.discountFee,
        ),

        mobile_number:
          form.mobileNumber
            .replace(/\s+/g, "")
            .trim(),

        gender: form.gender,
      },
      {
        onSuccess: () => {
          closeForm();
        },
      },
    );
  };

  const inputClass = (
    hasError: boolean,
  ) =>
    [
      "h-9 w-full rounded-lg border bg-[#fff8f5]",
      "px-3 text-[10px] text-[#30201a]",
      "outline-none transition focus:bg-white focus:ring-2",
      hasError
        ? "border-red-400 focus:ring-red-100"
        : "border-[#dfcbc4] focus:border-[#8b2408] focus:ring-orange-100",
    ].join(" ");

  return (
    <div className="space-y-3">
      {/* Heading */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-base font-black text-[#30201a]">
            Ardayda
          </h1>

          <p className="mt-0.5 text-[9px] text-slate-500">
            Diiwaangeli oo maamul ardayda
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
            : "Arday Cusub"}
        </button>
      </div>

      {/* Create student */}
      {showForm && (
        <section className="rounded-xl border border-[#eadbd5] bg-white p-3 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-[#fff0eb] text-[#8b2408]">
              <GraduationCap
                size={15}
              />
            </div>

            <div>
              <h2 className="text-[11px] font-black text-[#30201a]">
                Diiwaangeli Arday
              </h2>

              <p className="text-[8px] text-slate-500">
                Geli xogta ardayga.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3"
            noValidate
          >
            {/* Full name */}
            <div>
              <label className="mb-0.5 block text-[9px] font-bold text-[#51433e]">
                Magaca Ardayga
              </label>

              <input
                value={form.fullName}
                onChange={(event) =>
                  updateField(
                    "fullName",
                    event.target.value,
                  )
                }
                placeholder="Mohamed Hassan Ali"
                className={inputClass(
                  Boolean(
                    errors.fullName,
                  ),
                )}
              />

              {errors.fullName && (
                <p className="mt-0.5 text-[8px] text-red-600">
                  {errors.fullName}
                </p>
              )}
            </div>

            {/* Student code */}
            <div>
              <label className="mb-0.5 block text-[9px] font-bold text-[#51433e]">
                Student Code
              </label>

              <input
                value={form.studentCode}
                onChange={(event) =>
                  updateField(
                    "studentCode",
                    event.target.value,
                  )
                }
                placeholder="STD-2026-001"
                className={inputClass(
                  Boolean(
                    errors.studentCode,
                  ),
                )}
              />

              {errors.studentCode && (
                <p className="mt-0.5 text-[8px] text-red-600">
                  {
                    errors.studentCode
                  }
                </p>
              )}
            </div>

            {/* Gender */}
            <div>
              <label className="mb-0.5 block text-[9px] font-bold text-[#51433e]">
                Gender
              </label>

              <select
                value={form.gender}
                onChange={(event) =>
                  updateField(
                    "gender",
                    event.target.value,
                  )
                }
                className={`${inputClass(
                  Boolean(errors.gender),
                )} appearance-none`}
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
                <p className="mt-0.5 text-[8px] text-red-600">
                  {errors.gender}
                </p>
              )}
            </div>

            {/* Class */}
            <div>
              <label className="mb-0.5 block text-[9px] font-bold text-[#51433e]">
                Fasalka
              </label>

              <div className="relative">
                <School
                  size={13}
                  className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <select
                  value={form.classId}
                  disabled={
                    classesQuery.isLoading
                  }
                  onChange={(event) =>
                    updateField(
                      "classId",
                      event.target.value,
                    )
                  }
                  className={`${inputClass(
                    Boolean(
                      errors.classId,
                    ),
                  )} appearance-none pl-8 disabled:cursor-not-allowed disabled:opacity-60`}
                >
                  <option value="">
                    {classesQuery.isLoading
                      ? "Fasallada waa la soo qaadayaa..."
                      : "Dooro fasalka"}
                  </option>

                  {classes.map(
                    (schoolClass) => (
                      <option
                        key={
                          schoolClass.id
                        }
                        value={
                          schoolClass.id
                        }
                      >
                        {
                          schoolClass.title
                        }{" "}
                        -{" "}
                        {
                          schoolClass.AcademicYear
                        }
                      </option>
                    ),
                  )}
                </select>
              </div>

              {errors.classId && (
                <p className="mt-0.5 text-[8px] text-red-600">
                  {errors.classId}
                </p>
              )}
            </div>

            {/* Family */}
            <div>
              <label className="mb-0.5 block text-[9px] font-bold text-[#51433e]">
                Qoyska
              </label>

              <div className="relative">
                <UsersRound
                  size={13}
                  className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <select
                  value={form.familyId}
                  disabled={
                    familiesQuery.isLoading
                  }
                  onChange={(event) =>
                    updateField(
                      "familyId",
                      event.target.value,
                    )
                  }
                  className={`${inputClass(
                    Boolean(
                      errors.familyId,
                    ),
                  )} appearance-none pl-8 disabled:cursor-not-allowed disabled:opacity-60`}
                >
                  <option value="">
                    {familiesQuery.isLoading
                      ? "Qoysaska waa la soo qaadayaa..."
                      : "Dooro qoyska"}
                  </option>

                  {families.map(
                    (family) => (
                      <option
                        key={family.id}
                        value={family.id}
                      >
                        {
                          family.familyName
                        }
                        {family.Parent_one_Name
                          ? ` - ${family.Parent_one_Name}`
                          : ""}
                      </option>
                    ),
                  )}
                </select>
              </div>

              {errors.familyId && (
                <p className="mt-0.5 text-[8px] text-red-600">
                  {errors.familyId}
                </p>
              )}
            </div>

            {/* Admission date */}
            <div>
              <label className="mb-0.5 block text-[9px] font-bold text-[#51433e]">
                Taariikhda Gelitaanka
              </label>

              <div className="relative">
                <CalendarDays
                  size={13}
                  className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="date"
                  value={
                    form.dateOfAdmission
                  }
                  onChange={(event) =>
                    updateField(
                      "dateOfAdmission",
                      event.target.value,
                    )
                  }
                  className={`${inputClass(
                    Boolean(
                      errors.dateOfAdmission,
                    ),
                  )} pl-8`}
                />
              </div>

              {errors.dateOfAdmission && (
                <p className="mt-0.5 text-[8px] text-red-600">
                  {
                    errors.dateOfAdmission
                  }
                </p>
              )}
            </div>

            {/* Discount */}
            <div>
              <label className="mb-0.5 block text-[9px] font-bold text-[#51433e]">
                Discount Fee
              </label>

              <div className="relative">
                <Percent
                  size={13}
                  className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="number"
                  min="0"
                  max="100"
                  value={
                    form.discountFee
                  }
                  onChange={(event) =>
                    updateField(
                      "discountFee",
                      event.target.value,
                    )
                  }
                  className={`${inputClass(
                    Boolean(
                      errors.discountFee,
                    ),
                  )} pl-8`}
                />
              </div>

              {errors.discountFee && (
                <p className="mt-0.5 text-[8px] text-red-600">
                  {
                    errors.discountFee
                  }
                </p>
              )}
            </div>

            {/* Mobile */}
            <div>
              <label className="mb-0.5 block text-[9px] font-bold text-[#51433e]">
                Mobile Number
              </label>

              <div className="relative">
                <Phone
                  size={13}
                  className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="tel"
                  value={
                    form.mobileNumber
                  }
                  onChange={(event) =>
                    updateField(
                      "mobileNumber",
                      event.target.value,
                    )
                  }
                  placeholder="+252615000000"
                  className={`${inputClass(
                    Boolean(
                      errors.mobileNumber,
                    ),
                  )} pl-8`}
                />
              </div>

              {errors.mobileNumber && (
                <p className="mt-0.5 text-[8px] text-red-600">
                  {
                    errors.mobileNumber
                  }
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-end gap-2 sm:col-span-2">
              <button
                type="button"
                onClick={closeForm}
                className="h-8 rounded-lg border border-[#dfcbc4] px-4 text-[9px] font-bold text-[#604c45]"
              >
                Ka Noqo
              </button>

              <button
                type="submit"
                disabled={
                  createStudentMutation.isPending
                }
                className="flex h-8 items-center justify-center gap-1.5 rounded-lg bg-[#8b2408] px-4 text-[9px] font-black text-white disabled:opacity-60"
              >
                {createStudentMutation.isPending ? (
                  <LoaderCircle
                    size={13}
                    className="animate-spin"
                  />
                ) : (
                  <Plus size={13} />
                )}

                {createStudentMutation.isPending
                  ? "Waa la kaydinayaa..."
                  : "Kaydi Ardayga"}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Student list */}
      <section className="overflow-hidden rounded-xl border border-[#eadbd5] bg-white shadow-sm">
        <div className="flex items-center justify-between gap-3 border-b border-[#eee1dc] p-3">
          <div>
            <h2 className="text-[11px] font-black text-[#30201a]">
              Liiska Ardayda
            </h2>

            <p className="text-[8px] text-slate-500">
              Wadarta: {students.length}
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            <div className="relative">
              <Search
                size={12}
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
                className="h-8 w-40 rounded-lg border border-[#dfcbc4] bg-[#fff8f5] pl-7 pr-2 text-[9px] outline-none focus:border-[#8b2408]"
              />
            </div>

            <button
              type="button"
              onClick={() =>
                studentsQuery.refetch()
              }
              className="flex size-8 items-center justify-center rounded-lg border border-[#dfcbc4] text-[#8b2408]"
              aria-label="Refresh students"
            >
              <RefreshCw
                size={12}
                className={
                  studentsQuery.isFetching
                    ? "animate-spin"
                    : ""
                }
              />
            </button>
          </div>
        </div>

        {studentsQuery.isLoading ? (
          <div className="flex h-32 items-center justify-center">
            <LoaderCircle
              size={20}
              className="animate-spin text-[#8b2408]"
            />
          </div>
        ) : filteredStudents.length ===
          0 ? (
          <div className="flex h-32 items-center justify-center">
            <p className="text-[9px] text-slate-500">
              Arday lama helin.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#f0e4df]">
            {filteredStudents.map(
              (student) => (
                <div
                  key={student.id}
                  className="grid items-center gap-2 px-3 py-2 transition hover:bg-[#fffaf8] sm:grid-cols-[1.4fr_1fr_1fr_1fr]"
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-[#fff0eb] text-[#8b2408]">
                      <GraduationCap
                        size={13}
                      />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-[10px] font-black text-[#30201a]">
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

                  <div>
                    <p className="text-[8px] text-slate-400">
                      Fasalka
                    </p>

                    <p className="text-[9px] font-bold text-[#51433e]">
                      {student.class
                        ?.title ?? "—"}
                    </p>
                  </div>

                  <div>
                    <p className="text-[8px] text-slate-400">
                      Mobile
                    </p>

                    <p className="text-[9px] font-bold text-[#51433e]">
                      {student.mobile_number ??
                        "—"}
                    </p>
                  </div>

                  <div>
                    <p className="text-[8px] text-slate-400">
                      Discount
                    </p>

                    <p className="text-[9px] font-black text-[#8b2408]">
                      {student.discount_fee ??
                        0}
                      %
                    </p>
                  </div>
                </div>
              ),
            )}
          </div>
        )}
      </section>
    </div>
  );
}

export default StudentsPage;
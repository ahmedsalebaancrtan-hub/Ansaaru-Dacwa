import {
  useMemo,
  useState,
  type FormEvent,
} from "react";

import {
  CalendarDays,
  DollarSign,
  LoaderCircle,
  Phone,
  Plus,
  RefreshCw,
  Search,
  UserRound,

  X,
} from "lucide-react";

import {
  useCreateEmployee,
  useEmployees,
} from "../../hooks/school/useEmployees";

interface EmployeeForm {
  fullName: string;
  phone: string;
  role: string;
  pictureUrl: string;
  dateOfJoining: string;
  monthlySalary: string;
}

interface EmployeeErrors {
  fullName?: string;
  phone?: string;
  role?: string;
  dateOfJoining?: string;
  monthlySalary?: string;
}

const initialForm: EmployeeForm = {
  fullName: "",
  phone: "",
  role: "",
  pictureUrl: "",
  dateOfJoining: "",
  monthlySalary: "",
};

const employeeRoles = [
  "Teacher",
  "Administrator",
  "Cashier",
  "Accountant",
  "Secretary",
  "Cleaner",
  "Security",
  "Other",
];

function formatDate(value: string): string {
  if (!value) {
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

function EmployeesPage() {
  const employeesQuery = useEmployees();

  const createEmployeeMutation =
    useCreateEmployee();

  const [showForm, setShowForm] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [form, setForm] =
    useState<EmployeeForm>(initialForm);

  const [errors, setErrors] =
    useState<EmployeeErrors>({});

  const employees =
    employeesQuery.data ?? [];

  const filteredEmployees = useMemo(() => {
    const value = search
      .trim()
      .toLowerCase();

    if (!value) {
      return employees;
    }

    return employees.filter((employee) => {
      return (
        employee.full_name
          .toLowerCase()
          .includes(value) ||
        employee.phone
          .toLowerCase()
          .includes(value) ||
        employee.role
          .toLowerCase()
          .includes(value)
      );
    });
  }, [employees, search]);

  const updateField = <
    Field extends keyof EmployeeForm,
  >(
    field: Field,
    value: EmployeeForm[Field],
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
    (): EmployeeErrors => {
      const newErrors: EmployeeErrors = {};

      if (form.fullName.trim().length < 3) {
        newErrors.fullName =
          "Geli magaca shaqaalaha";
      }

      if (
        !/^\+?[0-9]{7,15}$/.test(
          form.phone.replace(/\s+/g, ""),
        )
      ) {
        newErrors.phone =
          "Geli telefoon sax ah";
      }

      if (!form.role) {
        newErrors.role =
          "Dooro shaqada";
      }

      if (!form.dateOfJoining) {
        newErrors.dateOfJoining =
          "Dooro taariikhda shaqada";
      }

      const salary = Number(
        form.monthlySalary,
      );

      if (
        Number.isNaN(salary) ||
        salary <= 0
      ) {
        newErrors.monthlySalary =
          "Geli mushahar sax ah";
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

    createEmployeeMutation.mutate(
      {
        full_name: form.fullName.trim(),

        phone: form.phone
          .replace(/\s+/g, "")
          .trim(),

        role: form.role,

        picture_url:
          form.pictureUrl.trim(),

        date_of_joining: `${form.dateOfJoining}T00:00:00Z`,

        monthly_salary: Number(
          form.monthlySalary,
        ),
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
            Shaqaalaha
          </h1>

          <p className="mt-0.5 text-[9px] text-slate-500">
            Diiwaangeli oo maamul shaqaalaha dugsiga.
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
            : "Shaqaale Cusub"}
        </button>
      </div>

      {/* Create employee */}
      {showForm && (
        <section className="rounded-xl border border-[#eadbd5] bg-white p-3 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-[#fff0eb] text-[#8b2408]">
              <UserRound size={15} />
            </div>

            <div>
              <h2 className="text-[11px] font-black text-[#30201a]">
                Diiwaangeli Shaqaale
              </h2>

              <p className="text-[8px] text-slate-500">
                Geli xogta shaqaalaha cusub.
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
                Magaca Buuxa
              </label>

              <div className="relative">
                <UserRound
                  size={13}
                  className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  value={form.fullName}
                  onChange={(event) =>
                    updateField(
                      "fullName",
                      event.target.value,
                    )
                  }
                  placeholder="Axmed Cali Axmed"
                  className={`${inputClass(
                    Boolean(
                      errors.fullName,
                    ),
                  )} pl-8`}
                />
              </div>

              {errors.fullName && (
                <p className="mt-0.5 text-[8px] text-red-600">
                  {errors.fullName}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="mb-0.5 block text-[9px] font-bold text-[#51433e]">
                Telephone
              </label>

              <div className="relative">
                <Phone
                  size={13}
                  className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="tel"
                  value={form.phone}
                  onChange={(event) =>
                    updateField(
                      "phone",
                      event.target.value,
                    )
                  }
                  placeholder="+252615123456"
                  className={`${inputClass(
                    Boolean(errors.phone),
                  )} pl-8`}
                />
              </div>

              {errors.phone && (
                <p className="mt-0.5 text-[8px] text-red-600">
                  {errors.phone}
                </p>
              )}
            </div>

            {/* Role */}
            <div>
              <label className="mb-0.5 block text-[9px] font-bold text-[#51433e]">
                Shaqada
              </label>

              <select
                value={form.role}
                onChange={(event) =>
                  updateField(
                    "role",
                    event.target.value,
                  )
                }
                className={`${inputClass(
                  Boolean(errors.role),
                )} appearance-none`}
              >
                <option value="">
                  Dooro shaqada
                </option>

                {employeeRoles.map(
                  (role) => (
                    <option
                      key={role}
                      value={role}
                    >
                      {role}
                    </option>
                  ),
                )}
              </select>

              {errors.role && (
                <p className="mt-0.5 text-[8px] text-red-600">
                  {errors.role}
                </p>
              )}
            </div>

            {/* Joining date */}
            <div>
              <label className="mb-0.5 block text-[9px] font-bold text-[#51433e]">
                Taariikhda Shaqada
              </label>

              <div className="relative">
                <CalendarDays
                  size={13}
                  className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="date"
                  value={form.dateOfJoining}
                  onChange={(event) =>
                    updateField(
                      "dateOfJoining",
                      event.target.value,
                    )
                  }
                  className={`${inputClass(
                    Boolean(
                      errors.dateOfJoining,
                    ),
                  )} pl-8`}
                />
              </div>

              {errors.dateOfJoining && (
                <p className="mt-0.5 text-[8px] text-red-600">
                  {errors.dateOfJoining}
                </p>
              )}
            </div>

            {/* Salary */}
            <div>
              <label className="mb-0.5 block text-[9px] font-bold text-[#51433e]">
                Mushaharka Bishii
              </label>

              <div className="relative">
                <DollarSign
                  size={13}
                  className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.monthlySalary}
                  onChange={(event) =>
                    updateField(
                      "monthlySalary",
                      event.target.value,
                    )
                  }
                  placeholder="250"
                  className={`${inputClass(
                    Boolean(
                      errors.monthlySalary,
                    ),
                  )} pl-8`}
                />
              </div>

              {errors.monthlySalary && (
                <p className="mt-0.5 text-[8px] text-red-600">
                  {errors.monthlySalary}
                </p>
              )}
            </div>

            {/* Picture URL */}
            <div>
              <label className="mb-0.5 block text-[9px] font-bold text-[#51433e]">
                Picture URL
              </label>

              <input
                type="text"
                value={form.pictureUrl}
                onChange={(event) =>
                  updateField(
                    "pictureUrl",
                    event.target.value,
                  )
                }
                placeholder="Optional"
                className={inputClass(false)}
              />
            </div>

            {/* Actions */}
            <div className="flex items-end gap-2 sm:col-span-2 lg:col-span-3 lg:justify-end">
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
                  createEmployeeMutation.isPending
                }
                className="flex h-8 items-center justify-center gap-1.5 rounded-lg bg-[#8b2408] px-4 text-[9px] font-black text-white disabled:opacity-60"
              >
                {createEmployeeMutation.isPending ? (
                  <LoaderCircle
                    size={13}
                    className="animate-spin"
                  />
                ) : (
                  <Plus size={13} />
                )}

                Kaydi Shaqaalaha
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Employees list */}
      <section className="rounded-xl border border-[#eadbd5] bg-white shadow-sm">
        <div className="flex items-center justify-between gap-3 border-b border-[#eee1dc] p-3">
          <div>
            <h2 className="text-[11px] font-black text-[#30201a]">
              Liiska Shaqaalaha
            </h2>

            <p className="text-[8px] text-slate-500">
              Wadarta: {employees.length}
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            <div className="relative">
              <Search
                size={12}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
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
                employeesQuery.refetch()
              }
              className="flex size-8 items-center justify-center rounded-lg border border-[#dfcbc4] text-[#8b2408]"
              aria-label="Refresh employees"
            >
              <RefreshCw
                size={12}
                className={
                  employeesQuery.isFetching
                    ? "animate-spin"
                    : ""
                }
              />
            </button>
          </div>
        </div>

        {employeesQuery.isLoading ? (
          <div className="flex h-32 items-center justify-center">
            <LoaderCircle
              size={20}
              className="animate-spin text-[#8b2408]"
            />
          </div>
        ) : filteredEmployees.length ===
          0 ? (
          <div className="flex h-32 items-center justify-center">
            <p className="text-[9px] text-slate-500">
              Shaqaale lama helin.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#f0e4df]">
            {filteredEmployees.map(
              (employee) => (
                <div
                  key={employee.id}
                  className="grid items-center gap-2 px-3 py-2 transition hover:bg-[#fffaf8] sm:grid-cols-[1.4fr_1fr_1fr_0.8fr_0.7fr]"
                >
                  {/* Employee */}
                  <div className="flex min-w-0 items-center gap-2">
                    {employee.picture_url ? (
                      <img
                        src={employee.picture_url}
                        alt={employee.full_name}
                        className="size-7 shrink-0 rounded-md object-cover"
                      />
                    ) : (
                      <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-[#fff0eb] text-[#8b2408]">
                        <UserRound size={13} />
                      </div>
                    )}

                    <div className="min-w-0">
                      <p className="truncate text-[10px] font-black text-[#30201a]">
                        {employee.full_name}
                      </p>

                      <p className="text-[8px] text-slate-400">
                        ID #{employee.id}
                      </p>
                    </div>
                  </div>

                  {/* Role */}
                  <div>
                    <p className="text-[8px] text-slate-400">
                      Shaqada
                    </p>

                    <p className="text-[9px] font-bold text-[#51433e]">
                      {employee.role}
                    </p>
                  </div>

                  {/* Phone */}
                  <div>
                    <p className="text-[8px] text-slate-400">
                      Telephone
                    </p>

                    <p className="text-[9px] font-bold text-[#51433e]">
                      {employee.phone}
                    </p>
                  </div>

                  {/* Salary */}
                  <div>
                    <p className="text-[8px] text-slate-400">
                      Mushahar
                    </p>

                    <p className="text-[9px] font-black text-[#8b2408]">
                      $
                      {employee.monthly_salary.toFixed(
                        2,
                      )}
                    </p>
                  </div>

                  {/* Status */}
                  <div>
                    <p className="text-[8px] text-slate-400">
                      Status
                    </p>

                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-[8px] font-black ${
                        employee.is_active
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {employee.is_active
                        ? "ACTIVE"
                        : "INACTIVE"}
                    </span>
                  </div>

                  <div className="sm:col-span-5">
                    <p className="text-[8px] text-slate-400">
                      Shaqada bilaabay:{" "}
                      <span className="font-bold text-slate-500">
                        {formatDate(
                          employee.date_of_joining,
                        )}
                      </span>
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

export default EmployeesPage;
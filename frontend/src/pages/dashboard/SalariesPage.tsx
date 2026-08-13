import {
  useMemo,
  useState,
  type FormEvent,
} from "react";

import {
  Banknote,
  Calculator,
  CalendarDays,
  FileText,
  LoaderCircle,
  Plus,
  ReceiptText,
  RefreshCw,
  Search,
  UserRound,
  WalletCards,
  X,
} from "lucide-react";

import { useEmployees } from "../../hooks/school/useEmployees";

import {
  usePaySalary,
  useSalaryHistory,
} from "../../hooks/school/useSalaries";

interface SalaryForm {
  employeeId: string;
  month: string;
  baseSalary: string;
  bonus: string;
  deduction: string;
  paymentMethod: string;
  remarks: string;
}

interface SalaryErrors {
  employeeId?: string;
  month?: string;
  baseSalary?: string;
  bonus?: string;
  deduction?: string;
  paymentMethod?: string;
}

const initialForm: SalaryForm = {
  employeeId: "",
  month: "",
  baseSalary: "",
  bonus: "0",
  deduction: "0",
  paymentMethod: "ZAAD",
  remarks: "",
};

function formatAmount(value: number) {
  return Number(value || 0).toFixed(2);
}

function formatDate(value: string) {
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

function SalariesPage() {
  const employeesQuery = useEmployees();
  const salariesQuery = useSalaryHistory();

  const paySalaryMutation = usePaySalary();

  const [showForm, setShowForm] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [
    employeeFilter,
    setEmployeeFilter,
  ] = useState("");

  const [form, setForm] =
    useState<SalaryForm>(initialForm);

  const [errors, setErrors] =
    useState<SalaryErrors>({});

  const employees =
    employeesQuery.data ?? [];

  const salaries =
    salariesQuery.data ?? [];

  const selectedEmployee =
    employees.find(
      (employee) =>
        employee.id ===
        Number(form.employeeId),
    );

  const baseSalary =
    Number(form.baseSalary) || 0;

  const bonus =
    Number(form.bonus) || 0;

  const deduction =
    Number(form.deduction) || 0;

  const estimatedNetSalary =
    baseSalary + bonus - deduction;

  const filteredSalaries = useMemo(() => {
    const value = search
      .trim()
      .toLowerCase();

    return salaries.filter((salary) => {
      const matchesEmployee =
        !employeeFilter ||
        salary.employee_id ===
          Number(employeeFilter);

      const matchesSearch =
        !value ||
        salary.employee?.full_name
          ?.toLowerCase()
          .includes(value) ||
        salary.employee?.phone
          ?.toLowerCase()
          .includes(value) ||
        salary.employee?.role
          ?.toLowerCase()
          .includes(value) ||
        salary.month
          ?.toLowerCase()
          .includes(value) ||
        salary.payment_method
          ?.toLowerCase()
          .includes(value);

      return (
        matchesEmployee &&
        matchesSearch
      );
    });
  }, [
    salaries,
    employeeFilter,
    search,
  ]);

  const updateField = <
    Field extends keyof SalaryForm,
  >(
    field: Field,
    value: SalaryForm[Field],
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

  const handleEmployeeChange = (
    value: string,
  ) => {
    const employee = employees.find(
      (item) =>
        item.id === Number(value),
    );

    setForm((currentForm) => ({
      ...currentForm,
      employeeId: value,
      baseSalary: employee
        ? String(employee.monthly_salary)
        : "",
    }));

    setErrors((currentErrors) => ({
      ...currentErrors,
      employeeId: undefined,
      baseSalary: undefined,
    }));
  };

  const closeForm = () => {
    setShowForm(false);
    setForm(initialForm);
    setErrors({});
  };

  const validateForm =
    (): SalaryErrors => {
      const newErrors: SalaryErrors = {};

      if (!form.employeeId) {
        newErrors.employeeId =
          "Dooro shaqaalaha";
      }

      if (!form.month) {
        newErrors.month =
          "Dooro bisha";
      }

      const salary = Number(
        form.baseSalary,
      );

      if (
        Number.isNaN(salary) ||
        salary <= 0
      ) {
        newErrors.baseSalary =
          "Geli mushahar sax ah";
      }

      const bonusValue = Number(
        form.bonus,
      );

      if (
        Number.isNaN(bonusValue) ||
        bonusValue < 0
      ) {
        newErrors.bonus =
          "Bonus sax ah geli";
      }

      const deductionValue = Number(
        form.deduction,
      );

      if (
        Number.isNaN(deductionValue) ||
        deductionValue < 0
      ) {
        newErrors.deduction =
          "Deduction sax ah geli";
      }

      if (
        !form.paymentMethod.trim()
      ) {
        newErrors.paymentMethod =
          "Geli payment method";
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

    paySalaryMutation.mutate(
      {
        employee_id: Number(
          form.employeeId,
        ),

        month: form.month,

        base_salary: Number(
          form.baseSalary,
        ),

        bonus: Number(form.bonus),

        deduction: Number(
          form.deduction,
        ),

        payment_method:
          form.paymentMethod
            .trim()
            .toUpperCase(),

        remarks:
          form.remarks.trim(),
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
      "outline-none transition",
      "focus:bg-white focus:ring-2",
      hasError
        ? "border-red-400 focus:ring-red-100"
        : "border-[#dfcbc4] focus:border-[#8b2408] focus:ring-orange-100",
    ].join(" ");

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-base font-black text-[#30201a]">
            Mushaharka
          </h1>

          <p className="mt-0.5 text-[9px] text-slate-500">
            Bixi mushaharka shaqaalaha
            oo eeg taariikhda payments-ka.
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
            : "Bixi Mushahar"}
        </button>
      </div>

      {/* Salary form */}
      {showForm && (
        <section className="rounded-xl border border-[#eadbd5] bg-white p-3 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-[#fff0eb] text-[#8b2408]">
              <WalletCards size={15} />
            </div>

            <div>
              <h2 className="text-[11px] font-black text-[#30201a]">
                Bixi Mushaharka
              </h2>

              <p className="text-[8px] text-slate-500">
                Dooro shaqaalaha kadib geli
                faahfaahinta mushaharka.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3"
            noValidate
          >
            {/* Employee */}
            <div>
              <label className="mb-0.5 block text-[9px] font-bold text-[#51433e]">
                Shaqaalaha
              </label>

              <select
                value={form.employeeId}
                onChange={(event) =>
                  handleEmployeeChange(
                    event.target.value,
                  )
                }
                className={`${inputClass(
                  Boolean(
                    errors.employeeId,
                  ),
                )} appearance-none`}
              >
                <option value="">
                  Dooro shaqaalaha
                </option>

                {employees.map(
                  (employee) => (
                    <option
                      key={employee.id}
                      value={employee.id}
                    >
                      {employee.full_name} -{" "}
                      {employee.role}
                    </option>
                  ),
                )}
              </select>

              {errors.employeeId && (
                <p className="mt-0.5 text-[8px] text-red-600">
                  {errors.employeeId}
                </p>
              )}
            </div>

            {/* Month */}
            <div>
              <label className="mb-0.5 block text-[9px] font-bold text-[#51433e]">
                Bisha
              </label>

              <div className="relative">
                <CalendarDays
                  size={13}
                  className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="month"
                  value={form.month}
                  onChange={(event) =>
                    updateField(
                      "month",
                      event.target.value,
                    )
                  }
                  className={`${inputClass(
                    Boolean(errors.month),
                  )} pl-8`}
                />
              </div>

              {errors.month && (
                <p className="mt-0.5 text-[8px] text-red-600">
                  {errors.month}
                </p>
              )}
            </div>

            {/* Base salary */}
            <div>
              <label className="mb-0.5 block text-[9px] font-bold text-[#51433e]">
                Base Salary
              </label>

              <div className="relative">
                <Banknote
                  size={13}
                  className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.baseSalary}
                  onChange={(event) =>
                    updateField(
                      "baseSalary",
                      event.target.value,
                    )
                  }
                  placeholder="450.00"
                  className={`${inputClass(
                    Boolean(
                      errors.baseSalary,
                    ),
                  )} pl-8`}
                />
              </div>

              {errors.baseSalary && (
                <p className="mt-0.5 text-[8px] text-red-600">
                  {errors.baseSalary}
                </p>
              )}
            </div>

            {/* Bonus */}
            <div>
              <label className="mb-0.5 block text-[9px] font-bold text-[#51433e]">
                Bonus
              </label>

              <input
                type="number"
                min="0"
                step="0.01"
                value={form.bonus}
                onChange={(event) =>
                  updateField(
                    "bonus",
                    event.target.value,
                  )
                }
                placeholder="0.00"
                className={inputClass(
                  Boolean(errors.bonus),
                )}
              />

              {errors.bonus && (
                <p className="mt-0.5 text-[8px] text-red-600">
                  {errors.bonus}
                </p>
              )}
            </div>

            {/* Deduction */}
            <div>
              <label className="mb-0.5 block text-[9px] font-bold text-[#51433e]">
                Deduction
              </label>

              <input
                type="number"
                min="0"
                step="0.01"
                value={form.deduction}
                onChange={(event) =>
                  updateField(
                    "deduction",
                    event.target.value,
                  )
                }
                placeholder="0.00"
                className={inputClass(
                  Boolean(
                    errors.deduction,
                  ),
                )}
              />

              {errors.deduction && (
                <p className="mt-0.5 text-[8px] text-red-600">
                  {errors.deduction}
                </p>
              )}
            </div>

            {/* Method */}
            <div>
              <label className="mb-0.5 block text-[9px] font-bold text-[#51433e]">
                Payment Method
              </label>

              <input
                type="text"
                value={form.paymentMethod}
                onChange={(event) =>
                  updateField(
                    "paymentMethod",
                    event.target.value,
                  )
                }
                placeholder="ZAAD"
                className={inputClass(
                  Boolean(
                    errors.paymentMethod,
                  ),
                )}
              />

              {errors.paymentMethod && (
                <p className="mt-0.5 text-[8px] text-red-600">
                  {errors.paymentMethod}
                </p>
              )}
            </div>

            {/* Remarks */}
            <div className="sm:col-span-2">
              <label className="mb-0.5 block text-[9px] font-bold text-[#51433e]">
                Remarks
              </label>

              <div className="relative">
                <FileText
                  size={13}
                  className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={form.remarks}
                  onChange={(event) =>
                    updateField(
                      "remarks",
                      event.target.value,
                    )
                  }
                  placeholder="Mushaharka bisha iyo gunno..."
                  className={`${inputClass(
                    false,
                  )} pl-8`}
                />
              </div>
            </div>

            {/* Net preview */}
            <div>
              <label className="mb-0.5 block text-[9px] font-bold text-[#51433e]">
                Net Salary
              </label>

              <div className="flex h-9 items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3">
                <Calculator
                  size={13}
                  className="text-emerald-700"
                />

                <span className="text-[10px] font-black text-emerald-700">
                  $
                  {formatAmount(
                    estimatedNetSalary,
                  )}
                </span>
              </div>
            </div>

            {/* Employee info */}
            {selectedEmployee && (
              <div className="rounded-lg border border-[#eee1dc] bg-[#fffaf8] p-2.5 sm:col-span-2 lg:col-span-3">
                <div className="grid gap-2 sm:grid-cols-4">
                  <div>
                    <p className="text-[7px] font-bold uppercase text-slate-400">
                      Shaqaalaha
                    </p>

                    <p className="mt-0.5 text-[9px] font-black text-[#30201a]">
                      {
                        selectedEmployee.full_name
                      }
                    </p>
                  </div>

                  <div>
                    <p className="text-[7px] font-bold uppercase text-slate-400">
                      Shaqada
                    </p>

                    <p className="mt-0.5 text-[9px] font-bold text-[#51433e]">
                      {selectedEmployee.role}
                    </p>
                  </div>

                  <div>
                    <p className="text-[7px] font-bold uppercase text-slate-400">
                      Phone
                    </p>

                    <p className="mt-0.5 text-[9px] font-bold text-[#51433e]">
                      {selectedEmployee.phone}
                    </p>
                  </div>

                  <div>
                    <p className="text-[7px] font-bold uppercase text-slate-400">
                      Monthly Salary
                    </p>

                    <p className="mt-0.5 text-[9px] font-black text-[#8b2408]">
                      $
                      {formatAmount(
                        selectedEmployee.monthly_salary,
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-end justify-end gap-2 sm:col-span-2 lg:col-span-3">
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
                  paySalaryMutation.isPending
                }
                className="flex h-8 items-center justify-center gap-1.5 rounded-lg bg-[#8b2408] px-4 text-[9px] font-black text-white transition hover:bg-[#701b05] disabled:opacity-60"
              >
                {paySalaryMutation.isPending ? (
                  <LoaderCircle
                    size={13}
                    className="animate-spin"
                  />
                ) : (
                  <WalletCards size={13} />
                )}

                {paySalaryMutation.isPending
                  ? "Waa la bixinayaa..."
                  : "Bixi Mushaharka"}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* History */}
      <section className="overflow-hidden rounded-xl border border-[#eadbd5] bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#eee1dc] p-3">
          <div>
            <h2 className="text-[11px] font-black text-[#30201a]">
              Salary History
            </h2>

            <p className="text-[8px] text-slate-500">
              Wadarta: {salaries.length}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <select
              value={employeeFilter}
              onChange={(event) =>
                setEmployeeFilter(
                  event.target.value,
                )
              }
              className="h-8 max-w-44 rounded-lg border border-[#dfcbc4] bg-[#fff8f5] px-2 text-[8px] outline-none focus:border-[#8b2408]"
            >
              <option value="">
                Shaqaalaha oo dhan
              </option>

              {employees.map(
                (employee) => (
                  <option
                    key={employee.id}
                    value={employee.id}
                  >
                    {employee.full_name}
                  </option>
                ),
              )}
            </select>

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
                className="h-8 w-36 rounded-lg border border-[#dfcbc4] bg-[#fff8f5] pl-7 pr-2 text-[8px] outline-none focus:border-[#8b2408]"
              />
            </div>

            <button
              type="button"
              onClick={() =>
                salariesQuery.refetch()
              }
              className="flex size-8 items-center justify-center rounded-lg border border-[#dfcbc4] text-[#8b2408]"
              aria-label="Refresh salary history"
            >
              <RefreshCw
                size={12}
                className={
                  salariesQuery.isFetching
                    ? "animate-spin"
                    : ""
                }
              />
            </button>
          </div>
        </div>

        {salariesQuery.isLoading ? (
          <div className="flex h-32 items-center justify-center">
            <LoaderCircle
              size={20}
              className="animate-spin text-[#8b2408]"
            />
          </div>
        ) : filteredSalaries.length === 0 ? (
          <div className="flex h-32 flex-col items-center justify-center">
            <ReceiptText
              size={20}
              className="text-slate-300"
            />

            <p className="mt-1 text-[9px] text-slate-500">
              Salary history lama helin.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop */}
            <div className="hidden md:block">
              <table className="w-full">
                <thead className="bg-[#fff8f5]">
                  <tr>
                    <th className="px-3 py-2 text-left text-[7px] font-black uppercase text-slate-400">
                      Shaqaalaha
                    </th>

                    <th className="px-3 py-2 text-left text-[7px] font-black uppercase text-slate-400">
                      Month
                    </th>

                    <th className="px-3 py-2 text-left text-[7px] font-black uppercase text-slate-400">
                      Base
                    </th>

                    <th className="px-3 py-2 text-left text-[7px] font-black uppercase text-slate-400">
                      Bonus
                    </th>

                    <th className="px-3 py-2 text-left text-[7px] font-black uppercase text-slate-400">
                      Deduction
                    </th>

                    <th className="px-3 py-2 text-left text-[7px] font-black uppercase text-slate-400">
                      Net
                    </th>

                    <th className="px-3 py-2 text-left text-[7px] font-black uppercase text-slate-400">
                      Method
                    </th>

                    <th className="px-3 py-2 text-left text-[7px] font-black uppercase text-slate-400">
                      Paid
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#eee1dc]">
                  {filteredSalaries.map(
                    (salary) => (
                      <tr
                        key={salary.id}
                        className="transition hover:bg-[#fffaf8]"
                      >
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-2">
                            <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-[#fff0eb] text-[#8b2408]">
                              <UserRound
                                size={12}
                              />
                            </div>

                            <div>
                              <p className="text-[8px] font-black text-[#30201a]">
                                {salary.employee
                                  ?.full_name ??
                                  "—"}
                              </p>

                              <p className="text-[7px] text-slate-400">
                                {salary.employee
                                  ?.role ??
                                  "—"}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-3 py-2 text-[8px] font-bold text-[#51433e]">
                          {salary.month}
                        </td>

                        <td className="px-3 py-2 text-[8px] font-bold">
                          $
                          {formatAmount(
                            salary.base_salary,
                          )}
                        </td>

                        <td className="px-3 py-2 text-[8px] font-bold text-emerald-700">
                          +$
                          {formatAmount(
                            salary.bonus,
                          )}
                        </td>

                        <td className="px-3 py-2 text-[8px] font-bold text-red-600">
                          -$
                          {formatAmount(
                            salary.deduction,
                          )}
                        </td>

                        <td className="px-3 py-2">
                          <span className="rounded-md bg-emerald-50 px-2 py-1 text-[8px] font-black text-emerald-700">
                            $
                            {formatAmount(
                              salary.net_salary,
                            )}
                          </span>
                        </td>

                        <td className="px-3 py-2 text-[8px] font-bold">
                          {
                            salary.payment_method
                          }
                        </td>

                        <td className="px-3 py-2">
                          <p className="text-[8px] font-bold">
                            {formatDate(
                              salary.paid_at,
                            )}
                          </p>

                          {salary.remarks && (
                            <p className="mt-0.5 max-w-32 truncate text-[7px] text-slate-400">
                              {
                                salary.remarks
                              }
                            </p>
                          )}
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile */}
            <div className="divide-y divide-[#eee1dc] md:hidden">
              {filteredSalaries.map(
                (salary) => (
                  <div
                    key={salary.id}
                    className="p-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-[9px] font-black text-[#30201a]">
                          {salary.employee
                            ?.full_name ??
                            "—"}
                        </p>

                        <p className="mt-0.5 text-[7px] text-slate-400">
                          {salary.month} •{" "}
                          {salary.employee
                            ?.role ?? "—"}
                        </p>
                      </div>

                      <span className="rounded-md bg-emerald-50 px-2 py-1 text-[8px] font-black text-emerald-700">
                        $
                        {formatAmount(
                          salary.net_salary,
                        )}
                      </span>
                    </div>

                    <div className="mt-2 grid grid-cols-3 gap-2">
                      <div>
                        <p className="text-[7px] text-slate-400">
                          Base
                        </p>

                        <p className="text-[8px] font-bold">
                          $
                          {formatAmount(
                            salary.base_salary,
                          )}
                        </p>
                      </div>

                      <div>
                        <p className="text-[7px] text-slate-400">
                          Bonus
                        </p>

                        <p className="text-[8px] font-bold text-emerald-700">
                          +$
                          {formatAmount(
                            salary.bonus,
                          )}
                        </p>
                      </div>

                      <div>
                        <p className="text-[7px] text-slate-400">
                          Deduction
                        </p>

                        <p className="text-[8px] font-bold text-red-600">
                          -$
                          {formatAmount(
                            salary.deduction,
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="mt-2 flex items-center justify-between gap-2 border-t border-[#eee1dc] pt-2">
                      <p className="text-[7px] text-slate-400">
                        {
                          salary.payment_method
                        }{" "}
                        •{" "}
                        {formatDate(
                          salary.paid_at,
                        )}
                      </p>

                      {salary.remarks && (
                        <p className="max-w-40 truncate text-[7px] text-slate-500">
                          {
                            salary.remarks
                          }
                        </p>
                      )}
                    </div>
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

export default SalariesPage;
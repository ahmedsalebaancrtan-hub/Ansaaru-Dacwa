import {
  useMemo,
  useState,
  type FormEvent,
} from "react";

import {
  Banknote,
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

import { useStudents } from "../../hooks/school/useStudents";

import {
  usePayStudentFee,
  useStudentFeePayments,
} from "../../hooks/school/useStudentFees";

interface FeeForm {
  studentId: string;
  amountPaid: string;
  monthFor: string;
  paymentMethod: string;
  note: string;
}

interface FeeErrors {
  studentId?: string;
  amountPaid?: string;
  monthFor?: string;
  paymentMethod?: string;
}

const initialForm: FeeForm = {
  studentId: "",
  amountPaid: "",
  monthFor: "",
  paymentMethod: "ZAAD",
  note: "",
};

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

function formatAmount(value: number) {
  return Number(value || 0).toFixed(2);
}

function StudentFeesPage() {
  const studentsQuery = useStudents();

  const paymentsQuery =
    useStudentFeePayments();

  const payFeeMutation =
    usePayStudentFee();

  const [showForm, setShowForm] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [studentFilter, setStudentFilter] =
    useState("");

  const [form, setForm] =
    useState<FeeForm>(initialForm);

  const [errors, setErrors] =
    useState<FeeErrors>({});

  const students =
    studentsQuery.data ?? [];

  const payments =
    paymentsQuery.data ?? [];

  const selectedStudent =
    students.find(
      (student) =>
        student.id ===
        Number(form.studentId),
    );

  const filteredPayments = useMemo(() => {
    const value = search
      .trim()
      .toLowerCase();

    return payments.filter((payment) => {
      const matchesStudent =
        !studentFilter ||
        payment.student_id ===
          Number(studentFilter);

      const matchesSearch =
        !value ||
        payment.receipt_no
          ?.toLowerCase()
          .includes(value) ||
        payment.student?.full_name
          ?.toLowerCase()
          .includes(value) ||
        payment.student?.student_code
          ?.toLowerCase()
          .includes(value) ||
        payment.month_for
          ?.toLowerCase()
          .includes(value);

      return (
        matchesStudent &&
        matchesSearch
      );
    });
  }, [
    payments,
    search,
    studentFilter,
  ]);

  const updateField = <
    Field extends keyof FeeForm,
  >(
    field: Field,
    value: FeeForm[Field],
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
    (): FeeErrors => {
      const newErrors: FeeErrors = {};

      if (!form.studentId) {
        newErrors.studentId =
          "Dooro ardayga";
      }

      const amount = Number(
        form.amountPaid,
      );

      if (
        Number.isNaN(amount) ||
        amount <= 0
      ) {
        newErrors.amountPaid =
          "Geli lacag sax ah";
      }

      if (!form.monthFor.trim()) {
        newErrors.monthFor =
          "Geli bisha lacagta";
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

    payFeeMutation.mutate(
      {
        student_id: Number(
          form.studentId,
        ),

        amount_paid: Number(
          form.amountPaid,
        ),

        month_for:
          form.monthFor.trim(),

        payment_method:
          form.paymentMethod
            .trim()
            .toUpperCase(),

        note: form.note.trim(),
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
            Lacagaha Ardayda
          </h1>

          <p className="mt-0.5 text-[9px] text-slate-500">
            Diiwaangeli lacagaha ardayda
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
            : "Bixi Lacag"}
        </button>
      </div>

      {/* Payment form */}
      {showForm && (
        <section className="rounded-xl border border-[#eadbd5] bg-white p-3 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-[#fff0eb] text-[#8b2408]">
              <WalletCards size={15} />
            </div>

            <div>
              <h2 className="text-[11px] font-black text-[#30201a]">
                Diiwaangeli Lacag
              </h2>

              <p className="text-[8px] text-slate-500">
                Dooro ardayga kadib geli
                payment-ka.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3"
            noValidate
          >
            {/* Student */}
            <div>
              <label className="mb-0.5 block text-[9px] font-bold text-[#51433e]">
                Ardayga
              </label>

              <select
                value={form.studentId}
                onChange={(event) =>
                  updateField(
                    "studentId",
                    event.target.value,
                  )
                }
                className={`${inputClass(
                  Boolean(errors.studentId),
                )} appearance-none`}
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

              {errors.studentId && (
                <p className="mt-0.5 text-[8px] text-red-600">
                  {errors.studentId}
                </p>
              )}
            </div>

            {/* Amount */}
            <div>
              <label className="mb-0.5 block text-[9px] font-bold text-[#51433e]">
                Lacagta La Bixiyay
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
                  value={form.amountPaid}
                  onChange={(event) =>
                    updateField(
                      "amountPaid",
                      event.target.value,
                    )
                  }
                  placeholder="50.00"
                  className={`${inputClass(
                    Boolean(
                      errors.amountPaid,
                    ),
                  )} pl-8`}
                />
              </div>

              {errors.amountPaid && (
                <p className="mt-0.5 text-[8px] text-red-600">
                  {errors.amountPaid}
                </p>
              )}
            </div>

            {/* Month */}
            <div>
              <label className="mb-0.5 block text-[9px] font-bold text-[#51433e]">
                Bisha
              </label>

              <input
                type="text"
                value={form.monthFor}
                onChange={(event) =>
                  updateField(
                    "monthFor",
                    event.target.value,
                  )
                }
                placeholder="August 2026"
                className={inputClass(
                  Boolean(errors.monthFor),
                )}
              />

              {errors.monthFor && (
                <p className="mt-0.5 text-[8px] text-red-600">
                  {errors.monthFor}
                </p>
              )}
            </div>

            {/* Payment method */}
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

            {/* Note */}
            <div className="lg:col-span-2">
              <label className="mb-0.5 block text-[9px] font-bold text-[#51433e]">
                Note
              </label>

              <div className="relative">
                <FileText
                  size={13}
                  className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={form.note}
                  onChange={(event) =>
                    updateField(
                      "note",
                      event.target.value,
                    )
                  }
                  placeholder="Kharashka waxbarashada..."
                  className={`${inputClass(
                    false,
                  )} pl-8`}
                />
              </div>
            </div>

            {/* Student info */}
            {selectedStudent && (
              <div className="rounded-lg border border-[#eee1dc] bg-[#fffaf8] p-2.5 sm:col-span-2 lg:col-span-3">
                <div className="grid gap-2 sm:grid-cols-3">
                  <div>
                    <p className="text-[7px] font-bold uppercase text-slate-400">
                      Ardayga
                    </p>

                    <p className="mt-0.5 text-[9px] font-black text-[#30201a]">
                      {selectedStudent.full_name}
                    </p>
                  </div>

                  <div>
                    <p className="text-[7px] font-bold uppercase text-slate-400">
                      Fasalka
                    </p>

                    <p className="mt-0.5 text-[9px] font-black text-[#30201a]">
                      {selectedStudent.class
                        ?.title ?? "—"}
                    </p>
                  </div>

                  <div>
                    <p className="text-[7px] font-bold uppercase text-slate-400">
                      Discount
                    </p>

                    <p className="mt-0.5 text-[9px] font-black text-[#8b2408]">
                      {selectedStudent.discount_fee ??
                        0}
                      %
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
                  payFeeMutation.isPending
                }
                className="flex h-8 items-center justify-center gap-1.5 rounded-lg bg-[#8b2408] px-4 text-[9px] font-black text-white transition hover:bg-[#701b05] disabled:opacity-60"
              >
                {payFeeMutation.isPending ? (
                  <LoaderCircle
                    size={13}
                    className="animate-spin"
                  />
                ) : (
                  <WalletCards size={13} />
                )}

                {payFeeMutation.isPending
                  ? "Waa la kaydinayaa..."
                  : "Kaydi Payment"}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Payment history */}
      <section className="overflow-hidden rounded-xl border border-[#eadbd5] bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#eee1dc] p-3">
          <div>
            <h2 className="text-[11px] font-black text-[#30201a]">
              Payment History
            </h2>

            <p className="text-[8px] text-slate-500">
              Wadarta: {payments.length}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <select
              value={studentFilter}
              onChange={(event) =>
                setStudentFilter(
                  event.target.value,
                )
              }
              className="h-8 max-w-44 rounded-lg border border-[#dfcbc4] bg-[#fff8f5] px-2 text-[8px] outline-none focus:border-[#8b2408]"
            >
              <option value="">
                Ardayda oo dhan
              </option>

              {students.map(
                (student) => (
                  <option
                    key={student.id}
                    value={student.id}
                  >
                    {student.full_name}
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
                paymentsQuery.refetch()
              }
              className="flex size-8 items-center justify-center rounded-lg border border-[#dfcbc4] text-[#8b2408]"
            >
              <RefreshCw
                size={12}
                className={
                  paymentsQuery.isFetching
                    ? "animate-spin"
                    : ""
                }
              />
            </button>
          </div>
        </div>

        {paymentsQuery.isLoading ? (
          <div className="flex h-32 items-center justify-center">
            <LoaderCircle
              size={20}
              className="animate-spin text-[#8b2408]"
            />
          </div>
        ) : filteredPayments.length ===
          0 ? (
          <div className="flex h-32 flex-col items-center justify-center">
            <ReceiptText
              size={20}
              className="text-slate-300"
            />

            <p className="mt-1 text-[9px] text-slate-500">
              Payments lama helin.
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
                      Receipt
                    </th>

                    <th className="px-3 py-2 text-left text-[7px] font-black uppercase text-slate-400">
                      Ardayga
                    </th>

                    <th className="px-3 py-2 text-left text-[7px] font-black uppercase text-slate-400">
                      Bisha
                    </th>

                    <th className="px-3 py-2 text-left text-[7px] font-black uppercase text-slate-400">
                      Amount
                    </th>

                    <th className="px-3 py-2 text-left text-[7px] font-black uppercase text-slate-400">
                      Discount
                    </th>

                    <th className="px-3 py-2 text-left text-[7px] font-black uppercase text-slate-400">
                      Method
                    </th>

                    <th className="px-3 py-2 text-left text-[7px] font-black uppercase text-slate-400">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#eee1dc]">
                  {filteredPayments.map(
                    (payment) => (
                      <tr
                        key={payment.id}
                        className="transition hover:bg-[#fffaf8]"
                      >
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-1.5">
                            <ReceiptText
                              size={11}
                              className="text-[#8b2408]"
                            />

                            <div>
                              <p className="text-[8px] font-black text-[#30201a]">
                                {payment.receipt_no}
                              </p>

                              <p className="text-[7px] text-slate-400">
                                {formatDate(
                                  payment.created_at,
                                )}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-3 py-2">
                          <div className="flex items-center gap-1.5">
                            <UserRound
                              size={11}
                              className="text-slate-400"
                            />

                            <div>
                              <p className="text-[8px] font-black text-[#30201a]">
                                {payment.student
                                  ?.full_name ??
                                  "—"}
                              </p>

                              <p className="text-[7px] text-slate-400">
                                {payment.student
                                  ?.student_code ??
                                  "—"}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-3 py-2 text-[8px] font-bold text-[#51433e]">
                          {payment.month_for}
                        </td>

                        <td className="px-3 py-2 text-[9px] font-black text-[#30201a]">
                          {formatAmount(
                            payment.amount_paid,
                          )}
                        </td>

                        <td className="px-3 py-2">
                          <span className="rounded-md bg-orange-50 px-2 py-1 text-[8px] font-black text-[#8b2408]">
                            {payment.discount}%
                          </span>
                        </td>

                        <td className="px-3 py-2 text-[8px] font-bold text-[#51433e]">
                          {payment.payment_method}
                        </td>

                        <td className="px-3 py-2">
                          <span
                            className={`rounded-full px-2 py-1 text-[7px] font-black ${
                              payment.status ===
                              "PAID"
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {payment.status}
                          </span>
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile */}
            <div className="divide-y divide-[#eee1dc] md:hidden">
              {filteredPayments.map(
                (payment) => (
                  <div
                    key={payment.id}
                    className="p-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-[9px] font-black text-[#30201a]">
                          {payment.student
                            ?.full_name ??
                            "—"}
                        </p>

                        <p className="mt-0.5 text-[7px] text-slate-400">
                          {payment.receipt_no}
                        </p>
                      </div>

                      <span className="rounded-full bg-emerald-50 px-2 py-1 text-[7px] font-black text-emerald-700">
                        {payment.status}
                      </span>
                    </div>

                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-[7px] text-slate-400">
                          Bisha
                        </p>

                        <p className="text-[8px] font-bold">
                          {payment.month_for}
                        </p>
                      </div>

                      <div>
                        <p className="text-[7px] text-slate-400">
                          Amount
                        </p>

                        <p className="text-[9px] font-black text-[#8b2408]">
                          {formatAmount(
                            payment.amount_paid,
                          )}
                        </p>
                      </div>

                      <div>
                        <p className="text-[7px] text-slate-400">
                          Discount
                        </p>

                        <p className="text-[8px] font-bold">
                          {payment.discount}%
                        </p>
                      </div>

                      <div>
                        <p className="text-[7px] text-slate-400">
                          Method
                        </p>

                        <p className="text-[8px] font-bold">
                          {
                            payment.payment_method
                          }
                        </p>
                      </div>
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

export default StudentFeesPage;
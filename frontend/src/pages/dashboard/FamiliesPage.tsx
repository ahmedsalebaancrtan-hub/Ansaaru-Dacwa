import {
  useMemo,
  useState,
  type FormEvent,
} from "react";

import {
  AlertCircle,
  Home,
  LoaderCircle,
  MapPin,
  Phone,
  Plus,
  RefreshCw,
  Search,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";

import {
  useCreateFamily,
  useFamilies,
} from "../../hooks/school/useFamilies";

interface FamilyForm {
  familyName: string;
  parentOneName: string;
  parentOnePhone: string;
  parentTwoName: string;
  parentTwoPhone: string;
  address: string;
}

interface FamilyFormErrors {
  familyName?: string;
  parentOneName?: string;
  parentOnePhone?: string;
  parentTwoPhone?: string;
  address?: string;
}

const initialForm: FamilyForm = {
  familyName: "",
  parentOneName: "",
  parentOnePhone: "",
  parentTwoName: "",
  parentTwoPhone: "",
  address: "",
};

function isValidPhoneNumber(value: string): boolean {
  return /^\+?[0-9]{7,15}$/.test(
    value.replaceAll(" ", ""),
  );
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

function FamiliesPage() {
  const familiesQuery = useFamilies();
  const createFamilyMutation =
    useCreateFamily();

  const [searchValue, setSearchValue] =
    useState("");

  const [showCreateForm, setShowCreateForm] =
    useState(false);

  const [form, setForm] =
    useState<FamilyForm>(initialForm);

  const [errors, setErrors] =
    useState<FamilyFormErrors>({});

  const families = familiesQuery.data ?? [];

  const filteredFamilies = useMemo(() => {
    const searchTerm = searchValue
      .trim()
      .toLowerCase();

    if (!searchTerm) {
      return families;
    }

    return families.filter((family) => {
      return (
        family.familyName
          .toLowerCase()
          .includes(searchTerm) ||
        family.Parent_one_Name
          .toLowerCase()
          .includes(searchTerm) ||
        family.parent_one_phone
          .toLowerCase()
          .includes(searchTerm) ||
        family.address
          .toLowerCase()
          .includes(searchTerm)
      );
    });
  }, [families, searchValue]);

  const updateField = <
    Field extends keyof FamilyForm,
  >(
    field: Field,
    value: FamilyForm[Field],
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
    (): FamilyFormErrors => {
      const newErrors: FamilyFormErrors = {};

      if (form.familyName.trim().length < 2) {
        newErrors.familyName =
          "Magaca qoyska waa required";
      }

      if (
        form.parentOneName.trim().length < 2
      ) {
        newErrors.parentOneName =
          "Magaca waalidka koowaad waa required";
      }

      if (
        !isValidPhoneNumber(
          form.parentOnePhone,
        )
      ) {
        newErrors.parentOnePhone =
          "Geli telefoon sax ah";
      }

      if (
        form.parentTwoPhone.trim() &&
        !isValidPhoneNumber(
          form.parentTwoPhone,
        )
      ) {
        newErrors.parentTwoPhone =
          "Geli telefoon sax ah";
      }

      if (form.address.trim().length < 2) {
        newErrors.address =
          "Cinwaanka qoyska waa required";
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

    createFamilyMutation.mutate(
      {
        familyName: form.familyName.trim(),
        Parent_one_Name:
          form.parentOneName.trim(),
        parent_one_phone:
          form.parentOnePhone
            .replaceAll(" ", "")
            .trim(),
        Parent_two_name:
          form.parentTwoName.trim(),
        Parent_two_phone:
          form.parentTwoPhone
            .replaceAll(" ", "")
            .trim(),
        address: form.address.trim(),
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
            Qoysaska
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Maamul qoysaska iyo xogta
            waalidiinta ardayda.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            setShowCreateForm(
              (current) => !current,
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
            : "Qoys Cusub"}
        </button>
      </section>

      {/* Create family form */}
      {showCreateForm && (
        <section className="rounded-2xl border border-[#eadbd5] bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-[#fff0eb] text-[#8b2408]">
              <UsersRound size={22} />
            </div>

            <div>
              <h2 className="font-black text-[#30201a]">
                Samee Qoys Cusub
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Geli xogta qoyska iyo
                waalidiinta.
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
                htmlFor="family-name"
                className="mb-2 block text-sm font-bold text-[#51433e]"
              >
                Magaca Qoyska
              </label>

              <div className="relative">
                <Home
                  size={20}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#99847c]"
                />

                <input
                  id="family-name"
                  value={form.familyName}
                  onChange={(event) =>
                    updateField(
                      "familyName",
                      event.target.value,
                    )
                  }
                  placeholder="Tusaale: Reer Ahmed"
                  className={`h-12 w-full rounded-xl border bg-[#fff8f5] pl-12 pr-4 outline-none transition focus:bg-white focus:ring-4 ${
                    errors.familyName
                      ? "border-red-400 focus:ring-red-100"
                      : "border-[#dfcbc4] focus:border-[#8b2408] focus:ring-orange-100"
                  }`}
                />
              </div>

              {errors.familyName && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.familyName}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="address"
                className="mb-2 block text-sm font-bold text-[#51433e]"
              >
                Cinwaanka
              </label>

              <div className="relative">
                <MapPin
                  size={20}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#99847c]"
                />

                <input
                  id="address"
                  value={form.address}
                  onChange={(event) =>
                    updateField(
                      "address",
                      event.target.value,
                    )
                  }
                  placeholder="Tusaale: Hargeisa"
                  className={`h-12 w-full rounded-xl border bg-[#fff8f5] pl-12 pr-4 outline-none transition focus:bg-white focus:ring-4 ${
                    errors.address
                      ? "border-red-400 focus:ring-red-100"
                      : "border-[#dfcbc4] focus:border-[#8b2408] focus:ring-orange-100"
                  }`}
                />
              </div>

              {errors.address && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.address}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="parent-one-name"
                className="mb-2 block text-sm font-bold text-[#51433e]"
              >
                Waalidka Koowaad
              </label>

              <div className="relative">
                <UserRound
                  size={20}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#99847c]"
                />

                <input
                  id="parent-one-name"
                  value={form.parentOneName}
                  onChange={(event) =>
                    updateField(
                      "parentOneName",
                      event.target.value,
                    )
                  }
                  placeholder="Magaca waalidka koowaad"
                  className={`h-12 w-full rounded-xl border bg-[#fff8f5] pl-12 pr-4 outline-none transition focus:bg-white focus:ring-4 ${
                    errors.parentOneName
                      ? "border-red-400 focus:ring-red-100"
                      : "border-[#dfcbc4] focus:border-[#8b2408] focus:ring-orange-100"
                  }`}
                />
              </div>

              {errors.parentOneName && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.parentOneName}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="parent-one-phone"
                className="mb-2 block text-sm font-bold text-[#51433e]"
              >
                Telefoonka Waalidka Koowaad
              </label>

              <div className="relative">
                <Phone
                  size={20}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#99847c]"
                />

                <input
                  id="parent-one-phone"
                  type="tel"
                  value={form.parentOnePhone}
                  onChange={(event) =>
                    updateField(
                      "parentOnePhone",
                      event.target.value,
                    )
                  }
                  placeholder="+252633306376"
                  className={`h-12 w-full rounded-xl border bg-[#fff8f5] pl-12 pr-4 outline-none transition focus:bg-white focus:ring-4 ${
                    errors.parentOnePhone
                      ? "border-red-400 focus:ring-red-100"
                      : "border-[#dfcbc4] focus:border-[#8b2408] focus:ring-orange-100"
                  }`}
                />
              </div>

              {errors.parentOnePhone && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.parentOnePhone}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="parent-two-name"
                className="mb-2 block text-sm font-bold text-[#51433e]"
              >
                Waalidka Labaad
              </label>

              <div className="relative">
                <UserRound
                  size={20}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#99847c]"
                />

                <input
                  id="parent-two-name"
                  value={form.parentTwoName}
                  onChange={(event) =>
                    updateField(
                      "parentTwoName",
                      event.target.value,
                    )
                  }
                  placeholder="Magaca waalidka labaad"
                  className="h-12 w-full rounded-xl border border-[#dfcbc4] bg-[#fff8f5] pl-12 pr-4 outline-none transition focus:border-[#8b2408] focus:bg-white focus:ring-4 focus:ring-orange-100"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="parent-two-phone"
                className="mb-2 block text-sm font-bold text-[#51433e]"
              >
                Telefoonka Waalidka Labaad
              </label>

              <div className="relative">
                <Phone
                  size={20}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#99847c]"
                />

                <input
                  id="parent-two-phone"
                  type="tel"
                  value={form.parentTwoPhone}
                  onChange={(event) =>
                    updateField(
                      "parentTwoPhone",
                      event.target.value,
                    )
                  }
                  placeholder="+252633306376"
                  className={`h-12 w-full rounded-xl border bg-[#fff8f5] pl-12 pr-4 outline-none transition focus:bg-white focus:ring-4 ${
                    errors.parentTwoPhone
                      ? "border-red-400 focus:ring-red-100"
                      : "border-[#dfcbc4] focus:border-[#8b2408] focus:ring-orange-100"
                  }`}
                />
              </div>

              {errors.parentTwoPhone && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.parentTwoPhone}
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
                disabled={
                  createFamilyMutation.isPending
                }
                className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[#8b2408] px-6 font-black text-white transition hover:bg-[#701b05] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {createFamilyMutation.isPending ? (
                  <LoaderCircle
                    size={19}
                    className="animate-spin"
                  />
                ) : (
                  <Plus size={19} />
                )}

                Kaydi Qoyska
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Families list */}
      <section className="overflow-hidden rounded-2xl border border-[#eadbd5] bg-white shadow-sm">
        <header className="flex flex-col gap-4 border-b border-[#eee2dd] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <h2 className="font-black text-[#30201a]">
              Liiska Qoysaska
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Wadarta: {families.length} qoys
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
                  setSearchValue(
                    event.target.value,
                  )
                }
                placeholder="Raadi qoys..."
                className="h-11 w-full rounded-xl border border-[#dfd0ca] bg-[#fffaf8] pl-11 pr-4 text-sm outline-none transition focus:border-[#8b2408] focus:bg-white focus:ring-4 focus:ring-orange-100"
              />
            </div>

            <button
              type="button"
              onClick={() =>
                familiesQuery.refetch()
              }
              disabled={
                familiesQuery.isFetching
              }
              className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-[#dfd0ca] text-[#76564b] transition hover:bg-[#fff0eb] disabled:opacity-60"
              aria-label="Refresh families"
            >
              <RefreshCw
                size={18}
                className={
                  familiesQuery.isFetching
                    ? "animate-spin"
                    : ""
                }
              />
            </button>
          </div>
        </header>

        {familiesQuery.isLoading && (
          <div className="flex min-h-72 items-center justify-center">
            <div className="text-center">
              <LoaderCircle
                size={34}
                className="mx-auto animate-spin text-[#8b2408]"
              />

              <p className="mt-3 text-sm text-slate-500">
                Qoysaska waa la soo qaadayaa...
              </p>
            </div>
          </div>
        )}

        {familiesQuery.isError && (
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
                  familiesQuery.refetch()
                }
                className="mt-4 rounded-xl bg-[#8b2408] px-5 py-2.5 text-sm font-bold text-white"
              >
                Isku day mar kale
              </button>
            </div>
          </div>
        )}

        {!familiesQuery.isLoading &&
          !familiesQuery.isError &&
          filteredFamilies.length === 0 && (
            <div className="flex min-h-72 items-center justify-center p-6 text-center">
              <div>
                <UsersRound
                  size={42}
                  className="mx-auto text-[#b98b7d]"
                />

                <h3 className="mt-4 font-black text-[#30201a]">
                  Qoys lama helin
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Samee qoyska ugu horreeya.
                </p>
              </div>
            </div>
          )}

        {!familiesQuery.isLoading &&
          !familiesQuery.isError &&
          filteredFamilies.length > 0 && (
            <>
              {/* Desktop table */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full">
                  <thead className="bg-[#fff8f5] text-left">
                    <tr>
                      <th className="px-6 py-4 text-xs font-black uppercase tracking-wide text-slate-500">
                        Qoyska
                      </th>

                      <th className="px-6 py-4 text-xs font-black uppercase tracking-wide text-slate-500">
                        Waalidka 1aad
                      </th>

                      <th className="px-6 py-4 text-xs font-black uppercase tracking-wide text-slate-500">
                        Telefoonka 1aad
                      </th>

                      <th className="px-6 py-4 text-xs font-black uppercase tracking-wide text-slate-500">
                        Waalidka 2aad
                      </th>

                      <th className="px-6 py-4 text-xs font-black uppercase tracking-wide text-slate-500">
                        Telefoonka 2aad
                      </th>

                      <th className="px-6 py-4 text-xs font-black uppercase tracking-wide text-slate-500">
                        Cinwaan
                      </th>

                      <th className="px-6 py-4 text-xs font-black uppercase tracking-wide text-slate-500">
                        La Sameeyay
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[#f0e4df]">
                    {filteredFamilies.map(
                      (family) => (
                        <tr
                          key={family.id}
                          className="transition hover:bg-[#fffaf8]"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex size-10 items-center justify-center rounded-xl bg-[#fff0eb] text-[#8b2408]">
                                <UsersRound
                                  size={19}
                                />
                              </div>

                              <div>
                                <p className="font-black text-[#30201a]">
                                  {family.familyName}
                                </p>

                                <p className="mt-1 text-xs text-slate-400">
                                  #{family.id}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-4 text-sm font-semibold text-[#4a3028]">
                            {family.Parent_one_Name}
                          </td>

                          <td className="px-6 py-4 text-sm text-slate-500">
                            {family.parent_one_phone}
                          </td>

                          <td className="px-6 py-4 text-sm font-semibold text-[#4a3028]">
                            {family.Parent_two_name || "—"}
                          </td>

                          <td className="px-6 py-4 text-sm text-slate-500">
                            {family.Parent_two_phone || "—"}
                          </td>

                          <td className="px-6 py-4 text-sm text-slate-500">
                            {family.address}
                          </td>

                          <td className="px-6 py-4 text-sm text-slate-500">
                            {formatDate(
                              family.Createdat,
                            )}
                          </td>
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="space-y-3 p-4 md:hidden">
                {filteredFamilies.map(
                  (family) => (
                    <article
                      key={family.id}
                      className="rounded-xl border border-[#eadbd5] bg-[#fffaf8] p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#fff0eb] text-[#8b2408]">
                          <UsersRound
                            size={21}
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <h3 className="truncate font-black text-[#30201a]">
                            {family.familyName}
                          </h3>

                          <p className="mt-1 text-sm text-slate-500">
                            {
                              family.Parent_one_Name
                            }
                          </p>
                        </div>

                        <span className="text-xs font-bold text-slate-400">
                          #{family.id}
                        </span>
                      </div>

                      <div className="mt-4 grid gap-3 border-t border-[#eadbd5] pt-4 text-sm">
                        <p className="flex items-center gap-2 text-slate-600">
                          <Phone
                            size={16}
                            className="text-[#8b2408]"
                          />
                          <span className="font-bold">1aad:</span>
                          {
                            family.parent_one_phone
                          }
                        </p>

                        {family.Parent_two_name && (
                          <p className="flex items-center gap-2 text-slate-600">
                            <UserRound
                              size={16}
                              className="text-[#8b2408]"
                            />
                            <span className="font-bold">2aad:</span>
                            {
                              family.Parent_two_name
                            }
                          </p>
                        )}

                        {family.Parent_two_phone && (
                          <p className="flex items-center gap-2 text-slate-600">
                            <Phone
                              size={16}
                              className="text-[#8b2408]"
                            />
                            <span className="font-bold">2aad:</span>
                            {
                              family.Parent_two_phone
                            }
                          </p>
                        )}

                        <p className="flex items-center gap-2 text-slate-600">
                          <MapPin
                            size={16}
                            className="text-[#8b2408]"
                          />
                          {family.address}
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

export default FamiliesPage;
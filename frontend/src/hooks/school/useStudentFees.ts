import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import toast from "react-hot-toast";

import {
  getStudentFeePayments,
  payStudentFee,
} from "../../api/school/studentFees.api";

import { getApiErrorMessage } from "../../utils/getApiErrorMessage";

const studentFeesQueryKey = [
  "student-fee-payments",
];

export function useStudentFeePayments() {
  return useQuery({
    queryKey: studentFeesQueryKey,
    queryFn: getStudentFeePayments,
  });
}

export function usePayStudentFee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: payStudentFee,

    onSuccess: async () => {
      toast.success(
        "Lacagta ardayga waa la diiwaangeliyay",
      );

      await queryClient.invalidateQueries({
        queryKey: studentFeesQueryKey,
      });
    },

    onError: (error) => {
      toast.error(
        getApiErrorMessage(
          error,
          "Lacagta ardayga lama kaydin ",
        ),
      );
    },
  });
}
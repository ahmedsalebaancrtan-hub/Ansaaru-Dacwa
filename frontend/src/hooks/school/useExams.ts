import {
  useMutation,
} from "@tanstack/react-query";

import toast from "react-hot-toast";

import {
  createExam,
  getStudentExamReport,
  submitExamMarks,
} from "../../api/school/exams.api";

import { getApiErrorMessage } from "../../utils/getApiErrorMessage";

export function useCreateExam() {
  return useMutation({
    mutationFn: createExam,

    onSuccess: () => {
      toast.success(
        "Imtixaanka waa sameeyay",
      );
    },

    onError: (error) => {
      toast.error(
        getApiErrorMessage(
          error,
          "Imtixaanka lama samayn ",
        ),
      );
    },
  });
}

export function useSubmitExamMarks() {
  return useMutation({
    mutationFn: submitExamMarks,

    onSuccess: () => {
      toast.success(
        "Dhibcaha waa la kaydiyay",
      );
    },

    onError: (error) => {
      toast.error(
        getApiErrorMessage(
          error,
          "Dhibcaha lama kaydin",
        ),
      );
    },
  });
}

export function useStudentExamReport() {
  return useMutation({
    mutationFn: getStudentExamReport,

    onError: (error) => {
      toast.error(
        getApiErrorMessage(
          error,
          "Natiijada ardayga lama helin",
        ),
      );
    },
  });
}
import { api } from "../axiosInstance";

import type {
  CreateFamilyRequest,
  FamiliesApiResponse,
  Family,
  FamilyApiResponse,
} from "../../types/Admin/family.types";

// Haddii backend route-ku ka duwan yahay, halkaan beddel.
const FAMILY_ENDPOINT = "/api/v1/families";

function getErrorMessage(
  response: {
    message?: string;
    messege?: string;
  },
  fallbackMessage: string,
): string {
  return (
    response.message ??
    response.messege ??
    fallbackMessage
  );
}

export async function getFamilies(): Promise<Family[]> {
  const { data: response } =
    await api.get<FamiliesApiResponse>(
      FAMILY_ENDPOINT,
    );

  const requestWasSuccessful =
    response.is_sucess !== false &&
    response.is_success !== false;

  if (!requestWasSuccessful) {
    throw new Error(
      getErrorMessage(
        response,
        "Qoysaska lama soo heli karin",
      ),
    );
  }

  return response.data ?? [];
}

export async function createFamily(
  request: CreateFamilyRequest,
): Promise<Family | null> {
  const { data: response } =
    await api.post<FamilyApiResponse>(
      FAMILY_ENDPOINT,
      request,
    );

  const requestWasSuccessful =
    response.is_sucess !== false &&
    response.is_success !== false;

  if (!requestWasSuccessful) {
    throw new Error(
      getErrorMessage(
        response,
        "Qoyska lama samayn karin",
      ),
    );
  }

  return response.data ?? null;
}
import { api } from "../axiosInstance";

import type {
  CreateFamilyRequest,
  Family,
  FamilyApiResponse,
} from "../../types/Admin/family.types";

// POST /api/family/create  — roles: ADMIN | CASHIER
const FAMILY_CREATE_ENDPOINT = "/api/family/create";

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

const FAMILY_LIST_ENDPOINT = "/api/family/list";

// GET /api/family/list
export async function getFamilies(): Promise<Family[]> {
  const { data: response } = await api.get<{
    data?: Family[];
    is_success?: boolean;
    messege?: string;
    message?: string;
  }>(FAMILY_LIST_ENDPOINT);

  const requestWasSuccessful =
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

// POST /api/family/create
export async function createFamily(
  request: CreateFamilyRequest,
): Promise<Family | null> {
  const { data: response } =
    await api.post<FamilyApiResponse>(
      FAMILY_CREATE_ENDPOINT,
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
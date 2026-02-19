import { useQuery } from "@tanstack/react-query";
import type { SettingsResponse } from "../../types/dtos/settings";
import type { ApiErrorResponse } from "../../types/error";
import settingsService from "../../backend/settings.service";
import { useEffect } from "react";
import toast from "react-hot-toast";

export const SETTINGS_QUERY_KEY = ["settings"] as const;

export const useGetSettings = () => {
  const query = useQuery<SettingsResponse, ApiErrorResponse>({
    queryKey: SETTINGS_QUERY_KEY,
    queryFn: () => settingsService.getSettings(),
  });

  useEffect(() => {
    if (query.isSuccess) {
      toast.success("Settings loaded successfully");
    }
  }, [query.isSuccess]);

  useEffect(() => {
    if (query.isError) {
      toast.error(query.error?.detail ?? "Failed to load settings");
    }
  }, [query.isError, query.error]);

  return query;
};

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { SettingsResponse } from "../../types/dtos/settings";
import type { ApiErrorResponse } from "../../types/error";
import settingsService from "../../backend/settings.service";
import { SETTINGS_QUERY_KEY } from "../querries/useSettingsQuerries";
import toast from "react-hot-toast";

export const useUpdateSettings = () => {
  const queryClient = useQueryClient();

  return useMutation<SettingsResponse, ApiErrorResponse, Partial<SettingsResponse>>({
    mutationFn: (data) => settingsService.patchSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SETTINGS_QUERY_KEY });
      toast.success("Settings updated");
    },
    onError: (error) => {
      toast.error(error?.detail ?? "Failed to update settings");
    },
  });
};

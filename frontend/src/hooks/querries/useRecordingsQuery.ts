import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import toast from "react-hot-toast";
import recordingsService from "../../backend/recordings.service";
import type { Recording } from "../../types/logs";
import type { ApiErrorResponse } from "../../types/error";

export const RECORDINGS_QUERY_KEY = (camera: string) =>
  ["recordings", camera] as const;

export const useGetRecordings = (camera = "front") => {
  const query = useQuery<Recording[], ApiErrorResponse>({
    queryKey: RECORDINGS_QUERY_KEY(camera),
    queryFn: async () => {
      const dtos = await recordingsService.getRecordings(camera);
      return dtos.map((dto) => ({
        id: dto.id,
        camera: dto.camera,
        createdAt: new Date(dto.timestamp),
      }));
    },
    staleTime: 30_000, // treat list as fresh for 30 s
    refetchOnMount: true, // always refetch when the recordings view is opened
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    if (query.isError) {
      toast.error(query.error?.detail ?? "Failed to load recordings");
    }
  }, [query.isError, query.error]);

  return query;
};

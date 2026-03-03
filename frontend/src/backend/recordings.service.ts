import backendService from "./api.service";
import { endpoints } from "./constants";
import type { RecordingDto } from "../types/dtos/recordings";

class RecordingsService {
  async getRecordings(camera = "front"): Promise<RecordingDto[]> {
    const response = await backendService.get<RecordingDto[]>(
      endpoints.recordings,
      { params: { camera } },
    );
    return response.data;
  }

  getRecordingUrl(camera: string, timestamp: Date): string {
    const p = (n: number) => String(n).padStart(2, "0");
    const iso = `${timestamp.getFullYear()}-${p(timestamp.getMonth() + 1)}-${p(timestamp.getDate())}T${p(timestamp.getHours())}:${p(timestamp.getMinutes())}:${p(timestamp.getSeconds())}`;
    // Use mediaUrl (direct HTTPS to backend) to bypass the Vite proxy.
    // The proxy buffers range requests which causes choppy video playback.
    return `${endpoints.mediaUrl}${endpoints.recordingsFile}?camera=${encodeURIComponent(camera)}&timestamp=${encodeURIComponent(iso)}`;
  }
}

export default new RecordingsService();

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

  /**
   * Returns a URL string suitable for use as a <video src>.
   * The browser handles the HTTP request natively (supports range requests for seeking).
   */
  getRecordingUrl(camera: string, timestamp: Date): string {
    const iso = timestamp.toISOString().replace("Z", ""); // backend expects local ISO, not UTC Z
    return `${endpoints.baseUrl}${endpoints.recordingsFile}?camera=${encodeURIComponent(camera)}&timestamp=${encodeURIComponent(iso)}`;
  }
}

export default new RecordingsService();

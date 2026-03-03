const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL ?? "https://localhost:8000";
const STREAMING_URL =
  import.meta.env.VITE_STREAMING_URL ?? "https://localhost:9000";

export const endpoints = {
  // In dev: relative path routed through Vite proxy → http://localhost:8000
  // In production: absolute URL to the deployed backend
  baseUrl: import.meta.env.DEV ? "/api" : BACKEND_URL,

  // Direct HTTPS URL to the backend — used for media (video) requests to
  // bypass the Vite proxy, which buffers range requests and causes slow playback.
  mediaUrl: BACKEND_URL,

  //settings
  settings: "/settings",

  // logs
  logs: "/logs",

  // camera
  camera: "/camera",

  // recordings
  recordings: "/recordings",
  recordingsFile: "/recordings/file",

  //streaming api
  streamingApi: STREAMING_URL,
};

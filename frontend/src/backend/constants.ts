export const endpoints = {
  baseUrl: "/api",

  // Direct HTTPS URL to the backend — used for media (video) requests to
  // bypass the Vite proxy, which buffers range requests and causes slow playback.
  mediaUrl: "https://localhost:8000",

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
  streamingApi: "https://localhost:9000",
};

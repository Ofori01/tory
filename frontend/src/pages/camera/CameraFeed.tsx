import React, { useState, useRef, useEffect } from "react";
import { cn } from "../../lib/utils";
import { CircleX, Info, RefreshCw, AlertCircle } from "lucide-react";
import { ToggleSwitch, ValueDisplay } from "../../components/ui";
import { useWebRTC } from "../../hooks/useWebRTC";

interface CameraFeedProps {
  className?: string;
  cameraLocation: "Front" | "Back";
}

// Signaling server URL - update this based on your setup
const SIGNALING_SERVER_URL =
  import.meta.env.VITE_SIGNALING_SERVER_URL || "https://localhost:9000";

const CameraFeed: React.FC<CameraFeedProps> = ({
  className,
  cameraLocation,
}) => {
  const [isInfoOpen, setInfoOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Convert camera location to ID (front/back)
  const cameraId = cameraLocation.toLowerCase();

  // Use WebRTC hook
  const { remoteStream, state, error, cameraStatus, reconnect, isLoading } =
    useWebRTC({
      cameraId,
      signalingServerUrl: SIGNALING_SERVER_URL,
      autoConnect: true,
    });

  const isOnline = cameraStatus?.online ?? false;
  const isCameraConnected = state === "connected" && remoteStream !== null;

  // Update video element when stream changes or video element becomes available
  useEffect(() => {
    console.log(
      "🎬 useEffect triggered, videoRef:",
      !!videoRef.current,
      "remoteStream:",
      !!remoteStream,
      "isCameraConnected:",
      isCameraConnected,
    );

    if (videoRef.current && remoteStream) {
      console.log(
        "🎬 Setting video srcObject, tracks:",
        remoteStream.getTracks().map((t) => ({
          kind: t.kind,
          enabled: t.enabled,
          muted: t.muted,
          readyState: t.readyState,
        })),
      );

      videoRef.current.srcObject = remoteStream;

      // Listen for track unmute events
      remoteStream.getTracks().forEach((track) => {
        track.onunmute = () => {
          console.log("🔊 Track unmuted:", track.kind);
          videoRef.current?.play().catch((err) => {
            console.warn("Video play failed on unmute:", err);
          });
        };
        track.onmute = () => {
          console.log("🔇 Track muted:", track.kind);
        };
        track.onended = () => {
          console.log("⏹️ Track ended:", track.kind);
        };
      });

      // Ensure video plays (handle autoplay restrictions)
      videoRef.current.play().catch((err) => {
        console.warn("Video autoplay failed:", err);
      });
    } else {
      console.log("🎬 Cannot set srcObject - missing video or stream");
    }
  }, [remoteStream, isCameraConnected]);

  return (
    <div
      className={cn(
        "rounded-lg relative border h-120 w-full border-black/50 overflow-hidden",
        className,
      )}
    >
      {/* Feed header */}
      <div className="relative top-1 bg-transparent z-10 flex flex-row justify-between items-center px-2">
        <div className="ml-1 flex flex-row items-center gap-2.5">
          <p className="text-white drop-shadow-lg font-medium">
            {cameraLocation}
          </p>
          <div
            className={cn(
              "rounded-sm backdrop-blur-lg inline-flex items-center gap-2 p-1",
              isCameraConnected ? "bg-black/20" : "bg-black/40",
            )}
          >
            {/* Status dot */}
            <div
              className={cn(
                "rounded-full h-2 w-2",
                isCameraConnected ? "bg-red-500 animate-pulse" : "bg-gray-400",
              )}
            ></div>
            <p className="tracking-wide text-white text-xs">
              {isCameraConnected
                ? "Live Feed"
                : isOnline
                  ? "Connecting..."
                  : "Offline"}
            </p>
          </div>
        </div>
        <div className="relative">
          <Info
            className="size-5 text-white drop-shadow-lg cursor-pointer hover:text-primary transition-colors"
            onClick={() => setInfoOpen(!isInfoOpen)}
          />
          {/* Info modal */}
          <div
            className={cn(
              "absolute top-6 right-0 flex flex-col gap-1 backdrop-blur-md bg-black/80 rounded-md w-72 transition-opacity ease-in-out duration-300 p-2",
              isInfoOpen ? "opacity-100 visible" : "opacity-0 invisible",
            )}
          >
            <div className="inline-flex justify-between items-center px-2">
              <h3 className="tracking-wide text-[12px] text-white font-semibold">
                Info
              </h3>
              <CircleX
                className="size-3.5 cursor-pointer text-white hover:text-red-400"
                onClick={() => setInfoOpen(!isInfoOpen)}
              />
            </div>

            <hr className="bg-gray-600 h-0.5 border-none" />

            <div className="inline-flex justify-between items-center px-2 py-1">
              <p className="tracking-wide text-[12px] text-white">
                Camera Online
              </p>
              <ToggleSwitch checked={isOnline} onChange={() => {}} />
            </div>

            <div className="inline-flex justify-between items-center px-2 py-1">
              <p className="tracking-wide text-[12px] text-white">Viewers</p>
              <ValueDisplay value={cameraStatus?.viewers?.toString() || "0"} />
            </div>

            <div className="inline-flex justify-between items-center px-2 py-1">
              <p className="tracking-wide text-[12px] text-white">Status</p>
              <span className="text-xs text-gray-300 capitalize">{state}</span>
            </div>

            {error && (
              <div className="px-2 py-1">
                <p className="text-[11px] text-red-400">{error}</p>
                <button
                  onClick={() => reconnect()}
                  className="text-[11px] text-blue-400 hover:text-blue-300 mt-1 flex items-center gap-1"
                >
                  <RefreshCw className="size-3" />
                  Reconnect
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Video feed */}
      <div className="absolute inset-0 bg-gray-900 h-full w-full">
        {isCameraConnected ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
            onLoadedMetadata={(e) =>
              console.log(
                "📺 Video metadata loaded",
                e.currentTarget.videoWidth,
                e.currentTarget.videoHeight,
              )
            }
            onCanPlay={() => console.log("📺 Video can play")}
            onPlaying={() => console.log("📺 Video is playing")}
            onWaiting={() => console.log("📺 Video is waiting for data")}
            onError={(e) => console.error("📺 Video error:", e)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-white">
            {isLoading ? (
              <>
                <RefreshCw className="size-12 animate-spin text-primary mb-4" />
                <p className="text-lg">Connecting to camera...</p>
              </>
            ) : !isOnline ? (
              <>
                <AlertCircle className="size-12 text-yellow-500 mb-4" />
                <p className="text-lg font-semibold">Camera Offline</p>
                <p className="text-sm text-gray-400 mt-2 text-center px-4">
                  Open the camera client on another device to start streaming
                </p>
                <a
                  href={`${SIGNALING_SERVER_URL}/camera-client.html`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 px-4 py-2 bg-primary rounded-lg hover:bg-primary/90 transition-colors text-sm"
                >
                  Open Camera Client
                </a>
              </>
            ) : error ? (
              <>
                <AlertCircle className="size-12 text-red-500 mb-4" />
                <p className="text-lg font-semibold">Connection Error</p>
                <p className="text-sm text-gray-400 mt-2">{error}</p>
                <button
                  onClick={() => reconnect()}
                  className="mt-4 px-4 py-2 bg-primary rounded-lg hover:bg-primary/90 transition-colors text-sm flex items-center gap-2"
                >
                  <RefreshCw className="size-4" />
                  Retry Connection
                </button>
              </>
            ) : (
              <>
                <RefreshCw className="size-12 animate-spin text-primary mb-4" />
                <p className="text-lg">Waiting for stream...</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CameraFeed;

/**
 * WebRTC Hook
 * Manages WebRTC peer connection for viewing camera streams
 */

import { useState, useEffect, useRef, useCallback } from "react";
import signalingService, {
  type CameraStatus,
} from "../backend/signaling.service";

export type WebRTCState =
  | "idle"
  | "connecting"
  | "connected"
  | "disconnected"
  | "error";

interface UseWebRTCOptions {
  cameraId: string;
  signalingServerUrl: string;
  autoConnect?: boolean;
}

interface UseWebRTCReturn {
  remoteStream: MediaStream | null;
  state: WebRTCState;
  error: string | null;
  cameraStatus: CameraStatus | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  reconnect: () => Promise<void>;
  isLoading: boolean;
}

const configuration: RTCConfiguration = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
  ],
};

export const useWebRTC = ({
  cameraId,
  signalingServerUrl,
  autoConnect = true,
}: UseWebRTCOptions): UseWebRTCReturn => {
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [state, setState] = useState<WebRTCState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [cameraStatus, setCameraStatus] = useState<CameraStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const cameraSocketIdRef = useRef<string | null>(null);
  const isConnectingRef = useRef(false);
  const hasSetupListenersRef = useRef(false);
  const iceCandidateQueueRef = useRef<
    { candidate: RTCIceCandidateInit; senderSocketId: string }[]
  >([]);

  /**
   * Create peer connection
   */
  const createPeerConnection = useCallback(() => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }

    const pc = new RTCPeerConnection(configuration);

    pc.ontrack = (event) => {
      console.log("📹 Received remote track", event);
      if (event.streams && event.streams[0]) {
        console.log("📹 Setting remote stream", event.streams[0].id);
        setRemoteStream(event.streams[0]);
        setState("connected");
        setIsLoading(false);
      } else {
        console.warn("⚠️ Track event received but no stream", event);
      }
    };

    pc.onicecandidate = (event) => {
      if (event.candidate && cameraSocketIdRef.current) {
        console.log(
          "🧊 Sending ICE candidate to camera:",
          event.candidate.candidate.substring(0, 50),
        );
        signalingService.sendIceCandidate(
          event.candidate.toJSON(),
          cameraSocketIdRef.current,
        );
      } else if (!event.candidate) {
        console.log("🧊 ICE gathering complete for viewer");
      }
    };

    pc.onconnectionstatechange = () => {
      console.log("🔌 Connection state:", pc.connectionState);

      switch (pc.connectionState) {
        case "connected":
          setState("connected");
          setError(null);
          setIsLoading(false);
          break;
        case "disconnected":
        case "failed":
          setState("disconnected");
          setError("Connection lost");
          setIsLoading(false);
          break;
        case "closed":
          setState("disconnected");
          setIsLoading(false);
          break;
      }
    };

    pc.onicecandidateerror = (event) => {
      console.error("❌ ICE candidate error:", event);
    };

    peerConnectionRef.current = pc;
    return pc;
  }, []);

  /**
   * Handle incoming offer from camera
   */
  const handleOffer = useCallback(
    async (data?: unknown) => {
      try {
        const offerData = data as {
          offer: RTCSessionDescriptionInit;
          cameraId: string;
          cameraSocketId: string;
        };
        const { offer, cameraId: incomingCameraId, cameraSocketId } = offerData;

        if (incomingCameraId !== cameraId) {
          return; // Not for this camera
        }

        console.log("📨 Received offer from camera:", incomingCameraId);
        console.log("📨 Offer details:", offer);
        cameraSocketIdRef.current = cameraSocketId;

        // Close existing connection if any
        if (peerConnectionRef.current) {
          console.log(
            "🔄 Closing existing peer connection before creating new one",
          );
          peerConnectionRef.current.close();
        }

        const pc = createPeerConnection();

        console.log("🔧 Setting remote description");
        await pc.setRemoteDescription(new RTCSessionDescription(offer));

        // Apply any queued ICE candidates now that remote description is set
        const relevantCandidates = iceCandidateQueueRef.current.filter(
          (item) => item.senderSocketId === cameraSocketId,
        );
        if (relevantCandidates.length > 0) {
          console.log(
            `📤 Applying ${relevantCandidates.length} queued ICE candidates`,
          );
          for (const { candidate } of relevantCandidates) {
            try {
              await pc.addIceCandidate(new RTCIceCandidate(candidate));
            } catch (err) {
              console.warn("⚠️ Failed to add queued ICE candidate:", err);
            }
          }
        }
        // Clear all queued candidates
        iceCandidateQueueRef.current = [];

        console.log("🔧 Creating answer");
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        console.log("📤 Sending answer to camera");
        signalingService.sendAnswer(pc.localDescription!, cameraSocketId);

        console.log("✅ Answer sent to camera");
      } catch (err) {
        const error = err as Error;
        console.error("❌ Error handling offer:", error);
        setError(error.message);
        setState("error");
        setIsLoading(false);
      }
    },
    [cameraId, createPeerConnection],
  );

  /**
   * Handle incoming ICE candidate
   */
  const handleIceCandidate = useCallback(async (data?: unknown) => {
    try {
      const candidateData = data as {
        candidate: RTCIceCandidateInit;
        senderSocketId: string;
      };
      const { candidate, senderSocketId } = candidateData;

      console.log(
        "🧊 Received ICE candidate from:",
        senderSocketId?.substring(0, 8),
        candidate.candidate?.substring(0, 50),
      );

      // If we don't have a camera socket ID yet, queue the candidate
      if (!cameraSocketIdRef.current) {
        console.log("📥 Queueing ICE candidate (waiting for offer)");
        iceCandidateQueueRef.current.push({ candidate, senderSocketId });
        return;
      }

      if (senderSocketId !== cameraSocketIdRef.current) {
        console.log("⚠️ ICE candidate from unexpected sender, ignoring");
        return;
      }

      const pc = peerConnectionRef.current;
      if (pc && pc.remoteDescription) {
        console.log("✅ Adding ICE candidate to peer connection");
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      } else {
        // Queue candidates that arrive before peer connection is ready
        console.log("📥 Queueing ICE candidate (peer connection not ready)");
        iceCandidateQueueRef.current.push({ candidate, senderSocketId });
      }
    } catch (err) {
      console.error("❌ Error adding ICE candidate:", err);
    }
  }, []);

  /**
   * Handle camera disconnection
   */
  const handleCameraDisconnected = useCallback(
    (data?: unknown) => {
      const disconnectData = data as { cameraId: string };
      if (disconnectData.cameraId === cameraId) {
        console.log("📹 Camera disconnected:", cameraId);
        setRemoteStream(null);
        setState("disconnected");
        setError("Camera disconnected");

        if (peerConnectionRef.current) {
          peerConnectionRef.current.close();
          peerConnectionRef.current = null;
        }
      }
    },
    [cameraId],
  );

  /**
   * Handle camera status updates
   */
  const handleCameraStatus = useCallback(
    (status?: unknown) => {
      const statusData = status as Record<string, CameraStatus>;
      if (statusData[cameraId]) {
        setCameraStatus(statusData[cameraId]);

        // If camera goes offline while we're connected
        if (!statusData[cameraId].online && state === "connected") {
          setRemoteStream(null);
          setState("disconnected");
          setError("Camera went offline");
        }
      }
    },
    [cameraId, state],
  );

  /**
   * Connect to camera stream
   */
  const connect = useCallback(async () => {
    if (isConnectingRef.current) {
      console.log("⏳ Connection already in progress");
      return;
    }

    try {
      isConnectingRef.current = true;
      setIsLoading(true);
      setState("connecting");
      setError(null);

      // Connect to signaling server if not already connected
      if (!signalingService.isConnected()) {
        await signalingService.connect(signalingServerUrl);
      }

      // Subscribe to signaling events (only once)
      if (!hasSetupListenersRef.current) {
        signalingService.on("webrtc:offer", handleOffer);
        signalingService.on("webrtc:ice-candidate", handleIceCandidate);
        signalingService.on("camera:disconnected", handleCameraDisconnected);
        signalingService.on("cameras:status", handleCameraStatus);
        hasSetupListenersRef.current = true;
      }

      // Join as viewer
      signalingService.joinAsViewer(cameraId);

      // Request initial camera status
      signalingService.requestCameraStatus();

      console.log("✅ Joined as viewer for camera:", cameraId);
    } catch (err) {
      const error = err as Error;
      console.error("❌ Failed to connect:", error);
      setError(error.message || "Failed to connect");
      setState("error");
      setIsLoading(false);
    } finally {
      isConnectingRef.current = false;
    }
  }, [
    cameraId,
    signalingServerUrl,
    handleOffer,
    handleIceCandidate,
    handleCameraDisconnected,
    handleCameraStatus,
  ]);

  /**
   * Disconnect from camera stream
   */
  const disconnect = useCallback(() => {
    console.log("🔌 Disconnecting from camera:", cameraId);

    // Close peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    // Unsubscribe from events
    if (hasSetupListenersRef.current) {
      signalingService.off("webrtc:offer", handleOffer);
      signalingService.off("webrtc:ice-candidate", handleIceCandidate);
      signalingService.off("camera:disconnected", handleCameraDisconnected);
      signalingService.off("cameras:status", handleCameraStatus);
      hasSetupListenersRef.current = false;
    }

    setRemoteStream(null);
    setState("disconnected");
    cameraSocketIdRef.current = null;
    setIsLoading(false);
  }, [
    cameraId,
    handleOffer,
    handleIceCandidate,
    handleCameraDisconnected,
    handleCameraStatus,
  ]);

  /**
   * Reconnect to camera stream
   */
  const reconnect = useCallback(async () => {
    disconnect();
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second
    await connect();
  }, [connect, disconnect]);

  /**
   * Auto-connect on mount
   */
  useEffect(() => {
    if (autoConnect) {
      void connect();
    }

    return () => {
      disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount/unmount

  return {
    remoteStream,
    state,
    error,
    cameraStatus,
    connect,
    disconnect,
    reconnect,
    isLoading,
  };
};

export default useWebRTC;

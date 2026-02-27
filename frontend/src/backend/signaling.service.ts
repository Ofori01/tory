import { io, Socket } from "socket.io-client";

export interface CameraMetadata {
  userAgent?: string;
  deviceType?: string;
  resolution?: string;
  [key: string]: unknown;
}

export interface CameraStatus {
  online: boolean;
  viewers: number;
  connectedAt: number | null;
  lastHeartbeat: number | null;
  metadata: CameraMetadata | null;
}

export interface CamerasStatusMap {
  [cameraId: string]: CameraStatus;
}

export type ConnectionStatus =
  | "connected"
  | "connecting"
  | "disconnected"
  | "error";

class SignalingService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private isConnecting = false;

  // Event listeners
  private eventListeners = new Map<string, Set<(data?: unknown) => void>>();

 
  connect(serverUrl: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.socket?.connected) {
        console.log("Already connected to signaling server");
        resolve();
        return;
      }

      if (this.isConnecting) {
        console.log("Connection already in progress, waiting...");
        let attempts = 0;
        const maxAttempts = 100; // 10 seconds
        const checkInterval = setInterval(() => {
          attempts++;
          if (this.socket?.connected) {
            clearInterval(checkInterval);
            console.log("Existing connection completed");
            resolve();
          } else if (!this.isConnecting || attempts >= maxAttempts) {
            clearInterval(checkInterval);
            if (!this.socket?.connected) {
              console.warn("Connection wait timeout");
              this.isConnecting = false;
              reject(new Error("Connection timeout"));
            } else {
              resolve();
            }
          }
        }, 100);
        return;
      }

      this.isConnecting = true;

      this.socket = io(serverUrl, {
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: this.maxReconnectAttempts,
        timeout: 10000,
      });

      this.socket.on("connect", () => {
        console.log("Connected to signaling server");
        this.isConnecting = false;
        this.reconnectAttempts = 0;
        this.emit("connection:status", "connected");
        resolve();
      });

      this.socket.on("disconnect", (reason) => {
        console.log("Disconnected from signaling server:", reason);
        this.emit("connection:status", "disconnected");
      });

      this.socket.on("connect_error", (error) => {
        console.error("Connection error:", error.message);
        this.reconnectAttempts++;

        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
          this.isConnecting = false;
          this.emit("connection:status", "error");
          reject(new Error("Failed to connect to signaling server"));
        }
      });

      this.socket.on("error", (error) => {
        console.error("Socket error:", error);
        this.emit("error", error);
      });

      // Camera status updates
      this.socket.on("cameras:status", (status: CamerasStatusMap) => {
        this.emit("cameras:status", status);
      });

      // WebRTC signaling events
      this.socket.on("webrtc:offer", (data) => {
        this.emit("webrtc:offer", data);
      });

      this.socket.on("webrtc:answer", (data) => {
        this.emit("webrtc:answer", data);
      });

      this.socket.on("webrtc:ice-candidate", (data) => {
        this.emit("webrtc:ice-candidate", data);
      });

      this.socket.on("camera:disconnected", (data) => {
        this.emit("camera:disconnected", data);
      });

      // Timeout
      setTimeout(() => {
        if (this.isConnecting) {
          this.isConnecting = false;
          this.disconnect();
          reject(new Error("Connection timeout"));
        }
      }, 10000);
    });
  }

  /**
   * Disconnect from signaling server
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.eventListeners.clear();
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  /**
   * Join as viewer for a specific camera
   */
  joinAsViewer(cameraId: string): void {
    if (!this.socket) {
      throw new Error("Not connected to signaling server");
    }

    this.socket.emit("viewer:join", { cameraId });
  }

  /**
   * Send WebRTC offer
   */
  sendOffer(offer: RTCSessionDescriptionInit, targetSocketId: string): void {
    if (!this.socket) {
      throw new Error("Not connected to signaling server");
    }

    this.socket.emit("webrtc:offer", { offer, targetSocketId });
  }

  /**
   * Send WebRTC answer
   */
  sendAnswer(answer: RTCSessionDescriptionInit, cameraSocketId: string): void {
    if (!this.socket) {
      throw new Error("Not connected to signaling server");
    }

    this.socket.emit("webrtc:answer", { answer, cameraSocketId });
  }

  /**
   * Send ICE candidate
   */
  sendIceCandidate(
    candidate: RTCIceCandidateInit,
    targetSocketId: string,
  ): void {
    if (!this.socket) {
      throw new Error("Not connected to signaling server");
    }

    this.socket.emit("webrtc:ice-candidate", { candidate, targetSocketId });
  }

  /**
   * Request camera status
   */
  requestCameraStatus(): void {
    if (!this.socket) {
      throw new Error("Not connected to signaling server");
    }

    this.socket.emit("cameras:status");
  }

  /**
   * Subscribe to events
   */
  on(event: string, callback: (data?: unknown) => void): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    this.eventListeners.get(event)!.add(callback);
  }

  /**
   * Unsubscribe from events
   */
  off(event: string, callback: (data?: unknown) => void): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.delete(callback);
    }
  }

  /**
   * Emit event to listeners
   */
  private emit(event: string, data?: unknown): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach((callback) => callback(data));
    }
  }
}

// Singleton instance
export const signalingService = new SignalingService();
export default signalingService;

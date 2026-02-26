/**
 * Camera Client JavaScript
 * Handles camera capture and WebRTC broadcasting
 */

class CameraClient {
  constructor() {
    this.socket = null;
    this.localStream = null;
    this.peerConnections = new Map(); // viewerSocketId -> RTCPeerConnection
    this.cameraId = null;
    this.isConnected = false;
    this.heartbeatInterval = null;
    this.stats = {
      viewers: 0,
      bitrate: 0,
      fps: 0,
    };

    this.initializeElements();
    this.loadCameraDevices();
    this.attachEventListeners();
  }

  initializeElements() {
    // Setup section
    this.cameraSelect = document.getElementById("cameraSelect");
    this.deviceSelect = document.getElementById("deviceSelect");
    this.resolutionSelect = document.getElementById("resolutionSelect");
    this.startBtn = document.getElementById("startBtn");
    this.setupSection = document.getElementById("setupSection");

    // Stream section
    this.streamSection = document.getElementById("streamSection");
    this.localVideo = document.getElementById("localVideo");
    this.stopBtn = document.getElementById("stopBtn");
    this.statusBadge = document.getElementById("statusBadge");
    this.cameraLabel = document.getElementById("cameraLabel");
    this.connectionStatus = document.getElementById("connectionStatus");
    this.viewersCount = document.getElementById("viewersCount");
    this.bitrateDisplay = document.getElementById("bitrate");
    this.fpsDisplay = document.getElementById("fps");

    // Error message
    this.errorMessage = document.getElementById("errorMessage");
  }

  async loadCameraDevices() {
    try {
      // Request permission first
      await navigator.mediaDevices.getUserMedia({ video: true });

      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(
        (device) => device.kind === "videoinput",
      );

      this.deviceSelect.innerHTML = "";

      if (videoDevices.length === 0) {
        this.deviceSelect.innerHTML =
          '<option value="">No cameras found</option>';
        return;
      }

      videoDevices.forEach((device, index) => {
        const option = document.createElement("option");
        option.value = device.deviceId;
        option.textContent = device.label || `Camera ${index + 1}`;
        this.deviceSelect.appendChild(option);
      });
    } catch (error) {
      console.error("Error loading camera devices:", error);
      this.deviceSelect.innerHTML =
        '<option value="">Error loading cameras</option>';
      this.showError(
        "Failed to access camera devices. Please grant camera permissions.",
      );
    }
  }

  attachEventListeners() {
    this.cameraSelect.addEventListener("change", () => {
      this.startBtn.disabled = !this.cameraSelect.value;
    });

    this.startBtn.addEventListener("click", () => this.startBroadcasting());
    this.stopBtn.addEventListener("click", () => this.stopBroadcasting());
  }

  async startBroadcasting() {
    try {
      this.cameraId = this.cameraSelect.value;
      const deviceId = this.deviceSelect.value;
      const [width, height] = this.resolutionSelect.value
        .split("x")
        .map(Number);

      if (!this.cameraId) {
        this.showError("Please select a camera position");
        return;
      }

      this.startBtn.disabled = true;
      this.startBtn.textContent = "Starting...";

      // Get local stream
      const constraints = {
        video: {
          deviceId: deviceId ? { exact: deviceId } : undefined,
          width: { ideal: width },
          height: { ideal: height },
          frameRate: { ideal: 30 },
        },
        audio: false, // CCTV typically doesn't need audio
      };

      this.localStream = await navigator.mediaDevices.getUserMedia(constraints);
      this.localVideo.srcObject = this.localStream;

      // Connect to signaling server
      await this.connectToSignalingServer();

      // Show stream section
      this.setupSection.classList.add("hidden");
      this.streamSection.classList.remove("hidden");
      this.cameraLabel.textContent = `${this.cameraId.charAt(0).toUpperCase() + this.cameraId.slice(1)} Camera`;

      // Start stats monitoring
      this.startStatsMonitoring();
    } catch (error) {
      console.error("Error starting broadcast:", error);
      this.showError(`Failed to start broadcasting: ${error.message}`);
      this.startBtn.disabled = false;
      this.startBtn.textContent = "Start Broadcasting";
      this.cleanup();
    }
  }

  connectToSignalingServer() {
    return new Promise((resolve, reject) => {
      // Connect to signaling server (use current host)
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const host = window.location.hostname;
      const port = window.location.port || (protocol === "wss:" ? "443" : "80");

      this.socket = io(`${window.location.protocol}//${host}:${port}`, {
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
      });

      this.socket.on("connect", () => {
        console.log("Connected to signaling server");
        this.updateStatus("Registering...", "connecting");

        // Register as camera
        const metadata = {
          userAgent: navigator.userAgent,
          deviceType: /Mobile|Android|iPhone/i.test(navigator.userAgent)
            ? "mobile"
            : "desktop",
          resolution: this.resolutionSelect.value,
        };

        this.socket.emit("camera:register", {
          cameraId: this.cameraId,
          metadata,
        });
      });

      this.socket.on("camera:registered", (data) => {
        console.log("Camera registered:", data);
        this.isConnected = true;
        this.updateStatus("Broadcasting", "connected");

        // Start sending heartbeats
        this.startHeartbeat();

        resolve();
      });

      this.socket.on("viewer:connected", (data) => {
        console.log("🔔 New viewer connected:", data);
        console.log(
          "📹 Camera ready to send stream to viewer:",
          data.viewerSocketId,
        );
        this.handleNewViewer(data.viewerSocketId);
      });

      this.socket.on("webrtc:answer", (data) => {
        console.log("Received answer from viewer");
        this.handleAnswer(data.viewerSocketId, data.answer);
      });

      this.socket.on("webrtc:ice-candidate", (data) => {
        console.log("Received ICE candidate");
        this.handleIceCandidate(data.senderSocketId, data.candidate);
      });

      this.socket.on("disconnect", () => {
        console.log("Disconnected from signaling server");
        this.isConnected = false;
        this.updateStatus("Disconnected", "error");
      });

      this.socket.on("error", (error) => {
        console.error("Signaling error:", error);
        this.showError(error.message);
        reject(new Error(error.message));
      });

      // Timeout after 10 seconds
      setTimeout(() => {
        if (!this.isConnected) {
          reject(new Error("Connection timeout"));
        }
      }, 10000);
    });
  }

  async handleNewViewer(viewerSocketId) {
    try {
      console.log("🎬 Starting to handle new viewer:", viewerSocketId);

      // Create new peer connection for this viewer
      const pc = this.createPeerConnection(viewerSocketId);
      this.peerConnections.set(viewerSocketId, pc);

      // Add local stream tracks
      console.log("📹 Adding local stream tracks to peer connection");
      this.localStream.getTracks().forEach((track) => {
        console.log("➕ Adding track:", track.kind, track.label);
        pc.addTrack(track, this.localStream);
      });

      // Create and send offer
      console.log("🔨 Creating WebRTC offer...");
      const offer = await pc.createOffer();
      console.log("📝 Offer created:", offer);

      await pc.setLocalDescription(offer);
      console.log("✅ Local description set");

      console.log(
        "📤 Sending offer to viewer:",
        viewerSocketId.substring(0, 8),
      );
      this.socket.emit("webrtc:offer", {
        offer: pc.localDescription,
        targetSocketId: viewerSocketId,
      });

      console.log("✅ Offer sent to viewer:", viewerSocketId.substring(0, 8));
      this.updateViewersCount();
    } catch (error) {
      console.error("❌ Error handling new viewer:", error);
    }
  }

  createPeerConnection(viewerSocketId) {
    const configuration = {
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
      ],
    };

    const pc = new RTCPeerConnection(configuration);

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        console.log(
          "🧊 ICE candidate:",
          event.candidate.candidate.substring(0, 50),
        );
        this.socket.emit("webrtc:ice-candidate", {
          candidate: event.candidate,
          targetSocketId: viewerSocketId,
        });
      } else {
        console.log("🧊 ICE gathering complete");
      }
    };

    pc.onconnectionstatechange = () => {
      console.log(
        "🔌 Connection state changed:",
        pc.connectionState,
        "for viewer:",
        viewerSocketId.substring(0, 8),
      );

      if (
        pc.connectionState === "disconnected" ||
        pc.connectionState === "failed"
      ) {
        console.log("❌ Viewer disconnected/failed, removing peer connection");
        this.peerConnections.delete(viewerSocketId);
        this.updateViewersCount();
      } else if (pc.connectionState === "connected") {
        console.log("✅ Successfully connected to viewer!");
      }
    };

    return pc;
  }

  async handleAnswer(viewerSocketId, answer) {
    try {
      const pc = this.peerConnections.get(viewerSocketId);

      if (!pc) {
        console.error("No peer connection found for viewer:", viewerSocketId);
        return;
      }

      await pc.setRemoteDescription(new RTCSessionDescription(answer));
      console.log("Remote description set for viewer:", viewerSocketId);
    } catch (error) {
      console.error("Error handling answer:", error);
    }
  }

  async handleIceCandidate(senderSocketId, candidate) {
    try {
      const pc = this.peerConnections.get(senderSocketId);

      if (!pc) {
        console.error("No peer connection found for sender:", senderSocketId);
        return;
      }

      await pc.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (error) {
      console.error("Error adding ICE candidate:", error);
    }
  }

  startStatsMonitoring() {
    this.statsInterval = setInterval(() => {
      this.updateStats();
    }, 1000);
  }

  async updateStats() {
    // Calculate FPS from video track
    if (this.localStream) {
      const videoTrack = this.localStream.getVideoTracks()[0];
      if (videoTrack) {
        const settings = videoTrack.getSettings();
        this.fpsDisplay.textContent = settings.frameRate?.toFixed(0) || "--";
      }
    }

    // Get stats from first peer connection (if any)
    const firstPc = Array.from(this.peerConnections.values())[0];
    if (firstPc) {
      try {
        const stats = await firstPc.getStats();
        stats.forEach((report) => {
          if (report.type === "outbound-rtp" && report.kind === "video") {
            const bitrate = Math.round((report.bytesSent * 8) / 1000);
            this.bitrateDisplay.textContent = `${bitrate} kbps`;
          }
        });
      } catch (error) {
        console.error("Error getting stats:", error);
      }
    }
  }

  updateViewersCount() {
    this.viewersCount.textContent = this.peerConnections.size;
  }

  updateStatus(text, type = "connected") {
    this.statusBadge.textContent = text;
    this.statusBadge.className = `status-badge status-${type}`;
    this.connectionStatus.textContent = text;
  }

  showError(message) {
    this.errorMessage.textContent = message;
    this.errorMessage.classList.remove("hidden");

    setTimeout(() => {
      this.errorMessage.classList.add("hidden");
    }, 5000);
  }

  stopBroadcasting() {
    this.cleanup();
    this.setupSection.classList.remove("hidden");
    this.streamSection.classList.add("hidden");
    this.startBtn.disabled = false;
    this.startBtn.textContent = "Start Broadcasting";
  }

  startHeartbeat() {
    console.log("💓 Starting heartbeat interval");

    // Send first heartbeat immediately
    this.sendHeartbeat();

    // Then send heartbeat every 8 seconds (before 10 second timeout)
    this.heartbeatInterval = setInterval(() => {
      this.sendHeartbeat();
    }, 8000);
  }

  sendHeartbeat() {
    if (this.socket && this.isConnected) {
      this.socket.emit("heartbeat", { cameraId: this.cameraId });
      console.log("💓 Heartbeat sent for camera:", this.cameraId);
    } else {
      console.warn("⚠️ Cannot send heartbeat - not connected");
    }
  }

  stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  cleanup() {
    // Stop heartbeat
    this.stopHeartbeat();

    // Stop stats monitoring
    if (this.statsInterval) {
      clearInterval(this.statsInterval);
    }

    // Close peer connections
    this.peerConnections.forEach((pc) => pc.close());
    this.peerConnections.clear();

    // Stop local stream
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop());
      this.localStream = null;
    }

    // Disconnect socket
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }

    this.isConnected = false;
  }
}

// Initialize camera client when page loads
document.addEventListener("DOMContentLoaded", () => {
  new CameraClient();
});

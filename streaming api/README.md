# WebRTC CCTV Streaming System

A production-grade WebRTC-based CCTV camera system that allows multiple devices on the same network to act as cameras and stream live video to a central monitoring interface.

## System Architecture

### Components

1. **Streaming API** (Node.js + Socket.IO)
   - WebRTC signaling server
   - Camera registration and management
   - Viewer connection handling
   - ICE candidate and SDP exchange

2. **Camera Client** (Web-based)
   - Runs on mobile devices, tablets, or any device with a camera
   - Captures video and broadcasts via WebRTC
   - Can be configured as "Front" or "Back" camera

3. **Frontend Viewer** (React)
   - Displays live camera feeds
   - Real-time connection status
   - Automatic reconnection on failure

## Features

✅ **Production-Grade Code**

- Proper error handling and logging
- Connection state management
- Automatic reconnection
- Heartbeat monitoring

✅ **Multi-Device Support**

- Use phones/tablets as remote cameras
- Multiple viewers simultaneously
- Network-based discovery

✅ **WebRTC Streaming**

- Low-latency peer-to-peer connections
- Adaptive bitrate
- STUN server support

✅ **User-Friendly**

- Simple camera client interface
- Visual connection status indicators
- Mobile-responsive design

## Setup Instructions

### Prerequisites

- Node.js 18+ installed
- SSL certificates (for HTTPS/WSS)
- All devices on the same local network

### 1. Generate SSL Certificates

For local development, you need self-signed certificates:

```bash
cd "streaming api/cert"

# Generate private key
openssl genrsa -out cert.key 2048

# Generate certificate
openssl req -new -x509 -key cert.key -out cert.crt -days 365

# When prompted, use "localhost" as the Common Name (CN)
```

### 2. Setup Streaming API

```bash
cd "streaming api"

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env if needed (optional)
nano .env

# Start the server
npm run dev
```

The server will start on `https://localhost:9000`

### 3. Setup Frontend

```bash
cd frontend

# Install dependencies (if not already done)
npm install

# Copy environment file
cp .env.example .env

# Edit .env to point to your streaming API
nano .env

# Start development server
npm run dev
```

The frontend will start on `https://localhost:5173`

### 4. Setup Camera Devices

On each device you want to use as a camera:

1. **Find your computer's IP address** on the local network:

   ```bash
   # Linux
   ip addr show | grep inet

   # Or use hostname
   hostname -I
   ```

2. **On mobile device/tablet**, open browser and navigate to:

   ```
   https://<YOUR_IP>:9000/camera-client.html
   ```

   Example: `https://192.168.1.100:9000/camera-client.html`

3. **Accept SSL warning** (since it's self-signed)

4. **Select camera position** (Front or Back)

5. **Grant camera permissions** when prompted

6. **Click "Start Broadcasting"**

### 5. View Cameras

1. Open the main application: `https://localhost:5173` (or your frontend URL)
2. Navigate to the Camera page
3. You should see live feeds from connected cameras

## Network Configuration

### Local Network Access

For devices on the same network to access the streaming server:

1. **Find your computer's local IP** (e.g., 192.168.1.100)

2. **Update CORS settings** in `streaming api/src/config/config.js` if needed:

   ```javascript
   cors: {
     origins: [
       'https://localhost:5173',
       'https://192.168.1.*',  // Allows any device on 192.168.1.x
       'https://192.168.0.*',  // Allows any device on 192.168.0.x
     ],
   }
   ```

3. **Allow browser security exception** on all devices (for self-signed certs)

### Firewall Configuration

Ensure port 9000 is open:

```bash
# Linux (ufw)
sudo ufw allow 9000/tcp

# Or temporarily disable firewall for testing
sudo ufw disable
```

## Usage Guide

### Starting a Camera Stream

1. Open camera client on device
2. Select which camera position (Front/Back)
3. Choose camera device (if multiple)
4. Select video quality
5. Click "Start Broadcasting"
6. Keep browser tab active for continuous streaming

### Viewing Camera Feeds

1. Open main application
2. Navigate to Camera page
3. Cameras will auto-connect when online
4. Click info icon (ℹ️) to see connection details
5. Use reconnect button if connection drops

### Troubleshooting

**Camera not connecting:**

- Verify all devices are on same network
- Check firewall settings
- Ensure SSL certificates are valid
- Check browser console for errors
- Verify streaming API is running

**No video displayed:**

- Grant camera permissions in browser
- Check camera is not being used by another app
- Try different browser (Chrome/Firefox recommended)
- Check WebRTC compatibility

**Connection drops:**

- Check network stability
- Ensure devices don't go to sleep
- Verify signaling server is running
- Check browser console for errors

## API Endpoints

### Streaming API

- `GET /health` - Health check endpoint
- `GET /api/cameras/status` - Get status of all cameras
- `GET /camera-client.html` - Camera client interface
- WebSocket on `/` - Signaling connection

### Socket.IO Events

**Camera events:**

- `camera:register` - Register as camera
- `camera:registered` - Registration confirmation
- `heartbeat` - Keep-alive ping

**Viewer events:**

- `viewer:join` - Join as viewer
- `viewer:joined` - Join confirmation
- `viewer:connected` - New viewer notification

**WebRTC signaling:**

- `webrtc:offer` - Send/receive offer
- `webrtc:answer` - Send/receive answer
- `webrtc:ice-candidate` - Exchange ICE candidates

**Status events:**

- `cameras:status` - Camera status updates
- `camera:disconnected` - Camera disconnect notification

## Development

### Project Structure

```
streaming api/
├── src/
│   ├── config/
│   │   └── config.js          # Configuration management
│   ├── signaling/
│   │   ├── cameraManager.js   # Camera state management
│   │   └── signalingHandler.js # WebRTC signaling logic
│   ├── utils/
│   │   └── logger.js          # Logging utility
│   └── server.js              # Main server
├── public/
│   ├── camera-client.html     # Camera client page
│   ├── js/
│   │   └── camera-client.js   # Camera client logic
│   └── css/
│       └── camera-client.css  # Camera client styles
└── cert/                      # SSL certificates

frontend/
└── src/
    ├── backend/
    │   └── signaling.service.ts  # Signaling client
    ├── hooks/
    │   └── useWebRTC.ts          # WebRTC hook
    └── pages/
        └── camera/
            ├── CameraPage.tsx    # Camera page
            └── CameraFeed.tsx    # Camera feed component
```

### Adding Features

**New camera positions:**

1. Update `config.cameras.allowedIds` in streaming API
2. Add new `CameraFeed` component in frontend

**Recording functionality:**

1. Can be implemented in backend using MediaRecorder API
2. Or use existing recording system in Tori_Backend

**Audio support:**

1. Enable audio in camera constraints
2. Add audio track to peer connection
3. Update UI to show audio status

## Production Deployment

### Recommendations

1. **Use valid SSL certificates** (e.g., Let's Encrypt)
2. **Set up proper DNS** for server access
3. **Use TURN server** for NAT traversal (if needed)
4. **Enable authentication** for camera registration
5. **Add rate limiting** to prevent abuse
6. **Monitor server resources** (CPU, memory, bandwidth)
7. **Set up logging aggregation** (e.g., ELK stack)
8. **Use process manager** (e.g., PM2) for production

### TURN Server (Optional)

If devices can't connect directly (strict NAT), set up a TURN server:

```javascript
// In config.js
webrtc: {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    {
      urls: 'turn:your-turn-server.com:3478',
      username: 'username',
      credential: 'password',
    },
  ],
}
```

## Security Considerations

⚠️ **Current implementation is for local network use**

For production:

- Implement authentication/authorization
- Use valid SSL certificates
- Rate limit connections
- Validate all inputs
- Implement CORS properly
- Use secure WebSocket (WSS)
- Consider encryption for sensitive streams

## Performance Tips

- **Lower video quality** for slower networks
- **Limit simultaneous viewers** based on camera device capabilities
- **Use H.264 codec** if available (better compression)
- **Monitor bandwidth usage** on mobile devices
- **Keep camera client browser tab active** (prevents throttling)

## Browser Compatibility

- ✅ Chrome/Chromium 80+
- ✅ Firefox 75+
- ✅ Safari 14+ (iOS)
- ✅ Edge 80+

## License

MIT

## Support

For issues or questions:

1. Check console logs (browser & server)
2. Review troubleshooting section
3. Check WebRTC compatibility
4. Verify network configuration

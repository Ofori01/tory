# WebRTC CCTV Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Start the Streaming Server

```bash
cd "streaming api"
npm install
npm run dev
```

Wait for: `🎥 WebRTC Signaling Server Started`

### Step 2: Start the Frontend

```bash
cd frontend
npm run dev
```

### Step 3: Setup Camera Devices

#### Option A: Use Another Device as Camera

1. Find your computer's IP address:

   ```bash
   hostname -I   # Linux
   # or
   ipconfig      # Windows
   ```

2. On your mobile device/tablet, open:

   ```
   https://YOUR_IP:9000/camera-client.html
   ```

   Example: `https://192.168.1.100:9000/camera-client.html`

3. Accept the SSL warning (self-signed certificate)

4. Select "Front" or "Back" camera

5. Click "Start Broadcasting"

#### Option B: Test with Same Computer

1. Open a new browser window/tab

2. Navigate to:

   ```
   https://localhost:9000/camera-client.html
   ```

3. Follow the same steps as Option A

### Step 4: View the Cameras

1. Open the frontend: `https://localhost:5173`

2. Navigate to the Camera page

3. You should see live feeds!

## 🔧 Troubleshooting

### "Cannot GET /camera-client.html"

- Make sure the streaming API is running
- Check that you're using the correct port (9000)

### Camera not connecting

- Verify all devices are on the same network
- Check firewall settings (allow port 9000)
- Ensure SSL certificate is accepted in browser

### No video displayed

- Grant camera permissions when prompted
- Check that camera is not in use by another app
- Try Chrome or Firefox (best WebRTC support)

### Certificate warnings

- This is normal for self-signed certificates
- Click "Advanced" → "Proceed to localhost (unsafe)"
- For mobile, you may need to add security exception

## 📱 Network Access

To access from other devices on your network:

1. **Get your IP address:**

   ```bash
   # Linux/Mac
   ifconfig | grep "inet "
   # or
   hostname -I

   # Windows
   ipconfig
   ```

2. **Use this format on other devices:**
   - Server: `https://YOUR_IP:9000`
   - Camera Client: `https://YOUR_IP:9000/camera-client.html`
   - Frontend: Update VITE_SIGNALING_SERVER_URL in .env

## 🎥 Multiple Cameras

To set up both Front and Back cameras:

1. Use two different devices
2. On first device: Select "Front" camera → Start Broadcasting
3. On second device: Select "Back" camera → Start Broadcasting
4. View both feeds in the frontend Camera page

## 💡 Tips

- **Keep camera client tab active** - Browsers throttle background tabs
- **Use good lighting** - Improves video quality
- **Stable network** - WiFi works better than mobile data
- **Test locally first** - Verify setup before using remote devices

## 📊 Monitor Status

Access the server dashboard:

```
https://localhost:9000
```

Shows:

- Server status and uptime
- Connected cameras
- Number of viewers per camera

## ⚙️ Configuration

### Change Server Port

Edit `streaming api/.env`:

```env
PORT=8080
```

Then update frontend `.env`:

```env
VITE_SIGNALING_SERVER_URL=https://localhost:8080
```

### Change Video Quality

In camera client, select from:

- SD (640x480) - Low bandwidth
- HD (1280x720) - Balanced
- Full HD (1920x1080) - High quality

## 🔐 SSL Certificates

For local testing, generate self-signed certificates:

```bash
cd "streaming api/cert"

openssl genrsa -out cert.key 2048
openssl req -new -x509 -key cert.key -out cert.crt -days 365

# Use "localhost" as Common Name when prompted
```

For production, use Let's Encrypt or a proper CA.

## 📚 Next Steps

1. ✅ Test with single camera
2. ✅ Add second camera on another device
3. ✅ Test with multiple viewers
4. 📖 Read full README.md for advanced features
5. 🚀 Deploy to production (see README.md)

## 🆘 Still Having Issues?

1. Check browser console for errors (F12)
2. Check server logs in terminal
3. Verify network connectivity
4. Ensure WebRTC is supported (modern browsers)
5. Try restarting server and refreshing browser

## 🎉 Success!

If you can see live video feeds, you're all set! The system is working correctly.

For production deployment and advanced features, see the full README.md.

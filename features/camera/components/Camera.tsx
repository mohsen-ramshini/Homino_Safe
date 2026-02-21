"use client";

import { FC, useRef, useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Camera, RotateCcw, Check, X } from "lucide-react";

const CameraPage: FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraReady, setCameraReady] = useState(false);

  // Start Camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraReady(true);
    } catch (err) {
      // console.error("Camera access denied", err);
      setCameraReady(false);
    }
  };

  // Capture Photo
  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      setCapturedImage(canvas.toDataURL("image/png"));
    }
  };

  useEffect(() => {
    startCamera();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white px-4 py-12 flex justify-center">
      <div className="w-full max-w-4xl space-y-8">
        {/* Page Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-blue-800 tracking-tight">
            Camera Verification
          </h1>
          <p className="text-gray-600 text-lg">
            Please verify your identity using the camera. Ensure your face is
            clearly visible.
          </p>
        </div>

        {/* Camera Card */}
        <Card className="rounded-2xl border border-blue-100 bg-white/80 backdrop-blur-xl shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-blue-800 flex items-center gap-2">
              <Camera className="h-5 w-5 text-blue-600" /> Live Camera
            </CardTitle>
          </CardHeader>
          <Separator className="bg-blue-100" />
          <CardContent className="pt-6 flex flex-col items-center gap-6">
            {/* Video Feed or Captured Image */}
            <div className="w-full relative rounded-xl border border-blue-200 shadow-md overflow-hidden">
              {!capturedImage ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-[480px] object-cover"
                />
              ) : (
                <img
                  src={capturedImage}
                  alt="Captured"
                  className="w-full h-[480px] object-cover"
                />
              )}
              {!cameraReady && !capturedImage && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 text-white font-medium text-lg">
                  Waiting for camera access...
                </div>
              )}
            </div>

            {/* Status / Instructions */}
            <p className="text-center text-gray-700 text-sm">
              {capturedImage
                ? "Review your captured photo. Retake if necessary."
                : "Align your face in the frame and press Capture."}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {!capturedImage ? (
                <>
                  <Button
                    onClick={capturePhoto}
                    className="flex items-center gap-2 px-6 py-3 text-lg"
                  >
                    <Camera className="h-5 w-5" /> Capture
                  </Button>
                  <Button
                    variant="outline"
                    onClick={startCamera}
                    className="flex items-center gap-2 px-6 py-3 text-lg"
                  >
                    <RotateCcw className="h-5 w-5" /> Switch Camera
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 px-6 py-3 text-lg"
                    onClick={() => setCapturedImage(null)}
                  >
                    <X className="h-5 w-5" /> Retake
                  </Button>
                  <Button className="flex items-center gap-2 px-6 py-3 text-lg">
                    <Check className="h-5 w-5" /> Confirm
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CameraPage;

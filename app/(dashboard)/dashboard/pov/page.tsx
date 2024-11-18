"use client";
import React, { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import {
  Upload,
  Type,
  Layers,
  Download,
  Trash2,
  ImageOff,
  Edit3,
  Check,
  X,
} from "lucide-react";

interface EditorState {
  step: "upload" | "remove-bg" | "edit";
  loading: boolean;
}

const TextBehindObjectEditor = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);

  // States
  const [editorState, setEditorState] = useState<EditorState>({
    step: "upload",
    loading: false,
  });
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [removedBgImage, setRemovedBgImage] = useState<string | null>(null);
  const [text, setText] = useState("Your POV Text");
  const [fontSize, setFontSize] = useState(48);
  const [textColor, setTextColor] = useState("#ffffff");
  const [error, setError] = useState<string | null>(null);

  // Initialize fabric canvas
  useEffect(() => {
    if (canvasRef.current && editorState.step === "edit") {
      fabricRef.current = new fabric.Canvas(canvasRef.current, {
        width: 800,
        height: 450,
        backgroundColor: "#1a1a1a",
      });

      // Add text object
      const textObj = new fabric.Text(text, {
        left: 400,
        top: 225,
        fontSize: fontSize,
        fill: textColor,
        originX: "center",
        originY: "center",
        fontWeight: "bold",
        selectable: true,
      });

      fabricRef.current.add(textObj);
      fabricRef.current.centerObject(textObj);

      // Add the processed image on top
      if (removedBgImage) {
        fabric.Image.fromURL(removedBgImage, (img: any) => {
          img.scaleToWidth(400);
          img.set({
            left: 400,
            top: 225,
            originX: "center",
            originY: "center",
          });
          fabricRef.current?.add(img);
          fabricRef.current?.bringToFront(img);
          fabricRef.current?.renderAll();
        });
      }

      return () => {
        fabricRef.current?.dispose();
      };
    }
  }, [editorState.step]);

  // Update text properties
  useEffect(() => {
    if (editorState.step === "edit") {
      const textObj = fabricRef.current
        ?.getObjects()
        .find((obj: any) => obj.type === "text") as fabric.Text;

      if (textObj) {
        textObj.set({
          text: text,
          fontSize: fontSize,
          fill: textColor,
        });
        fabricRef.current?.renderAll();
      }
    }
  }, [text, fontSize, textColor]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        setOriginalImage(e.target?.result as string);
        setEditorState({ step: "remove-bg", loading: false });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setError("Error uploading image. Please try again.");
    }
  };

  const removeBackground = async () => {
    if (!originalImage) return;

    setEditorState({ ...editorState, loading: true });
    setError(null);

    try {
      // Convert base64 to blob
      const base64Response = await fetch(originalImage);
      const blob = await base64Response.blob();

      // Create FormData
      const formData = new FormData();
      formData.append("image_file", blob);

      // Call Clipdrop API
      const response = await fetch(
        "https://clipdrop-api.co/remove-background/v1",
        {
          method: "POST",
          headers: {
            "x-api-key": process.env.NEXT_PUBLIC_CLIPDROP_API_KEY || "",
          },
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Failed to remove background");

      // Convert response to base64
      const imageBlob = await response.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        setRemovedBgImage(reader.result as string);
        setEditorState({ step: "edit", loading: false });
      };
      reader.readAsDataURL(imageBlob);
    } catch (error) {
      setError("Failed to remove background. Please try again.");
      setEditorState({ ...editorState, loading: false });
    }
  };

  const skipBackgroundRemoval = () => {
    setRemovedBgImage(originalImage);
    setEditorState({ step: "edit", loading: false });
  };

  const resetEditor = () => {
    setOriginalImage(null);
    setRemovedBgImage(null);
    setEditorState({ step: "upload", loading: false });
    setError(null);
  };

  const downloadCanvas = () => {
    if (!fabricRef.current) return;
    const dataURL = fabricRef.current.toDataURL({
      format: "png",
      quality: 1,
    });
    const link = document.createElement("a");
    link.download = "pov-thumbnail.png";
    link.href = dataURL;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Layers className="w-6 h-6 text-purple-500" />
            <h1 className="text-2xl font-bold text-gray-800">
              POV Image Editor
            </h1>
          </div>

          {editorState.step !== "upload" && (
            <button
              onClick={resetEditor}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              <Trash2 className="w-4 h-4" />
              Start Over
            </button>
          )}
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full ${
                editorState.step === "upload"
                  ? "bg-purple-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              1
            </div>
            <div className="w-16 h-1 bg-gray-200">
              <div
                className={`h-full ${
                  editorState.step !== "upload" ? "bg-purple-500" : ""
                }`}
              />
            </div>
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full ${
                editorState.step === "remove-bg"
                  ? "bg-purple-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              2
            </div>
            <div className="w-16 h-1 bg-gray-200">
              <div
                className={`h-full ${
                  editorState.step === "edit" ? "bg-purple-500" : ""
                }`}
              />
            </div>
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full ${
                editorState.step === "edit"
                  ? "bg-purple-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              3
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {editorState.step === "upload" && (
              <label className="flex flex-col items-center justify-center w-full aspect-video bg-gray-900 cursor-pointer">
                <div className="text-center p-6">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <div className="text-lg text-gray-300 mb-2">
                    Upload your image
                  </div>
                  <div className="text-sm text-gray-500">
                    Click to browse or drag and drop
                  </div>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={editorState.loading}
                />
              </label>
            )}

            {editorState.step === "remove-bg" && originalImage && (
              <div className="relative w-full aspect-video bg-gray-900">
                <img
                  src={originalImage}
                  alt="Original"
                  className="w-full h-full object-contain"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <h3 className="text-white text-lg font-medium">
                      Remove Background?
                    </h3>
                    <div className="flex gap-4">
                      <button
                        onClick={removeBackground}
                        disabled={editorState.loading}
                        className="flex items-center gap-2 px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg disabled:opacity-50"
                      >
                        <ImageOff className="w-4 h-4" />
                        {editorState.loading ? "Processing..." : "Yes, Remove"}
                      </button>
                      <button
                        onClick={skipBackgroundRemoval}
                        disabled={editorState.loading}
                        className="flex items-center gap-2 px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg"
                      >
                        <X className="w-4 h-4" />
                        Skip
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {editorState.step === "edit" && (
              <div className="relative w-full aspect-video bg-gray-900">
                <canvas ref={canvasRef} className="w-full h-full" />
              </div>
            )}
          </div>

          {/* Controls */}
          {editorState.step === "edit" && (
            <div className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  POV Text
                </label>
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter your POV text..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Text Color
                </label>
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-full h-10 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Font Size: {fontSize}px
                </label>
                <input
                  type="range"
                  min="24"
                  max="120"
                  value={fontSize}
                  onChange={(e) => setFontSize(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              <div className="pt-4">
                <button
                  onClick={downloadCanvas}
                  className="w-full flex items-center justify-center gap-2 bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  <Download className="w-5 h-5" />
                  Download Image
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TextBehindObjectEditor;

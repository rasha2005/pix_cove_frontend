"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";import { useState } from "react";
import { Progress } from "@/components/ui/progress"
import { ToastContainer,toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
  } from "@dnd-kit/core";
  import {
    arrayMove,
    SortableContext,
    useSortable,
    rectSortingStrategy,
  } from "@dnd-kit/sortable";
  import { CSS } from "@dnd-kit/utilities";
import { uploadImages } from "../lib/api";

  function SortableImage({
    id,
    item,
    index,
    handleTitleChange,
    handleRemove,
    showTitleError
  }: {
    id: string;
    item: SelectedFile;
    index: number;
    handleTitleChange: (index: number, value: string) => void;
    handleRemove: (index: number) => void;
    showTitleError: boolean; 
  }) {
    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({ id });
  
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };
    return (
        <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="relative flex flex-col items-center border p-2 rounded-lg bg-white dark:bg-zinc-900 cursor-grab active:cursor-grabbing"
      >
        <button
  onClick={() => handleRemove(index)}
  className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-700"
  {...listeners} 
  onPointerDown={(e) => e.stopPropagation()}
>
  ✕
</button>

  
        <img
          src={item.previewUrl}
          alt={`preview ${index}`}
          className="w-full h-40 object-cover rounded-md mb-2"
        />
        <Input
        placeholder="Enter title"
        value={item.title}
        onChange={(e) => handleTitleChange(index, e.target.value)}
        onPointerDown={(e) => e.stopPropagation()}   // ✅ Add this
      />
      {showTitleError && !item.title.trim() && (
  <p className="text-red-500 text-xs mt-1">Title is required</p>
)}
      </div>
      );
}

export default function UploadPage() {
  const [selectedImages, setSelectedImages] = useState<SelectedFile[]>([]);
  const [titles, setTitles] = useState<string[]>([]);
  const [loading , setLoding] = useState<boolean>(false)
  const [progress, setProgress] = useState(0);
  const [showTitleError, setShowTitleError] = useState(false);


  const sensors = useSensors(useSensor(PointerSensor));


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files).map((file) => ({
        file,
        previewUrl: URL.createObjectURL(file),
        title: "",
      }));
  
      setSelectedImages((prev) => [...prev, ...newFiles]);
  };

  const handleTitleChange = (index: number, value: string) => {
    setSelectedImages((prev) =>
      prev.map((item, i) => (i === index ? { ...item, title: value } : item))
    );
  };

  const handleRemove = (index: number) => {
    setSelectedImages((prev) => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].previewUrl);
      updated.splice(index, 1);
      return updated;
    });
}

 
const handleUpload = async () => {
  if (selectedImages.length === 0) return;
  const hasEmptyTitle = selectedImages.some(img => !img.title.trim());
  if (hasEmptyTitle) {
    setShowTitleError(true); 
    return; 
  }

  setShowTitleError(false);
  setLoding(true);
  setProgress(0);

  const uploadedImages: { url: string; title: string }[] = [];
  const totalSteps = selectedImages.length + 1;  
  let completedSteps = 0;

  for (const item of selectedImages) {
    const formData = new FormData();
    formData.append("file", item.file);
    formData.append("upload_preset", "levelup-full");
    formData.append("cloud_name", "levelup-full");

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/levelup-full/image/upload",
        { method: "POST", body: formData }
      );
      const data = await res.json();

      uploadedImages.push({ url: data.secure_url, title: item.title });

      completedSteps++;
      setProgress(Math.round((completedSteps / totalSteps) * 100)); 
    } catch (err) {
      console.error("Upload failed for:", item.file.name, err);
    }
  }

  const res = await uploadImages(uploadedImages);
  if (res.data.success) {
    completedSteps++;
    const newProgress = Math.round((completedSteps / totalSteps) * 100);
    setProgress(newProgress);
    toast.success(res.data.message);

    if (newProgress === 100) {
      setTimeout(() => {
        selectedImages.forEach((img) => URL.revokeObjectURL(img.previewUrl));
        setSelectedImages([]);
        setProgress(0);
        setLoding(false);
      }, 1000);
    }
  }
};


  


  return (
    <>
     <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        hideProgressBar={false} 
        newestOnTop={false} 
        closeOnClick 
        rtl={false} 
        pauseOnFocusLoss 
        draggable 
        pauseOnHover 
      />

    <div className="min-h-screen bg-zinc-50 dark:bg-black flex flex-col items-center px-4 py-12">
      <h1 className="text-4xl font-bold text-black dark:text-zinc-50 mb-4">Upload Images</h1>
      <p className="text-zinc-600 dark:text-zinc-400 mb-8 text-center max-w-md">
        Select images to upload and provide a title for each image.
      </p>

      <Card className="w-full max-w-3xl">
        <CardContent className="space-y-6">
          {/* File Input */}
          <div>
            <Label>Choose Images</Label>
            <Input type="file" multiple onChange={handleFileChange} className="mt-1" />
          </div>

          {/* Preview and title inputs */}
          {selectedImages.length > 0 && (
  <DndContext
    sensors={sensors}
    collisionDetection={closestCenter}
    onDragEnd={({ active, over }) => {
      if (!over) return;
      if (active.id !== over.id) {
        setSelectedImages((items) => {
          const oldIndex = items.findIndex((i) => i.previewUrl === active.id);
          const newIndex = items.findIndex((i) => i.previewUrl === over.id);
          return arrayMove(items, oldIndex, newIndex);
        });
      }
    }}
  >
    <SortableContext
      items={selectedImages.map((i) => i.previewUrl)}
      strategy={rectSortingStrategy}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {selectedImages.map((item, index) => (
          <SortableImage
            key={item.previewUrl}
            id={item.previewUrl}
            item={item}
            index={index}
            handleTitleChange={handleTitleChange}
            handleRemove={handleRemove}
            showTitleError={showTitleError}

          />
        
        ))}
      </div>
    </SortableContext>
  </DndContext>
)}
         {loading && (
  <div className="mb-2">
    <Progress value={progress} className="h-3 rounded-lg" />
  </div>
)}


<Button
  className="w-full mt-2"
  onClick={handleUpload}
  disabled={loading || selectedImages.length === 0} 
>
  {loading ? `Uploading ${progress}%` : "Upload All"}
</Button>

        </CardContent>
      </Card>
    </div>
    </>
  );
}

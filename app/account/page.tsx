'use client'
import { useEffect, useState } from "react";
import { deletImageById, editImageById, getImageById } from "../lib/api";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

import { ToastContainer,toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AccountPage() {
  const [images, setImages] = useState<securedImages[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [editTitle, setEditTitle] = useState("");
  const [newImageFile, setNewImageFile] = useState<File | "">("");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [imageId , setImageId] = useState<string | undefined>("")
  const [titleError, setTitleError] = useState("");




  async function handleDelete(id:string | undefined){
    const res = await deletImageById(id)
    if(res.data.success){
      setImages(prev => prev.filter(img => img._id !== id));
      toast.success(res.data.message)
    }else{
      toast.error(res.data.message);
    }
  }

  async function handleUpdate(id: string | undefined) {
   
    if (!id) return;
  
    // 1. Validate title
    if (!editTitle.trim()) {
      setTitleError("Title cannot be empty");
      return;
    } else {
      setTitleError("");
    }
  
    let imageUrl = selectedImage; // default: existing image
  
    try {
      if (newImageFile) {
        const formData = new FormData();
        formData.append("file", newImageFile);
        formData.append("upload_preset", "levelup-full");
        formData.append("cloud_name", "levelup-full");
  
        const res = await fetch(
          "https://api.cloudinary.com/v1_1/levelup-full/image/upload",
          { method: "POST", body: formData }
        );
  
        const data = await res.json();
        imageUrl = data.secure_url;
      }
  
  
      const res = await editImageById(id, editTitle ,imageUrl)
      console.log("hehe",res)
      if (res.data.success) {
        setImages((prev) =>
          prev.map((img) =>
            img._id === id
              ? { ...img, title: editTitle, url: imageUrl }
              : img
          )
        );
        toast.success("Image updated successfully");
        setEditTitle(""); 
        setNewImageFile("");
        setIsEditOpen(false);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong, try again!");
    }
  }
  

  async function getImageData(page = 1, limit = 10) {
    const res = await getImageById(page, limit );
    if (res.data.success) {
      setImages(res.data.data.images);   
      setTotalPages(res.data.data.totalPages);
      setCurrentPage(page);
    }
  }
  
  useEffect(() => {
    getImageData()
  },[currentPage])
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
      <div className="bg-white rounded-lg shadow-sm border p-5 mt-6">
        <h2 className="text-lg font-semibold mb-4">Your Uploaded Images</h2>
  
        <table className="w-full text-sm border-collapse">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="text-left py-2 px-3">Image</th>
              <th className="text-left py-2 px-3">Title</th>
              <th className="py-2 px-3 text-right">Actions</th>
            </tr>
          </thead>
  
          <tbody>
            {images.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-4 text-gray-500">
                  No images found.
                </td>
              </tr>
            ) : (
              images.map((img,index) => (
                <tr key={index} className="border-b">
                  <td className="py-2 px-3">
                    <img
                      src={img.url}
                      alt={img.title}
                      className="w-14 h-14 rounded object-cover border"
                    />
                  </td>
                  <td className="py-2 px-3">{img.title}</td>
                  <td className="py-2 px-3 text-right space-x-3">
                  <button
      onClick={() => {
        setImageId(img._id)
        setSelectedImage(img.url);
        setEditTitle(img.title);
        setNewImageFile("");
        setIsEditOpen(true)
      }}
      className="text-blue-600 hover:underline"
    >
      Edit
    </button>
                    <AlertDialog>
    <AlertDialogTrigger asChild>
      <button className="text-red-600 hover:underline"
        >
        Delete
      </button>
    </AlertDialogTrigger>

    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
        <AlertDialogDescription>
          This will permanently delete the image. This action cannot be undone.
        </AlertDialogDescription>
      </AlertDialogHeader>

      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction onClick={() => handleDelete(img._id)}>
          Yes, Delete
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
  
        {/* Pagination */}
        <div className="flex justify-center items-center gap-4 mt-5">
          <button
            disabled={currentPage === 1}
            onClick={() => getImageData(currentPage - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
  
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
  
          <button
            disabled={currentPage === totalPages}
            onClick={() => getImageData(currentPage + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen} >
  <DialogTrigger asChild>
   
  </DialogTrigger>


  <DialogContent>
  <DialogHeader>
    <DialogTitle>Edit Image</DialogTitle>
  </DialogHeader>

  <div className="space-y-4">
    <div>
      <label className="block text-sm font-medium mb-1">Title</label>
      <input
        type="text"
        value={editTitle}
        onChange={(e) => setEditTitle(e.target.value)}
        className="w-full border rounded px-3 py-2"
      />
      {titleError && (
    <p className="text-red-500 text-sm mt-1">{titleError}</p>
  )}
    </div>

    {/* Show Current Image */}
    <div>
      <label className="block text-sm font-medium mb-1">Current Image</label>
      <img
        src={newImageFile ? URL.createObjectURL(newImageFile) : selectedImage}
        className="w-24 h-24 object-cover border rounded"
      />
    </div>

    {/* File Input for New Image */}
    <div>
      <label className="block text-sm font-medium mb-1">Change Image</label>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setNewImageFile(e.target.files?.[0] || "")}
        className="w-full border rounded px-3 py-2"
      />
    </div>
  </div>

  <DialogFooter>
  <DialogClose asChild>
    <button className="border px-4 py-1 rounded">
      Cancel
    </button>
  </DialogClose>

  <button
    onClick={() => handleUpdate(imageId)}
    className="bg-blue-600 text-white px-4 py-1 rounded"
  >
    Save
  </button>
</DialogFooter>

</DialogContent>

  </Dialog>

    </>
  );
  
  }
  
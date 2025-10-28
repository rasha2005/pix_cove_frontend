"use client"

import { useEffect, useState } from "react";
import { getAllImages } from "./lib/api";
import Header from "@/components/common/Header";

export default function Home() {
  const [images ,setImages] = useState<securedImages[]>([])
  async function getData() {
    const res = await getAllImages();
   if(res.data.success)
    setImages(res.data.data)
  }
  useEffect(() => {
    getData()
  })
  return (
    <>
      <Header />
      <div className="p-6 columns-2 sm:columns-3 lg:columns-4 xl:columns-5 gap-4">
        {images.map((img:securedImages,index:number) => (
          <div 
            key={index} 
            className="mb-4 break-inside-avoid"
          >
            <div className="rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-gray-800 relative group">
              {/* Image */}
              <img 
                src={img.url} 
                alt={img.title} 
                className="w-full h-auto object-cover cursor-pointer" 
              />
              
              {/* Image Title Overlay */}
              <div 
                className="absolute top-0 left-0 right-0 p-2 
                           bg-gradient-to-b from-black/70 via-black/40 to-transparent
                           text-white text-sm font-semibold text-center
                           opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                {img.title}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}


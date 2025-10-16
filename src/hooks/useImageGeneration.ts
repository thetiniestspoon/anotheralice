import { useState, useEffect } from 'react';

export interface GeneratedImage {
  imageUrl: string;
  chapterNumber: number;
  timestamp: string;
  textContext: string;
}

const STORAGE_KEY = 'another-alice-generated-images';

export const useImageGeneration = () => {
  const [images, setImages] = useState<GeneratedImage[]>([]);

  // Load images from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setImages(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading images from storage:', error);
    }
  }, []);

  // Save images to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(images));
    } catch (error) {
      console.error('Error saving images to storage:', error);
    }
  }, [images]);

  const addImage = (image: GeneratedImage) => {
    setImages(prev => [...prev, image]);
  };

  const removeImage = (timestamp: string) => {
    setImages(prev => prev.filter(img => img.timestamp !== timestamp));
  };

  const clearImages = () => {
    setImages([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    images,
    addImage,
    removeImage,
    clearImages,
  };
};

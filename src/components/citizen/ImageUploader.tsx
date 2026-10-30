import React, { useState, useRef } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { UploadCloud, Camera, X, Image as ImageIcon, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';

interface ImageUploaderProps {
  onImageUploaded: (url: string | null) => void;
  imageUrl?: string | null;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageUploaded,
  imageUrl
}) => {
  const [preview, setPreview] = useState<string | null>(imageUrl || null);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];

  const handleFile = async (file: File) => {
    setErrorMessage(null);

    // 1. Validation
    if (!ALLOWED_TYPES.includes(file.type) && !file.name.match(/\.(jpg|jpeg|png|webp|heic)$/i)) {
      setErrorMessage('Please upload a valid image file (JPEG, PNG, WebP)');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setErrorMessage(`Image size exceeds 5MB (${(file.size / (1024 * 1024)).toFixed(1)}MB). Please choose a smaller photo.`);
      return;
    }

    // 2. Local Preview immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      setPreview(dataUrl);
    };
    reader.readAsDataURL(file);

    // 3. Supabase upload if configured
    if (isSupabaseConfigured && supabase) {
      setIsUploading(true);
      try {
        const fileExt = file.name.split('.').pop() || 'jpg';
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
        const filePath = `reports/${fileName}`;

        const { data, error } = await supabase.storage
          .from('report-images')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (error) {
          console.warn('Supabase storage upload notice:', error.message);
          // Still pass preview so report is not blocked
          onImageUploaded(reader.result as string || null);
        } else {
          const { data: publicUrlData } = supabase.storage
            .from('report-images')
            .getPublicUrl(filePath);

          onImageUploaded(publicUrlData.publicUrl);
        }
      } catch (err: unknown) {
        console.warn('Storage upload error fallback:', err);
        onImageUploaded(reader.result as string || null);
      } finally {
        setIsUploading(false);
      }
    } else {
      // In synthetic demonstration mode, pass the preview data URL
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setPreview(dataUrl);
        onImageUploaded(dataUrl);
      };
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    onImageUploaded(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-[#263442] uppercase tracking-wider flex items-center gap-1.5">
          <Camera className="w-3.5 h-3.5 text-[#294563]" />
          <span>Upload Issue Photograph (Optional)</span>
        </label>
        <span className="text-[11px] text-[#687786]">Max 5MB • JPEG, PNG, WebP</span>
      </div>

      {preview ? (
        <div className="relative rounded-xl overflow-hidden border border-[#E3E7E8] bg-black/5 shadow-soft-sm group">
          <img
            src={preview}
            alt="Complaint site preview"
            className="w-full h-52 sm:h-64 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3">
            <div className="text-white text-xs flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Photograph Attached</span>
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="p-2 rounded-lg bg-black/70 hover:bg-[#B85D5D] text-white transition-colors"
              title="Remove image"
              aria-label="Remove photo"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={clsx(
            'flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl cursor-pointer transition-all min-h-[140px]',
            isDragOver
              ? 'border-[#294563] bg-[#294563]/5'
              : 'border-[#E3E7E8] bg-white hover:border-[#7189A4] hover:bg-[#F8F8F5]'
          )}
        >
          {isUploading ? (
            <div className="flex flex-col items-center space-y-2">
              <Loader2 className="w-8 h-8 text-[#294563] animate-spin" />
              <span className="text-xs font-semibold text-[#294563]">Processing image...</span>
            </div>
          ) : (
            <>
              <div className="p-3 rounded-xl bg-[#F0F2EF] text-[#294563] mb-2 shadow-soft-sm">
                <UploadCloud className="w-6 h-6 text-[#7189A4]" />
              </div>
              <div className="text-xs font-semibold text-[#294563] text-center">
                Click or drag & drop to upload a photo
              </div>
              <div className="text-[11px] text-[#687786] text-center mt-1">
                Visual proof helps Gemini AI assess severity and speeds up municipal triage
              </div>
            </>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/heic"
            capture="environment"
            onChange={handleInputChange}
            className="hidden"
          />
        </div>
      )}

      {errorMessage && (
        <div className="p-2.5 rounded-lg bg-[#B85D5D]/10 border border-[#B85D5D]/30 text-xs text-[#B85D5D] flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};

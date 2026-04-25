'use client';

import dynamic from 'next/dynamic';
import { useMemo, useRef, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false }) as any;

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const quillRef = useRef<any>(null);

  const imageHandler = useCallback(() => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

      if (!cloudName || cloudName === 'your_cloud_name') {
        toast.error('Configure Cloudinary in .env.local first');
        return;
      }

      const toastId = toast.loading('Uploading image to Cloudinary...');

      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset || '');

      try {
        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          {
            method: 'POST',
            body: formData,
          }
        );
        const data = await res.json();

        if (data.secure_url) {
          const quill = quillRef.current?.getEditor();
          const range = quill?.getSelection();
          if (quill && range) {
            quill.insertEmbed(range.index, 'image', data.secure_url);
            toast.success('Image inserted!', { id: toastId });
          }
        } else {
          toast.error('Upload failed: ' + (data.error?.message || 'Check settings'), { id: toastId });
        }
      } catch (err) {
        toast.error('Error connecting to Cloudinary', { id: toastId });
      }
    };
  }, []);

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['link', 'image', 'code-block'],
        ['clean']
      ],
      handlers: {
        image: imageHandler
      }
    }
  }), [imageHandler]);

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list',
    'link', 'image', 'code-block'
  ];

  return (
    <div className="bg-white/5 border border-white/5 rounded-[32px] overflow-hidden editor-container">
      <ReactQuill 
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder || 'Start writing your story...'}
        className="text-lg leading-relaxed font-sans"
      />
    </div>
  );
}

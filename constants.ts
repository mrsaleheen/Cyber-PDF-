import { 
  FileImage, 
  Minimize2, 
  Combine, 
  Scissors, 
  FileType, 
  Image, 
  FileOutput, 
  Stamp, 
  Lock, 
  Eye, 
  Edit3 
} from 'lucide-react';

export enum ToolId {
  PHOTO_TO_PDF = 'photo-to-pdf',
  COMPRESS_PDF = 'compress-pdf',
  MERGE_PDF = 'merge-pdf',
  SPLIT_PDF = 'split-pdf',
  PDF_TO_WORD = 'pdf-to-word',
  PDF_TO_IMAGE = 'pdf-to-image',
  IMAGE_TO_PDF = 'image-to-pdf',
  WATERMARK = 'watermark',
  PASSWORD = 'password',
  VIEWER = 'viewer',
  EDITOR = 'editor'
}

export interface ToolDef {
  id: ToolId;
  title: string;
  description: string;
  icon: any;
  actionText: string;
  accepts: string; // e.g., 'image/*' or '.pdf'
  multiple: boolean;
}

export const TOOLS: ToolDef[] = [
  {
    id: ToolId.PHOTO_TO_PDF,
    title: 'Photo to PDF',
    description: 'Convert JPG/PNG images into a single PDF document instantly.',
    icon: FileImage,
    actionText: 'Convert Photos',
    accepts: 'image/*',
    multiple: true
  },
  {
    id: ToolId.COMPRESS_PDF,
    title: 'PDF Compressor',
    description: 'Reduce file size while maintaining document quality.',
    icon: Minimize2,
    actionText: 'Compress PDF',
    accepts: '.pdf',
    multiple: false
  },
  {
    id: ToolId.MERGE_PDF,
    title: 'Merge PDF',
    description: 'Combine multiple PDF files into one organized document.',
    icon: Combine,
    actionText: 'Merge Files',
    accepts: '.pdf',
    multiple: true
  },
  {
    id: ToolId.SPLIT_PDF,
    title: 'Split PDF',
    description: 'Extract pages or split a PDF into multiple separate files.',
    icon: Scissors,
    actionText: 'Split PDF',
    accepts: '.pdf',
    multiple: false
  },
  {
    id: ToolId.PDF_TO_WORD,
    title: 'PDF to Word',
    description: 'Convert PDF documents to editable Word files.',
    icon: FileType,
    actionText: 'Convert to Word',
    accepts: '.pdf',
    multiple: false
  },
  {
    id: ToolId.PDF_TO_IMAGE,
    title: 'PDF to Image',
    description: 'Extract pages as high-quality JPG or PNG images.',
    icon: Image,
    actionText: 'Convert to Images',
    accepts: '.pdf',
    multiple: false
  },
  {
    id: ToolId.IMAGE_TO_PDF,
    title: 'Image to PDF',
    description: 'Turn your scanned images into a professional PDF.',
    icon: FileOutput,
    actionText: 'Create PDF',
    accepts: 'image/*',
    multiple: true
  },
  {
    id: ToolId.WATERMARK,
    title: 'Add Watermark',
    description: 'Stamp text or images over your PDF pages for security.',
    icon: Stamp,
    actionText: 'Apply Watermark',
    accepts: '.pdf',
    multiple: false
  },
  {
    id: ToolId.PASSWORD,
    title: 'Lock / Unlock',
    description: 'Encrypt with password or remove security restrictions.',
    icon: Lock,
    actionText: 'Process Security',
    accepts: '.pdf',
    multiple: false
  },
  {
    id: ToolId.VIEWER,
    title: 'PDF Viewer',
    description: 'High-speed secure viewer with annotation capabilities.',
    icon: Eye,
    actionText: 'View PDF',
    accepts: '.pdf',
    multiple: false
  },
  {
    id: ToolId.EDITOR,
    title: 'Full Editor',
    description: 'Edit text, shapes, and layout with advanced tools.',
    icon: Edit3,
    actionText: 'Open Editor',
    accepts: '.pdf',
    multiple: false
  }
];
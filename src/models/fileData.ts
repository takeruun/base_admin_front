export interface FileDataType {
  id: number;
  name: string;
  fileType: FileType;
  capacity: number;
  width: number;
  height: number;
  description: string;
  mainUrl: string;
  thumbnailUrl: string;
  createdAt: string;
}

export type FileType = 'JPEG' | 'JPG' | 'PNG' | 'PDF';
export const JPEG = 'JPEG';
export const JPG = 'JPG';
export const PNG = 'PNG';
export const PDF = 'PDF';

export const fileTypes = [
  {
    value: 1,
    label: 'JPEG'
  },
  {
    value: 2,
    label: 'JPG'
  },
  {
    value: 3,
    label: 'PNG'
  },
  {
    value: 4,
    label: 'PDF'
  }
];

export const getImageFileTypes = (): number[] => {
  return [1, 2, 3];
};

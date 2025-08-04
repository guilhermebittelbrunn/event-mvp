export interface UploadFilePayload {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size?: number;
  destination?: string;
  filename?: string;
  path: string;
  buffer?: Buffer;
  stream?: NodeJS.ReadableStream;
}

export interface IFileStoreService {
  upload(file: UploadFilePayload): Promise<string>;
  delete(pathname: string): Promise<void>;
}

export const IFileStoreServiceSymbol = Symbol('IFileStoreService');

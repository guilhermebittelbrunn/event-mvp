import { File } from '@nest-lab/fastify-multer';

export class ReplaceFileDTO {
  oldFileId?: string;
  file: File;
}

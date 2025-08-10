import { File } from '@nest-lab/fastify-multer';

export class ReplaceFileDTO {
  entityId: string;
  oldFileId?: string;
  file: File;
}

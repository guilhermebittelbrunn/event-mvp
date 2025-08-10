import { File } from '@nest-lab/fastify-multer';

export class AddFileDTO {
  entityId: string;
  file: File;
}

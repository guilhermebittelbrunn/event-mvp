import { File } from '@nest-lab/fastify-multer';

import Event from '@/module/event/domain/event/event';

export class AddFileDTO {
  file: File;
  /** @note if provided, the file path will be built using the event id and slug */
  event?: Event;
}

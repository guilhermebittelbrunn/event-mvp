import { File } from '@nest-lab/fastify-multer';
import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';

export const MAX_FILE_SIZE_MB = 1;
export const MAX_FILE_SIZE = MAX_FILE_SIZE_MB * 1024 * 1024;
export const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'application/pdf', 'image/webp'];

/**
 * util to validate file types and sizes
 */
@Injectable()
export class FileValidatorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const files = request.files;

    if (!files) {
      throw new BadRequestException('Nenhum arquivo foi enviado.');
    }

    Object.entries(files).forEach(([key, fileArray]: [string, any]) => {
      fileArray.forEach((file: File) => {
        if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
          throw new BadRequestException(
            `Tipo de arquivo inválido para ${file?.originalname ?? key}. Permitidos: PDF, JPG, PNG`,
          );
        }

        if (file.size > MAX_FILE_SIZE) {
          throw new BadRequestException(
            `Arquivo ${file?.originalname ?? key} excede o tamanho máximo de ${MAX_FILE_SIZE_MB}MB.`,
          );
        }
      });
    });

    return next.handle();
  }
}

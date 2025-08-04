import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger/dist/decorators/api-property.decorator';

export const ApiUUIDProperty = (options?: ApiPropertyOptions) =>
  ApiProperty({ type: 'string', format: 'uuid', ...options });

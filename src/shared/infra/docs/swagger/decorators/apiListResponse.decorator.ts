import { ApiResponse, getSchemaPath } from '@nestjs/swagger';

import { ListResponseDTO } from '@/shared/types/common';

/**
 *
 * @param domainDTO The entity class that be in data[] property
 * @param description  The title of the response
 */
export function ApiListResponse(domainDTO: any, description?: string) {
  return ApiResponse({
    status: 200,
    description: description ?? `List response of ${domainDTO.name}`,
    schema: {
      allOf: [
        { $ref: getSchemaPath(ListResponseDTO<typeof domainDTO>) },
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: getSchemaPath(domainDTO) },
            },
          },
        },
      ],
    },
  });
}

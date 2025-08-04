import MapperInterface from './MapperInterface';

import { AllOptional } from '@/shared/types/common';

export default abstract class Mapper<Domain, Entity, DTO = void>
  implements MapperInterface<Domain, Entity, DTO>
{
  abstract toDomain(entity: Entity): Domain;

  abstract toPersistence(domain: AllOptional<Domain>): Promise<AllOptional<Entity>> | AllOptional<Entity>;

  toDomainOrNull(entity: Entity | null | undefined): Domain | null {
    return entity ? this.toDomain(entity) : null;
  }

  toDomainOrUndefined(entity: Entity | null | undefined): Domain | undefined {
    return entity ? this.toDomain(entity) : undefined;
  }

  toPersistenceNull(
    domain: AllOptional<Domain> | null | undefined,
  ): Promise<AllOptional<Entity>> | AllOptional<Entity> | null {
    return domain ? this.toPersistence(domain) : null;
  }

  toPersistenceOrUndefined(
    domain: AllOptional<Domain> | null | undefined,
  ): Promise<AllOptional<Entity>> | AllOptional<Entity> | null {
    return domain ? this.toPersistence(domain) : undefined;
  }

  toDTO(domain: Domain): DTO {
    return this.toDTO(domain);
  }

  toDTOOrNull(domain: Domain | null | undefined): DTO | null {
    return domain ? this.toDTO(domain) : null;
  }

  toDTOOrUndefined(domain: Domain | null | undefined): DTO | undefined {
    return domain ? this.toDTO(domain) : undefined;
  }
}

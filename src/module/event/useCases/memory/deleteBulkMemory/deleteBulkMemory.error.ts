import GenericErrors from '@/shared/core/logic/genericErrors';

export namespace DeleteBulkMemoryErrors {
  export class MaxMemoryIdsToDeleteExceeded extends GenericErrors.InvalidParam {
    constructor(maxMemoryIdsToDelete: number) {
      super(`Você pode deletar no máximo ${maxMemoryIdsToDelete} memórias por vez`);
    }
  }

  export class MemoriesNotFound extends GenericErrors.InvalidParam {
    constructor() {
      super(`Algumas memórias não foram encontradas, atualize a página e tente novamente`);
    }
  }

  export class MemoriesNotDeleted extends GenericErrors.Conflict {
    constructor() {
      super('Erro ao deletar memórias, tente novamente mais tarde ou entre em contato com o suporte');
    }
  }
}

export default DeleteBulkMemoryErrors;

import GenericErrors from '@/shared/core/logic/genericErrors';

export namespace DownloadMemoriesErrors {
  export class MaxMemoryIdsToDownloadExceeded extends GenericErrors.InvalidParam {
    constructor(maxMemoryIdsToDownload: number) {
      super(`Você pode baixar no máximo ${maxMemoryIdsToDownload} memórias por vez`);
    }
  }

  export class MemoriesNotFound extends GenericErrors.InvalidParam {
    constructor() {
      super(`Algumas memórias não foram encontradas, atualize a página e tente novamente`);
    }
  }

  export class NoFilesToDownload extends GenericErrors.InvalidParam {
    constructor() {
      super(`Nenhum arquivo encontrado para download`);
    }
  }
}

export default DownloadMemoriesErrors;

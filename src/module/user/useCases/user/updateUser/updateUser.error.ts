import GenericErrors from '@/shared/core/logic/GenericErrors';

export namespace UpdateUserErrors {
  export class NotFoundError extends GenericErrors.NotFound {
    constructor() {
      super(`Usuário não encontrado`);
    }
  }

  export class EmailAlreadyInUse extends GenericErrors.Conflict {
    constructor(email: string) {
      super(`E-mail já em uso: ${email}`);
    }
  }
}

export default UpdateUserErrors;

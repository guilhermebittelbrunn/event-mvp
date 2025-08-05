import GenericErrors from '@/shared/core/logic/genericErrors';

export namespace SignInErrors {
  export class NotFoundError extends GenericErrors.NotFound {
    constructor() {
      super(`Usuário não encontrado`);
    }
  }

  export class InvalidCredentials extends GenericErrors.NotAuthorized {
    constructor() {
      super(`Credenciais inválidas`);
    }
  }
}

export default SignInErrors;

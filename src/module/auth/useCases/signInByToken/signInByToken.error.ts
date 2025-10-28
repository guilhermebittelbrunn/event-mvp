import GenericErrors from '@/shared/core/logic/genericErrors';

export namespace SignInByTokenErrors {
  export class InvalidToken extends GenericErrors.NotAuthorized {
    constructor() {
      super('Token de acesso inválido ou expirado');
    }
  }
}

export default SignInByTokenErrors;

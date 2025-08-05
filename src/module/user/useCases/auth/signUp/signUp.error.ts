import GenericErrors from '@/shared/core/logic/genericErrors';

export namespace SignUpErrors {
  export class EmailAlreadyInUse extends GenericErrors.Conflict {
    constructor(email: string) {
      super(`E-mail já em uso: ${email}`);
    }
  }
}

export default SignUpErrors;

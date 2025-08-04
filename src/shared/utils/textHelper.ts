export function stripNonDigits(value: string): string {
  return value.replace(/\D/g, '');
}

export function formatPhoneNumber(value: string): string {
  const digits = stripNonDigits(value);

  if (digits.length === 11) {
    return digits.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }

  if (digits.length === 10) {
    return digits.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }

  return value;
}

export function formatIdentificationNumber(value: string): string {
  const digits = stripNonDigits(value);

  if (digits.length === 11) {
    return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  if (digits.length === 14) {
    return digits.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }

  return value;
}

export function capitalizeFirstLetter(val: string): string {
  return String(val).charAt(0).toUpperCase() + String(val).toLocaleLowerCase().slice(1);
}

export function formatReal(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    currency: 'BRL',
    style: 'currency',
  }).format(value);
}

export function formatFloat(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatInteger(value: number) {
  return new Intl.NumberFormat('pt-BR').format(value);
}

export function formatPercentage(decimal: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    maximumFractionDigits: 2,
  }).format(decimal);
}

export function validateIdentificationNumber(number: string): boolean {
  const cleanNumber = stripNonDigits(number);

  // Determine the type of identification number based on its length
  if (cleanNumber.length === 11) {
    // CPF has 11 digits
    return validateCpf(cleanNumber);
  } else if (cleanNumber.length === 14) {
    // CNPJ has 14 digits
    return validateCNPJ(cleanNumber);
  }

  // Invalid number length
  return false;
}

export function validateCpf(cpf: string) {
  // Remove any non-digit characters from the CPF
  const cleanCPF = stripNonDigits(cpf);

  // CPF must have exactly 11 digits
  if (cleanCPF.length !== 11) {
    return false;
  }

  // CPF cannot be composed of a single repeated digit
  if (/^(\d)\1+$/.test(cleanCPF)) {
    return false;
  }

  // Calculate the first verification digit
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
  }
  let verificationDigit1 = 11 - (sum % 11);
  if (verificationDigit1 >= 10) {
    verificationDigit1 = 0;
  }

  // Calculate the second verification digit
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
  }
  let verificationDigit2 = 11 - (sum % 11);
  if (verificationDigit2 >= 10) {
    verificationDigit2 = 0;
  }

  // Check if the calculated verification digits match the provided ones
  return (
    verificationDigit1 === parseInt(cleanCPF.charAt(9)) && verificationDigit2 === parseInt(cleanCPF.charAt(10))
  );
}

export function validateCNPJ(cnpj: string): boolean {
  // Remove any non-digit characters from the CNPJ
  const cleanCNPJ = stripNonDigits(cnpj);

  // CNPJ must have exactly 14 digits
  if (cleanCNPJ.length !== 14) {
    return false;
  }

  // Validate the first verification digit
  let sum = 0;
  let factor = 5;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(cleanCNPJ.charAt(i)) * factor;
    factor = factor === 2 ? 9 : factor - 1;
  }
  const verificationDigit1 = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (verificationDigit1 !== parseInt(cleanCNPJ.charAt(12))) {
    return false;
  }

  // Validate the second verification digit
  sum = 0;
  factor = 6;
  for (let i = 0; i < 13; i++) {
    sum += parseInt(cleanCNPJ.charAt(i)) * factor;
    factor = factor === 2 ? 9 : factor - 1;
  }
  const verificationDigit2 = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (verificationDigit2 !== parseInt(cleanCNPJ.charAt(13))) {
    return false;
  }

  // All checks passed, the CNPJ is valid
  return true;
}

export function validateCNH(cnh: string): boolean {
  // Remove any non-digit characters from the CNH
  const cleanCNH = stripNonDigits(cnh);

  // CNH must have exactly 11 digits
  if (cleanCNH.length !== 11) {
    return false;
  }

  // CNH cannot be composed of a single repeated digit
  if (/^(\d)\1+$/.test(cleanCNH)) {
    return false;
  }

  // CNH must have the format 'XXXXXXXXXXX' or 'XXXXXXXXXXXX'
  if (!/^\d{11}$/.test(cleanCNH)) {
    return false;
  }

  // All checks passed, the CNH is valid
  return true;
}

export function dateIfString(date: Date | string): Date {
  if (typeof date === 'string') {
    return new Date(date);
  }

  return date;
}

export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  if (typeof date === 'string') {
    return new Intl.DateTimeFormat('pt-BR', { timeZone: process.env.TZ, ...options }).format(new Date(date));
  }

  return new Intl.DateTimeFormat('pt-BR', { timeZone: process.env.TZ, ...options }).format(date);
}

export function formatDateToDb(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  const actualDate = dateIfString(date);

  return new Intl.DateTimeFormat('en-CA', { timeZone: process.env.TZ, ...options }).format(actualDate);
}

export function formatTime(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  return formatDate(date, { timeStyle: 'short', ...options });
}

export function formatDateTime(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  return formatDate(date, { dateStyle: 'short', timeStyle: 'short', ...options });
}

export function getDateYearAndMonth(date: Date | string): string {
  const parsedDate = dateIfString(date);
  const currentMonth = parsedDate.getMonth() + 1;
  const parsedMonth = currentMonth < 10 ? `0${currentMonth}` : currentMonth;

  return `${parsedDate.getFullYear()}-${parsedMonth}`;
}

export function areEqualDates(d1: Date, d2: Date): boolean {
  return (
    d1.getDate() === d2.getDate() && d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear()
  );
}

/**
 * @note Hoje percebo que bastaria concatenar ano-mes-dia em um número e
 * ver se um é maior que o outro. Fazer isso e testar em algum momento.
 */
export function isDateBefore(maybePast: Date | string, maybeFuture: Date | string): boolean {
  const past = dateIfString(maybePast);
  const future = dateIfString(maybeFuture);

  if (past.getFullYear() > future.getFullYear()) {
    return false;
  }
  // se o ano já for maior não precisamos validar os niveis abaixo
  if (past.getFullYear() < future.getFullYear()) {
    return true;
  }

  // chegando aqui, quer dizer que os anos são iguais
  if (past.getMonth() > future.getMonth()) {
    return false;
  }
  // se o mês já for maior não precisamos validar os niveis abaixo
  if (past.getMonth() < future.getMonth()) {
    return true;
  }

  // chegando aqui, quer dizer que os meses são iguais
  if (past.getDate() < future.getDate()) {
    return true;
  }

  return false;
}

/**
 * @note Hoje percebo que bastaria concatenar ano-mes-dia em um número e
 * ver se um é maior que o outro. Fazer isso e testar em algum momento.
 */
export function isDateAfter(maybeFuture: Date, maybePast: Date): boolean {
  if (maybeFuture.getFullYear() < maybePast.getFullYear()) {
    return false;
  }
  // se o ano já for maior não precisamos validar os niveis abaixo
  if (maybeFuture.getFullYear() > maybePast.getFullYear()) {
    return true;
  }

  // chegando aqui, quer dizer que os anos são iguais
  if (maybeFuture.getMonth() < maybePast.getMonth()) {
    return false;
  }
  // se o mês já for maior não precisamos validar os niveis abaixo
  if (maybeFuture.getMonth() > maybePast.getMonth()) {
    return true;
  }

  // chegando aqui, quer dizer que os meses são iguais
  if (maybeFuture.getDate() > maybePast.getDate()) {
    return true;
  }

  return false;
}

/**
 * @note Hoje percebo que bastaria concatenar hora-minuto-milissegundo em um número e
 * ver se um é maior que o outro. Fazer isso e testar em algum momento.
 */
export function isTimeBefore(maybePast: Date, maybeFuture: Date): boolean {
  if (maybePast.getHours() > maybeFuture.getHours()) {
    return false;
  }
  // se a hora já for maior não precisamos validar os niveis abaixo
  if (maybePast.getHours() < maybeFuture.getHours()) {
    return true;
  }

  // chegando aqui, quer dizer que as horas são iguais
  if (maybePast.getMinutes() > maybeFuture.getMinutes()) {
    return false;
  }
  // se o minuto já for maior não precisamos validar os niveis abaixo
  if (maybePast.getMinutes() < maybeFuture.getMinutes()) {
    return true;
  }

  // chegando aqui, quer dizer que os minutos são iguais
  if (maybePast.getMilliseconds() < maybeFuture.getMilliseconds()) {
    return true;
  }

  return false;
}

/**
 * @note Hoje percebo que bastaria concatenar hora-minuto-milissegundo em um número e
 * ver se um é maior que o outro. Fazer isso e testar em algum momento.
 */
export function isTimeAfter(maybeFuture: Date, maybePast: Date): boolean {
  if (maybeFuture.getHours() < maybePast.getHours()) {
    return false;
  }
  // se a hora já for maior não precisamos validar os niveis abaixo
  if (maybeFuture.getHours() > maybePast.getHours()) {
    return true;
  }

  // chegando aqui, quer dizer que as horas são iguais
  if (maybeFuture.getMinutes() < maybePast.getMinutes()) {
    return false;
  }
  // se o minuto já for maior não precisamos validar os niveis abaixo
  if (maybeFuture.getMinutes() > maybePast.getMinutes()) {
    return true;
  }

  // chegando aqui, quer dizer que os minutos são iguais
  if (maybeFuture.getMilliseconds() > maybePast.getMilliseconds()) {
    return true;
  }

  return false;
}

export function isDateTimeBefore(maybePast: Date, maybeFuture: Date): boolean {
  return maybePast.getTime() < maybeFuture.getTime();
}

export function isDateTimeAfter(maybeFuture: Date, maybePast: Date): boolean {
  return maybeFuture.getTime() > maybePast.getTime();
}

export function addMinutesToDate(date: Date | string, minutes: number): Date {
  const actualDate = dateIfString(date);
  return new Date(actualDate.getTime() + minutes * 60000);
}

export function addDaysToDate(date: Date | string, days: number): Date {
  const actualDate = dateIfString(date);
  actualDate.setDate(actualDate.getDate() + days);
  return actualDate;
}

export function removeDaysToDate(date: Date | string, days: number): Date {
  const actualDate = dateIfString(date);
  actualDate.setDate(actualDate.getDate() - days);
  return actualDate;
}

export function differenceInDays(dateLeft: Date, dateRight: Date): number {
  const diffTime = dateLeft.getTime() - dateRight.getTime();

  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export const differenceInHours = (dateLeft: Date, dateRight: Date): number => {
  const diffTime = dateLeft.getTime() - dateRight.getTime();

  return Math.ceil(diffTime / (1000 * 60 * 60));
};

export const differenceInMinutes = (dateLeft: Date, dateRight: Date): number => {
  const diffTime = dateLeft.getTime() - dateRight.getTime();

  return Math.ceil(diffTime / (1000 * 60));
};

export function formatDecimal(
  percent: number,
  decimalScale = 2,
  locale = 'pt-BR',
  options?: Intl.NumberFormatOptions | undefined,
): string {
  return Intl.NumberFormat(locale, {
    style: 'decimal',
    minimumFractionDigits: decimalScale,
    maximumFractionDigits: decimalScale,
    ...options,
  }).format(percent || 0);
}

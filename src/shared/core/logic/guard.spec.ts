import { faker } from '@faker-js/faker/.';

import Guard from './guard';

describe('isValidDatetimeInterval', () => {
  it('should return success if relation between initial and end date is valid', () => {
    const result = Guard.isValidDatetimeInterval({
      initialDate: faker.date.recent(),
      endDate: faker.date.soon(),
    });

    expect(result.succeeded).toBeTruthy();
  });

  it('should return success if relation between initial and end datetime is valid', () => {
    const result = Guard.isValidDatetimeInterval({
      initialDate: new Date('2021-07-16'),
      endDate: new Date('2021-07-16'),
      initialHour: new Date('2021-07-16 08:00:00'),
      endHour: new Date('2021-07-16 10:00:00'),
    });

    expect(result.succeeded).toBeTruthy();
  });

  it('should return error if relation between initial and end date is invalid', () => {
    const result = Guard.isValidDatetimeInterval({
      initialDate: faker.date.soon(),
      endDate: faker.date.recent(),
    });

    expect(result.succeeded).toBeFalsy();
    expect(result.message).toBe('Data inicial não pode ser maior que a data final');
  });

  it('should return error if relation between initial and end datetime is invalid', () => {
    const result = Guard.isValidDatetimeInterval({
      initialDate: new Date('2021-07-16'),
      endDate: new Date('2021-07-16'),
      initialHour: new Date('2021-07-16 10:00:00'),
      endHour: new Date('2021-07-16 08:00:00'),
    });

    expect(result.succeeded).toBeFalsy();
    expect(result.message).toBe('Data/hora inicial não pode ser maior que a data/hora final');
  });
});

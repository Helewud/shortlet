import { resolveSvcFn, RespBase } from '.';

describe('resolveSvcFn Function', () => {
  test('should resolve a successful promise', async () => {
    const promise = Promise.resolve('Data Loaded');
    const result = await resolveSvcFn(promise, 'Success');
    expect(result).toEqual(new RespBase('Success', 'Data Loaded'));
  });

  test('should handle promise resolving with null', async () => {
    const promise = Promise.resolve(null);
    const result = await resolveSvcFn(promise, 'No Data');
    expect(result).toEqual(new RespBase('No Data', null));
  });

  test('should reject a promise with an error', async () => {
    expect.assertions(1);
    const promise = Promise.reject(new Error('Failure'));
    try {
      await resolveSvcFn(promise, 'Error');
    } catch (error) {
      expect(error.message).toBe('Failure');
    }
  });

  test('should reject a promise resolving with an Error instance', async () => {
    expect.assertions(1);
    const promise = Promise.resolve(new Error('Something went wrong'));
    try {
      await resolveSvcFn(promise, 'Error');
    } catch (error) {
      expect(error.message).toBe('Something went wrong');
    }
  });

  test('should resolve promise with non-error object', async () => {
    const promise = Promise.resolve({ success: true });
    const result = await resolveSvcFn(promise, 'Success');
    expect(result).toEqual(new RespBase('Success', { success: true }));
  });

  test('should handle empty string as message', async () => {
    const promise = Promise.resolve('Data Loaded');
    const result = await resolveSvcFn(promise, '');
    expect(result).toEqual(new RespBase('', 'Data Loaded'));
  });
});

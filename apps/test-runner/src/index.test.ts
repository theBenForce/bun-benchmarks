import { it, describe, expect } from '@jest/globals';

describe('sample tests', () => {
  it('should pass', () => {
    expect(1 + 1).toEqual(2);
  });

  it('should fail', () => {
    expect(1+1).toEqual(3);
  });
});
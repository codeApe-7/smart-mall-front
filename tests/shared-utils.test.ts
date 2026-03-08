import { describe, expect, it } from 'vitest';
import { ensureArray, formatCurrency, pickStatusTone } from '@shared/index';

describe('shared utils', () => {
  it('formats currency with yuan symbol', () => {
    expect(formatCurrency(18.5)).toBe('¥18.50');
  });

  it('normalizes nullable arrays', () => {
    expect(ensureArray(null)).toEqual([]);
    expect(ensureArray([1, 2])).toEqual([1, 2]);
  });

  it('maps tone hints for statuses', () => {
    expect(pickStatusTone(1)).toBe('success');
    expect(pickStatusTone('FAILED')).toBe('danger');
  });
});

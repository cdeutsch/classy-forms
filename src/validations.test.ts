import type { FormField, FormFields } from './interfaces';
import { validations } from './validations';

function field(value: unknown, overrides: Partial<FormField> = {}): FormField {
  return {
    value,
    hasError: false,
    errors: [],
    dirty: false,
    ...overrides,
  };
}

describe('validations', () => {
  let emptyFormFields: FormFields;

  beforeEach(() => {
    emptyFormFields = {};
  });

  describe('isDefaultRequiredValue', () => {
    it('is true for undefined, null, and empty string', () => {
      expect(validations.isDefaultRequiredValue(field(undefined), emptyFormFields, false)).toBe(true);
      expect(validations.isDefaultRequiredValue(field(null), emptyFormFields, false)).toBe(true);
      expect(validations.isDefaultRequiredValue(field(''), emptyFormFields, false)).toBe(true);
    });

    it('is false when value is present', () => {
      expect(validations.isDefaultRequiredValue(field('x'), emptyFormFields, false)).toBe(false);
      expect(validations.isDefaultRequiredValue(field(0), emptyFormFields, false)).toBe(false);
      expect(validations.isDefaultRequiredValue(field(false), emptyFormFields, false)).toBe(false);
    });
  });

  describe('matchRegexp', () => {
    it('passes when value is empty or missing (optional-style)', () => {
      expect(validations.matchRegexp(field(undefined), emptyFormFields, false, /^a$/)).toBe(true);
      expect(validations.matchRegexp(field(''), emptyFormFields, false, /^a$/)).toBe(true);
    });

    it('passes when regexp matches', () => {
      expect(validations.matchRegexp(field('abc'), emptyFormFields, false, /^abc$/)).toBe(true);
    });

    it('fails when regexp does not match', () => {
      expect(validations.matchRegexp(field('xyz'), emptyFormFields, false, /^abc$/)).toBe(false);
    });
  });

  describe('isEmail', () => {
    it('passes for plausible emails', () => {
      expect(validations.isEmail(field('a@b.co'), emptyFormFields, false)).toBe(true);
    });

    it('fails for non-emails when value is set', () => {
      expect(validations.isEmail(field('not-an-email'), emptyFormFields, false)).toBe(false);
    });

    it('passes when empty (treated as optional)', () => {
      expect(validations.isEmail(field(''), emptyFormFields, false)).toBe(true);
    });
  });

  describe('isTrue / isFalse', () => {
    it('isTrue passes only for strict true', () => {
      expect(validations.isTrue(field(true), emptyFormFields, false)).toBe(true);
      expect(validations.isTrue(field(false), emptyFormFields, false)).toBe(false);
      expect(validations.isTrue(field(1), emptyFormFields, false)).toBe(false);
    });

    it('isFalse passes only for strict false', () => {
      expect(validations.isFalse(field(false), emptyFormFields, false)).toBe(true);
      expect(validations.isFalse(field(true), emptyFormFields, false)).toBe(false);
    });
  });

  describe('equals / equalsField', () => {
    it('equals passes when value matches or empty', () => {
      expect(validations.equals(field('ok'), emptyFormFields, false, 'ok')).toBe(true);
      expect(validations.equals(field(''), emptyFormFields, false, 'x')).toBe(true);
    });

    it('equals fails when value differs', () => {
      expect(validations.equals(field('no'), emptyFormFields, false, 'ok')).toBe(false);
    });

    it('equalsField compares to sibling field', () => {
      const formFields: FormFields = {
        a: field('one'),
        b: field('one'),
      };
      expect(validations.equalsField(formFields.a, formFields, false, 'b')).toBe(true);
      formFields.b.value = 'other';
      expect(validations.equalsField(formFields.a, formFields, false, 'b')).toBe(false);
    });
  });

  describe('minLength / maxLength', () => {
    it('minLength passes for empty or length >= n', () => {
      expect(validations.minLength(field(''), emptyFormFields, false, 3)).toBe(true);
      expect(validations.minLength(field('abc'), emptyFormFields, false, 3)).toBe(true);
      expect(validations.minLength(field('ab'), emptyFormFields, false, 3)).toBe(false);
    });

    it('maxLength passes when length <= n', () => {
      expect(validations.maxLength(field('abc'), emptyFormFields, false, 3)).toBe(true);
      expect(validations.maxLength(field('abcd'), emptyFormFields, false, 3)).toBe(false);
    });
  });
});

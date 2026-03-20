import type { FormFieldConfig, FormFields } from './interfaces';
import { getFormFieldConfig, initializeFormFields, isValid, validateFormFields } from './FormsProvider';

describe('FormsProvider engine helpers', () => {
  describe('initializeFormFields', () => {
    it('creates a field per config with default init value', () => {
      const configs: FormFieldConfig[] = [
        { name: 'email', initValue: 'a@b.co' },
        { name: 'note' },
      ];
      const fields = initializeFormFields(configs);
      expect(fields.email.value).toBe('a@b.co');
      expect(fields.note.value).toBe('');
      expect(fields.email.hasError).toBe(false);
      expect(fields.note.hasError).toBe(false);
    });
  });

  describe('getFormFieldConfig', () => {
    it('returns config by name', () => {
      const configs: FormFieldConfig[] = [{ name: 'x' }];
      expect(getFormFieldConfig('x', configs).name).toBe('x');
    });

    it('throws when name is missing', () => {
      expect(() => getFormFieldConfig('nope', [{ name: 'x' }])).toThrow(/not found/);
    });
  });

  describe('isValid', () => {
    const configs: FormFieldConfig[] = [{ name: 'title', required: true }];

    it('adds required error when submitting with empty value', () => {
      const formFields = initializeFormFields(configs);
      const errors = isValid('title', formFields, configs, true);
      expect(errors).toContain('required');
    });

    it('skips required when not dirty and not submitting', () => {
      const formFields = initializeFormFields(configs);
      const errors = isValid('title', formFields, configs, false);
      expect(errors).not.toContain('required');
    });

    it('validates isEmail when configured', () => {
      const emailConfigs: FormFieldConfig[] = [{ name: 'email', isEmail: true }];
      const bad = initializeFormFields(emailConfigs);
      bad.email.value = 'bad';
      expect(isValid('email', bad, emailConfigs, true)).toContain('isEmail');
      bad.email.value = 'ok@example.com';
      expect(isValid('email', bad, emailConfigs, true)).not.toContain('isEmail');
    });
  });

  describe('validateFormFields', () => {
    it('sets hasError on required empty field when submitting', () => {
      const configs: FormFieldConfig[] = [{ name: 'title', required: true }];
      const formFields: FormFields = initializeFormFields(configs);
      const result = validateFormFields(formFields, configs, true);
      expect(result.stateModified).toBe(true);
      expect(result.allValid).toBe(false);
      expect(formFields.title.hasError).toBe(true);
      expect(formFields.title.errors).toContain('required');
    });

    it('reports allValid when field satisfies required', () => {
      const configs: FormFieldConfig[] = [{ name: 'title', required: true }];
      const formFields: FormFields = initializeFormFields(configs);
      formFields.title.value = 'hello';
      const result = validateFormFields(formFields, configs, true);
      expect(result.allValid).toBe(true);
      expect(formFields.title.hasError).toBe(false);
    });
  });
});

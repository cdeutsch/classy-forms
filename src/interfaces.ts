export type Value = any;

export type ErrorType =
  | 'isExisty'
  | 'isUndefined'
  | 'isEmptyString'
  | 'isEmail'
  | 'isUrl'
  | 'isTrue'
  | 'isFalse'
  | 'isNumeric'
  | 'isAlpha'
  | 'isAlphanumeric'
  | 'isInt'
  | 'isFloat'
  | 'isWords'
  | 'isSpecialWords'
  | 'equals'
  | 'equalsField'
  | 'isLength'
  | 'matchRegexp'
  | 'maxLength'
  | 'minLength'
  | 'required'
  | 'isValid';

export interface FormFieldConfig {
  name: string;
  value?: Value;
  label?: string;
  // error?: boolean;
  // dirty?: boolean;

  // Validations:
  required?: boolean;
  isExisty?: boolean;
  isUndefined?: boolean;
  isEmptyString?: boolean;
  isEmail?: boolean;
  isUrl?: boolean;
  isTrue?: boolean;
  isFalse?: boolean;
  isNumeric?: boolean;
  isAlpha?: boolean;
  isAlphanumeric?: boolean;
  isInt?: boolean;
  isFloat?: boolean;
  isWords?: boolean;
  isSpecialWords?: boolean;
  equals?: Value;
  equalsField?: string;
  isLength?: number;
  matchRegexp?: RegExp;
  maxLength?: number;
  minLength?: number;

  isValid?(formField: FormField, formFields: FormFields, submitting?: boolean): boolean;
  getHelperText?(formField: FormField, submitting?: boolean): string;
  getLabel?(formField: FormField, submitting?: boolean): string;
}

export interface FormField {
  name: string;
  value: Value;
  hasError: boolean;
  errors: ErrorType[];
  required: boolean;
  dirty: boolean;
  helperText?: string;
  label?: string;
}

export interface FormFieldWithHelpers extends FormField {
  onChange(event: React.ChangeEvent<HTMLInputElement>): void;
  onBlur(event: React.FocusEvent<HTMLInputElement>): void;
}

export type FormFields<T extends string = string> = Record<T, FormField>;

export type FormFieldsWithHelpers<T extends string = string> = Record<T, FormFieldWithHelpers>;

export interface FormsProviderProps<T extends string = string> {
  formFieldConfigs: FormFieldConfig[];
  initFormFields?: FormFields<T>;
  onSubmit?(event: React.FormEvent<HTMLFormElement>): void;
}

export interface FormsContextContext<T extends string = string> {
  formFields: FormFieldsWithHelpers<T>;

  onSubmit(event: React.FormEvent<HTMLFormElement>): void;
}

export interface ValidationResult {
  allValid: boolean;
  stateModified: boolean;
}

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
  | 'isValid'
  | 'isInitError';

export type DirtyMode = 'NotEqual' | 'OnChange';

export interface FormObject {
  [key: string]: any;
}

export interface FormOptions {
  /**
   * Mode to use when calculating `dirty`. Default is `NotEqual`.
   */
  dirtyMode?: DirtyMode;
  /**
   * Run validation `onChange` instead of waiting for submit.
   */
  validateOnChange?: boolean;
  /**
   * Function to use to compare equality. Used to calculate `dirty`.
   */
  isEqual?(valueA: Value, valueB: Value): boolean;
}

export interface FormFieldConfig {
  name: string;
  label?: string;
  validateOnChange?: boolean;

  // Props used to initialize FormFields:
  initValue?: Value;
  initHasError?: boolean;
  initErrors?: ErrorType[];
  initDirty?: boolean;

  // Helper Text:
  helperText?: string; // Helper text to display on validation. Overridden by invalidText when invalid, and getHelperText if both exist.
  invalidText?: string; // Helper text displayed on error. Overridden by getHelperText if both exist.

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
  getHelperText?(formField: FormField, formFields: FormFields, submitting?: boolean): string | undefined;
}

export interface FormField {
  value: Value;
  hasError: boolean;
  errors: ErrorType[];
  dirty: boolean;
  helperText?: string;
}

export interface FormFieldHelpers {
  name: string;
  required: boolean;
  label?: string;
}

export interface FormFieldEventHelpers {
  onChange(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void;
  onChangeChecked(event: React.ChangeEvent<HTMLInputElement>): void;
  onBlur(): void;
  onChangeValue(value: Value): void;
  forceValidate(): ForceValidationResult;
}

export interface FormFieldAndState extends FormField, FormFieldEventHelpers {}

export interface FormFieldAndHelpers extends FormField, FormFieldHelpers {}

export interface FormFieldAndEventHelpers extends FormField, FormFieldHelpers, FormFieldEventHelpers {}

export type FormFields<T = FormObject> = Record<Extract<keyof T, string>, FormField>;

export type FormFieldsState<T = FormObject> = Record<Extract<keyof T, string>, FormFieldAndState>;

export type FormFieldsWithHelpers<T = FormObject> = Record<Extract<keyof T, string>, FormFieldAndHelpers>;

export type FormFieldsWithEventHelpers<T = FormObject> = Record<Extract<keyof T, string>, FormFieldAndEventHelpers>;

export interface FormsProviderProps<T = FormObject> {
  formKey?: string | number;
  formFieldConfigs: FormFieldConfig[];
  options?: FormOptions;
  onSubmit?(
    event: React.FormEvent<HTMLFormElement>,
    formFields: FormFieldsWithEventHelpers<T>,
    reset: () => void,
    isDirty: () => boolean
  ): void;
  onIsDirtyChange?(isDirty: boolean, formFields: FormFieldsWithEventHelpers<T>): void;
}

export interface FormsProviderState {
  formFields: FormFieldsState;
  formKey?: string | number;
}

export interface FormsContextContext<T = FormObject> {
  formFields: FormFieldsWithEventHelpers<T>;

  onSubmit(event: React.FormEvent<HTMLFormElement>): void;
  reset(): void;
  validate(submitting: boolean): ValidationResult;
  isDirty(): boolean;
}

export interface ValidationResult {
  allValid: boolean;
  stateModified: boolean;
}

export interface ForceValidationResult extends ValidationResult {
  fieldDirty: boolean;
  fieldErrors: ErrorType[];
  fieldValid: boolean;
}

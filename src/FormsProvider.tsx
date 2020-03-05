import React from 'react';

import {
  ErrorType,
  FormField,
  FormFieldConfig,
  FormFields,
  FormFieldsWithHelpers,
  FormsContextContext,
  FormsProviderProps,
  ValidationResult,
  Value,
} from './interfaces';
import { validations } from './validations';

export const FormsContext = React.createContext<FormsContextContext>({
  formFields: {},
  // tslint:disable-next-line: no-empty
  onSubmit: () => {},
  // tslint:disable-next-line: no-empty
  reset: () => {},
  // tslint:disable-next-line: no-empty
  isDirty: () => {
    return false;
  },
});

export const FormsConsumer = FormsContext.Consumer;

export class FormsProvider extends React.Component<FormsProviderProps, FormsContextContext> {
  constructor(props: FormsProviderProps) {
    super(props);

    // Create formFields or use initial.
    const formFields = props.initFormFields || createFormFields(props.formFieldConfigs);

    // Augment FormFields with events (helpers).
    const formFieldsWithHelpers: FormFieldsWithHelpers = {};

    Object.keys(formFields).forEach((key) => {
      const formField = formFields[key];

      formFieldsWithHelpers[key] = {
        ...formField,
        onChange: this.onChange.bind(this, key),
        onBlur: this.onBlur.bind(this, key),
        onChangeValue: this.onChangeValue.bind(this, key),
      };
    });

    this.state = {
      formFields: formFieldsWithHelpers,
      onSubmit: this.onSubmit,
      reset: this.reset,
      isDirty: this.isDirty,
    };
  }

  render() {
    return <FormsContext.Provider value={this.state}>{this.props.children}</FormsContext.Provider>;
  }

  onChangeValue = (name: string, value: Value) => {
    const { formFields } = this.state;
    const { formFieldConfigs, options } = this.props;
    const formField = formFields[name];

    if (formField && formField.value !== value) {
      const formFieldConfig = getFormFieldConfig(name, formFieldConfigs);

      formField.value = value;

      // Calculate `dirty` based on `dirtyMode`.
      if (options && options.dirtyMode === 'OnChange') {
        formField.dirty = true;
      } else {
        if (options && options.isEqual) {
          formField.dirty = options.isEqual(defaultInitValue(formFieldConfig), formField.value);
        } else {
          formField.dirty = defaultInitValue(formFieldConfig) !== formField.value;
        }
      }

      // Validate immediately only if there are errors or validateOnChange is true.
      if (formField.hasError || formFieldConfig.validateOnChange) {
        validateFormFields(formFields, formFieldConfigs, false, name);
      }

      this.setState({
        formFields: formFields,
      });
    }
  };

  onChange = (name: string, event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    this.onChangeValue(name, event.target.value);
  };

  onBlur = (name: string) => {
    const { formFields } = this.state;

    const validationResult = validateFormFields(formFields, this.props.formFieldConfigs, false, name);
    if (validationResult.stateModified) {
      this.setState({
        formFields: formFields,
      });
    }
  };

  onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const { formFields } = this.state;

    // Don't submit the form if there are errors.
    const validationResult = validateFormFields(formFields, this.props.formFieldConfigs, true);
    if (validationResult.stateModified) {
      this.setState({
        formFields: formFields,
      });
    }

    if (validationResult.allValid) {
      // Call custom onSubmit.
      if (this.props.onSubmit) {
        this.props.onSubmit(event, formFields);
      }
    } else {
      // Prevent <form> from submitting.
      event.preventDefault();
    }
  };

  reset = () => {
    // Reset form fields to their original state.
    const { formFields } = this.state;

    Object.keys(formFields).forEach((name) => {
      const formField = formFields[name];
      const formFieldConfig = getFormFieldConfig(name, this.props.formFieldConfigs);

      formField.dirty = false;
      formField.errors = [];
      formField.hasError = false;
      formField.value = defaultInitValue(formFieldConfig);
    });

    this.setState({
      formFields: formFields,
    });
  };

  isDirty = () => {
    // Reset form fields to their original state.
    const { formFields } = this.state;

    return Object.keys(formFields).every((name) => !formFields[name].dirty);
  };
}

export function createFormField(formFieldConfig: FormFieldConfig): FormField {
  // Convert formFieldConfigs to formField.
  return {
    name: formFieldConfig.name,
    value: defaultInitValue(formFieldConfig),
    // TODO: decide if setting the init value for hasError, etc is necessary.
    // hasError: formFieldConfig.hasError || false,
    // errors: formFieldConfig.errors || false,
    hasError: false,
    errors: [],
    required: formFieldConfig.required || false,
    dirty: false,
    label: formFieldConfig.label,
  };
}

export function createFormFields<T extends object = any>(formFieldConfigs: FormFieldConfig[]): FormFields<T> {
  // Convert FormFieldConfig to FormField class instance.
  const formFields: FormFields = {};

  formFieldConfigs.forEach((formFieldConfig) => {
    formFields[formFieldConfig.name] = createFormField(formFieldConfig);
  });

  return formFields;
}

// tslint:disable-next-line: cyclomatic-complexity
export function isValid(
  formField: FormField,
  formFields: FormFields,
  formFieldConfig: FormFieldConfig,
  submitting: boolean
): ErrorType[] {
  const errors: ErrorType[] = [];

  if (formField.required && (formField.dirty || submitting) && !formField.value) {
    errors.push('required');
  }
  if (formFieldConfig.isExisty && !validations.isExisty(formField, formFields, submitting)) {
    errors.push('isExisty');
  }
  if (formFieldConfig.isUndefined && !validations.isUndefined(formField, formFields, submitting)) {
    errors.push('isUndefined');
  }
  if (formFieldConfig.isEmptyString && !validations.isEmptyString(formField, formFields, submitting)) {
    errors.push('isEmptyString');
  }
  if (formFieldConfig.isEmail && !validations.isEmail(formField, formFields, submitting)) {
    errors.push('isEmail');
  }
  if (formFieldConfig.isUrl && !validations.isUrl(formField, formFields, submitting)) {
    errors.push('isUrl');
  }
  if (formFieldConfig.isTrue && !validations.isTrue(formField, formFields, submitting)) {
    errors.push('isTrue');
  }
  if (formFieldConfig.isFalse && !validations.isFalse(formField, formFields, submitting)) {
    errors.push('isFalse');
  }
  if (formFieldConfig.isNumeric && !validations.isNumeric(formField, formFields, submitting)) {
    errors.push('isNumeric');
  }
  if (formFieldConfig.isAlpha && !validations.isAlpha(formField, formFields, submitting)) {
    errors.push('isAlpha');
  }
  if (formFieldConfig.isAlphanumeric && !validations.isAlphanumeric(formField, formFields, submitting)) {
    errors.push('isAlphanumeric');
  }
  if (formFieldConfig.isInt && !validations.isInt(formField, formFields, submitting)) {
    errors.push('isInt');
  }
  if (formFieldConfig.isFloat && !validations.isFloat(formField, formFields, submitting)) {
    errors.push('isFloat');
  }
  if (formFieldConfig.isWords && !validations.isWords(formField, formFields, submitting)) {
    errors.push('isWords');
  }
  if (formFieldConfig.isSpecialWords && !validations.isSpecialWords(formField, formFields, submitting)) {
    errors.push('isSpecialWords');
  }
  if (formFieldConfig.equals && !validations.equals(formField, formFields, submitting, formFieldConfig.equals)) {
    errors.push('equals');
  }
  if (
    formFieldConfig.equalsField &&
    !validations.equalsField(formField, formFields, submitting, formFieldConfig.equalsField)
  ) {
    errors.push('equalsField');
  }
  if (formFieldConfig.isLength && !validations.isLength(formField, formFields, submitting, formFieldConfig.isLength)) {
    errors.push('isLength');
  }
  if (
    formFieldConfig.matchRegexp &&
    !validations.matchRegexp(formField, formFields, submitting, formFieldConfig.matchRegexp)
  ) {
    errors.push('matchRegexp');
  }
  if (
    formFieldConfig.maxLength &&
    !validations.maxLength(formField, formFields, submitting, formFieldConfig.maxLength)
  ) {
    errors.push('maxLength');
  }
  if (
    formFieldConfig.minLength &&
    !validations.minLength(formField, formFields, submitting, formFieldConfig.minLength)
  ) {
    errors.push('minLength');
  }
  if (formFieldConfig.isValid && !formFieldConfig.isValid(formField, formFields, submitting)) {
    errors.push('isValid');
  }

  return errors;
}

function arraysEqual(array1: any[], array2: any[]): boolean {
  return array1.length === array2.length && array1.every((value, index) => value === array2[index]);
}

function validateAndDetectChanges(
  formField: FormField,
  formFields: FormFields,
  formFieldConfig: FormFieldConfig,
  submitting: boolean
): boolean {
  const wasValid = !formField.hasError;

  const errors = isValid(formField, formFields, formFieldConfig, submitting);
  const valid = errors.length === 0;
  formField.hasError = !valid;
  // Always mark dirty once we have an error (usually this means the form was submitted)
  // Might have to rethink this if it causes problems, but currently if you try submit a form right away,
  //   then click in a required field and click out, the error clears onBlur which is a bit weird.
  const origDirty = formField.dirty;
  if (formField.hasError) {
    formField.dirty = true;
  }

  const origErrors = formField.errors;
  // Sort the error values for faster comparison later.
  formField.errors = errors.sort();

  const origHelperText = formField.helperText;
  formField.helperText = formFieldConfig.helperText;
  if (formField.hasError && formFieldConfig.invalidText) {
    formField.helperText = formFieldConfig.invalidText;
  }
  if (formFieldConfig.getHelperText) {
    formField.helperText = formFieldConfig.getHelperText(formField, submitting);
  }

  // Detect if we changed any fields.
  // If so, we need to call setState.
  return (
    valid !== wasValid ||
    origDirty !== formField.dirty ||
    origHelperText !== formField.helperText ||
    !arraysEqual(origErrors, formField.errors)
  );
}

export function defaultInitValue(formFieldConfig: FormFieldConfig): Value {
  // return formFieldConfig.initValue ?? '';
  return formFieldConfig.initValue == null ? '' : formFieldConfig.initValue;
}

export function getFormFieldConfig(name: string, formFieldConfigs: FormFieldConfig[]): FormFieldConfig {
  const formFieldConfig = formFieldConfigs.find((ff) => ff.name === name);
  if (!formFieldConfig) {
    throw new Error(`FormFieldConfig for field '${name}' not found.`);
  }

  return formFieldConfig;
}

export function validateFormFields(
  formFields: FormFields,
  formFieldConfigs: FormFieldConfig[],
  submitting: boolean,
  onlyName?: string
): ValidationResult {
  // Ideally we'd clone formFields so we're not modifying a state variable directly, outside setState; but
  // we can't because formFields contains functions.
  let stateModified = false;
  if (onlyName && formFields[onlyName]) {
    stateModified =
      validateAndDetectChanges(
        formFields[onlyName],
        formFields,
        getFormFieldConfig(onlyName, formFieldConfigs),
        submitting
      ) || stateModified;
  } else {
    Object.keys(formFields).forEach((name) => {
      stateModified =
        validateAndDetectChanges(
          formFields[name],
          formFields,
          getFormFieldConfig(name, formFieldConfigs),
          submitting
        ) || stateModified;
    });
  }

  return {
    allValid: !Object.keys(formFields).reduce<boolean>((accum, key) => accum || formFields[key].hasError, false),
    stateModified: stateModified,
  };
}

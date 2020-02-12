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
});

export const FormsConsumer = FormsContext.Consumer;

export class FormsProvider extends React.Component<FormsProviderProps, FormsContextContext> {
  constructor(props: FormsProviderProps) {
    super(props);

    // Create formFields or using initial.
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
    };
  }

  render() {
    return <FormsContext.Provider value={this.state}>{this.props.children}</FormsContext.Provider>;
  }

  onChangeValue = (name: string, value: Value) => {
    const { formFields } = this.state;
    const formField = formFields[name];

    if (formField && formField.value !== value) {
      formField.value = value;
      formField.dirty = true;

      // Validate immediately only if there are errors or validateOnChange is true.
      const formFieldConfig = getFormFieldConfig(name, this.props.formFieldConfigs);
      if (formField.hasError || formFieldConfig.validateOnChange) {
        validateFormFields(formFields, this.props.formFieldConfigs, false, name);
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

      formField.dirty = false;
      formField.errors = [];
      formField.hasError = false;
      formField.value = '';
    });
  };
}

export function createFormField(formFieldConfig: FormFieldConfig): FormField {
  // Convert formFieldConfigs to formField.
  return {
    name: formFieldConfig.name,
    value: formFieldConfig.value || '',
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

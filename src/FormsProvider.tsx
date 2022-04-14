import React from 'react';

import {
  ErrorType,
  ForceValidationResult,
  FormField,
  FormFieldConfig,
  FormFields,
  FormFieldsState,
  FormFieldsWithEventHelpers,
  FormObject,
  FormsContextContext,
  FormsProviderProps,
  FormsProviderState,
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
  validate: (submitting: boolean): ValidationResult => {
    return { allValid: true, stateModified: false };
  },
  // tslint:disable-next-line: no-empty
  isDirty: () => {
    return false;
  },
});

export const FormsConsumer = FormsContext.Consumer;

export class FormsProvider<T = FormObject> extends React.Component<FormsProviderProps<T>, FormsProviderState> {
  constructor(props: FormsProviderProps) {
    super(props);

    // Initialize formFields.
    const formFields = initializeFormFields(props.formFieldConfigs);

    // Always validate on initialization so that initValues are taken into account.
    validateFormFields(formFields, props.formFieldConfigs, false);

    // Augment FormFields with events (helpers).
    const formFieldsState: FormFieldsState = {} as any;

    Object.keys(formFields).forEach((key) => {
      const formField = formFields[key];

      formFieldsState[key] = {
        ...formField,
        forceValidate: this.forceValidate.bind(this, key),
        onChange: this.onChange.bind(this, key),
        onChangeChecked: this.onChangeChecked.bind(this, key),
        onBlur: this.onBlur.bind(this, key),
        onChangeValue: this.onChangeValue.bind(this, key),
      };
    });

    this.state = {
      formFields: formFieldsState,
      formKey: this.props.formKey,
    };
  }

  static getDerivedStateFromProps(
    nextProps: FormsProviderProps,
    prevState: FormsProviderState
  ): Partial<FormsProviderState> | null {
    // If the formKey changed, then re-run the setup we do in the constructor.
    if (nextProps.formKey !== prevState.formKey) {
      const formFields = nextProps.formFieldConfigs.reduce<FormFieldsState>((accumulator, formFieldConfig) => {
        accumulator[formFieldConfig.name] = {
          // Pass along the previous formFields State so we have access to the Event Helpers.
          ...prevState.formFields[formFieldConfig.name],
          // Override non-event helpers with initialized values.
          ...initializeFormField(formFieldConfig),
        };

        return accumulator;
      }, {});

      // Re-run validation.
      validateFormFields(formFields, nextProps.formFieldConfigs, false);

      return {
        formFields: formFields,
        formKey: nextProps.formKey,
      };
    }

    // Return null to indicate no change to state.
    return null;
  }

  render() {
    // Merge state and props into the final FormField context value.
    const context: FormsContextContext = {
      formFields: createFormFields(this.props.formFieldConfigs, this.state.formFields),
      onSubmit: this.onSubmit,
      reset: this.reset,
      validate: this.validate,
      isDirty: this.isDirty,
    };

    return <FormsContext.Provider value={context}>{this.props.children}</FormsContext.Provider>;
  }

  onChangeValue = (name: string, value: Value) => {
    const { formFields } = this.state;
    const { formFieldConfigs, options } = this.props;
    const formField = formFields[name];

    if (formField) {
      const formFieldConfig = getFormFieldConfig(name, formFieldConfigs);

      formField.value = value;

      // Calculate `dirty` based on `dirtyMode`.
      if (options && options.dirtyMode === 'OnChange') {
        formField.dirty = true;
      } else {
        if (options && options.isEqual) {
          formField.dirty = !options.isEqual(defaultInitValue(formFieldConfig), formField.value);
        } else {
          formField.dirty = defaultInitValue(formFieldConfig) !== formField.value;
        }
      }

      // Validate immediately only if there are errors or validateOnChange is true.
      if (
        formField.hasError ||
        (options?.validateOnChange && formFieldConfig.validateOnChange !== false) ||
        formFieldConfig.validateOnChange
      ) {
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

  onChangeChecked = (name: string, event: React.ChangeEvent<HTMLInputElement>) => {
    this.onChangeValue(name, event.target.checked);
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

  forceValidate = (name: string): ForceValidationResult => {
    const { formFields } = this.state;

    // We're forcing validation so set `submitting` to true.
    const validationResult = validateFormFields(formFields, this.props.formFieldConfigs, true, name);
    if (validationResult.stateModified) {
      this.setState({
        formFields: formFields,
      });
    }

    return {
      ...validationResult,
      fieldDirty: formFields[name] && !formFields[name].dirty,
      fieldErrors: (formFields[name] && !formFields[name].errors) || [],
      fieldValid: formFields[name] && !formFields[name].hasError,
    };
  };

  onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const { formFieldConfigs } = this.props;
    const { formFields } = this.state;

    // Don't submit the form if there are errors.
    const validationResult = this.validate(true);

    if (validationResult.allValid) {
      // Call custom onSubmit.
      if (this.props.onSubmit) {
        this.props.onSubmit(event, createFormFields<T>(formFieldConfigs, formFields) as any, this.reset, this.isDirty);
      }
    } else {
      // Prevent <form> from submitting.
      event.preventDefault();
      // Stop propagation in case we're in a React Portal, because
      // portals propagate events along the React component hierarchy, not the DOM hierarchy 🤦️
      // https://github.com/facebook/react/issues/11387
      event.stopPropagation();
    }
  };

  validate = (submitting: boolean = true): ValidationResult => {
    const { formFieldConfigs } = this.props;
    const { formFields } = this.state;

    // Don't submit the form if there are errors.
    const validationResult = validateFormFields(formFields, formFieldConfigs, submitting);
    if (validationResult.stateModified) {
      this.setState({
        formFields: formFields,
      });
    }

    return validationResult;
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
    const { formFields } = this.state;

    // The Form is consider `dirty` if any Field is `dirty`.
    return Object.keys(formFields).some((name) => formFields[name].dirty);
  };
}

/**
 * Combine formFieldConfigs and formFields to create a "complete" FormFields record.
 */
function createFormFields<T = FormObject>(
  formFieldConfigs: FormFieldConfig[],
  formFields: FormFieldsState
): FormFieldsWithEventHelpers<T> {
  // tslint:disable-next-line: no-object-literal-type-assertion
  const combinedFormFields: FormFieldsWithEventHelpers<T> = {} as FormFieldsWithEventHelpers<T>;

  formFieldConfigs.forEach((formFieldConfig) => {
    const formField = formFields[formFieldConfig.name];

    combinedFormFields[formFieldConfig.name as Extract<keyof T, string>] = {
      ...formField,
      name: formFieldConfig.name,
      required: formFieldConfig.required || false,
      label: formFieldConfig.label,
    };
  });

  return combinedFormFields;
}

export function initializeFormField(formFieldConfig: FormFieldConfig): FormField {
  // Convert formFieldConfigs to formField.
  return {
    value: defaultInitValue(formFieldConfig),
    hasError: formFieldConfig.initHasError || false,
    errors: formFieldConfig.initErrors || [],
    dirty: formFieldConfig.initDirty || false,
    helperText: formFieldConfig.helperText,
  };
}

export function initializeFormFields<T = FormObject>(formFieldConfigs: FormFieldConfig[]): FormFields<T> {
  // Convert FormFieldConfig to FormField class instance.
  // tslint:disable-next-line: no-object-literal-type-assertion
  const formFields: FormFields<T> = {} as FormFields<T>;

  formFieldConfigs.forEach((formFieldConfig) => {
    formFields[formFieldConfig.name as Extract<keyof T, string>] = initializeFormField(formFieldConfig);
  });

  return formFields;
}

export function initializeFromFormData(formData: FormData, formFieldConfigs: FormFieldConfig[]) {
  // Augment formFieldConfigs with FormData values.
  Object.keys(formData).forEach((key) => {
    const formFieldConfig = formFieldConfigs.find((ff) => ff.name === key);
    if (formFieldConfig) {
      const value = formData.get(key);
      formFieldConfig.initValue = typeof value === 'string' ? value : undefined;
    }
  });
}

export function syncState(sourceFormFields: FormFields, destFormFieldConfigs: FormFieldConfig[]) {
  // Update formFieldConfigs with the result of the validations.
  destFormFieldConfigs.forEach((destFormFieldConfig) => {
    const formField = sourceFormFields[destFormFieldConfig.name];

    destFormFieldConfig.helperText = formField.helperText;
    destFormFieldConfig.initDirty = formField.dirty;
    destFormFieldConfig.initErrors = formField.errors;
    destFormFieldConfig.initHasError = formField.hasError;
    destFormFieldConfig.initValue = formField.value;
  });
}

// tslint:disable-next-line: cyclomatic-complexity
export function isValid(
  name: string,
  formFields: FormFields,
  formFieldConfigs: FormFieldConfig[],
  submitting: boolean
): ErrorType[] {
  const formField = formFields[name];
  const formFieldConfig = getFormFieldConfig(name, formFieldConfigs);

  const errors: ErrorType[] = [];

  if (
    formFieldConfig.required &&
    (formField.dirty || submitting) &&
    validations.isDefaultRequiredValue(formField, formFields, submitting)
  ) {
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
  name: string,
  formFields: FormFields,
  formFieldConfigs: FormFieldConfig[],
  submitting: boolean
): boolean {
  const formField = formFields[name];
  const formFieldConfig = getFormFieldConfig(name, formFieldConfigs);

  const wasValid = !formField.hasError;

  const errors = isValid(name, formFields, formFieldConfigs, submitting);
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
    formField.helperText = formFieldConfig.getHelperText(formField, formFields, submitting);
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
    stateModified = validateAndDetectChanges(onlyName, formFields, formFieldConfigs, submitting) || stateModified;
  } else {
    Object.keys(formFields).forEach((name) => {
      stateModified = validateAndDetectChanges(name, formFields, formFieldConfigs, submitting) || stateModified;
    });
  }

  return {
    allValid: !Object.keys(formFields).reduce<boolean>((accum, key) => accum || formFields[key].hasError, false),
    stateModified: stateModified,
  };
}

export function formFieldsToObject<T = FormObject>(formFields: FormFields<T>) {
  return Object.keys(formFields).reduce<T>(
    (accumulator, key) => ({
      ...accumulator,
      [key as Extract<keyof T, string>]: formFields[key as Extract<keyof T, string>].value,
    }),
    // tslint:disable-next-line: no-object-literal-type-assertion
    {} as T
  );
}

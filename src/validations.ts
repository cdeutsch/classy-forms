import { FormField, FormFields, Value } from './interfaces';

//
// Originally copied from formsy-react
// https://github.com/formsy/formsy-react/blob/dad4cfea53beb0a9fb8ad32fc0570493f6459f7e/src/validationRules.ts
//
// License: MIT
// https://github.com/formsy/formsy-react/blob/dad4cfea53beb0a9fb8ad32fc0570493f6459f7e/LICENSE
// ----------------------------------------------------------------------

const isExisty = (value: Value) => value !== null && value !== undefined;
const isEmpty = (value: Value) => value === '';

export const validations = {
  isDefaultRequiredValue(formField: FormField, formFields: FormFields, submitting: boolean) {
    return formField.value === undefined || formField.value === null || formField.value === '';
  },
  isExisty(formField: FormField, formFields: FormFields, submitting: boolean) {
    return isExisty(formField.value);
  },
  matchRegexp(formField: FormField, formFields: FormFields, submitting: boolean, regexp: RegExp) {
    return !isExisty(formField.value) || isEmpty(formField.value) || regexp.test(formField.value);
  },
  isUndefined(formField: FormField, formFields: FormFields, submitting: boolean) {
    return formField.value === undefined;
  },
  isEmptyString(formField: FormField, formFields: FormFields, submitting: boolean) {
    return isEmpty(formField.value);
  },
  isEmail(formField: FormField, formFields: FormFields, submitting: boolean) {
    // Regex from http://emailregex.com/
    return validations.matchRegexp(
      formField,
      formFields,
      submitting,
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i
    );
  },
  isUrl(formField: FormField, formFields: FormFields, submitting: boolean) {
    return validations.matchRegexp(
      formField,
      formFields,
      submitting,
      /^(?:\w+:)?\/\/([^\s.]+\.\S{2}|localhost[:?\d]*)\S*$/i
    );
  },
  isTrue(formField: FormField, formFields: FormFields, submitting: boolean) {
    return formField.value === true;
  },
  isFalse(formField: FormField, formFields: FormFields, submitting: boolean) {
    return formField.value === false;
  },
  isNumeric(formField: FormField, formFields: FormFields, submitting: boolean) {
    if (typeof formField.value === 'number') {
      return true;
    }

    return validations.matchRegexp(formField, formFields, submitting, /^[-+]?(?:\d*[.])?\d+$/);
  },
  isAlpha(formField: FormField, formFields: FormFields, submitting: boolean) {
    return validations.matchRegexp(formField, formFields, submitting, /^[A-Z]+$/i);
  },
  isAlphanumeric(formField: FormField, formFields: FormFields, submitting: boolean) {
    return validations.matchRegexp(formField, formFields, submitting, /^[0-9A-Z]+$/i);
  },
  isInt(formField: FormField, formFields: FormFields, submitting: boolean) {
    return validations.matchRegexp(formField, formFields, submitting, /^(?:[-+]?(?:0|[1-9]\d*))$/);
  },
  isFloat(formField: FormField, formFields: FormFields, submitting: boolean) {
    return validations.matchRegexp(
      formField,
      formFields,
      submitting,
      /^(?:[-+]?(?:\d+))?(?:\.\d*)?(?:[eE][+-]?(?:\d+))?$/
    );
  },
  isWords(formField: FormField, formFields: FormFields, submitting: boolean) {
    return validations.matchRegexp(formField, formFields, submitting, /^[A-Z\s]+$/i);
  },
  isSpecialWords(formField: FormField, formFields: FormFields, submitting: boolean) {
    return validations.matchRegexp(formField, formFields, submitting, /^[A-Z\s\u00C0-\u017F]+$/i);
  },
  isLength(formField: FormField, formFields: FormFields, submitting: boolean, length: number) {
    return !isExisty(formField.value) || isEmpty(formField.value) || formField.value.length === length;
  },
  equals(formField: FormField, formFields: FormFields, submitting: boolean, eql: Value) {
    return !isExisty(formField.value) || isEmpty(formField.value) || formField.value === eql;
  },
  equalsField(formField: FormField, formFields: FormFields, submitting: boolean, field: string) {
    return formFields[field] && formField.value === formFields[field].value;
  },
  maxLength(formField: FormField, formFields: FormFields, submitting: boolean, length: number) {
    return !isExisty(formField.value) || formField.value.length <= length;
  },
  minLength(formField: FormField, formFields: FormFields, submitting: boolean, length: number) {
    return !isExisty(formField.value) || isEmpty(formField.value) || formField.value.length >= length;
  },
};

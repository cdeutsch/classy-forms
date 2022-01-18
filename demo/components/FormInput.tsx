/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { red } from '@material-ui/core/colors';
import { FormFieldAndEventHelpers } from 'classy-forms';
import React from 'react';

const rootCss = css`
  display: flex;
  flex-direction: column;

  margin-bottom: 0.75em;

  label {
    font-size: 15px;
    font-weight: bold;
    line-height: 2;
  }

  abbr {
    cursor: help;
  }

  input {
    border: 1px solid #cccccc;
    border-radius: 3px;
    color: #555555;
    font-size: 13px;
    padding: 4px;
    width: 155px;

    &:focus {
      border-color: #111;
      outline: 0;
    }
  }

  p {
    font-size: 0.75rem;
    font-weight: 400;
    line-height: 1em;
    margin: 0.25em 0 0 0;
    min-height: 1em;
  }
`;

const errorCss = css`
  input {
    border-color: ${red.A400};

    &:focus {
      border-color: ${red.A700};
    }
  }

  p {
    color: ${red.A400};
  }
`;

export interface FormInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'name' | 'required' | 'value' | 'onBlur' | 'onChange'> {
  formField: FormFieldAndEventHelpers;
}

export class FormInput extends React.Component<FormInputProps> {
  render() {
    const { formField, ...passthrough } = this.props;
    const { hasError, helperText, label, name, onBlur, onChange, required, value } = formField;

    const actualRootCss = [rootCss];
    if (hasError) {
      actualRootCss.push(errorCss);
    }

    return (
      <div css={actualRootCss}>
        <label htmlFor={name}>
          {required ? <abbr title="required">*</abbr> : null}
          {label}
        </label>
        {/* tslint:disable-next-line: react-a11y-input-elements */}
        <input
          autoCapitalize="off"
          autoCorrect="off"
          size={50}
          type="text"
          id={name}
          name={name}
          value={value}
          onBlur={onBlur}
          onChange={onChange}
          {...passthrough}
        />
        {helperText ? <p>{helperText}</p> : null}
      </div>
    );
  }
}

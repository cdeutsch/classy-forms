/** @jsxImportSource @emotion/react */
import { css, jsx } from '@emotion/react';
import { Button } from '@material-ui/core';
import { ClassyForm, FormField, FormFieldConfig, FormFields, FormsContextContext } from 'classy-forms';
import React from 'react';

import { FormInput } from '../components/FormInput';
import { Page } from '../components/Page';

interface UserFormFields {
  firstName: string;
  lastName: string;
  email: string;
}

function getErrorText(formField: FormField, formFields: FormFields, submitting?: boolean) {
  switch (formField.errors[0]) {
    case 'required':
      return 'Required';
    case 'isEmail':
      return 'Invalid email';
  }
}

const formFieldConfigs: FormFieldConfig[] = [
  {
    name: 'lastName',
    label: 'Last name',
    required: true,
    getHelperText: getErrorText,
  },
  {
    name: 'firstName',
    label: 'First name',
    required: true,
    getHelperText: getErrorText,
  },
  {
    name: 'email',
    label: 'Email',
    required: true,
    isEmail: true,
    getHelperText: getErrorText,
  },
];

export class Home extends React.Component {
  render() {
    return (
      <Page>
        <ClassyForm formFieldConfigs={formFieldConfigs}>
          {({ formFields: { email, firstName, lastName }, onSubmit }: FormsContextContext<UserFormFields>) => {
            return (
              <React.Fragment>
                <FormInput key={firstName.name} formField={firstName} />

                <FormInput key={lastName.name} formField={lastName} />

                <FormInput key={email.name} formField={email} />

                <div className="form-actions">
                  <Button variant="contained" color="primary" type="submit">
                    Register
                  </Button>
                </div>
              </React.Fragment>
            );
          }}
        </ClassyForm>
      </Page>
    );
  }
}

// tslint:disable-next-line: export-name no-default-export
export default Home;

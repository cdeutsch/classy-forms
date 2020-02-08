/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { Button } from '@material-ui/core';
import { ClassyForms, Form, FormField, FormFieldConfig, FormsContextContext } from 'classy-forms';
import React from 'react';

import { FormInput } from '../components/FormInput';
import { Page } from '../components/Page';

interface UserFormFields {
  firstName: string;
  lastName: string;
}

function getRequiredHelperText(formField: FormField, submitting?: boolean) {
  return formField.hasError && !formField.value ? 'Required' : '';
}

const formFieldConfigs: FormFieldConfig[] = [
  {
    name: 'lastName',
    label: 'Last name',
    required: true,
    getHelperText: getRequiredHelperText,
  },
  {
    name: 'firstName',
    label: 'First name',
    required: true,
    getHelperText: getRequiredHelperText,
  },
];

export class Home extends React.Component {
  render() {
    return (
      <Page>
        <ClassyForms formFieldConfigs={formFieldConfigs}>
          {({ formFields: { firstName, lastName }, onSubmit }: FormsContextContext<UserFormFields>) => {
            return (
              <Form acceptCharset="UTF-8" action="/" id="voteForm" method="post" noValidate>
                <FormInput key={firstName.name} formField={firstName} />

                <FormInput key={lastName.name} formField={lastName} />

                <div className="form-actions">
                  <Button variant="contained" color="primary" type="submit">
                    Register
                  </Button>
                </div>
              </Form>
            );
          }}
        </ClassyForms>
      </Page>
    );
  }
}

// tslint:disable-next-line: export-name no-default-export
export default Home;

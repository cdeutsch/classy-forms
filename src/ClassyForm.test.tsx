import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { ClassyForm } from './ClassyForm';
import type { FormObject } from './interfaces';

type DemoForm = FormObject & {
  title: unknown;
};

describe('ClassyForm', () => {
  it('calls onSubmit when form is valid', async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();

    render(
      <ClassyForm<DemoForm> formFieldConfigs={[{ name: 'title', required: true }]} onSubmit={onSubmit}>
        {({ formFields }) => (
          <>
            <label htmlFor="title">Title</label>
            <input id="title" value={formFields.title.value as string} onChange={formFields.title.onChange} />
            <button type="submit">Save</button>
          </>
        )}
      </ClassyForm>
    );

    await user.type(screen.getByLabelText('Title'), 'My title');
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    const [event, submittedFields] = onSubmit.mock.calls[0];
    expect(event.defaultPrevented).toBe(false);
    expect(submittedFields.title.value).toBe('My title');
  });

  it('prevents submit when invalid (required empty)', async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();

    render(
      <ClassyForm<DemoForm> formFieldConfigs={[{ name: 'title', required: true }]} onSubmit={onSubmit}>
        {({ formFields }) => (
          <>
            <label htmlFor="title">Title</label>
            <input id="title" value={formFields.title.value as string} onChange={formFields.title.onChange} />
            <button type="submit">Save</button>
          </>
        )}
      </ClassyForm>
    );

    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('reset restores initial value', async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();

    render(
      <ClassyForm<DemoForm> formFieldConfigs={[{ name: 'title', initValue: 'original' }]} onSubmit={onSubmit}>
        {({ formFields, reset }) => (
          <>
            <label htmlFor="title">Title</label>
            <input id="title" value={formFields.title.value as string} onChange={formFields.title.onChange} />
            <button type="button" onClick={reset}>
              Reset
            </button>
            <button type="submit">Save</button>
          </>
        )}
      </ClassyForm>
    );

    const input = screen.getByLabelText('Title');
    expect(input).toHaveValue('original');

    await user.clear(input);
    await user.type(input, 'edited');
    expect(input).toHaveValue('edited');

    await user.click(screen.getByRole('button', { name: 'Reset' }));
    expect(input).toHaveValue('original');
    expect(onSubmit).not.toHaveBeenCalled();
  });
});

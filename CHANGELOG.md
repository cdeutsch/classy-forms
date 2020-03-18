# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.2.2](https://github.com/cdeutsch/classy-forms/compare/v0.2.1...v0.2.2) (2020-03-18)

Replace `initializeFormFieldsServerSide` with `updateFormFieldConfigs` because most places using server side rendering won't be able to pass along the full augmented formFields object. It will drop any functions like `isValid`

Adding `updateFormFieldConfigs` allows it to be called in the constructor client side using the results of the validation that was run server side.


### [0.2.1](https://github.com/cdeutsch/classy-forms/compare/v0.2.0...v0.2.1) (2020-03-17)

Create a separate `initializeFormFieldsServerSide` function instead of passing a `updateFormFieldConfigs`.

This is because we also want to always run validation with the `submitting` flag set, AND return the results.

Always validate on initialization so that initValues are taken into account.


## [0.2.0](https://github.com/cdeutsch/classy-forms/compare/v0.1.12...v0.2.0) (2020-03-17)

Add `formKey` Provider property that can be used to reset the internal formFields state and re-run validation. Useful after making an async call to update the database and you want to reset the dirty flags, etc.

Update `FormField` interface so it only contains properties that need to be managed in "state". Move the other properties to `FormFieldHelpers`

Update `FormsProvider` so it will look for `formKey` changes and re-run what we do in the constructor.

Added `updateFormFieldConfigs` flag to `validateFormFields` which can be used in server-side rendering scenarios to copy the results of the validation back to `formFieldConfigs` so they can be used to initialize the `FormsProvider`.

Add `hasError`, `errors`, and `dirty` to `FormFieldConfig` so consumer can manually control the overall Form state.

### ⚠ BREAKING CHANGES:

- Rename `createFormFields` to `initializeFormFields` so it better reflects what it does. The new `createFormFields` is now responsible for combining `FormFieldConfig` properties with `FormFieldState` to make in convenient to access all FormField related properties in one object.

- Change `getHelperText` signature so it's consistent with `isValid`.

- Renamed `FormFieldWithHelpers` to `FormFieldAndEventHelpers`, and `FormFieldsWithHelpers` to `FormFieldsWithEventHelpers`


### [0.1.12](https://github.com/cdeutsch/classy-forms/compare/v0.1.11...v0.1.12) (2020-03-16)

Pass `reset` and `isDirty` when `onSubmit` is called.


### [0.1.11](https://github.com/cdeutsch/classy-forms/compare/v0.1.10...v0.1.11) (2020-03-16)

Properly execute custom `isEqual`.


### [0.1.10](https://github.com/cdeutsch/classy-forms/compare/v0.1.9...v0.1.10) (2020-03-16)

Properly pass `options` to the `FormsProvider`


### [0.1.9](https://github.com/cdeutsch/classy-forms/compare/v0.1.8...v0.1.9) (2020-03-16)

Remove `node_modules` and `package-lock.json` and re `npm i` to address security bulletins for the Demo project.


### [0.1.8](https://github.com/cdeutsch/classy-forms/compare/v0.1.7...v0.1.8) (2020-03-16)

Remove `node_modules` and `package-lock.json` and re `npm i` to address security bulletins.


### [0.1.7](https://github.com/cdeutsch/classy-forms/compare/v0.1.6...v0.1.7) (2020-03-16)

Bump acorn from 6.4.0 to 6.4.1


### [0.1.6](https://github.com/cdeutsch/classy-forms/compare/v0.1.5...v0.1.6) (2020-03-12)

Added `onChangeChecked` handler to be used with checkbox type inputs.


### [0.1.5](https://github.com/cdeutsch/classy-forms/compare/v0.1.4...v0.1.5) (2020-03-12)

Added `formFieldsToObject` to aid in converting a `FormField` record into a plain old object.


### [0.1.4](https://github.com/cdeutsch/classy-forms/compare/v0.1.3...v0.1.4) (2020-03-09)

Always run the onChange logic.

Our "not equal" check was blocking the rest of the logic.


### [0.1.3](https://github.com/cdeutsch/classy-forms/compare/v0.1.2...v0.1.3) (2020-03-05)

Fix bug in `isDirty` logic.


### [0.1.2](https://github.com/cdeutsch/classy-forms/compare/v0.1.1...v0.1.2) (2020-03-05)

Remove optional chaining and nullish coalescing operator because TypeScript targeting `esnext` won't transpile them, and a lot of Webpack configs aren't ready to handle them 🙄


### [0.1.1](https://github.com/cdeutsch/classy-forms/compare/v0.1.0...v0.1.1) (2020-03-05)

Upgrade NPMs, particularly TypeScript to fix the library breaking bug due to using new features that don't exist in the previous version.


### [0.1.0](https://github.com/cdeutsch/classy-forms/compare/v0.0.13...v0.1.0) (2020-03-05)

Add two ways to calculate `dirty`.

`OnChange` will immediately be dirty and stay dirty as soon as the value changes.

`NotEqual` will only be dirty if the value is differently than the defaulted `initValue`, and can change over time.

Add `defaultInitValue` because we're using this logic in 3 places now and I can see it changing in the future, since we may not want to default all null values to a string.

Add `isEqual` option so you can do a "deep equal" to set the `dirty` flag if desired.

### ⚠ BREAKING CHANGES:

Rename `formFieldConfig.value` to `formFieldConfig.initValue` to better clarify what it does.

As `value` it implies if you change it later it will do something, when in reality it does not.


### [0.0.13](https://github.com/cdeutsch/classy-forms/compare/v0.0.12...v0.0.13) (2020-02-26)

Add `invalidText` and `helperText` config options.

`invalidText` allows you to set the helper text displayed on error. Overridden by getHelperText if both exist.

`helperText` allows you to set the helper text always displayed, but is overridden by invalidText when invalid, and getHelperText if both exist.


### [0.0.12](https://github.com/cdeutsch/classy-forms/compare/v0.0.11...v0.0.12) (2020-02-24)

Fix the reset functionality.

We should be resetting it to the initial value, and `setState` needs to be called.


### [0.0.11](https://github.com/cdeutsch/classy-forms/compare/v0.0.10...v0.0.11) (2020-02-12)

Added `validateOnChange` form field config option.


### [0.0.10](https://github.com/cdeutsch/classy-forms/compare/v0.0.9...v0.0.10) (2020-02-12)

Added `onChangeValue` helper, so frameworks that use a non-native `<select>` don't have to create a fake `event`.


### [0.0.9](https://github.com/cdeutsch/classy-forms/compare/v0.0.8...v0.0.9) (2020-02-12)

Support `HTMLSelectElement` and `HTMLTextAreaElement` in `onChange` and `onBlur`.


### [0.0.8](https://github.com/cdeutsch/classy-forms/compare/v0.0.7...v0.0.8) (2020-02-11)

Provide a `reset` function that can be used to reset the form fields to their original state.

Remove `getLabel` since it's a bit of extra work that doesn't seem super necessary and can be accomplished by the consumer if needed.


### [0.0.7](https://github.com/cdeutsch/classy-forms/compare/v0.0.6...v0.0.7) (2020-02-11)

Always mark dirty once we have an error (usually this means the form was submitted).


### [0.0.6](https://github.com/cdeutsch/classy-forms/compare/v0.0.5...v0.0.6) (2020-02-11)

Pass along `formFields` in `onSubmit` call.

Makes it easier to access them.

Add `release` script that will build and version the project.


### [0.0.5](https://github.com/cdeutsch/classy-forms/compare/v0.0.4...v0.0.5) (2020-02-11)

Upgraded NPMs in Demo and main project devDependencies. Otherwise should be the same as v0.0.4.


### [0.0.4](https://github.com/cdeutsch/classy-forms/compare/v0.0.3...v0.0.4) (2020-02-11)

Fix typings on `getHelperText` and `getLabel`


### [0.0.3](https://github.com/cdeutsch/classy-forms/compare/v0.0.2...v0.0.3) (2020-02-11)

Better typings, so Typescript can tell you what keys are available.

Add a Demo page.

Add `ClassyFormsSetup` and `ClassyForm` components to make using `classy-forms` easier (less boilerplate).


### [0.0.2](https://github.com/cdeutsch/classy-forms/compare/v0.0.1...v0.0.2) (2020-01-09)

Fix package.

Default export wasn't defined.

Remove Test I was playing around with.


### 0.0.1 (2020-01-09)

Initial release to NPM, targeted towards more internal usage and testing before working on Demo and Docs.

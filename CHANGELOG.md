# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [3.1.1](https://github.com/cdeutsch/classy-forms/compare/v3.1.0...v3.1.1) (2023-02-22)

Add `onIsDirtyChange` prop to FormsProvider props to make it easier to react to dirty state changes.


## [3.1.0](https://github.com/cdeutsch/classy-forms/compare/v3.0.0...v3.1.0) (2022-07-26)

Add missing `children` prop to `FormsProviderProps` for React v18.


## [3.0.0](https://github.com/cdeutsch/classy-forms/compare/v2.1.7...v3.0.0) (2022-04-15)

Add `isInitError` which will maintain `initHasError` during the constructor.

Otherwise if you set `initHasError` based on a server condition that isn't checked inside `isValid`, the error state will immediately be lost.

This could be considered a breaking change since `initHasError` will behave different, but it's also a bug fix.


### [2.1.6](https://github.com/cdeutsch/classy-forms/compare/v2.1.5...v2.1.6) (2022-04-14)

Fix bug with iterating over `FormData` keys.


### [2.1.5](https://github.com/cdeutsch/classy-forms/compare/v2.1.4...v2.1.5) (2022-04-14)

Add `validateFormData` helper to aid in validating submitted FormData.


### [2.1.4](https://github.com/cdeutsch/classy-forms/compare/v2.1.3...v2.1.4) (2022-04-14)

Add `initializeFromFormData` function to set the `initValue` of FormFieldConfigs using the `FormData` specified.


### [2.1.3](https://github.com/cdeutsch/classy-forms/compare/v2.1.2...v2.1.3) (2022-04-14)

Add React 17 and 18 as peer dependency options.


### [2.1.2](https://github.com/cdeutsch/classy-forms/compare/v2.1.0...v2.1.2) (2022-03-15)

Return validation results from `forceValidate`.


### [2.1.1](https://github.com/cdeutsch/classy-forms/compare/v2.1.0...v2.1.1) (2022-03-15)

Add ability to force validate a field.


## [2.1.0](https://github.com/cdeutsch/classy-forms/compare/v2.0.0...v2.1.0) (2022-01-18)

Upgrade NPM dependencies to deal with security warnings. No functionality changes.


## [2.0.0](https://github.com/cdeutsch/classy-forms/compare/v1.0.1...v2.0.0) (2021-04-07)

Improved the typings which will be useful if/when you upgrade your project to `typescript@4.2.3`

### ⚠ BREAKING CHANGES:

- May need to pass around typings when using `ClassyForm` and `FormsProvider`. Ex:

```
interface FormProps {
  name: string;
  email: string;
}

<FormsProvider<FormProps>
  formFieldConfigs={[]}
>
  ...
</FormsProvider>
```

### [1.0.1](https://github.com/cdeutsch/classy-forms/compare/v1.0.0...v1.0.1) (2021-01-21)

Better "required" check. Values like `0` should be valid. They previously weren't.


## [1.0.0](https://github.com/cdeutsch/classy-forms/compare/v0.3.2...v1.0.0) (2020-07-07)

Stop propagation in case we're in a React Portal, because portals propagate events along the React component hierarchy, not the DOM hierarchy.


### [0.3.2](https://github.com/cdeutsch/classy-forms/compare/v0.3.1...v0.3.2) (2020-04-06)

Provide a `validate` function to be used when you're not using a regular `<form>`.


### [0.3.1](https://github.com/cdeutsch/classy-forms/compare/v0.3.0...v0.3.1) (2020-04-06)

Add `FormOption` for defaulting to `validateOnChange`.


## [0.3.0](https://github.com/cdeutsch/classy-forms/compare/v0.2.3...v0.3.0) (2020-03-18)

### ⚠ BREAKING CHANGES:

- Rename `updateFormFieldConfigs` to `syncState` to try better communicate what it's doing.

- Use Rollup and Babel to publish the NPM.


### [0.2.3](https://github.com/cdeutsch/classy-forms/compare/v0.2.2...v0.2.3) (2020-03-18)

Prepend `init` to `formFieldConfig` props that are only used during initialization.

Remove the merging of certain `formFieldConfigs` and `formFields` props in `createFormFields`. There just isn't a great way to do  it. It's too hard to know which one should take precedence and when.


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

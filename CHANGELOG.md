# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

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

BREAKING CHANGE:

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

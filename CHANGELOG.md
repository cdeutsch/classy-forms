# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

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

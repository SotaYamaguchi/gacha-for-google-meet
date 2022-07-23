module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    webextensions: true,
  },
  extends: [
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/errors",
    "plugin:import/typescript",
    "plugin:unicorn/recommended",
    "standard",
    "prettier",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: "latest",
  },
  plugins: [
    "react",
    "import",
    "unused-imports",
    "@typescript-eslint",
    "sort-keys-fix",
    "typescript-sort-keys",
    "unicorn",
  ],
  rules: {
    "@typescript-eslint/explicit-function-return-type": "error",
    "@typescript-eslint/no-unused-vars": "error",
    "import/no-cycle": "error",
    "import/order": [
      "error",
      {
        alphabetize: {
          order: "asc",
        },
        groups: [
          "builtin",
          "external",
          "parent",
          "sibling",
          "index",
          "object",
          "type",
        ],
        "newlines-between": "never",
      },
    ],
    "no-console": "warn",
    "react/jsx-uses-react": "error",
    "react/jsx-uses-vars": "error",
    "sort-keys": ["error", "asc", { natural: true }],
    "sort-keys-fix/sort-keys-fix": "error",
    "typescript-sort-keys/interface": ["error", "asc", { natural: true }],
    "typescript-sort-keys/string-enum": ["error", "asc", { natural: true }],
    "unicorn/filename-case": "off",
    "unicorn/prevent-abbreviations": "off",
    "unused-imports/no-unused-imports": "error",
  },
  settings: {
    componentWrapperFunctions: [
      // The name of any function used to wrap components, e.g. Mobx `observer` function. If this isn't set, components wrapped by these functions will be skipped.
      "observer", // `property`
      { property: "styled" }, // `object` is optional
      { object: "Mobx", property: "observer" },
      { object: "<pragma>", property: "observer" }, // sets `object` to whatever value `settings.react.pragma` is set to
    ],
    formComponents: [
      // Components used as alternatives to <form> for forms, eg. <Form endpoint={ url } />
      "CustomForm",
      { formAttribute: "endpoint", name: "Form" },
    ],
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true,
      },
    },
    linkComponents: [
      // Components used as alternatives to <a> for linking, eg. <Link to={ url } />
      "Hyperlink",
      { linkAttribute: "to", name: "Link" },
    ],
    propWrapperFunctions: [
      // The names of any function used to wrap propTypes, e.g. `forbidExtraProps`. If this isn't set, any propTypes wrapped in a function will be skipped.
      "forbidExtraProps",
      { object: "Object", property: "freeze" },
      { property: "myFavoriteWrapper" },
      // for rules that check exact prop wrappers
      { exact: true, property: "forbidExtraProps" },
    ],
    react: {
      createClass: "createReactClass",

      // React version. "detect" automatically picks the version you have installed.
      // You can also use `16.0`, `16.3`, etc, if you want to override the detected value.
      // It will default to "latest" and warn if missing, and to "detect" in the future
      flowVersion: "0.53",

      // Pragma to use, default to "React"
      fragment: "Fragment",

      // Regex for Component Factory to use,
      // default to "createReactClass"
      pragma: "React",

      // Fragment to use (may be a property of <pragma>), default to "Fragment"
      version: "detect", // Flow version
    },
  },
};

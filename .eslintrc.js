module.exports = {
  // For detail about @mi/eslint-config-mcfe-react-app
  // http://git.n.xiaomi.com/mcfe/create-mcfe-react-app/blob/master/packages/eslint-config-mcfe-react-app/index.js
  extends: ["@mi/eslint-config-mcfe-react-app", "plugin:prettier/recommended"],
  parser: "babel-eslint",
  plugins: ["prettier"],
  rules: {
    // add project level rules if need.
    "linebreak-style": [0, "error", "windows"],
    "prettier/prettier": "error"
  },
  parserOptions: {
    sourceType: "module"
  }
};

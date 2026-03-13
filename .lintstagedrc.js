export default {
  '*': ['prettier --write --ignore-unknown'],
  '**/*.{html,js,ts}': ['eslint --fix'],
  '**/*.{css,scss}': ['stylelint --fix --allow-empty-input']
};

module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // New feature for the user (new functionality)
        'fix', // Bug fix
        'docs', // Documentation only changes (README, comments, etc.)
        'style', // Formatting changes (spaces, commas, semicolons, etc.) - no logic changes
        'refactor', // Code refactoring (neither fix nor feat) - improving existing code
        'perf', // Performance improvements
        'test', // Adding or modifying tests
        'build', // Changes to build system or external dependencies (npm, webpack, etc.)
        'ci', // Changes to CI/CD configuration (GitHub Actions, Jenkins, etc.)
        'chore', // Maintenance tasks (updating .gitignore, scripts, etc.)
        'revert' // Revert a previous commit
      ]
    ]

    // Optional: Uncomment to enable mandatory scopes based on src/ structure
    // Usage example: feat(presentation): add new user component
    // 'scope-enum': [
    //   2,
    //   'always',
    //   [
    //     'presentation', // UI layer (components, pages, views)
    //     'domain',       // Domain layer (business logic, use cases)
    //     'data',         // Data layer (repositories, API calls)
    //     'entities',     // Domain entities and models
    //     'core',         // Core framework functionality
    //     'di',           // Dependency injection configuration
    //     'icons',        // Icon assets
    //     'config',       // App configuration (app.config.ts, environments)
    //     'routes',       // Routing configuration
    //     'assets',       // Static assets
    //     'deps'          // Dependencies (package.json)
    //   ]
    // ]
  }
};

module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',     // ✨ New feature
        'fix',      // 🐛 Bug fix
        'build',    // 📦️ Update dependencies
        'conf',     // 🔧 Update configuration
        'refactor', // ♻️ Refactor code
        'test',     // 🧪 Update tests
        'ci',       // 👷 Update CI
        'docs',     // 📝 Update documentation
        'tag',      // 🔖 Add tag/release
        'other',    // 🧑‍💻 Other changes
      ],
    ],
    'type-case': [2, 'always', 'lower-case'],
    'subject-case': [0], // Allow any case for subject
    'header-max-length': [2, 'always', 100],
  },
};

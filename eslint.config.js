import antfu from '@antfu/eslint-config'

export default antfu(
  {
    unocss: true,
    formatters: true,
    rules: {
      'format/prettier': 0,
      'style/indent': [0, 2],
      'style/space-before-function-paren': [2, 'always'],
      'eslint-comments/no-unlimited-disable': [0, 2],
    },
    stylistic: {
      // 'style/brace-style': ['error', '1tbs', { allowSingleLine: true }],
    },
    vue: {
      overrides: {
        'vue/script-indent': [2, 2, {
          baseIndent: 1,
          switchCase: 1,
          ignores: [],
        }],
      },
    },
  },
)

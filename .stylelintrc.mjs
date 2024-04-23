/** @type {import('stylelint').Config} */
export default {
  ignore: ['.mjs'],
  plugins: ['stylelint-prettier'],
  /* 继承某些已有的规则 */
  extends: [
    'stylelint-config-recess-order',
    'stylelint-config-standard',
    'stylelint-config-standard-scss',
  ],
  overrides: [
    // 扫描 .vue/html 文件中的<style>标签内的样式
    {
      files: ['**/*.{vue,html,scss}'],
      customSyntax: 'postcss-html',
    },
  ],
  /**
   * null  => 关闭该规则
   */
  rules: {
    'no-empty-source': null,
    'font-family-no-missing-generic-family-keyword': null,
  },
}

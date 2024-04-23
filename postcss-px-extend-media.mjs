/* eslint-disable */
/* prettier-ignore */
// @ts-nocheck
function getUnitRegexp (unit) {
  return new RegExp(
      `"[^"]+"|'[^']+'|url\\([^\\)]+\\)|(\\d*\\.?\\d+)${unit}`,
      'g',
  )
}

function shouldExclude (options, filePath) {
  for (const exclude of options.excludeFiles) {
    if (typeof exclude === 'string' && filePath.includes(exclude))
      return true

    if (exclude instanceof RegExp && exclude.test(filePath))
      return true
  }
  if (options.includeFiles.length > 0) {
    let included = false
    for (const include of options.includeFiles) {
      if (typeof include === 'string' && filePath.includes(include)) {
        included = true
        break
      }
      if (include instanceof RegExp && include.test(filePath)) {
        included = true
        break
      }
    }
    return !included
  }
  return false
}

function isBlacklistedSelector (selector, blacklist) {
  for (const item of blacklist) {
    if (typeof item === 'string' && selector.includes(item))
      return true
    else if (item instanceof RegExp && item.test(selector))
      return true
  }
  return false
}

function getUnitFromOptions (prop, opts) {
  return !Array.isArray(prop) ? prop.includes('font') ? opts.fontViewportUnit : opts.viewportUnit : opts.viewportUnit
}

function roundNumberToPrecision (number, precision) {
  const multiplier = 10 ** precision
  const roundedNumber = Math.round(number * multiplier) / multiplier
  return roundedNumber
}

function createUnitReplaceFunction (opts, targetUnit, targetSize) {
  return function (match, pixelValue) {
    if (!pixelValue)
      return match

    const pixels = Number.parseFloat(pixelValue)
    if (pixels <= opts.minPixelValue)
      return match

    const convertedValue = roundNumberToPrecision(pixels / targetSize * 100, opts.unitPrecision)
    return convertedValue === 0 ? '0' : `${convertedValue}${targetUnit}`
  }
}

function doesDeclarationExist (declarations, property, value) {
  return declarations?.some((declaration) => {
    return declaration.prop === property && declaration.value === value
  })
}

function validateMediaQueryParams (params, requiresMediaQuery) {
  return !params || (params && requiresMediaQuery)
}

const filterPropertiesList = {
  exact: list => list.filter(m => m.match(/^[^*!]+$/) !== null),
  contain: list => list.filter(m => m.match(/^\*.+\*$/) !== null).map(m => m.slice(1, m.length - 1)),
  endWith: list => list.filter(m => m.match(/^\*[^*]+$/) !== null).map(m => m.slice(1)),
  startWith: list => list.filter(m => m.match(/^[^*!]+\*$/) !== null).map(m => m.slice(0, m.length - 1)),
  notExact: list => list.filter(m => m.match(/^![^*].*$/) !== null).map(m => m.slice(1)),
  notContain: list => list.filter(m => m.match(/^!\*.+\*$/) !== null).map(m => m.slice(2, m.length - 2)),
  notEndWith: list => list.filter(m => m.match(/^!\*[^*]+$/) !== null).map(m => m.slice(2)),
  notStartWith: list => list.filter(m => m.match(/^![^*]+\*$/) !== null).map(m => m.slice(1, m.length - 2)),
}

function createPropertiesListMatcher (propList) {
  const hasWild = propList.includes('*')
  const matchAll = hasWild && propList.length === 1
  const lists = {
    exact: filterPropertiesList.exact(propList),
    contain: filterPropertiesList.contain(propList),
    startWith: filterPropertiesList.startWith(propList),
    endWith: filterPropertiesList.endWith(propList),
    notExact: filterPropertiesList.notExact(propList),
    notContain: filterPropertiesList.notContain(propList),
    notStartWith: filterPropertiesList.notStartWith(propList),
    notEndWith: filterPropertiesList.notEndWith(propList),
  }
  return (prop) => {
    if (matchAll)
      return true

    return (hasWild || lists.exact.includes(prop) || lists.contain.some(m => prop.includes(m)) || lists.startWith.some(m => prop.indexOf(m) === 0) || lists.endWith.some(m => prop.indexOf(m) === prop.length - m.length)) && !(lists.notExact.includes(prop) || lists.notContain.some(m => prop.includes(m)) || lists.notStartWith.some(m => prop.indexOf(m) === 0) || lists.notEndWith.some(m => prop.indexOf(m) === prop.length - m.length))
  }
}

var UnitType = /* @__PURE__ */ ((UnitType2) => {
  UnitType2.PX = 'px'
  return UnitType2
})(UnitType || {})
var ViewportUnitType = /* @__PURE__ */ ((ViewportUnitType2) => {
  ViewportUnitType2.VW = 'vw'
  ViewportUnitType2.VH = 'vh'
  ViewportUnitType2.VMIN = 'vmin'
  ViewportUnitType2.VMAX = 'vmax'
  return ViewportUnitType2
})(ViewportUnitType || {})
var FontViewportUnitType = /* @__PURE__ */ ((FontViewportUnitType2) => {
  FontViewportUnitType2.VW = 'vw'
  FontViewportUnitType2.VH = 'vh'
  FontViewportUnitType2.VMIN = 'vmin'
  FontViewportUnitType2.VMAX = 'vmax'
  return FontViewportUnitType2
})(FontViewportUnitType || {})

const PLUGIN_NAME = 'postcss-px-conversion'
const IGNORE_PREV_COMMENT = 'px-conversion-ignore-prev'
const IGNORE_NEXT_COMMENT = 'px-conversion-ignore-next'
const DEFAULT_OPTIONS = {
  unitType: UnitType.PX,
  viewportWidth: 320,
  unitPrecision: 5,
  allowedProperties: ['*'],
  excludedProperties: [],
  viewportUnit: ViewportUnitType.VW,
  fontViewportUnit: FontViewportUnitType.VW,
  selectorBlacklist: [],
  minPixelValue: 1,
  allowMediaQuery: false,
  replaceRules: true,
  excludeFiles: [],
  includeFiles: [],
  enableLandscape: false,
  landscapeUnit: ViewportUnitType.VW,
  landscapeViewportWidth: 568,
}

function plugin (customOptions = {}) {
  const options = {...DEFAULT_OPTIONS, ...customOptions}
  const unitRegexp = getUnitRegexp(options.unitType)
  const isAllowedProperty = createPropertiesListMatcher(options.allowedProperties)
  const landscapeAtRules = []
  return {
    postcssPlugin: PLUGIN_NAME,
    AtRule (atRule) {
      if (atRule.name === 'media' && atRule.params === 'screen and (max-width: 780px)') {
        const sourceFile = atRule.source?.input.file || ''
        atRule.walkRules((rule) => {
          rule.walkDecls((declaration, index) => {
            if (!declaration.value.includes(options.unitType) || !isAllowedProperty(declaration.prop))
              return

            const prevComment = declaration.prev()
            if (prevComment && prevComment.type === 'comment' && prevComment.text === IGNORE_NEXT_COMMENT) {
              prevComment.remove()
              return
            }
            const nextComment = declaration.next()
            if (nextComment && nextComment.type === 'comment' && nextComment.text === IGNORE_PREV_COMMENT) {
              if (/\n/.test(nextComment.raws.before)) {
                result.warn(
                    `Unexpected comment /* ${IGNORE_PREV_COMMENT} */ must be after declaration at the same line.`,
                    {node: nextComment},
                )
              } else {
                nextComment.remove()
                return
              }
            }
            let targetUnit
            let targetSize
            const parentParams = rule.parent?.params
            if (options.enableLandscape && parentParams && parentParams.includes('landscape')) {
              targetUnit = options.landscapeUnit
              if (typeof options.landscapeViewportWidth === 'function') {
                const num = options.landscapeViewportWidth(sourceFile)
                if (!num)
                  return

                targetSize = num
              } else {
                targetSize = options.landscapeViewportWidth
              }
            } else {
              targetUnit = getUnitFromOptions(declaration.prop, options)
              if (typeof options.viewportWidth === 'function') {
                const num = options.viewportWidth(sourceFile)
                if (!num)
                  return

                targetSize = num
              } else {
                targetSize = options.viewportWidth
              }
            }
            const modifiedValue = declaration.value.replace(unitRegexp, createUnitReplaceFunction(options, targetUnit, targetSize))
            if (doesDeclarationExist(declaration.parent, declaration.prop, modifiedValue))
              return

            if (options.replaceRules)
              declaration.value = modifiedValue
            else
              declaration.parent?.insertAfter(index, declaration.clone({value: modifiedValue}))
          })
        })
      }
    },
    Once (css, {result}) {
      css.walkRules((rule) => {
        const sourceFile = rule.source?.input.file || ''
        // console.log(sourceFile)
        if (shouldExclude(options, sourceFile) || isBlacklistedSelector(rule.selector, options.selectorBlacklist))
          return void 0

        if (options.enableLandscape && !rule.parent?.params) {
          const landscapeRule = rule.clone().removeAll()
          rule.walkDecls((declaration) => {
            if (!declaration.value.includes(options.unitType) || !isAllowedProperty(declaration.prop))
              return

            let landscapeSize
            if (typeof options.landscapeViewportWidth === 'function') {
              const num = options.landscapeViewportWidth(sourceFile)
              if (!num)
                return

              landscapeSize = num
            } else {
              landscapeSize = options.landscapeViewportWidth
            }
            landscapeRule.append(
                declaration.clone({
                  value: declaration.value.replace(
                      unitRegexp,
                      createUnitReplaceFunction(options, options.landscapeUnit, landscapeSize),
                  ),
                }),
            )
          })
          if (landscapeRule.nodes.length > 0)
            landscapeAtRules.push(landscapeRule)
        }
        if (!validateMediaQueryParams(rule.parent?.params, options.allowMediaQuery))
          return

        rule.walkDecls((declaration, index) => {
          if (!declaration.value.includes(options.unitType) || !isAllowedProperty(declaration.prop))
            return

          const prevComment = declaration.prev()
          if (prevComment && prevComment.type === 'comment' && prevComment.text === IGNORE_NEXT_COMMENT) {
            prevComment.remove()
            return
          }
          const nextComment = declaration.next()
          if (nextComment && nextComment.type === 'comment' && nextComment.text === IGNORE_PREV_COMMENT) {
            if (/\n/.test(nextComment.raws.before)) {
              result.warn(
                  `Unexpected comment /* ${IGNORE_PREV_COMMENT} */ must be after declaration at the same line.`,
                  {node: nextComment},
              )
            } else {
              nextComment.remove()
              return
            }
          }
          let targetUnit
          let targetSize
          const parentParams = rule.parent?.params
          if (options.enableLandscape && parentParams && parentParams.includes('landscape')) {
            targetUnit = options.landscapeUnit
            if (typeof options.landscapeViewportWidth === 'function') {
              const num = options.landscapeViewportWidth(sourceFile)
              if (!num)
                return

              targetSize = num
            } else {
              targetSize = options.landscapeViewportWidth
            }
          } else {
            targetUnit = getUnitFromOptions(declaration.prop, options)
            if (typeof options.viewportWidth === 'function') {
              const num = options.viewportWidth(sourceFile)
              if (!num)
                return

              targetSize = num
            } else {
              targetSize = options.viewportWidth
            }
          }
          const modifiedValue = declaration.value.replace(unitRegexp, createUnitReplaceFunction(options, targetUnit, targetSize))
          if (doesDeclarationExist(declaration.parent, declaration.prop, modifiedValue))
            return

          if (options.replaceRules)
            declaration.value = modifiedValue
          else
            declaration.parent?.insertAfter(index, declaration.clone({value: modifiedValue}))
        })
      })
    },
    OnceExit (css, {AtRule}) {
      if (landscapeAtRules.length > 0) {
        const landscapeMediaRule = new AtRule({
          params: '(orientation: landscape)',
          name: 'media',
        })
        landscapeAtRules.forEach((landscapeRule) => {
          landscapeMediaRule.append(landscapeRule)
        })
        css.append(landscapeMediaRule)
      }
    },
  }
}

const postcssPlugin = opts => plugin(opts)

export { postcssPlugin as default }

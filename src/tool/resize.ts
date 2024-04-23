function onResize () {
  window.requestAnimationFrame(() => {
    const MAX_W = 1380
    const w = window.innerWidth
    if (w > 780 && w < MAX_W)
      document.body.style.cssText = `zoom:${w / MAX_W};width:${MAX_W}px;`
    else
      document.body.style.cssText = ''
  })
}

window.addEventListener('resize', onResize)
onResize()

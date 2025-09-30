export default function createPlayerDetailDirective(router) {
  return {
    mounted(el, binding) {
      if (!binding.value) {
        //console.warn('PlayerDetail directive requires a player ID value')
        return
      }
      el.addEventListener('click', () => {
        const { href } = router.resolve({
          name: 'playerDetail',
          params: { playerId: binding.value },
        })
        window.open(href, '_blank')
      })
    },
  }
}

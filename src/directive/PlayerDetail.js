export default function createPlayerDetailDirective(router) {
  return {
    mounted(el, binding) {
      if (!binding.value) {
        console.warn('PlayerDetail directive requires a player ID value')
        return
      }
      el.addEventListener('dblclick', () => {
        router.push({
          name: 'playerDetail',
          params: { playerId: binding.value },
        })
      })
    },
  }
}

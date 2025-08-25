export const queryParams = (additional) => {
  return {
    Skip: null,
    Take: null,
    Sort: 'id desc',
    ...additional,
  }
}

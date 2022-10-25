export const actionsTypes = {
    CHANGE: 'TIMER_CHANGE'
}

export const change = (payload) => ({
  type: actionsTypes.CHANGE,
  payload
})

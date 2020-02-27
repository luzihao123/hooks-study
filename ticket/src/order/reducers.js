export default {
  isDateSelectorVisible(state = false, action) {
    const { type, payload } = action;
    switch (type) {
        case 'd':
            return payload;
        default:
    }

    return state;
  },
}
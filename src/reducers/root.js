const rootReducer = (state, action) => {
  switch (action.type) {
    case 'START_LOADING':
      return { loading: true };
    case 'END_LOADING':
      return { loading: false };
    default:
      return { loading: false };
  }
};
export default rootReducer;

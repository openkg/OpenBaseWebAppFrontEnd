const showLoading = show => {
  const type = show ? 'BEGIN_LOADING' : 'END_LOADING';
  return { type };
};
export default showLoading;
export { showLoading };

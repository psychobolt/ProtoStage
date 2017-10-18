const divider = {
  width: '5px',
  cursor: 'ew-resize',
};

export default {
  container: {
    alignItems: 'stretch',
    height: '100%',
  },
  divider,
  panel: {
    width: `calc(50% - ${parseInt(divider.width, 10) / 2}px`,
    height: '100%',
    overflow: 'hidden',
  },
};

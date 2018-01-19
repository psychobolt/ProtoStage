const divider = {
  borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
  margin: '0 2px',
  cursor: 'ew-resize',
};

export default {
  container: {
    alignItems: 'stretch',
    height: '100%',
  },
  divider,
  panel: {
    width: 'calc(50% - 2.5px)',
    height: '100%',
    overflow: 'hidden',
  },
};

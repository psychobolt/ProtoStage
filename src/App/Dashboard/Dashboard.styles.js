import { styles as menuStyles } from './Menu';

export default {
  container: {
    alignItems: 'stretch',
    minWidth: '1000px',
  },
  content: {
    width: `calc(100% - ${menuStyles.container.width})`,
    paddingLeft: '30px',
    paddingRight: '30px',
  },
};

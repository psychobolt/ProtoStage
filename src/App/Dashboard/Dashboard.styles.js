import { styles as menuStyles } from './Menu';

export default {
  container: {
    height: '100%',
    minWidth: '1000px',
  },
  content: {
    width: `calc(100% - ${menuStyles.container.width})`,
    height: '100%',
    paddingLeft: '30px',
    paddingRight: '30px',
  },
  card: {
    height: '50%',
  },
};

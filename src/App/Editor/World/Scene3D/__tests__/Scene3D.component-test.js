import React from 'react';
import { shallow /* , mount */ } from 'enzyme';

import Scene3D from '../Scene3D.component';

test('component <Scene /> should render without crashing', () => {
  // mount(<Scene3D />); // see https://github.com/facebook/react/pull/12725
  const wrapper = shallow(<Scene3D />);
  wrapper.dive();
});

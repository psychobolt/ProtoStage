import React from 'react';
import { mount } from 'enzyme';

import Scene3D from '../Scene3D.component';

test('component <Scene /> should render correctly', () => {
  const wrapper = mount(<Scene3D />);
  expect(wrapper).toMatchSnapshot();
});

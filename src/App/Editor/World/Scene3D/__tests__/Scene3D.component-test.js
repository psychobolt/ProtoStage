
import React from 'react';
import { mount } from 'enzyme';

import Scene3D from '../Scene3D.component'; // eslint-disable-line import/no-named-as-default

test('component <Scene3D /> should render without crashing', () => {
  mount(<Scene3D />);
});

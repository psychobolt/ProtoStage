import React from 'react';
import { Tool } from '@psychobolt/react-paperjs';

import withTool from '../shared/Tool';

export const TOOL_NAME = 'Noop';

export default withTool({
  TOOL_NAME,
  getTool: ref => <Tool key={`${TOOL_NAME}Tool`} ref={ref} />,
});

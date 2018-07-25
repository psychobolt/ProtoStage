import { css } from 'styled-components';

export const container = css`
  width: 100%;
  height: calc(100% - 128px);

  &[drag-state='enabled'] {
    cursor: grab;
  }

  &[drag-state='dragging'] {
    cursor: grabbing;
  }
`;

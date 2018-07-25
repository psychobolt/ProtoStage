// @flow
import React from 'react';

import BodyOptions, { type Props as BodyOptionsProps } from './BodyOptions';
import FixtureOptions, { type Props as FixtureOptionsProps } from './FixtureOptions';
import JointOptions, { type Props as JointOptionsProps } from './JointOptions';
import WorldOptions, { type Props as WorldOptionsProps } from './WorldOptions';
import styles from './Toolbar.style';

type Props = BodyOptionsProps & FixtureOptionsProps & JointOptionsProps & WorldOptionsProps;

const Toolbar = ({
  bodyIds,
  bodies,
  activeBody,
  selectBody,
  removeBody,
  updateBody,
  pixelsPerMeter,
  setPixelsPerMeter,
  fixtures,
  activeFixture,
  setActiveFixture,
  updateFixture,
  paths,
  jointIds,
  joints,
  activeJoint,
  addJoint,
  removeJoint,
  updateJoint,
  setActiveJoint,
  addAnchor,
  removeAnchor,
  updateAnchor,
  tracking,
  gravity,
  updateGravity,
  mouseForce,
  updateMouseForce,
  speed,
  updateSpeed,
  toggleTracking,
}: Props) => (
  <x-box style={styles.container} vertical>
    <x-box>
      <BodyOptions
        bodyIds={bodyIds}
        bodies={bodies}
        activeBody={activeBody}
        selectBody={selectBody}
        removeBody={removeBody}
        updateBody={updateBody}
      />
      <JointOptions
        pixelsPerMeter={pixelsPerMeter}
        bodyIds={bodyIds}
        bodies={bodies}
        fixtures={fixtures}
        paths={paths}
        joint={joints[activeJoint]}
        jointIds={jointIds}
        activeJoint={activeJoint}
        addJoint={addJoint}
        removeJoint={removeJoint}
        updateJoint={updateJoint}
        setActiveJoint={setActiveJoint}
        addAnchor={addAnchor}
        removeAnchor={removeAnchor}
        updateAnchor={updateAnchor}
      />
    </x-box>
    <hr style={styles.divider} />
    <x-box>
      <FixtureOptions
        body={bodies[activeBody]}
        fixtures={fixtures}
        updateFixture={updateFixture}
        activeFixture={activeFixture}
        setActiveFixture={setActiveFixture}
      />
      <WorldOptions
        tracking={tracking}
        pixelsPerMeter={pixelsPerMeter}
        gravity={gravity}
        mouseForce={mouseForce}
        speed={speed}
        updateSpeed={updateSpeed}
        updateMouseForce={updateMouseForce}
        updateGravity={updateGravity}
        toggleTracking={toggleTracking}
        setPixelsPerMeter={setPixelsPerMeter}
      />
    </x-box>
  </x-box>
);

export default Toolbar;

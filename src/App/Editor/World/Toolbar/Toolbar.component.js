// @flow
import React from 'react';

import BodyOptions, { type Props as BodyOptionsProps } from './BodyOptions';
import FixtureOptions, { type Props as FixtureOptionsProps } from './FixtureOptions';
import JointOptions, { type Props as JointOptionsProps } from './JointOptions';
import WorldOptions, { type Props as WorldOptionsProps } from './WorldOptions';
import styles from './Toolbar.style';

type Props = BodyOptionsProps & FixtureOptionsProps & JointOptionsProps & WorldOptionsProps;

const Toolbar = (props: Props) => (
  <x-box style={styles.container} vertical>
    <x-box>
      <BodyOptions
        bodyIds={props.bodyIds}
        bodies={props.bodies}
        activeBody={props.activeBody}
        selectBody={props.selectBody}
        removeBody={props.removeBody}
        updateBody={props.updateBody}
      />
      <JointOptions
        pixelsPerMeter={props.pixelsPerMeter}
        bodyIds={props.bodyIds}
        bodies={props.bodies}
        fixtures={props.fixtures}
        paths={props.paths}
        joint={props.joints[props.activeJoint]}
        jointIds={props.jointIds}
        activeJoint={props.activeJoint}
        addJoint={props.addJoint}
        removeJoint={props.removeJoint}
        updateJoint={props.updateJoint}
        setActiveJoint={props.setActiveJoint}
        addAnchor={props.addAnchor}
        removeAnchor={props.removeAnchor}
        updateAnchor={props.updateAnchor}
      />
    </x-box>
    <hr style={styles.divider} />
    <x-box>
      <FixtureOptions
        body={props.bodies[props.activeBody]}
        fixtures={props.fixtures}
        updateFixture={props.updateFixture}
        activeFixture={props.activeFixture}
        setActiveFixture={props.setActiveFixture}
      />
      <WorldOptions
        tracking={props.tracking}
        pixelsPerMeter={props.pixelsPerMeter}
        gravity={props.gravity}
        mouseForce={props.mouseForce}
        speed={props.speed}
        updateSpeed={props.updateSpeed}
        updateMouseForce={props.updateMouseForce}
        updateGravity={props.updateGravity}
        toggleTracking={props.toggleTracking}
        setPixelsPerMeter={props.setPixelsPerMeter}
      />
    </x-box>
  </x-box>
);

export default Toolbar;

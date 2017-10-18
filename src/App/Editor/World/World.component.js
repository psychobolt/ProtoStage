// @flow
import React from 'react';
import { type Location } from 'react-router-dom';
import {
  SceneModule,
  DefineModule,
  PerspectiveCamera,
  RenderingModule,
  OrbitControlsModule,
  ResizeModule,
} from 'whs/build/whs';
import { App } from 'react-whs';
import * as THREE from 'three';

import Fragment from './World.fragment';
import styles from './World.styles';

const containerId = 'world-container';

type Props = {
  style: {
    container: {}
  },
  location: Location
};

type State = {
  mounted: boolean
};

export default class World extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      mounted: false,
    };
  }

  componentDidMount() {
    this.onMount(() => this.setState({ mounted: true }));
  }

  onMount = (callback: () => mixed) => {
    callback();
  }

  container: ?HTMLDivElement;

  render() {
    const { style, location } = this.props;
    const { mounted } = this.state;
    const container = this.container;
    const box: ?ClientRect = container && container.getBoundingClientRect();
    return (
      <div id={containerId} style={style.container} ref={ref => { this.container = ref; }}>
        {mounted && box && <App
          modules={[
            new SceneModule(),
            new DefineModule('camera', new PerspectiveCamera({
              aspect: box.width / box.height,
              position: new THREE.Vector3(0, 10, 50),
            })),
            new RenderingModule({
              bgColor: 0x162129,
              renderer: {
                antialias: true,
                shadowmap: {
                  type: THREE.PCFSoftShadowMap,
                },
              },
              width: box.width,
              height: box.height,
            }, { shadow: true }),
            new OrbitControlsModule(),
          ]}
          parentStyle={styles.parent}
          passAppToView={({ native }) => {
            native.manager.set('container', container);
            native.applyModule(new ResizeModule());
          }}
        >
          {Fragment({ location })}
        </App>}
      </div>
    );
  }
}

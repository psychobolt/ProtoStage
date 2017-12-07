// @flow
import React from 'react';
import {
  Box,
  Plane,
  PointLight,
  AmbientLight,
} from 'react-whs';
import * as THREE from 'three';

export default () => [
  <Box
    key="2"
    geometry={{
      width: 10,
      height: 10,
      depth: 10,
    }}
    material={new THREE.MeshPhongMaterial({ color: 0xF2F2F2 })}
    position={{
      y: 5,
    }}
  />,
  <Plane
    key="3"
    geometry={{
        width: 100,
        height: 100,
    }}
    material={new THREE.MeshPhongMaterial({ color: 0x447F8B })}
    rotation={{
        x: -Math.PI / 2,
    }}
  />,
  <PointLight
    key="4"
    intensity={0.5}
    distance={100}
    shadow={{
        fow: 90,
    }}
    position={new THREE.Vector3(0, 10, 10)}
  />,
  <AmbientLight
    key="5"
    intensity={0.4}
  />,
];

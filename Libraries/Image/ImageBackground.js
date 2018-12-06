/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactImageBackground
 * @flow
 * @format
 */
'use strict';

import Image from 'ReactImage';
import React from 'react';
import StyleSheet from 'ReactStyleSheet';
import View from 'ReactView';
import flattenStyle from 'ReactFlattenStyle';

/**
 * Very simple drop-in replacement for <Image> which supports nesting views.
 *
 * ```ReactNativeWebPlayer
 * import React, { Component } from 'react';
 * import { AppRegistry, View, ImageBackground, Text } from 'react-native';
 *
 * class DisplayAnImageBackground extends Component {
 *   render() {
 *     return (
 *       <ImageBackground
 *         style={{width: 50, height: 50}}
 *         source={{uri: 'https://facebook.github.io/react/logo-og.png'}}
 *       >
 *         <Text>React</Text>
 *       </ImageBackground>
 *     );
 *   }
 * }
 *
 * // App registration and rendering
 * AppRegistry.registerComponent('DisplayAnImageBackground', () => DisplayAnImageBackground);
 * ```
 */
class ImageBackground extends React.Component<$FlowFixMeProps> {
  setNativeProps(props: Object) {
    // Work-around flow
    const viewRef = this._viewRef;
    if (viewRef) {
      viewRef.setNativeProps(props);
    }
  }

  _viewRef: ?View = null;

  _captureRef = ref => {
    this._viewRef = ref;
  };

  render() {
    const {children, imageStyle, imageRef, ...props} = this.props;
    const style = flattenStyle(this.props.style) || {};

    return (
      <View style={style} ref={this._captureRef}>
        <Image
          {...props}
          style={[
            StyleSheet.absoluteFill,
            {
              // Temporary Workaround:
              // Current (imperfect yet) implementation of <Image> overwrites width and height styles
              // (which is not quite correct), and these styles conflict with explicitly set styles
              // of <ImageBackground> and with our internal layout model here.
              // So, we have to proxy/reapply these styles explicitly for actual <Image> component.
              // This workaround should be removed after implementing proper support of
              // intrinsic content size of the <Image>.
              width: style.width,
              height: style.height,
            },
            imageStyle,
          ]}
          ref={imageRef}
        />
        {children}
      </View>
    );
  }
}

export default ImageBackground;

/* eslint no-undef: 0 */
/* eslint arrow-parens: 0 */
import React from 'react';
import { enquireScreen } from 'enquire-js';

import Nav3 from './Nav3';
import Nav0 from './Nav0';
import Content6 from './Content6';
import Banner0 from './Banner0';
import Content0 from './Content0';
import Footer0 from './Footer0';

import {
  Nav30DataSource,
  Nav00DataSource,
  Content60DataSource,
  Banner00DataSource,
  Content00DataSource,
  Footer00DataSource,
} from './data.source';
import './less/tekoStyle.less';

let isMobile;
enquireScreen((b) => {
  isMobile = b;
});

const { location = {} } = typeof window !== 'undefined' ? window : {};

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isMobile,
      show: !location.port, // If it is not dva 2.0 please delete
    };
  }

  componentDidMount() {
    // Adapt to mobile phone screen;
    enquireScreen((b) => {
      this.setState({ isMobile: !!b });
    });
    // dva 2.0 The style is dynamically loaded after the component is rendered, causing the scrolling component to not take effect; it will not be affected online;
    /* f it is not dva 2.0 please delete start */
    if (location.port) {
      // The style build time is between 200-300ms;
      setTimeout(() => {
        this.setState({
          show: true,
        });
      }, 500);
    }
    /* f it is not dva 2.0 please delete end */
  }

  render() {
    const children = [
      <Nav3
        id="Nav3_0"
        key="Nav3_0"
        dataSource={Nav30DataSource}
        isMobile={this.state.isMobile}
      />,
      <Nav0
        id="Nav0_0"
        key="Nav0_0"
        dataSource={Nav00DataSource}
        isMobile={this.state.isMobile}
      />,
      <Content6
        id="Content6_0"
        key="Content6_0"
        dataSource={Content60DataSource}
        isMobile={this.state.isMobile}
      />,
      <Banner0
        id="Banner0_0"
        key="Banner0_0"
        dataSource={Banner00DataSource}
        isMobile={this.state.isMobile}
      />,
      <Content0
        id="Content0_0"
        key="Content0_0"
        dataSource={Content00DataSource}
        isMobile={this.state.isMobile}
      />,
      <Footer0
        id="Footer0_0"
        key="Footer0_0"
        dataSource={Footer00DataSource}
        isMobile={this.state.isMobile}
      />,
    ];
    return (
      <div
        className="templates-wrapper"
        ref={(d) => {
          this.dom = d;
        }}
      >
        {/* If it is not dva 2.0, replace with {children} start  */}
        {this.state.show && children}
        {/*  If it is not dva 2.0, replace with {children} end  */}
      </div>
    );
  }
}

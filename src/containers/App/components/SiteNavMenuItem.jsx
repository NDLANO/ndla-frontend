/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

 import React, { Component, PropTypes } from 'react';

 export default class SiteNavMenuItem extends Component {
   constructor(props) {
     super(props);

     this.closeCallback = null;
     this.state = {
       isOpen: false,
     };

     this.handleMouseOver = this.handleMouseOver.bind(this);
     this.handleMouseLeave = this.handleMouseLeave.bind(this);
   }

   componentWillUnmount() {
     if (this.closeCallback) {
       clearTimeout(this.closeCallback);
     }
   }

   handleMouseOver() {
     if (this.closeCallback) {
       clearTimeout(this.closeCallback);
       this.closeCallback = null;
     }
     this.setState({ isOpen: true });
   }

   handleMouseLeave() {
     this.closeCallback = setTimeout(() => {
       this.setState({ isOpen: false });
     }, this.props.delay);
   }

   render() {
     const { toggle, children, className } = this.props;
     const { isOpen } = this.state;

     return (
       <li className={className} onMouseOver={this.handleMouseOver} onMouseLeave={this.handleMouseLeave} >
         {toggle}
         {isOpen ? <span>{children}</span> : null}
       </li>
     );
   }
 }

 SiteNavMenuItem.propTypes = {
   toggle: PropTypes.node.isRequired,
   children: PropTypes.node,
   delay: PropTypes.number,
 };

 SiteNavMenuItem.defaultProps = {
   delay: 500,
 };

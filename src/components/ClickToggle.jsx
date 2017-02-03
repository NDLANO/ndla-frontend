/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

 import React, { PropTypes } from 'react';
 import elementType from 'react-prop-types/lib/elementType';
 import { Button } from 'ndla-ui';

 export default class ClickToggle extends React.Component {
   constructor(props) {
     super(props);

     this.state = {
       isOpen: false,
     };

     this.handleClick = this.handleClick.bind(this);
   }

   handleClick() {
     this.setState({ isOpen: !this.state.isOpen });
   }

   render() {
     const { title, children, buttonClassName, containerClass: Component, ...rest } = this.props;
     const { isOpen } = this.state;

     return (
       <Component {...rest}>
         { isOpen ? <Button stripped className="o-overlay" onClick={() => this.setState({ isOpen: false })} /> : null }
         <Button stripped className={buttonClassName} onClick={this.handleClick} >
           { title }
         </Button>
         { isOpen ? children : null }
       </Component>
     );
   }
 }

 ClickToggle.propTypes = {
   containerClass: elementType,
   title: PropTypes.node.isRequired,
   buttonClassName: PropTypes.string,
   className: PropTypes.string,
   children: PropTypes.node,
 };

 ClickToggle.defaultProps = {
   containerClass: 'div',
 };

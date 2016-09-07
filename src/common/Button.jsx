/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { PropTypes } from 'react';
import classNames from 'classnames';

const Button = ({ className, submit, loading, ...rest }) => {
  const classes = classNames(
      'btn',
      className
    );

  const type = submit ? 'submit' : rest.type || 'button';

    // Unless the disabled state is explicitly set, the button is disabled when loading.
  const disabled = (rest.disabled !== undefined ? rest.disabled : loading) || false;

  return (
    <button {...rest} type={type} disabled={disabled} className={classes} >
      {rest.children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  disabled: PropTypes.bool,

  loading: PropTypes.bool,
  onClick: PropTypes.func,

  /**
  * Applies the submit attribute to the button for use in forms. This overrides the type
  */
  submit: PropTypes.bool,

  /**
  * Defines HTML button type Attribute
  * @type {("button"|"reset"|"submit")}
  * @defaultValue 'button'
  */
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
};

export default Button;

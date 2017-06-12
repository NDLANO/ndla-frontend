/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import invariant from 'invariant';

export default function formatMessage(
  locale,
  messages,
  getMessageFormat,
  id,
  values = {},
) {
  // `id` is a required parameter.
  invariant(id, 'An `id` must be provided to format a message.');

  const message = messages && messages[id];
  const hasValues = Object.keys(values).length > 0;

  // Avoid expensive message formatting for simple messages without values. In
  // development messages will always be formatted in case of missing values.
  if (!hasValues && process.env.NODE_ENV === 'production') {
    return message || id;
  }

  let formattedMessage;

  if (message) {
    try {
      const formatter = getMessageFormat(message, locale, {});

      formattedMessage = formatter.format(values);
    } catch (e) {
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.error(
          `Error formatting message: "${id}" for locale: "${locale}"\n${e}`,
        );
      }
    }
  } else if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.error(
      `Missing message: "${id}" for locale: "${locale}", using id as fallback`,
    );
    return id;
  }

  if (!formattedMessage) {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.error(
        `Cannot format message: "${id}", using message source as fallback.`,
      );
    }
  }

  return formattedMessage || message || id;
}

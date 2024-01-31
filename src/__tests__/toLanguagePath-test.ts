/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { toLanguagePath } from '../toLanguagePath';

describe('toLanguagePath', () => {
  it('should return path if language is nb', () => {
    expect(toLanguagePath('/path', 'nb')).toEqual('/path');
  });

  it('should return path with language if path does not start with /', () => {
    expect(toLanguagePath('path', 'nn')).toEqual('/nn/path');
  });

  it('should return path with language if path starts with /', () => {
    expect(toLanguagePath('/path', 'nn')).toEqual('/nn/path');
  });

  it('should return path with language if path starts with / and language is nb', () => {
    expect(toLanguagePath('/path', 'nb')).toEqual('/path');
  });
  it('should return path with language if path starts with /nn/ and language is nn', () => {
    expect(toLanguagePath('/nn/path', 'nn')).toEqual('/nn/path');
  });
  it('should return path with language if path starts with /nn/ and language is en', () => {
    expect(toLanguagePath('/nn/path', 'en')).toEqual('/en/path');
  });
  it('should return path without language if path starts with /nn/ and language is nb', () => {
    expect(toLanguagePath('/nn/path', 'nb')).toEqual('/path');
  });
  it('languages without translations should redirect to en', () => {
    expect(toLanguagePath('/path', 'uk')).toEqual('/en/path');
  });
  it('languages without translations not starting with / should redirect to en', () => {
    expect(toLanguagePath('path', 'uk')).toEqual('/en/path');
  });
});

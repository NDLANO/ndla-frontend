import { GQLCopyright } from '../../graphqlTypes';

export const getLicenseCredits = (copyright: GQLCopyright) => {
  if (copyright.creators && copyright.creators.length > 0) {
    return copyright.creators;
  }
  if (copyright.rightsholders && copyright.rightsholders.length > 0) {
    return copyright.rightsholders;
  }
  if (copyright.processors && copyright.processors.length > 0) {
    return copyright.processors;
  }
  return [];
};

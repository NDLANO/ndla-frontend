import {
  searchResultToLinkProps,
  converSearchStringToObject,
} from '../searchHelpers';

test('searchHelpers searchResultToLinkProps learningpath', () => {
  const result = {
    id: 500,
    resourceType: 'urn:resourcetype:learningPath',
    path: '/learningpath/500',
    paths: ['/urn:lp:500'],
  };

  expect(searchResultToLinkProps(result)).toMatchSnapshot();
});

test('searchHelpers searchResultToLinkProps article', () => {
  const result = {
    id: 300,
    resourceType: 'urn:resourcetype:subjectMaterial',
    path: '/article/300',
    paths: ['/urn:lp:300'],
  };

  expect(searchResultToLinkProps(result)).toMatchSnapshot();
});

test('searchHelpers searchResultToLinkProps article without paths', () => {
  const result = {
    id: 404,
    resourceType: 'urn:resourcetype:subjectMaterial',
  };

  expect(searchResultToLinkProps(result)).toMatchSnapshot();
});

test('searchHelpers converSearchStringToObject converts search string', () => {
  const locationWithSearch = {
    search:
      '?query=test&page=3&language-filter=1,2,3&levels=urn:test:3,urn:test:1,urn:test:2&subjects=urn:test:3,urn:test:1,urn:test:2',
  };

  expect(converSearchStringToObject(locationWithSearch)).toMatchSnapshot();
});

test('searchHelpers converSearchStringToObject with no location', () => {
  expect(converSearchStringToObject()).toMatchSnapshot();
});

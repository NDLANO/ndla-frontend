import {
  searchResultToLinkProps,
  converSearchStringToObject,
  convertSearchParam,
  convertResult,
  selectContext,
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
      '?query=test&page=3&languageFilter=1,2,3&subjects=urn:test:3,urn:test:1,urn:test:2',
  };

  expect(converSearchStringToObject(locationWithSearch)).toMatchSnapshot();
});

test('searchHelpers converSearchStringToObject with no location', () => {
  expect(converSearchStringToObject()).toMatchSnapshot();
});

test('searchHelpers convertSearchParam', () => {
  expect(convertSearchParam()).toEqual(undefined);
  expect(convertSearchParam('NDLA')).toBe('NDLA');
  expect(convertSearchParam(27)).toBe(27);
  expect(convertSearchParam([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])).toBe(
    '1,2,3,4,5,6,7,8,9,10',
  );
});

test('searchHelpers convertResults', () => {
  expect(convertResult([])).toEqual([]);
});

test('searchHelper select context by provided filter', () => {
  const contexts = [
    {
      id: 'urn:resource:1:171839',
      path: '/subject:1/topic:1:103867/topic:1:185037/resource:1:171839',
    },
    {
      id: 'urn:resource:1:171839',
      path: '/subject:14/topic:1:126720/topic:1:186445/resource:1:171839',
    },
    {
      id: 'urn:resource:1:171839',
      path: '/subject:24/topic:1:126720/topic:1:186445/resource:1:171839',
    },
  ];

  expect(selectContext(contexts, ['urn:subject:14']).path).toBe(
    '/subject:14/topic:1:126720/topic:1:186445/resource:1:171839',
  );
});

test('searchHelper select topic context in topic article tab', () => {
  const contexts = [
    {
      id: 'urn:resource:1:171839',
      path: '/subject:14/topic:1:103867/topic:1:185037/resource:1:171839',
    },
    {
      id: 'urn:resource:1:171839',
      path: '/subject:14/topic:1:126720/topic:1:186445/resource:1:171839',
    },
    {
      id: 'urn:topic:68aea645',
      path: '/subject:4769da63-fa10-4666-bf93-55173c57753f/topic:68aea645',
    },
  ];

  expect(selectContext(contexts, ['urn:subject:14'], 'topic-article').id).toBe(
    'urn:topic:68aea645',
  );
});

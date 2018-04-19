import gql from 'graphql-tag';

const contributorInfoFragment = gql`
  fragment ContributorInfo on Contributor {
    name
    type
  }
`;

const copyrightInfoFragment = gql`
  ${contributorInfoFragment}
  fragment CopyrightInfo on Copyright {
    license {
      license
      url
    }
    creators {
      ...ContributorInfo
    }
    processors {
      ...ContributorInfo
    }
    rightsholders {
      ...ContributorInfo
    }
  }
`;

const topicInfoFragment = gql`
  fragment TopicInfo on Topic {
    id
    name
    path
  }
`;

const subjectInfoFragment = gql`
  fragment SubjectInfo on Subject {
    id
    name
    path
  }
`;

export const subjectsQuery = gql`
  ${subjectInfoFragment}

  query subjects {
    subjects {
      ...SubjectInfo
    }
  }
`;

export const resourceQuery = gql`
  ${copyrightInfoFragment}
  ${topicInfoFragment}

  query resource($id: String!, $subjectId: String!) {
    subject(id: $subjectId) {
      id
      name
      path
      topics(all: true) {
        ...TopicInfo
      }
    }
    resource(id: $id) {
      name
      contentUri
      article {
        title
        introduction
        content
        metaDescription
        created
        updated
        requiredLibraries {
          name
          mediaType
        }
        metaData {
          footnotes {
            ref
            title
            year
            authors
            edition
            publisher
            url
          }
          images {
            title
            altText
            src
            copyright {
              ...CopyrightInfo
            }
          }
          audios {
            title
            src
            copyright {
              ...CopyrightInfo
            }
          }
          brightcoves {
            title
            cover
            src
            iframe {
              height
              src
              width
            }
            copyright {
              ...CopyrightInfo
            }
          }
        }
        copyright {
          ...CopyrightInfo
        }
      }
      resourceTypes {
        id
        name
      }
    }
  }
`;

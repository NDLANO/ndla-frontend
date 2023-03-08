/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { css } from '@emotion/react';
import { spacingUnit, utils } from '@ndla/core';
import { gql } from '@apollo/client';
import {
  FilmSlideshow,
  AboutNdlaFilm,
  FilmMovieSearch,
  AllMoviesAlphabetically,
} from '@ndla/ui';
import { TFunction, withTranslation, WithTranslation } from 'react-i18next';
import styled from '@emotion/styled';

import MovieCategory from './MovieCategory';
import { htmlTitle } from '../../util/titleHelper';
import {
  GQLFilmFrontpage_FilmFrontpageFragment,
  GQLFilmFrontpage_SubjectFragment,
} from '../../graphqlTypes';
import MoreAboutNdlaFilm from './MoreAboutNdlaFilm';
import { MoviesByType } from './NdlaFilmFrontpage';
import { movieFragment } from '../../queries';
import SocialMediaMetadata from '../../components/SocialMediaMetadata';

const ARIA_FILMCATEGORY_ID = 'movieCategoriesId';

const sortAlphabetically = (movies: MoviesByType[], locale: string) =>
  movies.sort((a, b) => {
    if (!a.title && !b.title) {
      return 0;
    } else if (!a.title && b.title) {
      return +1;
    } else if (!b.title && a.title) {
      return -1;
    } else return a.title!.localeCompare(b.title!, locale);
  });

const StyledH1 = styled.h1`
  ${utils.visuallyHidden}
`;

interface Props extends WithTranslation {
  filmFrontpage?: GQLFilmFrontpage_FilmFrontpageFragment;
  showingAll?: boolean;
  fetchingMoviesByType?: boolean;
  moviesByType?: MoviesByType[];
  subject?: GQLFilmFrontpage_SubjectFragment;
  resourceTypes: { id: string; name: string }[];
  onSelectedMovieByType: (resourceId: string) => void;
  skipToContentId?: string;
}
const getDocumentTitle = (
  t: TFunction,
  subject: GQLFilmFrontpage_SubjectFragment | undefined,
) => htmlTitle(subject?.name, [t('htmlTitles.titleTemplate')]);

const FilmFrontpage = ({
  filmFrontpage,
  resourceTypes = [],
  t,
  subject,
  moviesByType = [],
  showingAll,
  skipToContentId,
  fetchingMoviesByType,
  onSelectedMovieByType,
  i18n,
}: Props) => {
  const [resourceTypeSelected, setResourceTypeSelected] = useState<
    string | undefined
  >(undefined);
  const [loadingPlaceholderHeight, setLoadingPlaceholderHeight] = useState<
    string
  >('');
  const movieListRef = useRef<HTMLDivElement | null>(null);
  const about = filmFrontpage?.about?.find(
    about => about.language === i18n.language,
  );

  const onChangeResourceType = (resourceType?: string) => {
    const placeholderHeight = `${
      movieListRef.current?.getBoundingClientRect().height
    }px`;

    if (resourceType) {
      onSelectedMovieByType(resourceType);
    }
    setLoadingPlaceholderHeight(placeholderHeight);
    setResourceTypeSelected(resourceType);
  };

  const resourceTypeName = resourceTypeSelected
    ? resourceTypes.find(rt => rt.id === resourceTypeSelected)
    : undefined;

  const pageTitle = getDocumentTitle(t, subject);

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>
      <SocialMediaMetadata
        type="website"
        title={subject?.name ?? ''}
        description={about?.description}
      />
      <StyledH1>{t('ndlaFilm.heading')}</StyledH1>
      <main>
        <FilmSlideshow slideshow={filmFrontpage?.slideShow ?? []} />
        <FilmMovieSearch
          skipToContentId={skipToContentId}
          ariaControlId={ARIA_FILMCATEGORY_ID}
          topics={subject?.topics ?? []}
          resourceTypes={resourceTypes}
          resourceTypeSelected={resourceTypeName}
          onChangeResourceType={onChangeResourceType}
        />
        <div
          ref={movieListRef}
          css={css`
            margin: ${spacingUnit * 3}px 0 ${spacingUnit * 4}px;
          `}>
          {showingAll ? (
            <AllMoviesAlphabetically
              movies={sortAlphabetically(moviesByType, i18n.language)}
            />
          ) : (
            <MovieCategory
              resourceTypeName={resourceTypeName}
              moviesByType={moviesByType}
              resourceTypes={resourceTypes}
              themes={filmFrontpage?.movieThemes ?? []}
              fetchingMoviesByType={fetchingMoviesByType}
              resourceTypeSelected={resourceTypeSelected}
              loadingPlaceholderHeight={loadingPlaceholderHeight}
            />
          )}
        </div>
        {about && (
          <AboutNdlaFilm
            aboutNDLAVideo={about}
            moreAboutNdlaFilm={<MoreAboutNdlaFilm />}
          />
        )}
      </main>
    </>
  );
};

FilmFrontpage.getDocumentTitle = ({ t, subject }: Props) => {
  return getDocumentTitle(t, subject);
};

export const filmFrontpageFragments = {
  subject: gql`
    fragment FilmFrontpage_Subject on Subject {
      name
      topics {
        id
        path
        name
      }
    }
  `,
  filmFrontpage: gql`
    fragment FilmFrontpage_FilmFrontpage on FilmFrontpage {
      slideShow {
        ...MovieInfo
      }
      movieThemes {
        ...MovieCategory_MovieTheme
      }
      about {
        title
        description
        visualElement {
          alt
          url
          type
        }
        language
      }
    }
    ${MovieCategory.fragments.movieTheme}
    ${movieFragment}
  `,
};

export default withTranslation()(FilmFrontpage);

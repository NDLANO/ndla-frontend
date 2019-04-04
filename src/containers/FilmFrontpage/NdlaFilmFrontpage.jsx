/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { withApollo } from 'react-apollo';
import FilmFrontpage from './FilmFrontpage';
import { runQueries } from '../../util/runQueries';
import {
  subjectPageQuery,
  filmFrontPageQuery,
  searchQuery,
} from '../../queries';
import {
  GraphQLFilmFrontpageShape,
  GraphqlErrorShape,
  GraphQLSubjectShape,
} from '../../graphqlShapes';

import handleError from '../../util/handleError';

class NdlaFilm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      moviesByType: [],
      fetchingMoviesByType: false,
    };
    this.onSelectedMovieByType = this.onSelectedMovieByType.bind(this);
  }

  static async getInitialProps(ctx) {
    const { client } = ctx;
    return runQueries(client, [
      {
        query: filmFrontPageQuery,
      },
      {
        query: subjectPageQuery,
        variables: { subjectId: 'urn:subject:20', filterIds: '' },
      },
    ]);
  }

  onSelectedMovieByType = async resourceId => {
    this.setState({
      fetchingMoviesByType: true,
    });

    this.setState({
      fetchingMoviesByType: false,
      moviesByType: await this.fetchMoviesByType(resourceId),
    });
  };

  transformMoviesByType(movie) {
    const path = movie.contexts.find(
      context => context.learningResourceType === 'topic-article',
    ).path;

    const resourceTypes = movie.contexts.flatMap(
      context => context.resourceTypes,
    );

    return {
      ...movie,
      url: path,
      resourceTypes: resourceTypes,
    };
  }

  fetchMoviesByType = async resourceId => {
    try {
      const { data } = await runQueries(this.props.client, [
        {
          query: searchQuery,
          variables: {
            subjects: 'urn:subject:20',
            resourceTypes: resourceId,
            pageSize: '100',
            contextTypes: 'topic-article',
          },
        },
      ]);
      return data.search.results.map(this.transformMoviesByType);
    } catch (error) {
      handleError(error);
      return { error: true };
    }
  };

  render() {
    const { moviesByType, fetchingMoviesByType } = this.state;
    const { filmfrontpage, subject } = this.props.data;

    const movieResourceTypes = [
      {
        name: 'Dokumentar',
        id: 'urn:resourcetype:documentary',
      },
      {
        name: 'Spillefilmer',
        id: 'urn:resourcetype:featureFilm',
      },
      {
        name: 'Tv-serier',
        id: 'urn:resourcetype:series',
      },
      {
        name: 'Kortfilmer',
        id: 'urn:resourcetype:shortFilm',
      },
    ];

    return (
      <FilmFrontpage
        highlighted={filmfrontpage ? filmfrontpage.slideShow : []}
        themes={filmfrontpage ? filmfrontpage.movieThemes : []}
        moviesByType={moviesByType}
        topics={subject ? subject.topics : []}
        resourceTypes={movieResourceTypes}
        onSelectedMovieByType={this.onSelectedMovieByType}
        aboutNDLAVideo={<img src={''} alt="example of video" />}
        fetchingMoviesByType={fetchingMoviesByType}
        moreAboutNdlaFilm={
          <>
            <h1>NDLA Film</h1>
            <hr />
            <p>
              Filmene i filmtjenesten er hentet fra norsk og internasjonal
              filmarv og kobles mot læreplaner i flere fag. De er valgt ut av
              NDLAs redaksjoner i samarbeid med Norgesfilm AS og Norsk
              filminstitutt.
            </p>
            <p>
              Du kan se filmene om du er koblet til Internett via datamaskinen,
              nettbrettet eller smarttelefonen din. Vi har gjort jobben med
              rettighetsklarering og betaling. Alt du trenger å gjøre, er å
              trykke play.
            </p>
            <p>
              Filmene er copyrightmerket. De kan fritt spilles av på ndla.no,
              men ikke lastes ned eller distribueres videre i andre
              publikasjoner. Alle rettighetshavere honoreres for de avspillinger
              som gjøres.
            </p>
            <h2>Bruk film i undervisningen</h2>
            <p>
              En film forteller historier på måter som engasjerer og berører
              oss. I film brukes noen av de mest effektive visuelle virkemidlene
              som finnes; bevegelige bilder og lyd. En god film kan vise sider
              ved samtiden og gi visjoner om framtiden eller kommentere
              fortiden. Derfor kan film ofte gi oss bedre forståelse av
              hendelser, kulturmøter og historie enn en fagtekst.
            </p>
            <p>
              Ved å se film blir elevene bedre rustet til å lese filmspråket,
              slik at filmen får en verdi ut over det rent
              underholdningsmessige. Den generelle delen av læreplanen legger
              vekt på at elevene skal møte kunst og kulturformer som stimulerer,
              inspirerer egen skaperevne, og fremmer etisk orienteringsevne og
              estetisk sans.
            </p>
            <p>
              Kom gjerne med tips, spørsmål eller filmønsker på{' '}
              <a
                href="https://www.facebook.com/NDLAfilm/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Besøk Facebooksiden til NDLA-film">
                Facebook-siden
              </a>{' '}
              vår.
            </p>
            <p>
              <strong>
                Vi ønsker alle filmelskere en god og lærerik opplevelse!
              </strong>
            </p>
          </>
        }
        language="nb"
      />
    );
  }
}

NdlaFilm.propTypes = {
  editor: PropTypes.bool,
  data: PropTypes.shape({
    filmfrontpage: GraphQLFilmFrontpageShape,
    subject: GraphQLSubjectShape,
    error: GraphqlErrorShape,
  }),
  client: PropTypes.shape({ query: PropTypes.func.isRequired }).isRequired,
};

export default compose(withApollo)(NdlaFilm);

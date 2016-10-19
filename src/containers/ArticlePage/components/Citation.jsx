import React, { PropTypes } from 'react';
import moment from 'moment'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

const Citation = ({...props}) => {
  const { article } = props
    const citation = {
      authors: article.copyright.authors.map(author => author.name).join(', '),
      created: article.created,
      place: 'Oslo',
      title: article.title,
      year: moment(article.created, 'DD.MM.YYYY').format('YYYY'),
      today: moment(new Date()).format('DD.MM.YYYY'),
      uri: window.location.href
    }

    const { authors, created, place, title, year, today, uri} = citation
    const citeMap = (citation) => {
      return [
        {
          name: 'MLA',
          format: (<span>{authors}. {year}. &laquo;{title}&raquo;. <em>Norsk Digital Læringsarena</em>. Lest {today}. {uri}</span>)
        },
        {
          name: 'Harvard',
          format: (<span>{authors} ({year}) <em>{title}</em> [Internett]. {place}: Norsk Digital Læringsarena. Tilgjengelig fra: {uri} [Lest {today}].</span>),
        },
        {
          name: 'Chicago',
          format: (<span>{authors}. &laquo;{title}&raquo;. {created}. Norsk Digital Læringsarena. Internett. &lt;{uri}&gt; {today}.</span>),
        },
      ]};

    return (
      <div>
        <h2>Referansestiler</h2>
        {citeMap(citation).map((style, key) =>
          <div key={key}>
            <h2>{style.name}</h2>
            <p>{style.format}</p>
          </div>)}
      </div>
        )
  }


Citation.propTypes = {

};
export default Citation;

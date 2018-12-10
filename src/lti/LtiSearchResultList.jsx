import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import BEMHelper from 'react-bem-helper';
import styled from 'react-emotion';
import { ChevronRight, Additional } from '@ndla/icons/common';
import { Tooltip } from '@ndla/ui';
import { uuid } from '@ndla/util';
import { injectT } from '@ndla/i18n';
import LtiEmbed from './LtiEmbed';

const searchResultItemClasses = BEMHelper('c-search-result-item');

const HeaderWrapper = styled('div')`
  display: flex;
  justify-content: space-between;
`;

export const searchResultItemShape = PropTypes.shape({
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  url: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  breadcrumb: PropTypes.arrayOf(PropTypes.string),
  subjects: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      url: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
    }),
  ),
  additional: PropTypes.bool,
  image: PropTypes.node,
  ingress: PropTypes.string.isRequired,
  contentTypeIcon: PropTypes.node.isRequired,
  contentTypeLabel: PropTypes.string.isRequired,
});

const LtiSearchResultItem = ({
  item,
  subjectsLabel,
  additionalContentToolip,
  ltiData,
}) => (
  <li key={item.id} {...searchResultItemClasses()}>
    <article>
      <HeaderWrapper>
        <header {...searchResultItemClasses('header')}>
          <h1>
            {item.url.href ? (
              <a {...item.url}>{item.title}</a>
            ) : (
              <a href={item.url} target="_blank" rel="noopener noreferrer">
                {item.title}
              </a>
            )}
          </h1>

          <div {...searchResultItemClasses('content-type-wrapper')}>
            {item.contentTypeIcon}
            <span {...searchResultItemClasses('content-type-label')}>
              {item.contentTypeLabel}
            </span>
          </div>
          {item.type && (
            <div {...searchResultItemClasses('pills')}>{item.type}</div>
          )}
          {item.additional &&
            (additionalContentToolip ? (
              <Tooltip
                id={`search-additional-tooltip-${item.id}`}
                tooltip={additionalContentToolip}
                {...searchResultItemClasses('additional')}>
                <Additional className="c-icon--20" />
              </Tooltip>
            ) : (
              <span {...searchResultItemClasses('additional')}>
                <Additional className="c-icon--20" />
              </span>
            ))}
        </header>
        <LtiEmbed ltiData={ltiData} item={item} />
      </HeaderWrapper>
      {item.breadcrumb &&
        item.breadcrumb.length > 0 && (
          <div {...searchResultItemClasses('breadcrumb')}>
            {item.breadcrumb.map((breadcrumbItem, index) => {
              let icon = null;

              if (index !== item.breadcrumb.length - 1) {
                icon = <ChevronRight />;
              }
              return (
                <Fragment key={uuid()}>
                  <span>{breadcrumbItem}</span>
                  {icon}
                </Fragment>
              );
            })}
          </div>
        )}
      <div {...searchResultItemClasses('content')}>
        <p
          {...searchResultItemClasses('ingress')}
          dangerouslySetInnerHTML={{ __html: item.ingress }}
        />
        {item.image}
      </div>
      {item.subjects &&
        item.subjects.length !== 0 && (
          <div {...searchResultItemClasses('subjects')}>
            <span>{subjectsLabel}</span>
            <ul>
              {item.subjects.map(subject => (
                <li key={uuid()}>
                  {subject.url.href ? (
                    <a {...subject.url}>{subject.title}</a>
                  ) : (
                    <a
                      href={subject.url}
                      target="_blank"
                      rel="noopener noreferrer">
                      {subject.title}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
    </article>
  </li>
);

LtiSearchResultItem.propTypes = {
  item: searchResultItemShape.isRequired,
  additionalContentToolip: PropTypes.string.isRequired,
  subjectsLabel: PropTypes.string.isRequired,
  ltiData: PropTypes.shape({
    launch_presentation_return_url: PropTypes.string,
    launch_presentation_document_target: PropTypes.string,
  }),
};

const LtiSearchResultList = ({ results, ltiData, t }) => {
  if (!results) return <article className="c-search-result-list__empty" />;
  return results.length === 0 ? (
    <article className="c-search-result-list__empty">
      <h1>{t('searchPage.searchResultListMessages.noResultHeading')}</h1>
      <p>{t('searchPage.searchResultListMessages.noResultDescription')}</p>
    </article>
  ) : (
    <ul className="c-search-result-list">
      {results.map(item => (
        <LtiSearchResultItem
          key={`search_result_item_${
            typeof item.url === 'object' ? item.url.href : item.url
          }`}
          item={item}
          ltiData={ltiData}
          additionalContentToolip={t('resource.tooltipAdditionalTopic')}
          subjectsLabel={t('searchPage.searchResultListMessages.subjectsLabel')}
        />
      ))}
    </ul>
  );
};

LtiSearchResultList.propTypes = {
  results: PropTypes.arrayOf(searchResultItemShape),
  ltiData: PropTypes.shape({
    launch_presentation_return_url: PropTypes.string,
    launch_presentation_document_target: PropTypes.string,
  }),
};

export default injectT(LtiSearchResultList);

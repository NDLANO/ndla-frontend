/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createRef, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { gql } from "@apollo/client";
import styled from "@emotion/styled";
import { breakpoints, mq } from "@ndla/core";
import { Heading, Text } from "@ndla/typography";
import { ContentPlaceholder, HomeBreadcrumb, LayoutItem, OneColumn, SimpleBreadcrumbItem } from "@ndla/ui";
import MultidisciplinaryTopicWrapper from "./components/MultidisciplinaryTopicWrapper";
import DefaultErrorMessage from "../../components/DefaultErrorMessage";
import NavigationBox from "../../components/NavigationBox";
import SocialMediaMetadata from "../../components/SocialMediaMetadata";
import { SKIP_TO_CONTENT_ID } from "../../constants";
import {
  GQLMultidisciplinarySubjectPageQuery,
  GQLMultidisciplinarySubjectPageQueryVariables,
} from "../../graphqlTypes";
import { removeUrn, toTopic, useUrnIds } from "../../routeHelpers";
import { useGraphQuery } from "../../util/runQueries";
import { htmlTitle } from "../../util/titleHelper";

const multidisciplinarySubjectPageQuery = gql`
  query multidisciplinarySubjectPage($subjectId: String!) {
    subject(id: $subjectId) {
      subjectpage {
        id
        about {
          title
        }
      }
      topics {
        id
        name
      }
      ...MultidisciplinaryTopicWrapper_Subject
    }
  }
  ${MultidisciplinaryTopicWrapper.fragments.subject}
`;

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledBackground = styled.div`
  width: 100%;
  background: linear-gradient(179.64deg, rgba(255, 255, 255, 0.6) 80.1%, rgba(255, 255, 255) 99.05%),
    linear-gradient(318.9deg, rgb(239, 238, 220, 0.6) 35.53%, rgb(250, 246, 235) 74.23%), rgb(221, 216, 175);
`;

const Illustration = styled.div`
  background-image: url("/static/illustrations/frontpage_multidisciplinary.svg");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: bottom;
  height: 88px;
  width: 100%;
  margin: 0 0 -15px;

  ${mq.range({ from: breakpoints.mobileWide })} {
    margin: 32px 0 -15px;
  }
  ${mq.range({ from: breakpoints.tablet })} {
    height: 114px;
    margin: 40px 0 -15px;
  }
  ${mq.range({ from: breakpoints.tabletWide })} {
    height: 146px;
    margin: 56px 0 -15px;
  }
  ${mq.range({ from: breakpoints.desktop })} {
    height: 175px;
  }
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin: 32px 0px;
`;
const selectionLimit = 2;

const MultidisciplinarySubjectPage = () => {
  const { t } = useTranslation();
  const { subjectId, topicList: selectedTopics } = useUrnIds();
  const refs = selectedTopics.map((_) => createRef<HTMLDivElement>());
  const [topicCrumbs, setTopicCrumbs] = useState<SimpleBreadcrumbItem[]>([]);

  useEffect(() => {
    setTopicCrumbs((crumbs) => crumbs.slice(0, selectedTopics.length));
  }, [selectedTopics.length]);

  useEffect(() => {
    if (selectedTopics.length) {
      const ref = refs[selectedTopics.length - 1];
      const positionFromTop = (ref?.current?.getBoundingClientRect().top ?? 0) + document.documentElement.scrollTop;
      window.scrollTo({
        top: positionFromTop - 100,
        behavior: "smooth",
      });
    }
  }, [refs, selectedTopics]);

  const { loading, data } = useGraphQuery<
    GQLMultidisciplinarySubjectPageQuery,
    GQLMultidisciplinarySubjectPageQueryVariables
  >(multidisciplinarySubjectPageQuery, {
    variables: {
      subjectId: subjectId!,
    },
  });

  if (loading) {
    return <ContentPlaceholder />;
  }

  if (!data?.subject) {
    return <DefaultErrorMessage />;
  }

  const breadCrumbs: SimpleBreadcrumbItem[] = [
    {
      name: t("breadcrumb.toFrontpage"),
      to: "/",
    },
    {
      to: `${removeUrn(data.subject.id)}`,
      name: data.subject.name,
    },
    ...topicCrumbs,
  ].reduce<SimpleBreadcrumbItem[]>((crumbs, crumb) => {
    crumbs.push({
      name: crumb.name,
      to: `${crumbs[crumbs.length - 1]?.to ?? ""}${crumb.to}`,
    });

    return crumbs;
  }, []);

  const { subject } = data;

  const mainTopics =
    subject.topics?.map((topic) => {
      return {
        ...topic,
        label: topic.name,
        selected: topic.id === selectedTopics[0],
        url: toTopic(subject.id, topic.id),
      };
    }) ?? [];

  return (
    <>
      {!selectedTopics.length && (
        <>
          <Helmet>
            <title>{htmlTitle(subject.name, [t("htmlTitles.titleTemplate")])}</title>
          </Helmet>
          <SocialMediaMetadata
            title={htmlTitle(subject.name)}
            description={t("frontpageMultidisciplinarySubject.text")}
          />
        </>
      )}
      <main>
        <StyledWrapper>
          <StyledBackground>
            <OneColumn wide>
              <Header>
                <LayoutItem layout="extend">
                  <HomeBreadcrumb items={breadCrumbs} />
                  <Heading
                    element="h1"
                    headingStyle="h1-resource"
                    id={selectedTopics.length === 0 ? SKIP_TO_CONTENT_ID : undefined}
                    tabIndex={-1}
                  >
                    {t("frontpageMultidisciplinarySubject.heading")}
                  </Heading>
                  <Text textStyle="ingress">{t("frontpageMultidisciplinarySubject.text")}</Text>
                </LayoutItem>
                <Illustration />
              </Header>
            </OneColumn>
          </StyledBackground>
          <OneColumn wide>
            <LayoutItem layout="extend">
              <NavigationBox items={mainTopics} listDirection="horizontal" />
              {selectedTopics.map((topicId, index) => (
                <div key={index} ref={refs[index]}>
                  <MultidisciplinaryTopicWrapper
                    index={index}
                    setCrumbs={setTopicCrumbs}
                    disableNav={index >= selectionLimit - 1}
                    topicId={topicId}
                    subjectId={subject.id}
                    subTopicId={selectedTopics[index + 1]}
                    subject={subject}
                    showSubtopics={index >= selectionLimit - 1}
                  />
                </div>
              ))}
            </LayoutItem>
          </OneColumn>
        </StyledWrapper>
      </main>
    </>
  );
};

export default MultidisciplinarySubjectPage;

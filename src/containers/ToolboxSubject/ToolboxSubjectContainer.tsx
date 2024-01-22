/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { TFunction } from "i18next";
import { useEffect, createRef, useState, useMemo, useContext } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { gql } from "@apollo/client";
import styled from "@emotion/styled";
import { spacing } from "@ndla/core";
import { useTracker } from "@ndla/tracker";
import { HomeBreadcrumb, OneColumn, SimpleBreadcrumbItem, SubjectBanner, ToolboxInfo } from "@ndla/ui";
import { ToolboxTopicContainer } from "./components/ToolboxTopicContainer";
import { AuthContext } from "../../components/AuthenticationContext";
import SocialMediaMetadata from "../../components/SocialMediaMetadata";
import { SKIP_TO_CONTENT_ID } from "../../constants";
import { GQLToolboxSubjectContainer_SubjectFragment } from "../../graphqlTypes";
import { removeUrn, toTopic } from "../../routeHelpers";
import { htmlTitle } from "../../util/titleHelper";
import { getAllDimensions } from "../../util/trackingUtil";

interface Props {
  subject: GQLToolboxSubjectContainer_SubjectFragment;
  topicList: string[];
}

const BreadcrumbWrapper = styled.div`
  margin-top: ${spacing.mediumlarge};
`;

const getSocialMediaMetaData = (
  { subject, topicList, t }: Pick<Props, "subject" | "topicList"> & { t: TFunction },
  selectedTopics?: string[],
) => {
  const topics = selectedTopics ?? getInitialSelectedTopics(topicList, subject);

  const selectedMetadata = [...(subject.allTopics ?? [])].reverse().find((t) => topics.includes(t.id));

  const selectedTitle = selectedMetadata?.name || selectedMetadata?.meta?.title;
  const subjectTitle = subject.name;
  const hasSelectedTitle = !!selectedTitle;
  const title = htmlTitle(hasSelectedTitle ? selectedTitle : subjectTitle, [
    hasSelectedTitle ? subjectTitle : undefined,
  ]);

  return {
    title,
    description:
      selectedMetadata?.meta?.metaDescription ||
      selectedMetadata?.meta?.introduction ||
      subject.subjectpage?.about?.description ||
      subject.subjectpage?.metaDescription ||
      t("frontpageMultidisciplinarySubject.text"),
    image: selectedMetadata?.meta?.metaImage || subject.subjectpage?.about?.visualElement,
  };
};

const getInitialSelectedTopics = (
  topicList: string[],
  subject: GQLToolboxSubjectContainer_SubjectFragment,
): string[] => {
  let initialSelectedTopics: string[] = [];
  topicList.forEach((topicId) => {
    const alreadySelected = initialSelectedTopics.find((topic) => topic === topicId);
    if (!alreadySelected) {
      const exist = subject?.allTopics?.find((topic) => topic.id === topicId);
      if (exist) initialSelectedTopics = [exist.id, ...initialSelectedTopics];
    }
  });

  return initialSelectedTopics;
};

const ToolboxSubjectContainer = ({ topicList, subject }: Props) => {
  const { t } = useTranslation();
  const { user, authContextLoaded } = useContext(AuthContext);
  const { trackPageView } = useTracker();
  const selectedTopics = topicList;

  useEffect(() => {
    if (!authContextLoaded) return;
    if (subject && topicList.length === 0) {
      const topicPath = topicList.map((id) => subject.allTopics?.find((t) => t.id === id));
      const dimensions = getAllDimensions({
        subject,
        topicPath,
        filter: subject.name,
        user,
      });
      trackPageView({
        dimensions,
        title: getSocialMediaMetaData({ topicList, subject, t }).title,
      });
    }
  }, [authContextLoaded, subject, t, topicList, trackPageView, user]);

  const [topicCrumbs, setTopicCrumbs] = useState<SimpleBreadcrumbItem[]>([]);

  useEffect(() => {
    setTopicCrumbs((crumbs) => crumbs.slice(0, selectedTopics.length));
  }, [selectedTopics.length]);

  const breadCrumbs: SimpleBreadcrumbItem[] = useMemo(
    () =>
      [
        {
          name: t("breadcrumb.toFrontpage"),
          to: "/",
        },
        {
          to: `${removeUrn(subject.id)}`,
          name: subject.name,
        },
        ...topicCrumbs,
      ].reduce<SimpleBreadcrumbItem[]>((crumbs, crumb) => {
        crumbs.push({
          name: crumb.name,
          to: `${crumbs[crumbs.length - 1]?.to ?? ""}${crumb.to}`,
        });

        return crumbs;
      }, []),
    [subject.id, subject.name, t, topicCrumbs],
  );

  const refs = topicList.map(() => createRef<HTMLDivElement>());

  const scrollToTopic = (index: number) => {
    const ref = refs[index];
    if (ref && ref.current) {
      const positionFromTop = ref.current.getBoundingClientRect().top + document?.documentElement?.scrollTop || 100;
      window.scrollTo({
        top: positionFromTop - 185,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    scrollToTopic(topicList.length - 1);
  });

  const topics = useMemo(
    () =>
      subject.topics?.map((topic) => {
        return {
          ...topic,
          label: topic.name,
          selected: topic.id === topicList[0],
          url: toTopic(subject.id, topic.id),
        };
      }),
    [subject.id, subject.topics, topicList],
  );

  if (!topics) {
    return null;
  }

  const socialMediaMetaData = getSocialMediaMetaData({ subject, topicList, t }, selectedTopics);

  return (
    <>
      <Helmet>
        <title>{htmlTitle(socialMediaMetaData.title, [t("htmlTitles.titleTemplate")])}</title>
      </Helmet>
      <SocialMediaMetadata
        title={socialMediaMetaData.title}
        description={socialMediaMetaData.description}
        imageUrl={socialMediaMetaData.image?.url}
      />
      <OneColumn>
        <BreadcrumbWrapper>
          <HomeBreadcrumb items={breadCrumbs} />
        </BreadcrumbWrapper>
        <ToolboxInfo
          id={!topicList.length ? SKIP_TO_CONTENT_ID : undefined}
          topics={topics}
          title={subject.name}
          introduction={t("toolboxPage.introduction")}
        />
        {selectedTopics.map((topic: string, index: number) => (
          <div key={topic} ref={refs[index]}>
            <ToolboxTopicContainer
              setCrumbs={setTopicCrumbs}
              key={topic}
              subject={subject}
              topicId={topic}
              topicList={topicList}
              index={index}
            />
          </div>
        ))}
        {subject.subjectpage?.banner && (
          <SubjectBanner image={subject.subjectpage?.banner.desktopUrl || ""} negativeTopMargin={!topics} />
        )}
      </OneColumn>
    </>
  );
};

export const toolboxSubjectContainerFragments = {
  subject: gql`
    fragment ToolboxSubjectContainer_Subject on Subject {
      topics {
        name
        id
      }
      allTopics {
        id
        name
        meta {
          metaDescription
          introduction
          title
          metaImage {
            url
          }
        }
      }
      subjectpage {
        about {
          title
          description
          visualElement {
            url
          }
        }
        banner {
          desktopUrl
        }
        metaDescription
      }
      ...ToolboxTopicContainer_Subject
    }
    ${ToolboxTopicContainer.fragments.subject}
  `,
};

export default ToolboxSubjectContainer;

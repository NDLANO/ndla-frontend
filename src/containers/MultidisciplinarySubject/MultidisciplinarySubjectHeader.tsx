/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { breakpoints, mq, spacing, stackOrder } from "@ndla/core";
import { SafeLink } from "@ndla/safelink";
import { Text } from "@ndla/typography";
import { HomeBreadcrumb, SimpleBreadcrumbItem } from "@ndla/ui";

const StyledWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: stretch;
`;

const ContentWrapper = styled.div`
  max-width: 1440px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

const TextWrapper = styled.div`
  padding: ${spacing.normal} ${spacing.normal} 0;
  display: flex;
  flex-direction: column;
  gap: ${spacing.small};
  width: 100%;
  z-index: ${stackOrder.offsetDouble};
  ${mq.range({ from: breakpoints.tablet })} {
    padding: 44px 44px 0;
  }
`;

const SubjectsWrapper = styled.div`
  margin-top: ${spacing.small};
`;

type subjectLink = {
  label: string;
  url: string;
};

type Props = {
  subjectsLinks?: subjectLink[];
  breadcrumbs?: SimpleBreadcrumbItem[];
};

const MultidisciplinarySubjectHeader = ({ subjectsLinks = [], breadcrumbs = [] }: Props) => {
  const { t } = useTranslation();
  return (
    <StyledWrapper>
      <ContentWrapper>
        <TextWrapper>
          <HomeBreadcrumb items={breadcrumbs} />
          <Text element="span" textStyle="meta-text-medium">
            {t("frontpageMultidisciplinarySubject.heading")}
          </Text>
          <SubjectsWrapper>
            <Text textStyle="content-alt" element="span" margin="none">
              {t("multidisciplinarySubject.subjectsLinksDescription")}:{" "}
            </Text>
            {subjectsLinks.map((subject, index) => {
              return (
                <span key={subject.label}>
                  {index > 0 && (index < subjectsLinks.length - 1 ? ", " : " og ")}
                  <SafeLink to={subject.url}>{subject.label}</SafeLink>
                </span>
              );
            })}
          </SubjectsWrapper>
        </TextWrapper>
      </ContentWrapper>
    </StyledWrapper>
  );
};

export default MultidisciplinarySubjectHeader;

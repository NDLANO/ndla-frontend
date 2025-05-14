/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { CSSProperties, useContext, useEffect, useId, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import { useComponentSize } from "@ndla/hooks";
import {
  ArrowRightLine,
  ArrowRightShortLine,
  CloseLine,
  ExternalLinkLine,
  ForumOutlined,
  HeartFill,
  HeartLine,
  LogoutBoxRightLine,
  MenuLine,
  RobotFill,
  UserLine,
} from "@ndla/icons";
import { Button, Heading, PopoverRoot, PopoverTrigger, Text } from "@ndla/primitives";
import { SafeLink, SafeLinkButton } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { MastheadPopoverBackdrop, MastheadPopoverContent } from "./MastheadPopover";
import { AuthContext } from "../../components/AuthenticationContext";
import { LanguageSelector } from "../../components/LanguageSelector/LanguageSelector";
import config from "../../config";
import { FILM_PAGE_URL, MULTIDISCIPLINARY_URL, TOOLBOX_STUDENT_URL, TOOLBOX_TEACHER_URL } from "../../constants";
import { GQLDynamicMenuQuery, GQLFavouriteSubjectsQuery } from "../../graphqlTypes";
import { useFavouriteSubjects } from "../../mutations/folderMutations";
import { routes } from "../../routeHelpers";
import { getChatRobotUrl } from "../../util/chatRobotHelpers";
import { toHref } from "../../util/urlHelper";

const StyledSafeLink = styled(SafeLink, {
  base: {
    display: "flex",
    gap: "3xsmall",
    alignItems: "center",
    color: "text.default",
    textStyle: "body.link",
    textDecoration: "underline",
    _hover: {
      textDecoration: "none",
    },
  },
});

const DrawerButton = styled(Button, {
  base: {
    tabletDown: {
      paddingInline: "xsmall",
      "& span": {
        display: "none",
      },
    },
  },
});

const StyledList = styled("ul", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "3xsmall",
  },
});

const ListsWrapper = styled("div", {
  base: {
    display: "flex",
    flexWrap: "wrap",
    gap: "xlarge",
  },
});

const NavigationListWrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "3xsmall",
  },
});

const dynamicMenuQueryDef = gql`
  query dynamicMenuTest {
    frontpage {
      # If we don't include articleId, the query response will be overridden
      articleId
      menu {
        articleId
        # TODO: Do we need hideLevel here?
        article {
          id
          title
          slug
        }
      }
    }
  }
`;

export const MastheadMenu = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { user, authenticated } = useContext(AuthContext);

  const dynamicMenuQuery = useQuery<GQLDynamicMenuQuery>(dynamicMenuQueryDef, {
    skip: typeof window === "undefined",
  });

  const favouriteSubjectsQuery = useFavouriteSubjects(user?.favoriteSubjects ?? [], {
    skip: !authenticated || !user?.favoriteSubjects.length,
  });

  const { height } = useComponentSize("masthead");

  const dynamicLinks = useMemo(() => {
    if (!dynamicMenuQuery.data?.frontpage?.menu?.length) return [];
    return dynamicMenuQuery.data.frontpage.menu.map((item) => ({
      text: item.article.title,
      to: `/om/${item.article.slug}`,
    }));
  }, [dynamicMenuQuery.data?.frontpage?.menu]);

  useEffect(() => {
    setOpen(false);
  }, [location]);

  const style = useMemo(
    () =>
      ({
        "--masthead-height": `${height}px`,
      }) as CSSProperties,
    [height],
  );

  return (
    <PopoverRoot open={open} onOpenChange={(details) => setOpen(details.open)}>
      <PopoverTrigger asChild>
        <DrawerButton
          variant="tertiary"
          data-testid="masthead-menu-button"
          aria-label={t(`masthead.menu.${open ? "close" : "open"}`)}
          title={t(`masthead.menu.${open ? "close" : "open"}`)}
        >
          {open ? <CloseLine /> : <MenuLine />}
          <span>{t("masthead.menu.button")}</span>
        </DrawerButton>
      </PopoverTrigger>
      <MastheadPopoverContent style={style}>
        <NavigationPart dynamicLinks={dynamicLinks} favouriteSubjects={favouriteSubjectsQuery.data?.subjects} />
        <MyNdlaPart />
      </MastheadPopoverContent>
      <MastheadPopoverBackdrop present={open} style={style} />
    </PopoverRoot>
  );
};

const NavigationPartWrapper = styled("div", {
  base: {
    display: "flex",
    paddingInlineStart: "xxlarge",
    flexDirection: "column",
    gap: "medium",
  },
});

const educationLinks: LinkType[] = [
  { to: "/", text: "masthead.menu.links.education.programmes" },
  { to: "/subjects", text: "masthead.menu.links.education.subjects" },
  { to: MULTIDISCIPLINARY_URL, text: "masthead.menu.links.education.multidisciplinary" },
  { to: FILM_PAGE_URL, text: "masthead.menu.links.education.film" },
];

const tipLinks: LinkType[] = [
  { to: TOOLBOX_STUDENT_URL, text: "masthead.menu.links.tips.studentToolbox" },
  { to: TOOLBOX_TEACHER_URL, text: "masthead.menu.links.tips.teacherToolbox" },
];

const FavoriteSubjectsList = styled("ul", {
  base: {
    display: "flex",
    flexWrap: "wrap",
    gap: "medium",
  },
});

const StyledLanguageSelector = styled(LanguageSelector, {
  base: {
    alignSelf: "flex-start",
    desktop: {
      display: "none",
    },
  },
});

interface NavigationPartProps {
  dynamicLinks: LinkType[];
  favouriteSubjects: GQLFavouriteSubjectsQuery["subjects"];
}

const NavigationPartLink = styled(SafeLink, {
  base: {
    marginBlockStart: "small",
    color: "text.link",
    textDecoration: "underline",
    _hover: {
      textDecoration: "none",
    },
    _visited: {
      color: "text.linkVisited",
    },
  },
});

const NavigationPart = ({ dynamicLinks, favouriteSubjects }: NavigationPartProps) => {
  const { t } = useTranslation();

  return (
    <NavigationPartWrapper>
      <Heading asChild consumeCss textStyle="heading.small">
        <h2>{t("masthead.menu.title")}</h2>
      </Heading>
      <ListsWrapper>
        <NavigationList
          title={t("masthead.menu.links.education.title")}
          items={educationLinks.map((link) => ({ to: link.to, text: t(link.text) }))}
        />
        <NavigationList
          title={t("masthead.menu.links.tips.title")}
          items={tipLinks.map((link) => ({ to: link.to, text: t(link.text) }))}
        />
        {!!dynamicLinks.length && (
          <NavigationList title={t("masthead.menu.links.dynamic.title")} items={dynamicLinks} />
        )}
      </ListsWrapper>
      {!!favouriteSubjects?.length && (
        <NavigationListWrapper>
          <Heading asChild consumeCss textStyle="label.large" fontWeight="bold">
            <h2>{t("masthead.menu.myNdla.yourFavouriteSubjects")}</h2>
          </Heading>
          <FavoriteSubjectsList>
            {favouriteSubjects.map((subject) => (
              <li key={subject.id}>
                <StyledSafeLink to={subject.url ?? ""}>
                  <HeartFill size="small" />
                  {subject.name}
                </StyledSafeLink>
              </li>
            ))}
          </FavoriteSubjectsList>
          <NavigationPartLink to={routes.myNdla.subjects}>
            {t("masthead.menu.myNdla.viewAllFavouriteSubjects")}
            <ArrowRightLine />
          </NavigationPartLink>
        </NavigationListWrapper>
      )}
      <StyledLanguageSelector />
    </NavigationPartWrapper>
  );
};

type LinkType = { text: string; to: string };

interface NavigationListProps {
  title: string;
  items: LinkType[];
}

const NavigationList = ({ title, items }: NavigationListProps) => {
  const id = useId();

  return (
    <NavigationListWrapper>
      <Heading asChild consumeCss textStyle="title.small">
        <h3 id={id}>{title}</h3>
      </Heading>
      <StyledList aria-labelledby={id}>
        {items.map((item) => (
          <li key={item.to}>
            <StyledSafeLink to={item.to}>
              <ArrowRightShortLine size="small" />
              {item.text}
            </StyledSafeLink>
          </li>
        ))}
      </StyledList>
    </NavigationListWrapper>
  );
};

const MyNdlaWrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    paddingInlineEnd: "xxlarge",
    gap: "large",
    background: "background.subtle",
  },
});

const StyledText = styled(Text, {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "3xsmall",
  },
});

const ButtonsContainer = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "xsmall",
  },
});

const MyNdlaSafeLinkButton = styled(SafeLinkButton, {
  base: {
    justifyContent: "flex-start",
  },
});

const LogoutSafeLinkButton = styled(StyledSafeLink, {
  base: {
    marginBlockStart: "auto",
    alignSelf: "flex-start",
  },
});

const MyNdlaPart = () => {
  const { user, authenticated } = useContext(AuthContext);
  const { t } = useTranslation();
  const location = useLocation();
  return (
    <MyNdlaWrapper>
      {!!authenticated && !!user ? (
        <>
          <StyledText>
            <Text textStyle="body.medium" asChild consumeCss>
              <span>{t("masthead.menu.myNdla.loggedInAs")}</span>
            </Text>
            <Text textStyle="title.large" asChild consumeCss>
              <span>{user.displayName}</span>
            </Text>
          </StyledText>
          <ButtonsContainer>
            <MyNdlaSafeLinkButton to={routes.myNdla.root} variant="secondary">
              <HeartLine />
              {t("masthead.menu.myNdla.myNdla")}
            </MyNdlaSafeLinkButton>
            <MyNdlaSafeLinkButton
              to={`https://${config.arenaDomain}`}
              target="_blank"
              rel="noopener noreferrer"
              variant="secondary"
            >
              <ForumOutlined />
              {t("masthead.menu.myNdla.arena")}
              <ExternalLinkLine />
            </MyNdlaSafeLinkButton>
            <MyNdlaSafeLinkButton to={getChatRobotUrl()} target="_blank" rel="noopener noreferrer" variant="secondary">
              <RobotFill />
              {t("masthead.menu.myNdla.chatRobot")}
              <ExternalLinkLine />
            </MyNdlaSafeLinkButton>
          </ButtonsContainer>
          <LogoutSafeLinkButton to={`/logout?state=${toHref(location)}`} reloadDocument>
            <LogoutBoxRightLine />
            {t("user.buttonLogOut")}
          </LogoutSafeLinkButton>
        </>
      ) : (
        <MyNdlaSafeLinkButton variant="secondary" to={`/login?state=${toHref(location)}`} reloadDocument>
          <UserLine />
          {t("masthead.menu.myNdla.myNdla")}
        </MyNdlaSafeLinkButton>
      )}
    </MyNdlaWrapper>
  );
};

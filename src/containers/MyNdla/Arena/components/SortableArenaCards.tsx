/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Reference, useApolloClient } from "@apollo/client";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToVerticalAxis, restrictToParentElement } from "@dnd-kit/modifiers";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import styled from "@emotion/styled";
import { spacing } from "@ndla/core";
import ArenaCard from "./ArenaCard";
import { MyNDLAUserType } from "../../../../components/AuthenticationContext";
import { GQLArenaCategoryV2Fragment, GQLTopiclessArenaCategoryV2 } from "../../../../graphqlTypes";
import { useArenaSortCategories } from "../../arenaMutations";
import { makeDndTranslations } from "../../Folders/util";

interface Props {
  categories: (GQLTopiclessArenaCategoryV2 | GQLArenaCategoryV2Fragment)[];
  isEditing: boolean;
  user: MyNDLAUserType | undefined;
  categoryParentId?: number;
  refetchCategories: (() => void) | undefined;
}

const StyledCardContainer = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xsmall};
  padding: ${spacing.normal} 0;
`;

const SortableArenaCards = ({ refetchCategories, categories, isEditing, user, categoryParentId }: Props) => {
  const client = useApolloClient();
  const [sortedCategories, setSortedCategories] = useState(
    categories.map((cat) => ({ ...cat, id: cat.id.toString() })),
  );
  const { t } = useTranslation();

  const announcements = useMemo(() => makeDndTranslations("category", t, categories.length), [categories.length, t]);

  const sortCategories = useArenaSortCategories();

  const updateCache = (newOrder: number[]) => {
    const sortCacheModifierFunction = <T extends Reference>(existing: readonly T[]): T[] => {
      return newOrder.map((id) => existing.find((ef) => ef.__ref === `ArenaCategoryV2:${id}`)!);
    };
    const subcategoryModifierFunction = <T extends Reference>(existing: readonly T[]): T[] => {
      return newOrder.map((id) => existing.find((ef) => ef.__ref === `TopiclessArenaCategoryV2:${id}`)!);
    };

    if (categoryParentId) {
      client.cache.modify({
        id: client.cache.identify({
          __ref: `ArenaCategoryV2:${categoryParentId}`,
        }),
        fields: {
          subcategories: subcategoryModifierFunction,
        },
      });
    } else {
      client.cache.modify({
        id: client.cache.identify({
          __ref: `ROOT_QUERY`,
        }),
        fields: { arenaCategoriesV2: sortCacheModifierFunction },
      });
    }
  };

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over === null) return;

    const originalIds = categories.map((f) => f.id.toString());
    const oldIndex = originalIds.indexOf(active.id as string);
    const newIndex = originalIds.indexOf(over.id as string);

    if (newIndex === undefined || newIndex === oldIndex) return;

    const newSorted = arrayMove(
      categories.map((cat) => ({ ...cat, id: cat.id.toString() })),
      oldIndex,
      newIndex,
    );
    setSortedCategories(newSorted);

    const sortedIds = newSorted.map((f) => parseInt(f.id));

    // Update cache before sorting happens to make GUI feel snappy
    updateCache(sortedIds);

    return sortCategories({ variables: { categoryIds: sortedIds, parentId: categoryParentId } });
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  return (
    <StyledCardContainer>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={onDragEnd}
        accessibility={{ announcements }}
        modifiers={[restrictToVerticalAxis, restrictToParentElement]}
      >
        <SortableContext
          items={sortedCategories}
          disabled={categories?.length < 2}
          strategy={verticalListSortingStrategy}
        >
          {categories?.map((category, categoryIndex) => (
            <ArenaCard
              refetchCategories={refetchCategories}
              key={`category-${category.id}`}
              id={category.id}
              title={category.title}
              subText={category.description}
              count={category.topicCount}
              visible={category.visible}
              isEditing={isEditing}
              user={user}
              index={categoryIndex}
            />
          ))}
        </SortableContext>
      </DndContext>
    </StyledCardContainer>
  );
};

export default SortableArenaCards;

/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { TreeViewNodeProviderProps } from "@ark-ui/react";
import { ArrowRightShortLine, FolderLine, FolderUserLine, HeartFill } from "@ndla/icons";
import {
  IconButton,
  Text,
  Tree,
  TreeBranch,
  TreeBranchContent,
  TreeBranchControl,
  TreeBranchIndicator,
  TreeBranchText,
  TreeBranchTrigger,
  TreeItem,
  TreeItemText,
  TreeLabel,
  TreeNodeProvider,
  TreeRootProvider,
  createTreeCollection,
  useTreeView,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { GQLFolder } from "../../graphqlTypes";
import { AddResourceType } from "./types";

const StyledTree = styled(Tree, {
  base: {
    padding: "3xsmall",
    overflow: "auto",
    paddingInlineStart: "medium",
    paddingInlineEnd: "xxlarge",
    tabletWide: {
      maxHeight: "surface.xsmall",
    },
  },
});

export interface TreeStructureProps {
  type: AddResourceType;
  defaultOpenFolders?: string[];
  folders: GQLFolder[];
  label?: string;
  onSelectFolder?: (id: string) => void;
  ariaDescribedby?: string;
  placements: Set<string> | undefined;
  folderToMove?: GQLFolder;
}

interface TreeStructureItemProps extends TreeViewNodeProviderProps<GQLFolder> {
  selected?: boolean;
  placements: Set<string> | undefined;
  focusId?: string | null;
  type: AddResourceType;
}

const BranchInfo = styled("div", {
  base: {
    display: "flex",
    gap: "xxsmall",
    alignItems: "center",
  },
});

const StyledHeartFill = styled(HeartFill, {
  base: {
    color: "icon.strong",
  },
});

const StyledFolderLine = styled(FolderLine, {
  base: {
    color: "icon.strong",
  },
});

const StyledFolderUserLine = styled(FolderUserLine, {
  base: {
    color: "icon.strong",
  },
});

const StyledTreeItem = styled(TreeItem, {
  base: {
    display: "flex",
    gap: "xsmall",
    justifyContent: "space-between",
    scrollMargin: "xsmall",
  },
  variants: {
    variant: {
      resource: {
        border: "1px solid",
        borderColor: "stroke.default",
        paddingInlineStart: "small",
        paddingInlineEnd: "small",
        paddingBlock: "medium",
        height: "unset",
        _hover: {
          background: "surface.action.brand.1.hover",
        },
        _selected: {
          background: "surface.action.brand.1.active",
          _hover: {
            background: "surface.action.brand.1.hover.strong",
          },
        },
        _active: {
          background: "surface.action.brand.1.selected",
          _hover: {
            background: "surface.action.brand.1.hover.strong",
          },
        },
      },
      myNdla: {},
      folder: {},
    },
  },
});

const StyledTreeBranchControl = styled(TreeBranchControl, {
  base: {
    display: "flex",
    gap: "xsmall",
    justifyContent: "space-between",
    scrollMargin: "xsmall",
  },
});

const StyledTreeRootProvider = styled(TreeRootProvider<RootNode>, {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "xsmall",
  },
});

const StyledText = styled(Text, {
  base: {
    paddingInline: "medium",
  },
});

interface RootNode {
  id: string;
  name: string;
  subfolders: GQLFolder[];
  disabled?: boolean;
}

const recursivelyDisableChildren = (nodes: GQLFolder[], folderToMove: GQLFolder): GQLFolder[] => {
  return nodes.reduce<GQLFolder[]>((acc, curr) => {
    if (curr.id !== folderToMove.id) {
      const subfolders = recursivelyDisableChildren(curr.subfolders, folderToMove);
      acc.push({ ...curr, subfolders });
    }
    return acc;
  }, []);
};

export const TreeStructure = ({
  folders,
  defaultOpenFolders,
  label,
  placements,
  onSelectFolder,
  ariaDescribedby,
  folderToMove,
  type,
}: TreeStructureProps) => {
  const [selectedValue, setSelectedValue] = useState(defaultOpenFolders?.[defaultOpenFolders?.length - 1] ?? "");
  const [focusedValue, setFocusedValue] = useState<string | null>(selectedValue);
  const { t } = useTranslation();
  const errorId = useId();

  const collection = useMemo(() => {
    return createTreeCollection<RootNode>({
      rootNode: {
        id: "ROOT",
        name: "",
        subfolders: type === "folder" && folderToMove ? recursivelyDisableChildren(folders, folderToMove) : folders,
      },
      nodeToString: (node) => node.name,
      nodeToValue: (node) => node.id,
      nodeToChildren: (node) => node?.subfolders ?? [],
    });
  }, [folderToMove, folders, type]);

  const treeView = useTreeView<RootNode>({
    collection,
    focusedValue,
    defaultExpandedValue: defaultOpenFolders,
    onFocusChange: (details) => !!details.focusedValue && setFocusedValue(details.focusedValue),
    selectedValue: [selectedValue],
    onSelectionChange: (details) => {
      const val = details.selectedValue[0];
      if (!val) return;
      setSelectedValue(val);
      onSelectFolder?.(val);
    },
    expandOnClick: false,
  });

  return (
    <StyledTreeRootProvider value={treeView} {...treeView.getRootProps()}>
      <TreeLabel srOnly>{label}</TreeLabel>
      {/* TODO: Check if this triggers after saving a folder. We used to work around that. */}
      {!!placements?.has(selectedValue) && (
        <StyledText color="text.error" id={errorId} aria-live="assertive">
          {t("myNdla.alreadyInFolderError")}
        </StyledText>
      )}
      <StyledTree aria-describedby={`${errorId} ${ariaDescribedby}`}>
        {collection.rootNode.subfolders.map((node, idx) => (
          <TreeStructureItem
            node={node}
            key={node.id}
            type={type}
            placements={placements}
            indexPath={[idx]}
            focusId={focusedValue}
          />
        ))}
      </StyledTree>
    </StyledTreeRootProvider>
  );
};

export const TreeStructureItem = ({ node, focusId, indexPath, placements, type }: TreeStructureItemProps) => {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const containsResource = placements?.has(node.id);

  const FolderIcon = node.status === "shared" ? StyledFolderUserLine : StyledFolderLine;

  const selected = focusId === node.id;

  useEffect(() => {
    if (selected) {
      ref.current?.scrollIntoView({ behavior: "instant", block: "nearest" });
    }
  }, [selected]);

  const ariaLabel = node.status === "shared" ? `${node.name}. ${t("myNdla.folder.sharing.shared")}` : node.name;

  return (
    <TreeNodeProvider node={node} indexPath={indexPath}>
      {node.subfolders?.length ? (
        <TreeBranch>
          <StyledTreeBranchControl ref={ref}>
            <BranchInfo>
              <IconButton variant="clear" asChild>
                <TreeBranchTrigger>
                  <TreeBranchIndicator asChild>
                    <ArrowRightShortLine />
                  </TreeBranchIndicator>
                </TreeBranchTrigger>
              </IconButton>
              <FolderIcon />
              <TreeBranchText aria-label={ariaLabel} title={ariaLabel}>
                {node.name}
              </TreeBranchText>
            </BranchInfo>
            {!!containsResource && (
              <StyledHeartFill
                title={t("myNdla.alreadyInFolder")}
                aria-label={t("myNdla.alreadyInFolder")}
                aria-hidden={false}
              />
            )}
          </StyledTreeBranchControl>
          <TreeBranchContent>
            {node.subfolders.map((child, index) => (
              <TreeStructureItem
                key={child.id}
                node={child}
                indexPath={[...indexPath, index]}
                placements={placements}
                type={type}
                focusId={focusId}
              />
            ))}
          </TreeBranchContent>
        </TreeBranch>
      ) : (
        <StyledTreeItem ref={ref} variant={type}>
          <BranchInfo>
            <FolderIcon />
            <TreeItemText aria-label={ariaLabel} title={ariaLabel}>
              {node.name}
            </TreeItemText>
          </BranchInfo>
          {!!containsResource && (
            <StyledHeartFill
              title={t("myNdla.alreadyInFolder")}
              aria-label={t("myNdla.alreadyInFolder")}
              aria-hidden={false}
            />
          )}
        </StyledTreeItem>
      )}
    </TreeNodeProvider>
  );
};

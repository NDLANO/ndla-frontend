/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { TreeViewNodeProviderProps } from "@ark-ui/react";
import { AddLine, ArrowRightShortLine, FolderLine, FolderUserLine, HeartFill } from "@ndla/icons";
import {
  Button,
  IconButton,
  PopoverContent,
  PopoverRoot,
  PopoverTrigger,
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
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { GQLFolder, GQLFolderResource } from "../../graphqlTypes";
import { NewFolder } from "./NewFolder";

export const MAX_LEVEL_FOR_FOLDERS = 5;

const StyledTree = styled(Tree, {
  base: {
    padding: "3xsmall",
    maxHeight: "surface.xsmall",
    overflow: "auto",
  },
});

export interface TreeStructureProps {
  loading?: boolean;
  targetResource?: GQLFolderResource;
  defaultOpenFolders?: string[];
  folders: GQLFolder[];
  label?: string;
  maxLevel?: number;
  onSelectFolder?: (id: string) => void;
  ariaDescribedby?: string;
}

interface TreeStructureItemProps extends TreeViewNodeProviderProps<GQLFolder> {
  targetResource?: GQLFolderResource;
  selected?: boolean;
  focusId?: string | null;
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

const LabelWrapper = styled("div", {
  base: {
    display: "flex",
    gap: "xsmall",
    justifyContent: "space-between",
  },
});

const StyledTreeItem = styled(TreeItem, {
  base: {
    display: "flex",
    gap: "xsmall",
    justifyContent: "space-between",
    scrollMargin: "xsmall",
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

interface RootNode {
  id: string;
  name: string;
  subfolders: GQLFolder[];
}

export const TreeStructure = ({
  folders,
  defaultOpenFolders,
  label,
  targetResource,
  loading,
  maxLevel = MAX_LEVEL_FOR_FOLDERS,
  onSelectFolder,
  ariaDescribedby,
}: TreeStructureProps) => {
  const [selectedValue, setSelectedValue] = useState(defaultOpenFolders?.[defaultOpenFolders?.length - 1] ?? "");
  const [focusedValue, setFocusedValue] = useState<string | null>(selectedValue);
  const { t } = useTranslation();
  const rootFolderIds = useMemo(() => folders.map((folder) => folder.id), [folders]);

  const collection = useMemo(() => {
    return createTreeCollection<RootNode>({
      rootNode: {
        id: "ROOT",
        name: "",
        subfolders: folders,
      },
      nodeToString: (node) => node.name,
      nodeToValue: (node) => node.id,
      nodeToChildren: (node) => node.subfolders,
    });
  }, [folders]);

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

  const selectedFolder = useMemo(() => {
    const selectedValue = treeView.selectedValue[0];
    if (selectedValue) {
      return treeView.collection.findNode(selectedValue) as GQLFolder;
    }
    return undefined;
  }, [treeView.collection, treeView.selectedValue]);

  const disableCreateFolder = useMemo(() => {
    return (selectedFolder?.breadcrumbs.length ?? 0) > maxLevel - 1;
  }, [maxLevel, selectedFolder?.breadcrumbs.length]);

  const onCreateFolder = useCallback(
    (folder: GQLFolder | undefined) => {
      if (!folder) return;
      const newExpandedIds = rootFolderIds.concat(folder.breadcrumbs.map((bc) => bc.id) ?? []);
      treeView.setExpandedValue(newExpandedIds);
      setTimeout(() => {
        treeView.focus(folder.id);
        setSelectedValue(folder.id);
        onSelectFolder?.(folder.id);
      });
    },
    [onSelectFolder, rootFolderIds, treeView],
  );

  const addTooltip = loading
    ? t("loading")
    : disableCreateFolder
      ? t("treeStructure.maxFoldersAlreadyAdded")
      : t("myNdla.newFolderUnder", { folderName: selectedFolder?.name });

  return (
    <StyledTreeRootProvider value={treeView} {...treeView.getRootProps()}>
      <LabelWrapper>
        <TreeLabel>{label}</TreeLabel>
        <PopoverRoot
          onExitComplete={() => {
            if (focusedValue) {
              treeView.focus(focusedValue);
            }
          }}
        >
          <PopoverTrigger disabled={disableCreateFolder} title={addTooltip} aria-label={addTooltip} asChild>
            <Button size="small" variant="tertiary" loading={loading}>
              <AddLine />
              {t("myNdla.newFolder")}
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            {!!selectedFolder && <NewFolder parentFolder={selectedFolder} onCreate={onCreateFolder} />}
          </PopoverContent>
        </PopoverRoot>
      </LabelWrapper>
      <StyledTree aria-describedby={ariaDescribedby}>
        {collection.rootNode.subfolders.map((node, idx) => (
          <TreeStructureItem
            node={node}
            key={node.id}
            targetResource={targetResource}
            indexPath={[idx]}
            focusId={focusedValue}
          />
        ))}
      </StyledTree>
    </StyledTreeRootProvider>
  );
};

export const TreeStructureItem = ({ node, focusId, indexPath, targetResource }: TreeStructureItemProps) => {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const containsResource = targetResource && node.resources.some((r) => r.resourceId === targetResource.resourceId);

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
                targetResource={targetResource}
                focusId={focusId}
              />
            ))}
          </TreeBranchContent>
        </TreeBranch>
      ) : (
        <StyledTreeItem ref={ref}>
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

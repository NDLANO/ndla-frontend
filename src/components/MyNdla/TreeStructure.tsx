/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { KeyboardEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { PopoverOpenChangeDetails, TreeViewNodeProviderProps, usePopoverContext } from "@ark-ui/react";
import { AddLine, ArrowDownShortLine, ArrowRightShortLine, FolderLine, FolderUserLine, HeartFill } from "@ndla/icons";
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
import { HStack, Stack, styled } from "@ndla/styled-system/jsx";
import NewFolder from "./NewFolder";
import { GQLFolder, GQLFolderResource } from "../../graphqlTypes";

export const MAX_LEVEL_FOR_FOLDERS = 5;

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

const StyledButton = styled(Button, {
  base: {
    width: "100%",
    justifyContent: "space-between",
    "& span": {
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
  },
});

const StyledHStack = styled(HStack, {
  base: {
    overflow: "hidden",
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

const StyledTreeRootProvider = styled(TreeRootProvider<RootNode>, {
  base: {
    width: "100%",
    maxHeight: "inherit",
  },
});

const StyledPopoverContent = styled(PopoverContent, {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "xsmall",
    overflow: "auto",
    maxHeight: "inherit",
    paddingInline: "xsmall",
    paddingBlock: "xsmall",
  },
});

const LabelHStack = styled(HStack, {
  base: {
    width: "100%",
  },
});

const StyledTreeItem = styled(TreeItem, {
  base: {
    scrollMargin: "xsmall",
  },
});

const StyledTreeBranchControl = styled(TreeBranchControl, {
  base: {
    scrollMargin: "xsmall",
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
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(defaultOpenFolders?.[defaultOpenFolders?.length - 1] ?? "");
  const [expandedValue, setExpandedValue] = useState<string[]>(defaultOpenFolders ?? []);
  const [focusedValue, setFocusedValue] = useState<string | null>(selectedValue);
  const [focusNewFolder, setFocusNewFolder] = useState<string | undefined>(undefined);
  const [newFolderParentId, setNewFolderParentId] = useState<string | null>(null);
  const newFolderButtonRef = useRef<HTMLButtonElement>(null);
  const { t } = useTranslation();
  const rootFolderIds = useMemo(() => folders.map((folder) => folder.id), [folders]);
  const contentRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const onOpenChange = useCallback((details: PopoverOpenChangeDetails) => {
    setOpen(details.open);
  }, []);

  const onKeyDown = useCallback((e: KeyboardEvent<HTMLElement>) => {
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.stopPropagation();
      setOpen(true);
    }
  }, []);

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
    onFocusChange: (details) => !!details.focusedValue && setFocusedValue(details.focusedValue),
    expandedValue,
    onExpandedChange: (details) => setExpandedValue(details.expandedValue),
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

  const onShowInput = useCallback(() => {
    if (disableCreateFolder) return;
    const newExpandedIds = rootFolderIds.concat(selectedFolder?.breadcrumbs.map((bc) => bc.id) ?? []);
    setOpen(true);
    setExpandedValue((prev) => Array.from(new Set([...prev, ...newExpandedIds])));
    setNewFolderParentId(selectedValue);
  }, [disableCreateFolder, rootFolderIds, selectedFolder?.breadcrumbs, selectedValue]);

  const onCreateFolder = useCallback((folder: GQLFolder | undefined) => {
    if (!folder) return;
    setFocusNewFolder(folder.id);
  }, []);

  useEffect(() => {
    if (focusNewFolder && treeView.collection.findNode(focusNewFolder)) {
      treeView.focus(focusNewFolder);
      treeView.select([focusNewFolder]);
      setFocusNewFolder(undefined);
    }
  }, [focusNewFolder, treeView]);

  const onCancelFolder = useCallback(() => {
    if (!selectedFolder) return;
    if (!focusNewFolder) {
      treeView.focus(selectedFolder.id);
    }
    setNewFolderParentId(null);
  }, [focusNewFolder, selectedFolder, treeView]);

  const addTooltip = loading
    ? t("loading")
    : disableCreateFolder
      ? t("treeStructure.maxFoldersAlreadyAdded")
      : t("myNdla.newFolderUnder", { folderName: selectedFolder?.name });

  return (
    <PopoverRoot
      open={open}
      positioning={{ sameWidth: true, strategy: "fixed" }}
      onOpenChange={onOpenChange}
      onFocusOutside={(e) => e.preventDefault()}
      persistentElements={[() => newFolderButtonRef.current, () => inputRef.current]}
      initialFocusEl={() => inputRef.current}
      portalled={false}
    >
      <StyledTreeRootProvider value={treeView} asChild {...treeView.getRootProps()}>
        <Stack align="flex-end">
          <LabelHStack gap="xsmall" justify="space-between">
            <TreeLabel>{label}</TreeLabel>
            <Button
              size="small"
              variant="tertiary"
              ref={newFolderButtonRef}
              aria-disabled={disableCreateFolder}
              title={addTooltip}
              aria-label={addTooltip}
              loading={loading}
              onClick={onShowInput}
            >
              <AddLine />
              {t("myNdla.newFolder")}
            </Button>
          </LabelHStack>
          <PopoverTrigger asChild>
            <StyledButton
              variant="secondary"
              onKeyDown={onKeyDown}
              aria-haspopup="tree"
              role="combobox"
              aria-describedby={ariaDescribedby}
              aria-activedescendant={focusedValue ?? undefined}
            >
              <span>{selectedFolder?.name}</span>
              <ArrowDownShortLine />
            </StyledButton>
          </PopoverTrigger>
          <StyledPopoverContent ref={contentRef}>
            {!!newFolderParentId && (
              <NewFolder
                parentId={newFolderParentId}
                onCreate={onCreateFolder}
                onClose={onCancelFolder}
                ref={inputRef}
              />
            )}
            <Tree>
              {collection.rootNode.subfolders.map((node, idx) => (
                <TreeStructureItem
                  node={node}
                  key={node.id}
                  targetResource={targetResource}
                  indexPath={[idx]}
                  focusId={newFolderParentId ? undefined : focusedValue}
                />
              ))}
            </Tree>
          </StyledPopoverContent>
        </Stack>
      </StyledTreeRootProvider>
    </PopoverRoot>
  );
};

export const TreeStructureItem = ({ node, focusId, indexPath, targetResource }: TreeStructureItemProps) => {
  const { t } = useTranslation();
  const { setOpen } = usePopoverContext();
  const ref = useRef<HTMLDivElement>(null);
  const containsResource = targetResource && node.resources.some((r) => r.resourceId === targetResource.resourceId);

  const FolderIcon = node.status === "shared" ? StyledFolderUserLine : StyledFolderLine;

  const selected = focusId === node.id;

  useEffect(() => {
    if (selected) {
      ref.current?.scrollIntoView({ behavior: "instant", block: "nearest" });
    }
  }, [selected]);

  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLElement>) => {
      if (e.key === "Enter" || (e.key === " " && ref.current?.hasAttribute("data-selected"))) {
        setOpen(false);
      }
    },
    [setOpen],
  );

  const ariaLabel = node.status === "shared" ? `${node.name}. ${t("myNdla.folder.sharing.shared")}` : node.name;

  return (
    <TreeNodeProvider node={node} indexPath={indexPath}>
      {node.subfolders?.length ? (
        <TreeBranch>
          <StyledTreeBranchControl onKeyDown={onKeyDown} asChild ref={ref}>
            <StyledHStack gap="xsmall" justify="space-between">
              <StyledHStack gap="xxsmall" justify="center">
                <IconButton variant="clear" asChild>
                  <TreeBranchTrigger>
                    <TreeBranchIndicator asChild>
                      <ArrowRightShortLine />
                    </TreeBranchIndicator>
                  </TreeBranchTrigger>
                </IconButton>
                <FolderLine />
                <TreeBranchText aria-label={ariaLabel} title={ariaLabel}>
                  {node.name}
                </TreeBranchText>
              </StyledHStack>
              {!!containsResource && (
                <StyledHeartFill
                  title={t("myNdla.alreadyInFolder")}
                  aria-label={t("myNdla.alreadyInFolder")}
                  aria-hidden={false}
                />
              )}
            </StyledHStack>
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
        <StyledTreeItem onKeyDown={onKeyDown} asChild ref={ref}>
          <StyledHStack gap="xsmall" justify="space-between">
            <StyledHStack gap="xxsmall" justify="center">
              <FolderIcon />
              <TreeItemText aria-label={ariaLabel} title={ariaLabel}>
                {node.name}
              </TreeItemText>
            </StyledHStack>
            {!!containsResource && (
              <StyledHeartFill
                title={t("myNdla.alreadyInFolder")}
                aria-label={t("myNdla.alreadyInFolder")}
                aria-hidden={false}
              />
            )}
          </StyledHStack>
        </StyledTreeItem>
      )}
    </TreeNodeProvider>
  );
};

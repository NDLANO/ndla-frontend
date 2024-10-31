/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { KeyboardEvent, ReactNode, useCallback, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { useTranslation } from "react-i18next";
import { useTreeView, usePopoverContext, type PopoverOpenChangeDetails } from "@ark-ui/react";
import { AddLine, HeartFill } from "@ndla/icons/action";
import { ArrowDownShortLine, ArrowRightShortLine } from "@ndla/icons/common";
import { FolderUserLine } from "@ndla/icons/contentType";
import { FolderLine } from "@ndla/icons/editor";
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
  TreeRootProvider,
} from "@ndla/primitives";
import { HStack, Stack, styled } from "@ndla/styled-system/jsx";
import { IFolder, IResource } from "@ndla/types-backend/myndla-api";

const flattenFolders = (folders: IFolder[], openFolders?: string[]): IFolder[] => {
  return folders.reduce((acc, { subfolders, id, ...rest }) => {
    if (!subfolders || (openFolders && !openFolders.includes(id))) {
      return acc.concat({ subfolders, id, ...rest });
    }
    return acc.concat({ subfolders, id, ...rest }, flattenFolders(subfolders, openFolders));
  }, [] as IFolder[]);
};

type OnCreatedFunc = (folder: IFolder | undefined) => void;

type NewFolderInputFunc = ({
  onCancel,
  parentId,
  onCreate,
}: {
  onCancel: () => void;
  parentId: string;
  onCreate: OnCreatedFunc;
}) => ReactNode;

export const MAX_LEVEL_FOR_FOLDERS = 5;

export interface TreeStructureProps {
  loading?: boolean;
  targetResource?: IResource;
  defaultOpenFolders?: string[];
  folders: IFolder[];
  label?: string;
  maxLevel?: number;
  newFolderInput?: NewFolderInputFunc;
  onSelectFolder?: (id: string) => void;
  ariaDescribedby?: string;
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

const StyledTreeRootProvider = styled(TreeRootProvider, {
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

export const TreeStructure = ({
  folders,
  defaultOpenFolders,
  newFolderInput,
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
  const [newFolderParentId, setNewFolderParentId] = useState<string | null>(null);
  const newFolderButtonRef = useRef<HTMLButtonElement>(null);
  const { t } = useTranslation();
  const rootFolderIds = useMemo(() => folders.map((folder) => folder.id), [folders]);
  const contentRef = useRef<HTMLDivElement>(null);

  const selectedFolder = useMemo(() => {
    return flattenFolders(folders).find((folder) => folder.id === selectedValue);
  }, [folders, selectedValue]);

  const disableCreateFolder = useMemo(() => {
    return (selectedFolder?.breadcrumbs.length ?? 0) > maxLevel - 1;
  }, [maxLevel, selectedFolder?.breadcrumbs.length]);

  const onOpenChange = useCallback((details: PopoverOpenChangeDetails) => {
    setOpen(details.open);
    if (!details.open) {
      setNewFolderParentId(null);
    }
  }, []);

  const onKeyDown = useCallback((e: KeyboardEvent<HTMLElement>) => {
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.stopPropagation();
      setOpen(true);
    }
  }, []);

  const onShowInput = useCallback(() => {
    if (disableCreateFolder) return;
    const flattenedFolders = flattenFolders(folders);
    const folder = flattenedFolders.find((folder) => folder.id === selectedValue);
    const newExpandedIds = rootFolderIds.concat(folder?.breadcrumbs.map((bc) => bc.id) ?? []);
    setOpen(true);
    setExpandedValue((prev) => Array.from(new Set([...prev, ...newExpandedIds])));
    setNewFolderParentId(selectedValue);
  }, [disableCreateFolder, folders, rootFolderIds, selectedValue]);

  const treeView = useTreeView({
    focusedValue,
    onFocusChange: (details) => !!details.focusedValue && setFocusedValue(details.focusedValue),
    expandedValue,
    onExpandedChange: (details) => setExpandedValue(details.expandedValue),
    selectedValue: [selectedValue],
    onSelectionChange: (details) => {
      const val = details.selectedValue[0];
      if (!val) return;
      if (val === selectedValue && details.focusedValue === selectedValue) {
        setOpen(false);
        return;
      }
      setSelectedValue(val);
      onSelectFolder?.(val);
    },
    expandOnClick: false,
  });

  const onCreateFolder = useCallback(
    (folder: IFolder | undefined) => {
      if (!folder) return;
      const focus = treeView.focusItem;
      const expand = treeView.expand;
      const select = treeView.select;
      flushSync(() => {
        setOpen(true);
      });
      flushSync(() => {
        expand(folder.breadcrumbs.map((bc) => bc.id));
      });
      flushSync(() => {
        select([folder.id]);
      });
      flushSync(() => {
        focus(folder.id);
      });
      setNewFolderParentId(null);
    },
    [treeView.expand, treeView.focusItem, treeView.select],
  );

  const onAnimationEnd = useCallback(() => {
    if (open && focusedValue) {
      document.getElementById(focusedValue)?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [focusedValue, open]);

  const onCancelFolder = useCallback(() => {
    if (!selectedFolder) return;
    const focusFunc = selectedFolder.subfolders.length ? treeView.focusBranch : treeView.focusItem;
    focusFunc(selectedFolder.id);
    setNewFolderParentId(null);
  }, [selectedFolder, treeView.focusBranch, treeView.focusItem]);

  const addTooltip = loading
    ? t("loading")
    : disableCreateFolder
      ? t("treeStructure.maxFoldersAlreadyAdded")
      : t("myNdla.newFolderUnder", { folderName: selectedFolder?.name });

  return (
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
        <PopoverRoot
          open={open}
          positioning={{ sameWidth: true, strategy: "fixed" }}
          onOpenChange={onOpenChange}
          persistentElements={[() => newFolderButtonRef.current]}
          initialFocusEl={() => contentRef.current?.querySelector("input") ?? null}
        >
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
          <StyledPopoverContent onAnimationEnd={onAnimationEnd} ref={contentRef}>
            {!!newFolderParentId &&
              newFolderInput?.({ parentId: newFolderParentId, onCreate: onCreateFolder, onCancel: onCancelFolder })}
            <Tree>
              {folders.map((folder) => (
                <TreeStructureItem key={folder.id} folder={folder} targetResource={targetResource} />
              ))}
            </Tree>
          </StyledPopoverContent>
        </PopoverRoot>
      </Stack>
    </StyledTreeRootProvider>
  );
};

interface TreeStructureItemProps {
  folder: IFolder;
  targetResource?: IResource;
}

const TreeStructureItem = ({ folder, targetResource }: TreeStructureItemProps) => {
  const { t } = useTranslation();
  const { setOpen } = usePopoverContext();
  const containsResource =
    targetResource && folder.resources.some((resource) => resource.resourceId === targetResource.resourceId);

  const FolderIcon = folder.status === "shared" ? StyledFolderUserLine : StyledFolderLine;

  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLElement>) => {
      if (e.key === "Enter") {
        setOpen(false);
      }
    },
    [setOpen],
  );

  if (!folder.subfolders.length) {
    return (
      <TreeItem key={folder.id} value={folder.id} onKeyDown={onKeyDown} id={folder.id}>
        <StyledHStack gap="xsmall" justify="space-between">
          <StyledHStack gap="xxsmall" justify="center">
            <FolderIcon />
            <TreeItemText>{folder.name}</TreeItemText>
          </StyledHStack>
          {containsResource && <StyledHeartFill title={t("myNdla.alreadyInFolder")} />}
        </StyledHStack>
      </TreeItem>
    );
  }

  const ariaLabel = folder.status === "shared" ? `${folder.name}. ${t("myNdla.folder.sharing.shared")}` : folder.name;

  return (
    <TreeBranch key={folder.id} value={folder.id} id={folder.id}>
      <TreeBranchControl onKeyDown={onKeyDown} asChild>
        <StyledHStack gap="xsmall" justify="space-between">
          <StyledHStack gap="xxsmall" justify="center">
            <IconButton variant="clear" asChild>
              <TreeBranchTrigger>
                <TreeBranchIndicator asChild>
                  <ArrowRightShortLine />
                </TreeBranchIndicator>
              </TreeBranchTrigger>
            </IconButton>
            <FolderIcon />
            <TreeBranchText aria-label={ariaLabel} title={ariaLabel}>
              {folder.name}
            </TreeBranchText>
          </StyledHStack>
          {containsResource && (
            <StyledHeartFill
              title={t("myNdla.alreadyInFolder")}
              aria-label={t("myNdla.alreadyInFolder")}
              aria-hidden={false}
            />
          )}
        </StyledHStack>
      </TreeBranchControl>
      <TreeBranchContent>
        {folder.subfolders.map((subfolder) => (
          <TreeStructureItem key={subfolder.id} folder={subfolder} targetResource={targetResource} />
        ))}
      </TreeBranchContent>
    </TreeBranch>
  );
};

/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { CSSProperties, Fragment, HTMLAttributes, ReactElement, ReactNode } from "react";
import {
  getRenderNodeStaticProps,
  pipeDecorate,
  pipeRenderElementStatic,
  RenderLeafProps,
  SlatePlugin,
  type EditableProps,
  type NodeComponents,
  type SlateEditor,
  type SlateRenderElementProps,
  type DecoratedRange,
  type Descendant,
  type NodeEntry,
  type TElement,
  type TText,
  ElementApi,
  RangeApi,
  TextApi,
} from "@udecode/plate";

export type SlateRenderLeaf = (props: RenderLeafProps) => ReactElement | undefined;

export const pluginRenderLeafStatic = (
  editor: SlateEditor,
  plugin: SlatePlugin,
  components: NodeComponents,
): SlateRenderLeaf =>
  function render(nodeProps) {
    const { children, leaf } = nodeProps;

    if (leaf[plugin.node.type ?? plugin.key]) {
      const Leaf = components?.[plugin.key];
      if (!Leaf) return;

      const ctxProps = getRenderNodeStaticProps({
        attributes: leaf.attributes as any,
        editor,
        plugin,
        props: nodeProps as any,
      }) as any;

      return <Leaf {...ctxProps}>{children}</Leaf>;
    }

    return children;
  };

export const pipeRenderLeafStatic = (
  editor: SlateEditor,
  {
    components,
    renderLeaf: renderLeafProp,
  }: {
    components: NodeComponents;
    renderLeaf?: SlateRenderLeaf;
  },
): SlateRenderLeaf => {
  const renderLeafs: SlateRenderLeaf[] = [];

  editor.pluginList.forEach((plugin) => {
    if (plugin.node.isLeaf && plugin.key) {
      renderLeafs.push(pluginRenderLeafStatic(editor, plugin, components));
    }
  });

  return function render(props) {
    renderLeafs.forEach((renderLeaf) => {
      const newChildren = renderLeaf(props as any);

      if (newChildren !== undefined) {
        props.children = newChildren;
      }
    });

    if (renderLeafProp) {
      return renderLeafProp(props);
    }

    const { children, ...ctxProps } = getRenderNodeStaticProps({
      attributes: props.attributes as any,
      editor,
      props: props as any,
    }) as any;

    return <Fragment {...ctxProps}>{children}</Fragment>;
  };
};

function ElementStatic({
  components,
  decorate,
  decorations,
  editor,
  element = { children: [], type: "" },
}: {
  components: NodeComponents;
  decorate: EditableProps["decorate"];
  decorations: DecoratedRange[];
  editor: SlateEditor;
  element: TElement;
  style?: CSSProperties;
}) {
  const renderElement = pipeRenderElementStatic(editor, {
    components,
  });

  const attributes: SlateRenderElementProps["attributes"] = {
    "data-slate-node": "element",
    ref: null,
  };

  let children: ReactNode = (
    <Children components={components} decorate={decorate} decorations={decorations} editor={editor}>
      {element.children}
    </Children>
  );

  if (editor.isVoid(element)) {
    attributes["data-slate-void"] = true;
    children = (
      <span
        style={{
          color: "transparent",
          height: "0",
          outline: "none",
          position: "absolute",
        }}
        data-slate-spacer
      >
        <Children components={components} decorate={decorate} decorations={decorations} editor={editor}>
          {element.children}
        </Children>
      </span>
    );
  }
  if (editor.isInline(element)) {
    attributes["data-slate-inline"] = true;
  }

  return renderElement?.({
    attributes,
    children,
    element,
  });
}

function LeafStatic({
  components,
  decorations,
  editor,
  leaf = { text: "" },
}: {
  components: NodeComponents;
  decorations: DecoratedRange[];
  editor: SlateEditor;
  leaf: TText;
}) {
  const renderLeaf = pipeRenderLeafStatic(editor, {
    components,
  });

  const leaves = TextApi.decorations(leaf, decorations);

  return leaves
    .filter((l) => l.text !== "")
    .map((l, index) => {
      const leafElement = renderLeaf!({
        attributes: { "data-slate-leaf": true },
        children: l.text,
        leaf: l as TText,
        text: l as TText,
      });

      return <Fragment key={index}>{leafElement}</Fragment>;
    });
}

const defaultDecorate: (entry: NodeEntry) => DecoratedRange[] = () => [];

function Children({
  children = [],
  components,
  decorate = defaultDecorate,
  decorations,
  editor,
}: {
  children: Descendant[];
  components: NodeComponents;
  decorate: EditableProps["decorate"];
  decorations: DecoratedRange[];
  editor: SlateEditor;
}) {
  return children.map((child, i) => {
    const p = editor.api.findPath(child);

    let ds: DecoratedRange[] = [];

    if (p) {
      const range = editor.api.range(p)!;
      ds = decorate([child, p]);

      for (const dec of decorations) {
        const d = RangeApi.intersection(dec, range);

        if (d) {
          ds.push(d);
        }
      }
    }

    return ElementApi.isElement(child) ? (
      <ElementStatic
        key={i}
        components={components}
        decorate={decorate}
        decorations={ds}
        editor={editor}
        element={child}
      />
    ) : (
      <LeafStatic key={i} components={components} decorations={ds} editor={editor} leaf={child} />
    );
  });
}

export type PlateStaticProps = {
  components: NodeComponents;
  editor: SlateEditor;
  style?: CSSProperties;
} & HTMLAttributes<HTMLDivElement>;

export function PlateStatic(props: PlateStaticProps) {
  const { components, editor } = props;

  const decorate = pipeDecorate(editor);

  let afterEditable: ReactNode = null;
  let beforeEditable: ReactNode = null;

  editor.pluginList.forEach((plugin) => {
    const {
      render: { afterEditable: AfterEditable, beforeEditable: BeforeEditable },
    } = plugin;

    if (AfterEditable) {
      afterEditable = (
        <>
          {afterEditable}
          <AfterEditable />
        </>
      );
    }
    if (BeforeEditable) {
      beforeEditable = (
        <>
          {beforeEditable}
          <BeforeEditable />
        </>
      );
    }
  });

  const content = (
    <Children components={components} decorate={decorate} decorations={[]} editor={editor}>
      {editor.children}
    </Children>
  );

  let aboveEditable: ReactNode = (
    <>
      {beforeEditable}
      {content}
      {afterEditable}
    </>
  );

  editor.pluginList.forEach((plugin) => {
    const {
      render: { aboveEditable: AboveEditable },
    } = plugin;

    if (AboveEditable) {
      aboveEditable = <AboveEditable>{aboveEditable}</AboveEditable>;
    }
  });

  return aboveEditable;
}

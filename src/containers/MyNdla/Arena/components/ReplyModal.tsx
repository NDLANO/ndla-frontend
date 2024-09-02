/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ComponentPropsWithoutRef, useCallback, useState } from "react";
import { DialogTrigger } from "@ark-ui/react";
import { DialogBody, DialogContent, DialogRoot } from "@ndla/primitives";
import ArenaForm, { ArenaFormValues } from "./ArenaForm";
import { useArenaReplyToTopicMutation } from "./temporaryNodebbHooks";

interface Props extends ComponentPropsWithoutRef<"button"> {
  formType: "topic" | "post";
  initialTitle?: string;
  initialContent?: string;
  postId?: number;
  topicId: number;
}

export const ReplyModal = ({ children, formType, initialTitle, initialContent, topicId, postId }: Props) => {
  const [open, setOpen] = useState(false);
  const { replyToTopic } = useArenaReplyToTopicMutation(topicId);

  const createReply = useCallback(
    async (data: Partial<ArenaFormValues>) => {
      await replyToTopic({
        variables: { topicId: topicId, content: data.content ?? "", postId: postId },
      });
    },
    [replyToTopic, topicId, postId],
  );

  return (
    <DialogRoot open={open} onOpenChange={() => setOpen(!open)}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <ReplyModalContent
        type={formType}
        initialContent={initialContent}
        initialTitle={initialTitle}
        onSave={async (values) => {
          await createReply(values);
          setOpen(false);
        }}
        onAbort={() => setOpen(false)}
      />
    </DialogRoot>
  );
};

interface ContentProps {
  type: "topic" | "post";
  initialTitle?: string;
  initialContent?: string;
  onSave: (data: Partial<ArenaFormValues>) => Promise<void>;
  onAbort: () => void;
}
export const ReplyModalContent = ({ type, initialTitle, initialContent, onSave, onAbort }: ContentProps) => {
  return (
    <DialogContent>
      <DialogBody>
        <ArenaForm
          type={type}
          initialContent={initialContent}
          initialTitle={initialTitle}
          onSave={onSave}
          onAbort={onAbort}
        />
      </DialogBody>
    </DialogContent>
  );
};

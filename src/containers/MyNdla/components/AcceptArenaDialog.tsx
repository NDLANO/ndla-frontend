/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  Text,
  UnOrderedList,
} from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { DialogCloseButton } from "../../../components/DialogCloseButton";
import { useToast } from "../../../components/ToastContext";
import config from "../../../config";
import { useUpdatePersonalData } from "../../../mutations/userMutations";

interface Props {
  children: ReactNode;
}

export const AcceptArenaDialog = ({ children }: Props) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const { updatePersonalData, loading } = useUpdatePersonalData();
  const toast = useToast();

  const onAcceptArena = async () => {
    const res = await updatePersonalData({ variables: { arenaAccepted: true } });
    if (!res.errors?.length) {
      toast.create({ title: t("myNdla.arena.accept.success") });
      setOpen(false);
      const openUrl = config.arenaDomain.startsWith("https://") ? config.arenaDomain : `https://${config.arenaDomain}`;
      window.open(openUrl, "_blank");
    } else {
      toast.create({ title: t("myNdla.arena.accept.error") });
    }
  };

  return (
    <DialogRoot open={open} onOpenChange={(details) => setOpen(details.open)}>
      {children}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("myNdla.arena.accept.title")}</DialogTitle>
          <DialogCloseButton />
        </DialogHeader>
        <DialogBody>
          <Text>{t("myNdla.arena.accept.pitch1")}</Text>
          <Text>{t("myNdla.arena.accept.pitch2")}</Text>
          <Text>{t("myNdla.arena.accept.listTitle")}</Text>
          <UnOrderedList>
            <li>{t("myNdla.arena.accept.list1")}</li>
            <li>{t("myNdla.arena.accept.list2")}</li>
            <li>{t("myNdla.arena.accept.list3")}</li>
          </UnOrderedList>
          {/* TODO: actual link */}
          <SafeLink to="https://ndla.no/article/vilkr-for-bruk">{t("myNdla.arena.accept.terms")}</SafeLink>
          <Text>
            {t("myNdla.arena.accept.privacyPolicy")}
            <SafeLink to="https://ndla.no/article/personvernerklaering" target="_blank">
              {t("myNdla.arena.accept.privacyPolicyLink")}
            </SafeLink>
          </Text>
        </DialogBody>
        <DialogFooter>
          <DialogCloseTrigger asChild>
            <Button variant="secondary">{t("cancel")}</Button>
          </DialogCloseTrigger>
          <Button onClick={onAcceptArena} loading={loading}>
            {t("myNdla.arena.accept.acceptButton")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};

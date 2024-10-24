"use client";
import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/modal";
import { Radio, RadioGroup } from "@nextui-org/radio";
import { HeartIcon } from "./icons/HeartIcon";
import { CameraIcon } from "./icons/CameraIcon";
import { BinIcon } from "./icons/BinIcon";
import { Button } from "@nextui-org/button";
import { Divider } from "@nextui-org/divider";
import { CirclePicker } from "react-color";
import { MailIcon } from "./icons/MailIcon";
import { BoardInterface } from "@/app/(auth)/tictactoe/page";
import { MarkSymbol } from "@/enums/game.enum";

const symbolOptions = [
  {
    value: "default",
    label: "X",
  },
  {
    value: "heart",
    label: <HeartIcon />,
  },
  {
    value: "camera",
    label: <CameraIcon />,
  },
  {
    value: "bin",
    label: <BinIcon />,
  }, {
    value: "mail",
    label: <MailIcon />,
  },
];

export const colors = [
  "#F0F8FF",
  "#F5F5DC",
  "#E6E6FA",
  "#FFF8DC",
  "#FAF0E6",
  "#F5FFFA",
  "#FFFAF0",
  "#FDF5E6",
  "#F0FFF0",
  "#E0FFFF",
];

interface ModalBoardSettingProps {
  isOpen: boolean;
  boardInterface: BoardInterface;
  onOpenChange: (isOpen: boolean) => void;
  setBoardInterface: React.Dispatch<React.SetStateAction<BoardInterface>>;
}

const ModalBoardSetting: React.FC<ModalBoardSettingProps> = ({
  isOpen,
  boardInterface,
  onOpenChange,
  setBoardInterface,
}) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 ">
              Interface Settings
            </ModalHeader>
            <ModalBody>
              <p className="font-bold text-base text-primary-500">Symbol</p>
              <RadioGroup
                label="Player"
                orientation="horizontal"
                value={boardInterface.symbol.player}
                onValueChange={(value) => {
                  setBoardInterface((prev) => ({
                    ...prev,
                    symbol: {
                      ...prev.symbol,
                      player: value as MarkSymbol,
                    },
                  }));
                }}
              >
                {symbolOptions.map(({ value, label }) => (
                  <Radio key={value} value={value}>
                    {label}
                  </Radio>
                ))}
              </RadioGroup>
              <RadioGroup
                label="Bot"
                orientation="horizontal"
                value={boardInterface.symbol.bot}
                onValueChange={(value) => {
                  setBoardInterface((prev) => ({
                    ...prev,
                    symbol: {
                      ...prev.symbol,
                      bot: value as MarkSymbol,
                    },
                  }));
                }}
              >
                {symbolOptions.map(({ value, label }) => (
                  <Radio key={value} value={value}>
                    {value === "default" ? "O" : label}
                  </Radio>
                ))}
              </RadioGroup>
              <Divider className="my-4" />
              <p className="font-bold text-base text-primary-500">
                Board background color
              </p>
              <CirclePicker
                onChange={(color) =>
                  setBoardInterface((prev) => ({
                    ...prev,
                    board: { ...prev.board, backgroundColor: color.hex },
                  }))
                }
                colors={colors}
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ModalBoardSetting;

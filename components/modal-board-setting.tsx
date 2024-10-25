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
import { Button } from "@nextui-org/button";
import { Divider } from "@nextui-org/divider";
import { CirclePicker } from "react-color";
import { MarkSymbol } from "@/enums/game.enum";
import {
  HeartIcon,
  BinIcon,
  CameraIcon,
  MailIcon,
} from "@/components/icons/index";
import { BoardInterface } from "@/app/(auth)/tictactoe/page";


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
  },
  {
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
  "#FF6F61", // Coral
  "#FFCCBC", // Peach
  "#FFD54F", // Amber
  "#A5D6A7", // Light Green
  "#81D4FA", // Light Blue
  "#B39DDB", // Light Purple
  "#FFAB91", // Light Salmon
  "#C5E1A5", // Pale Green
  "#B3E5FC", // Light Cyan
  "#DCE775", // Lime
  "#F48FB1", // Light Pink
  "#C5CAE9", // Light Blue Grey
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
              <p className="font-bold text-base text-primary-500 mb-2">
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

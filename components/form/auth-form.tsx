"use client";

import React from "react";
import NextLink from "next/link";
import { FormikProps } from "formik";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { AuthFormValue } from "@/types/auth";
import { AuthMode } from "@/enums/auth.enum";
import { MailIcon } from "../icons/MailIcon";
import { LockFilledIcon } from "../icons/LockFilledIcon";
import { EyeSlashFilledIcon } from "../icons/EyeSlashFilledIcon";
import { EyeFilledIcon } from "../icons/EyeFilledIcon";
import { Checkbox } from "@nextui-org/checkbox";
import { HeartIcon } from "../icons/HeartIcon";

const getPageTitleFormAuthMode = (authMode: AuthMode) => {
  let title = "";
  switch (authMode) {
    case AuthMode.SIGN_UP:
      title = "สร้างผู้ใช้งาน";
      break;
    case AuthMode.SIGN_IN:
      title = "เข้าสู่ระบบ";
      break;
    case AuthMode.RESET_PASSWORD:
      title = "รีเซ็ทรหัสผ่าน";
      break;
    default:
      break;
  }
  return title;
};

interface IAuthFormProps {
  formik: FormikProps<AuthFormValue>;
  authMode: AuthMode;
}

const AuthForm: React.FC<IAuthFormProps> = ({ formik, authMode }) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <form className="w-full flex flex-col gap-7 ">
      <div>
        <h1 className="text-xl font-medium ">
          {getPageTitleFormAuthMode(authMode)}
        </h1>
        {authMode === AuthMode.SIGN_UP && (
          <p className="text-xs text-gray-500">
            เพื่อความเป็นส่วนตัว ให้ใช้อีเมลที่ไม่สามารถระบุตัวตนผู้ใช้งานได้
          </p>
        )}
      </div>

      <Input
        label="อีเมล"
        type="email"
        onChange={formik.handleChange}
        value={formik.values.email}
        name="email"
        labelPlacement="outside"
        autoComplete="email"
        placeholder={
          authMode === AuthMode.SIGN_UP
            ? "กรุณากรอกอีเมลให้ถูกต้อง ex. email@email.com"
            : "กรุณากรอกอีเมล"
        }
        startContent={
          <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
        }
      />
      {authMode !== AuthMode.RESET_PASSWORD && (
        <div className="space-y-2 w-full">
          <Input
            label="รหัสผ่าน"
            onChange={formik.handleChange}
            value={formik.values.password}
            name="password"
            labelPlacement="outside"
            placeholder="กรุณากรอกความยาวขั้นต่ำ 6 ตัวอักษร"
            startContent={
              <LockFilledIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
            }
            endContent={
              <button
                className="focus:outline-none"
                type="button"
                onClick={toggleVisibility}
                aria-label="toggle password visibility"
              >
                {isVisible ? (
                  <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                ) : (
                  <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                )}
              </button>
            }
            autoComplete="password"
            type={isVisible ? "text" : "password"}
          />
          {authMode === AuthMode.SIGN_IN && (
            <div className="flex justify-between">
              <Checkbox
                defaultSelected
                size="sm"
                icon={<HeartIcon />}
                checked={formik.values.isSavePassword}
                onChange={formik.handleChange}
              >
                <span className="text-xs">จดจำรหัสผ่าน</span>
              </Checkbox>
              <NextLink href="/reset-password" className="float-right">
                <span className="text-xs text-primary-500">ลืมรหัสผ่าน?</span>
              </NextLink>
            </div>
          )}
        </div>
      )}
      {authMode === AuthMode.SIGN_UP && (
        <Input
          label="รหัส"
          onChange={formik.handleChange}
          value={formik.values.code}
          name="code"
          labelPlacement="outside"
          placeholder="กรุณากรอกความยาวขั้นต่ำ 6 ตัวอักษร"
          startContent={
            <LockFilledIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
          }
          endContent={
            <button
              className="focus:outline-none"
              type="button"
              onClick={toggleVisibility}
              aria-label="toggle password visibility"
            >
              {isVisible ? (
                <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
              ) : (
                <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
              )}
            </button>
          }
          autoComplete="password"
          type={isVisible ? "text" : "password"}
        />
      )}
      <Button
        onClick={() => {
          formik.handleSubmit();
        }}
        color="primary"
      >
        {getPageTitleFormAuthMode(authMode)}
      </Button>
      {authMode === AuthMode.SIGN_IN && (
        <p className="text-xs">
          ยังไม่มีสมาชิกใช่ไหม?{" "}
          <NextLink href="/signup">
            <span className="text-primary-500">ไปหน้าสร้างสมาชิก</span>
          </NextLink>
        </p>
      )}
      {authMode === AuthMode.SIGN_UP && (
        <NextLink href="/signin">
          <span className="text-primary-500 text-xs">ไปหน้าเข้าสู่ระบบ</span>
        </NextLink>
      )}
      {authMode === AuthMode.RESET_PASSWORD && (
        <p className="text-xs">
          กลับไปหน้า{" "}
          <NextLink href="/signup">
            <span className="text-primary-500">เข้าสู่ระบบ</span>
          </NextLink>
        </p>
      )}
    </form>
  );
};

export default AuthForm;

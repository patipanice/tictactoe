"use client"
import React from "react";
import { Avatar } from "@nextui-org/avatar";
import { User } from "@nextui-org/user";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/dropdown";
import { CircularProgress } from "@nextui-org/progress";
import NextLink from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthContext } from "@/contexts/auth-context";

const AuthSection = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, loading } = useAuthContext();

  if (loading) {
    return <CircularProgress aria-label="Loading..." />;
  }

  const userHavePhotoURL = user?.photoURL !== null;

  return (
    <div>
      {user ? (
        <Dropdown>
          <DropdownTrigger>
            <User
              as="button"
              avatarProps={{
                size: "sm",
                showFallback: !userHavePhotoURL,
                src: userHavePhotoURL
                  ? user.photoURL
                  : "https://images.unsplash.com/broken",
              }}
              className="transition-transform"
              description={user.uid.substring(0, 6)}
              name={user?.displayName}
            />
          </DropdownTrigger>
          <DropdownMenu
            aria-label="dropdown-menu-actions"
            onAction={(key) => {
              if (key === "logout") {
                logout();
              } else {
                router.push("/" + key);
              }
            }}
          >
            <DropdownItem key="profile">โปรไฟล์</DropdownItem>
            <DropdownItem key="logout" className="text-danger" color="danger">
              ออกจากระบบ
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      ) : (
        <NextLink
          className={
            pathname === "/signin"
              ? "text-primary-500 border-b-2 border-primary-500 pb-1"
              : "foreground"
          }
          href="/signin"
        >
          เข้าสู่ระบบ
        </NextLink>
      )}
    </div>
  );
};

export default AuthSection;

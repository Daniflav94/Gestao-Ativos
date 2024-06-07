import { useState } from "react";
import {
  Navbar as Nav,
  NavbarContent,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link as LinkHref,
} from "@nextui-org/react";
import { Link, useLocation } from "react-router-dom";
import * as S from "../styles";
import logo from "../../../assets/img/logo-white.png";
import { logout } from "../../../services/auth.service";

interface Props {
  setIsOpenModalLogin: (value: React.SetStateAction<boolean>) => void;
}

export function MobileNavbar({ setIsOpenModalLogin }: Props) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const route = useLocation();

  return (
    <Nav
      onMenuOpenChange={setIsMenuOpen}
      className="bg-[#4b457f] h-14 z-[99999]"
      maxWidth="full"
    >
      <NavbarContent className="flex justify-between w-screen items-center">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="md:hidden text-[#ff8900] "
        />

        <Link to="/">
          <S.Logo>
            <S.Img src={logo} alt="logo" />
          </S.Logo>
        </Link>

        <NavbarMenu className="flex items-center text-2xl">
          <NavbarMenuItem isActive={route.pathname === "/"}>
            <LinkHref
              href="/"
              className="w-full "
            >
              Gestão de ativos
            </LinkHref>
          </NavbarMenuItem>

          <NavbarMenuItem>
            <LinkHref href="/ativos" className="w-full">
              Ativos
            </LinkHref>
          </NavbarMenuItem>

          <NavbarMenuItem>
            <LinkHref href="/colaboradores" className="w-full">
              Colaboradores
            </LinkHref>
          </NavbarMenuItem>

          <NavbarMenuItem>
            <LinkHref
              className="w-full cursor-pointer"
              onClick={() => {
                logout();
                setIsOpenModalLogin(true);
              }}
            >
              Sair
            </LinkHref>
          </NavbarMenuItem>
        </NavbarMenu>
      </NavbarContent>
    </Nav>
  );
}

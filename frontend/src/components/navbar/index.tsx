import * as S from "./styles";
import logo from "../../assets/img/logo-white.png";
import { Link, useLocation } from "react-router-dom";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { ChevronDown, Plus } from "lucide-react";

export function Navbar() {
  const route = useLocation();

  return (
    <S.Nav>
      <S.Ul>
        <Link to="/">
          <S.Logo>
            <S.Img src={logo} alt="logo Provokers" />
          </S.Logo>
        </Link>
        <S.Div>
          <li>
            <Link to="/">
              <S.Span
                style={
                  route.pathname === "/"
                    ? { borderBottom: "2px solid #ff8c00" }
                    : {}
                }
              >
                Gestão de ativos
              </S.Span>
            </Link>
          </li>
          <li>
            <Link to="/ativos">
              <S.Span
                style={
                  route.pathname === "/ativos"
                    ? { borderBottom: "2px solid #ff8c00" }
                    : {}
                }
              >
                Ativos
              </S.Span>
            </Link>
          </li>

          <Dropdown className="min-w-fit"  classNames={{
        content: "py-1 px-1 bg-[#4b457f]",
      }}>
            <DropdownTrigger>
              <Button
                disableRipple
                className="p-0 bg-transparent data-[hover=true]:bg-transparent text-white tracking-widest rounded-none hover:border-b-2  hover:border-b-[#ff8900]"
                endContent={<ChevronDown size={16} />}
                radius="sm"

              >
                Cadastrar
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              disallowEmptySelection
              aria-label="Table Columns"
              closeOnSelect={true}
              selectionMode="single"
              hideSelectedIcon
              variant="solid"
              color="warning"
              className="z-[99999999]"
            >
              <DropdownItem
                key={"asset"}
                className="capitalize text-zinc-200"
          
              >
                Ativo
              </DropdownItem>
              <DropdownItem
                key={"user"}
                className="capitalize text-zinc-200"
                
              >
                Usuário
              </DropdownItem>
              <DropdownItem
                key={"collaborator"}
                className="capitalize text-zinc-200"
                
              >
                Colaborador
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </S.Div>
      </S.Ul>
    </S.Nav>
  );
}

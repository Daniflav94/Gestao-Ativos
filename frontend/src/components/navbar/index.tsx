import * as S from "./styles";
import logo from "../../assets/img/logo-white.png";
import { Link, useLocation } from "react-router-dom";
import { LoginModal } from "../../pages/login";
import { LogOut } from "lucide-react";
import { Button } from "@nextui-org/react";
import { logout } from "../../services/auth.service";
import { useEffect, useState } from "react";

export function Navbar() {
  const route = useLocation();
  const [isOpenModalLogin, setIsOpenModalLogin] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setIsOpenModalLogin(true);
    }
  }, [token]);

  return (
    <>
      {token ? (
        <S.Nav>
          <S.Ul>
            <Link to="/">
              <S.Logo>
                <S.Img src={logo} alt="logo" />
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

              <li>
                <Link to="/colaboradores">
                  <S.Span
                    style={
                      route.pathname === "/colaboradores"
                        ? { borderBottom: "2px solid #ff8c00" }
                        : {}
                    }
                  >
                    Colaboradores
                  </S.Span>
                </Link>
              </li>
              <li>
                <Button variant="ghost" size="sm" color="primary">
                  <LogOut
                    color="#ff8c00"
                    size={20}
                    onClick={() => {
                      logout();
                      setIsOpenModalLogin(true);
                    }}
                  />
                </Button>
              </li>
            </S.Div>
          </S.Ul>
        </S.Nav>
      ) : (
        <LoginModal isOpen={isOpenModalLogin} setIsOpen={setIsOpenModalLogin} />
      )}
    </>
  );
}

import * as S from "./styles";
import logo from "../../assets/img/logo-white.png";
import { Link, useLocation } from "react-router-dom";
import { LoginModal } from "../../pages/login";

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

          
        </S.Div>
      </S.Ul>

      <LoginModal />
    </S.Nav>
  );
}

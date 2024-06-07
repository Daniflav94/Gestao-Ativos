import * as S from "./styles";
import { LoginModal } from "../../pages/login";
import { useEffect, useState } from "react";
import { MobileNavbar } from "./components/mobileNavbar";
import { DesktopNavbar } from "./components/desktopNavbar";

export function Navbar() {

  const [isOpenModalLogin, setIsOpenModalLogin] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  const token = localStorage.getItem("token");

  const handleWindowSizeChange = () => {
    setScreenWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  useEffect(() => {
    if (!token) {
      setIsOpenModalLogin(true);
    }
  }, [token]);

  return (
    <>
      {token ? (
        <S.Nav>
          {screenWidth < 750 ? (
            <MobileNavbar setIsOpenModalLogin={setIsOpenModalLogin} />
          ) : (
            <DesktopNavbar setIsOpenModalLogin={setIsOpenModalLogin} />
          )}
        </S.Nav>
      ) : (
        <LoginModal isOpen={isOpenModalLogin} setIsOpen={setIsOpenModalLogin} />
      )}
    </>
  );
}

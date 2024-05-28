import { useEffect, useState } from "react";
import { CustomModal } from "../../components/customModal";
import { CustomInput } from "../../components/customInput";
import { Button } from "@nextui-org/react";
import * as S from "./styles";
import { SubmitHandler, useForm } from "react-hook-form";
import { EyeIcon, EyeOff } from "lucide-react";
import { login } from "../../services/auth.service";
import { Toaster, toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface ILogin {
  email: string;
  password: string;
}

export function LoginModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const toggleVisibility = () => setIsVisible(!isVisible);

  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = useForm<ILogin>();

  useEffect(() => {
    if (!token) {
      setIsOpen(true);
    }
  }, [token]);

  const onSubmit: SubmitHandler<ILogin> = async (data) => {
    const resLogin = await login(data);

    if (!resLogin) {
      toast.error(
        "Estamos com problemas no servidor. Tente novamente mais tarde"
      );
      return;
    } else if (resLogin) {
      if (resLogin.errors) {
        if (resLogin.errors[0].msg) {
          toast.error(resLogin.errors[0].msg);
        } else {
          toast.error(resLogin.errors[0]);
        }

        return;
      }

      setIsOpen(false);
      navigate("/");
    }
  };

  return (
    <>
      <Toaster position="top-right" richColors />
      <CustomModal
        modalTitle="Login"
        backdrop="blur"
        size="sm"
        isOpen={isOpen}
        onOpenChange={setIsOpen}
      >
        <S.Form onSubmit={handleSubmit(onSubmit)}>
          <CustomInput
            type="text"
            label="Email"
            placeholder="Digite seu email"
            labelPlacement="outside"
            color={errors.email ? "danger" : "primary"}
            control={control}
            name={"email"}
            refs={register("email")}
            isRequired
          />

          <CustomInput
            type={isVisible ? "text" : "password"}
            label="Senha"
            placeholder="Digite sua senha"
            labelPlacement="outside"
            color="primary"
            control={control}
            name={"password"}
            refs={register("password")}
            isRequired
            endContent={
              <button
                className="focus:outline-none"
                type="button"
                onClick={toggleVisibility}
              >
                {isVisible ? (
                  <EyeOff
                    className="text-default-400 pointer-events-none"
                    size={22}
                  />
                ) : (
                  <EyeIcon
                    className=" text-default-400 pointer-events-none"
                    size={22}
                  />
                )}
              </button>
            }
          />
          <Button
            type="submit"
            color="primary"
            className="text-slate-50 w-full my-5"
          >
            Entrar
          </Button>
        </S.Form>
      </CustomModal>
    </>
  );
}

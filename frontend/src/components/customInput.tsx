import { useController } from "react-hook-form";
import { Input } from "@nextui-org/react";

export function CustomInput(props: any) {
  const { field } = useController({
    control: props.control,
    defaultValue: props.defaultValue,
    name: props.name,
  });

  return (
    <Input
      {...props}
      value={field.value}
      size="md"
      onChange={field.onChange}
      variant="bordered"
      classNames={{
        input: ["bg-transparent", "text-black/90",],
        label: ["w-full"],
      }}
      
            
    />
  );
}
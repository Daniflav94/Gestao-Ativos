import { Select, SelectItem } from "@nextui-org/react";

export interface Props {
  placeholder?: string;
  label: string;
  listItems: {
    value: string;
    label: string;
  }[];
  isRequired?: boolean;
  onChange(value: any): void;
}

export function CustomSelect(props: Props) {
  return (
    <Select
      label={props.label}
      className="w-full"
      classNames={{
        label: ["bg-transparent", "text-black/60"],
      }}
      variant="bordered"
      size="sm"
      isRequired
      onSelectionChange={(value) => props.onChange(value)}
      placeholder={props.placeholder}
    >
      {props.listItems.map((item) => (
        <SelectItem key={item.value} value={item.value}>
          {item.label}
        </SelectItem>
      ))}
    </Select>
  );
}

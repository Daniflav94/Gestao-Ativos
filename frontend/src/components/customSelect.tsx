import { Select, SelectItem } from "@nextui-org/react";

export interface Props {
  placeholder?: string;
  label: string;
  listItems: {
    value: string;
    label: string;
  }[];
  isRequired?: boolean;
  isDisabled?: boolean;
  onChange(value: any): void;
  defaultSelectedKeys?: any;
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
      isDisabled={props.isDisabled}
      onSelectionChange={(value) => props.onChange(value)}
      placeholder={props.placeholder}
      defaultSelectedKeys={props.defaultSelectedKeys}
    >
      {props.listItems.map((item) => (
        <SelectItem key={item.value} value={item.value}>
          {item.label}
        </SelectItem>
      ))}
    </Select>
  );
}

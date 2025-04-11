import React from "react";

interface InputMonetaryProps {
  label?: string;
  value: number;
  field: string;
  disable?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function InputMonetary(props: InputMonetaryProps) {
  const { label, value, field, disable, onChange } = props;
  const [displayValue, setDisplayValue] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  React.useEffect(() => {
    setDisplayValue(formatNumber(value));
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\./g, "");
    const numericValue = parseFloat(rawValue) || 0;

    setDisplayValue(formatNumber(numericValue));
    if (onChange) {
      const syntheticEvent = {
        ...e,
        target: {
          ...e.target,
          value: numericValue.toString(),
        },
      };
      syntheticEvent.target.name = field;
      onChange(syntheticEvent as React.ChangeEvent<HTMLInputElement>);
    }
  };

  const renderLabel = () => {
    return (
      <span className="zaui-input-group-addon">
        <span className="zaui-input-label">{label}</span>
      </span>
    );
  };

  return (
    <span className="zaui-input-wrapper zaui-input-group">
      {renderLabel()}
      <span className="zaui-input-affix-wrapper">
        <input
          ref={inputRef}
          value={displayValue}
          onChange={handleChange}
          className="monetary-input zaui-input"
          style={{ textAlign: "right" }}
          onFocus={() => {
            const rawValue = displayValue.replace(/\./g, "");
            setDisplayValue(rawValue);
          }}
          onBlur={() => {
            const numericValue = parseFloat(displayValue.replace(/\./g, "")) || 0;
            setDisplayValue(formatNumber(numericValue));
          }}
          disabled={disable}
        />
      </span>
    </span>
  );
}
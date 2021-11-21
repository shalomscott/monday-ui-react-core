import React, { useCallback, useMemo, useState } from "react";
import Dropdown from "../Dropdown/Dropdown";
import ValueContainer from "./ValueContainer";
import Chip from "./Chip";

const addHeightAuto = styles => ({ ...styles, height: "auto" });

const MultiSelect = ({
  multiline,
  value,
  options,
  onChange: customOnChange,
  onOptionRemove: customOnOptionRemove,
  ...rest
}) => {
  const [selected, setSelected] = useState([]);
  const isControlled = !!value;
  const selectedOptions = value ?? selected;
  const optionsMap = useMemo(
    () =>
      options.reduce(
        (acc, option) => ({
          ...acc,
          [option.value]: option
        }),
        []
      ),
    [options]
  );
  const filteredOptions = useMemo(() => options.filter(option => !selectedOptions.includes(option.value)), [
    options,
    selectedOptions
  ]);

  const onOptionRemove = useMemo(
    () =>
      customOnOptionRemove ??
      function(optionValue, e) {
        setSelected(selected.filter(selectedOption => selectedOption !== optionValue));

        e.stopPropagation();
      },
    [customOnOptionRemove, selected]
  );

  const onChange = (option, event) => {
    if (customOnChange) {
      customOnChange(event);
    }

    if (isControlled) {
      return;
    }

    switch (event.action) {
      case "select-option":
        setSelected([...selected, option.value || event.option.value]);
        break;
      case "clear":
        setSelected([]);
        break;
    }
  };

  const valueContainerRenderer = useCallback(
    props => (
      <ValueContainer
        selectedOptions={selectedOptions.map(option => optionsMap[option])}
        onSelectedDelete={onOptionRemove}
        {...props}
      />
    ),
    [selectedOptions, onOptionRemove, optionsMap]
  );

  const multiValueRenderer = useCallback(({ data }) => <Chip {...optionsMap[data]} onDelete={onOptionRemove} />, [
    onOptionRemove,
    optionsMap
  ]);

  const extraProps = multiline
    ? {
        extraStyles: provided => ({
          ...provided,
          container: addHeightAuto,
          control: addHeightAuto,
          valueContainer: addHeightAuto
        })
      }
    : { valueContainerRenderer };

  return (
    <Dropdown
      options={filteredOptions}
      value={selectedOptions}
      onChange={onChange}
      multiValueRenderer={multiValueRenderer}
      {...extraProps}
      {...rest}
    />
  );
};

export default MultiSelect;

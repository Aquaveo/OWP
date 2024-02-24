import chroma from 'chroma-js';


const colourStyles = {
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    const color = chroma(data.color);
      return {
        ...styles,
        backgroundColor: isDisabled
            ? undefined
            : isSelected
            ? data.color
            : isFocused
            ? color.alpha(0.1).css()
            : undefined,
        color: isDisabled
            ? '#ccc'
            : isSelected
            ? chroma.contrast(color, 'white') > 2
            ? 'white'
            : 'black'
            : data.color,
        };
    }
  };

export { colourStyles }
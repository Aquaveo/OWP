const ButtonGroup = ({ children, className }) => {
    return <div className={`button-group ${className}`}>{children}</div>;
};


const ToggleButton = ({ id, checked, value, onChange, children, className }) => {
    return (
      <button
        id={id}
        className={`toggle-button ${className} ${checked ? 'toggle-button-checked' : ''}`}
        onClick={() => onChange(value)}
      >
        {children}
      </button>
    );
};

export { ButtonGroup, ToggleButton}
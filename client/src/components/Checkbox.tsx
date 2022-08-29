import styled from 'styled-components';

interface CheckboxProps {
  checked: boolean;
  onChange: (value: boolean) => void;
  label?: string;
  className?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  label,
  className,
}) => {
  return (
    <Wrapper>
      <input type="checkbox" onChange={() => onChange(!checked)} />
      <svg
        className={`checkbox ${checked ? 'checkbox--active' : ''} ${className}`}
        aria-hidden="true"
        viewBox="0 0 15 11"
        fill="none"
      >
        <path
          d="M1 4.5L5 9L14 1"
          strokeWidth="2"
          stroke={checked ? '#fff' : 'none'} // only show the checkmark when `isCheck` is `true`
        />
      </svg>
      {label}
    </Wrapper>
  );
};

const Wrapper = styled.label`
  display: flex;
  align-items: center;
  gap: 0.8rem;

  input[type='checkbox'] {
    clip: rect(0 0 0 0);
    clip-path: inset(50%);
    height: 1px;
    overflow: hidden;
    position: absolute;
    white-space: nowrap;
    width: 1px;
  }

  .checkbox {
    cursor: pointer;
    display: inline-block;
    height: 1.5rem;
    width: 1.5rem;
    padding: 0.1rem;
    background: var(--bg-color);
    border: 2px var(--gray-light) solid;
    border-radius: 3px;
  }

  .checkbox--active {
    border-color: var(--accent);
    background: var(--accent);
  }
`;

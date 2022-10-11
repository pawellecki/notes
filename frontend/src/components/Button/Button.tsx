import { Component, JSXElement } from 'solid-js';
import MuiButton from '@suid/material/Button';
import CircularProgress from '@suid/material/CircularProgress';

type Props = {
  children: JSXElement;
  type?: 'button' | 'submit';
  isLoading?: any;
  isDisabled?: any;
  variant?: 'text' | 'contained' | 'outlined';
  className?: string;
  onClick?: () => void;
};

const Button: Component<Props> = (props) => {
  const {
    children,
    type = 'button',
    variant = 'contained',
    className,
    onClick,
  } = props;

  return (
    <MuiButton
      type={type}
      className={className}
      variant={variant}
      onClick={onClick}
      disabled={props.isLoading || props.isDisabled}
    >
      {props.isLoading && <CircularProgress size={15} />}
      {children}
    </MuiButton>
  );
};

export default Button;

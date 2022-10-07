import { Component } from 'solid-js';
import TextField from '@suid/material/TextField';

type Props = {
  label: string;
  name?: string;
  error?: string[];
  helperText?: string;
  type?: 'text' | 'password';
  value?: string;
  onChange?: (value: string) => void;
};

const Input: Component<Props> = (props) => {
  const { label, name, type = 'text', onChange, ...rest } = props;

  return (
    <TextField
      {...rest}
      label={label}
      error={!!props.error?.[0]}
      helperText={props.error?.[0]}
      variant="standard"
      name={name}
      type={type}
      value={props.value}
      onChange={(e) => onChange && onChange(e.currentTarget.value)}
    />
  );
};

export default Input;

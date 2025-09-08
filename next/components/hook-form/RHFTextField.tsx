import * as React from 'react';
import { TextField, TextFieldProps } from '@mui/material';
import { useFormContext } from 'react-hook-form';

type Props = TextFieldProps & {
  name: string;
};

export default function RHFTextField({ name, helperText, ...other }: Props) {
  const { register, formState } = useFormContext();
  const fieldError = (formState.errors as any)?.[name]?.message as string | undefined;
  return (
    <TextField
      {...register(name)}
      error={Boolean(fieldError)}
      helperText={fieldError || helperText || ' '}
      {...other}
    />
  );
}


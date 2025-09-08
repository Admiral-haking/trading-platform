import * as React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { TextField, TextFieldProps } from '@mui/material';

type Props = TextFieldProps & {
  name: string;
};

export default function RHFSelect({ name, helperText, children, ...other }: Props) {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <TextField
          select
          {...field}
          error={!!fieldState.error}
          helperText={fieldState.error?.message || helperText || ' '}
          {...other}
        >
          {children}
        </TextField>
      )}
    />
  );
}


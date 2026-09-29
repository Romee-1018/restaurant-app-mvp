import { useState } from "react";

type FormErrors<T> = Partial<
  Record<keyof T, string>
>;

type ValidateFunction<T> = (
  values: T
) => FormErrors<T>;

function useForm<T extends Record<string, string>>(
  initialValues: T,
  validate?: ValidateFunction<T>
) {
  const [values, setValues] =
    useState<T>(initialValues);

  const [errors, setErrors] =
    useState<FormErrors<T>>({});

  const handleChange = (
    field: keyof T,
    value: string
  ) => {
    setValues((previousValues) => ({
      ...previousValues,
      [field]: value,
    }));

    setErrors((previousErrors) => ({
      ...previousErrors,
      [field]: "",
    }));
  };

  const handleSubmit = (
    onSubmit: (values: T) => void
  ) => {
    const validationErrors = validate
      ? validate(values)
      : {};

    setErrors(validationErrors);

    if (
      Object.keys(validationErrors).length === 0
    ) {
      onSubmit(values);
      return true;
    }

    return false;
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
  };

  const isValid =
    Object.keys(errors).length === 0;

  return {
    values,
    errors,
    handleChange,
    handleSubmit,
    reset,
    isValid,
  };
}

export { useForm };

export default useForm;
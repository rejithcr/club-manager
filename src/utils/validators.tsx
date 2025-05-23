export const isValidPhoneNumber = (num: string | null | undefined) => {
  const phoneRegex = /^\d{10}$/;
  return num && phoneRegex.test(num);
}

export const isValidEmail = (email: string | null | undefined) => {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return email && pattern.test(email);
}

export const isValidLength = (value: string | null | undefined, length: number) => {
  if (!value || (value && value?.length < length)) {
    return false
  }
  return true
}


export const isCurrency = (value: string) => {
  return  /^\d+(\.\d{1,2})?$/.test(value);
}

export const isValidYear = (year: string) => {
  return /^\d{4}$/.test(year) && +year >= 2000 && +year <= 2200;
}
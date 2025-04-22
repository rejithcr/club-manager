export const isValidPhoneNumber = (num : string) => {
    const phoneRegex = /^\d{10}$/;
    const match = phoneRegex.test(num);
    console.log(match)
    return match
  }
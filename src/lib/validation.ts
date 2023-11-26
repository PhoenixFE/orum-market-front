export const validateEmail = (email: string) => {
  const validEmailRegex = /^\S+@\S+\.\S+$/;
  return validEmailRegex.test(email);
};

export const validatePassword = (password: string) => {
  // Assuming the password criteria is a minimum of 8 characters
  return password.length >= 8;
};

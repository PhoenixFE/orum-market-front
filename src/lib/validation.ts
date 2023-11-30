export const validateEmail = (email: string) => {
  const validEmailRegex = /^\S+@\S+\.\S+$/;
  return validEmailRegex.test(email);
};

export const validatePassword = (password: string) => {
  // Assuming the password criteria is a minimum of 8 characters
  return password.length >= 8;
};

export const validateProductTitle = (title: string) => {
  return title.length > 2;
};

export const validateProductContent = (content: string) => {
  return content.length > 11;
};

export const validateProductPrice = (price: number) => {
  return Number.isInteger(price);
};

export const validateProductShippingFees = (shippingFees: number) => {
  return shippingFees % 1 === 0;
};

export const validateMainImages = (images: string): string[] => {
  const imageArray = images.split(',').map((image) => image.trim());
  return imageArray;
};

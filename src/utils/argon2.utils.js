import argon2 from "argon2";

// Function to hash the password
const hashPassword = async (password) => {
  if (typeof password !== "string" || password.trim() === "") {
    throw new Error("Invalid password: must be a non-empty string");
  }
  try {
    const hashedPassword = await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 2 ** 14,
      timeCost: 2,
      parallelism: 2,
    });

    return hashedPassword;
  } catch (err) {
    throw new Error("Error hashing password");
  }
};

// Function to verify the password
const verifyPassword = async (storedHash, password) => {
  try {
    const isValid = await argon2.verify(storedHash, password);
    return isValid;
  } catch (err) {
    throw new Error("Error verifying password");
  }
};

export { hashPassword, verifyPassword };

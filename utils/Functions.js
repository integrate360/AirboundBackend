function generatePassword() {
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*()_+[]{}|;:,.<>?";
  const allChars = uppercase + lowercase + numbers + symbols;

  // Ensure at least one character from each required set
  const randomUppercase =
    uppercase[Math.floor(Math.random() * uppercase.length)];
  const randomLowercase =
    lowercase[Math.floor(Math.random() * lowercase.length)];
  const randomNumber = numbers[Math.floor(Math.random() * numbers.length)];
  const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];

  // Fill the rest of the password to make it at least 8 characters
  const remainingLength = 8 - 4; // 4 characters already chosen
  let remainingChars = "";
  for (let i = 0; i < remainingLength; i++) {
    remainingChars += allChars[Math.floor(Math.random() * allChars.length)];
  }

  // Combine all characters and shuffle
  const password =
    randomUppercase +
    randomLowercase +
    randomNumber +
    randomSymbol +
    remainingChars;
  return password
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");
}
function generateOtp() {
  // Generate a random 6-digit number
  const otp = Math.floor(100000 + Math.random() * 900000);
  return otp;
}
module.exports = { generatePassword, generateOtp };

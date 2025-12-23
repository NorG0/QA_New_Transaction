import { faker } from '@faker-js/faker';

const generateTestData = (option = {}) => {
  const buyerName = randomString('Test');
  const buyerEmail = generateInvalidEmails(option.emailType);
  const buyerPhone = generatePhoneNumber(option.isPhoneNumber);
  const propertyAddress = option.propertyAddress;
  const postalCode = generatePostcode(option.isPostalCode);
  const salePrice = option.salePrice;
  const fileName = option.fileName;

  return { buyerName, buyerEmail, buyerPhone, propertyAddress, postalCode, salePrice, fileName };
};

function randomString(prefix) {
  return `${prefix}_${Date.now()}`;
}

const generateInvalidEmails = (invalidType = false) => {
  const timeStamp = Date.now();
  if (invalidType) {
    switch (invalidType) {
      case 'missing@':
        return `testuser_${timeStamp}domain.com`;
      case 'missingDomain':
        return `testuser_${timeStamp}@.com`;
      case 'missingTLD':
        return `testuser_${timeStamp}domain.`;
      case 'specialChars':
        return `testuser!#$%&'*+/=?^_\${|}~domain.com`;
      default: {
        const validTypes = ['missing@', 'missingDomain', 'missingTLD', 'specialChars'];
        const randomType = validTypes[Math.floor(Math.random() * validTypes.length)];
        return generateInvalidEmails(randomType);
      }
    }
  }
  return `testUser_${timeStamp}@domain.com`;
};

const generatePhoneNumber = (isValid = true) => {
  const min = 1000000;
  const max = 9999999;
  const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
  const numbers = '1234567';
  const firstNum = numbers[Math.floor(Math.random() * numbers.length)];
  if (!isValid) {
    return `${firstNum}${randomNum}`;
  }
  const validPrefixes = ['8', '9'];
  const prefix = validPrefixes[Math.floor(Math.random() * validPrefixes.length)];
  return `${prefix}${randomNum}`;
};

const generatePostcode = (isValid = true) => {
  if (!isValid) return faker.location.zipCode('#####');
  return faker.location.zipCode('######');
};

export { generateTestData };

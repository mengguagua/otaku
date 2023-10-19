export function validatePhoneNumber(phoneNumber) {
  // 中国大陆手机号码正则表达式
  let phonePattern = /^1[3-9]\d{9}$/;
  return phonePattern.test(phoneNumber);
}
export default {
  validatePhoneNumber,
};

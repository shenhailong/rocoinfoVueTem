/**
*
* @descrition:判断输入的参数是否是个合格标准的邮箱,并不能判断是否有效，有效只能通过邮箱提供商确定。
* @param:str ->待验证的参数。
* @return -> true表示合格的邮箱。
* 
*/
export default function(str){
  /**
  * @descrition:邮箱规则
  * 1.邮箱以a-z、A-Z、0-9开头，最小长度为1.
  * 2.如果左侧部分包含-、_、.则这些特殊符号的前面必须包一位数字或字母。
  * 3.@符号是必填项
  * 4.右则部分可分为两部分，第一部分为邮件提供商域名地址，第二部分为域名后缀，现已知的最短为2位。最长的为6为。
  * 5.邮件提供商域可以包含特殊字符-、_、.
  */
  var pattern = /^([a-zA-Z0-9]+[-_.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[-_.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,6}$/;
  return pattern.test(str);
}
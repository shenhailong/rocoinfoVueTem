/**
*
* @descrition:判断输入的手机号格式。
* @param:str ->待验证的参数。
* @return -> true表示合格的手机号。
*
*/
export default function(str){
  /**
  * @descrition:手机号规则
  * 1.11位.
  */
  var pattern = /^1[3456789]\d{9}$/;
  return pattern.test(str);
}

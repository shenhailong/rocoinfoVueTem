/**
*
* @descrition:校验验证码。
* @param:str ->待验证的参数。
* @return -> true表示合格的验证码。
*
*/
export default function(str){
  /**
  * @descrition:校验验证码
  * 1.6位.
  */
  var pattern = /^[0-9]{6}$/;
  return pattern.test(str);
}

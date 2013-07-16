/*
本程序摘自网络
EYES作修改
最后修改时间 2005.4.27

特别说明：
以下说明中的属性名均作更改：
valueType        改为        vt
objectName        改为        on
mustInput        改为        r
mustSelect        改为        r
minSelect        改为        mis
maxSelect        改为        mas
stringLen        改为        最小(mil:minLen)长度和最大(mal:maxLen)长度两个属性

一、用法简介：
表单验证函数放在了functions.js文件里了，在你所需要做验证的网页文件里，包含该脚本文件。一般语法为:
<script type="text/javascript" src="./functions.js">
对于焦点失去验证，为表单控件的onBlur事件绑定相应的验证函数，用法如下：
整型   checkNumber()
浮点型 checkNumber()
字符串 checkString()
日期   checkDate()
邮箱   checkEmail()
示例 onBlur="checkNumber()"
对于表单提交验证，在表单提交前进行判断，用法如下：
if(checkForm('表单名称'))
{
表单名称.submit();
return true;
}
else
{
return false;
}
也可以绑定表单onSubmit事件，用法如下：
onSubmit="return checkForm()"


二、类型定义：

1、整型(int)
定义:
valueType="int"
属性:
objName   对象名称(字符串)
mustInput 必输项(true/false)
minInput  最小值(数字)
maxInput  最大值(数字)
举例:
<input type="text" name="test" valueType="int" objName="总载重吨" mustInput="true" maxInput="10000">

2、浮点型(float)
定义:
valueType="float"
属性:
objName   对象名称(字符串)
mustInput 必输项(true/false)
minInput  最小值(数字)
maxInput  最大值(数字)
decimalLen小数位数(数字)
举例:
<input type="text" name="test" valueType="float" objName="运价" mustInput="true" maxInput="10000.50" decimalLen="2">

3、字符串(string)
定义:
valueType="string"
属性:
objName   对象名称(字符串)
mustInput 必输项(true/false)
stringLen 字符串长度(数字)
举例:
<input type="text" name="test" valueType="string" objName="英文船名" mustInput="true" stringLen="100">


3、字符串(string)
定义:
valueType="string"
属性:
objName   对象名称(字符串)
mustInput 必输项(true/false)
stringLen 字符串长度(数字)
exp   跟要验证的正则类型，例如：exp='zipcode'
举例:
<input type="text"   name="test" exp='zipcode' valueType="string" objName="英文船名" mustInput="true" stringLen="100">


4、日期(date)
定义:
valueType="date"
属性:
objName   对象名称(字符串)
mustInput 必输项(true/false)
举例:
<input type="text" name="test" valueType="date" objName="开始日期" mustInput="true">
备注:
日期现在只能校验的格式为(yyyy-mm-dd)

5、邮箱(email)
定义:
valueType="email"
属性:
objName   对象名称(字符串)
mustInput 必输项(true/false)
举例:
<input type="text" name="test" valueType="email" objName="邮箱" mustInput="true">

6、单选(radio)  由EYES修改成功
定义:
valueType="radio"
属性:
objName   对象名称(字符串)
mustChecked 必输项(true/false)
举例:
<input type="radio" name="test" valueType="radio" objName="租船方式" mustChecked="true">
备注:
对于同一组单选按钮，只需要定义第一个即可。

7、复选(checkbox) 由EYES修改成功
定义:
valueType="checkbox"
属性:
objName   对象名称(字符串)
minSelect 最小选择数(数字)
maxSelect 最大选择数(数字)
举例:
<input type="checkbox" mustChecked="true" name="test" valueType="checkbox" objName="爱好" minSelect="2" maxSelect="5">
备注:
对于同一组复选按钮，只需要定义第一个即可。

8、下拉列表框(select)
定义:
valueType="select"
属性:
objName   对象名称(字符串)
mustSelect 必输项(true/false)  
mustSelect 必输项(true/false)  
举例1:
<select name="test" valueType="select" objName="租船方式" mustSelect="true" default="-99">
举例2:
<select name="test" valueType="select" objName="租船方式" mustSelect="true">
<option value="">请选择<option>
<option value="3">3 <option>
<option value="4">4 <option>
</select>
9、列表框(list)
定义:
valueType="list"
属性:
objName   对象名称(字符串)
minSelect 最小选择数(数字)
maxSelect 最大选择数(数字)
举例:
<select name="test" valueType="list" objName="爱好" size =5 minSelect="2" maxSelect="5">

/////////////以下由EYES添加//////////
10、比较（compare)        一般用作两次密码对比
valueType="compare"
to="要比较的表单名"



/////////////新加//////////
定义:
valueType="stringByvalue"
属性:
objName   对象名称(字符串)
mustInput 必输项(true/false)
title  默认字符串
exp   跟要验证的正则类型，例如：exp='zipcode'
举例:
<input type='text' exp='zipcode'  name='test' valueType='stringByvalue' objName='名' title='提示文字' mustInput='true' stringLen='100'>

*/

function checkForm(oForm)
{
    var tempParent = null;
	if(typeof(oForm) == "object") {
		tempParent =$(oForm);
	} 
	else 
	{
	    tempParent =$("body");
	}

	var eles = tempParent.find(":visible[valueType]");
	if (eles.size() > 0) {

	    for (var i = 0; i < eles.size(); i++) {
	        if (eles.is(":hidden")) {
	            continue;
            }
	        if (eles.eq(i).is("[mustInput]") && $.trim(eles.eq(i).val()) == "")
	        {
	            setErr(eles.eq(i).attr("objName")+"不可以为空");
	            setFocus(eles.eq(i));
	            return false;
	        }
	        if (eles.eq(i).is("[mustSelect]")) {
	            if (eles.eq(i).is("[default]") && eles.eq(i).val() != eles.eq(i).attr("default")) {
	                setErr("请选择" + eles.eq(i).attr("objName"));
	                setFocus(eles.eq(i));
	                return false;
	            }
	            else if ( parseInt( eles.eq(i).val(),10) <0 ) {
	                setErr("请选择" + eles.eq(i).attr("objName"));
	                setFocus(eles.eq(i));
	                return false;
	            }
	            else if (eles.eq(i).val()=="") {
	                setErr("请选择" + eles.eq(i).attr("objName"));
	                setFocus(eles.eq(i));
	                return false;
                }

	        }
	        switch(eles.eq(i).attr("valueType"))
			{
				case "int":
					if(!checkInt(eles.get(i)))
					{
						return false;
					}
		                break;
                case "int_":
                    if (!checkInt_(eles.get(i))) {
                        return false;
                    }
                    break;
				case "float":
					if(!checkFloat(eles.get(i)))
					{
						return false;
					}
					break;
	            case "float_":
	                if (!checkFloat_(eles.get(i))) {
	                    return false;
	                }
	                break;
				case "string":
				    
					if(!checkString(eles.get(i)))
					{
						return false;
					}
					break;
				case "stringByvalue":
				    
				    if( $.trim(eles.eq(i).val())==$.trim(eles.eq(i).attr("title")) )
	                {
	                    setErr("请输入"+eles.eq(i).attr("objName"));
	                    setFocus(eles.eq(i));
	                    return false;
	                }
	                if( $.trim(eles.eq(i).val())!=$.trim(eles.eq(i).attr("title"))  )
	                {
	                    if(!checkString(eles.get(i)))
					    {
						    return false;
					    }
	                }
					
					break;
	case "date":
	    if ($.trim(eles.eq(i).attr("mustInput")) == "true" && eles.eq(i).val() == "****.**.**") {
	        setErr(eles.eq(i).attr("objName") + "不可以为空");
	        setFocus(eles.eq(i));
	        return false;
	    } 
	    if (!checkDate(eles.get(i))) {
	        return false;
	    }
	    break;
				
				case "email":
					if(!checkEmail(eles.get(i)))
					{
						return false;
					}
					break;
				
				case "radio":
					if(!checkRadio(eles.get(i)))
					{
						return false;
					}
					break;
				
				case "checkbox":
					if(!checkBox(eles.get(i)))
					{
						return false;
					}
					break;
				
				case "select":
					if(!checkSelect(eles.get(i)))
					{
						return false;
					}
					break;
				
				case "list":
					if(!checkList(eles.get(i)))
					{
						return false;
					}
					break;
				case "compare":
					if (!validCompare(eles.get(i)))
					{
						return false;
					}
					break;
				case "textarea":
					if (!validTextarea(eles.get(i)))
					{
						return false;
					}
					break;
			}
	    }

	}
	return true;
}



 

function setFocus(el)
 {
    el= $(el);
  var sType = el.attr("type");
  el = el.get(0);
  switch(sType)
  {

   case "text":
   case "hidden":
   case "password":
   case "file":
   case "textarea": 
    try{el.focus();var rng = el.createTextRange(); rng.collapse(false); rng.select();}catch(e){};
    break;
   case "checkbox":
   case "radio": 
    var els = document.getElementsByName(el.name);
    for(var i=0;i<els.length;i++)
    {
     if(els[i].disabled == false)
     {
      els[i].focus();
      break;
     }
    }
    break;
   case "select-one":
   case "select-multiple":
    el.focus();
    break;
  }
 }


function checkInt(ele) {
   
	if(!isInt(ele.value))
	{
	    setErr(($(ele).attr("objName")) + "请输入有效整数");
		ele.focus();
		return false;
	}
	else
	{
		if(ele.maxInput!=null && !isNaN(ele.maxInput))
		{
			if(parseInt(ele.maxInput)<parseInt(ele.value))
			{
				setErr("您输入的"+ convertNullToSpace($(ele).attr("objName"))+"值应该小于"+ele.maxInput);
				ele.focus();
				return false;
			}
		}
		if(ele.minInput!=null && !isNaN(ele.minInput))
		{
				if(parseInt(ele.minInput)>parseInt(ele.value))
				{
					setErr("您输入的"+ convertNullToSpace($(ele).attr("objName"))+"值应该大于"+ele.minInput);
					ele.focus();
					return false;
				}
		}
				
	}
	return true;
}
function checkInt_(ele) {
 
    if (!isInt_(ele.value)) {
        setErr(($(ele).attr("objName")) + "请输入有效整数");
        ele.focus();
        return false;
    }
    else {
        if (ele.maxInput != null && !isNaN(ele.maxInput)) {
            if (parseInt(ele.maxInput) < parseInt(ele.value)) {
                setErr("您输入的" + convertNullToSpace($(ele).attr("objName")) + "值应该小于" + ele.maxInput);
                ele.focus();
                return false;
            }
        }
        if (ele.minInput != null && !isNaN(ele.minInput)) {
            if (parseInt(ele.minInput) > parseInt(ele.value)) {
                setErr("您输入的" + convertNullToSpace($(ele).attr("objName")) + "值应该大于" + ele.minInput);
                ele.focus();
                return false;
            }
        }

    }
    return true;
}

function checkFloat(ele)
{
    if (!isFloat(ele.value))
	{
	    setErr(($(ele).attr("objName")) + "请输入有效数字");
		ele.focus();
		return false;
	}
	else
	{
		if(ele.decimalLen!=null && !checkDecimal(ele.value,ele.decimalLen))
		{
			setErr("您输入的"+convertNullToSpace($(ele).attr("objName"))+"值小数位最多为"+ele.decimalLen);
			ele.focus();
			return false;
		}
		if(ele.maxInput!=null && !isNaN(ele.maxInput))
		{
			if(parseInt(ele.maxInput)<parseInt(ele.value))
			{
				setErr("您输入的"+ convertNullToSpace($(ele).attr("objName"))+"值应该小于"+ele.maxInput);
				ele.focus();
				return false;
			}
		}
			if(ele.minInput!=null && !isNaN(ele.minInput))
			{
				if(parseInt(ele.minInput)>parseInt(ele.value))
				{
					setErr("您输入的"+ convertNullToSpace($(ele).attr("objName"))+"值应该大于"+ele.minInput);
					ele.focus();
					return false;
				}
				}
	}
	return true;
}
function checkFloat_(ele) {
    if (!isFloat_(ele.value)) {
        setErr(($(ele).attr("objName")) + "请输入有效数字");
        ele.focus();
        return false;
    }
    else {
        if (ele.decimalLen != null && !checkDecimal(ele.value, ele.decimalLen)) {
            setErr("您输入的" + convertNullToSpace($(ele).attr("objName")) + "值小数位最多为" + ele.decimalLen);
            ele.focus();
            return false;
        }
        if (ele.maxInput != null && !isNaN(ele.maxInput)) {
            if (parseInt(ele.maxInput) < parseInt(ele.value)) {
                setErr("您输入的" + convertNullToSpace($(ele).attr("objName")) + "值应该小于" + ele.maxInput);
                ele.focus();
                return false;
            }
        }
        if (ele.minInput != null && !isNaN(ele.minInput)) {
            if (parseInt(ele.minInput) > parseInt(ele.value)) {
                setErr("您输入的" + convertNullToSpace($(ele).attr("objName")) + "值应该大于" + ele.minInput);
                ele.focus();
                return false;
            }
        }
    }
    return true;
}

function checkString(ele)
{
   
	if(ele.minLen!=null && !isNaN(ele.maxLen))
	{
		if(strlen(ele.value.trim())<parseInt(ele.minLen))
		{
		    var strErr = "您输入的"+convertNullToSpace($(ele).attr("objName"))+"最小长度为"+ele.minLen+"字母或是"+parseInt(parseInt(ele.minLen)/2)+"个汉字";
		    var intNum = strlen(strErr.trim())*6+10;
			setErr(strErr);
			setFocus(ele);
			return false;
		}
	}
	if(ele.maxLen!=null && !isNaN(ele.maxLen))
	{
		if(strlen(ele.value.trim())>parseInt(ele.maxLen))
		{
			var strErr = "您输入的"+convertNullToSpace($(ele).attr("objName"))+"最大长度为"+ele.maxLen+"字母或是"+parseInt(parseInt(ele.maxLen)/2)+"个汉字";
		    var intNum = strlen(strErr.trim())*6+10;
			setErr(strErr);
			setFocus(ele);
			return false;
		}
	}
	if(!checkByReg(ele))
	{   
	    var strErrTxt = "";
	    if(ele.getAttribute("exp"))
	    {
	        var sReg = ele.getAttribute("exp");
	        strErrTxt = "只能包括："+aUsagesTxt[sReg];
	    }
	    var strErr = "您输入的"+convertNullToSpace($(ele).attr("objName"))+"格式不正确！"+strErrTxt;
	    setErr(strErr);
	    setFocus(ele);
	return false;
	}
	return true;
}
					

function strlen(str) {
    var len = 0;
    for (var i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) > 255) len += 2; else len ++;
    }
    return len;
}

String.prototype.ltrim = function(){
            return this.replace(/(^\s*)/g, "");
          }
String.prototype.rtrim = function(){

            return this.replace(/(\s*$)/g, "");
          }
String.prototype.trim = function(){

            return this.replace(/(^\s*)|(\s*$)/g,"");
          }
String.prototype.trimStart=function(string)
{
    if (!string)
    {
        string="\\s+";
    }
    var trimStartPattern=new RegExp("^("+string+")+","g");
    return this.replace(trimStartPattern,"");
}
String.prototype.trimEnd=function(string)
{
    if (!string)
    {
        string="\\s+";
    }
    var trimEndPattern=new RegExp("("+string+")+$","g");
    return this.replace(trimEndPattern,"");
}
String.prototype.startsWith=function(string)
{
    if (!string)
    {
        string="\\s";
    }
    var startsWithPattern=new RegExp("^("+string+")","g");
    return startsWithPattern.test(this);
}
String.prototype.endsWith=function(string)
{
    if (!string)
    {
        string="\\s";
    }
    var endsWithPattern=new RegExp("("+string+")$","g");
    return endsWithPattern.test(this);
}


function checkDate(ele) {
   
    if(!isDate(ele.value))
	{
		setErr(($(ele).attr("objName"))+"请输入有效日期(yyyy.mm.dd)");
		ele.focus();
		return false;
	}
    if ($(ele).is("[checkmin]")) {
        var elemid = $(ele).attr("checkmax");
        if (elemid != null && $("#" + elemid).val() != "") {
            var datelist_ = $(ele).val().split('-');
            var datelist = $("#" + elemid).val().split('-');
            var date_ = new Date(datelist_[0], datelist_[1], datelist_[2]);
            var date = new Date(datelist[0], datelist[1], datelist[2]);
            if (date_ < date) {
                setErr("请填写比"+($(ele).attr("objName")) + "大的日期");
                ele.focus();
                return false;
            }

        } 
    }
    if ($(ele).is("[checkmax]")) {
        var elemid = $(ele).attr("checkmax");
        if (elemid != null && $("#" + elemid).val() != "") {
            var datelist_ = $(ele).val().split('-');
            var datelist = $("#" + elemid).val().split('-');
            var date_ = new Date(datelist_[0], datelist_[1], datelist_[2]);
            var date = new Date(datelist[0], datelist[1], datelist[2]);  
            if (date_ > date) {
                setErr("请填写比"+($(ele).attr("objName")) + "小的日期");
                ele.focus();
                return false;
            }
            
        } 
    }
	
	return true;
}


function checkEmail(ele)
{
    if (!isEmail(ele.value.trim()))
	{
		setErr(($(ele).attr("objName"))+"请输入有效邮箱");
		ele.focus();
		return false;
	}
	return true;
}


function checkRadio(ele)
{
	if($("[name='"+$(ele).attr("name")+"']:checked").size() < 1)
	{
	    setErr("请选择"+convertNullToSpace($(ele).attr("objName")));
		ele.focus();
		return false;
	}
	return true;
}

function checkBox(ele)
{
    var mintemp  =0 ;
    var maxTemp = 0;
    mintemp = parseInt($(ele).attr("minSelect"),10);
    maxTemp = parseInt($(ele).attr("maxSelect"),10);
    var numSize = $("[name='"+$(ele).attr("name")+"']:checked").size();
    if(mintemp > 0 && numSize < numSize)
	{
	   setErr(convertNullToSpace($(ele).attr("objName"))+"至少选择"+mintemp+"项");
		ele.focus();
		return false;
	}
	
	if(maxTemp > 0 && numSize > maxTemp)
	{
	  setErr(convertNullToSpace($(ele).attr("objName"))+"至多选择"+maxTemp+"项");
			ele.focus();
			return false;
	}
	return true;
}

function checkSelect(ele)
{
	if(ele.mustSelect!=null && ele.mustSelect)
	{
	    if(ele.options.length <=1)
	    {
	        return true;
	    }
	    if(ele.childNodes.length>0 && ele.selectedIndex<0)
		{
			setErr("请选择"+convertNullToSpace($(ele).attr("objName")))
			ele.focus();
			return false;
		}
		if(ele.selectedIndex==0 && ele.value =="-1")
		{
			setErr("请选择"+convertNullToSpace($(ele).attr("objName")))
			ele.focus();
			return false;
		}
	}
	return true;
}

function checkList(ele)
{
	var selectCount=0;
	for(var i=0;i<ele.options.length;i++)
	{
		if(ele.options[i].selected)
		{
			selectCount++;
		}
	}
	if(ele.minSelect!=null && !isNaN(ele.minSelect))
	{
		if(selectCount<parseInt(ele.minSelect))
		{
		    var strErr = convertNullToSpace($(ele).attr("objName"))+"至少选择"+ele.minSelect+"项";
		    var intNum = strlen(strErr.trim())*6+10;
			setErr(strErr);
			setFocus(ele);
			return false;
		}
	}
	if(ele.maxSelect!=null && !isNaN(ele.maxSelect))
	{
		if(selectCount>parseInt(ele.maxSelect))
		{
			var strErr = convertNullToSpace($(ele).attr("objName"))+"至多选择"+ele.maxSelect+"项";
		    var intNum = strlen(strErr.trim())*6+10;
			setErr(strErr);
			setFocus(ele);
			return false;
		}
	}
	return true;
}

function validCompare(ele)
{
	var valid = false;
	var compareTo = ele.getAttribute("to");
	if(document.getElementById(compareTo).value == ele.value)
	{
	    valid =  true;
	}
	else
	{
	    setErr("请输入正确重复");
		ele.focus();
	}
	return valid;
}

function isInt(s)
{
	var patrn=/^[-,+]{0,1}[0-9]{0,}$/;
	if (!patrn.exec(s)) return false;
	return true;
}
function isInt_(s) {
    var patrn = /^[1-9][0-9]{0,}$/;
    if (!patrn.exec(s)) return false;
    return true;
}
function isFloat(s) {
    var patrn = /^[-,+]{0,1}(\d*\.)?\d+$/;
    if (!patrn.exec(s)) return false;
    return true;
}
function isFloat_(s) {
    var patrn = /^(\d*\.)?\d+$/;
    if (!patrn.exec(s)) return false;
    return true;
}
function isNumber(s)
{
	var patrn=/^[-,+]{0,1}[0-9]{0,}[.]{0,1}[0-9]{0,}$/;
	if (!patrn.exec(s)) return false;
	return true;
}

function isDate(str)
{
	var r = str.match(/^(\d{1,4}).(\d{1,2}).(\d{1,2})$/);
	if(r==null)
	{
		return false;
	}
	var d= new Date( parseInt( r[1]), parseInt(r[2],10)-1, parseInt(r[3],10));
	if(!(d.getFullYear()==r[1]&&(d.getMonth()+1)==r[2]&&d.getDate()==r[3]))
	{
		return false;
	}
	return true;
}

function isEmail(str)
{
    if (str.match(/[\w-|.]+@{1}[\w-]+\.{1}\w{2,4}(\.{0,1}\w{2}){0,1}/ig) != str)
		return false;
	else
		return true;
}

function convertNullToSpace(paramValue)
{
	if(paramValue==null)
		return "";
	else
		return paramValue;
}

function checkDecimal(num,decimalLen)
{
	var len = decimalLen*1+1;
	if(num.indexOf('.')>0)
	{
		num=num.substr(num.indexOf('.')+1,num.length-1);
		if ((num.length)<len)
		{
			return true;
		}
		else
		{
			return false;
		}
	}
return true;
}
function validTextarea(ele) {
    if ($.trim($(ele).val()) == "") {
        return false;
    }
    return true;
}
function checkByReg(ele)
{
    var sReg = ele.getAttribute("exp");
    if(typeof(sReg)!="undefined" && sReg!= null)
    {
        if(sReg.trim() != "" )
        {
        var sVal = ele.value.trim();
        var reg = new RegExp(aUsages[sReg],"i");
        return reg.test(sVal);
        }
    }
    return true;
}

function checkByRegByType(ele,strType)
{

    var sReg = strType;
    if(typeof(sReg)!="undefined" && sReg!= null)
    {
        if(sReg.trim() != "" )
        {
        var sVal = ele.value.trim();
        var reg = new RegExp(aUsages[sReg],"i");
        return reg.test(sVal);
        }
    }
    return true;
}

 var aUsages = 
 {
  "int":"^([+-]?)\\d+$",          
  "int+":"^([+]?)\\d+$",          
  "int-":"^-\\d+$",           
  "num":"^[0-9]+$",       
  "num+":"^([+]?)\\d*\\.?\\d+$",        
  "num-":"^-\\d*\\.?\\d+$",         
  "float":"^([+-]?)\\d*\\.\\d+$",        
  "float+":"^([+]?)\\d*\\.\\d+$",   
  "floatmn":"^([+]?)\\d{m}\\.\\d{0,n}$",     
  "float-":"^-\\d*\\.\\d+$",                  
  "email":"^\\w+((-\\w+)|(\\.\\w+))*\\@[A-Za-z0-9]+((\\.|-)[A-Za-z0-9]+)*\\.[A-Za-z0-9]+$",
  "color":"^#[a-fA-F0-9]{6}",        
  "url":"^http[s]?:\\/\\/([\\w-]+\\.)+[\\w-]+([\\w-./?%&=]*)?$",
  "chinese":"^[\\u4E00-\\u9FA5\\uF900-\\uFA2D]+$",   
  "ascii":"^[\\x00-\\xFF]+$",         
  "zipcode":"^\\d{6}$",           
  "mobile":"^[1-9][0-9]{10}$",    
  "ip4":"^\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}.\\d{1,3}$", 
  "notempty":"^\\S+$",      
  "picture":"(.*)\\.(jpg|bmp|gif|ico|pcx|jpeg|tif|png|raw|tga)$", 
  "rar":"(.*)\\.(rar|zip|7zip|tgz)$",       
  "date":"^\\d{4}(\\-|\\/|\.)\\d{1,2}\\1\\d{1,2}$",        
  "text":"^[A-Za-z\\u4e00-\\u9fa5\\uF900-\\uFA2D]+$",       
  "text0":"^[u4e00-u9fa5]+$",       
  "text1":"^[A-Za-z0-9\\u4E00-\\u9FA5\\uF900-\\uFA2D]+$",       
  "text2":"^[A-Za-z0-9\\u4E00-\\u9FA5\\uF900-\\uFA2D_-]+$",       
  "text3":"^[\\u4E00-\\u9FA5\\uF900-\\uFA2D,，]+$",      
  "text4":"^[A-Za-z0-9\\u4e00-\\u9fa5\\uF900-\\uFA2D|\\s]+$",     
  "text5":"^[A-Za-z0-9\\u4e00-\\u9fa5\\uF900-\\uFA2D_-|\\s]+$",       
  "text6":"^[\\u4e00-\\u9fa5\\uF900-\\uFA2D,，|\\s]+$",  
  "tel":"^[1-9]+[-]?[0-9]+$",   
  "qq":"^\\w+((-\\w+)|(\\.\\w+))*\\@[A-Za-z0-9]+((\\.|-)[A-Za-z0-9]+)*\\.[A-Za-z0-9]+$|^[1-9]+[0-9]*$",    
  "licence":"^[A-Za-z0-9]+$", 
  "date":"^([1-2]{1,1}[0-9]{3,3})-([0-1]{0,1}[0-9]{1,1})-([0-3]{0,1}[0-9]{1,1})$"   
 };
 
  var aUsagesTxt = 
 {
  "int":"整数",
  "int+":"正整数",
  "int-":"负整数",
  "num":"数字",
  "num+":"正数",
  "num-":"负数",
  "float":"浮点数",
  "float+":"正浮点数",
  "float-":"负浮点数 ",           
  "email":"邮件,例：zhenlong@zhenglong.com",
  "color":"颜色",
  "url":"联接,例：http://www.loonyee.com",
  "chinese":"仅中文",
  "ascii":"仅ACSII字符",
  "zipcode":"邮编",
  "mobile":"手机",
  "ip4":"ip地址",
  "notempty":"非空",
  "picture":"图片",
  "rar":"压缩文件",
  "date":"日期",
  "text":"中英文",
  "text0":"中文",
  "text1":"中英文和数字",
  "text2":"中英文,数字,-",
  "text3":"中英和','",
  "text4":"中英文,数字和空格",
  "text5":"中英文,数字,-和空格",
  "text6":"中文,',',和空格",
  "tel":"数字,-",
  "qq":"qq",
  "licence":"营业号",
  "date":"日期"
 };


function setErr(strvalue) {
     alert(strvalue);
//jQuery.showTips(strvalue, 2);
//    if(showErr)
//    {
//    setErr("提示信息", 295,100, "showErrDiv_long"); 
//    }
//    else
//    {
//    alert(strvalue);
//    }
    
}
(function(w) {

function isNull(s) {
	 return s === null;
}

function isUndefined(s) {
	return s === void 0;
}

function isEmpty(s) {
	if(isNull(s) || isUndefined(s) || '' === trim(s)) 
		return true;
	else 
		return false;
}

function isAlphaNumeric(s) {
	return /^[A-Za-z0-9]+$/.test(s);
}

function isNumeric(s) {
	return /^[0-9]+$/.test(s);
}

function isAlpha(s) {
	return /^[A-Za-z]+$/.test(s);
}

function isHangul(s) {
	return /^[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]+$/.test(s);
}

function getLength(s) {
	return s.length;
}

function isAlphaHangulNumeric(s) {
	return /^[a-z|A-Z|ㄱ-ㅎ|ㅏ-ㅣ|가-힝|0-9]+$/.test(s);
}

function getByteLength(s) {
	var b=0,i=0,c=0;
	for(; c=s.charCodeAt(i++); b+=c>>11?3:c>>7?2:1);
	return b;
}

function trim(s) {
	return s.replace(/^\s+|\s+$/g,'');
}

function leftTrim(s) {
	return s.replace(/^\s+/,'');
}

function rightTrim(s) {
	return s.replace(/\s+$/,'');
}

function leftPad(s, l, c) {
	for(l=l-getLength(s); l>0; l--) s=c+s;
	return s;
}

function rightPad(s, l, c) {
	for(l=l-getLength(s); l>0; l--) s+=c;
	return s;
}

function addCommas(s) {
	if(isNumeric(s)) s=''+s;
	s=s.split('.');
	while(/(\d+)(\d{3})/.test(s[0])) s[0]=s[0].replace(/(\d+)(\d{3})/,'$1,$2');
	return s.join('.');
}

function replaceAll(s, bs, as) {
	return s.split(bs).join(as);
}

function numToKor(s) {
	if(isNumeric(s)) {
		s = s + '';
	}

	var unit = {
		n : ['','일','이','삼','사','오','육','칠','팔','구'],
		u : ['','십','백','천','만','십','백','천','억','십','백','천','조','십']
	};

	var z = 0, lbl = "", pos=0 ,s=v.toString();
	for(i=0; i<s.length; i++) {
		pos = s.length-i-1;
		lbl += unit.n[s.substr(i,1)];
		if(s.substr(i,1)=='0') {
			z++;
			if(pos % 4 == 0 && z<4)
				z=0, lbl += unit.u[pos] ? unit.u[pos] : '';
		}
		else {
			z=0, lbl += unit.u[pos] ? unit.u[pos] : '';
		}
	}
	return lbl;
}

var su = {
	isEmpty : isEmpty
  , isAlphaNumeric : isAlphaNumeric
  , isNumeric : isNumeric
  , isAlpha : isAlpha
  , isHangul : isHangul
  , getLength : getLength
  , isAlphaHangulNumeric : isAlphaHangulNumeric
  , getByteLength : getByteLength
  , trim : trim
  , leftTrim : leftTrim
  , rightTrim : rightTrim
  , leftPad : leftPad
  , rightPad : rightPad
  , addCommas : addCommas
  , replaceAll : replaceAll	
  , numToKor : numToKor
};  

function isDate(s) {
	if(isEmpty(s) || 8 != getLength(s)) {
		return false;
	}

	var year = Number(s.substring(0, 4));
	var month = Number(s.substring(4, 6));
	var day = Number(s.substring(6, 8));

	if (1 > month || 12 < month) {
		return false;
	}

	var lastDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	var lastDay = lastDays[month - 1];

	if (month == 2 && (year % 4 == 0 && year % 100 != 0 || year % 400 == 0)) {
		lastDay = 29;
	}

	if (1 > day || lastDay < day) {
		return false;
	}

	return true;
}

function isTime(s) {
	if(isEmpty(s) || 6 != getLength(s)) {
		return false;
	}

	var h = Number(s.substring(0, 2));
	var m = Number(s.substring(2, 4));
	var s = Number(s.substring(4, 6));

	if (0 > h || 23 < h) {
		return false;
	}
	if (0 > m || 59 < m) {
		return false;
	}
	if (0 > s || 59 < s) {
		return false;
	}

	return true;
}

function strToDate(s) {
	var array = s.split(' ');
	var date = array[0];
	var time = '000000';
	
	if (2 == array.length) {
		time = array[1];
	}
	//
	if(getLength(s) == 14) {
		date = s.substring(0, 8);
		time = s.substring(8, 14);
	}

	if (!isDate(date)) return null;
	if (!isTime(time)) return null;

	var year = date.substring(0, 4);
	var month = Number(date.substring(4, 6)) - 1;
	var day = date.substring(6, 8);
	var hour = time.substring(0, 2);
	var minute = time.substring(2, 4);
	var second = time.substring(4, 6);

	return new Date(year, leftPad('' + month, 2, '0'), day, hour, minute, second);
}

function formatDate(d, f) {
	var tp = toString.call(d);

	if ('[object Date]' === tp) {
		return f.replace(/(yyyy|yy|MM|dd|hh24|hh|mi|ss|ms|a\/p)/gi, function($1) {
			switch ($1) {
				case "yyyy":
					return '' + d.getFullYear();
				case "yy":
					return leftPad('' + (d.getFullYear() % 1000), 4, '0').substring(2, 4);
				case "MM":
					return leftPad('' + (d.getMonth() + 1), 2, '0');
				case "dd":
					return leftPad('' + d.getDate(), 2, '0');
				case "hh24":
					return leftPad('' + d.getHours(), 2, '0');
				case "hh":
					return leftPad('' + ((h = d.getHours() % 12) ? h : 12), 2, '0');
				case "mi":
					return leftPad('' + d.getMinutes(), 2, '0');
				case "ss":
					return leftPad('' + d.getSeconds(), 2, '0');
				case "ms":
					return leftPad('' + d.getMilliseconds(), 3, '0');
				case "a/p":
					return d.getHours() < 12 ? "오전" : "오후";
				default:
					return $1;
			}
		});
	} else if ('[object String]' === tp) {
		return formatDate(strToDate(d), f);
	}
	return '';
}

function getDayOfWeek(s) {
	if (!isDate(s)) return '';
	var week = ['일', '월', '화', '수', '목', '금', '토'];
	return week[strToDate(s).getDay()];
}

function getDiffDay(sd, ed) {
	var newSd = strToDate(sd);
	var newEd = strToDate(ed);
	var diffTime = newEd.getTime() - newSd.getTime();

	return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

function getDiffTime(sd, ed) {
	var newSd = strToDate(sd);
	var newEd = strToDate(ed);
	var diffTime = newEd.getTime() - newSd.getTime();

	return Math.floor(diffTime / (1000 * 60 * 60));
}

function addDays(s, d, f) {
	var newDt = strToDate(s);
	newDt.setDate(newDt.getDate() + (d));
	return formatDate(newDt, f || 'yyyyMMdd');
}

function addMonths(s, m, f) {
	var newDt = strToDate(s);
	newDt.setMonth(newDt.getMonth() + (m));
	return formatDate(newDt, f || 'yyyyMMdd');
}

function addYears(s, y, f) {
	var newDt = strToDate(s);
	newDt.setFullYear(newDt.getFullYear() + (y));
	return formatDate(newDt, f || 'yyyyMMdd');
}

function getLastDay(s, f) {
	var newDt = strToDate(s);
	newDt.setMonth(newDt.getMonth() + 1);
	newDt.setDate(0);
	return formatDate(newDt, f || 'yyyyMMdd');
}


var du = {
	isDate : isDate
  , isTime : isTime
  , strToDate : strToDate
  , formatDate : formatDate
  , getDayOfWeek : getDayOfWeek
  , getDiffDay : getDiffDay
  , getDiffTime : getDiffTime
  , addDays : addDays
  , addMonths : addMonths
  , addYears : addYears
  , getLastDay : getLastDay
};   

function strToInt(s) {
	return parseInt(s, 10);
}

function strToFloat(s) {
	return parseFloat(s, 10);
}

var nu = {
	strToInt : strToInt
  , strToFloat : strToFloat
  , numToKor : numToKor
  , addCommas : addCommas
};

function isEmail(s) {
	return /^([0-9a-zA-Z]+)([0-9a-zA-Z\._-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,3}$/.test(s);
}

function isTel(s) {
	s = phoneFormat(s); 
	return /^\d{2,3}-\d{3,4}-\d{4}$/.test(s);
}

function isMobile(s) {
	s = phoneFormat(s); 
	return /^(?:(010-?\d{4})|(01[1|6|7|8|9]-?\d{3,4}))-?(\d{4})$/.test(s);
}

function phoneFormat(s) {
	s = replaceAll(s, '=', '');

	if(s.length == 12){
		return s.substring(0,4)+'-'+s.substring(4,8)+'-'+s.substring(8,12);		
	}

	return s.replace(/(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/, "$1-$2-$3");
}

var vu = {
	isEmail : isEmail
  , isTel : isTel
  , isMobile : isMobile

}; 

w.StringUtil = su;
w.DateUtil = du;
w.NumberUtil = nu;
w.ValidationUtil = vu;

})(window);
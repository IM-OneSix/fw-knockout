/**
 * Util
 *
 * | DATE | NAME | DESC |
 * |------|------|------|
 * | 2016.04.04 | 강환기 | 최초생성 |
 */
(function (){

si.service('util', function($svc) {
var log = $svc.logger('util');
var o = {};

o.isNull = function(val) {
	return _.isUndefined(val) || _.isNull(val);
};

// ==========================================================
// StringUtil
// ==========================================================
//주어진 문자열이 null 또는 공백일 경우 참 반환
o.isEmpty = function(s) {
	return _.isString(s)&&(s==null||s==='');
};

//입력된 문자열이 숫자와 알파벳로만 구성되어있는지 체크
o.isAlphaNumeric = function(s) {
	return _.isString(s)&&/^[A-Za-z0-9]+$/.test(s);
};

//입력된 문자열이 숫자로만 구성되어있는지 체크
o.isNumeric = function(s) {
	return _.isString(s)&&/^[0-9]+$/.test(s);
};

//입력된 문자열이 알파벳로만 구성되어있는지 체크
o.isAlpha = function(s) {
	return _.isString(s)&&/^[A-Za-z]+$/.test(s);
};

//입력된 문자열이 한글로만 구성되어 있는지 체크
o.isHangul = function(s) {
	return _.isString(s)&&/^[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]+$/.test(s);
};

//입력된 문자열이 알파벳, 한글로만 구성되어 있는지 체크
o.isAlphaHangul = function(s) {
	return _.isString(s)&&/^[A-Za-zㄱ-ㅎ|ㅏ-ㅣ|가-힣]+$/.test(s);
};

//해당하는 문자열에 대한 길이 반환
o.getLength = function(s) {
	return _.isString(s)?s.length:0;
};

//입력된 문자열이 알파벳, 한글, 숫자로 구성되어 있는지 체크
o.isAlphaHangulNumeric = function(s){
	return _.isString(s)&&/^[a-z|A-Z|ㄱ-ㅎ|ㅏ-ㅣ|가-힝|0-9]+$/.test(s);
};

//해당하는 문자열에 대해서 byte 단위에 대해서 길이 계산해서 총 길이 반환(한글은 3Byte)
o.getByteLength = function(s) {
	var b=0,i=0,c=0;
	if(_.isString(s))for(; c=s.charCodeAt(i++); b+=c>>11?3:c>>7?2:1);
	return b;
};

//문자열의 왼쪽의 공백 문자열 제거
o.leftTrim = function(s) {
	return _.isString(s)?s.replace(/^\s+/,''):'';
};

//문자열의 오른쪽의 공백 문자열 제거
o.rightTrim = function(s) {
	return _.isString(s)?s.replace(/\s+$/,''):'';
};

//문자열의 공백 문자열 제거
o.trim = function(s) {
	return _.isString(s)?s.replace(/^\s+|\s+$/g,''):'';
};

//해당하는 문자열에 대해서 입력된 길이만큼 부족한 길이를 왼쪽부터 공백으로 채워넣는다.
o.leftPad = function(s, l, c) {
	if(!_.isString(s) || !_.isString(c)) return '';
	if(_.isNumber(l) && l>o.getLength(s) && o.getLength(c)==1) for(l=l-o.getLength(s); l>0; l--) s=c+s;
	return s;
};

//해당하는 문자열에 대해서 입력된 길이만큼 부족한 길이를 오른쪽부터 지정된 문자로 채워넣는다.
o.rightPad = function(s, l, c) {
	if(!_.isString(s) || !_.isString(c)) return '';
	if(_.isNumber(l) && l>o.getLength(s) && o.getLength(c)==1) for(l=l-o.getLength(s); l>0; l--) s+=c;
	return s;
};
//해당하는 문자열을 오른쪽부터 입력된 길이만큼 반환
o.strRight = function(s, l) {
	var i=0;
	if(!_.isString(s) || s=='') return '';
	return _.reduceRight(s, function(memo, num){return (++i<l ? num:'') + memo||''});
};

//세자리 마다 콤마(,) 추가
o.addCommas = function(s) {
	if(_.isNumber(s)) s=''+s;
	if(!_.isString(s)) return '';
	s=s.split('.');
	while(/(\d+)(\d{3})/.test(s[0])) s[0]=s[0].replace(/(\d+)(\d{3})/,'$1,$2');
	return s.join('.');
};

//입력된 문자열이 주어진 문자열과 일치하는 모든 문자열을 바꿔야할 문자열로 변경
o.replaceAll = function(s, bs, as) {
	return (_.isString(s)&&_.isString(bs)&&_.isString(as))?s.split(bs).join(as):'';
};

// 문자열을 포멧형식으로 치환
o.strFormat = function(s,f) {
	var i=0;
	if(!_.isString(s) || s=='' || !_.isString(f) || f=='') return '';
	return _.map(f,function(v){return v=='x'?s.charAt(i++):v}).join('');
};

//문자열을 포멧형식으로 치환
o.strDataType = function(tp,dt) {
	return o.strFormat(dt,{
		'date':'xxxx.xx.xx',
		'time':'xx:xx:xx',
		'dateTime':'xxxx.xx.xx xx:xx:xx',
		'account':'xxx-xx-xxxxxx',
		'card':'xxxx-xxxx-xxxx-xxxx'
	}[tp]);
};

// ==========================================================
// DateUtil
// ==========================================================
//입력된 일자가 유효한 일자인지 체크
o.isDate = function(s) {
	if (!_.isString(s) || o.isEmpty(s) || o.getLength(s) != 8) return false;

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
};

//입력된 시간이 유효한지 체크
o.isTime = function(s) {
	if (!_.isString(s) || o.isEmpty(s) || o.getLength(s) != 6) return false;

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
};

//입력된 시간이 유효한지 체크
o.isHour = function(s) {
	if (!_.isString(s) || o.isEmpty(s) || o.getLength(s) != 2) return false;

	var h = Number(s);

	if (0 > h || 23 < h) {
		return false;
	}
	return true;
};

//string to date
o.strToDate = function(s) {
	if (!_.isString(s)) return null;
	
	var array = s.split(' ');
	var date = array[0];
	var time = '000000';
	
	if (2 == array.length) {
		time = array[1];
	}
	//
	if(o.getLength(s) == 14) {
		date = s.substring(0, 8);
		time = s.substring(8, 14);
	}

	if (!o.isDate(date)) return null;
	if (!o.isTime(time)) return null;

	var year = date.substring(0, 4);
	var month = Number(date.substring(4, 6)) - 1;
	var day = date.substring(6, 8);
	var hour = time.substring(0, 2);
	var minute = time.substring(2, 4);
	var second = time.substring(4, 6);

	return new Date(year, o.leftPad('' + month, 2, '0'), day, hour, minute, second);
};

//date to string
o.formatDate = function formatDate(d, f) {
	if (!_.isString(f)) return '';

	if (_.isDate(d)) {
		return f.replace(/(yyyy|yy|MM|dd|hh24|hh|mi|ss|ms|a\/p)/gi, function($1) {
			switch ($1) {
				case "yyyy":
					return '' + d.getFullYear();
				case "yy":
					return o.leftPad('' + (d.getFullYear() % 1000), 4, '0').substring(2, 4);
				case "MM":
					return o.leftPad('' + (d.getMonth() + 1), 2, '0');
				case "dd":
					return o.leftPad('' + d.getDate(), 2, '0');
				case "hh24":
					return o.leftPad('' + d.getHours(), 2, '0');
				case "hh":
					return o.leftPad('' + ((h = d.getHours() % 12) ? h : 12), 2, '0');
				case "mi":
					return o.leftPad('' + d.getMinutes(), 2, '0');
				case "ss":
					return o.leftPad('' + d.getSeconds(), 2, '0');
				case "ms":
					return o.leftPad('' + d.getMilliseconds(), 3, '0');
				case "a/p":
					return d.getHours() < 12 ? "오전" : "오후";
				default:
					return $1;
			}
		});
	} else if (_.isString(d)) {
		return formatDate(o.strToDate(d), f);
	}
	return '';
};

//입력받은 일자의 요일 반환
o.getDayOfWeek = function(s) {
	if (!o.isDate(s)) return '';
	var week = ['일', '월', '화', '수', '목', '금', '토'];
	return week[o.strToDate(s).getDay()];
};

//입력받은 두 날짜 사이의 일자 계산
o.getDiffDay = function(sd, ed) {
	if (!o.isDate(sd) || !o.isDate(ed)) return -1;
	if (Number(ed) < Number(sd)) return -2;

	var newSd = o.strToDate(sd);
	var newEd = o.strToDate(ed);
	var diffTime = newEd.getTime() - newSd.getTime();

	return Math.floor(diffTime / (1000 * 60 * 60 * 24));
};

//입력받은 두 날짜 사이의 시간차이 계산
o.getDiffTime = function(sd, ed) {
	//if (!o.isDate(sd) || !o.isDate(ed)) return -1;
	if (Number(ed) < Number(sd)) return -2;

	var newSd = o.strToDate(sd);
	var newEd = o.strToDate(ed);
	var diffTime = newEd.getTime() - newSd.getTime();

	return Math.floor(diffTime / (1000 * 60 * 60));
};

//입력받은 일자에 대해서 해당 일만큼 더한 일자 반환. 마이너스 일자는 입력받은 일자보다 이전의 일자로 계산해서 반환
o.addDays = function(s, d, f) {
	if (!o.isDate(s) || !_.isNumber(d)) return '';
	var newDt = o.strToDate(s);
	newDt.setDate(newDt.getDate() + (d));
	return o.formatDate(newDt, f || 'yyyyMMdd');
};

//입력받은 일자에 대해서 해당 개월수만큼 더한 일자 반환. 마이너스 개월수는 입력받은 일자보다 이전 일자로 계산해서 반환
o.addMonths = function(s, m, f) {
	if (!o.isDate(s) || !_.isNumber(m)) return '';
	var newDt = o.strToDate(s);
	newDt.setMonth(newDt.getMonth() + (m));
	return o.formatDate(newDt, f || 'yyyyMMdd');
};

//입력받은 일자에 대해서 해당 년수만큼 더한 일자 반환. 마이너스 년수는 입력받은 일자보다 이전 일자로 계산해서 반환
o.addYears = function(s, y, f) {
	if (!o.isDate(s) || !_.isNumber(y)) return '';
	var newDt = o.strToDate(s);
	newDt.setFullYear(newDt.getFullYear() + (y));
	return o.formatDate(newDt, f || 'yyyyMMdd');
};

//입력받은 일자에 마지막 일 반환
o.getLastDay = function(s, f) {
	if (!o.isDate(s)) return '';
	var newDt = o.strToDate(s);
	newDt.setMonth(newDt.getMonth() + 1);
	newDt.setDate(0);
	return o.formatDate(newDt, f || 'yyyyMMdd');
};

// ==========================================================
// NumberUtil
// ==========================================================
//string to int
o.strToInt = function(s) {
	if (!_.isString(s)) return 0;
	if (_.isNaN(parseInt(s.replace(/,/g,''), 10))) return 0;
	return parseInt(s.replace(/,/g,''), 10);
};

o.parseInt = function(s) {
	return parseInt(s, 10);
};

//string to rate
o.strToFloat = function(s) {
	if (!_.isString(s)) return 0;
	if (_.isNaN(parseFloat(s.replace(/,/g,''), 10))) return 0;
	return parseFloat(s.replace(/,/g,''), 10);
};

// ==========================================================
// ValidationUtil
// ==========================================================

//문자열의 길이가 최소, 최대 길이 사이에 존재하는지 체크
o.isRangeLength = function(s, min, max) {
	if (!_.isString(s) || !_.isNumber(min) || !_.isNumber(max)) return false;

	var len = o.getLength(s);
	if (min <= len && len <= max) {
		return true;
	}
	return false;
};

//문자열의 길이가 byte 단위로 계산했을때 최소, 최대 길이 사이에 존재하는지 체크
o.isRangeByteLength = function(s, min, max) {
	if (!_.isString(s) || !_.isNumber(min) || !_.isNumber(max)) return false;

	var len = o.getByteLength(s);
	if (min <= len && len <= max) {
		return true;
	}
	return false;
};

//입력된 이메일주소가 유효한이메일주소인지 검증한다.
o.isEmail = function(s) {
	if (!_.isString(s)) return false;
	return /^([0-9a-zA-Z]+)([0-9a-zA-Z\._-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,3}$/.test(s);
	//return /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/.test(s);
};

o.phoneFormat = function(val) {
	if (o.isNull(val)) {
		return "";
	}

	val = o.replaceAll(val, "-", "");

	if(val.length == 12){
		var val = val.substring(0,4)+'-'+val.substring(4,8)+'-'+val.substring(8,12);
		return val;
	}

	return val.replace(/(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/, "$1-$2-$3");
};

//입력된 전화번호가 유효한 번호인지 검증한다.
o.isTel = function(s) {
	if (!_.isString(s)) return false;

	s = o.phoneFormat(s); 

	return /^\d{2,3}-\d{3,4}-\d{4}$/.test(s);
};

//휴대폰 연속번호 오류 DATA
//	var MOB_ERROR = ['1566','1577','1588','0000','1111','2222', '3333','4444','5555','6666','7777','8888','9999'];

//입력된 휴대폰번호가 유효한 번호인지 검증한다.
o.isMobile = function(s) {
	if (!_.isString(s)) return false;

//		var checkSameNo = _.find(MOB_ERROR, function(v){
//			//연속번호 에러가 포함된 경우 오류번호 리턴
//			return s.indexOf(v) > -1;
//		});
//
//		if(_.isString(checkSameNo)) return false;

	s = o.phoneFormat(s); 

	//return /^01([0|1|6|7|8|9]?)-?([0-9]{3,4})-?([0-9]{4})$/.test(s);
	return /^(?:(010-?\d{4})|(01[1|6|7|8|9]-?\d{3,4}))-?(\d{4})$/.test(s);
};

// 숫자형 문자를 한글로 변환
o.numToKor = function (v) {
	if(!o.isNumeric(v+''))
		return '';

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
	return lbl
};

o.promise = function(v) {
	var d = $.Deferred();
	d.resolve(v);
	return d.promise();
};

// 계좌비밀번호 체크
o.chkAcctPwd = function(v, id) {
	if(!v || v=='') {
		$svc.get('lpopup').alert('비밀번호를 입력해주세요.').then(function() {
			id && o.setFocus(id);
		});
		return false;
	}
	if(v.length < 4) {
		$svc.get('lpopup').alert('비밀번호 4자리를 입력해주세요!').then(function() {
			id && o.setFocus(id);
		});
		return false;
	}
	if(!o.isNumeric(v)) {
		$svc.get('lpopup').alert('숫자만 입력할 수 있습니다.').then(function() {
			id && o.setFocus(id);
		});
		return false;
	}
	return true;
};

// 넉아웃 관련 함수
// ==========================================================
// 변수 초기화
o.koClear = function(obj) {
	_.each(obj, function(v,k) {
		if(typeof v==='function') _.isString(v()) && v(''), _.isNumber(v()) && v(0), _.isBoolean(v()) && v(false), _.isArray(v()) && v([]);
	});
};

// datePicker 바인딩
o.koDate = function(id, vl, fn) {
	$(document).off('focus.koDate'+id).on('focus.koDate'+id, '#'+id, function(e){
		this.value = this.value.replace(/\./g,'');
		fn && fn();
	});
	$(document).off('blur.koDate'+id).on('blur.koDate'+id, '#'+id, function(e){
		var val = this.value.replace(/\./g,'');
		if(val && val!='' && !o.isDate(val)) {
			this.value = o.formatDate(vl(), 'yyyy.MM.dd');
			return;
		}

		this.value = o.formatDate(val, 'yyyy.MM.dd');
		vl(val);
	});
	$(document).off('keydown.koDate'+id).on('keydown.koDate'+id, '#'+id, function(e){
		var keyCode = e.keyCode || e.which;
		if(keyCode >= 65 && keyCode <= 90)
			return false;
		if(keyCode >= 186 && keyCode <= 222 || keyCode == 110)
			return false;
	});

	return ko.computed({
		read:function() {
			return o.formatDate(vl(), 'yyyy.MM.dd');
		},
		write:function(v) {
			var val = v.replace(/\./g,'');
			o.isDate(val) && vl(val);
		}
	});
};

//년월 case 바인딩  추가
o.koYYYYMM = function(id, vl, fn) {
	$(document).off('focus.koDate'+id).on('focus.koDate'+id, '#'+id, function(e){
		this.value = this.value.replace(/\./g,'');
		fn && fn();
	});
	
	$(document).off('blur.koDate'+id).on('blur.koDate'+id, '#'+id, function(e){
		var val = this.value.replace(/\./g,'');
		if(val && val!='' && !o.isDate(val+'01')) {
			this.value = o.strFormat(vl(), 'xxxx.xx');
			return;
		}

		this.value = o.strFormat(val, 'xxxx.xx');
		vl(val);
	});
	$(document).off('keydown.koDate'+id).on('keydown.koDate'+id, '#'+id, function(e){
		var keyCode = e.keyCode || e.which;
		if(keyCode >= 65 && keyCode <= 90)
			return false;
		if(keyCode >= 186 && keyCode <= 222 || keyCode == 110)
			return false;
	});

	return ko.computed({
		read:function() {
			return o.strFormat(vl(), 'xxxx.xx');
		},
		write:function(v) {
			var val = v.replace(/\./g,'');
			o.isDate(val+'01') && vl(val);
		}
	});
};

// 조회기간 변경
// sf:시작일, ef:종료일, kf:날짜계산, v:계산할값(입력없을 경우 kf에 당일을 넘길것)
o.calcDatePicker = function(sf,ef,kf,v) {
	if(_.isNumber(v)) {
		v<0 && kf && sf(o[kf](ef(), v));	// 음수이면 시작일 변경
		v>0 && kf && ef(o[kf](sf(), v));	// 양수이면 종료일 변경
	}else{
		sf(kf), ef(kf);		// 당일
	}
	return true;
};

// 금액입력 바인딩
o.koMoney = function(id, vl, fn) {
	$(document).off('focus.koMoney'+id).on('focus.koMoney'+id, '#'+id, function(e){
		this.value = this.value==0 ? '' : this.value.replace(/,/g,'');
	});
	$(document).off('blur.koMoney'+id).on('blur.koMoney'+id, '#'+id, function(e){
		this.value = o.addCommas(vl());
		fn && fn(this.value);
	});
	$(document).off('keyup.koMoney'+id).on('keyup.koMoney'+id, '#'+id, function(e){
		fn && fn(this.value);
	});
	$(document).off('keydown.koMoney'+id).on('keydown.koMoney'+id, '#'+id, function(e){
		var keyCode = e.keyCode || e.which;
		if(keyCode >= 65 && keyCode <= 90)
			return false;
		if(keyCode >= 186 && keyCode <= 222 || keyCode == 110) {
			return false;
		}
	});

	return ko.computed({
		read:function() {
			fn && fn(vl().toString());
			return o.addCommas(vl());
		},
		write:function(v) {
			vl(o.strToInt(v||'0'));
		}
	});
};

//이율입력 바인딩
o.koRate = function(id, fn, kr) {
	$('#'+id).focus(function(e) {
		e.target.value = e.target.value==0 ? '' : e.target.value.replace(/,/g,'');
	}).blur(function(e) {
		e.target.value = o.addCommas(fn());
		kr && kr(o.numToKor(e.target.value.replace(/,/g,'')));
	}).keyup(function(e) {
		kr && kr(o.numToKor(e.target.value.replace(/,/g,'')));
	});

	return ko.computed({
		read:function() {
			kr && kr(o.numToKor(fn()));
			return o.addCommas(fn());
		},
		write:function(v) {
			fn(o.strToFloat(v||'0'));
		}
	});
};

// 주식종목코드 팝업
o.showJongmok = function(call) {
	$svc.get('wpopup').open('/siw/etc/code/stockItemSearch/view-popup.do', 'stockItem', {popupCallback:call}, {width:'720px', height:'753px'});
};
// 주소검색 팝업
o.showAddress = function(call) {
	$svc.get('wpopup').open('/siw/etc/post/postDaumSearch/view-popup.do', 'postDaumSearch', {callback:call}, {width:'617px', height:'700px'});
};
// 포커스이동
o.setFocus = function(e) {
	e && $('#'+(typeof e === 'string' ? e : e.target.id)).focus();
};
o.showMsg = function(msg, e) {
	return $svc.get('lpopup').alert(msg).then(function() {e && $('#'+(typeof e === 'string' ? e : e.target.id)).focus()});
};
//계좌-상품구분에 따른 라벨 (AccountUtil getAccountGoods)
//c : 상품갯수, s : 상품번호, g : 업무구분 (0:전체, 1:주식, 2:증권상품, 3:선물, 4:위탁과 WRAP만)
o.getAcctGoodsLabel = function(c,s,g){ 
	var resultArry = new Array();
	var pCnt = o.strToInt(c);
	var pNumArry = new Array();

	//상품을 2자씩 잘라서 입력
	for(var i=0; i < pCnt; i++){
		//상품을 2자씩 잘라서 입력
		pNumArry.push(s.substring(i*2,i*2+2));
	}

	_.each(pNumArry, function(v, k){
		if(v && v.length == 2){
			var subStr = v.substring(0,1);
			var obj = {};
			if(g == 1){
				if( subStr == '0' || subStr == '2'){
					resultArry.push(o.getAcctGoodsLabelTxt(v));
				}
			}else if(g == 2){
				if( subStr == '2' ){
					resultArry.push(o.getAcctGoodsLabelTxt(v));
				}
			}else if(g == 3){
				if( subStr == '1' ){
					resultArry.push(o.getAcctGoodsLabelTxt(v));
				}
			}else if(g == 4){
				if( subStr == '0' || subStr == 'A' || subStr == 'B' ){
					resultArry.push(o.getAcctGoodsLabelTxt(v));
				}
			}else{
				resultArry.push(o.getAcctGoodsLabelTxt(v));
			}
		}
	});
	return resultArry;
}

o.pager = function(vo, cPage, tRow, call, vRow, vPage) {
	if(!_.isArray(vo&&vo()) || !tRow)return;
	var pi = {cPage:cPage||1,tRow:tRow||1,vRow:vRow||5,vPage:vPage||10};
	pi.tPage = parseInt((pi.tRow/pi.vRow),10) + (pi.tRow%pi.vRow?1:0);
	pi.tPage = pi.tPage==0 ? 1 : pi.tPage;
	pi.tBlock = parseInt(Math.ceil((pi.tPage/pi.vPage)),10);
	pi.cBlock = parseInt(Math.ceil((pi.cPage/pi.vPage)),10);
	pi.sPage = ((pi.cBlock - 1) * pi.vPage) + 1;
	pi.ePage = pi.cBlock * pi.vPage;
	pi.nBlock = pi.tBlock==pi.cBlock?pi.tPage:((pi.cBlock+1)*pi.vPage)-pi.vPage+1;
	pi.pBlock = 1==pi.cBlock?1:((pi.cBlock-1)*pi.vPage)-pi.vPage+1;

	vo([]);
	vo.push({value:pi.pBlock, text:'처음으로', click:function(){this.value<pi.cPage && call && call(this.value)}, css:{'btnMove':true, 'first':true}});
	vo.push({value:pi.cPage-1, text:'이전', click:function(){this.value>0 && this.value<pi.cPage && call && call(this.value)}, css:{'btnMove':true, 'prev':true}});
	for(var i = pi.sPage; i<=pi.ePage && i<=pi.tPage; i++){
		vo.push({value:i, click:function(){pi.cPage!=this.value && call && call(this.value)}, text:i, css:{'on':i == pi.cPage}});
	}
	vo.push({value:pi.cPage+1, text:'다음', click:function(){this.value<=pi.tPage && call && call(this.value)}, css:{'btnMove':true, 'next':true}});
	vo.push({value:pi.nBlock, text:'마지막으로', click:function(){pi.cPage<pi.tPage && this.value<=pi.tPage && call && call(this.value)}, css:{'btnMove':true, 'last':true}});
}

o.getAcctGoodsLabelTxt = function(v) {
	var labels = [
		{value:'01',text:'01 위탁'},
		{value:'10',text:'10 코스피선물'},
		{value:'11',text:'11 코스닥선물'},
		{value:'20',text:'20 세금우대종합저축'},
		{value:'21',text:'21 일반증권저축'},
		{value:'22',text:'22 근로자증권저축'},
		{value:'23',text:'23 근로자장기저축'},
		{value:'24',text:'24 근로자주식저축'},
		{value:'25',text:'25 세금우대저축'},
		{value:'26',text:'26 근로자우대저축'},
		{value:'27',text:'27 비과세주식저축'},
		{value:'28',text:'28 장기증권저축'},
		{value:'29',text:'29 생계형저축'},
		{value:'30',text:'30 RP'},
		{value:'42',text:'42 CD'},
		{value:'43',text:'43 CP'},
		{value:'50',text:'50 수익증권'},
		{value:'51',text:'51 해외MF'},
		{value:'52',text:'52 국내MF'},
		{value:'60',text:'60 특정금전신탁'},
		{value:'61',text:'61 퇴직신탁'}
	];

	return _.filter(labels,function(o){return o.value==v});
};

return o;
});

})();
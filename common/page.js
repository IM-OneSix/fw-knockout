/**
 * Common page 관련함수
 * | DATE | NAME | DESC |
 * |------|------|------|
 * | 2016.04.04 | 강환기 | 최초생성 |
 * | 2016.08.23 | H.YANG | Swap 추가 |
 */
(function(){
//------------------------------------------------------------------------------
// BBS IFrame  iframe으로 bbs를 호출 할 경우 필요한 기능
// param fn>frameName 한 화면에서 여러개 iframe을 호출 할 경우 구분하기 위한 변수
// param ty>frameType 각 게시판의 화면을 구분(리스트,뷰,작성 페이지)해 모창의 화면 구성을 바꾸기 위한 변수
// param h>height iframe 높이 변수
// param w>width iframe 넓이 변수
//------------------------------------------------------------------------------
var fc={},events=[];

fc.addEvent=function(fn){
	if(fn)events.push(fn);
};
	
fc.resize=function(frameName,width,height){
	if(frameName&&height){
		$('#'+frameName).attr('height', height);
	}
};

fc.show=function(frameId,is){
	$('#'+frameId)[is?'show':'hide']();
};

fc.showBottom=function(frameId,is){
	$('#'+frameId)[is?'show':'hide']();
};

window.frameCtrl={
	addEvent:fc.addEvent,
	resize:fc.resize,
	show:fc.show,
	showBottom:fc.showBottom
};

//iframe 호출 함수
window.updateIFrame = function(param){
	_.each(events,function(v,k){
		v(param);
	});
};

})();

(function(){
//------------------------------------------------------------------------------
// mobile&tablet
//------------------------------------------------------------------------------
window.checkMobile=function(url){
	var uAgent = navigator.userAgent.toLowerCase();
	if(uAgent.indexOf('iphone')>-1||uAgent.indexOf('ipod')>-1||uAgent.indexOf('ipad')>-1
			||uAgent.indexOf('android')>-1||uAgent.indexOf('blackberry')>-1||uAgent.indexOf('windows ce')>-1
			||uAgent.indexOf('nokia')>-1||uAgent.indexOf('webos')>-1||uAgent.indexOf('opera mini')>-1
			||uAgent.indexOf('sonyericsson')>-1||uAgent.indexOf('opera mobi')>-1||uAgent.indexOf('iemobile')>-1){
		alert("태블릿/모바일에서는 지원하지 않는 환경입니다.");
	}else{
		window.open(url,'_blank');
	}	
}
	
})();

(function(){
//------------------------------------------------------------------------------
// page
//------------------------------------------------------------------------------
window.page=function(){
	var title=document.title,page={},lnk={};

	lnk.main='/siw/main/front/view.do';
	lnk.login='/siw/etc/login/view.do';
	lnk.logout='/siw/logout.do';
	if(window.location.pathname.indexOf('-popup.do')>0){
		lnk.error='/siw/error-popup.do';
		lnk.empty='/siw/empty-popup.do';
	}else{
		lnk.error='/siw/error.do';
		lnk.empty='/siw/empty.do';
	}
	//ib
	lnk.ibLogin = '/siw/ib/expLogin/view.do';
	lnk.ibLogout = '/siw/ib/expLogout/data.do';
	lnk.ibMain = '/siw/ib/main/view.do';
	//tops-club
	lnk.topsLogin = '/siw/tops-club/login/view.do';
	lnk.topsMain = '/siw/tops-club/main/view.do';
	//swap-service
	lnk.swapMain = '/siw/swap-service/main/view.do';
	lnk.swapLogin = '/siw/swap-service/swap_login/view.do';
	lnk.swapLogout = '/siw/swap-service/swap_logout/data.do';
	lnk.swapRegisterId = '/siw/swap-service/swap_register_id/view.do';
	
	//
	_.each(lnk,function(v,k){
		page[k]=function(){window.location.href=v};
	});

	// error
	page.error = function(message){
		var $form=$('<form style="width:1px;height:1px;overflow:hidden;" method="post" action="'+lnk.error+'">'+(message?'<textarea name="message">'+message+'</textarea>':'')+'</form>');
		$('body').append($form);
		setTimeout(function(){$form[0].submit()},100);
	};

	page.link=lnk;

	page.print=function(){
		window.print()
	};

	page.path=function(url){
		if(url && si && si.app.syscode()!='siw' && url.indexOf('/siw/')==0 && _.find(['view.do','view-popup.do','contents.do','contents-popup.do'],function(v){return url.indexOf(v)})){
			return '/'+si.app.syscode()+'/'+url.substring(5);
		}
		return url;
	};

	page.uri=function(url,param){
		var pm=_.map(param,function(v,k){return [k,v].join('=')}).join('&');
		return pm?[url,pm].join('?'):url;
	};

	page.go=function(url,param){
		url=page.path(url);
		location.href=page.uri(url,param);
	};

	page.reload=function(){
		location.reload();
	};

	page.goOpener=function(url,param){
		url=page.path(url);
		opener.location.href=page.uri(url,param);
		page.close();
	};

	page.open=function(url,name,param,option) {
		url=page.path(url);
		if(si&&si.util.uri){
			url=si.util.uri(url,true);
		}
		window.popupParam = window.popupParam||{};
		window.popupParam[name] = param;
		option=_.extend({width:'667',height:'650',left:'0',top:'0',scrollbars:'yes',resizable:'yes',menubar:'no',location:'no',status:'no',toolbar:'no'},option);
		option.left = (screen.availWidth - option.width) / 2;
		option.top = (screen.availHeight - option.height) / 2;
		window.open(url,name,_.map(option, function(v,k){return k+'='+v;}).join(','));
	};

	page.getParam=function(){
		return(window.opener&&window.opener.popupParam&&window.opener.popupParam[window.name])||{};
	};

	page.close=function(){
		window.open('about:blank','_self').close()
	};

	page.bbs=function(){
		return {path:path,src:src,go:go};
		function path(url){return location.protocol+'//'+[si.data.bbsDomain(), url].join('/').replace('//','/')}
		function src(id,url){return url&&$('#'+id).attr('src',path(url)),$('#'+id).attr('src')}
		function go(url,param){location.href=location.protocol+'//'+location.host+page.uri(page.path(url),param)}
	}({});

	page.title=function(){
		// title : page - tab | site
		// EX    : DC/IRP 상품 - 모델포트폴리오 | 신한금융투자

		function getTitle(){
			var t=['신한금융투자','',''];
			var tt=document.title;
			if(tt.indexOf(' | ')>0){
				tt=tt.split(' | ')[0];
				t[1]=tt;
				if(tt.indexOf(' - ')>0){
					tt=tt.split(' - ');
					t[1]=tt[0];
					t[2]=tt[1];
				}
			}
			return t;
		}

		function setTitle(t){
			var tt=t[0];
			if(t[1]){
				tt=t[1];
				if(t[2]){
					tt=tt+' - '+t[2];
				}
				tt=tt+' | '+t[0];
			}
			document.title=tt;
		}

		function setTabname(n){
			var t=getTitle();
			t[2]=n;
			setTitle(t);
			log('setTabname:',t.join('#'));
		}

		function setPagename(n){
			var t=getTitle();
			t[1]=n;
			setTitle(t);
			log('setPagename:',t.join('#'));
		}

		return {
			setTabname:setTabname,
			setPagename:setPagename
		};
	}();

	return page;
}();

})();

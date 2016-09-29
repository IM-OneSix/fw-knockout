/**
 * Common
 * | DATE | NAME | DESC |
 * |------|------|------|
 * | 2016.04.04 | 강환기 | 최초생성 |
 * | 2016.08.23 | H.YANG | Swap추가 |
 */
(function (){
// function
//------------------------------------------------------------------------------
var sidata=function(o){return window['SIDATA']&&_.each(['date','name','dispname','login','time','ib','bbsDomain','menurootCode', 'isNewAlram', 'swap'],function(v,k){o[v]=window['SIDATA'][k]}),o}({});
si.data={
	date:function(){return sidata.date},
	name:function(){return sidata.name},
	dispname:function(){return sidata.dispname},
	login:function(){return sidata.login},
	time:function(){return sidata.time},
	bbsDomain:function(){return sidata.bbsDomain},
	menurootCode:function(){return sidata.menurootCode},
	isLogin:function(){return !!sidata.name},
	isIBLogin:function(){return !!sidata.ib},
	isNewAlram:function(){return !!sidata.isNewAlram},
	isSwapLogin:function(){return !!sidata.swap}
};
si.getParam=function(){return{}};
si.setParam=function(pm){si.setParam=function(){},si.getParam=function(){return pm||{}}};
si.getGoodiAuth=function(){return true};
si.setGoodiAuth=function(){si.getGoodiAuth=function(){return false}};
si.getCertAuth=function(){return true};
si.setCertAuth=function(){si.getCertAuth=function(){return false}};
si.router=function(other,data){
	si.config(function($cfg){
		var r=$cfg.get('router');r.other(other),_.each(data,function(v,k){r.when(k,{controller:v.name,template:v.html})});
	});
};
// controller
//------------------------------------------------------------------------------
si.controller('layerAlert',function($vo,$svc){var lpopup=$svc.get('lpopup');$vo.message=lpopup.getParam($vo).message,$vo.close=function(){lpopup.close($vo)};});
si.controller('layerConfirm',function($vo,$svc){var lpopup=$svc.get('lpopup');$vo.message=lpopup.getParam($vo).message,$vo.yes=function(){lpopup.close($vo,true)},$vo.no=function(){lpopup.close($vo,false)};});
si.controller('layerTip',function($vo,$svc){var lpopup=$svc.get('lpopup');$vo.info=ko.observableArray([]);$vo.close=function(){lpopup.close($vo)},$vo.yes=function(){lpopup.close($vo,true)},$vo.no=function(){lpopup.close($vo,false)};$vo.info(lpopup.getParam($vo)||[]);});
si.controller('layerLoginAuthPopup',function($vo,$svc){});
si.controller('layerLoginCertPopup',function($vo,$svc){
	//공인인증 로그인
	$vo.goCertLogin = function() {
		$svc.get('http').post('/siw/etc/login/logout/data.do', {}).then(function() {
			$svc.get('location').go('/siw/etc/login/view.do', {returnUrl:document.location.pathname});
		});
	};
	//이전화면 이동
	$vo.goPrevPage = function() {
		$svc.get('location').back();
	}
});
si.controller('layerZoomTipPopup',function($vo,$svc){$vo.close=function(){$svc.get('lpopup').close($vo)}});
si.controller('layerLogout',function($vo,$svc){});
si.controller('layerAutoLogout',function($vo,$svc){});
// handler
//------------------------------------------------------------------------------
//게시판 Iframe Path
si.handler('BBSPath',function($svc){
	return{init:function(){},update:update};
	function update(element,valueAccessor,allBindings,viewModel,bindingContext){
		var v=valueAccessor();
		if(typeof v==='function')v=v.call();
		$(element).attr('src',page.bbs.path(v));
	}
});
//파일다운로드
si.handler('Download',function($svc){
	return{init:function(){},update:update};
	function update(element,valueAccessor,allBindings,viewModel,bindingContext){
		$(element).off('click..SIE#Download').on('click.SIE#Download',function(e){
			var v=valueAccessor();
			if(typeof v==='function')v.call();
		});
	}
});
//숫자(세자리 ,) 포멧으로 변경 처리)
si.handler('NumberFormat',function($svc){
	var util=$svc.get('util');
	return{init:function(){},update:update};
	function update(element,valueAccessor,allBindings,viewModel,bindingContext){
		var v=valueAccessor(),m='';
		if(typeof v==='function')v=v.call();
		v=(v!=0?v||'':0)+'';
		if(v.charAt(0)=='-')m='-',v=v.substring(1);
		if(v && util.isNumeric(v.replace('.', '')))v=util.addCommas(v);
		$(element).text(m+v);
	}
});
si.handler('NumberFormat1',function($svc){
	var util=$svc.get('util');
	return{init:function(){},update:update};
	function update(element,valueAccessor,allBindings,viewModel,bindingContext){
		var v=valueAccessor(),m='';
		if(typeof v==='function')v=v.call();
		if(v==''){
			$(element).text('-');
		}else{
			v=(v!=0?v||'':0)+'';
			if(v.charAt(0)=='-')m='-',v=v.substring(1);
			if(v && util.isNumeric(v.replace('.', '')))v=util.addCommas(v);
			$(element).text(m+v);
		}
	}
});
//숫자-0도 소수점처리(세자리 ,) 포멧으로 변경 처리)
si.handler('RateFormat',function($svc){
	var util=$svc.get('util');
	return{init:function(){},update:update};
	function update(element,valueAccessor,allBindings,viewModel,bindingContext){
		var v=valueAccessor(),m='';
		if(typeof v==='function')v=v.call();
//		v=(v!=0?v||'':0)+'';
//		if(v.charAt(0)=='-')m='-',v=v.substring(1);
		if(v && util.isNumeric(v.replace('.', '')))v=util.addCommas(v);
		$(element).text(m+v);
	}
});
//data 포멧(yyyy-MM-dd)
si.handler('DateFormat',function($svc){
	var util=$svc.get('util');
	return{init:function(){},update:update};
	function update(element,valueAccessor,allBindings,viewModel,bindingContext){
		var v=valueAccessor();
		if(typeof v==='function')v=v.call();
		v=(v||'')+'';
		if(v && util.isDate(v))v=util.formatDate(v,'yyyy.MM.dd');
		$(element).text(v);
	}
});
//계좌번호 형식(xxx-xx-xxxxxx)
si.handler('AccountFormat',function($svc){
	var util=$svc.get('util');
	return{init:function(){},update:update};
	function update(element,valueAccessor,allBindings,viewModel,bindingContext){
		var v=valueAccessor();
		if(typeof v==='function')v=v.call();
		v=(v||'')+'';
		if(v)v=util.strDataType('account',v);
		$(element).text(v);
	}
});
//카드번호 형식 XXXX-XXXX-XXXX-XXXX
si.handler('CardFormat',function($svc){
	var util=$svc.get('util');
	return{init:function(){},update:update};
	function update(element,valueAccessor,allBindings,viewModel,bindingContext){
		var v=valueAccessor();
		if(typeof v==='function') v=v.call();
		v=(v||'')+'';
		if(v && v.length==16) v=util.strDataType('card',v);
		$(element).text(v);
	}
});
//undefined text
si.handler('ufdText',function($svc){
	return{init:function(){},update:update};
	function update(element,valueAccessor,allBindings,viewModel,bindingContext){
		var v=valueAccessor();
		if(typeof v==='function') v=v.call();
		if(_.isNumber(v)) v=v+'';
		v=(v||'')+'';
		if(v)$(element).text(v);
		else $(element).html('&nbsp;');
	}
});
//time 포멧(hh:mi:ss)
si.handler('TimeFormat',function($svc){
	var util=$svc.get('util');
	return{init:function(){},update:update};
	function update(element,valueAccessor,allBindings,viewModel,bindingContext){
		var v=valueAccessor();
		if(typeof v==='function') v=v.call();
		v=(v||'')+'';
		if(v && util.isTime(v)) v=util.strDataType("time",v);
		$(element).text(v);
	}
});
//에디트박스 엔터
si.handler('Enter',function($svc){
	return{init:function(){},update:update};
	function update(element,valueAccessor,allBindings,viewModel,bindingContext){
		$(element).off('keydown.SIE#Enter').on('keydown.SIE#Enter',function(e){
			var v=valueAccessor();
			var keyCode = e.keyCode || e.which;
			if(keyCode==13 && typeof v==='function'){
				$(e.target).blur();
				setTimeout(function(){
					v=v.call(bindingContext, bindingContext['$data'], e);
					$(e.target).focus();
				}, 300);
			}
		});
	}
});
//password bind
si.handler('Pw',function($svc){
	return{init:function(){},update:update};
	function update(element,valueAccessor,allBindings,viewModel,bindingContext){
		$(element).off('keydown.SIE#Pw keyup.SIE#Pw').on('keydown.SIE#Pw keyup.SIE#Pw',function(e){
			var v=valueAccessor();
			var keyCode = e.keyCode || e.which;
			if(typeof v==='function'){
				v($(e.target).val());
			}
		});
	}
});

//provider
//------------------------------------------------------------------------------
si.provider('ajax',function(){
return{$this:$this,html:html,get:get,post:post,form:form};
function $this(){
	return{html:html,get:get,post:post,form:form};
}
function html(url,sync,cache){
	var d=$.Deferred();
	if(url)$.ajax({
			async:!sync,type:cache?'get':'post',contentType:'text/html',url:si.util.uri(url,cache),
			success:d.resolve,error:function(){d.resolve(null)}
		});
	else d.resolve(null);
	return d.promise();
}
function get(url,pm,sync,cache){
	var d=$.Deferred();
	if(url)$.ajax({
			async:!sync,type:'get',contentType:'application/json',url:si.util.uri(url,cache),data:serialize(pm),
			success:function(data){d.resolve({data:data||{},status:200})},error:function(r){d.resolve({status:r.status==200?500:r.status})}
		});
	else d.resolve(null);
	return d.promise();
}
function post(url,pm,sync){
	var d=$.Deferred();
	if(url&&pm)$.ajax({
			async:!sync,type:'post',contentType:'application/json',url:si.util.uri(url),data:JSON.stringify(pm),
			success:function(data){d.resolve({data:data||{},status:200})},error:function(r){d.resolve({status:r.status==200?500:r.status,data:r.responseText})}
		});
	else d.resolve(null);
	return d.promise();
}
function form(url,pm,sync){
	var d=$.Deferred();
	if(url&&pm)$.ajax({
			async:!sync,type:'post',contentType:'application/x-www-form-urlencoded;charset=utf-8',url:si.util.uri(url),data:serialize(pm),
			success:function(data){d.resolve({data:data||{},status:200})},error:function(r){d.resolve({status:r.status==200?500:r.status})}
		});
	else d.resolve(null);
	return d.promise();
}
function serialize(data){return _.map(data,function(v,k){return [k,'=',v].join('');}).join('&')}
});

si.provider('wpopup',function(){
return{$this:$this,open:open,close:close,getParam:getParam};
function $this(){return{open:open,close:close,getParam:getParam}}
function open(url,name,param,option,call){
	call&&_.each(call,function(v,k){param[k]=v});
	page.open(url,name,param,option);
}
function close(){page.close()}
function getParam(){return page.getParam()}
});

si.provider('menu',function(){
var mc={},cur={},gnb={},bar={},tree=[];
return{$this:$this,init:init};
function $this($svc){
	return{
		menucode:menucode,
		menuname:menuname,
		menuurl:menuurl,
		currentMenucode:currentMenucode,
		currentMenuname:currentMenuname,
		currentMenuurl:currentMenuurl
	};
	function menucode(url){return code(url)}
	function menuname(menucode){return(mc[menucode]||[])[5]}
	function menuurl(menucode){return(mc[menucode]||[])[6]}
	function currentMenucode(){return cur.code}
	function currentMenuname(){return menuname(cur.code)}
	function currentMenuurl(){return menuurl(cur.code)}
}
function init(t,m,l,c){
	_.each(m.split('^'),function(v){
		mc[(v=v.split('|'))[0]]=v;
	}),
	cur=function(o){
		o.url=$('[data-page-menu-url]').attr('data-page-menu-url'),
		o.root=mc[si.data.menurootCode()],
		o.code=code(o.url),
		o.top=o.code&&mc[o.code.substring(0,3)+'00000'];
		return o;
	}({});
	if(l['header']){
		makeHeader(l,t,c);
	}
	if(si.data.menurootCode()=='10000000'){
		l['notice']&&makeNotice(l);
		l['search']&&makeSearch(l);
		l['sitemap']&&makeSitemap(l);
	}
	if(l['bar']&&cur.top){
		makeBar(l);
	}
	if(si.data.menurootCode()=='10000000'&&cur.top&&cur.top[1]=='10000000'){
		if(l['lnb']&&si.browser[1]>9&&si.browser[2]>9){
			makeLnb(l);
		}
	}
	if(l['footer']){
		makeFooter(l);
	}

	$('a[data-site-link-code]').each(function(){
		var lc=$(this).attr('data-site-link-code');
		$(this).attr('href',mc[lc]&&mc[lc][6]||'#');
	});

	if(mc[cur.code] && mc[cur.code][5] && document.title.indexOf('|')<0){
		page.title.setPagename(mc[cur.code][5]);
	}
}
function code(url){return(_.find(mc,function(v){return v[6]==url})||[])[0]}
function makeHeader(l,t,c){
	$('#header').html(l['header']);
	$('#header div.headTop').html(l['top'+cur.root[0]]);

	if(si.data.menurootCode()=='10000000'){
		
		$('#gnb>ul.gnbList').html(_.map(t,function(v,k){
			k='gnb0'+(k+1),gnb[v]='<p class="gnbTit">'+mc[v][5]+'</p><a'+(mc[v][4]=='Y'?' target="_blank" title="새창열림"':'')+' href="'+mc[v][6]+'" class="btnM btnIco icoArr">한눈에 보기</a>'+l[k]+gnb01(v);
			return '<li class="'+k+'" data-menu-code="'+v+'"><a href="#">'+mc[v][5]+'</a><div class="gnbMenu"></div></li>';
		}));

		$(document).on('click.SIE#gnb','#gnb>ul.gnbList>li>a',function(e){
			var $t=$(this);
			$('#gnb>ul.gnbList>li>div.gnbMenu').each(function(){
				var $m=$(this);
				$m.data('jsp')&&$m.data('jsp').destroy();
				$m.html('');
			});
			$t.next().html(gnb[$t.parent().attr('data-menu-code')]),setTimeout(function(){shMenu.gnb1depthAni($t)},10);
		});
	}else{
		$('#gnb').addClass(c);
		$('#header div.gnbUtil').html('<a href="'+cur.root[6]+'" class="home">'+cur.root[5]+' 메인</a>');
		$('#gnb>ul.gnbList').html(_.map(t,function(v,k){return '<li class="gnb0'+(k+1)+'" data-menu-code="'+v+'"><a href="#">'+mc[v][5]+'</a></li>'}));

		$('#gnb').append('<div class="gnbMenu"><ul class="gnbDep1"></ul><button type="button" class="close">닫기</button></div>');
		$('#gnb>div.gnbMenu>ul.gnbDep1').html(_.map(t,function(v,k){return '<li class="gnbSub gnbDep0'+(k+1)+'"><p class="hidden">'+mc[v][5]+'</p>'+gnb02(v,true)+'</li>'}));

		$(document).on('click.SIE#gnb','#gnb>ul.gnbList>li>a',function(e){shMenu.gnb1depthAni($(this))});
	}
}
function makeNotice(l){$('#header div.gnbUtil').append(l['notice'])}
function makeSearch(l){$('#header div.gnbUtil').append(l['search'])}
function makeSitemap(l){
	$('#header div.gnbUtil').append(l['sitemap']);
	$(document).on('click.SIE#fSitemap','#footer .footBtm .list a.sitemap',function(){$(window).scrollTop(0),openSitemap()});
	$(document).on('click.SIE#hSitemap','.gnbUtil>.totalMenu>button',function(){openSitemap()});
	$(document).on('click.SIE#iSitemap','ul.totalDep1>li>a.tit',function(){
		var $t=$(this).parent();
		var sm=$t.attr('data-sm');

		$('ul.totalDep1').attr('data-sm-code',sm);

		if(!$t.find('div.dep2Inner').length){
			$t.append(sitemap02(sm));
		}

		setTimeout(function(){
			shMenu.allMenuViewDepthOpen();
			setTimeout(function(){
				var cd=$('ul.totalDep1').attr('data-sm-code');
				sm==cd && $('ul.totalDep1>li>div.dep2Inner').each(function(){
					if($(this).parent().attr('data-sm')!=cd)$(this).remove();
				});
			},350);
		},150);
	});
}
function makeBar(l){
	var b=bar01(cur.code);
	if(!b)return;

	$('#container').before(l['bar']);
	$('#sGnb>div.inner>ul.sGnbList').html(b);
	$('#sGnb a.home').attr('href',cur.root[6]);

	$(document).on('click.SIE#bar','#sGnb>div.inner>ul.sGnbList>li>a',function(e){
		var p=$(this).parent();
		var s=p.attr('data-bar').split('#');
		p.parent().find('>li').each(function(){
			var bt=$(this);
			var bs=bt.attr('data-bar').split('#')[0];
			if(bs!=s[0]){
				bt.attr('data-bar',bs);
				bt.find('ul.sgnbDep2').remove();
			}
		});
		if(s[1]){
			s[1]='';
			p.find('ul.sgnbDep2').remove();
		}else{
			s[1]='o';
			p.append(bar[s[0]]);
			p.find('ul.sgnbDep2').show();
		}
		p.attr('data-bar',s.join('#'));
	});
	$(document).on('mouseenter.SIE#bar focus.SIE#bar','#sGnb>div.inner>ul.sGnbList ul>li.subON>a',function(e){
		var p=$(this).parent();
		var s=p.attr('data-bar');
		var d=p.parent().attr('data-bar-depth')*1+1;
		p.parent().find('>li>ul.sgnbDep'+d).remove();
		p.append(bar02(s,tree[d],d));
		p.find('ul.sgnbDep'+d).show();
	});
}
function makeLnb(l){
	$('#wrapper').before(l['lnb']);
	$('#lnb>p.logo>a').attr('href',cur.root[6]);
	$('#lnb>h2.lnbTit').html(cur.top[5]);
	$('#lnb>ul.lnbList').html(lnb01(cur.top[0]));
}
function makeFooter(l){$('#footer').html(l['footer'])}
function gnb01(pc){return '<ul class="gnbDep1">'+childrenBox(pc,function(v,k){return k=k+1,'<li class="gnbSub gnbDep'+(k>9?'':'0')+k+'"><div class="inner"><p class="tit">'+v[5]+'</p>'+gnb02(v[0])+'</div></li>'})+'</ul><button type="button" class="close">닫기</button>'}
function gnb02(pc,nc){
	return childrenBox(pc,function(v){
		var s=[],c=gnb03(v[0]);
		v[7]=='Y'&&s.push('login');
		(!nc)&&c&&s.push('subON');
		return '<li'+(s.length?' class="'+s.join(' ')+'"':'')+'>'+mkA(v)+c+'</li>';
	},'<ul class="gnbDep2">','</ul>');
}
function gnb03(pc){return childrenBox(pc,function(v){return mkA(v,v[7]=='Y'&&'login')},'<div class="gnbDep3">','</div>')}
function lnb01(pc){
	return '<li><a href="'+mc[pc][6]+'">한눈에 보기</a></li>'+childrenBox(pc,function(v){
		var c=lnb02(v[0]);
		return(c?'<li class="subON">':'<li>')+mkA(v)+c+'</li>';
	});
}
function lnb02(pc){
	return childrenBox(pc,function(v){
		var c=lnb03(v[0]);
		return(c?'<li class="subON">':'<li>')+mkA(v)+c+'</li>';
	},'<ul class="lnbDep2">','</ul>')
}
function lnb03(pc){return childrenBox(pc,function(v){return '<li>'+mkA(v)+'</li>'},'<ul class="lnbDep3">','</ul>')}
function bar01(c){
	var b=[],pc=mc[c][1];
	while(pc!='#'){
		if(c==pc){
			alert('메뉴등록이 잘못되었습니다.!!(메뉴코드 부모코드 동일)');
			return '';
		}
		bar[c]=bar02(pc,c,2);
		tree.push(c);
		b.push('<li data-bar="'+c+'#"><a href="#">'+mc[c][5]+'</a></li>');
		c=pc,pc=mc[c][1];
	}
	tree.push('10000000');
	tree.push('#');
	tree=_.chain(tree).reverse().value();
	return _.chain(b).reverse().value().join('');
}
function bar02(pc,c,d){
	return childrenBox(pc,function(v){
		var css=[];
		hasChildren(v[0])&&css.push('subON');
		v[0]==c&&css.push('recent');
		return '<li'+(css.length?' class="'+css.join(' ')+'"':'')+' data-bar="'+v[0]+'">'+mkA(v)+'</li>';
	},'<ul data-bar-depth="'+d+'" class="sgnbDep'+d+'">','</ul>');
}
function openSitemap(){
	if(!$('ul.totalDep1>li').length){
		var i=0,s=[];
		children('10000000',function(v){s.push(sitemap01(v[0],++i,1))});
		s.push(sitemap01('20000000',++i,2));
		$('ul.totalDep1').html(s);
	}
	setTimeout(function(){
		$('ul.totalDep1>li>div.dep2Inner').each(function(){$(this).remove()});
		var t = $('ul.totalDep1>li[data-sm]').first();
		$('ul.totalDep1').attr('data-sm-code',t.attr('data-sm'));
		t.append(sitemap02(t.attr('data-sm')));
		t.addClass('totalON');
		t.find('div.dep2Inner').attr('style','display:block;');
		shMenu.allMenuViewOpen();
	},50);
}
function sitemap01(c,i,m){return '<li data-sm="'+c+'" class="menu'+(i<10?'0'+i:i)+'"><a href="#" class="tit"><span>'+mc[c][5]+'</span></a>'+(m==1?'<a href="'+mc[c][6]+'" class="btnM">한눈에보기</a>':'')+'</li>'}
function sitemap02(pc){return childrenBox(pc,function(v){return '<li>'+mkA(v)+sitemap03(v[0])+'</li>'},'<div class="dep2Inner"><ul class="totalDep2">','</ul></div>')}
function sitemap03(pc){return childrenBox(pc,function(v){return '<li>'+mkA(v)+sitemap04(v[0])+'</li>'},'<ul class="totalDep3">','</ul>')}
function sitemap04(pc){return childrenBox(pc,function(v){return '<li>'+mkA(v)+'</li>'},'<ul class="totalDep4">','</ul>')}

function hasChildren(p){return _.find(mc,function(v){return v[1]==p})}
function children(p,fn){return _.map(_.sortBy(_.filter(mc,function(v){return v[1]==p}),function(v){return v[2]*1}),fn)}
function childrenBox(p,f,b,a){return function(n){return n?(b||'')+n+(a||''):''}(children(p,f).join(''))}
function mkA(v,css){
	var lk=' href="'+v[6]+'"',o=v[4].substring(1).split(','),a=['<a'];
	if(css) a.push(' class="'+css+'"');
	if(v[4]!='N') a.push(' target="_blank" title="새창열림"');
	if(v[4][0]=='P'&&v[6]!='#') lk=' href="#" onClick="page.open(\''+v[6]+'\',\'popup'+v[0]+'\',{}'+(o[0]&&o[1]?',{width:'+o[0]+',height:'+o[1]+'}':'')+')"';
	a.push(lk+'>'+v[5]+'</a>');
	return a.join('');
}
});

si.provider('uiHelper',function(){
var _update=[];
return{addUpdateUI:addUpdateUI,updateUI:updateUI,$this:$this};
function addUpdateUI(updateUI){updateUI&&_update.push(updateUI)}
function updateUI(element){_.each(_update,function(v){v(element)})}
function $this(){return{updateUI:updateUI}}
});

si.provider('location',function(){
return{$this:$this,go:go,back:back,reload:reload};
function $this($svc){return{go:go,back:back,reload:reload}}
function go(url,param){page.go(url,param)}
function back(){history.back()}
function reload(){page.reload()}
});

si.provider('router',function(){
var _defaultPath='',_route={},_data={},_beforeLoadController=function(){};
return {when:when,other:other,setBeforeLoadController:setBeforeLoadController,$this:$this};
function when(path,info){_route[path]=info}
function other(path){_defaultPath=path}
function setBeforeLoadController(beforeLoadController){beforeLoadController && (_beforeLoadController = beforeLoadController)}
function $this($svc){
	var log = $svc.logger('router');
	var ajax = $svc.get('ajax');
	var uiHelper = $svc.get('uiHelper');
	return {start:start,move:move,getParam:getParam,setParam:setParam,clearParam:clearParam};

	function start(){move(_defaultPath)}

	function move(path){
		var data={path:path,controller:_route[path].controller,template:_route[path].template,hash:location.hash,history:history};
		log('move('+path+') param:['+_data+']');
		location.hash='!';
		open(data);
	}

	function getParam(key,vo){
		if(vo){
			var vl=_data[key] && _data[key]['$vo.vl'];
			if(vl){
				_.each(vl,function(v,k){vo[k]&&vo[k](vl[k])});
				_data[key]['$vo.vl']={};
			}
		}
		return _data[key];
	}

	function setParam(key,value,vo){
		_data[key]=value;
		if(vo){
			var vl={};
			_.each(vo,function(v,k){vl[k]=v()});
			_data[key]['$vo.vl']=vl;
		}
	}

	function clearParam(){_data={}}
	function open(info){
		ajax.html(info.template,false,true).then(function(data){
			if(data){
				var $o=$('[data-view]'), $n=$(data);

				$svc.$bind(info.controller,$n);

				$n.insertAfter($o);

				$svc.$destroy($o.attr('id'));
				$svc.$controller(info.controller,function(element){
					uiHelper.updateUI(element);
					_beforeLoadController(element);
				});
			}else{
				var msg=['[ERROR:404]','router('+info.controller+') 화면템플릿 파일이 존재하지 않습니다.','FILENAME:'+info.template].join('\r\n');
				si.app.st()=='L' && alert(msg);
				page.error(msg);
			}
		});
	}
}
});

si.provider('uiLoading',function(){
var _m='로딩중',_c=0;
return {message:message,$this:$this};
function message(m){_m=m}
function $this(){
	if(!$('#ui-loading').length){
		$('body').append('<div id="ui-loading" class="ui-loading" style="display:none"><div class="dimmed" style="display:block;z-index:99999;"></div><div class="ui-loading-m" style="z-index:99999;">'+_m+'</div></div>');
	}
	return {on:on,off:off,clear:clear};
	function on(){
		_c++;
		setTimeout(function(){_c&&$('#ui-loading').css('display','block')},1);
	}
	function off(){
		_c--;
		if(_c<1){
			_c=0;
			$('#ui-loading').css('display','none');
		}
	}
	function clear(){
		_c=0;
		off();
	}
}
});

si.provider('lpopup',function(){
var lp=layerPopup(),_beforeLoadController=function(){};
return {setBeforeLoadController:setBeforeLoadController,$this:$this};

function setBeforeLoadController(beforeLoadController){beforeLoadController && (_beforeLoadController=beforeLoadController)}
function $this($svc){
	var log = $svc.logger('lpopup');
	var ajax = $svc.get('ajax');
	var uiHelper = $svc.get('uiHelper');

	return {
		open:open,
		close:close,
		getParam:getParam,
		alert:alert,
		confirm:confirm,
		tip:tip
	};

	function open(name,tpl,param,noUpdateUI){
		var d = $.Deferred();
		if(lp.get(name)){
			log(name+' 레이어팝업 중복 호출!');
			d.reject();
			return d.promise();
		}

		param=param||{}
		lp.set(name,{d:d,param:_.clone(param)});

		ajax.html(tpl,false,true).then(function(data){
			if(data){
				lp.set(name,{d:d,param:_.clone(param)});

				var $el=$(data);

				$svc.$bind(name,$el);

				$('#layer .dimmed').remove();
				$('#layer').append('<div class="dimmed" style="display:block;z-index:9999;"></div>');
				$('#layer').append($el);

				$svc.$controller(name,function(element){
					if(!noUpdateUI) {
						uiHelper.updateUI(element);
					}
					_beforeLoadController(element);
				});

				$.openDimPop(name);
			}else{
				var msg=['[ERROR:404]','lpopup('+name+')화면템플릿 파일이 존재하지 않습니다.','FILENAME:'+tpl].join('\r\n');
				si.app.st()=='L' && alert(msg);
				page.error(msg);
			}
		});

		return d.promise();
	}

	function getParam($vo){return lp.get($vo.$name()).param}

	function close($vo,data) {
		var d = lp.get($vo.$name()).d;
		var p = getParam($vo).parent||{};

		p.id && $('#'+p.id).focus();
		lp.remove($vo.$name());
		$svc.$destroy($vo.$name());

		$('#layer .dimmed').remove();
		$('#layer .dimmed').hide();
		lp.size()>0 && $('<div class="dimmed" style="display:block;z-index:9999;"></div>').insertBefore($('#layer >div').last());

		$('#container .dimmed').hide();
		
		d.resolve(data);
	}

	function alert(m,e){return open('layerAlert','/siw/common/biz/common/lypop-alert.html',{message:m}, true).then(function() {e && $('#'+(typeof e === 'string' ? e : e.target.id)).focus()})}
	function confirm(m){return open('layerConfirm','/siw/common/biz/common/lypop-confirm.html',{message:m}, true)}
	function tip(url,prm,e){
		return open('layerTip',url,prm||[],true).then(function(v) {
			e && $('#'+(typeof e === 'string' ? e : e.target.id)).focus();
			return v;
		});
	}
}

function layerPopup(){
	var LPINF={};
	return {get:get,set:set,remove:remove,size:size};
	function get(name){return LPINF[name]}
	function set(name,data){LPINF[name]=data}
	function remove(name){delete LPINF[name]}
	function size(){return _.size(LPINF)}
}
});

si.provider('rootBinder',function(){
var _service=[];
return{addService:addService,$this:$this};
function addService(name){name && _service.push(name)}
function names(){return _service}
function $this($svc){return{names:names}}
});

//------------------------------------------------------------------------------
//service
//------------------------------------------------------------------------------
si.service('predic',function($svc){
	var log=$svc.logger('predic'),ing=false,info=[],delay=150,sender=null,listener=function(){};
	return {
		run:run,
		setDelay:setDelay,
		setSender:setSender,
		setResultListener:setResultListener
	};
	function run(param){
		log('run',param);
		pushInfo(param||'');
		if(!ing){
			ing=true;
			setTimeout(function(){
				var pm=popInfo();
				if(pm!='' && sender){
					sender(pm).then(function(data){
						data.param=pm;
						listener(data);
						if(info.length) run('');
						ing=false;
					});
				}else{
					listener({param:pm});
					ing=false;
				}
			}, delay);
		}
	}
	function setDelay(d){d&&(delay=d)}
	function setSender(fn){sender=fn}
	function setResultListener(fn){fn&&(listener=fn)}
	function pushInfo(param){info.push(param)}
	function popInfo(){var o=info.pop();return info=[],o}
});


si.service('autoSession',function($svc){
var log=$svc.logger('autoSession');
return{start:start};
function start(){if(si.data.isLogin())watch(si.data.time()*1000)}
function watch(w){w=parseInt(w/2); (function(f){setTimeout(function(){f(w)},w)})(w>1000?watch:end)}
function end(){
	$svc.get('ajax').post('/siw/test-session.do',{}).then(function(r){
		var data=r&&r.status==200&&r.data&&r.data[0]&&r.data;
		if(data){
			if(si.data.login()==data[1]){
				var ut=$svc.get('util');
				var cdt=ut.strToDate(si.data.date());
				var ndt=ut.strToDate(data[0]);
				var tm=Math.abs(ndt.getTime()-cdt.getTime());
				if(2000-tm<=0){
					sidata.date=data[0];watch(tm);
				}else logout('layer');
			}else logout('main');
		}else logout('layer');
	});
}
function logout(type){
	$svc.get('ajax').html(page.link.logout,true,true);
	if(si.app.filetype().indexOf('-popup')<0){
		if(type='layer')$svc.get('lpopup').open('layerAutoLogout','/siw/common/biz/common/lypop-autoLogout.html');
		else page.main();
	}
}
});

si.service('combo',function($svc){
return {
	init:init,
	account:account,
	year:year,
	month:month,
	day:day
};
function init(id,idx,opt,fnc){
	var _opt=[],_idx=idx||0,_fnc=fnc||function(){};
	opt=opt||[];
	load();
	return {
		load:load,
		at:at,
		val:val,
		text:text,
		disabled:disabled,
		focus:focus,
		option:option,
		get:get
	};

	function load(index,option,func){
		$('#'+id).html();

		_idx=index==undefined?_idx:index;
		_opt=_.map(opt=option||opt,function(v,k){return{value:v.value,text:v.text}});
		_fnc=func||_fnc;

		$('#'+id).html($('<select>',{title:$('#'+id).attr('title'), id:id+'-combo'}));
		$('#'+id+' select').each(function(){
			var $sb=$(this);
			if(!_opt.length)$sb.find('option').each(function(){_opt.push({value:$(this).val(),text:$(this).html()})});

			$sb.find('option').remove();
			$sb.html(_.map(_opt,function(v,k){return $('<option>',{value:v.value,text:v.text,selected:k==_idx?true:false})}));

			$(document).off('click.CB#'+id).on('click.CB#'+id,'#'+id+'>div.select>div ul>li>a',function(e){
				_idx=inst().getIndexSB();
				_fnc(e,{index:_idx,value:val(),text:text()});
			});
			$(document).off('keydown.CB#'+id).on('keydown.CB#'+id,'#'+id+'>div.select>a.tit',function(e){
				if ((e.keyCode >= 33 && e.keyCode <= 40) || e.keyCode == 13) {
					_idx=inst().getIndexSB();
					_fnc(e,{index:_idx,value:val(),text:text()});
				}
			});

			var $p=$sb.parent();
			var $d=$p.children('div.select');

			$sb.removeData();
			$d.removeData();
			$d.remove();
			(new SelectBox($sb,{height:250,zindex:100,direction:$p.hasClass('selectBtm')?'up':'down'})).initSB();
			disabled(false);
			setTimeout(function(){$('#'+id+'>div.select>a.tit').attr('id', id+'-combobox')},200);
		});
	}
	function at(a){return a!=null&&setIndex(a),_idx}
	function val(a){return a!=null&&_.find(_opt,function(v,k){return v.value==a&&(setIndex(k),true);}),(_opt[_idx]||{}).value||''}
	function text(){return(_opt[_idx]||{}).text||''}
	function disabled(b){setTimeout(function(){inst()&&inst().disabledSB(b)},10)}
	function focus(){$('#'+id+' a.tit').focus()}

	function option(){return opt}
	function get(){return opt[_idx]||''}

	function inst(){return findSB()&&$('#'+id+' .select').getInstance()}
	function setIndex(i){_idx=i;setTimeout(function(){inst()&&inst().setIndexSB(_idx)},10)}
	function findSB(){return $('#'+id+' select').length&&$('#'+id+' select')}
}
function account(id,fnc,pwdid) {
	var isSelfAcct = true;
	var selfAcctIdx = $svc.get('$userInfo')['selfAcctIdx']||0;
	var acctList = $svc.get('$userInfo')['acctList'];
	if(selfAcctIdx >= acctList.length)selfAcctIdx = 0;
	if(_.isEmpty(acctList))
		acctList = [{value:'', text:'계좌 미보유'}];
	var acct = init(id, selfAcctIdx, acctList,function(e,p) {
		isSelfAcct && $svc.get('http').post('/siw/common/account-index/data.do', {idx:p.index},false);
		fnc && fnc(e,p);
//		pwdid && setTimeout(function(){$('#'+pwdid).focus()},100);
	});
	acct.getAcctNo = function() {
		return acct.get().acctNo;
	};
	acct.gdsCode = function() {
		return acct.get().gdsCode;
	};
	acct.getAcctName = function() {
		return acct.get().name;
	};
	acct.getAcctNickname = function() {
		return acct.get().nick;
	};
	acct.setForeign = function() {
		return $svc.get('http').post('/siw/common/account-foreign/data.do', {},false).then(function(rsHttp) {
			if(!rsHttp || rsHttp['foreign'].length<=0) {
				acct.load(0, [{value:'', text:'계좌 미보유'}]);
				return;
			}
			acct.load($svc.get('$userInfo')['selfAcctIdx']||0, rsHttp['foreign']);
		});
	};
	acct.setAnnuity = function() {
		isSelfAcct = false;
		return $svc.get('http').post('/siw/common/account-annuity/data.do', {},false).then(function(rsHttp) {
			if(!rsHttp || rsHttp['annuity'].length<=0) {
				acct.load(0, [{value:'', text:'연금저축계좌 미보유'}]);
				return;
			}
			acct.load(0, rsHttp['annuity']);
		});
	};
	acct.setAnnuityShort = function(p) {
		isSelfAcct = false;
		return $svc.get('http').post('/siw/common/account-annuityShort/data.do',{type:p},false).then(function(rsHttp) {
			if(!rsHttp || rsHttp['annuityShort'].length<=0) {
				acct.load(0, [{value:'', text:'연금저축계좌 미보유'}]);
				return;
			}
			//중복계좌제거
			var duple = _.uniq(rsHttp['annuityShort'],'acctNo');
//			acct.load(0, rsHttp['annuityShort']);
			acct.load(0, duple);
		});
	};
	//위임계좌추가
	acct.setAcctAll = function() {
		return $svc.get('http').post('/siw/common/account-all/data.do', {},false).then(function(rsHttp) {
			if(!rsHttp || rsHttp['cmbAcctAll'].length<=0) {
				acct.load(0, [{value:'', text:'계좌 미보유'}]);
				return;
			}
			acct.load($svc.get('$userInfo')['selfAcctIdx']||0, rsHttp['cmbAcctAll']);
		});
	};
	return acct;
}
function year(id,from,to,fnc,op) {
	var option = [{value:'', text:'----'}];
	if(op)option = [];
	if(from>to) {
		for(i=from; i>=to; i--)
			option.push({value:i.toString(), text:i.toString()});
	}
	else {
		for(i=from; i<=to; i++)
			option.push({value:i.toString(), text:i.toString()});
	}
	return init(id, 0, option,function(e,p) {
		fnc && fnc(e,p);
	});
}
function month(id,fnc,op) {
	var option = [{value:'', text:'--'}];
	if(op)option = [];
	for(i=1; i<=12; i++) {
		var mon = $svc.get('util').strRight(('00'+i),2);
		option.push({value:mon, text:mon});
	}
	return init(id, 0, option,function(e,p) {
		fnc && fnc(e,p);
	});
}
function day(id,fnc,op) {
	var option = [{value:'', text:'--'}];
	if(op)option = [];
	for(i=1; i<=31; i++) {
		var day = $svc.get('util').strRight(('00'+i),2);
		option.push({value:day, text:day});
	}
	return init(id, 0, option,function(e,p) {
		fnc && fnc(e,p);
	});
}
});

si.service('http',function($svc){
var log = $svc.logger('http');
var ajax = $svc.get('ajax');
var util = $svc.get('util');
var lpopup = $svc.get('lpopup');
var uiloading = $svc.get('uiLoading');

return {post:post,$post:$post,html:html};

function post(url,param,loading,nofilter,sync){return purePost(url,param,loading,true,sync).then(function(data){return nofilter?data:data.body})}
function $post(url,param,loading,sync){return purePost(url,param,loading,false,sync)}
function html(url,cache){
	cache=cache==undefined?true:cache;
	var data='';
	ajax.html(url,true,cache).then(function(r){data=r||''});
	return data;
}
function purePost(url,param,loading,filtering,sync){
	loading=(loading==undefined?true:!!loading);
	loading&&uiloading.on();

	var d=$.Deferred(),s_tm=new Date,data=parameter(param);

	ajax.post(url,data,sync).then(function(r){
		loading&&uiloading.off();
		var r_tm=new Date;
		if(!r){
			// 입력오류
			logError(s_tm,loading,'S',url,data),logError(r_tm,loading,'R',url,'NULL');
			!url && alert('URL이 입력되지 않았습니다.');
			d.reject();
			return;
		}
		if(!filtering){
			// 필터링없음
			logInfor(s_tm,loading,'S',url,data),logInfor(r_tm,loading,'R',url,r);
			d.resolve(r);
			return;
		}
		if(r.status != 200){
			// 404,500에러
			logError(s_tm,loading,'S',url,data),logError(r_tm,loading,'R',url,r.status);

			var msg=['[ERROR:'+(r.status||500)+']','http('+url+') 에러가 발생하였습니다.'];
			if(r.data&&r.data.indexOf('<pre error-message>')>=0){
				msg.push(r.data.substring(r.data.indexOf('<pre error-message>')+19,r.data.indexOf('</pre>')));
			}
			msg=msg.join('\r\n');
			si.app.st()=='L'&&alert(msg);
			page.error(msg);
			return;
		}
		if(!r.data.header){
			// 전문규격 에러
			logError(s_tm,loading,'S',url,data),logError(r_tm,loading,'R',url,r.data);
			var msg=['[ERROR:500]','전문규격 에러가 발생하였습니다.','url:'+url].join('\r\n');
			si.app.st()=='L'&&alert(msg);
			page.error(msg);
			return;
		}
		if(r.data.header && r.data.header.RCD != 0){
			// 에러
			uiloading.clear();
			logError(s_tm,loading,'S',url,data),logError(r_tm,loading,'R',url,r.data);
			lpopup.alert(r.data.header.MSG||'데이터 처리도중 오류가 발생하였습니다.').then(function(){d.reject()});
			return;
		}

		logInfor(s_tm,loading,'S',url,data),logInfor(r_tm,loading,'R',url,r.data);
		d.resolve(r.data);
	});
	return d.promise();
}
function parameter(data){return {header:{TCD:'S',SDT:util.formatDate(new Date(), 'yyyyMMddhh24missms'),SVW:location.pathname},body:data||{}}}
function logInfor(time,ui,type,url,data){log.isLog&&log(util.formatDate(time,'hh24:mi'),(ui?'+':'-'),[type,'(',url,')'].join(''), data)}
function logError(time,ui,type,url,data){log.isLog&&log(':error', util.formatDate(time,'hh24:mi'),(ui?'+':'-'),[type,'(',url,')'].join(''), data)}
});

si.service('bbs',function($svc){
var log=$svc.logger('bbs');
var util=$svc.get('util');
var uiloading=$svc.get('uiLoading');

return {
	path:page.bbs.path,
	src:page.bbs.src,
	go:page.bbs.go,
	get:get
};
function get(url,param,loading,filtering,sync){
	return pureGet(page.bbs.path(url),param,loading,filtering,sync)
}
function pureGet(url,param,loading,filtering,sync){
	filtering=(filtering==undefined?true:filtering);
	loading=(loading==undefined?true:loading);
	loading&&uiloading.on();

	var d=$.Deferred(),s_tm=new Date,data=param;

	setTimeout(function(){
		ajax(url,data,sync).then(function(r){
			loading&&uiloading.off();
			var r_tm=new Date;
			if(!r){
				// 입력오류
				logError(s_tm,loading,'S',url,data),logError(r_tm,loading,'R',url,'NULL');
				!url && alert('URL이 입력되지 않았습니다.');
				d.reject();
				return;
			}
			if(!filtering){
				// 필터링없음
				logInfor(s_tm,loading,'S',url,data),logInfor(r_tm,loading,'R',url,r);
				d.resolve(r);
				return;
			}
			if(r.status != 200){
				// 404,500에러
				logError(s_tm,loading,'S',url,data),logError(r_tm,loading,'R',url,r.status);

				var msg=['[ERROR:'+(r.status||500)+']','bbs('+url+') 에러가 발생하였습니다.'].join('\r\n');
				si.app.st()=='L'&&alert(msg);
				page.error(msg);
				return;
			}
			logInfor(s_tm,loading,'S',url,data),logInfor(r_tm,loading,'R',url,r.data);
			d.resolve(r.data);
		});
	},100);

	return d.promise();
}
function ajax(url,pm,sync,cache){
	var d=$.Deferred();
	if(url){
		if(si.browser[1]<10||si.browser[2]<10){
			url=si.util.uri(url,cache)+'&'+serialize(pm);
			log(url);
			window.xdr=window.xdr||{};
			var id=util.formatDate(new Date,'xdr-hh24-mi');
			var xhttp=window.xdr[id]=new XDomainRequest;
			xhttp.onload=function(){var r={status:200};try{r.data=$.parseJSON(xhttp.responseText)}catch(e){r.status=500}window.xdr[id]=null;d.resolve(r)};
			xhttp.onerror=function(){window.xdr[id]=null;d.resolve({status:500})};
			xhttp.open('get',url),xhttp.send();
		}else{
			$.ajax({
				async:!sync,
				xhrFields: {withCredentials:true},crossDomain:true,
				type:'get',dataType:'json',contentType:'application/json',url:si.util.uri(url,cache),data:serialize(pm),
				success:function(data){d.resolve({data:data||{},status:200})},
				error:function(r){d.resolve({status:r.status==200?500:r.status})}
			});
		}
	}else d.resolve(null);
	return d.promise();
}
function serialize(data){return _.map(data,function(v,k){return [k,'=',v].join('');}).join('&')}
function logInfor(time,ui,type,url,data){log.isLog&&log(util.formatDate(time,'hh24:mi'),(ui?'+':'-'),[type,'(',url,')'].join(''), data)}
function logError(time,ui,type,url,data){log.isLog&&log(':error', util.formatDate(time,'hh24:mi'),(ui?'+':'-'),[type,'(',url,')'].join(''), data)}
});

})();
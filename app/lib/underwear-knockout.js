/*
underwear-knockout
2016.09.29
im-onesix
*/
function(w){

var _w={};
var fw={};

_w.version='0.1';

_w.browser=function(){
	var m=document.documentMode;
	var a=navigator.userAgent;
	var b=_.find({
		'Chrome/':'C',
		'Safari/':'S',
		'Firefox/':'F',
		'OPR':'O',
		'Opera':'O',
		'Trident/':'I',
		'MSIE':'I'
	},function(x,y){
		return a.indexOf(y)>-1
	})||'N';
	var v=_.find({
		'Trident/4.0':8,
		'Trident/5.0':9,
		'Trident/6.0':10,
		'Trident/7.0':11
	},function(x,y){
		return a.indexOf(y)>-1
	})||7;

	return b=='I'?(m?['I',v,m]:['I',7,7]):[b,99,99];
}();

si.component=function(n,f){_addN(n,f)},
si.config=function(f){_addF(f)},
si.controller=function(n,f){_addC(n,f)},
si.handler=function(n,f){_addH(n,f)},
si.main=function(f){_addC('main',f)},
si.provider=function(n,f){_addP(n,f)},
si.run=function(f){_run(f)},
si.service=function(n,f){_addS(n,f)},

si.util={uri:uri,load:load};
w.si=si,w.app=null,w.log=logger('app');
//
function _addC(n,f){fw.C[n]=f}
function _addF(f){fw.F.push(f)}
function _addH(n,f){fw.H[n]=f}
function _addP(n,f){fw.P[n]=f}
function _addN(n,f){fw.N[n]=f}
function _addS(n,f){fw.S[n]=f}
function _addE(f){fw.E.push(f)}
function _getS(n){return(fw.P[n]?fw.P[n].$this:fw.S[n])(_svc('S'))}
function _getP(n){return fw.P[n]}
function _cfg(){return{app:fw.APP,get:function(n){return _getP(n)},logger:function(n,c){return logger(n,c||C['F'])}}}
function _svc(t){return{app:fw.APP,get:function(n){return _getS(n)},logger:function(n,c){return logger(n,c||C[t])},$bind:function(n,e){_bindV(n,e)},$controller:function(n,f){_bindC(n,f)},$destroy:function(n){_removeC(n)}}}
function _run(f){
	fw.R={$name:function(){return '$root'}};
	_.each(['provider','config','component','handler','error'],function(v){delete si[v]});
	_.each(fw.P,function(v,k){fw.P[k]=v()});
	_.each(fw.F,function(v){v(_cfg())});
	if(si.browser[0]=='I'&&si.browser[1]>8&&si.browser[2]>8){
		ko.bindingHandlers['component']=_iecomponent(_svc('F'));
	}else{
		_.each(fw.N,function(v,k){ko.components.register(k,v(_svc('F')))});
	}
	_.each(fw.H,function(v,k){ko.bindingHandlers[k]=v(_svc('F'))});
	f(fw.R,_svc());
	if($('[data-view]').length&&fw.C['main']){
		_bindV('main',$('[data-view]')[0]);
		_loadC('main',{});
	}
	ko.applyBindings(fw.R,$('body')[0]);
}
function _iecomponent($svc){return{init:function(){},update:function(el,va){
	var v=va.call();
	var nm=v.name;
	if(typeof nm==='function')nm=nm.call();
	setTimeout(function(){
		var c=fw.N[nm]($svc);
		var t=c.template;
		$(el).html(t);
		var m=new c.viewModel(v.params);
		$(el).children().each(function(){ko.cleanNode(this)});
		$(el).children().each(function(){ko.applyBindings(m,this)});
	},1);
}}}
function _bindV(n,v){$(v).css('display','none').attr('id',n).attr('data-bind','with:c'+n)}
function _bindC(n,f){
	var e=$('#'+n)[0];
	ko.cleanNode(e);
	f&&f(e);
	_loadC(n,{});
	ko.applyBindings(fw.R,e);
}
function _loadC(n,o){
	o['$name']=function(){return n};
	!fw.C[n]&&_error('Controller['+n+'] is not found!!');
	fw.C[n](o,_svc('C'));
	fw.R['c'+n]=ko.observable(o);
	$('#'+n).css('display','');
}
function _removeC(n){
	ko.removeNode($('#'+n)[0]);
	delete fw.R['c'+n];
}
function _error(msg){_.each(fw.E,function(v){v()})}
//
function v(){return(new Date).getTime()+(Math.floor(Math.random()*100)+1)}
function uri(p,c){return(c=!c?'?v='+v():''),fw.A.root+p+c}
function logger(n,c){
	logger.FN=logger.FN||function(){};
	return fw.A['st']&&fw.A['st']!='R'?(logger.L=logger.L||{},logger.L[n+c]=logger.L[n+c]||pt(n,c)):logger.FN;
}
function lo(){return si.version=='d'}
function pt(n,c){
	var ff=si&&si.browser&&si.browser[0]!='I'?bzlog:ielog;
	function ielog(a){
		var e='';a=_.toArray(arguments),a[0]===':error'&&(e=a.shift());
		console.log(_.flatten(['['+n+e+']',a]).join(' , '));
	}
	function bzlog(a){
		var e='',ec='';a=_.toArray(arguments),a[0]===':error'&&(e=a.shift(),ec='background:#fff;color:#e00');
		console.log.apply(console,_.flatten(['%c ['+n+e+'] ',ec||c||'background:#fff;color:#000',a]));
	}
	function pp(){
		if(lo()){
			lo.B=_.each(lo.B,function(v){ff.apply(null,v)})&&[];ff.apply(null,_.toArray(arguments));
		}else{
			lo.B=lo.B||[];
			(lo.B.length==50)&&lo.B.shift();
			lo.B.push(_.toArray(arguments));
		}
	}
	function f(){pp.apply(null,_.toArray(arguments))}
	return f.isLog=true,f;
}
function load(b,p,c,as,cs){
	c=c==undefined?true:c,b=_.compact(_.flatten((b||'').split('/'))).join('/'),b=(b?'/'+b:'');
	_.each(_.compact(_.flatten([p])),function(v){
		var u=b+'/'+_.compact(_.flatten(v.split('/'))).join('/');
		var e=_.last(u.split('.')).toUpperCase();
		e=='JS'&&loadJS(u,c,as,cs);
		e=='CSS'&&loadCSS(u,c,as);
	})
}
function loadJS(p,c,as,cs){var o={src:uri(p,c)};cs&&(o.charset=cs);addTag('script',o,as)}
function loadCSS(p,c,as){addTag('link',{href:uri(p,c),rel:'stylesheet'},as)}
function addTag(n,a,as){
	var h=document.getElementsByTagName('head')[0],e=document.createElement(n);
	_.each(a,function(v,k){e.setAttribute(k,v)});
	as?h.appendChild(e):document.write(out(e));
}
function out(e){return e.outerHTML||(function(n){
	var d=document.createElement('div'),h;
	return d.appendChild(n),h=d.innerHTML,d=null,h;
})(e)}

}(window);

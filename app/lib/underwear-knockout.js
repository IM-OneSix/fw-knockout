/* underwear-knockout[2016.09.29] */
(function(w){
var _w={
	version:'0.1',
	browser:function(){
		var m=document.documentMode;
		var a=navigator.userAgent;
		var b=function(l,n){for(n in l)if(a.indexOf(n)>-1)return l[n]}({
			'Chrome/':'C',
			'Safari/':'S',
			'Firefox/':'F',
			'OPR':'O',
			'Opera':'O',
			'Trident/':'I',
			'MSIE':'I'
		})||'N';
		var v=function(l,n){for(n in l)if(a.indexOf(n)>-1)return l[n]}({
			'Trident/4.0':8,
			'Trident/5.0':9,
			'Trident/6.0':10,
			'Trident/7.0':11
		})||7;
		return b=='I'?(m?['I',v,m]:['I',7,7]):[b,99,99];
	}(),
	handler:function(n,f){addHandler(n,f)},
	component:function(n,f){addComponent(n,f)},
	config:function(f){addConfig(f)},
	provider:function(n,f){addProvider(n,f)},
	service:function(n,f){addService(n,f)},
	controller:function(n,f){addController(n,f)},
	main:function(f){addController('main',f)},
	bootstrap:function(f){run(f)}
},
_handler={},
_component={},
_config=[],
_provider={},
_service={},
_controller={}
_R={};

w._w=_w;

function addHandler(name,func){_handler[name]=func}
function addComponent(name,func){_component[name]=func}
function addConfig(func){_config.push(func)}
function addProvider(name,func){_provider[name]=func}
function addService(name,func){_service[name]=func}
function addController(name,func){_controller[name]=func}

function getService(name){return(_provider[name]?_provider[name].$this:_service[name])(svc())}
function getProvider(name){return _provider[name]}

function svc(){
	return{
		get:function(name){return getService(name)},
		$bind:function(name,element){bindHtml(name,element)},
		$controller:function(name,func){bindController(name,func)},
		$destroy:function(name){removeController(name)}
	}
}

function cfg(){
	return{
		get:function(name){return getProvider(name)}
	}
}

function run(func){
	_R={$name:function(){return'$root'}};

	_.each(['handler','component','config','provider','service','controller'],function(v){delete _w[v]});
	_.each(_provider,function(v,k){_provider[k]=v()});
	_.each(_config,function(v){v(cfg())});
	_.each(_handler,function(v,k){ko.bindingHandlers[k]=v(svc())});
	_.each(_component,function(v,k){ko.components.register(k,v(svc()))});

	func&&func(_R,svc());

	if($('[data-view]').length&&_controller['main']){
		bindHtml('main',$('[data-view]')[0]);
		loadController('main',{});
	}

	ko.applyBindings(_R,$('body')[0]);
}

//

function bindHtml(name,element){$(element).css('display','none').attr('id',name).attr('data-bind','with:c'+name)}

function loadController(name,vo){
	!_controller[name]&&error('Controller['+name+'] is not found!!');

	vo['$name']=function(){return name};

	_controller[name](vo,svc());

	_R['c'+name]=ko.observable(vo);

	$('#'+name).css('display','');
}

function bindController(name,func){
	var e=$('#'+name)[0];
	ko.cleanNode(e);
	func(e);
	loadController(name,{});
	ko.applyBindings(_R,e);
}

function removeController(name){
	ko.removeNode($('#'+name)[0]);
	delete _R['c'+name];
}

function error(message){throw new Error(message)}

})(window);
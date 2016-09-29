/**
 * Run
 * | DATE | NAME | DESC |
 * |------|------|------|
 * | 2016.04.04 | 강환기 | 최초생성 |
 * | 2016.07.12 | 주성민 | 개인화영역 알림 링크 수정.  |
 * | 2016.08.23 | H.YANG | Swap 추가  |
 */
(function (){
$(document).off('click.SIE#').on('click.SIE#','a',function(e){($(this).attr('href')||'#')=='#'&&e.preventDefault()});
$(document).off('focus.SIE#label click.SIE#label').on('focus.SIE#label click.SIE#label','label[for]',function(){$('#'+$(this).attr('for')).focus()});
//-- UI
function updateUI(){
	shPages.init();
	shCalendar.init();
	$('select').each(function (){
		var $t=$(this);
		var $p=$t.parent();
		var $d=$p.children('div.select');
		var o={height:250,zindex:100,direction:$p.hasClass("selectBtm")?"up":"down"};
		if(!$d.length)(new SelectBox($t, o)).initSB();
		else if(!$d.data('scope')){$($d).remove();(new SelectBox($t, o)).initSB();}
	});
	if(si.app.syscode()!='siw'){
		$('a').each(function(){
			var t=$(this),lnk=$(this).attr('href');
			lnk && t.attr('href',page.path(lnk));
		});
	}

	$('[data-title-page-name]').each(function(){
		var nm=$(this).attr('data-title-page-name');
		page.title.setPagename(nm);
	});

	$('[data-title-tab-name]').each(function(){
		var nm=$(this).attr('data-title-tab-name');
		page.title.setTabname(nm);
	});

	//ASTX 키보드 초기화
	/* 키보드 초기화 */
	try {
		if($("div.contents input[type='password']").length > 0 || $("#layer input[type='password']").length > 0) {
			//ASTx 초기화 처리
			$ASTX2.init(function() {
				log("ASTx 설치 확인, 제품초기화 성공, 키보드 초기화 실행");
				//$ASTX2.setE2EAllExceptInputs();
				$ASTX2.initNonE2E();
			}, function() {
				log("ASTx 설치 확인 실패!!!", $ASTX2.getLastError());			
			});
		}
	} catch(error) {
		//log("err: ", error);
	}
}
function updateRouterUI(){
	$('body').scrollTop(0);
	setTimeout(function(){$('.stepType .recent').length&&shComm.stepLine()},100);
}
//-- sinhan-invest-front-end-framework

si.config(function($cfg){
	$cfg.get('uiLoading').message('<img src="/siw/common/images/common/loading.gif" class="loading" alt="로딩중입니다."/><img src="/siw/common/images/common/loading_line.gif" class="loadLine" alt="" />');
	$cfg.get('rootBinder').addService('util');
	$cfg.get('uiHelper').addUpdateUI(updateUI);
	$cfg.get('router').setBeforeLoadController(updateRouterUI);

	var ajax=$cfg.get('ajax');
	// - contents
	if(si.app.filetype().indexOf('contents')==0){
		ajax.html('/siw/html/'+si.app.path()+'.html',true,true).then(function(r){r?$('div[data-layout-contents]').html(r):page.empty()});
	}
	// - layout
	if(si.app.syscode()=='siw' && si.app.filetype().indexOf('-popup')<0){
		var mc={},l={},css='',top=[
			'10100000', // 나의 자산분석
			'10200000', // 자산관리몰
			'10300000', // 연금자산
			'10400000', // 트레이딩
			'10500000', // 투자정보
			'10600000', // 뱅킹/업무
			'10700000'  // 고객센터
		];
		if(si.data.menurootCode()=='30000000'){
			css='gnbIB',top=[
				'30100000', // IB Group
				'30200000', // DCM
				'30300000', // ECM
				'30400000', // 투자금융
				'30500000', // M&A
				'30600000'  // Swap Service
			];
		}
		if(si.data.menurootCode()=='40000000'){
			css='gnbTops',top=[
				'40100000', // My Tops Club
				'40200000', // 가상테스트
				'40300000', // 추천금융상품
				'40400000', // 이벤트
				'40500000', // 프리미엄서비스
				'40600000'  // 제도 안내
			];
		}
		if(si.data.menurootCode()=='50000000'){
			css='gnbSwap',top=[
				'50100000', // Client(Sales Person)
				'50200000', // Partner
				'50300000'  // SwapTeam
			];
		}

		ajax.get('/siw/menu.do',null,true,true).then(function(r){r.status==200?(mc=r.data):page.error()});
		ajax.html('/siw/common/biz/include/'+si.app.layoutcode()+'.html',true,true).then(function(r){
			r&&_.each($(r),function(v){
				v.id&&(l[v.id]=v.innerHTML||'')
			})
		});
		$cfg.get('menu').init(top,mc,l,css);
	}
});

si.service('headerNotice',function($svc){
	var log = $svc.logger('headerNotice');
	var http = $svc.get('http');
	var menu = $svc.get('menu');
	var util = $svc.get('util');
	var bbs = $svc.get('bbs');
	var location = $svc.get('location');
	//
	return {init:init};
	//
	function init($vo){
		$vo.hn = {};
		
		//Today 알림
		$vo.hn.info = {};
		$vo.hn.info.pageNo = ko.observable(0);
		$vo.hn.info.rowsCount = 8;
		$vo.hn.info.totalCount = ko.observable(0);
		$vo.hn.info.prevBtnEnable = ko.observable(false);
		$vo.hn.info.nextBtnEnable = ko.observable(false);
		$vo.hn.info.totalList = ko.observableArray([]);
		$vo.hn.info.list = ko.observableArray([]);
		//이전
		$vo.hn.info.prevList = function() {
			var data = $vo.hn.info.totalList();
			var pageNo = $vo.hn.info.pageNo();
			var rowCount = $vo.hn.info.rowsCount;
			
			$vo.hn.info.nextBtnEnable(true);
			if((pageNo-1) <= 1){
				$vo.hn.info.prevBtnEnable(false);
				$vo.hn.info.list(data.slice(0,10));
			}else{
				$vo.hn.info.list(data.slice((pageNo-2)*rowCount,(pageNo-1)*rowCount));
			}
			pageNo--;
			$vo.hn.info.pageNo(pageNo);
			
		};
		//다음
		$vo.hn.info.nextList = function() {
			var data = $vo.hn.info.totalList();
			var pageNo = $vo.hn.info.pageNo();
			var rowCount = $vo.hn.info.rowsCount;
			
			if(data.length > (pageNo+1)*rowCount){
				$vo.hn.info.prevBtnEnable(true);
				$vo.hn.info.nextBtnEnable(true);
				$vo.hn.info.list(data.slice(pageNo*rowCount,(pageNo+1)*rowCount));
			}else if(data.length == (pageNo+1)*rowCount){
				$vo.hn.info.prevBtnEnable(true);
				$vo.hn.info.nextBtnEnable(false);
				$vo.hn.info.list(data.slice(pageNo*rowCount,(pageNo+1)*rowCount));
			}else{
				$vo.hn.info.prevBtnEnable(true);
				$vo.hn.info.nextBtnEnable(false);
				$vo.hn.info.list(data.slice(pageNo*rowCount));
			}
			pageNo++;
			$vo.hn.info.pageNo(pageNo);
		};
		//
		$vo.hn.info.getClass = function(index, data) {
			log("index = " + index);
			if(index == 0) {
				return '';
			} else {
				if(data.type == '1') {
					//입출금(고) 통보
					return 'noti01';
				} else if(data.type == '2') {
					//보유종목 배당금 지급예정
					return 'noti02';
				} else if(data.type == '3') {
					//보유종목 투자정보 내 게시판
					return 'noti03';
				} else if(data.type == '4') {
					//금융상품 만기알림
					return 'noti04';
				} else if(data.type == '5') {
					//보유종목 랭킹 알림
					return 'noti05';
				} else {
					return '';
				}
			}
		};
		//
		//투자정보 알림 팝업
		$vo.hn.info.viewPopup = function(messageId){
			$svc.get('wpopup').open(page.bbs.path('/siw/board/message/view.file.pop.do?boardName=gicomment&messageId='+messageId));
		};
		
		//상담내역 변수선언
		$vo.hn.voc = {};
		$vo.hn.voc.visible = ko.observable(false);
		$vo.hn.voc.question = ko.observable('');
		$vo.hn.voc.boardName = ko.observable('');
		$vo.hn.voc.answerLink = function() {
			log("답변보기!!");
			location.go("/siw/customer-center/advise/vocList/view.do");
		};
		$vo.hn.voc.questionLink = function() {
			log("1:1문의!!");
			location.go("/siw/customer-center/advise/vocWrite/view.do");
		};
		//즐겨찾기 변수선언
		$vo.hn.fm = {};
		$vo.hn.fm.pageNo = ko.observable(0);
		$vo.hn.fm.rowsCount = 10;
		$vo.hn.fm.totalCount = ko.observable(0);
		$vo.hn.fm.prevBtnEnable = ko.observable(false);
		$vo.hn.fm.nextBtnEnable = ko.observable(false);
		$vo.hn.fm.totalList = ko.observableArray([]);
		$vo.hn.fm.list = ko.observableArray([]);
		//즐겨찾기 이전리스트
		$vo.hn.fm.prevList = function() {
			log("prev");
			setFavoriteMenuPage($vo, $vo.hn.fm.pageNo()-1);
		};
		//즐겨찾기 다음리스트
		$vo.hn.fm.nextList = function() {
			log("next");
			setFavoriteMenuPage($vo, $vo.hn.fm.pageNo()+1);
		};
		//즐겨찾기 메뉴삭제
		$vo.hn.fm.deleteMenu = function(menuCode) {
			log("menuCode = " + menuCode);
			http.post("/siw/etc/favorite/setMenu/data.do", {type:'del', menuCode:menuCode}, false).then(function(body) {
				getFavoriteMenu($vo);
			});
		};
		//즐겨찾기 메뉴이동
		$vo.hn.fm.linkMenu = function(url) {
			log("url = " + url);
			$svc.get('location').go(url);
		};
		//알림 버튼 클릭 처리
		$(document).on('click.SIE#headerNotice','.gnbUtil>.topNotice>button',function(){
			log('open headerNotice...');

			shMenu.topNoticeOpen();

			if(si.data.isLogin()) {
				//즐겨찾기 조회
				getFavoriteMenu($vo);
				//나의상담내역 조회
				getRecentVocResult($vo);
				//오늘 알림!!!
				getTodayAlram($vo);
			}
		});
	}
	//상담내역 조회
	function getRecentVocResult($vo) {
		var prm = {
			boardNames : ['VOC_product','goodi_VOC'],
			listLines : 1
		};
		var query = {
			query: encodeURIComponent(JSON.stringify(prm))
		};
		bbs.get("/bbs/api/list/submain/02/0201", query, false, false).then(function(rsHttp) {
			log("상담내역 조회 결과 rsHttp :: ", rsHttp);
			if(rsHttp.status == '200' && rsHttp.data.totalCount > 0) {
				_.each(rsHttp.data.result, function(v, k) {
					if(v.count > 0) {
						log("voc boardName = " + v.boardName);
						$vo.hn.voc.boardName(v.boardName);
						_.each(v.list, function(v2, k2) {
							log(v2.q.question);
							$vo.hn.voc.visible(true);
							$vo.hn.voc.question(v2.q.question);
						});
					}
				});
			}
		});
	}
	//즐겨찾기 처리
	function getFavoriteMenu($vo) {
		//
		http.post("/siw/etc/favorite/getMenu/data.do", {}, false).then(function(body) {
			log("favorite menu : ", body);
			if(body.list) {
				var tmplist = [];
				_.each(body.list, function(v, k) {
					if(menu.menuname(v[0])) {
						v[3] = menu.menuname(v[0]);		//메뉴명
						v[4] = menu.menuurl(v[0]);		//메뉴url
						tmplist.push(v);
					}
				});
				$vo.hn.fm.totalList(tmplist);
				$vo.hn.fm.totalCount(tmplist.length);
				//첫페이지 설정
				setFavoriteMenuPage($vo, 0);
			} else {
				$vo.hn.fm.totalList([]);
				$vo.hn.fm.totalCount(0);
			}
			
		});
	}
	//즐겨찾기 페이지 설정
	function setFavoriteMenuPage($vo, pageNo) {
		$vo.hn.fm.pageNo(pageNo);
		//
		if(pageNo == 0) {
			$vo.hn.fm.prevBtnEnable(false);
		} else {
			$vo.hn.fm.prevBtnEnable(true);
		}
		if($vo.hn.fm.totalCount() > ($vo.hn.fm.pageNo()+1)*$vo.hn.fm.rowsCount) {
			$vo.hn.fm.nextBtnEnable(true);
		} else {
			$vo.hn.fm.nextBtnEnable(false);
		}
		var list = [];
		var start = $vo.hn.fm.pageNo()*$vo.hn.fm.rowsCount;
		var end = Math.min(($vo.hn.fm.pageNo()+1)*$vo.hn.fm.rowsCount, $vo.hn.fm.totalCount());
		log("start = " , start, ", end = ", end);
		_.each(_.range(start, end),function(v){ 
			log(v);
			list.push($vo.hn.fm.totalList()[v]);
		});
		$vo.hn.fm.list(list);
	}
	//오늘 알림 내역 조회
	function getTodayAlram($vo) {
		log("-----------------------------------------------------------");
		$svc.get('uiLoading').on();
		var d1 = getBankInoutInfo();
		//log("d1", d1);
		var d2 = getStockDividendInfo();
		//log("d2", d2);
		var d3 = getStockInvestInfo();
		//log("d3", d3);
		var d4 = getProductExpireDateInfo();
		//log("d4", d4);
		var d5 = getStockRankingInfo();
		//log("d5", d5);
		//
		$.when(d1, d2, d3, d4, d5).done(function(v1, v2, v3, v4, v5) {
			log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> promise done!!!");
			$svc.get('uiLoading').off();
			//입출금(고) 통보 (order:1, max:3)
			//log("v1 : ", v1);
			//보유종목 배당금 지급예정 (order:2, max:전체)
			//log("v2 : ", v2);
			//보유종목 투자정보 내 게시판 (order:3, max:10)
			//log("v3 : ", v3);
			//금융상품 만기알림 (order:4, max:10)
			//log("v4 : ", v4);
			//보유종목 랭킹 (order:5, max:전체)
			//log("v5 : ", v5);
			
			var data1 = [];
			data1 = data1.concat(v1);
			data1 = data1.concat(v2);
			data1 = data1.concat(v3);
			data1 = data1.concat(v4);
			data1 = data1.concat(v5);
			
			$vo.hn.info.pageNo(1);
			$vo.hn.info.totalCount(data1.length);
			log("$vo.hn.info.totalCount() = " + $vo.hn.info.totalCount());
			$vo.hn.info.totalList(data1);
			if(data1.length > $vo.hn.info.rowsCount){
				$vo.hn.info.prevBtnEnable(false);
				$vo.hn.info.nextBtnEnable(true);
				$vo.hn.info.list(data1.slice(0,$vo.hn.info.rowsCount));
			}else{
				$vo.hn.info.prevBtnEnable(false);
				$vo.hn.info.nextBtnEnable(false);
				$vo.hn.info.list(data1);
			}
		});
	}
	//입출금(고)통보
	function getBankInoutInfo() {
		var d = $.Deferred();
		//
		http.post("/siw/etc/inform/getInform01/data.do", {}, false).then(function(body) {
			log("getInform01 result body :: ", body);
			if(!body.list || body.list.length == 0) {
				d.resolve([]);
			} else {
				var list1 = [];
				_.each(body.list, function(v,k){
					if(k < 3){
						var desc = util.strDataType('date',v[0]) + " - " + util.addCommas(util.strToInt(v[3])) + "원";
						list1.push({
							type : '1',
							name : v[1],
							desc : desc,//'2016-05-15 10:00 - 10,000원',
							fullDesc : "<span>"+v[1]+"</span>" + desc,	
							link : ''
						});
					}
				});
				d.resolve(list1);
			}
		}, function() {
			d.resolve([]);
		});
		return d.promise();
	}
	//보유종목 배당금 지급 예정 
	function getStockDividendInfo() {
		var d = $.Deferred();
		http.post("/siw/etc/inform/getInform02/data.do", {}, false).then(function(body) {
			log("getInform02 result body : ", body);		
			if(body.list.length == 0) {
				d.resolve([]);
			} else {
				var list1 = [];
				_.each(body.list, function(v, k){
					//1. 유상 : 권리명 종목명 배정수량 청약시작일~청약종료일
					//2. 무상 : 권리명 종목명 배정수량 주식지급일자
					//3. 배당(주식) : 권리명 종목명 배정수량 주식지급일자
					//4. 배당(현금) : 권리명 종목명 배정금액 현금지급일자
					if(v['type'] == '1') {
						//유상
						var desc = v['종목명'] + " 배정수량 " + util.addCommas(v['배정수량']) + "주 " + util.strDataType('date', v['청약시작일자']) + "~" + util.strDataType('date', v['청약종료일자']);
						list1.push({
							type : '2',
							name : v['권리명'],
							desc : desc,
							fullDesc : "<span>"+v['권리명']+"</span>" + desc,	
							link : ''
						});
					} else if(v['type'] == '2') {
						//무상, 배당(주식)
						var desc = v['종목명'] + " 배정수량 " + util.addCommas(v['배정수량']) + "주 " + (v['주식지급일자']!='99991231' ? util.strDataType('date', v['주식지급일자']) : '');
						list1.push({
							type : '2',
							name : v['권리명'],
							desc : desc,
							fullDesc : "<span>"+v['권리명']+"</span>" + desc,	
							link : ''
						});
					} else if(v['type'] == '3') {
						//배당(현금)
						var desc = v['종목명'] + " 배정금액 " + util.addCommas(v['배정금액']) + "원 " + (v['현금지급일자']!='99991231' ? util.strDataType('date', v['현금지급일자']) : '');
						list1.push({
							type : '2',
							name : v['권리명'],
							desc : desc,
							fullDesc : "<span>"+v['권리명']+"</span>" + desc,	
							link : ''
						});
					}
				});
				d.resolve(list1);
			}
		}, function() {
			d.resolve([]);
		});
		return d.promise();
	}
	//보유종목 투자정보 게시판 
	function getStockInvestInfo() {
		var d = $.Deferred();
		http.post("/siw/etc/inform/getInform03/data.do", {}, false).then(function(body) {
			log("getInform03 보유종목 ", body);
			if(body && body.stockCount > 0) {
				//보유종목은 계좌별로 존재할수 있어, 중복될수 있음
				//중복을 제거
				var stockCodes = _.uniq(body.stockList);
				log("stockCodes : ", stockCodes);
				var prm = {
					boardNames : ['gicomment'],
					listLines : 10,
					stockCodes : stockCodes
				};
				log("getInform03 bbs 전송 param : ", JSON.stringify(prm));
				var query = {
					query: encodeURIComponent(JSON.stringify(prm))
				};
				bbs.get("/bbs/api/list/submain/02/0202", query, false, false).then(function(rsHttp) {
					log("/bbs/api/list/submain/02/0202 result rsHttp :: ", rsHttp);
					if(rsHttp.status == '200' && rsHttp.data.totalCount > 0) {
						var list1 = [];
						var data1 = rsHttp.data.result;
						_.each(data1, function(v, k){
							if(k < 10){
								var desc = v.title + " - " + v.name ;
								list1.push({
									type : '3',
									name : v.stockName,
									desc : desc,
									fullDesc : "<span>"+v.stockName+"</span>" + desc,	
									link : v.messageId
								});
							}
						});
						d.resolve(list1);
					} else {
						d.resolve([]);
					}
				}, function() {
					d.resolve([]);
				});
			} else {
				d.resolve([]);
			}
		}, function() {
			d.resolve([]);
		});
		return d.promise();
	}
	//금융상품 만기알림
	function getProductExpireDateInfo() {
		var d = $.Deferred();
		http.post("/siw/etc/inform/getInform04/data.do", {}, false).then(function(body) {
			log("getInform04 body : ", body);
			if(body.list.length == 0) {
				d.resolve([]);
			} else {
				var list1 = [];
				_.each(body.list, function(v, k){
					log(v);
					if(k < 10){
						var desc = util.strDataType('date',v['만기일자']) + " - " + v['종목명'] + " 원금 " + util.addCommas(v['잔고금액']) + "원";
						list1.push({
							type : '4',
							name : v['상품구분명'],
							desc : desc,
							fullDesc : "<span>만기일</span>" + desc,	
							link : ''
						});
					}
				});
				//log("금융상품 만기알림....", list1);
				d.resolve(list1);
			}
		}, function() {
			d.resolve([]);
		});
		return d.promise();
	}
	//보유종목 랭킹
	function getStockRankingInfo() {
		var d = $.Deferred();
		http.post("/siw/etc/inform/getInform05/data.do", {}, false).then(function(body) {
			log("getInform05 body : ", body);
			if(body.list.length == 0) {
				d.resolve([]);
			} else {
				var list1 = [];
				//고객번호 기준으로 보유종목을 조회하여, 다른 계좌에 같은 종목이 있을 수 있음. 중복을 제거
				var stockList = _.uniq(body.list, false, function(item) {
					return item.code;
				});
				_.each(stockList, function(v,k){
					var desc = [];
					if(v.hold_stbd_rank) {
						desc.push("실시간인기 " + util.addCommas(v.hold_stbd_rank) +"위");
					}
					if(v.realtm_stbd_rank) {
						desc.push("보유인기 " + util.addCommas(v.realtm_stbd_rank) +"위");
					}
					if(v.realtm_sell_rank) {
						desc.push("실시간매수 " + util.addCommas(v.realtm_sell_rank) +"위");
					}
					if(v.realtm_buy_rank) {
						desc.push("실시간매도 " + util.addCommas(v.realtm_buy_rank) +"위");
					}
					list1.push({
						type : '5',
						name : v.name,
						desc : desc.join(','),
						fullDesc : "<span>"+v.name+"</span>" + desc,	
						link : 'http://www.shinhaninvest.com/sp/ranking/main.jsp'
					});
				});
				//log("보유종목 랭킹 list : ", list1);
				d.resolve(_.uniq(list1));
			}
		}, function() {
			d.resolve([]);
		});
		return d.promise();
	}
});

si.service('headerSearch',function($svc){
	var log=$svc.logger('headerSearch');
	return {init:init};
	function init($vo){
		var util = $svc.get('util');
		var predic = $svc.get('predic');
		$vo.hs={};
		//검색어
		$vo.hs.kw={
			query: ko.observable(''),
			queryFocus: ko.observable(false),
			submitQuery: function() {
				log("검색!!");
				log("$vo.hs.kw.query() = " + $vo.hs.kw.query());
				goSearchPage('10');
			},
			onBlur: function() {
				setTimeout(function() {
					log("입력란 focusout!!");
					$("#auto-complete").attr("style", "display:none;");
				}, 500);
			}
		};
		$vo.hs.ac={
			list: ko.observableArray([]),	//자동완성
			menusCount:ko.observable(0),
			menus: ko.observableArray([]),	//메뉴
			prodsCount: ko.observable(0),
			prods: ko.observableArray([]),	//상품
			//자동완성 결과 데이터 키워드 강조
			strongKeyword: function(cont) {
				return util.replaceAll(cont, $vo.hs.kw.query(), '<strong>'+$vo.hs.kw.query()+'</strong>');
			},
			//자동완성 결과 데이터 키워드 강조 처리
			highlightKeyword: function(cont) {
				var contents = util.replaceAll(cont, '<!HS>', '<strong class="srhTxt">');
				contents = util.replaceAll(contents, '<!HE>', '</strong>');
				contents = util.replaceAll(contents, ' > ', ' &gt; ');
				return contents;
			},
			//자동완성 선택 처리
			setAutoComplete: function(data) {
				log("자동완성 data :: ", data);
				$vo.hs.kw.query(data.keyword);
				goSearchPage('10');
			},
			//자동완성 메뉴 선택 처리
			setMenuComplete: function(data) {
				log("메뉴 선택 data :: ", data);
				//메뉴화면 이동
				$svc.get('location').go(data['MENUURL']);
			},
			//자동완성 상품 선택 처리
			setProdComplete: function(data) {
				log("상품 선택 data :: ", data);
				var param = {};
				if(data['ALIAS'] == 'fund') {
					//펀드 상세 이동
					param.fund_code = data['DOCID'];
					param.menuId = '';
					param.tabIdx = '';
					$svc.get('location').go('/siw/wealth-management/fund/599001/view.do', param);
				} else if(data['ALIAS'] == 'els') {
					//ELS/DLS 상세 이동
					param.code = data['DOCID'];
					param.status = 'Y';
					$svc.get('location').go('/siw/wealth-management/els/els-info/view.do', param);
				} else if(data['ALIAS'] == 'bond') {
					//채권 상세 이동
					param.bondCode = data['DOCID'];
			        var option = {height:700, width: 1077};
			        wpopup.open('/siw/wealth-management/bond-rp/590401P02/view-popup.do', '590401P02', param, option);
				} else if(data['ALIAS'] == 'wrap') {
					param.wtc = data['DOCID'];
					param.applyCode = '';
					param.gdsGbnCode = '';
					$svc.get('location').go("/siw/wealth-management/wrap/450001/view.do", param);
				}
			},
			//더보기
			goMoreData: function(tabId) {
				log("tabId = " + tabId);
				goSearchPage(tabId);
			}
		};
		//키워드 trim 처리
		function trimKeyword(cont) {
			var contents = util.replaceAll(cont, '<!HS>', '');
			contents = util.replaceAll(contents, '<!HE>', '');
			return contents;
		}
		//통합검색 화면 이동
		function goSearchPage(tabId) {
			var param = {
				query: $vo.hs.kw.query(),
				tabId: tabId
			};
			$svc.get('location').go('/siw/etc/browse/search/view.do', param);
		}
		//자동완성 설정
		predic.setDelay(500);
		//자동완성 데이터 조회
		predic.setSender(function(param) {
			var prm = {
				query: param,
				includeSearch: 'Y'
			};
			return $svc.get('http').$post("/siw/etc/browse/search04/data.do", prm, false);
		});
		//자동완성 데이터 표시
		predic.setResultListener(function(rsHttp){
			log("rsHttp :: ", rsHttp);
			if($vo.hs.kw.queryFocus() && rsHttp.status == '200') {
				log(rsHttp.data);
				if(rsHttp.data.body && rsHttp.data.body.adata) {
					var body = rsHttp.data.body;
					var adata = undefined;
					try {
						adata = JSON.parse(body.adata);
					} catch (err) {
						log("adata json parse error :: ", err);
					}
					log("adata :: ", adata);
					if(adata.responsestatus == 0 && adata.result[0].totalcount > 0) {
						$vo.hs.ac.list(adata.result[0].items);
						log("list :: ",$vo.hs.ac.list());
						//자동완성 화면표시
						$("#auto-complete").attr("style", "display:block;");
					} else {
						$("#auto-complete").attr("style", "display:none;");
					}
					if(body.sdata && body.sdata.length) {
						_.each(body.sdata, function(v, k) {
							if(v.thisCollection == 'productArk') {
								//상품
								$vo.hs.ac.prodsCount(util.parseInt(v.thisTotalCount));
								$vo.hs.ac.prods(v.itemList);
							} else if(v.thisCollection == 'menuArk') {
								//메뉴
								$vo.hs.ac.menusCount(util.parseInt(v.thisTotalCount));
								$vo.hs.ac.menus(v.itemList);
							}
						});
					}
				} else {
					$("#auto-complete").attr("style", "display:none;");
				}
			} else {
				$("#auto-complete").attr("style", "display:none;");
			}
		});
		//키업 처리
		$(document).on('keyup','#search-word',function(e){
			var param = $('#search-word').val();
			log('입력('+param+')');

			predic.run(param);
		});
		
		// 추천검색어
		$vo.hs.rw={ready:1,list:ko.observableArray([
			['공인인증서','공인인증서'],
			['업무시간','업무시간'],
			['모바일계좌개설','모바일계좌개설'],
			['비과세','비과세'],
			['추천펀드','추천펀드']
		])};
		$(document).off('click.id-hs-rw').on('click.id-hs-rw','#id-hs-rw a',function(){
			var code=$vo.hs.rw.list()[$(this).attr('data-idx')][0];
			log('id-hs-rw',code);
			$svc.get('location').go('/siw/etc/browse/search/view.do',{query:code});
		});
		// 인기검색어
		$vo.hs.fw={ready:1,list:ko.observableArray([])};
		$(document).off('click.id-hs-fw').on('click.id-hs-fw','#id-hs-fw a',function(){
			var code=$vo.hs.fw.list()[$(this).attr('data-idx')];
			log('id-hs-fw',code);
			$svc.get('location').go('/siw/etc/browse/search/view.do', {query:code.content});
		});
		// 추천상품(3)
		$vo.hs.rm={ready:1,list:ko.observableArray([
			['/siw/pension/saving-info/saving_ann_account1/contents.do','연금저축계좌 - 안정적인 노후생활과 세액공제 혜택까지! 연금저축으로 시작하세요','/siw/common/images/common/img_topBanner01.gif'],
			['/siw/wealth-management/isa/isa_intro_tab1/contents.do','신한ISA - 절세형 만능계좌 ISA, 하나의 계좌로 예/적금은 물론 펀드까지~','/siw/common/images/common/img_topBanner02.gif'],
			['/siw/wealth-management/wrap/wrap_ema/contents.do','신한 EMA - 수익률을 위한 최선의 선택! 전문가가 관리하는 신개념 종합자산관리 서비스','/siw/common/images/common/img_topBanner03.gif']
		])};
		$(document).off('click.id-hs-rm').on('click.id-hs-rm','#id-hs-rm a',function(){
			var code=$vo.hs.rm.list()[$(this).attr('data-idx')][0];
			// TODO
			log('id-hs-rm',code);
			$svc.get('location').go(code);
		});
		// 인기상품(Top5)
		$vo.hs.fm={ready:1,list:ko.observableArray([])};
		$(document).off('click.id-hs-fm').on('click.id-hs-fm','#id-hs-fm a',function(){
			var code=$vo.hs.fm.list()[$(this).attr('data-idx')][0];
			page.go('/siw/wealth-management/fund/599001/view.do',{fund_code:code,menuId:'10205003',tabIdx:'000202'});
		});
		$(document).off('click.SIE#headerSearch').on('click.SIE#headerSearch','.gnbUtil>.topSearch>button',function(){
			// 인기검색어
			if($vo.hs.fw.ready){
				$svc.get('http').post("/siw/etc/browse/search03/data.do", {}, false).then(function(body) {
					log("popword body : ", body);
					if(body.result) {
						var data = undefined;
						try {
							data = JSON.parse(body.result);
							log("data : ", data);
							if(data && data.Data) {
								$vo.hs.fw.list(data.Data.Query);
								$vo.hs.fw.ready=false;
							}
						} catch (err) {
							log("error :: ", err);
						}
					}
				});
			}
			// 인기상품(Top5)
			if($vo.hs.fm.ready){
				$svc.get('http').post('/siw/common/non-io/data.do',{pt:'Q1',sc:'112',tr:'SBCC241Q1',wk:'Q',rc:'99999',input:[{v:3,l:1}]},false).then(function(rs){
					$vo.hs.fm.list([]);
					if(rs&&rs['errorCode']=='Z0001'&&rs['반복데이타0']&&rs['반복데이타0'].length){
						$vo.hs.fm.list(_.map(_.filter(_.sortBy(rs['반복데이타0'],0),function(v,k){return k<5}),function(v,k){return [v[2],v[3]];}));
					}
					$vo.hs.fm.ready=false;
				});
			}
			shMenu.totalSearchOpen();
		});
	}
});

si.service('headerGnb',function($svc){
	return {init:init};
	function init($vo){
		// 즐겨찾기
		$(document).on('click','#gnbBookmark',function(){
			if(si.data.isLogin()){
				var menu = $svc.get('menu');
				var menuCode = menu.currentMenucode();
				$svc.get('http').post("/siw/etc/favorite/setMenu/data.do", {type:'add', menuCode:menuCode}, false).then(function(body) {
					$svc.get('lpopup').alert(menu.currentMenuname() + " 메뉴가 즐겨찾기에 추가되었습니다.").then(function() {
						$("#gnbBookmark").focus();
					});
				});
			} else {
				$svc.get('lpopup').alert("로그인 이후 즐겨찾기 추가해 주세요.").then(function() {
					$("#gnbBookmark").focus();
				});
			}
		});

		// 인쇄하기
		$(document).on('click','#gnbPrint',function(){
			page.print();
		});

		// 확대/축소
		$(document).on('click','#gnbZoomTip',function(){
			$svc.get('lpopup').open('layerZoomTipPopup','/siw/common/biz/common/lypop-zoomTip.html').then(function() {
				$("#gnbZoomTip").focus();
			});
		});
	}
});

si.service('pageTopButton',function($svc){
	return {init:init};
	function init($vo){
		if($('[data-page-top-button]').attr('data-page-top-button')!='none'){
			$('body').append('<div id="pageTop" class="pageTop"><a id="page-top-button" href="#">TOP</a></div>');
			$(document).on('click.SIE#btnTop','#pageTop>a#page-top-button',function(){$('body').scrollTop(0)});
		}
	}
});

$(document).ready(function(){
	si.run(function($vo, $svc){
		initUI();
		updateUI();

		$vo.page=page;
		$vo.data=si.data;
		_.each($svc.get('rootBinder').names(),function(v){$vo[v]=$svc.get(v)});

		// logout::default
		$vo.logoutPopup=function(){
			$svc.get('ajax').html(page.link.logout,true,true);
			$svc.get('lpopup').open('layerLogout','/siw/common/biz/common/lypop-logout.html');
		};
		// logout::ib
		$vo.ibLogoutPopup=function(){
			$svc.get('ajax').html(page.link.ibLogout,true,true);
			$svc.get('lpopup').open('layerLogout','/siw/common/biz/common/lypop-ibLogout.html');
		};
		// logout::tops-club
		$vo.topsClubLogoutPopup=function(){
			$svc.get('ajax').html(page.link.logout,true,true);
			$svc.get('lpopup').open('layerLogout','/siw/common/biz/common/lypop-topsClubLogout.html');
		};
		// logout::swap
		$vo.swapLogoutPopup=function(){
			$svc.get('ajax').html(page.link.logout,true,true);
			$svc.get('ajax').html(page.link.swapLogout,true,true);
			$svc.get('lpopup').open('layerLogout','/siw/common/biz/common/lypop-swapLogout.html');
		};

		setTimeout(function(){
			$('.LAYOUTBOX').removeClass('LAYOUTBOX').css('display','');
			updateUI();
		},100);

		if(si.app.filetype().indexOf('-popup')<0){
			if(si.data.menurootCode()=='10000000'){
				$svc.get('headerNotice').init($vo);
				$svc.get('headerSearch').init($vo);
			}
			$svc.get('headerGnb').init($vo);
			$svc.get('pageTopButton').init($vo);
		}

		// 계좌고객 권한 처리
		if(!si.getGoodiAuth()){
			if(si.app.filetype().indexOf('-popup')>0){
				page.error();
			}else{
				$svc.get('lpopup').open('layerLoginAuthPopup','/siw/common/biz/common/lypop-loginGoodiAuth.html');
			}
			return;
		}

		// 공인인증서 권한 처리
		if(!si.getCertAuth()) {
			if(si.app.filetype().indexOf('-popup')>0){
				page.error();
			}else{
				$svc.get('lpopup').open('layerLoginCertPopup','/siw/common/biz/common/lypop-loginCertAuth.html');
			}
			return;
		}

		// 자동로그아웃 타이머
		$svc.get('autoSession').start();

	});
});
})();

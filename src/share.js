(function (doc, win) {
	var docEl = doc.documentElement,
		resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
		recalc = function () {
			var clientWidth = docEl.clientWidth;
			if (!clientWidth) return;
			if (clientWidth > 750) clientWidth = 750;
			docEl.style.fontSize = 10 * (clientWidth / 320) + 'px';
		};

	if (!doc.addEventListener) return;
	win.addEventListener(resizeEvt, recalc, false);
	doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);

$(function () {

	//获取url中的参数
	function getUrlParam(url, name) {
		var theRequest = {};
		if (url.indexOf("?") != -1) {
			var str = url.substr(url.indexOf("?") + 1);
			strs = str.split("&");
			for (var i = 0; i < strs.length; i++) {
				var key = strs[i].substr(0, strs[i].indexOf('='));
				var val = strs[i].substr(strs[i].indexOf('=') + 1, strs[i].length);
				theRequest[key] = val;
			}
		}
		return theRequest[name];
	}
	//浏览器当前窗口可视区域高度
	$(".container").height($(window).height());
	$(".bodyContent").height($(window).height() - $(".footerDiv").height());
	//文档窗口改变时触发自适应
	$(window).resize(function () {
		$(".container").height($(window).height());
		$(".bodyContent").height($(window).height() - $(".footerDiv").height());
		var myScroll = new IScroll(".bodyContent", {
			click: true
		});
	})
	//获取url中的参数油站id
	var oilId = getUrlParam(window.location.href, "oilStationNo");
	//请求油站详情
	$.ajax({
		type: "post",
		contentType: "application/json",
		headers: {
			version: "3.3.0"
		},
		url:'http://agreement.51zhaoyou.com/app/',
		data: '{"oilStationNo": ' + oilId + '}',
		async: true,
		success: function (result) {
			var container = $('.container');
			if (JSON.stringify(result) != '{}') {
				if (result.res) {
					var data = result.res;
					//加载油站图片
					if (data.imageList.length > 0) {
						var imgurl = data.imageList[0].imageUrl;
						$(".img-station", container).children("img").attr('src', imgurl);
					}
					var oilStationName = data.oilStationName, //油站名称
						businessInfo = data.businessInfo, //营业时间
						locationInfo = data.locationInfo; //油站地址
					var oilList = data.oilList;
					var labelVos = data.labelVos;
					//加载页面tilte
					$("title").html(oilStationName);
					//加载油站名称
					$(".name-station", container).text(oilStationName);
					//加载油站营业时间
					$(".time-Station>span:last-child", container).text(businessInfo);
					//加载油站地址
					$(".desc-station>span:last-child", container).text(locationInfo);
					//加载今日油价模板文件
					var templetePrice = document.getElementById("oilprice").innerHTML;
					$(".todayPrice", container).html(templetePrice.repeat(oilList.length));
					//加载今日油价
					var liHtml = $(".todayPrice", container).find("li");
					for (var i = 0; i < oilList.length; i++) {
						var licontainer = $(liHtml[i]);
						//油品信息
						$(".oil-desc", licontainer).text(oilList[i].oilDescribe);
						//优惠金额
						if (oilList[i].discountPrice == null || Number(oilList[i].discountPrice) <= 0) { //没有优惠金额 就删除降价标识
							$(".oil-discount", licontainer).hide();
						} else {
							$(".oil-discount", licontainer).show();
							$(".oil-discount>span:last-child", licontainer).text(oilList[i].discountPrice);
						}
						if (Number(oilList[i].zhaoyouPrice) >= Number(oilList[i].marketPrice)) { //老吕加油大于发改委，就隐藏发改委价格
							//只显示老吕价
							$(".price-market", licontainer).hide();
						} else {
							$(".price-market", licontainer).show();
							//老吕价
							//显示发改委价
							$(".pricemarket", licontainer).text(oilList[i].marketPrice);
							$(".pricezhaoyou", licontainer).text(oilList[i].zhaoyouPrice);
						}
						$(".pricezhaoyou", licontainer).text(oilList[i].zhaoyouPrice);
					}
					//加载油站特色
					if (labelVos.length > 0) { //有油站特色
						$(".lbsDiv", container).show();
						$(".m-station", container).show();
						//加载油站特色模板文件
						var templeteLabel = document.getElementById("labelVos").innerHTML;
						$(".lbsDiv", container).html(templeteLabel.repeat(labelVos.length));
						var labelHtml = $(".lbsDiv", container).find("li");
						for (var i = 0; i < labelVos.length; i++) {
							var labelcontainer = $(labelHtml[i]);
							//标签签名
							$(".lbs", labelcontainer).text(labelVos[i].labelName);
							//标签描述
							$(".lbsdec", labelcontainer).text(labelVos[i].labelDes);
						}
					} else {
						$(".m-station", container).hide();
						$(".lbsDiv", container).hide();
					}
				}
			}
		}
	});
})
/*view-start*/
//根据与当前的间隔生成年列表
var initYearList = function (preSpacing,nextSpacing) {
	var year = util.DateTool.getCurrentYMD().year;
	var yearMenuBox = document.getElementById('dropdown1-menubox');
	for (var i = year-preSpacing; i < year+nextSpacing; i++) {
		var yearMenu = document.createElement("li");
		yearMenu.setAttribute("name","year");
		yearMenu.innerHTML = i+"年";
		if(i == year){
			util.ClassTool.addClass(yearMenu,"active");
		}
		yearMenuBox.appendChild(yearMenu);
	};
};

//设置下拉列表框显示的值
function setDropdownToggleData (year,month,holiday) {
	document.getElementById('yearN').innerHTML = parseInt(year)+'年';
	document.getElementById('monthN').innerHTML = parseInt(month)+'月';
	document.getElementById('holidayN').innerHTML = year+"年假日安排";
	//年
	var years =  document.getElementsByName('year');
	for (var i = 0; i < years.length; i++) {
		util.ClassTool.removeClass(years[i],"active");
		if(parseInt(years[i].innerHTML) == year){
			util.ClassTool.addClass(years[i],"active");
		}
	};
	//月
	var months = document.getElementsByName('month');
	for (var i = 0; i < months.length; i++) {
		util.ClassTool.removeClass(months[i],"active");
		if(parseInt(months[i].innerHTML) == month){
			util.ClassTool.addClass(months[i],"active");
		}
	};
	//节日
	var holidays = document.getElementsByName('holiday');
	for (var i = 0; i < holidays.length; i++) {
		util.ClassTool.removeClass(holidays[i],"active");
	};
	util.ClassTool.addClass(holidays[0],"active");
}
/*
* @purpose 生成日期信息并填入日期表的指定位置
* @param datesEle: dates对象, year：年,month：月,date：日,index：在日期表中的下标,
				 monthFlag：月标识，-1为前一月，0为本月，1为后一月
* @return 
* @exception
*/
function createDateEleText (datesEle,year,month,date,index,monthFlag) {
	//判断该日期是否为今天
	if(util.DateTool.isToday(year,month,date) == true){
		util.ClassTool.addClass(datesEle[index],"today");
	}
	var dayCn = util.calendar.solar2lunar(year,(parseInt(month)+monthFlag+11)%12 + 1,date).IDayCn;
	var term = util.calendar.solar2lunar(year,(parseInt(month)+monthFlag+11)%12 + 1,date).Term;
	//判断是否为农历节气
	var ele = term === null ? "<div>"+dayCn+"</div>" : "<div class='calendar'>"+term+"</div>";
	//初始化日期
	var monthStr = (parseInt(month)+parseInt(monthFlag)+11)%12 + 1;
	var yearStr = parseInt(year);
	if(parseInt(month)+monthFlag <= 0){
		yearStr = yearStr - 1;
	}else if(parseInt(month)+monthFlag > 12){
		yearStr = yearStr + 1;
	}
	var str = yearStr +''+(parseInt(monthStr)< 10 ? "0"+ parseInt(monthStr):parseInt(monthStr))+
						''+(parseInt(date) < 10 ? ("0"+ parseInt(date)) :parseInt(date));
	datesEle[index].setAttribute("value",str);
	datesEle[index].innerHTML = date + ele;
}

//根据年月填充日期表
function initDateTable (year,month,activeDate) {
	//显示日期表的所有行
	var ctr = document.getElementsByName('ctr');
	for (var i = 0; i < ctr.length; i++) {
		util.Css.setCss(ctr[i],{display: "table-row"});
	};
	//清空日期表的类，只保留click类
	var dates = document.getElementsByName('date');
	for (var i = 0; i < dates.length; i++) {
		var classes = util.ClassTool.getClasses(dates[i]);
		for (var j = 0; j < classes.length; j++) {
			if (classes[j] != 'click') {
				util.ClassTool.removeClass(dates[i],classes[j]);
			}
		};
	};
	var dateCount = util.DateTool.getDateCountByYearAndMonth(year,month);
	var preDateCount = util.DateTool.getDateCountByYearAndMonth(year,month-1);

	var day = util.DateTool.getDayByDate(year,month,1);//获得month月的第一天的星期
	day = day > 0 ? day :day+7;
	//初始化前一月
	for (var i = 0; i < day-1; i++) {
		createDateEleText(dates,year,month,preDateCount-day+2+i,i,-1);
		util.ClassTool.addClass(dates[i],"preMonth");
	};
	//出始化本月
	for (var i = 1; i <= dateCount; i++) {
		createDateEleText(dates,year,month,i,i+day-2,0);
	};
	//初始化后一月
	for (var i = 1; i < dates.length-dateCount-day + 2; i++) {
		createDateEleText(dates,year,month,i,dateCount+day+i-2,1);
		util.ClassTool.addClass(dates[dateCount+day+i-2],"nextMonth");
	};
	//判断是否需要最后一行
	if(dateCount+day-2 <= 34){
		util.Css.setCss(ctr[ctr.length - 1],{display: "none"});
	}
	//处理传入的activeDate
	if(typeof activeDate != "undefined"){
		for (var i = 0; i < dates.length; i++) {
			util.ClassTool.removeClass(dates[i],"click");
			var dateStr = dates[i].getAttribute("value");
			if (dateStr.substring(6) == activeDate) {
				if(dateStr.substring(4,6) == month){
					util.ClassTool.addClass(dates[i],"click");
				}
			}
		};
	}
}

/*
	右侧详细信息设置
*/
function setRigthInfo (y,m,d) {
	var fullMonth = parseInt(m) < 10?'0'+ parseInt(m) : parseInt(m);
	var fullDate = parseInt(d) < 10?'0'+ parseInt(d) : parseInt(d);
	var mDateobj = document.getElementById('right-date');
	var mNumObj = document.getElementById('right-number');
	var mLunarObj = document.getElementsByName('right-lunar');
	var mDate = y+'-'+fullMonth+'-'+fullDate+
							' '+util.DateTool.getDayByIndex(util.DateTool.getDayByDate(y,m,d));
	var constellation = util.DateTool.getConstellation(m,d);
	var date = util.calendar.solar2lunar(y,m,d);
	var mLunar=[date.IMonthCn+date.IDayCn,date.gzYear+"年"+date.gzMonth+"月"+date.gzDay+"日",
							'['+date.Animal+'年]'+constellation]
	mDateobj.innerHTML = mDate;
	mNumObj.innerHTML = parseInt(d);
	for (var i = 0; i < mLunarObj.length; i++) {
		mLunarObj[i].innerHTML = mLunar[i];
	};
}
//动态加载当前时间
setInterval(function  () {
	var showTime = document.getElementById('showTime');
	showTime.innerHTML = util.DateTool.getCurrentTime();
},1000);

//页面初始化
(function () {
	//下拉菜单初始化
	initYearList(30,70);
	var date = util.DateTool.getCurrentYMD();
	//日期初始化
	initDateTable(date.year,date.month,date.date);
	var months = document.getElementsByName('month');
	for (var i = 0; i < months.length; i++) {
		if(parseInt(months[i].innerHTML) == date.month){
			util.ClassTool.addClass(months[i],"active");
		}
	};
	//右侧信息出始化
	setRigthInfo(date.year,date.month,date.date);
	
})();
/*view-end*/
/*control-start*/
//获取用户选中的日期
function getActiveDate(){
	var dates = document.getElementsByName('date');
	for (var i = 0; i < dates.length; i++) {
		if(util.ClassTool.hasClass(dates[i],"click")){
			var dateStr = dates[i].getAttribute("value");
			return {'year':dateStr.substring(0,4),
				'month':dateStr.substring(4,6),
				'date':dateStr.substring(6)
			};
		}else if(util.ClassTool.hasClass(dates[i],"today")){
			var dateStr = dates[i].getAttribute("value");
			return {'year':dateStr.substring(0,4),
				'month':dateStr.substring(4,6),
				'date':dateStr.substring(6)
			};
		}
	}
}
// 下拉列表控制
function dropdown (toggleIdOrEl,menuIdOrEl) {
	var toggle =  (typeof toggleIdOrEl === "string") ? document.getElementById(toggleIdOrEl):toggleIdOrEl;
	toggle.onclick = function() {
		if ( util.Css.getStyle(menuIdOrEl,"display") == "none") {
			util.Css.setCss(menuIdOrEl,{display: "block"});
		}else{
			util.Css.setCss(menuIdOrEl,{display: "none"});
		}
	};
}
//下拉菜单的点击事件
function onDropdownMenuCilck (id,togId,menuboxId) {
	var ele = document.getElementsByName(id);
	for (var i = 0; i < ele.length; i++) {
		(function () {
			ele[i].onclick = function  () {
				//清空列表的class
				for (var j = 0; j < ele.length; j++) {
					util.ClassTool.removeClass(ele[j],"active");
				};
				var text = this.innerHTML;
				util.ClassTool.addClass(this,"active");
				document.getElementById(togId).innerHTML = this.innerHTML;
				util.Css.setCss(menuboxId,{display: "none"});
				//TODO处理1.日期table的显示 2.右侧详细信息显示问题
				var yearN = parseInt(document.getElementById('yearN').innerHTML)+'';
				var monthN = parseInt(document.getElementById('monthN').innerHTML)+'';
				initDateTable(yearN,monthN);
				var d = getActiveDate();
				setRigthInfo(yearN,monthN,d.date);
			}
		})(); 
	};
}
//绑定下拉菜单点击事件
(function  () {
	dropdown('year','dropdown1-menubox');
	dropdown('month','dropdown2-menubox');
	dropdown('holiday','dropdown3-menubox');
	onDropdownMenuCilck ("year","yearN",'dropdown1-menubox');
	onDropdownMenuCilck ("month","monthN",'dropdown2-menubox');
	onDropdownMenuCilck ("holiday","holidayN",'dropdown3-menubox');
})();
//翻页控制flag:1表示向后 -1表示向前
function changePage (ToggleObj,flag) {
	var yearN = document.getElementById('yearN').innerHTML;
	var monthN = document.getElementById('monthN').innerHTML;
	if (ToggleObj.innerHTML == yearN) {
		yearN = parseInt(yearN)+flag;
	}else if (ToggleObj.innerHTML == monthN) {
		if (parseInt(monthN)+flag <= 0) {
			yearN = parseInt(yearN) - 1;
		}else if (parseInt(monthN)+flag > 12) {
			yearN = parseInt(yearN) + 1;
		}
		monthN = (parseInt(monthN)+flag+11)%12 + 1;
	}
	setDropdownToggleData (parseInt(yearN),parseInt(monthN));
	initDateTable(parseInt(yearN),parseInt(monthN));
	var d = getActiveDate()
	setRigthInfo(parseInt(yearN),parseInt(monthN),d.date);
}
//绑定翻页事件
var yearPre = document.getElementById('yearPre');
yearPre.onclick = function () {
	changePage(document.getElementById('yearN'),-1);
}
var yearNext = document.getElementById('yearNext');
yearNext.onclick = function () {
	changePage(document.getElementById('yearN'),1);
}
var monthPre = document.getElementById('monthPre');
monthPre.onclick = function () {
	changePage(document.getElementById('monthN'),-1);
}
var monthNext = document.getElementById('monthNext');
monthNext.onclick = function () {
	changePage(document.getElementById('monthN'),1);
}

//绑定table中日期点击事件
var dates = document.getElementsByName('date');
for (var i = 0; i < dates.length; i++) {
	var len = dates.length;
	(function (i){
		dates[i].onclick = function () {
			for (var j = 0; j < len; j++) {
				util.ClassTool.removeClass(dates[j],"click");
			};
			util.ClassTool.addClass(this,"click"); 
			var dateStr = dates[i].getAttribute("value");
			//处理点击日期为前一月情况
			if(util.ClassTool.hasClass(dates[i],"preMonth")){
				setDropdownToggleData(dateStr.substring(0,4),dateStr.substring(4,6));
				initDateTable(dateStr.substring(0,4),dateStr.substring(4,6),dateStr.substring(6));	
			}
			if(util.ClassTool.hasClass(dates[i],"nextMonth")){
				initDateTable(dateStr.substring(0,4),dateStr.substring(4,6),dateStr.substring(6));
				setDropdownToggleData(dateStr.substring(0,4),dateStr.substring(4,6));
			}
			//处理右侧侧详细信息显示问题
			setRigthInfo(dateStr.substring(0,4),dateStr.substring(4,6),dateStr.substring(6));		     	
	  }
	})(i);
};
//返回今天
var backTodayObj = document.getElementById('backToday');
backTodayObj.onclick = function () {
	var date = util.DateTool.getCurrentYMD();
	initDateTable(date.year,date.month,date.date);
	setDropdownToggleData(date.year,date.month);
	setRigthInfo(date.year,date.month,date.date);
}
/*control-start*/

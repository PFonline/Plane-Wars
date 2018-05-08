
	var scores = 0;
	var scoreDom = document.getElementsByClassName("socre")[0];
	var warArea = document.getElementsByClassName("warArea")[0];
	var gamePage = document.getElementsByClassName("gamePage")[0];
	var fly_1_url = "image/enemy1_fly_1.png";
	var fly_1_boom_url = "image/enemy1_boom_1.gif";
	var fly_2_url = "image/enemy2_fly_1.png";
	var fly_2_boom_url = "image/enemy2_boom_1.gif";
	var fly_3_url = "image/enemy3_fly_1.png";
	var fly_3_boom_url = "image/enemy3_boom_1.gif";
	var flyGroup = new Array;
	var centerBullets = new Array;
	var leftBullets = new Array;
	var rightBullets = new Array;
	var bulletGroup = new Array;
	var myFly = null;
	var myFlySpeed = 3;
	var creatTimer = null;
	/*小飞机 速度3 1炮消灭*/ 
    var fly_1 = new EnemyFly(34,24,50,-24,fly_1_url,fly_1_boom_url,3,1,false);
	/*小飞机 速度2 2炮消灭*/ 
	var fly_2 = new EnemyFly(46,60,50,-60,fly_2_url,fly_2_boom_url,2,2,false);
	/*小飞机 速度1 5炮消灭*/ 
	var fly_3 = new EnemyFly(110,169,50,-169,fly_3_url,fly_3_boom_url,1,5,false);

	/*设置全屏页面*/ 
	(function(){
		var row = document.getElementsByClassName("row")[0];
		var startPage = document.getElementsByClassName("startPage")[0];
		var width = window.screen.width > 415 ? 350 + "px": window.screen.width + "px";
		var height = window.screen.width > 415 ? 621.25 + "px": window.screen.height + "px";
		row.style.width = startPage.style.width = gamePage.style.width = warArea.style.width = width;
		row.style.height = startPage.style.height = gamePage.style.height = warArea.style.height = height;
	})();

	/*生成从minNum到maxNum的随机数*/
	function randomNum(minNum,maxNum){ 
	    switch(arguments.length){ 
	        case 1: 
	            return parseInt(Math.random()*minNum+1,10); 
	        break; 
	        case 2: 
	            return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10); 
	        break; 
	            default: 
	                return 0; 
	            break; 
	    } 
	}

	/*数组中删除对象方法*/
	function deleteFun(_arr,_obj) {
	    var length = _arr.length;
	    for(var i = 0; i < length; i++){
	        if(_arr[i] == _obj){
	            if(i == 0){
	                _arr.shift(); //删除并返回数组的第一个元素
	                return;
	            }else if(i == length-1){
	                _arr.pop();  //删除并返回数组的最后一个元素
	                return;
	            }else{
	                _arr.splice(i,1); //删除下标为i的元素
	                return;
	            }
	        }
	    }
	};

	/*在水平方向产生随机位置*/ 
	function randomDis(flyName){
		return(Math.random()*(warArea.offsetWidth-flyName.flyWidth));
	}

	/*更新分数*/
	function updateScore(_this){
		scores += _this.flyScore;
		scoreDom.innerHTML = scores;
	}


/*------------------------------------------------------------------------*/	
	/*敌方飞机类*/ 	
	function EnemyFly(flyWidth,flyHeight,leftDis,topDis,imgUrl,boomUrl,speed,power,flyScore,isAlive){
		this.flyWidth = flyWidth;
		this.flyHeight = flyHeight;
		this.leftDis = leftDis;
		this.topDis = topDis;
		this.imgUrl = imgUrl;
		this.boomUrl = boomUrl;
		this.imgNode = null;
		this.speed = speed;
		this.power = power;
		this.flyScore = flyScore;
		this.isAlive = isAlive;
		this.isPause = false;
		this.timer = null;
		this.flyMove = function(){
			var _this = this;
			var temp = this.imgNode;
			var speed = this.speed;
			clearInterval(_this.timer);
			this.timer = setInterval(function(){
				if(flyOutArea(_this.imgNode)){
					flyOutArea(_this.imgNode);
					deleteFun(flyGroup,_this);
					clearInterval(_this.timer);
				}else if(!_this.isPause){
					if(scores <= 10000){
						temp.style.top = temp.offsetTop + speed + "px";
						myFlySpeed = 2;
					}else if(scores > 10000 && scores <= 20000){
						temp.style.top = temp.offsetTop + (speed + 1) + "px";
						myFlySpeed = 3;
					}else if(scores > 20000 && scores <= 30000){
						temp.style.top = temp.offsetTop + (speed + 2) + "px";
						myFlySpeed = 4;
					}else if(scores > 30000 && scores <= 40000){
						temp.style.top = temp.offsetTop + (speed + 3) + "px";
						myFlySpeed = 5;
					}else if(scores > 40000 && scores <= 50000){
						temp.style.top = temp.offsetTop + (speed + 4) + "px";
						myFlySpeed = 6;
					}else{
						temp.style.top = temp.offsetTop + (speed + 5) + "px";
						myFlySpeed = 7;
					}
				}
			},20);
		}
		this.isFlyOut = function(){
			var _this = this;
			if (flyOutArea(this.imgNode)) {
				clearInterval(this.timer);
				flyOutArea(this.imgNode);
				deleteFun(flyGroup,_this);
			}
		} 
		this.init = function(){
			this.imgNode = document.createElement("img");
			this.imgNode.style.left = this.leftDis + "px";
			this.imgNode.style.top = this.topDis + "px";
			this.imgNode.src = imgUrl;
			if(this.isAlive){
				warArea.appendChild(this.imgNode);
			};
			this.flyMove();
		}
		this.flyPause = function(){
			this.isPause = true;
		}
		this.flyContinue = function(){
			this.isPause = false;
		}
		/*敌方飞机爆炸*/ 
		this.changState = function(arg){
			this.isAlive = arg;
			if(!this.isAlive){
				this.imgNode.style.display = "none";
				this.imgNode.src = this.boomUrl;
				this.imgNode.style.display = "block";
				var this_fly = this.imgNode;
				/*优化方向：设置定时器，使飞机在爆炸后还可以滑行，时间小于<1s*/ 
				clearInterval(this.timer);
				/*warArea移除图片节点*/ 
				window.setTimeout(function(){
					warArea.removeChild(this_fly);
				},1000);
				/*flyGroup中移除该元素*/ 
				deleteFun(flyGroup,this);
				updateScore(this);
			}
		}
		this.init();
	};

	/*判断飞机是否超出页面区域及超出后删除节点*/
	function flyOutArea(node){
			if(node.offsetTop >= parseInt(warArea.style.height)){
				warArea.removeChild(node);
				return true;
			}
			return false;
	}

	/*停止所有敌方战机*/
	function stopAllFly(){
		for (var i = 0; i < flyGroup.length; i++) {
			flyGroup[i].flyPause();
		}
	}

	/*敌方飞机类型*/
	function flyType(flyName){
		if(flyName === fly_1){
 			return(new EnemyFly(34,24,randomDis(flyName),-randomNum(25,40),fly_1_url,fly_1_boom_url,3,1,100,true))
 		}else if(flyName === fly_2){
 			return(new EnemyFly(46,60,randomDis(flyName),60-randomNum(65,80),fly_2_url,fly_2_boom_url,2,2,200,true))
 		}else if(flyName === fly_3){
 			return(new EnemyFly(110,169,randomDis(flyName),-randomNum(170,200),fly_3_url,fly_3_boom_url,1,5,500,true))
 		}else{}
	}

	/*产生敌方飞机*/
	function creatFly(num,flyName){
		 for(var i = 0; i < num; i++){
		 	flyGroup.push(flyType(flyName));
		 }
	}
	
	/*停止产生敌方飞机*/
	function stopCreatFly(){
		clearInterval(creatTimer);
	}
	/*初始化敌方飞机排布*/ 
	function beginCreatFly(){
		creatTimer = setInterval(function(){
			if (scores <= 1000) {
				creatFly(1,fly_1);
			}else{
				if (scores % 600 == 0) {
					creatFly(1,fly_2);
				}if (scores % 1000 == 0) {
					creatFly(1,fly_3);
				}else{
					creatFly(1,fly_1);
				}
			}
		},500)
	}

	/*子弹类*/
/*----------------------------------------------------------------------------------*/
	function Bullets(bWidth,bHeight,bLeftDis,bTopDis,bPower,bImgurl,bSpeed,isBoom){
	 	this.bWidth = bWidth;
	 	this.bHeight = bHeight;
	 	this.bLeftDis = bLeftDis;
	 	this.bTopDis = bTopDis;
	 	this.bPower = bPower;
	 	this.bImgurl = bImgurl;
	 	this.bImgNode = null;
	 	this.bTimer = null;
	 	this.bSpeed = bSpeed;
	 	this.isBoom = isBoom;
	 	this.bMove = function(){
	 		var _this = this;
	 		var temp = this.bImgNode;
	 		this.bTimer = setInterval(function(){
	 			if(!_this.isBoom){
	 				if(temp.offsetTop <= 0){
	 					_this.bDelete();
	 					deleteFun(bulletGroup,_this);
	 					clearInterval(_this.bTimer);
	 				}else{
	 					temp.style.top = temp.offsetTop - _this.bSpeed + "px";
	 				}
	 			}else{

	 			}
	 		},10)
	 	}
	 	this.bStop = function(){
	 		clearInterval(this.bTimer);
	 	}

	 	this.bDelete = function(){
	 		clearInterval(this.bTimer);
	 		warArea.removeChild(this.bImgNode);
	 		deleteFun(bulletGroup,this);
	 	}
	 	var flag = 0;
	 	this.init = function(){
	 		this.bImgNode = document.createElement("img");
	 		if(flag === 0){
	 			this.bImgNode.style.left = this.bLeftDis + "px";
				this.bImgNode.style.top = this.bTopDis + "px";
				flag = 1;
	 		}else{
	 			this.bImgNode.style.left = this.bImgNode.offsetLeft + "px";
				this.bImgNode.style.top = this.bImgNode.offsetTop + "px";
	 		}
			this.bImgNode.src = this.bImgurl;
			if(!this.isBoom){
				warArea.appendChild(this.bImgNode);
			}
			this.bMove();
			shootSuccess();
	 	}
	 	this.init();
	}

	/*我方战机类*/
/*----------------------------------------------------------------------------------*/
	function MyFly(myFlyWidth,myFlyHeight,myFlyLeftDis,myFlyTopDis,myFlyImgSrc,myFlyBoomSrc,myFlyPower,myFlyIsAlive){
	 	this.myFlyWidth = myFlyWidth;
	 	this.myFlyHeight = myFlyHeight;
	 	this.myFlyLeftDis = myFlyLeftDis;
	 	this.myFlyTopDis = myFlyTopDis;
	 	this.myFlyNode = null;
	 	this.myFlyImgSrc = myFlyImgSrc;
	 	this.myFlyBoomSrc = myFlyBoomSrc
	 	this.myFlyPower = myFlyPower;
	 	this.myFlyIsAlive = myFlyIsAlive;
	 	this.myFlyMove = function(){
	 		//拖拽功能(主要是触发三个事件：onmousedown\onmousemove\onmouseup)  
		    var drag = document.getElementsByClassName('myFly')[0]; 
		    //点击某物体时，用drag对象即可，move和up是全局区域，也就是整个文档通用，应该使用document对象而不是drag对象(否则，采用drag对象时物体只能往右方或下方移动)  
			/*电脑端拖动*/
			drag.onmousedown = function(e) {  
		        var e = e || window.event; //兼容ie浏览器  
		        var diffX = e.clientX - drag.offsetLeft; //鼠标点击物体那一刻相对于物体左侧边框的距离=点击时的位置相对于浏览器最左边的距离-物体左边框相对于浏览器最左边的距离  
		        var diffY = e.clientY - drag.offsetTop;  
		        /*低版本ie bug:物体被拖出浏览器可是窗口外部时，还会出现滚动条，  
		            解决方法是采用ie浏览器独有的2个方法setCapture()\releaseCapture(),这两个方法，  
		            可以让鼠标滑动到浏览器外部也可以捕获到事件，而我们的bug就是当鼠标移出浏览器的时候，  
		            限制超过的功能就失效了。用这个方法，即可解决这个问题。注：这两个方法用于onmousedown和onmouseup中*/  
	            if(typeof drag.setCapture!='undefined'){  
	                drag.setCapture();  
	            }  
		        document.onmousemove = function(e) {  
		            var e = e || window.event; //兼容ie浏览器  
		            var left=e.clientX-diffX;  
		            var top=e.clientY-diffY;  
		            var screenWidth = parseInt(warArea.style.width);
		            var screenHeight = parseInt(warArea.style.height);
		            //控制拖拽物体的范围只能在浏览器视窗内，不允许出现滚动条  
		            if(left<0){  
		                left=0;  
		            }else if(left > screenWidth-drag.offsetWidth){  
		                left = screenWidth-drag.offsetWidth;  
		            }
		            if(top<0){  
		                top=0;  
		            }else if(top >screenHeight-drag.offsetHeight){  
		                top = screenHeight-drag.offsetHeight;  
		            }  
		            //移动时重新得到物体的距离，解决拖动时出现晃动的现象  window.innerHeight
		            drag.style.left = left+ 'px';  
		            drag.style.top = top + 'px';  
		        };  
		        document.onmouseup = function(e) { //当鼠标弹起来的时候不再移动  
		            this.onmousemove = null;  
		            this.onmouseup = null; //预防鼠标弹起来后还会循环（即预防鼠标放上去的时候还会移动）  
		            //修复低版本ie bug  
		            if(typeof drag.releaseCapture!='undefined'){  
		                drag.releaseCapture();  
		            };  
		        };  
		    };
			/*手机端拖动*/
		    var oW,oH;
			// 绑定touchstart事件
			drag.addEventListener("touchstart", function(e) {
			    console.log(e);
			    var touches = e.touches[0];
			    oW = touches.clientX - drag.offsetLeft;
			    oH = touches.clientY - drag.offsetTop;
			    //阻止页面的滑动默认事件
			    document.addEventListener("touchmove",defaultEvent,false);
			},false)
		 
			drag.addEventListener("touchmove",function(e) {
			    var touches = e.touches[0];
			    var oLeft = touches.clientX - oW;
			    var oTop = touches.clientY - oH;
			    if(oLeft < 0) {
			        oLeft = 0;
			    }else if(oLeft > document.documentElement.clientWidth - drag.offsetWidth) {
			        oLeft = (document.documentElement.clientWidth - drag.offsetWidth);
			    }
			    drag.style.left = oLeft + "px";
			    drag.style.top = oTop + "px";
			},false);
			drag.addEventListener("touchend",function() {
				document.removeEventListener("touchmove",defaultEvent,false);
			},false);
			function defaultEvent(e) {
			   e.preventDefault();
			}		
		}
		/*按键或触屏移动飞机*/ 
        this.move = function(){
        	//获取Div元素
            var oDiv = document.getElementsByClassName("myFly")[0];
            //创建各个方向条件判断初始变量
            var left = false;
            var right = false;
            var top = false;
            var bottom = false;

            //当按下对应方向键时，对应变量为true
            document.onkeydown = function(ev){
                var oEvent = ev || event;
                var keyCode = oEvent.keyCode;
                switch(keyCode){
                    case 37:
                        left=true;
                        break;
                    case 38:
                        top=true;
                        break;
                    case 39:
                        right=true;
                        break;
                    case 40:
                        bottom=true;
                        break;
                }
            };

            setInterval(function(){
                //当其中一个条件为true时，则执行当前函数（移动对应方向）
                var screenWidth = parseInt(warArea.style.width);
                var screenHeight = parseInt(warArea.style.height);
                if(left){
                	if(oDiv.offsetLeft <= 0){
                		oDiv.style.left = 0;
                	}
                	oDiv.style.left = oDiv.offsetLeft-myFlySpeed+"px";
                }else if(top){
                	if(oDiv.offsetTop <= 0){
                		oDiv.style.top = 0;
                	}
                	oDiv.style.top = oDiv.offsetTop-myFlySpeed+"px";
                }else if(right){
                	if(oDiv.offsetLeft >= screenWidth - oDiv.offsetWidth){
                		oDiv.style.left = screenWidth - oDiv.offsetWidth + "px";
                	}
                	oDiv.style.left = oDiv.offsetLeft+myFlySpeed+"px";
                }else if(bottom){
                	if(oDiv.offsetTop >= screenHeight - oDiv.offsetHeight){
                		oDiv.style.top = screenHeight - oDiv.offsetHeight + "px";
                	}
                    oDiv.style.top = oDiv.offsetTop+myFlySpeed+"px";
                }
            },10);

            //执行完后，所有对应变量恢复为false，保持静止不动
            document.onkeyup = function(ev){
                var oEvent = ev || event;
                var keyCode = oEvent.keyCode;
                switch(keyCode){
                    case 37:
                        left=false;
                        break;
                    case 38:
                        top=false;
                        break;
                    case 39:
                        right=false;
                        break;
                    case 40:
                        bottom=false;
                        break;
                }
            }
        }

	 	this.shootBullet = function(){
	 		/*-1是为使子弹从飞机中心飞出*/ 
	 		var x = parseInt(this.myFlyNode.offsetLeft+parseInt(this.myFlyWidth/2)-1);
	 		var y = parseInt(this.myFlyNode.offsetTop-14);
	 		if (scores < 10000) {
	 			 /*中间炮弹*/
	 			bulletGroup.push(new Bullets(6,14,x,y,1,"image/bullet1.png",10,false))
		 		//centerBullets.push(new Bullets(6,14,x,y,1,"image/bullet1.png",3,false)) 
	 		}else if (scores >=10000 && scores < 30000){
	 			/*左边炮弹*/ 
	 			bulletGroup.push(new Bullets(6,14,x-22,y+30,1,"image/bullet1.png",8,false))
		 		/*右边炮弹*/
		 		bulletGroup.push(new Bullets(6,14,x+20,y+30,1,"image/bullet1.png",8,false));
	 		}else {
	 			/*中间炮弹*/
	 			bulletGroup.push(new Bullets(6,14,x,y,1,"image/bullet1.png",8,false))
		 		/*左边炮弹*/ 
	 			bulletGroup.push(new Bullets(6,14,x-22,y+30,1,"image/bullet1.png",8,false))
		 		/*右边炮弹*/
		 		bulletGroup.push(new Bullets(6,14,x+20,y+30,1,"image/bullet1.png",8,false));
	 		}	    
	 	}
	 	this.myFlyBoom = function(arg){
			if(arg){
				console.log("die")
				stopAllFly();
				stopCreatFly();
				this.myFlyNode.style.display = "none";
				this.myFlyNode.src = "image/my_boom.gif";
				this.myFlyNode.style.display = "block";
				this.myFlyIsAlive = false;
			}
	 	}
	 	this.judgeDie = function(){
	 		var judgeTimer = null;
	 		setInterval(function(){
	 			myFlyDie();
	 			if(!this.myFlyIsAlive){
	 				clearInterval(judgeTimer);
	 			}
	 		},100);
	 	}
	 	this.init = function(){
	 		this.myFlyNode = document.createElement("img");
			this.myFlyNode.style.left = this.myFlyLeftDis + "px";
			this.myFlyNode.style.top = this.myFlyTopDis + "px";
			this.myFlyNode.style.cursor = "move";
			this.myFlyNode.src = myFlyImgSrc;
			this.myFlyNode.classList.add("myFly");
			var _this = this;
			if(this.myFlyIsAlive){
				warArea.appendChild(this.myFlyNode);
				var bTimer = null;
		 		clearInterval(bTimer);
		 		bTimer = setInterval(function(){
		 			_this.shootBullet();
			 	},100)
			}
			this.judgeDie();
	 	}
	 	this.init();
	}

	/*产生我方飞机*/ 
	function creatMyFly(){
		var x = parseInt((warArea.offsetWidth-66)/2);
	 	var y = parseInt(warArea.offsetHeight-80);
		myFly = new MyFly(66,80,x,y,"image/my.gif","image/my_boom.gif",1,true);
	}

	/*检测子弹是否击中敌机*/
	function shootSuccess(){
		for (var i = flyGroup.length - 1; i >=0 ; i--) {
			for (var j = bulletGroup.length - 1; j >= 0; j--) {
				if(flyGroup[i]){
					if((bulletGroup[j].bImgNode.offsetLeft >= flyGroup[i].leftDis)&&(bulletGroup[j].bImgNode.offsetLeft <= flyGroup[i].imgNode.offsetLeft + flyGroup[i].flyWidth)){
						if((bulletGroup[j].bImgNode.offsetTop <= flyGroup[i].imgNode.offsetTop + flyGroup[i].flyHeight)&&(bulletGroup[j].bImgNode.offsetTop + bulletGroup[j].bHeight > flyGroup[i].imgNode.offsetTop)){
							flyGroup[i].flyPause();
							flyGroup[i].changState(false);
							bulletGroup[j].bDelete();
						}
					}
				}
			}
		}
	}

	/*检测我方飞机与敌机碰撞*/
	function myFlyDie(){
		for (var i = flyGroup.length - 1; i >= 0; i--) {
			if (flyGroup[i]) {
				if ((flyGroup[i].leftDis + flyGroup[i].flyWidth >= myFly.myFlyLeftDis)&&(flyGroup[i].leftDis <= myFly.myFlyLeftDis + myFly.myFlyWidth)) {
					if ((flyGroup[i].imgNode.offsetTop + flyGroup[i].flyHeight >= myFly.myFlyNode.offsetTop)&&(flyGroup[i].imgNode.offsetTop <= myFly.myFlyHeight + myFly.myFlyNode.offsetTop)) {
						flyGroup[i].changState(false);
						myFly.myFlyBoom(true);
					}
				}
			}
		}
	}
/*----------------------------------------------------------------------------------*/
	/*游戏初始化*/
	$(".startBtn").click(function(){
		$(".startPage").hide();
		$(".gamePage").show();
		creatMyFly();
		beginCreatFly();
		myFly.myFlyMove();
		myFly.move();
	});

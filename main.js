var mainDiv=document.getElementById("maindiv");
var scorediv=document.getElementById("scorediv");
var scorelabel=document.getElementById("label");
var lifelabel=document.getElementById("life");
var enddiv=document.getElementById("enddiv");
var planscore=document.getElementById("planscore");
var scores=0;
var life=100;
 
//飞机类
function plane(hp,X,Y,sizeX,sizeY,score,dietime,speed,boomimage,imagesrc){
    this.planeHp=hp;
    this.planeX=X;
    this.planeY=Y;
    
    this.plansizeX=sizeX;
    this.plansizeY=sizeY;
    this.planscore=score;
    this.plandietime=dietime;
    this.planspeed=speed;
    this.planboomimage=boomimage;

    this.planeDie=false;
    this.plandietimes=0;
    this.imagenode=null;

    //移动行为(针对敌机)
    this.planeMove=function(){
        if(scores<=100){
            this.imagenode.style.top=this.imagenode.offsetTop+this.planspeed+"px";
        }
        else if(scores>100&&scores<=200){
            this.imagenode.style.top=this.imagenode.offsetTop+this.planspeed+1+"px";
        }
        else if(scores>200&&scores<=300){
            this.imagenode.style.top=this.imagenode.offsetTop+this.planspeed+2+"px";
        }
        else if(scores>400&&scores<=500){
            this.imagenode.style.top=this.imagenode.offsetTop+this.planspeed+3+"px";
        }
        else if(scores>500&&scores<=600){
            this.imagenode.style.top=this.imagenode.offsetTop+this.planspeed+4+"px";
        }
        else{
            this.imagenode.style.top=this.imagenode.offsetTop+this.planspeed+5+"px";
        }
    }
    this.init=function(){
        this.imagenode=document.createElement("img");
        this.imagenode.style.left=this.planeX+"px";
        this.imagenode.style.top=this.planeY+"px";
        this.imagenode.src=imagesrc;
        mainDiv.appendChild(this.imagenode);
    }
    this.init();
}
 
//子弹类
function bullet(X,Y,sizeX,sizeY,imagesrc){
    this.bulletX=X;
    this.bulletY=Y;
    this.bulletsizeX=sizeX;
    this.bulletsizeY=sizeY;

    this.bulletimage=null;
    this.bulletattach=1;
    
    //移动行为
    this.bulletmove=function(){
        this.bulletimage.style.top=this.bulletimage.offsetTop-20+"px";
    }
    this.init=function(){
        this.bulletimage=document.createElement("img");
        this.bulletimage.style.left= this.bulletX+"px";
        this.bulletimage.style.top= this.bulletY+"px";
        this.bulletimage.src=imagesrc;
        mainDiv.appendChild(this.bulletimage);
    }
    this.init();
}
 

 //创建单行子弹类
function oddbullet(X,Y){
    bullet.call(this,X,Y,6,14,"image/bullet1.png");
}
 

//创建敌机类 
function enemy(hp,a,b,sizeX,sizeY,score,dietime,speed,boomimage,imagesrc){
    plane.call(this,hp,random(a,b),-100,sizeX,sizeY,score,dietime,speed,boomimage,imagesrc);
}
//产生min到max之间的随机数
function random(min,max){
    return Math.floor(min+Math.random()*(max-min));
}
 

//创建本方飞机类
function ourplan(X,Y){
    var imagesrc="image/own.png";
    plane.call(this,1,X,Y,66,80,0,660,0,"image/本方飞机爆炸.png",imagesrc);
    this.imagenode.setAttribute('id','ourplan');
}


 //创建本方飞机
var selfplan=new ourplan(120,485);
    //ourPlan==selfplan.imagenode

//移动事件
var ourPlan=document.getElementById('ourplan');
var move=function(){
    var disX = 0;
    var disY = 0;
    //dis为mainDiv与浏览器页面的距离
    this.onclick = function(ev){
        var ev = ev || window.event;
        disX = ev.clientX - ourPlan.offsetLeft;
        disY = ev.clientY - ourPlan.offsetTop;


        mainDiv.addEventListener("mousemove",function(ev){
            var ev = ev || window.event;
            ourPlan.style.left = ev.clientX - disX + 'px';
            ourPlan.style.top = ev.clientY - disY + 'px';
            //不超过边界，但是右边界出现问题
            if(ourPlan.style.top>525+'px'){
                 ourPlan.style.top=525+'px'
            }
            if(ourPlan.style.left<0+'px'){
                 ourPlan.style.left=0+'px'
            }
        });   
    }
}


//初始化隐藏本方飞机
ourPlan.style.display="none";
 

//敌机对象数组
var enemys=[];
 

//子弹对象数组
var bullets=[];
var mark=0;
var num=0;
var backgroundPositionY=0;

//开始函数
function start(){
    //背景滚动
    mainDiv.style.backgroundPositionY=backgroundPositionY+"px";
    backgroundPositionY+=0.5;
    if(backgroundPositionY==568){
        backgroundPositionY=0;
    }
    mark++;
    
    //创建敌方飞机
    if(mark==20){
        num++;
        //中飞机
        if(num%5==0){
            enemys.push(new enemy(5,20,260,46,60,5,400,random(1,2),"image/飞机爆炸.png","image/enemy2_fly_1.png"));
        }
        //大飞机
        if(num==20){
            enemys.push(new enemy(10,30,240,110,164,10,500,1,"image/飞机爆炸.png","image/enemy3_fly_1.png"));
            num=0;
        }
        //小飞机
        else{
            enemys.push(new enemy(1,10,280,34,24,1,300,random(1,3),"image/飞机爆炸.png","image/enemy1_fly_1.png"));
        }
        mark=0;
    }
 

    //移动敌方飞机
    var enemyslen=enemys.length;
    for(var i=0;i<enemyslen;i++){
        if(enemys[i].planeDie!=true){
            enemys[i].planeMove();
        }

        //如果敌机超出边界,删除敌机
        if(enemys[i].imagenode.offsetTop>600){
            mainDiv.removeChild(enemys[i].imagenode);
            enemys.splice(i,1);
            enemyslen--;
        }
        //当敌机死亡标记为true时，经过一段时间后清除敌机
        if(enemys[i].planeDie==true){
            enemys[i].plandietimes+=20;
            if(enemys[i].plandietimes==enemys[i].plandietime){
                mainDiv.removeChild(enemys[i].imagenode);
                enemys.splice(i,1);
                enemyslen--;
            }
        }
    }
 
    //创建子弹
    if(mark%5==0){
            bullets.push(new oddbullet(parseInt(selfplan.imagenode.style.left)+31,parseInt(selfplan.imagenode.style.top)-10));
    }
 

    //移动子弹
    var bulletslen=bullets.length;
    for(var i=0;i<bulletslen;i++){
        bullets[i].bulletmove();

        //如果子弹超出边界,删除子弹
        if(bullets[i].bulletimage.offsetTop<0){
            mainDiv.removeChild(bullets[i].bulletimage);
            bullets.splice(i,1);
            bulletslen--;
        }
    }
 

    // 碰撞判断
    for(var j=0;j<enemyslen;j++){
        if(enemys[j].imagenode.offsetLeft+enemys[j].plansizeX>=selfplan.imagenode.offsetLeft&&enemys[j].imagenode.offsetLeft<=selfplan.imagenode.offsetLeft+selfplan.plansizeX){
            if(enemys[j].imagenode.offsetTop+enemys[j].plansizeY>=selfplan.imagenode.offsetTop+40&&enemys[j].imagenode.offsetTop<=selfplan.imagenode.offsetTop-20+selfplan.plansizeY){
                life--;
                console.log(life);
                lifelabel.innerHTML=life;
                enemys[j].imagenode.src=enemys[j].planboomimage;
                enemys[j].planeDie=true;
                if(life==0){
                    selfplan.imagenode.src="image/本方飞机爆炸.gif";
                    enddiv.style.display="block";
                    planscore.innerHTML=scores;
                    //移除事件无效果
                    /*if(document.removeEventListener){
                        mainDiv.removeEventListener("mousemove",move,true);
                    }
                    else if(document.detachEvent){
                        mainDiv.detachEvent("onmousemove",move);
                    }*/
                    clearInterval(set);
                }else if(life<0){
                    life=0;
                    lifelabel.innerHTML=life;
                }
            }
        }

        for(var k=0;k<bulletslen;k++){
            if((bullets[k].bulletimage.offsetLeft+bullets[k].bulletsizeX>enemys[j].imagenode.offsetLeft)&&(bullets[k].bulletimage.offsetLeft<enemys[j].imagenode.offsetLeft+enemys[j].plansizeX)){
                if(bullets[k].bulletimage.offsetTop<=enemys[j].imagenode.offsetTop+enemys[j].plansizeY&&bullets[k].bulletimage.offsetTop+bullets[k].bulletsizeY>=enemys[j].imagenode.offsetTop){
                    //敌机血量减子弹攻击力
                    enemys[j].planeHp=enemys[j].planeHp-bullets[k].bulletattach;
                    //敌机血量为0，敌机图片换为爆炸图片，死亡标记为true，计分
                    if(enemys[j].planeHp==0){
                        scores+=enemys[j].planscore;
                        scorelabel.innerHTML=scores;
                        enemys[j].imagenode.src=enemys[j].planboomimage;
                        enemys[j].planeDie=true;
                    }
                    //删除子弹
                    mainDiv.removeChild(bullets[k].bulletimage);
                        bullets.splice(k,1);
                        bulletslen--;
                        break;
                }
            }
        }
    }   
}

//开始游戏按钮点击事件
var set;
function begin(){
    move();
    startdiv.style.display="none";
    mainDiv.style.display="block";
    selfplan.imagenode.style.display="block";
    scorediv.style.display="block";
    lifediv.style.display="block";
   
    //调用开始函数
    set=setInterval(start,20);
}
//游戏结束后点击继续按钮事件
function jixu(){
    location.reload(true);
}

var baseurl = "http://house.kexec.top";

$(function(){
    // 切换语言
    $(".dropdown").click(function(){
        var menu = $(this).find(".dropdown-menu");
        menu.show();
        $(document.body).one("click",function(){menu.hide()})
        return false;
    })
    $(".change-lang .item").click(function(){
        var ts = $(this);
        ts.parents(".change-lang").hide();
        alert(ts.data("id"))
        return false;
    });
    // 客服
    if(KeFu){
        KeFu.initialize("house.kexec.top", 'index');
    }
    // 关闭
    $(".cls-layer").click(function(){
        if(!layer){return}
        layer.closeAll();
    });
    // 登录
    logininfo();
    $("#header .menu-login").click(openLogin);
})
// 检测登录
function logininfo(){
    var header = $("#header");
    if(localStorage.getItem("token")){
        header.find(".showlogin").hide();
        header.find(".userinfo").show().find("a").html(localStorage.getItem("username"));
    }
}
// 登陆
function openLogin(){
    if(!layer){return;}
    var layerIndex = layer.open({
        type: 1,
        title: false,
        closeBtn: 1,
        area: "530px",
        content: '<div id="loginbox" class="c_33">'+
            '<div class="fs_30">Login</div>'+
            '<div class="fs_16 mt_10">No account? Can go to <span id="toregister" class="cur_point c_style">Register</span></div>'+
            '<form id="loginform">'+
                '<input class="email mt_20 layui-input" type="text" placeholder="email" />'+
                '<input class="pwd mt_20 layui-input" type="password" placeholder="password" />'+
                '<button type="submit" class="mt_20 com-btn">login</button>'+
                //'<div class="mt_30 txt_c">'+
                //    '<span id="tofindpwd" class="fs_16 c_style cur_point">Forget Password</span>'+
                //'</div>'+
            '</form>'+
        '</div>'
    });
    $("#toregister").click(function(){
        layer.closeAll();
        openRegister();
    });
    $("#tofindpwd").click(function(){
        layer.closeAll();
        openFindPwd();
    })
    $("#loginform").submit(function(){
        var ts = $(this);
        var email =  ts.find(".email").val();
        var pwd = ts.find(".pwd").val();

        if(!email){layer.msg("请输入账号");return false}
        if(!/^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/.test(email)){layer.msg("邮箱格式不正确");return false}
        if(!pwd){layer.msg("请输入密码");return false}
        if((!/^[a-zA-Z][a-zA-Z]*\d+[a-zA-Z]*$/.test(pwd)) || (pwd.length<6)){layer.msg("密码以字母开头，字母加数字不低于6位");return false;}

        $.ajax({
            type: "post",
            url: baseurl+"/api/User/login",
            // contentType: "multipart/form-data",
            data: {
                email: email,
                password: pwd,
            },
            dataType:"json",
            success:function(data){
                if(data.code!==0){layer.msg(data.msg); return false;}
                localStorage.setItem("token",data.data.token);
                localStorage.setItem("username",email);
                layer.close(layerIndex);
                layer.msg("登录成功！");
                logininfo();
            }
        })
        return false;
    })
}
// 找回密码
function openFindPwd(){
    if(!layer){return;}
    layer.open({
        type: 1,
        title: false,
        closeBtn: 1,
        area: "530px",
        content: '<div id="loginbox" class="c_33">'+
            '<div class="fs_30">Forget Password</div>'+
            '<div class="fs_16 mt_10">Go to <span id="tologin" class="cur_point c_style">Login</span></div>'+
            '<form id="findpwdform">'+
                '<input class="email mt_20 layui-input" type="text" placeholder="email"  />'+
                '<div class="df ai-c just-c-bet mt_20">'+
                    '<input class="code layui-input code-input" type="input" placeholder="code" />'+
                    '<button id="getcode" type="button" class="getcode-btn layui-btn layui-btn-primary">Get code</button>'+
                '</div>'+
                '<input class="newpwd mt_20 layui-input" type="text" placeholder="new password"  />'+
                '<button type="submit" class="mt_20 com-btn">login</button>'+
                // '<div class="mt_30 txt_c">'+
                //     '<span class="fs_16 c_style cur_point">Forget Password</span>'+
                // '</div>'+
            '</form>'+
        '</div>'
    })
    $("#tologin").click(function(){
        layer.closeAll();
        openLogin();
    })
    $("#getcode").click(function(){
        alert("getCode");
    })
    $("#findpwdform").submit(function(){
        var ts = $(this);
        console.log(ts.find(".email").val())
        console.log(ts.find(".code").val())
        
        return false;
    })
}
// 注册
function openRegister(){
    if(!layer){return;}
    var layerIndex = layer.open({
        type: 1,
        title: false,
        closeBtn: 1,
        area: "530px",
        content: '<div id="loginbox" class="c_33">'+
            '<div class="fs_30">Register</div>'+
            '<div class="fs_16 mt_10">Have account ！Go to <span id="tologin" class="cur_point c_style">Login</span></div>'+
            '<form id="registerform">'+
                '<input class="email mt_20 layui-input" type="text" placeholder="email"  />'+
                '<input class="pwd mt_20 layui-input" type="password" placeholder="password" />'+
                '<button type="submit" class="mt_20 com-btn">Register</button>'+
                // '<div class="mt_30 txt_c">'+
                //     '<span class="fs_16 c_style cur_point">Forget Password</span>'+
                // '</div>'+
            '</form>'+
        '</div>'
    })
    $("#tologin").click(function(){
        layer.closeAll();
        openLogin();
    })
    $("#registerform").submit(function(){
        var ts = $(this);
        var email = ts.find(".email").val();
        var pwd = ts.find(".pwd").val();
        
        if(!email){layer.msg("请输入账号");return false}
        if(!/^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/.test(email)){layer.msg("邮箱格式不正确");return false}
        if(!pwd){layer.msg("请输入密码");return false}
        if((!/^[a-zA-Z][a-zA-Z]*\d+[a-zA-Z]*$/.test(pwd)) || (pwd.length<6)){layer.msg("密码以字母开头，字母加数字不低于6位");return false;}

        $.ajax({
            type: "post",
            url: baseurl+"/api/User/reg",
            // contentType: "multipart/form-data",
            data: {
                email: email,
                password: pwd,
            },
            dataType: "json",
            success:function(data){
                if(data.code!==0){layer.msg(data.msg); return false;}
                localStorage.setItem("token",data.data.token);
                localStorage.setItem("username",email);
                layer.close(layerIndex);
                layer.msg("注册成功！");
                logininfo();
            }
        })
        return false;
    })
}

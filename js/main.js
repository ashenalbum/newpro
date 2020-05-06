var baseurl = "http://house.kexec.top";

$(function(){
    // 菜单
    $("#header .islogin").click(function(){
        if(!testLogin()){
            openLogin();
            layer.msg("请先登录",{time: 1000});
            return false;
        }
    })
    // 切换语言
    changeLang();
    $(".dropdown").click(function(){
        var menu = $(this).find(".dropdown-menu");
        menu.show();
        $(document.body).one("click",function(){menu.hide()})
        return false;
    });
    $(".change-lang .item").click(function(){
        var ts = $(this);
        ts.parents(".change-lang").hide();
        localStorage.setItem("lang",ts.data("id"));
        changeLang();
        return false;
    });
    // 客服
    if(KeFu){
        KeFu.initialize("house.kexec.top", 'index');
        localStorage.removeItem("kefu_button_coordinate");
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
// 切换语言
function changeLang(){
    var lang = localStorage.getItem("lang");
    if(!lang){lang = "en"}
    if(lang=="cn"){
        $(".lang-cn").show();
        $(".lang-en").hide();
        $("#header .sellang").html("简体中文(CN)");
    } else if(lang=="en") {
        $(".lang-en").show();
        $(".lang-cn").hide();
        $("#header .sellang").html("English(EN)");
    }
    $("["+lang+"-ph]").each(function(){
        var ts = $(this);
        ts.attr("placeholder",ts.attr(lang+"-ph"));
    });

    var htmlLang = "";
    switch(lang){
        case "en":htmlLang="en";break;
        case "cn":htmlLang="zh";break;
    }
    document.documentElement.setAttribute("lang",htmlLang);
}
// 是否登录
function testLogin(){
    return !!localStorage.getItem("token");
}
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
            '<div class="fs_30"><span class="lang lang-cn">登录</span><span class="lang lang-en">Login</span></div>'+
            '<div class="fs_16 mt_10">'+
                '<span class="lang lang-cn">没有账户？去</span>'+
                '<span class="lang lang-en">No account? Can go to </span>'+
                '<span id="toregister" class="cur_point c_style">'+
                    '<span class="lang lang-cn">注册</span><span class="lang lang-en">Register</span>'+
                '</span>'+
            '</div>'+
            '<form id="loginform">'+
                '<input class="email mt_20 layui-input" type="text" placeholder="email" cn-ph="邮箱" en-ph="email" />'+
                '<input class="pwd mt_20 layui-input" type="password" placeholder="password" cn-ph="密码" en-ph="password" />'+
                '<button type="submit" class="mt_20 com-btn"><span class="lang lang-cn">登录</span><span class="lang lang-en">login</span></button>'+
                '<div class="mt_30 txt_c">'+
                   '<span id="tofindpwd" class="fs_16 c_style cur_point"><span class="lang lang-cn">找回密码</span><span class="lang lang-en">Forget Password</span></span>'+
                '</div>'+
            '</form>'+
        '</div>',
        success: function(){
            changeLang();
        }
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
    });
}
// 找回密码
function openFindPwd(){
    if(!layer){return;}
    var layerIndex = layer.open({
        type: 1,
        title: false,
        closeBtn: 1,
        area: "530px",
        content: '<div id="loginbox" class="c_33">'+
            '<div class="fs_30"><span class="lang lang-cn">找回密码</span><span class="lang lang-en">Forget Password</span></div>'+
            '<div class="fs_16 mt_10">'+
                '<span class="lang lang-cn">去</span><span class="lang lang-en">Go to </span>'+
                '<span id="tologin" class="cur_point c_style">'+
                    '<span class="lang lang-cn">登录</span><span class="lang lang-en">Login</span>'+
                '</span>'+
            '</div>'+
            '<form id="findpwdform">'+
                '<input class="email mt_20 layui-input" type="text" placeholder="email" cn-ph="邮箱" en-ph="email" />'+
                '<div class="df ai-c just-c-bet mt_20">'+
                    '<input class="code layui-input code-input" type="number" placeholder="code" cn-ph="验证码" en-ph="code" />'+
                    '<button id="getcode" type="button" class="getcode-btn layui-btn layui-btn-primary"><span class="lang lang-cn">获取验证码</span><span class="lang lang-en">Get code</span></button>'+
                '</div>'+
                '<input class="pwd mt_20 layui-input" type="password" placeholder="new password" cn-ph="新密码" en-ph="new password"  />'+
                '<button type="submit" class="mt_20 com-btn"><span class="lang lang-cn">确定</span><span class="lang lang-en">Login</span></button>'+
                // '<div class="mt_30 txt_c">'+
                //     '<span class="fs_16 c_style cur_point">Forget Password</span>'+
                // '</div>'+
            '</form>'+
        '</div>',
        success: function(){
            changeLang();
        }
    })
    $("#tologin").click(function(){
        layer.closeAll();
        openLogin();
    })
    $("#getcode").click(function(){
        var email = $(this).parents("form").find(".email").val();
        if(!email){layer.msg("请输入邮箱");return false}
        if(!/^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/.test(email)){layer.msg("邮箱格式不正确");return false}
        $.ajax({
            type: "post",
            url: baseurl + "/api/User/getMailCode",
            data: {email: email},
            dataType: "json",
            success: function(data){
                if(data.code!==0){layer.msg(data.msg); return false;}
                layer.msg("发送成功");
            }
        });
    });
    $("#findpwdform").submit(function(){
        var ts = $(this);
        var email = ts.find(".email").val();
        var code = ts.find(".code").val();
        var pwd = ts.find(".pwd").val();
        if(!email){layer.msg("请输入邮箱");return false}
        if(!/^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/.test(email)){layer.msg("邮箱格式不正确"); return false}
        if(!code){layer.msg("请输入验证码"); return false;}
        if(!pwd){layer.msg("请输入新密码"); return false;}
        if((!/^[a-zA-Z][a-zA-Z]*\d+[a-zA-Z]*$/.test(pwd)) || (pwd.length<6)){layer.msg("密码以字母开头，字母加数字不低于6位");return false;}
        
        $.ajax({
            type: "post",
            url: baseurl + "/api/User/resetPassword",
            data: {
                email: email,
                code: code,
                password: pwd,
            },
            dataType: "json",
            success: function(data){
                if(data.code!==0){layer.msg(data.msg); return false;}
                layer.close(layerIndex);
                openLogin();
                layer.msg("修改成功，请重新登录！", {time:1000});
            }
        })
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
            '<div class="fs_30"><span class="lang lang-cn">注册</span><span class="lang lang-en">Register</span></div>'+
            '<div class="fs_16 mt_10">'+
                '<span class="lang lang-cn">已经有账户！去</span><span class="lang lang-en">Have account ！Go to </span>'+
                '<span id="tologin" class="cur_point c_style"><span class="lang lang-cn">登录</span><span class="lang lang-en">Login</span></span>'+
            '</div>'+
            '<form id="registerform">'+
                '<input class="email mt_20 layui-input" type="text" placeholder="email" cn-ph="邮箱" en-ph="email"  />'+
                '<input class="pwd mt_20 layui-input" type="password" placeholder="password" cn-ph="密码" en-ph="password" />'+
                '<button type="submit" class="mt_20 com-btn"><span class="lang lang-cn">注册</span><span class="lang lang-en">Register</span></button>'+
                // '<div class="mt_30 txt_c">'+
                //     '<span class="fs_16 c_style cur_point">Forget Password</span>'+
                // '</div>'+
            '</form>'+
        '</div>',
        success: function(){
            changeLang();
        }
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

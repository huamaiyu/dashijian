$(function() {
        //调用getUserInfo() 获取用户基本信息
        getUserInfo()

        var layer = layui.layer
            //点击按钮退出登录功能
        $('#btnLogout').on('click', function() {
            layer.confirm('确定退出登录', { icon: '', title: '提示' },
                function(index) {
                    localStorage.removeItem('token')
                    location.href = '/login.html'
                        //关闭confirm提示框
                    layer.close(index)
                })
        })
    })
    //获取用户的基本信息
function getUserInfo() {
    $.ajax({
        method: "GET",
        url: '/my/userinfo',
        Header: {
            Authorization: localStorage.getItem('token') || ''
        },
        success: function(res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败')
            }
            //调用渲染用户头像的函数
            // console.log(res);
            renderAvatar(res.data)
        }
    })
}
//渲染用户的头像
function renderAvatar(user) {
    //获取用户名称
    var name = user.nickname || user.username
        //设置欢迎的文本
    $('#welcome').html('欢迎&nbsp;&nbsp' + name)
        //按需渲染用户的头像
    if (user.user_pic !== null) {
        //渲染图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        //渲染文字头像
        $('.layui-nav-img').hide()
        var first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
    }
}
$(function() {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.page
        // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function(date) {
            const dt = new Date(date)

            var y = dt.getFullYear()
            var m = padZero(dt.getMonth() + 1)
            var d = padZero(dt.getDate())

            var hh = padZero(dt.getHours())
            var mm = padZero(dt.getMinutes())
            var ss = padZero(dt.getSeconds())

            return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
        }
        //定义补0的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }
    //定义一个查询的参数对象   将来请求数据的时候  需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1, //页码值 默认请求第一页的数据
        pagesize: 2, //每页显示几条  默认显示两条
        cate_id: '', //文章分类的ID
        state: '' //文章的发布状态
    }



    initTable()
    intiCate()



    //获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败')
                }
                // layer.msg('获取文章列表成功')
                // console.log(res);
                //使用模板引擎渲染页面的数据
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                    //调用渲染分页的方法
                renderPage(res.total)
            }
        })
    }
    //初始化文章分类的方法
    function intiCate() {
        $.ajax({
            method: "GET",
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类失败')
                }
                var htmlStr = template('tpl-cate', res)
                    // console.log(htmlStr);
                $('select[name="cate_id"]').html(htmlStr)
                    //通知layui重新渲染表单区域的UI结构 
                form.render()
            }
        })
    }


    $('#form-search').on('submit', function(e) {
            e.preventDefault()
            q.cate_id = $('select[name="cate_id"]').val()
            q.state = $('select[name="state"]').val()
            initTable()
        })
        //定义渲染分页的方法
    function renderPage(total) {
        //调用laypage.render()方法来渲染分页的结构
        laypage.render({
            elem: 'pageBox',
            count: total,
            limit: q.pagesize,
            curr: q.pagenum,
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            //分页发生切换的时候  触发jump函数
            jump: function(obj, first) {
                q.pagenum = obj.curr
                q.pagesize = obj.limit
                if (!first) {
                    initTable()
                }
            }
        })
    }
    //通过代理的方式 为删除按钮绑定点击事件处理函数
    $('tbody').on('click', '.btn-delete', function() {
        var id = $(this).attr('data-id')
        var len = $('.btn-delete').length
        layer.confirm('确认删除？', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败')
                    }
                    layer.msg('删除文章成功')
                    if (len === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }
            })
            layer.close(index)
        })
    })

})
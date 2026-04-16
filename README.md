# 电影网站

一个部署在腾讯云：https://console.cloud.tencent.com/edgeone/pages

上的电影网站，仅供学习部署技巧不得商业运营，

否则一切相关被追责的后果自负。

文件结构

movie-kv/index.html

movie-kv/functions/api/search.js
   
部署步骤

下载 movie-kv 文件夹

压缩成 ZIP

上传到 EdgeOne Pages

不需要创建 KV，不需要绑定任何东西

速度快	后端直接请求影视源，无代理转发

无 CORS	后端请求，不受浏览器跨域限制

简单	只需要 2 个文件，不需要 KV

稳定	不依赖公共代理服务

易修改	修改源直接改代码重新部署

# 也可以绑定 KV

创建并绑定 KV

控制台左侧菜单 → 「KV 存储」

点击 「创建命名空间」

名称：movie_kv

进入你的项目 → 「设置」 → 「KV 存储绑定」

点击 「添加绑定」

变量名：SOURCES（必须大写）

KV 空间：选择 movie_kv

点击 「保存」

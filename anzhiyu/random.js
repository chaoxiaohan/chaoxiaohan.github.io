var posts=["2024/07/09/hello-world/","2024/07/09/测试测试一级标题/","2024/07/19/测试/","2023/03/26/快速开始/"];function toRandomPost(){
    pjax.loadUrl('/'+posts[Math.floor(Math.random() * posts.length)]);
  };
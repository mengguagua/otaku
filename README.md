### otaku-宅
尝试用node写一个后端服务，类似论坛v2ex，git issue

目录结构

    src // 代码目录
    
        -dto // 实体目录
        
        -filter // 过滤器目录
        
        -guards // 授权守卫。处理鉴权逻辑
        
        -Interceptors // 类似java的AOP。1、在方法执行之前/之后绑定额外的逻辑。2、转换函数返回的结果。3、转换函数抛出的异常。4、扩展基本功能行为。5、根据特定条件完全覆盖函数
        
        -middleware // 中间s件目录。根据接口路径拦截请求，如处理日志功能这样的中间件
        
        -user等 // 业务目录:包括controller和service
        
        -app.module // 模块文件：controller、service、拦截器、过滤器等需要在这里注册
        
        -main.ts // 入口文件

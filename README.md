### otaku-宅
尝试用node写一个后端服务，类似论坛v2ex，git issue

### 后端相关技术

后端框架是nestjs：https://docs.nestjs.com/

操作数据库框架是typeorm：https://typeorm.io/entities

数据库：mysql

### 目录结构

- src // 代码目录

     - filter // 过滤器目录
     
     - guards // 授权守卫。处理鉴权逻辑
     
     - Interceptors // 类似java的AOP。1、在方法执行之前/之后绑定额外的逻辑。2、转换函数返回的结果。3、转换函数抛出的异常。4、扩展基本功能行为。5、根据特定条件完全覆盖函数
     
     - middleware // 中间s件目录。根据接口路径拦截请求，如处理日志功能这样的中间件
     
     - app.module // 模块文件：controller、service、拦截器、过滤器等需要在这里注册
     
     - main.ts // 入口文件
     
     - dto // 定义前端传递后端服务的类，在这个类里进行必填，和一些正则校验。
     
       >  命名规则：业务名称-接口名称.dto.ts，如ath-login.dto.ts
     
     - user等 // 业务目录:包括controller，service和module（框架建议一个模块内容放在一个文件夹内）

### 主体功能

#### 框架基础

**main.ts文件**，使用NestFactory传入AppModule，生成应用对象，设置监听端口启动应用。

**AppModule类**，使用@Module装饰器，声明数据库配置，实体类，控制器，中间件，拦截器等。

**控制器（controllers）**，定义接口路径，调用服务层（service），返回操作数据库结果

**模块（Module**），可以理解为注册中心，所有业务的`子模块module`都要在AppModule内声明

**子模块**，每个实体业务，独立声明一个module，用来注册TypeOrm，service，controller

**TypeOrm**，对象关系映射库，即通过操作实体，来操作数据库，实现增删改查等

> es7装饰器，如@Controller。一种和类(class)相关的语法，用来修改类和类的方法。装饰器是一种函数，写成`@+函数名`，它可以放在**类**或者**类的方法**前。
>
> ```js
> // 给类加装饰器
> @testable
> class MyClass{}
> // 定义好装饰器内容 
> function testable(target){
>     target.isTestable=true
> }
> // 查看装饰器的修改效果 
> console.log(MyClass.isTestable) // true。
> ```
>

#### 用户操作/登录

##### 创建用户接口

1、创建UserController类，用装饰器**@Controller**，**@Post**定义接口路径

2、创建用户实体User类，用`@Entity`定义实体，`@PrimaryGeneratedColumn`定义主键，`@Column`定义数据库字段

> @Column()设置对象，常用设置为 { default: '', unique: true, }。具体配置项见https://typeorm.io/entities

3、UserController类里定义方法，用`@Body() user: User`装饰器+实体类来接收入参。

> 用postman工具调试，入参选项切到Body / raw / JSON 或者 x-www-form-urlencoded方式传值

4、声明UserController类构造函数`constructor(private userService: UserService) {}`，nestjs框架会同时声明和注入userService对象。

5、`this.userService`调用类的对象，再`this.userService.addUser(user)`调用对象方法，同时传入参数。

6、创建UserService类，用`@Injectable()`装饰这个类会将service类标记为`提供者(provider)`，目的是在第4步，可以用来注入userService对象。

7、创建UsersModule类(子模块)，用`@Module`注册各个模块，以供主模块声明时候调用。


> 下面是子模块的注册例子
> ```js
> @Module({
>     // 使用 forFeature() 方法来定义在当前范围内注册哪些repositories
>     imports: [TypeOrmModule.forFeature([User])],
>     providers: [UserService],
>     controllers: [UserController],
> })
> ```

8、声明UserService类的构造方法，通过`@InjectRepository(User)`实现操作数据库对象的注入

```js
constructor(
      @InjectRepository(User)
      private usersRepository: Repository<User>,
) {}
```

9、声明UserService的类方法，接收参数，通过`Repository`实例的内置方法操作数据库，`save`是新增

```js
async addUser(user: User) {
  await this.usersRepository.save(user);
}
```

> Repository实例的api见：https://typeorm.io/repository-api

10、将UsersModule子模块在AppModule的@Module装饰器内声明。将User映射到表，声明在下方entities

```js
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'xxx',
      database: 'otaku',
      // 关注这一行
      entities: [User],
      synchronize: true, // 指示是否应在每次应用程序启动时自动创建数据库架构。生产中改false
    }),
    // 关注这一行
    UserModule,
  ],
 	...
})
```

> 本地安装要mysql数据库，设置正确对应的host/端口/用户/密码/数据库

11、最终效果，typeorm框架会创建`user`表，插入对应数据。

[<img src="https://z1.ax1x.com/2023/10/18/piP7hrD.png" alt="piP7hrD.png" style="zoom: 33%;" />](https://imgse.com/i/piP7hrD)

##### 用户登录接口



### 小窍门

1、快速生成一个模块的文件和基础代码（会生成在src路径下）

```sh
$ nest g module auth
$ nest g controller auth
$ nest g service auth
```

2、nestjs自带的dto校验装饰器列表

参考：https://blog.csdn.net/qq_38734862/article/details/117265394

3、nestjs官方教程代码例子

地址：https://github.com/nestjs/nest/tree/master/sample/19-auth-jwt

4、JwtModule的配置项说明

地址：https://github.com/auth0/node-jsonwebtoken#jwtsignpayload-secretorprivatekey-options-callback

n、mysql

- root / Gcc@163.com / otaku


















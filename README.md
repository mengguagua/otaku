### otaku-宅
尝试用node写一个后端服务，类似论坛v2ex，git issue

### 后端相关技术

后端框架是nestjs：https://docs.nestjs.com/

> 建议先通读OVERVIEW全部章节：https://docs.nestjs.com/first-steps

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

#### 部分接口说明

目的：通过编写接口的过程，逐步理解js后端生态，和各种技术概念和作用

tip：使用[postman](https://www.postman.com/)工具调试接口

##### 创建用户

> 需要理解，`装饰器`，`实体类@Entity`，`注入`，`提供者(provider)`，`模块@Module`，`TypeOrm`，`mysql`这些内容的是什么概念，有什么作用。

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

##### 用户登录/鉴权

> 需要理解，`dto`, `dto装饰器`, `Guards`, `JWT`, `postman`这些内容的是什么概念，有什么作用。

1、使用命令快速创建auth模块。类似上述user模块在AuthController类创建login方法，入参设置Dto类型

```sh
$ nest g module auth
$ nest g controller auth
$ nest g service auth
```

2、创建入参对应的dto类，使用`@IsNotEmpty`等装饰器，校验入参，接受入参（[dto装饰器选项](https://blog.csdn.net/qq_38734862/article/details/117265394)）

```js
import {IsNotEmpty} from "class-validator";
export class AuthLoginDto {
    @IsNotEmpty({message: '手机号不能为空'})
    phone: string;

    @IsNotEmpty({message: '密码不能为空'})
    password: string;
}
```

3、入参需要正则校验的字段，自定义正则工具方法

> 如果工具是js文件，需要tsconfig.json文件里设置`"allowJs": true`

4、AuthService类创建登录验证方法，验证逻辑如下：

- 通过手机号得到数据库的用户信息(用户密码)

- 判断数据库的用户密码是否等于接口入参密码

- 通过JwtService加密用户信息，返回token。JWT需要在@Module()里注册，声明加密密钥和过期时间

  > ```js
  > imports: [
  >   UserModule, // 鉴权需要使用userService内的方法，获取用户信息所以要导入
  >   JwtModule.register({
  >     global: true,
  >     secret: jwtConstants.secret,
  >     signOptions: { expiresIn: '7d' },
  >   }), // 模块都是先导入再使用，所以JwtModule也一样。
  > ],
  > ```

```js
async signIn(phone: string, pass: string): Promise<any> {
      let user = await this.userService.findOne(phone);
      if (user?.password != pass) {
          throw new UnauthorizedException(); // 密码错误
      }
      const payload = { sub: user.id, username: user.phone }; // 加密，解密后也是拿到这个内容
      // 解构写法，password是user属性，取用后，result这个自定义的对象就是user去掉password后的内容
      const {password, ...result} = user; // token包含的用户信息去掉密码。
      return {
          access_token: await this.jwtService.signAsync(payload), // 创建token
          ...result
      };
  }
```

5、创建鉴权类AuthGuard继承CanActivate，实现验证token，并可从token获取用户信息

> CanActivate是Guards(守卫)，框架定义的，在http请求到接口路由处理之间，形式类似拦截器，主要用于鉴权。

- 获取request对象，解析headers头获取Authorization的值，获取token。Authorization值的格式是：**Bearer空格token**

- 将token和密钥给JWT解析方法，解析成功则返回用户信息，失败则抛异常给catch捕获

- @Module里设置全局路由Guards

  > ```
  > providers: [
  >   AuthService,
  >   // 设置全局路由鉴权
  >   {
  >     provide: APP_GUARD,
  >     useClass: AuthGuard,
  >   }
  > ]
  > ```

```js
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) {}
  
  	// CanActivate接口方法，拦截后会默认执行
    async canActivate(context: ExecutionContext): Promise<boolean> {
        // 拦截路由，判断鉴权
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new UnauthorizedException();
        }
        try {
            const payload = await this.jwtService.verifyAsync(token, {secret: jwtConstants.secret});
            // 赋值给request可以在路由处理程序中访问它
            request['user'] = payload;
        } catch {
            throw new UnauthorizedException();
        }
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
```

6、自定义一个装饰器@Public()，在解析token的逻辑里获取装饰器，跳过鉴权

```js
import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
// 使用 SetMetadata 装饰器工厂函数创建自定义装饰器
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
```

```js
async canActivate(context: ExecutionContext): Promise<boolean> {
    		// 拦截路径，是否跳过鉴权
        const isPublic =  this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [context.getHandler(), context.getClass()]);
        if (isPublic) {
            return true;
        }
				.......
}
```

```js
// 登录接口跳过拦截
@Public()
@Post('login')
login(@Body() authLoginDto: AuthLoginDto) {
    if (! validatePhoneNumber(authLoginDto.phone)) {
        return {message: '手机号验证错误'}
    }
    return this.authService.signIn(authLoginDto.phone, authLoginDto.password);
}
```

postman调用login效果

[![piAwFbT.png](https://z1.ax1x.com/2023/10/23/piAwFbT.png)](https://imgse.com/i/piAwFbT)

[![piAwePJ.png](https://z1.ax1x.com/2023/10/23/piAwePJ.png)](https://imgse.com/i/piAwePJ)

##### 一对多实体的增/删/改/查

1、**定义Link实体**。User:Link 是 1:n的关系。官网文档是使用`@ManyToOne` 和 `@RelationId`，在User实体也要定义`@OneToMany`，定义比较繁琐，目的是支持用Repository的函数来处理一对多的关系。

**实际场景建议使用普通的@Column定义userId关联User表，然后用Repository.query(sql)，直接写sql语句去查询**。

```typescript
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  RelationId,
  CreateDateColumn,
  DeleteDateColumn, UpdateDateColumn
} from 'typeorm';
import {User} from "../user/user.entity";

export enum linkType {
  NEWS = '新闻',
  GAME = '游戏',
  TECHNOLOGY = '技术',
  QA = '问答',
  HAPPY = '乐趣',
}

@Entity()
export class Link {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({default: ''})
  name: string;

  @Column({
    // unique: true,
    default: ''
  })
  url: string;

  @DeleteDateColumn({nullable: false})
  deleteFlag: string;

  @Column({default: 0})
  clickNumber: string;

  @Column({ default: false })
  isPublic: boolean;

  // 点赞数
  @Column({default: 0})
  goodNumber: string;

  @Column({
    type: 'enum',
    enum: linkType,
    default: linkType.HAPPY,
  })
  type: linkType;

  @CreateDateColumn({
    type: 'datetime',
    comment: '创建时间',
    default: ''
  })
  createTime: string;

  @UpdateDateColumn({
    type: 'datetime',
    comment: '修改时间',
    default: ''
  })
  updateTime: string;

  @Column({default: null})
  userId: number;

}
```

2、**新增接口**。先查询一次，保证userId是存在的。

```typescript
async addLink(link:Link) {
    let resp = await this.userService.getById(link.userId);
    if (resp) {
        link.userId = resp.id;
        await this.linkRepository.save(link);
        return 'success';
    } else {
        return {
            code: '001',
            message: 'userId不存在',
        };
    }
}
```

3、**软删除接口**。删除标记字段定义`@DeleteDateColumn({nullable: false})`

```typescript
// 软删除会把 @DeleteDateColumn() 定义的列的值改为删除时间（默认是null）。查询时候要判断is Null
async deleteOne(link: Link) {
    await this.linkRepository.softDelete(link.id);
    return 'success';
}
```

4、**修改接口**。

```typescript
async editById(link:Link) {
    let {id, ...data} = link;
    await this.linkRepository.update(id,data);
    return 'success'
}
```

5、**查询接口**。使用query方法直接写sql查询

```typescript
async getByUserId(user: User): Promise<Link[] | undefined> {
    let resp = await this.linkRepository.query(
    `select * from link where userId = ${user.id} and deleteFlag is NULL;`
    );
    return resp;
}
```



#### 拦截器

定位：在方法执行之前/之后绑定额外的逻辑，转换函数返回的结果，接口请求安全处理（ip限频等）

声明方式：拦截器是一个用 `@Injectable()` 装饰器注释的类，并实现 `NestInterceptor` 接口。

1、创建拦截器类。

```typescript
import {CallHandler, ExecutionContext, Injectable, NestInterceptor} from "@nestjs/common";
import {map, Observable} from "rxjs";

export interface Response<T> {
    data: T;
}
// 继承NestInterceptor
@Injectable()
export class FormatterInterceptor <T> implements NestInterceptor<T, Response<T>> {
  	// 实现接口方法，ExecutionContext是请求内容的上下文，next.handle()触发拦截器之后逻辑的方法
    intercept(context: ExecutionContext, next: CallHandler<T>): Observable<Response<T>> | Promise<Observable<Response<T>>> {
        return next.handle().pipe(map((data) => {
            return {
                data: data,
                timestamp: new Date().toISOString(),
                status: 1, // 1正确，0错误
            };
        }));
    }
}
```

2、全局声明使用拦截器

```typescript
// 文件：app.module.ts
@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...
    }),
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // 声明全局
    {
      provide: APP_INTERCEPTOR,
      useClass: FormatterInterceptor,
    }
  ],
})
```

3、intercept方法返回类型是Observable（被观察者），就是`RxJS`，处理请求前或返回流都是使用**RxJS**函数，所以要了解下这个概念。

参考文章：https://zhuanlan.zhihu.com/p/583539989

中文官网：https://cn.rx.js.org/manual/overview.html

4、格式化拦截器效果

[<img src="https://z1.ax1x.com/2023/11/01/piuFNGD.png" alt="piuFNGD.png" style="zoom: 50%;" />](https://imgse.com/i/piuFNGD)



### QA

1、数据库时间格式怎么格式化？

mysql使用DATE_FORMAT函数

```sql
select link.id,link.name,url,clickNumber,isPublic,goodNumber,type,userId,link.createTime,DATE_FORMAT(link.updateTime, '%Y-%m-%d %H:%i:%s') as updateTime , user.phone, user.nickName 
from link left join user on link.userId = user.id 
where link.deleteFlag is NULL and type='技术' 
order by goodNumber 
DESC limit 50
```

2、数据库时间返回有区时差异，怎么处理？

配置dateStrings选型，默认false，执行toISOString()，导致有时区差异。改为true就直接返回时间字符串。

```typescript
TypeOrmModule.forRoot({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'xxx',
  database: 'otaku',
  dateStrings:true,
  entities: [User, Link],
}),
```





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


















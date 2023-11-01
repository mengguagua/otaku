import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
// 使用 SetMetadata 装饰器工厂函数创建自定义装饰器
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

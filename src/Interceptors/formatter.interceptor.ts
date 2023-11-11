import {CallHandler, ExecutionContext, Injectable, NestInterceptor} from "@nestjs/common";
// rxjs中文官网：https://cn.rx.js.org/manual/overview.html
import {map, Observable} from "rxjs";

export interface Response<T> {
    data: T;
}

@Injectable()
export class FormatterInterceptor <T> implements NestInterceptor<T, Response<T>> {
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

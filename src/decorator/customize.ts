import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
//export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);: Đây là một decorator tùy chỉnh có tên là Public. Khi bạn áp dụng decorator này cho một route hoặc endpoint trong NestJS, nó sử dụng SetMetadata để gắn metadata vào route đó. Metadata này có khóa IS_PUBLIC_KEY và giá trị là true, cho biết rằng route đó là public (không cần xác thực).
//decorator này là Public không cần xác thực bới jwt
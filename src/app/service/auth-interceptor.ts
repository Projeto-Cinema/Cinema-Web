import { isPlatformBrowser } from '@angular/common';
import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);

  if (isPlatformBrowser(platformId)) {
    const token = localStorage.getItem('access_token');

    if (token) {
      const cloneReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
      return next(cloneReq);
    }
  }
  
  return next(req)
};

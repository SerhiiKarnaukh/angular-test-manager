import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { API_BASE_URL } from './api-base-url.token';

export const apiBaseUrlInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.startsWith('http://') || req.url.startsWith('https://')) {
    return next(req);
  }

  const baseUrl = inject(API_BASE_URL).replace(/\/$/, '');
  const path = req.url.startsWith('/') ? req.url : `/${req.url}`;

  return next(req.clone({ url: `${baseUrl}${path}` }));
};

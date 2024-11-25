import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class TimeoutMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Configura o timeout para 30 segundos (30.000 milissegundos)
    res.setTimeout(30000, () => {
      res.status(408).send('Request Timeout');
    });
    next();
  }
}
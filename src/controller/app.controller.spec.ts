import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller'; 
import { ShowController } from './show.controller';

import { AppService } from '../service/app.service';
import { ShowService } from 'src/service/show.services';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController ,ShowController],
      providers: [AppService, ShowService],

    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});

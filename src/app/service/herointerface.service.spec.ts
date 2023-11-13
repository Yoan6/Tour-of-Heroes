import { TestBed } from '@angular/core/testing';

import { HerointerfaceService } from './herointerface.service';

describe('HerointerfaceService', () => {
  let service: HerointerfaceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HerointerfaceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

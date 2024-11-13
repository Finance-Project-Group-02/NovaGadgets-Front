/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ProductStorageService } from './product-storage.service';

describe('Service: ProductStorage', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProductStorageService]
    });
  });

  it('should ...', inject([ProductStorageService], (service: ProductStorageService) => {
    expect(service).toBeTruthy();
  }));
});

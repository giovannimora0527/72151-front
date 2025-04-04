import { TestBed } from '@angular/core/testing';
import { LibrosService } from './libros.service';
import { BackendService } from 'src/app/services/backend.service';
import { of } from 'rxjs';

describe('LibrosService', () => {
  let service: LibrosService;
  let backendServiceSpy: jasmine.SpyObj<BackendService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('BackendService', ['get']);

    TestBed.configureTestingModule({
      providers: [
        LibrosService,
        { provide: BackendService, useValue: spy }
      ]
    });

    service = TestBed.inject(LibrosService);
    backendServiceSpy = TestBed.inject(BackendService) as jasmine.SpyObj<BackendService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getLibros and return data', (done) => {
    const mockLibros = [
      { id: 1, titulo: 'Libro 1', autor: 'Autor 1' },
      { id: 2, titulo: 'Libro 2', autor: 'Autor 2' }
    ];

    backendServiceSpy.get.and.returnValue(of(mockLibros));

    service.getLibros().subscribe((data) => {
      expect(data).toEqual(mockLibros);
      expect(backendServiceSpy.get).toHaveBeenCalled();
      done();
    });
  });
});

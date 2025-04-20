import { ComponentFixture, TestBed } from '@angular/core/testing';
<<<<<<< HEAD

=======
>>>>>>> 1b362df161768992ba20c39c95b5c1cb059cbca2
import { LibroComponent } from './libro.component';

describe('LibroComponent', () => {
  let component: LibroComponent;
  let fixture: ComponentFixture<LibroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LibroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LibroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

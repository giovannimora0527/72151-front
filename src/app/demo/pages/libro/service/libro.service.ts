import { Injectable } from '@angular/core';
import { BackendService } from '../../../../services/backend.service';
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root'
})
export class LibroService {
    api = environment.apiUrl;

    constructor(private backendService: BackendService) {
        this.test();
    }

    test() {
      this.backendService.get(this.api, "app", "test").subscribe(
        {
          next: (data) => {
            console.log(data);
          },
          error: (error) => {
            console.log(error);
          },
        }
      )
    }
}

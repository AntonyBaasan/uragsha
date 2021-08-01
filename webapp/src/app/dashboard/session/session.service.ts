import { Injectable } from '@angular/core';
import { BackendService } from 'src/app/services/backend.service';

@Injectable()
export class SessionService {

    constructor(private backendService: BackendService){

    }

}

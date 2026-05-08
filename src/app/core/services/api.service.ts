import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface UploadResponse {
  imageData: string; // base64 data URL
  width: number;
  height: number;
}

export interface GenerateRequest {
  imageData: string; // base64 data URL
  motherName: string;
  style: 'floral' | 'cartoon' | 'luxury' | 'vintage';
}

export interface GenerateResponse {
  generatedImage: string; // base64 data URL
  method: 'gpt-4o' | 'dalle-3' | 'template-fallback';
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  uploadImage(file: File): Observable<UploadResponse> {
    const formData = new FormData();
    formData.append('image', file);

    return this.http
      .post<UploadResponse>(`${this.apiUrl}/upload`, formData)
      .pipe(catchError(this.handleError));
  }

  generateImage(request: GenerateRequest): Observable<GenerateResponse> {
    return this.http
      .post<GenerateResponse>(`${this.apiUrl}/generate`, request)
      .pipe(catchError(this.handleError));
  }

  checkHealth(): Observable<{ status: string; timestamp: string }> {
    return this.http
      .get<{ status: string; timestamp: string }>(`${this.apiUrl}/health`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';

    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = error.error?.message || `Server error: ${error.status}`;
    }

    console.error('API Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}

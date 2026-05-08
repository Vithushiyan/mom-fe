import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ApiService, GenerateRequest } from '../../core/services/api.service';

interface StyleOption {
  label: string;
  value: 'floral' | 'cartoon' | 'luxury' | 'vintage';
  icon: string;
  description: string;
}

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    FileUploadModule,
    ProgressSpinnerModule
  ],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.scss'
})
export class UploadComponent {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  currentYear = new Date().getFullYear();
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  motherName: string = '';
  selectedStyle: StyleOption | null = null;
  isUploading: boolean = false;
  isGenerating: boolean = false;
  errorMessage: string = '';

  styleOptions: StyleOption[] = [
    {
      label: 'Floral Garden',
      value: 'floral',
      icon: '🌸',
      description: 'Elegant roses and soft pastels'
    },
    {
      label: 'Luxury Glam',
      value: 'luxury',
      icon: '✨',
      description: 'Gold accents and elegance'
    },
    {
      label: 'Vintage Classic',
      value: 'vintage',
      icon: '🖼️',
      description: 'Timeless nostalgic charm'
    }
  ];

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.handleFile(input.files[0]);
    }
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();

    if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
      this.handleFile(event.dataTransfer.files[0]);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  private handleFile(file: File) {
    this.errorMessage = '';

    if (!file.type.startsWith('image/')) {
      this.errorMessage = 'Please select an image file';
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      this.errorMessage = 'File size must be less than 10MB';
      return;
    }

    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = (e) => {
      this.imagePreview = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  removeImage() {
    this.selectedFile = null;
    this.imagePreview = null;
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  canGenerate(): boolean {
    return !!this.selectedFile && !!this.motherName.trim() && !!this.selectedStyle;
  }

  async generateMemory() {
    if (!this.canGenerate() || !this.selectedFile || !this.selectedStyle) {
      return;
    }

    this.errorMessage = '';
    this.isUploading = true;

    try {
      const uploadResponse = await this.apiService.uploadImage(this.selectedFile).toPromise();

      if (!uploadResponse) {
        throw new Error('Upload failed');
      }

      this.isUploading = false;
      this.isGenerating = true;

      const generateRequest: GenerateRequest = {
        imageData: uploadResponse.imageData,
        motherName: this.motherName.trim(),
        style: this.selectedStyle.value
      };

      const generateResponse = await this.apiService.generateImage(generateRequest).toPromise();

      if (!generateResponse) {
        throw new Error('Generation failed');
      }

      this.router.navigate(['/result'], {
        state: {
          generatedImage: generateResponse.generatedImage,
          motherName: this.motherName.trim(),
          style: this.selectedStyle.label,
          method: generateResponse.method
        }
      });
    } catch (error) {
      this.errorMessage = (error as Error).message || 'Something went wrong. Please try again.';
      this.isUploading = false;
      this.isGenerating = false;
    }
  }
}

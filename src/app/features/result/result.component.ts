import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ShareService } from '../../core/services/share.service';

interface ResultState {
  generatedImage: string;
  motherName: string;
  style: string;
  method: string;
}

@Component({
  selector: 'app-result',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonModule, ToastModule],
  providers: [MessageService],
  templateUrl: './result.component.html',
  styleUrl: './result.component.scss'
})
export class ResultComponent implements OnInit {
  resultData: ResultState | null = null;
  canNativeShare: boolean = false;
  currentYear = new Date().getFullYear();

  constructor(
    private router: Router,
    private shareService: ShareService,
    private messageService: MessageService
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.resultData = navigation.extras.state as ResultState;
    }
  }

  ngOnInit() {
    if (!this.resultData) {
      const state = history.state;
      if (state && state.generatedImage) {
        this.resultData = state as ResultState;
      } else {
        this.router.navigate(['/']);
      }
    }

    this.canNativeShare = this.shareService.canShare();
  }

  async downloadImage() {
    if (!this.resultData) return;

    try {
      await this.shareService.downloadImage(
        this.resultData.generatedImage,
        `mothers-day-${this.resultData.motherName.toLowerCase().replace(/\s+/g, '-')}.png`
      );
      this.showSuccess('Image downloaded successfully!');
    } catch {
      this.showError('Download failed. Please try again.');
    }
  }

  async shareImage() {
    if (!this.resultData) return;

    const success = await this.shareService.shareImage(
      this.resultData.generatedImage,
      `Happy Mother's Day, ${this.resultData.motherName}!`,
      'Check out this beautiful Mother\'s Day memory I created!'
    );

    if (!success) {
      this.showError('Sharing not supported. Try downloading instead.');
    }
  }

  async shareToWhatsApp() {
    if (!this.resultData) return;

    const message = `Happy Mother's Day, ${this.resultData.motherName}! 💕\n\nI made this special memory for you!`;
    await this.shareService.shareToWhatsApp(this.resultData.generatedImage, message);
  }

  async copyToClipboard() {
    if (!this.resultData) return;

    const success = await this.shareService.copyToClipboard(this.resultData.generatedImage);
    if (success) {
      this.showSuccess('Image copied to clipboard! You can paste it in Instagram.');
    } else {
      this.showError('Could not copy image. Please download instead.');
    }
  }

  private showSuccess(message: string) {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: message,
      life: 3000
    });
  }

  private showError(message: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: message,
      life: 3000
    });
  }
}

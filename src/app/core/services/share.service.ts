import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ShareService {
  canShare(): boolean {
    return 'share' in navigator;
  }

  canShareFiles(): boolean {
    return 'canShare' in navigator && navigator.canShare({ files: [new File([], 'test')] });
  }

  async shareImage(imageUrl: string, title: string, text: string): Promise<boolean> {
    if (!this.canShare()) {
      return false;
    }

    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const file = new File([blob], 'mothers-day-memory.png', { type: 'image/png' });

      if (this.canShareFiles()) {
        await navigator.share({
          title,
          text,
          files: [file]
        });
      } else {
        await navigator.share({
          title,
          text,
          url: imageUrl
        });
      }
      return true;
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.error('Share failed:', error);
      }
      return false;
    }
  }

  async shareToWhatsApp(imageUrl: string, message: string): Promise<void> {
    const encodedMessage = encodeURIComponent(`${message}\n${imageUrl}`);
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
  }

  async copyToClipboard(imageUrl: string): Promise<boolean> {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();

      if ('clipboard' in navigator && 'write' in navigator.clipboard) {
        await navigator.clipboard.write([
          new ClipboardItem({
            [blob.type]: blob
          })
        ]);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Copy to clipboard failed:', error);
      return false;
    }
  }

  async downloadImage(imageUrl: string, filename: string = 'mothers-day-memory.png'): Promise<void> {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      throw error;
    }
  }
}

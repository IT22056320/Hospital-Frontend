declare module 'qr-image' {
    interface QRImageOptions {
      type?: 'png' | 'svg' | 'eps' | 'pdf';
      size?: number;
      margin?: number;
    }
  
    function imageSync(text: string, options?: QRImageOptions): Buffer;
  
    export = {
      imageSync
    };
  }
  
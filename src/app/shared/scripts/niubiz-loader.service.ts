import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ScriptLoaderService {

  loadScript(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      // Si ya existe, no lo vuelve a cargar
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject(`No se pudo cargar el script: ${src}`);
      document.body.appendChild(script);
    });
  }
}
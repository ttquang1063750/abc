export class Utils {
  static fontAvailable: string[] = [];

  static loadResources(urls: string[]): Promise<string[]> {
    return new Promise(async resolve => {
      let i = 0;
      const data: any[] = [];
      const load = async () => {
        const item = await Utils.loadResource(urls[i]);
        data.push(item);
        i++;
        if (i < urls.length) {
          await load();
        } else {
          resolve(data);
        }
      };
      await load();
    });
  }

  static loadResource(src: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const req = new XMLHttpRequest();
      req.open('GET', src, true);
      req.responseType = 'blob';
      req.onload = () => {
        if (req.status === 200) {
          const blob = URL.createObjectURL(req.response);
          resolve(blob);
        }
      };
      req.onprogress = (ev) => {
        const percent = Math.floor(ev.loaded / ev.total);
        console.log(`${src}: [${percent}%]`);
      };
      req.onerror = reject;
      req.send();
    });
  }

  static loadImages(imageUrls: string[]): Promise<HTMLImageElement[]> {
    return new Promise(async resolve => {
      let i = 0;
      const data: HTMLImageElement[] = [];
      const load = async () => {
        const image = await Utils.loadImage(imageUrls[i]);
        data.push(image);
        i++;
        if (i < imageUrls.length) {
          await load();
        } else {
          resolve(data);
        }
      };
      await load();
    });
  }

  static loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = src;
    });
  }

  static getRandomColor() {
    const colors = [
      '#E52D2D',
      '#2D89E5',
      '#71E52D',
      '#AE00FF',
      '#91FF6A',
      '#57BCFF',
      '#FF6C16',
      '#FF2F4D',
      '#636DCD',
      '#8CC1CD',
      '#F917FF',
      '#FA6900',
      '#E0E4CD',
      '#A7DBD7',
      '#aedcb1',
      '#ee4035',
      '#f37736',
      '#fdf498',
      '#7bc043',
      '#0392cf',
      '#96ceb4',
      '#ffeead',
      '#ff6f69',
      '#ffcc5c',
      '#88d8b0',
      '#051937',
      '#004d7a',
      '#008793',
      '#00bf72',
      '#A8EB12'
    ];

    return Utils.getRandomInArray(colors);
  }

  static getRandomInArray(array: any[]) {
    return array[Math.floor(Math.random() * array.length)];
  }

  static getRandomDirection() {
    const directions = [-1, 1];
    return Utils.getRandomInArray(directions);
  }

  static getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  static fetchFont(cb: () => void) {
    const fontCheck = new Set([
      // Windows 10
      'Arial', 'Arial Black', 'Bahnschrift', 'Calibri', 'Cambria', 'Cambria Math', 'Candara', 'Comic Sans MS', 'Consolas', 'Constantia', 'Corbel', 'Courier New', 'Ebrima', 'Franklin Gothic Medium', 'Gabriola', 'Gadugi', 'Georgia', 'HoloLens MDL2 Assets', 'Impact', 'Ink Free', 'Javanese Text', 'Leelawadee UI', 'Lucida Console', 'Lucida Sans Unicode', 'Malgun Gothic', 'Marlett', 'Microsoft Himalaya', 'Microsoft JhengHei', 'Microsoft New Tai Lue', 'Microsoft PhagsPa', 'Microsoft Sans Serif', 'Microsoft Tai Le', 'Microsoft YaHei', 'Microsoft Yi Baiti', 'MingLiU-ExtB', 'Mongolian Baiti', 'MS Gothic', 'MV Boli', 'Myanmar Text', 'Nirmala UI', 'Palatino Linotype', 'Segoe MDL2 Assets', 'Segoe Print', 'Segoe Script', 'Segoe UI', 'Segoe UI Historic', 'Segoe UI Emoji', 'Segoe UI Symbol', 'SimSun', 'Sitka', 'Sylfaen', 'Symbol', 'Tahoma', 'Times New Roman', 'Trebuchet MS', 'Verdana', 'Yu Gothic',
      // macOS
      'American Typewriter', 'Andale Mono', 'Arial', 'Arial Black', 'Arial Narrow', 'Arial Rounded MT Bold', 'Arial Unicode MS', 'Avenir', 'Avenir Next', 'Avenir Next Condensed', 'Baskerville', 'Big Caslon', 'Bradley Hand', 'Brush Script MT', 'Chalkboard', 'Chalkboard SE', 'Chalkduster', 'Charter', 'Cochin', 'Comic Sans MS', 'Copperplate', 'Courier', 'Courier New', 'Didot', 'DIN Alternate', 'DIN Condensed', 'Futura', 'Geneva', 'Georgia', 'Gill Sans', 'Helvetica', 'Helvetica Neue', 'Herculanum', 'Hoefler Text', 'Impact', 'Lucida Grande', 'Luminari', 'Marker Felt', 'Menlo', 'Microsoft Sans Serif', 'Monaco', 'Noteworthy', 'Optima', 'Palatino', 'Papyrus', 'Phosphate', 'Rockwell', 'Savoye LET', 'SignPainter', 'Skia', 'Snell Roundhand', 'Tahoma', 'Times', 'Times New Roman', 'Trattatello', 'Trebuchet MS', 'Verdana', 'Zapfino',
    ].sort());

    (async () => {
      await (document as any).fonts.ready;
      for (const font of fontCheck.values()) {
        if ((document as any).fonts.check(`12px "${font}"`)) {
          Utils.fontAvailable.push(font);
        }
      }
      cb();
    })();
  }

  static getRandomFont(): string {
    return Utils.getRandomInArray(Utils.fontAvailable);
  }

  static createDebounce(timer: number): (fn: () => void) => void {
    let timeoutId: any;
    return (fn: () => void): void => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn(), timer || 100);
    };
  }

  static getContrast(hex = '#FFFFFF', limit = 200): string {
    // If a leading # is provided, remove it
    if (hex.slice(0, 1) === '#') {
      hex = hex.slice(1);
    }

    // If a three-character hexcode, make six-character
    if (hex.length === 3) {
      hex = hex
        .split('')
        .map(h => {
          return h + h;
        })
        .join('');
    }

    // Convert to RGB value
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    // Get YIQ ratio
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;

    // Check contrast
    return yiq >= limit ? 'black' : 'white';
  }

  static setCssVariable(name: string, value: string): void {
    document.documentElement.style.setProperty(`--${name}`, value);
  }
}

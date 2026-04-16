import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { DomSanitizer } from '@angular/platform-browser';
import { icons } from 'lucide';

type IconNode = Array<[string, Record<string, string | number>]>;

type IconRecord = Record<string, IconNode>;

@Component({
  selector: 'app-lucide-icon',
  standalone: true,
  templateUrl: './lucide-icon.component.html',
  styleUrl: './lucide-icon.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LucideIconComponent {
  @Input() name = 'Circle';
  @Input() size = 16;
  @Input() color = 'currentColor';
  @Input() strokeWidth = 2;
  @Input() fill = 'none';
  @Input() className = '';

  constructor(private readonly sanitizer: DomSanitizer) {}

  get svgMarkup(): SafeHtml {
    const iconMap = icons as IconRecord;
    const iconNode = iconMap[this.name] ?? iconMap['Circle'];

    const children = iconNode
      .map(([tag, attrs]) => {
        const attrString = Object.entries(attrs)
          .map(([key, value]) => `${key}="${String(value)}"`)
          .join(' ');

        return `<${tag} ${attrString}></${tag}>`;
      })
      .join('');

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${this.size}" height="${this.size}" viewBox="0 0 24 24" fill="${this.fill}" stroke="${this.color}" stroke-width="${this.strokeWidth}" stroke-linecap="round" stroke-linejoin="round">${children}</svg>`;

    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }
}

import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  Optional,
  Renderer2,
  NgZone,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import {
  Platform,
  toBoolean,
  LyTheme2,
  LyCommon
} from '@alyle/ui';
import { Ripple, LyRippleService } from '@alyle/ui/ripple';
import { styles } from './button.style';
const DEFAULT_SIZE = 'medium';
const DEFAULT_DISABLE_RIPPLE = false;
const STYLE_PRIORITY = -2;

interface Size {
  small: any;
  medium: any;
  large: any;
}

const Size = {
  small: theme => ({
    padding: '0 8px',
    fontSize: theme.pxToRem(theme.typography.button.fontSize - 1),
    minHeight: '32px',
    minWidth: '64px'
  }),
  medium: ({
    padding: '0 14px',
    minHeight: '36px',
    minWidth: '88px'
  }),
  large: (theme) => ({
    padding: '0 21px',
    fontSize: theme.pxToRem(theme.typography.button.fontSize + 1),
    minHeight: '40px',
    minWidth: '112px'
  })
};

@Component({
  selector: '[ly-button]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <span [className]="classes.content">
    <ng-content></ng-content>
  </span>
  <div #rippleContainer [className]="_rippleService.classes.container"></div>
  `,
  encapsulation: ViewEncapsulation.None
})
export class LyButton implements OnInit, AfterViewInit, OnDestroy {
  /**
   * Style
   * @ignore
   */
  classes = this._theme.addStyleSheet(styles, 'lyButton', STYLE_PRIORITY);
  private _rippleSensitive = false;
  private _ripple: Ripple;
  private _size: keyof Size;
  private _sizeClass: string;
  private _disableRipple: boolean = null;
  /** @ignore */
  @ViewChild('rippleContainer') _rippleContainer: ElementRef;

  /** @ignore */
  @Input('sensitive')
  get rippleSensitive(): boolean {
    return this._rippleSensitive;
  }
  set rippleSensitive(value: boolean) {
    this._rippleSensitive = toBoolean(value);
  }

  /** Whether ripples are disabled. */
  @Input()
  set disableRipple(val: boolean) {
    if (Platform.isBrowser && val !== this._disableRipple) {
      const newVal = this._disableRipple = toBoolean(val);
      // remove previous ripple if exist
      this.ngOnDestroy();
      if (!newVal) {
        // add ripple
        const rippleContainer = this._rippleContainer.nativeElement;
        const triggerElement = this._elementRef.nativeElement;
        this._ripple = new Ripple(this._theme.config, this._ngZone, this._rippleService.classes, rippleContainer, triggerElement);
      }
    }
  }
  get disableRipple() {
    return this._disableRipple;
  }

  @Input()
  get size(): keyof Size {
    return this._size;
  }
  set size(val: keyof Size) {
    if (val !== this.size) {
      this._size = val;
      this._sizeClass = this._theme.addStyle(
        `lyButton-size:${this.size}`,
        Size[this.size as any],
        this._elementRef.nativeElement,
        this._sizeClass,
        STYLE_PRIORITY
      );
    }
  }

  constructor(
    private _elementRef: ElementRef,
    private _renderer: Renderer2,
    private _theme: LyTheme2,
    private _ngZone: NgZone,
    /** @ignore */
    public _rippleService: LyRippleService,
    @Optional() bgAndColor: LyCommon
  ) {
    if (bgAndColor) {
      bgAndColor.setAutoContrast();
    }
  }

  ngOnInit() {
    this._renderer.addClass(this._elementRef.nativeElement, this.classes.root);
    if (!this.size) {
      this.size = DEFAULT_SIZE;
    }
  }

  ngAfterViewInit() {
    if (this.disableRipple === null) {
      this.disableRipple = DEFAULT_DISABLE_RIPPLE;
    }
  }

  public focus() {
    this._elementRef.nativeElement.focus();
  }

  ngOnDestroy() {
    if (Platform.isBrowser) {
      if (this._ripple) {
        this._ripple.removeEvents();
        this._ripple = null;
      }
    }
  }

}

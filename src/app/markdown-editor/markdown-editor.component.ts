import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  forwardRef,
  HostBinding,
  Input,
  OnDestroy,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  FormsModule,
  NgControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import '@github/markdown-toolbar-element';
import { Subject } from 'rxjs';

@Component({
  standalone: true,
  selector: 'markdown-editor',
  templateUrl: './markdown-editor.component.html',
  styleUrls: ['./markdown-editor.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MarkdownEditorComponent),
      multi: true,
    },
    { provide: MatFormFieldControl, useExisting: MarkdownEditorComponent },
  ],
  host: {
    '[id]': 'id',
    '[attr.aria-describedby]': 'describedBy',
  },
  imports: [FormsModule, ReactiveFormsModule, FontAwesomeModule],
})
export class MarkdownEditorComponent
  implements OnDestroy, ControlValueAccessor, MatFormFieldControl<string>
{
  form: FormGroup;

  constructor(
    formBuilder: FormBuilder,
    private focusMonitor: FocusMonitor,
    private element: ElementRef
  ) {
    this.form = formBuilder.group({ markdown: '' });
    focusMonitor.monitor(element.nativeElement, true).subscribe((origin) => {
      this.focused = !!origin;
      this.onPropagateChanges();
    });
  }

  ngOnDestroy() {
    this.stateChanges.complete();
    this.focusMonitor.stopMonitoring(this.element.nativeElement);
  }

  @Input()
  get value(): string | null {
    return this.form.value.markdown;
  }
  set value(text: string | null) {
    text = text || '';
    this.form.setValue({ markdown: text });
    this.onPropagateChanges();
  }

  onChange: any = () => {};
  onTouch: any = () => {};

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  writeValue(text: string): void {
    this.value = text;
  }

  stateChanges = new Subject<void>();

  static selector = 'markdown-editor';
  static nextId = 0;

  @HostBinding() id = `${
    MarkdownEditorComponent.selector
  }-${MarkdownEditorComponent.nextId++}`;

  @Input()
  get placeholder() {
    return this._placeholder;
  }
  set placeholder(plh) {
    this._placeholder = plh;
    this.onPropagateChanges();
  }
  private _placeholder: string = '';

  ngControl: NgControl | null = null;

  focused = false;

  get empty() {
    let n = this.form.value;
    return !n.area && !n.exchange && !n.subscriber;
  }

  @HostBinding('class.floating')
  get shouldLabelFloat() {
    return this.focused || !this.empty;
  }

  @Input()
  get required() {
    return this._required;
  }
  set required(req) {
    this._required = coerceBooleanProperty(req);
    this.onPropagateChanges();
  }
  private _required = false;

  @Input()
  get disabled() {
    return this._disabled;
  }
  set disabled(dis) {
    this._disabled = coerceBooleanProperty(dis);
  }
  private _disabled = false;

  errorState = false;

  controlType = MarkdownEditorComponent.selector;

  @HostBinding('attr.aria-describedby') describedBy = '';
  setDescribedByIds(ids: string[]) {
    this.describedBy = ids.join(' ');
  }

  onContainerClick(event: MouseEvent): void {
    if ((event.target as Element).tagName.toLowerCase() != 'textarea') {
      this.element.nativeElement.querySelector('textarea').focus();
    }
  }

  propagateChanges(event: Event): void {
    this.onPropagateChanges();
  }

  onPropagateChanges(): void {
    this.onChange(this.value);
    this.stateChanges.next();
  }
}

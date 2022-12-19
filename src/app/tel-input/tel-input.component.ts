import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  forwardRef,
  HostBinding,
  Input,
  OnInit,
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
import { FocusMonitor } from '@angular/cdk/a11y';
import { MatFormFieldControl } from '@angular/material/form-field';
import { Subject } from 'rxjs';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import '@github/markdown-toolbar-element';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import * as EasyMDE from 'easymde';

export class MyTel {
  constructor(public area: string) {}

  toString(): string {
    return this.area;
  }
}

// https://dev.to/trungk18/build-a-markdown-editor-with-angular-14m0

@Component({
  standalone: true,
  selector: 'my-tel-input',
  templateUrl: './tel-input.component.html',
  styleUrls: ['./tel-input.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MyTelInput),
      multi: true,
    },
    { provide: MatFormFieldControl, useExisting: MyTelInput },
  ],
  host: {
    '[id]': 'id',
    '[attr.aria-describedby]': 'describedBy',
  },
  imports: [FormsModule, ReactiveFormsModule, FontAwesomeModule],
})
export class MyTelInput
  implements OnInit, ControlValueAccessor, MatFormFieldControl<MyTel>
{
  parts: FormGroup;

  @Input()
  get value(): MyTel | null {
    let n = this.parts.value;
    return new MyTel(n.area);
  }
  set value(tel: MyTel | null) {
    tel = tel || new MyTel('');
    this.parts.setValue({
      area: tel.area,
    });
    this.onPropagateChanges();
  }

  constructor(
    fb: FormBuilder,
    private fm: FocusMonitor,
    private element: ElementRef
  ) {
    this.parts = fb.group({
      area: '',
    });
    fm.monitor(element.nativeElement, true).subscribe((origin) => {
      this.focused = !!origin;
      this.onPropagateChanges();
    });
  }

  onChange: any = () => {};
  onTouch: any = () => {};
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
  writeValue(obj: MyTel): void {
    this.value = obj;
  }

  stateChanges = new Subject<void>();

  static nextId = 0;

  @HostBinding() id = `my-tel-input-${MyTelInput.nextId++}`;
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
    let n = this.parts.value;
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
  controlType = 'my-tel-input';
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

  ngOnInit(): void {
    //const easyMDE = new EasyMDE({
    //  element: document.getElementById('textarea_id') ?? undefined,
    //});
  }

  ngOnDestroy() {
    this.stateChanges.complete();
    this.fm.stopMonitoring(this.element.nativeElement);
  }
}

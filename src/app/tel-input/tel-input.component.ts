import {
  Component,
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

export class MyTel {
  constructor(
    public area: string,
    public exchange: string,
    public subscriber: string
  ) {}

  toString(): string {
    return `(${this.area}) ${this.exchange}-${this.subscriber}`;
  }
}

@Component({
  standalone: true,
  selector: 'my-tel-input',
  templateUrl: './tel-input.component.html',
  styleUrls: ['./tel-input.component.scss'],
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
  imports: [FormsModule, ReactiveFormsModule],
})
export class MyTelInput
  implements OnInit, ControlValueAccessor, MatFormFieldControl<MyTel>
{
  parts: FormGroup;

  @Input()
  get value(): MyTel | null {
    let n = this.parts.value;
    if (
      n.area.length == 3 &&
      n.exchange.length == 3 &&
      n.subscriber.length == 4
    ) {
      return new MyTel(n.area, n.exchange, n.subscriber);
    }
    return null;
  }
  set value(tel: MyTel | null) {
    tel = tel || new MyTel('', '', '');
    this.parts.setValue({
      area: tel.area,
      exchange: tel.exchange,
      subscriber: tel.subscriber,
    });
    this.onPropagateChanges();
  }

  constructor(
    fb: FormBuilder,
    private fm: FocusMonitor,
    private elRef: ElementRef
  ) {
    this.parts = fb.group({
      area: '',
      exchange: '',
      subscriber: '',
    });
    fm.monitor(elRef.nativeElement, true).subscribe((origin) => {
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

  ngOnInit(): void {}

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
    if ((event.target as Element).tagName.toLowerCase() != 'input') {
      this.elRef.nativeElement.querySelector('input').focus();
    }
  }

  propagateChanges(event: Event): void {
    this.onPropagateChanges();
  }
  onPropagateChanges(): void{
    this.onChange(this.value);
    this.stateChanges.next();
  }

  ngOnDestroy() {
    this.stateChanges.complete();
    this.fm.stopMonitoring(this.elRef.nativeElement);
  }
}

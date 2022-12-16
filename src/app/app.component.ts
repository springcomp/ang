import { Component, VERSION } from '@angular/core';
import {FormControl, FormBuilder, FormsModule, ReactiveFormsModule, Validators, FormGroup} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CustomInputComponent } from './custom-input/custom-input.component';
import { MyTel, MyTelInput } from './tel-input/tel-input.component';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ],
  imports: [
    CustomInputComponent,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MyTelInput,
  ]
})
export class AppComponent  {
  inputOne = 'initial input one';
  inputTwo = new FormControl<string>('initial input two');

  form : FormGroup<FormData>;

  constructor(private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group<FormData>({
      myFormControl: new FormControl('initial input three', { validators: Validators.required, nonNullable: true }),
      myPhone: new FormControl(new MyTel('001', '333', '4444')),
    });
  }

  public getValue(event: UIEvent): void {
    const phone = this.form.value.myPhone?.toString();
    console.log(phone);
  }
}

export class FormData{
  myFormControl!: FormControl<string | null>;
  myPhone!: FormControl<MyTel | null>;
}
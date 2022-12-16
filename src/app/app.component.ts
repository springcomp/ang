import { Component, VERSION } from '@angular/core';
import {FormControl, FormBuilder, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CustomInputComponent } from './custom-input/custom-input.component';
import { MyTelInput } from './tel-input/tel-input.component';

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
  inputTwo = new FormControl('initial input two');

  form;

  constructor(private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      myFormControl: 'initial input three'
    });
  }
}


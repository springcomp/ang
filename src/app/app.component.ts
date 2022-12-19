import { Component, VERSION } from '@angular/core';
import {FormControl, FormBuilder, FormsModule, ReactiveFormsModule, Validators, FormGroup} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  FaIconLibrary,
  FontAwesomeModule,
} from '@fortawesome/angular-fontawesome';

import { fas } from '@fortawesome/free-solid-svg-icons';
import { MarkdownModule, MarkdownService } from 'ngx-markdown';
import { CustomInputComponent } from './custom-input/custom-input.component';
import { MyTel, MyTelInput } from './tel-input/tel-input.component';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ],
  providers: [MarkdownService],
  imports: [
    CustomInputComponent,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MyTelInput,
    MarkdownModule,
  ]
})
export class AppComponent  {
  form : FormGroup<FormData>;

  constructor(
    private formBuilder: FormBuilder,
    private markdownService: MarkdownService,
    library: FaIconLibrary
    ) {
    library.addIconPacks(fas);
    this.form = this.formBuilder.group<FormData>({
      myFormControl: new FormControl('initial input three', { validators: Validators.required, nonNullable: true }),
      phone: new FormControl(new MyTel('# Overview\nThis is a simple **bold** text.')),
    });

  }

  public getValue(event: UIEvent): void {
    const phone = this.form.value.phone?.toString();
    console.log(phone);
  }

  public renderMarkdown(): string {
    console.log(this.markdownService.options);
    const text = this.form.get('phone')?.value?.toString() ?? '';
    const html = this.markdownService.parse(text);
    return html;
  }
}

export class FormData{
  myFormControl!: FormControl<string | null>;
  phone!: FormControl<MyTel | null>;
}
import { Component, VERSION } from '@angular/core';
import { FormControl, FormBuilder, FormsModule, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  FaIconLibrary,
  FontAwesomeModule,
} from '@fortawesome/angular-fontawesome';

import { fas } from '@fortawesome/free-solid-svg-icons';
import { MarkdownModule, MarkdownService } from 'ngx-markdown';
import { CustomInputComponent } from './custom-input/custom-input.component';
import { MarkdownEditorComponent } from './markdown-editor/markdown-editor.component';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [MarkdownService],
  imports: [
    CustomInputComponent,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MarkdownEditorComponent,
    MatInputModule,
    MarkdownModule,
  ]
})
export class AppComponent {
  form: FormGroup<FormData>;

  constructor(
    private formBuilder: FormBuilder,
    private markdownService: MarkdownService,
    library: FaIconLibrary
  ) {
    library.addIconPacks(fas);
    this.form = this.formBuilder.group<FormData>({
      myFormControl: new FormControl('initial input three', { validators: Validators.required, nonNullable: true }),
      markdown: new FormControl('# Overview\nThis is a simple **bold** text.'),
      one: new FormControl(''),
      two: new FormControl('')
    });

  }

  public getValue(event: UIEvent): void {
    const phone = this.form.value.markdown?.toString();
    console.log(phone);
  }

  public renderMarkdown(): string {
    // console.log(this.markdownService.options);
    const text = this.form.value.markdown?.toString() ?? '';
    const html = this.markdownService.parse(text);
    return html;
  }
}

export class FormData {
  myFormControl!: FormControl<string | null>;
  markdown!: FormControl<string | null>;
  one!: FormControl<string | null>;
  two!: FormControl<string | null>;
}
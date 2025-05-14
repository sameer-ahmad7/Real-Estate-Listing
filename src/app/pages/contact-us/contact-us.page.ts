import { Component, input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonInput, IonTextarea, IonText, IonGrid, IonCol, IonRow, IonButton, IonSpinner } from '@ionic/angular/standalone';
import { ContactService } from 'src/app/services/contact.service';
import { addIcons } from 'ionicons';
import { chevronBack } from 'ionicons/icons';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.page.html',
  styleUrls: ['./contact-us.page.scss'],
  standalone: true,
  imports: [IonSpinner, IonButton, IonRow, IonCol, IonGrid, IonText, IonBackButton, IonButtons, IonContent, IonHeader, IonTitle,
    FormsModule, ReactiveFormsModule, IonInput, IonTextarea,TranslateModule,
    IonToolbar, CommonModule, FormsModule]
})
export class ContactUsPage implements OnInit {

  isChildComponent = input<boolean>();
  submitted = false;
  isSubmitting = false;
  isSuccess = false;
  contactForm = new FormGroup({
    name: new FormControl('', [Validators.required, this.noWhitespaceValidator()]),
    phone: new FormControl('', [Validators.required,  this.noWhitespaceValidator(), Validators.pattern(/^[0-9#+*]+$/)]),
    email: new FormControl('', [Validators.required, Validators.email, this.noWhitespaceValidator()]),
    subject: new FormControl('', [Validators.required, this.noWhitespaceValidator()]),
    message: new FormControl('', [Validators.required, this.noWhitespaceValidator()])
  })

  noWhitespaceValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value || '';
      if (value.trim().length === 0) {
        return { whitespace: true };
      }
      return null;
    };
  }


  constructor(private contactService: ContactService) {
    addIcons({ chevronBack });
  }

  ngOnInit() {
  }

  onSubmit() {
    this.isSubmitting = true;
    const name = this.contactForm.value.name as string;
    const email = this.contactForm.value.email as string;
    const phone = this.contactForm.value.phone as string;
    const subject = this.contactForm.value.subject as string;
    const message = this.contactForm.value.message as string;
    const formData = new FormData();
    formData.append('name-A', name);
    formData.append('tel-364', phone);
    formData.append('your-email', email);
    formData.append('your-subject', subject);
    formData.append('your-message', message);
    formData.append('_wpcf7_unit_tag', 'wpcf7-f15483-p1-o1'); // guessed based on form ID

    this.contactService.submitForm(formData).subscribe(_ => {
      this.isSubmitting = false;
      this.isSuccess = true;
      this.submitted = true;
      this.contactForm.reset();
    }, err => {
      this.isSubmitting = false;
      this.isSuccess = false;
      this.submitted = true;
    });

  }

}

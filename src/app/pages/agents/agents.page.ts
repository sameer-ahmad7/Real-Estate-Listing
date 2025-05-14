import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
	IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, PopoverController,
	IonGrid, IonCol, IonRow, IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBack } from 'ionicons/icons';
import { AgentInfo } from 'src/app/model/agent-model';
import { AgentService } from 'src/app/services/agent.service';
import { RouterLink } from '@angular/router';
import { CustomSpinnerPage } from "../custom-spinner/custom-spinner.page";
import { TranslateModule } from '@ngx-translate/core';
import { PhoneContactComponent } from "../../shared/phone-contact/phone-contact.component";

@Component({
	selector: 'app-agents',
	templateUrl: './agents.page.html',
	styleUrls: ['./agents.page.scss'],
	standalone: true,
	imports: [IonIcon, IonRow, IonCol, IonGrid, RouterLink, IonBackButton, TranslateModule,
		IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, CustomSpinnerPage]
})
export class AgentsPage implements OnInit {

	isLoading = true;
	agents: AgentInfo[] = [];

	constructor(private agentService: AgentService, private popoverCtrl: PopoverController) {
		addIcons({ chevronBack });
	}

	ngOnInit() {
		this.agentService.getMakeelars().subscribe(agents => {
			this.agents = agents;
			this.isLoading = false;
			const defaultAgent = this.agents.find(a => a.email.includes('info@''.com'));
			let newAgents = this.agents.filter(a => !a.email.includes('info@''.com'));
			newAgents.sort((a, b) => a.title.localeCompare(b.title));
			if (defaultAgent) {
				this.agents = [...newAgents, defaultAgent];
			} else {
				this.agents = [...newAgents];
			}
		})
	}

	openEmail(email: string) {
		window.location.href = `mailto:${email}`;
	}

	async openPhoneNumber(phone: string, event: any) {
		const popover = await this.popoverCtrl.create({
			component: PhoneContactComponent,
			componentProps: {
				phone: phone
			},
			event: event,
			backdropDismiss: true,
			dismissOnSelect: true,
			reference: 'trigger'
		});
		await popover.present();
	}


}

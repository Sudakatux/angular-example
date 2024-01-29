import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConductorService } from '../services/conductor.service';
import {
  angularMaterialRenderers,
  JsonFormsAngularMaterialModule,
} from '../library';
import { JsonFormsModule } from '@jsonforms/angular';
import { UISchemaElement } from '@jsonforms/core';
import { isPlatformBrowser } from '@angular/common';
import _omit from 'lodash/omit';
import { HumanTaskEntry } from '@io-orkes/conductor-javascript';
import { MatGridListModule } from '@angular/material/grid-list';

@Component({
  selector: 'app-packet',
  standalone: true,
  imports: [JsonFormsModule, JsonFormsAngularMaterialModule, MatGridListModule],
  templateUrl: './packet.component.html',
  styleUrl: './packet.component.css',
})
export class PacketComponent implements OnInit {
  renderers = [...angularMaterialRenderers];
  uischema?: UISchemaElement;
  schema = {};
  data = {};
  task?: HumanTaskEntry;
  isBrowser: boolean;
  executionId?: string;
  hasTaskToComplete = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private conductor: ConductorService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.executionId = params['executionId'];
      this.conductor
        .getFirstTaskByPacket(this.executionId!)
        .then((maybeTask) => {
          // console.log('maybeTask', maybeTask);
          if (maybeTask) {
            this.hasTaskToComplete = true;
            //@ts-ignore
            this.uischema = maybeTask.template.templateUI;
            this.schema = _omit(maybeTask.template.jsonSchema, '$schema');
            this.task = maybeTask.task;
          } else {
            this.hasTaskToComplete = false;
          }
        });
    });
    //  throw new Error('Method not implemented.');
  }
  next() {
    this.conductor.completeTask(this.task!, this.data).then((_) => {
      this.ngOnInit();
    });
  }

  back() {
    const { workflowId } = this.task!;
    this.conductor.goBack(workflowId).then((_) => {
      this.ngOnInit();
    });
  }
}

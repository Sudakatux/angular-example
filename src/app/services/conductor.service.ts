import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import {
  orkesConductorClient,
  HumanTaskEntry,
  HumanExecutor,
  WorkflowExecutor,
  ConductorClient,
  HumanTaskDefinition,
} from '@io-orkes/conductor-javascript';
import { findTasks, findTaskAndClaim } from './helpers';

@Injectable({
  providedIn: 'root',
})
export class ConductorService {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}
  clientPromise?: Promise<ConductorClient>;

  //   if (isPlatformServer(this.platformId)) {
  //   }
  // }

  generatePromise(): Promise<ConductorClient> {
    if (this.clientPromise) return this.clientPromise;
    this.clientPromise = orkesConductorClient({
      keyId: 'asd',
      keySecret: 'asd',
      serverUrl: 'asd',
    });
    return this.clientPromise;
    // Server specific logic here
  }

  async pullHumanTaskEntries() {
    return findTasks(new HumanExecutor(await this.generatePromise()), 'jimmy');
  }

  async startAPacket(userId: string) {
    const client = await this.generatePromise();
    const executionId = await new WorkflowExecutor(client).startWorkflow({
      name: 'consent_test',
      version: 1,
      input: {
        userId,
      },
      correlationId: 'AngularTest',
    });
    return executionId;
  }

  async getWorkflowStatus(executionId: string) {
    const client = await this.generatePromise();
    return await client.workflowResource.getExecutionStatus(executionId);
  }

  async getTaskTemplate(humanTask?: HumanTaskDefinition) {
    if (humanTask?.userFormTemplate) {
      const client = await this.generatePromise();
      const template = await client.humanTask.getTemplateByNameAndVersion(
        humanTask.userFormTemplate?.name!,
        humanTask.userFormTemplate?.version!
      );
      return template;
    }
    return undefined;
  }

  async getFirstTaskByPacket(executionId: string) {
    const client = await this.generatePromise();
    const maybeWorkflowStatus = await this.getWorkflowStatus(executionId);
    const maybeUserId = maybeWorkflowStatus?.input?.['userId'];
    if (maybeUserId) {
      const maybeTask = await findTaskAndClaim(
        new HumanExecutor(client),
        maybeUserId,
        executionId
      );
      const template = await this.getTaskTemplate(maybeTask?.humanTaskDef);
      if (template) {
        return {
          task: maybeTask,
          userId: maybeUserId,
          template,
        };
      }
    }
    return undefined;
  }

  async completeTask(task: HumanTaskEntry, data: any) {
    const client = await this.generatePromise();
    const executor = new HumanExecutor(client);
    return executor.completeTask(task.taskId, data);
  }

  async goBack(workflowId: string) {
    const client = await this.generatePromise();
    const wfExecutor = new WorkflowExecutor(client);
    await wfExecutor.goBackToFirstTaskMatchingType(workflowId, 'HUMAN');
  }
}

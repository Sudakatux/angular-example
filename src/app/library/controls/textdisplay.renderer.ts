import { ChangeDetectionStrategy, Component } from '@angular/core';
import { JsonFormsAngularService, JsonFormsControl } from '@jsonforms/angular';
import {
  RankedTester,
  rankWith,
  and,
  optionIs,
  StatePropsOfControl,
  isMultiLineControl,
} from '@jsonforms/core';

@Component({
  selector: 'TextControlRenderer',
  template: `@if(paragraph){
    <p [ngStyle]="{ 'text-align': align ? align : 'left', width: '100%' }">
      {{ dataOrLabel() }}
    </p>
    } @else {
    <div [ngStyle]="{ 'text-align': align ? align : 'left', width: '100%' }">
      {{ dataOrLabel() }}
    </div>
    } `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: row;
      }
      mat-form-field {
        flex: 1 1 auto;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextDisplayControlRenderer extends JsonFormsControl {
  align?: 'left' | 'center' | 'right' | 'justify' | 'inherit' = undefined;
  paragraph = false;
  noWrap = false;
  constructor(jsonformsService: JsonFormsAngularService) {
    super(jsonformsService);
  }
  getStyles = () => {
    if (this.align) {
      return 'text-align:' + this.align;
    }
    return '';
  };
  dataOrLabel = () => this.data || this.label;
  getEventValue = (event: any) => event.target.value || undefined;
  override mapAdditionalProps(props: StatePropsOfControl): void {
    this.align = props.uischema.options['align']; //this.form.get('align')?.value;
    this.paragraph = props.uischema.options['paragraph']; //this.form.get('paragraph')?.value;
    this.noWrap = props.uischema.options['noWrap']; //this.form.get('noWrap')?.value;
  }
}
export const TextDisplayRendererTester: RankedTester = rankWith(
  3, //increase rank as needed
  and(
    isMultiLineControl,
    optionIs('readonly', true),
    optionIs('display', 'description-text')
  )
);

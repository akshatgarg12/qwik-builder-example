import { component$} from '@builder.io/qwik';
import {  RegisteredComponent } from '@builder.io/sdk-qwik';
import { Counter } from '~/integrations/react/mui';

export const apiKey = '8335d18816304315aebeb7e9532281ce'; // Enter your key here

export const MyFunComponent = component$(() => {
  return (
    <div>
      <Counter client:visible />
      {/* <TableApp client:load /> */}
    </div>
  );
});

export const CUSTOM_COMPONENTS: RegisteredComponent[] = [
  {
    component: MyFunComponent,
    name: 'MyFunComponent',
    builtIn: true,
    inputs: []
  },
];
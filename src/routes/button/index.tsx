import {
    component$,
    useSignal,
    useStore,
    useVisibleTask$,
  } from '@builder.io/qwik';
  import type { DocumentHead } from '@builder.io/qwik-city';
  import Button from '../../components/button';
  
  interface Person {
    name: string;
  }
  
  export async function query(count: number): Promise<{ people: Person[] }> {
    const people = [{ name: 'John' }, { name: 'Jill' }, { name: 'Jake' }];
    return new Promise((res) => {
      setTimeout(() => {
        res({ people: people.slice(0, count) });
      }, 2000);
    });
  }
  
  export default component$(() => {
    const loading = useSignal(true);
    const data = useStore<{ people: Person[] }>({ people: [] });
    const variables = useStore({ count: 1 });
  
    useVisibleTask$(({ cleanup, track }) => {
      const abortCtrl = new AbortController();
      cleanup(() => abortCtrl.abort());
      track(variables);
  
      query(variables.count).then((response) => {
        data.people = response.people;
        loading.value = false;
      });
    });
  
    return (
      <>
        <p>
          Problem: Custom button component does not change Slot contents from
          Signal change. Native button works as expected
        </p>
        <div>
          <p>Loading: {loading.value ? 'yes' : 'no'}</p>
          <div>
            {data.people.map((person) => {
              return <div>- {person.name}</div>;
            })}
          </div>
        </div>
  
        <h2>Native Button</h2>
        <button
          onClick$={() => {
            loading.value = true;
            variables.count = variables.count + 1;
          }}
        >
          {loading.value ? 'Loading...' : 'Load more'}
        </button>
        <h2>Button Component</h2>
        <Button
          loading={loading.value}
          onClick$={() => {
            loading.value = true;
            variables.count = variables.count + 1;
          }}
        >
          <>{loading.value ? 'Loading...' : 'Load more'}</>
        </Button>
      </>
    );
  });
  
  export const head: DocumentHead = {
    title: 'Welcome to Qwik',
    meta: [
      {
        name: 'description',
        content: 'Qwik site description',
      },
    ],
  };
  
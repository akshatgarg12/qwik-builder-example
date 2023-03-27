/* eslint-disable qwik/valid-lexical-scope */
import {
  $,
  component$,
  createContextId,
  useContext,
  useContextProvider,
  useStore,
} from '@builder.io/qwik';

type State = any
type Context = {
  state: State;
  // setState: any;
};
export const builderContext = createContextId<Context>('Builder');

export const setState = (state:State,newState: State) => {
  state.state = newState
}

export const Button = component$(() => {
  const context = useContext(builderContext);
  // return (
  //   <button onClick$={() => context.setState({ foo: context.state.foo + 1 })}>
  //     increment foo. Current: {context.state.foo}
  //   </button>
  // );
  return (
    <button onClick$={() => setState(context, { foo: context.state.foo + 1 })}>
      increment foo. Current: {context.state.foo}
    </button>
  );
});

export const AnotherChild = component$(() => {
  const context = useContext(builderContext);
  return <div>another child: {context.state.foo}</div>;
});

export default component$(() => {
  const state = useStore({
    state1: { foo: 123 },
    state2: { foo: 123 },
    state3: { foo: 123 },
    state4: { foo: 123 },
  });

  useContextProvider(
    builderContext,
    state
    // {
    //   state: state.contentState, //
    //   setState: $((newState: State) => {
    //     console.log('setState', newState, state.contentState)
    //     state.contentState = newState //nnew object;
    //     console.log('setState', newState, state.contentState);
    //   }),
    // }
  );

  return (
    <div>
      <div>Parent foo: {state.state.foo}</div>
      <Button />
      <AnotherChild />
    </div>
  );
});
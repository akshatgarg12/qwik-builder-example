import { $, component$, useStore } from '@builder.io/qwik';

export default component$(() => {
  const state = useStore<any>({
    title : 'title of the page',
    count : 0
  })
  const incrementCount = $(() => state.count += 1)
  const decrementCount = $(() => state.count -= 1)
  const changeTitle = $((e:any) => state.title = e.target.value)
  return (
    <div>
      <p>Hello Qwik title : {state.title}</p>
      <input type="text" onInput$={changeTitle}/>
      <h4>{state.count}</h4>
      <button onClick$={incrementCount}>+</button>
      <button onClick$={decrementCount}>-</button>
    </div>
  );
});

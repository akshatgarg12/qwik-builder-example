import { QRL } from '@builder.io/qwik';
import { component$, Slot } from '@builder.io/qwik';

export default component$(
  ({
    onClick$,
    loading = false,
  }: {
    onClick$?: QRL<() => void>;
    loading?: boolean;
  }) => {
    return (
      <>
        {/* eslint-disable-next-line qwik/valid-lexical-scope */}
        <button disabled={loading} onClick$={onClick$} class="btn">
           <Slot />
        </button>
      </>
    );
  }
);

import { Fragment, component$, h } from "@builder.io/qwik";

interface Props {
  styles: string;
  id?: string;
}
export const RenderInlinedStyles = component$((props: Props) => {
  return <style dangerouslySetInnerHTML={props.styles} id={props.id}></style>;
});

export default RenderInlinedStyles;

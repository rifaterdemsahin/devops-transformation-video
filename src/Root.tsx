import {Composition} from 'remotion';
import {Short, TOTAL} from './Short';

export const Root = () => (
  <Composition id="Short" component={Short} durationInFrames={TOTAL} fps={30} width={1080} height={1920} />
);

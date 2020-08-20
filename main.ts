import { Drawing } from './drawing';

interface ISettings {
  tps: number;
}

const Settings: ISettings = {
  tps: 20,
};

const Draw = new Drawing(document.getElementById('c') as HTMLCanvasElement);

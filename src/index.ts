import './index.css';
import { WatchController } from './watch-controller';
import { WatchModel } from './watch-model';
import { WatchView } from './watch-view';



const watchView : WatchView = new WatchView();
const watchModel : WatchModel = new WatchModel();
const watchController : WatchController = new WatchController(watchModel, watchView);